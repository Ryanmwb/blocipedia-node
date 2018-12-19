const express = require("express");
const router = express.Router();
const wikiController = require("../controllers/wikiController");
const validation = require("./validation")

router.get("/wikis/new", wikiController.new);
router.post("/wikis/create", wikiController.create);
router.get("/wikis", wikiController.index);
router.get("/wikis/:wikiId", wikiController.show);
router.get("/wikis/:wikiId/edit", wikiController.edit);
router.post("/wikis/:wikiId/update", wikiController.update);
router.post("/wikis/:wikiId/destroy", wikiController.destroy);

module.exports = router;

