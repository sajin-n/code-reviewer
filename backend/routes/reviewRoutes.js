const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  review,
  reviewStream,
  hints,
  complexity,
  unitTests,
} = require("../controllers/reviewController");

router.post("/", auth, review);
router.post("/stream", auth, reviewStream);
router.post("/hints", auth, hints);
router.post("/complexity", auth, complexity);
router.post("/unit-tests", auth, unitTests);

module.exports = router;
