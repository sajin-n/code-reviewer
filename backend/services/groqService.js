const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// ─── Prompt Templates ─────────────────────────────────────────

function buildFullReviewPrompt(code, language, problemName) {
  return `You are an expert software engineer, DSA instructor, and interview coach.
Analyze the following ${language} code${problemName !== "Untitled" ? ` for the problem: "${problemName}"` : ""}.

Provide your response as **valid JSON only** (no markdown, no backticks, no explanation outside JSON) with these keys:

{
  "logic_errors": ["Detailed description of each bug or incorrect logic found, including what line/section it occurs in and why it's wrong"],
  "time_complexity": {
    "current": "O(...)",
    "optimal": "O(...)",
    "explanation": ["Point 1: which operation dominates runtime and why", "Point 2: contribution of each loop or recursive call", "Point 3: what technique achieves the optimal complexity"]
  },
  "space_complexity": {
    "current": "O(...)",
    "optimal": "O(...)",
    "explanation": ["Point 1: main memory consumers in the code", "Point 2: auxiliary data structures or recursion stack depth", "Point 3: how optimal space could be achieved"]
  },
  "clean_code_suggestions": ["list of readability / structure improvements with specific examples"],
  "optimized_code": "A production-quality, interview-ready rewritten version of the code. IMPORTANT: Use actual newline characters (\\n) for line breaks inside this JSON string so the code is properly formatted with correct indentation. Do NOT put the entire code on a single line. Use clear variable names, add brief inline comments on key logic lines, follow best practices for the language, and ensure it handles edge cases.",
  "optimized_code_explanation": ["Point 1: the core data structure chosen and why", "Point 2: how the main loop / logic works", "Point 3: why this is more efficient than the original", "Point 4: how edge cases are handled", "Point 5: any trade-offs between time and space"],
  "optimal_approach": ["Point 1: the core intuition or key insight", "Point 2: algorithm step — how it begins", "Point 3: algorithm step — main mechanics", "Point 4: why the chosen data structure is optimal", "Point 5: trade-offs between time and space", "Point 6: how it performs on edge cases"],
  "similar_problems": ["Problem 1 name — brief reason why it's similar", "Problem 2 name — brief reason", "Problem 3 name — brief reason"],
  "unit_tests": ["test case 1 as code string", "test case 2", "test case 3"],
  "score": {
    "readability": 0-10,
    "efficiency": 0-10,
    "structure": 0-10,
    "overall": 0-100
  },
  "hints": ["hint 1 without revealing answer", "hint 2"]
}

Code:
\`\`\`${language}
${code}
\`\`\``;
}

function buildHintPrompt(code, language) {
  return `You are a helpful DSA tutor. The student is stuck. Instead of giving the answer, provide 3 progressive hints that guide them toward the solution.

Return valid JSON only:
{
  "hints": ["hint 1 (very subtle)", "hint 2 (medium guidance)", "hint 3 (strong nudge)"]
}

Code:
\`\`\`${language}
${code}
\`\`\``;
}

function buildComplexityPrompt(code, language) {
  return `You are an algorithm complexity analyst and interview coach.
Analyze the following ${language} code and return valid JSON only:

{
  "time_complexity": {
    "current": "O(...)",
    "explanation": "A 4-6 sentence explanation of why this code has this time complexity. Walk through the loops, recursive calls, or built-in operations that dominate the runtime. Mention constants if relevant."
  },
  "space_complexity": {
    "current": "O(...)",
    "explanation": "A 4-6 sentence explanation of all memory usage: variables, data structures, recursion stack, etc. Mention what contributes most to space and whether it can be reduced."
  },
  "bottleneck": "Describe the most expensive operation in detail — what it does, why it's costly, and what alternative would be faster."
}

Code:
\`\`\`${language}
${code}
\`\`\``;
}

