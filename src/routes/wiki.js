const express = require("express");
const router = express.Router();
const wikiController = require("../controllers/wikiController");
const validation = require("./validation")

router.get("/wikis/new", wikiController.new);
router.post("/wikis/create", wikiController.create);
//router.get("/wikis", wikiController.index);

/*router.post("/user", validation.validateUsers, userController.create);
router.get("/users/signIn", userController.signInForm);
router.post("/users/signIn", validation.validateUsers, userController.signIn);
router.get("/users/signOut", userController.signOut)*/

module.exports = router;