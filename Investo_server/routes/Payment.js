const express = require("express");
const router = express.Router();

const { auth, isPublic, isAdmin } = require("../middlewares/Auth");
const {
  withrawalRequest,
  afterPaymentActions,
} = require("../controllers/Invest");

router.post("/withraw-money", auth, isPublic, withrawalRequest);
router.post("/pay-process", auth, isPublic, afterPaymentActions);

module.exports = router;
