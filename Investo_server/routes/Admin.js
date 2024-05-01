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
  getWithdrawalRequests,
  createProducts,
  deleteProduct,
} = require("../controllers/Admin");

router.get("/get-revenue-data", auth, isAdmin, getRevenueDetails);
router.get("/get-allusers", auth, isAdmin, allUsersFulldata);
router.post("/init-revenue", auth, isAdmin, createRevenue);
router.post("/set-withdrawal-time", auth, isAdmin, setWithdrawalTime);
router.post("/amount-setup", auth, isAdmin, setWithdralAmount);
router.get("/get-all-withdrawal-req", auth, isAdmin, getWithdrawalRequests);

// Product Routes
router.post("/create-product", auth, isAdmin, createProducts);
router.put("/createCall/", auth, isAdmin, createCall);
router.delete("/delete-product", auth, isAdmin, deleteProduct);

module.exports = router;
