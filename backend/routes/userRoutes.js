
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
} = require("../controllers/userController");
const {
  registerValidation,
  loginValidation,
} = require("../middleware/validate");

// Routes pour les utilisateurs
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/logout", logout);
router.get("/me", getMe);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
