const express = require("express");
const router = express.Router();

const { auth, isPublic, isAdmin } = require("../middlewares/Auth");
const {
  capterPayment,
  verifyPayment,
  withrawalRequest,
} = require("../controllers/Invest");

router.post("/capture-payment", auth, isPublic, capterPayment);
router.post("/verify-payment", auth, isPublic, verifyPayment);
router.post("/withraw-money", auth, isPublic, withrawalRequest);

module.exports = router;
