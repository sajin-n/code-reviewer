const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getHistory,
  getSubmission,
  deleteSubmission,
} = require("../controllers/submissionController");

router.get("/", auth, getHistory);
router.get("/:id", auth, getSubmission);
router.delete("/:id", auth, deleteSubmission);

module.exports = router;
