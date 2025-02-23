const { registerUser, loginUser, resetPassword } = require("../controllers/auth.controllers");
const { authenticate } = require("../middleware/authenticate");
const { registerValidator, loginValidator, resetPasswordValidator } = require("../validator/auth.validator");


const router = require("express").Router();
router.post("/register",registerValidator, registerUser);
router.post("/login", loginValidator, loginUser);
router.post("/reset-password",authenticate, resetPasswordValidator, resetPassword)
module.exports = router;