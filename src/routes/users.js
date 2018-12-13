const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validation = require("./validation")

router.get("/users/signup", userController.signUp);
router.post("/user", validation.validateUsers, userController.create);
router.get("/users/signIn", userController.signInForm);
router.post("/users/signIn", validation.validateUsers, userController.signIn);
router.get("/users/signOut", userController.signOut);
router.get("/users/upgrade_form", userController.upgradeForm);
router.post("/charge", userController.charge);

module.exports = router;