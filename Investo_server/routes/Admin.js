const express = require("express");
const router = express.Router();

const { auth, isAdmin } = require("../middlewares/Auth");
const {
  getRevenueDetails,
  allUsersFulldata,
  createRevenue,
  createCall,
  setWithdrawalTime,
  setWithdralAmount,
} = require("../controllers/Admin");

router.get("/get-revenue-data", auth, isAdmin, getRevenueDetails);
router.get("/get-allusers", auth, isAdmin, allUsersFulldata);
router.post("/init-revenue", auth, isAdmin, createRevenue);
router.post("/createCall", auth, isAdmin, createCall);
router.post("/set-withdrawal-time", auth, isAdmin, setWithdrawalTime);
router.post("/set-withdrawal-amount", auth, isAdmin, setWithdralAmount);

module.exports = router;
