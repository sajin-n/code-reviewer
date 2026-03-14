const Submission = require("../models/Submission");
const User = require("../models/User");
const {
  fullReview,
  getHints,
  analyzeComplexity,
  generateTests,
  streamReview,
} = require("../services/groqService");

const ALLOWED_LANGUAGES = [
  "javascript", "python", "java", "cpp", "c", "typescript", "go", "rust",
];

function validateInput(code, language) {
  if (!code || typeof code !== "string" || code.trim().length === 0) {
    return "Code is required";
  }
  if (code.length > 50000) {
    return "Code exceeds maximum length (50 000 characters)";
  }
  if (!language || !ALLOWED_LANGUAGES.includes(language)) {
    return `Language must be one of: ${ALLOWED_LANGUAGES.join(", ")}`;
  }
  return null;
}

// ─── Full Review (non-streaming) ─────────────────────────────

exports.review = async (req, res, next) => {
  try {
    const { code, language, problemName } = req.body;
    const error = validateInput(code, language);
    if (error) return res.status(400).json({ error });

    const aiResult = await fullReview(code, language, problemName || "Untitled");

    if (aiResult.parseError) {
      return res.status(502).json({
        error: "AI returned an unparseable response",
        raw: aiResult.raw,
      });
    }

    // Save submission
    const submission = await Submission.create({
      userId: req.userId,
      language,
      problemName: problemName || "Untitled",
      code,
      feedback: {
        logicErrors: aiResult.logic_errors || [],
        timeComplexity: aiResult.time_complexity || {},
        spaceComplexity: aiResult.space_complexity || {},
        cleanCodeSuggestions: aiResult.clean_code_suggestions || [],
        optimizedCode: aiResult.optimized_code || "",
        optimizedCodeExplanation: aiResult.optimized_code_explanation || "",
        optimalApproach: aiResult.optimal_approach || "",
        similarProblems: aiResult.similar_problems || [],
        unitTests: aiResult.unit_tests || [],
        score: aiResult.score || {},
        hints: aiResult.hints || [],
      },
      rawAIResponse: JSON.stringify(aiResult),
    });

    // Update user stats
    await updateUserStats(req.userId, aiResult.score?.overall);

    res.json({ submissionId: submission._id, feedback: submission.feedback });
  } catch (err) {
    next(err);
  }
};

// ─── Streaming Review (SSE) ──────────────────────────────────

exports.reviewStream = async (req, res, next) => {
  try {
    const { code, language, problemName } = req.body;
    const error = validateInput(code, language);
    if (error) return res.status(400).json({ error });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const stream = await streamReview(code, language, problemName || "Untitled");
    let fullText = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullText += content;
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (err) {
    next(err);
  }
};

// ─── Hints ───────────────────────────────────────────────────

exports.hints = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const error = validateInput(code, language);
    if (error) return res.status(400).json({ error });

    const result = await getHints(code, language);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// ─── Complexity ──────────────────────────────────────────────

exports.complexity = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const error = validateInput(code, language);
    if (error) return res.status(400).json({ error });

    const result = await analyzeComplexity(code, language);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// ─── Unit Tests ──────────────────────────────────────────────

exports.unitTests = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const error = validateInput(code, language);
    if (error) return res.status(400).json({ error });

    const result = await generateTests(code, language);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// ─── Helpers ─────────────────────────────────────────────────

async function updateUserStats(userId, overallScore) {
  if (typeof overallScore !== "number") return;

  const user = await User.findById(userId);
  if (!user) return;

  const newTotal = user.totalSubmissions + 1;
  const newAvg =
    (user.averageScore * user.totalSubmissions + overallScore) / newTotal;

  user.totalSubmissions = newTotal;
  user.averageScore = Math.round(newAvg * 10) / 10;

  // Update rank based on average score
  if (newAvg >= 80) user.rank = "expert";
  else if (newAvg >= 60) user.rank = "advanced";
  else if (newAvg >= 40) user.rank = "intermediate";
  else user.rank = "beginner";

  await user.save();
}
