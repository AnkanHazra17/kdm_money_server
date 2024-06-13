const express = require("express");
const router = express.Router();

const { auth, isPublic } = require("../middlewares/Auth");
const {
  withrawalRequest,
  initializePayment,
  verifyPayment,
  paymentTest,
} = require("../controllers/Invest");

router.post("/init-payment", auth, isPublic, initializePayment);
router.post("/withraw-money", auth, isPublic, withrawalRequest);
router.post("/verify-payment", auth, isPublic, verifyPayment);
router.post("/payment-test", auth, isPublic, paymentTest);

module.exports = router;
