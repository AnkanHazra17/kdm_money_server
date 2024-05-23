const express = require("express");
const router = express.Router();

const { auth, isAdmin } = require("../middlewares/Auth");
const {
  getRevenueDetails,
  allUsersFulldata,
  createRevenue,
  createCall,
  setTime,
  setAmount,
  getWithdrawalRequests,
  createProducts,
  deleteProduct,
  approveWithdrawalRequest,
  editProducts,
  deleteLavelUsers,
} = require("../controllers/Admin");

router.get("/get-revenue-data", auth, isAdmin, getRevenueDetails);
router.get("/get-allusers", auth, isAdmin, allUsersFulldata);
router.post("/init-revenue", auth, isAdmin, createRevenue);
router.post("/set-withdrawal-time", auth, isAdmin, setTime);
router.post("/amount-setup", auth, isAdmin, setAmount);
router.get("/get-all-withdrawal-req", auth, isAdmin, getWithdrawalRequests);

// Product Routes
router.post("/create-product", auth, isAdmin, createProducts);
router.put("/createCall/", auth, isAdmin, createCall);
router.put("/edit-product/", auth, isAdmin, editProducts);
router.delete("/delete-product", auth, isAdmin, deleteProduct);

router.put("/approve-req", auth, isAdmin, approveWithdrawalRequest);
router.put("/delete-child", auth, isAdmin, deleteLavelUsers);

module.exports = router;
