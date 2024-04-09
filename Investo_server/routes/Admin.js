const express = require("express");
const router = express.Router();

const { auth, isAdmin } = require("../middlewares/Auth");
const {
  getRevenueDetails,
  allUsersFulldata,
  createRevenue,
} = require("../controllers/Admin");

router.get("/get-revenue-data", auth, isAdmin, getRevenueDetails);
router.get("/get-allusers", auth, isAdmin, allUsersFulldata);
router.post("/init-revenue", auth, isAdmin, createRevenue);

module.exports = router;
