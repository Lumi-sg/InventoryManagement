import express from "express";
const router = express.Router();

const controller_controller = require("../controllers/controllerController");

router.get("/", controller_controller.index);

router.get("controllers"), controller_controller.controller_list;

export default router;