function buildUnitTestPrompt(code, language) {
  return `You are a test engineer. Generate 5 unit tests (including edge cases) for the following ${language} code.
Return valid JSON only. IMPORTANT: Each test in the array must be a properly formatted code string with \\n for newlines and proper indentation — never put a test on a single line.

{
  "unit_tests": ["test 1 as code string", "test 2", "test 3", "test 4", "test 5"],
  "edge_cases_covered": ["empty input", "single element", etc.]
}

Code:
\`\`\`${language}
${code}
\`\`\``;
}

// ─── API Callers ──────────────────────────────────────────────

async function callGroq(prompt, stream = false) {
  const params = {
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a strict but helpful competitive programmer. You prioritize O(n) solutions over O(n²) and dislike unnecessary memory allocation. Always respond with valid JSON only. CRITICAL: When writing code inside JSON string values, you MUST use \\n for newlines and \\t or spaces for indentation so the code is properly formatted — never put multi-line code on a single line.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 8192,
    stream,
    ...(!stream && { response_format: { type: "json_object" } }),
  };

  if (stream) {
    return groq.chat.completions.create(params);
  }

  const response = await groq.chat.completions.create(params);
  const text = response.choices[0]?.message?.content || "{}";
  return parseAIResponse(text);
}

function parseAIResponse(text) {
  let cleaned = text.trim();

  // Strip markdown code fences (handles ```json, ```javascript, ``` etc.)
  const fenceMatch = cleaned.match(/```(?:\w+)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  // Extract the outermost JSON object in case there is any preamble/postamble text
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  try {
    const parsed = JSON.parse(cleaned);

    // Normalize code strings — ensure literal \n sequences become real newlines
    if (typeof parsed.optimized_code === "string") {
      parsed.optimized_code = normalizeCodeString(parsed.optimized_code);
    }
    if (Array.isArray(parsed.unit_tests)) {
      parsed.unit_tests = parsed.unit_tests.map((t) =>
        typeof t === "string" ? normalizeCodeString(t) : t
      );
    }

    return parsed;
  } catch {
    return { raw: cleaned, parseError: true };
  }
}

/**
 * LLMs sometimes return code as a single line with literal \n / \t sequences
 * inside a JSON string value. JSON.parse handles \n correctly, but if the model
 * double-escapes (\\n) or uses semicolons/braces without newlines, the code
 * ends up on one line. This function detects and fixes that.
 */
function normalizeCodeString(str) {
  if (!str || typeof str !== "string") return str;

  // If the string already has real newlines and looks multi-line, leave it alone
  if (str.includes("\n") && str.split("\n").length > 3) return str;

  // Replace literal \n and \t (double-escaped leftovers)
  let result = str.replace(/\\n/g, "\n").replace(/\\t/g, "\t");

  // If it's still basically one line, try splitting on common statement endings
  if (result.split("\n").length <= 3) {
    result = result
      .replace(/;\s*/g, ";\n")
      .replace(/\{\s*/g, "{\n")
      .replace(/\}\s*/g, "\n}\n")
      .replace(/\n\n+/g, "\n");
  }

  return result.trim();
}

// ─── Exported Functions ──────────────────────────────────────

async function fullReview(code, language, problemName) {
  const prompt = buildFullReviewPrompt(code, language, problemName);
  return callGroq(prompt);
}

async function getHints(code, language) {
  const prompt = buildHintPrompt(code, language);
  return callGroq(prompt);
}

async function analyzeComplexity(code, language) {
  const prompt = buildComplexityPrompt(code, language);
  return callGroq(prompt);
}

async function generateTests(code, language) {
  const prompt = buildUnitTestPrompt(code, language);
  return callGroq(prompt);
}

async function streamReview(code, language, problemName) {
  const prompt = buildFullReviewPrompt(code, language, problemName);
  return callGroq(prompt, true);
}

module.exports = {
  fullReview,
  getHints,
  analyzeComplexity,
  generateTests,
  streamReview,
};
