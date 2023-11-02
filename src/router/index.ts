import express from "express";

const router = express.Router();

//Default route
router.get("/", (req, res) => {
	res.redirect("/catalog");
});

export default router;
