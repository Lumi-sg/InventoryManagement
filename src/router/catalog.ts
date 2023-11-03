import express from "express";
const router = express.Router();

const controller_controller = require("../controllers/controllerController");
const designer_controller = require("../controllers/designerController");
const controllerType_controller = require("../controllers/controllerTypeController");

router.get("/", controller_controller.index);

//controller routes

router.get("/controller/create", controller_controller.controller_create_get);

router.post("/controller/create", controller_controller.controller_create_post);

router.get("/controller/:id", controller_controller.controller_detail);

router.get("/controllers", controller_controller.controller_list);

//designer routes
router.get("/designer/create", designer_controller.designer_create_get);

router.post("/designer/create", designer_controller.designer_create_post);

router.get("/designer/:id", designer_controller.designer_detail);

router.get("/designers", designer_controller.designer_list);

//types routes

router.get("/controllertypes", controllerType_controller.controllertype_list);

export default router;
