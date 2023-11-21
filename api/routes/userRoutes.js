const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const {
  deleteUser,
  signup,
  login,
  getAllUsers,
  getUserbyId
} = require("../controllers/userController");

router.get("/", checkAuth, getAllUsers);

router.get("/:userId", getUserbyId);

router.post("/login", login);

router.post("/signup", signup);

router.delete("/:userId", checkAuth, deleteUser);

module.exports = router;
