const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["javascript", "python", "java", "cpp", "c", "typescript", "go", "rust"],
    },
    problemName: {
      type: String,
      trim: true,
      default: "Untitled",
    },
    code: {
      type: String,
      required: [true, "Code is required"],
      maxlength: 50000,
    },
    feedback: {
      logicErrors: [String],
      timeComplexity: {
        current: String,
        optimal: String,
        explanation: { type: mongoose.Schema.Types.Mixed },
      },
      spaceComplexity: {
        current: String,
        optimal: String,
        explanation: { type: mongoose.Schema.Types.Mixed },
      },
      cleanCodeSuggestions: [String],
      optimizedCode: String,
      optimizedCodeExplanation: { type: mongoose.Schema.Types.Mixed },
      optimalApproach: { type: mongoose.Schema.Types.Mixed },
      similarProblems: [String],
      unitTests: [String],
      score: {
        readability: { type: Number, min: 0, max: 10 },
        efficiency: { type: Number, min: 0, max: 10 },
        structure: { type: Number, min: 0, max: 10 },
        overall: { type: Number, min: 0, max: 100 },
      },
      hints: [String],
    },
    rawAIResponse: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
