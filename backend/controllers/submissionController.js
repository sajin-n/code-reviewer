const Submission = require("../models/Submission");

exports.getHistory = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      Submission.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("language problemName feedback.score createdAt"),
      Submission.countDocuments({ userId: req.userId }),
    ]);

    res.json({
      submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    res.json(submission);
  } catch (err) {
    next(err);
  }
};

exports.deleteSubmission = async (req, res, next) => {
  try {
    const result = await Submission.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!result) {
      return res.status(404).json({ error: "Submission not found" });
    }

    res.json({ message: "Submission deleted" });
  } catch (err) {
    next(err);
  }
};
