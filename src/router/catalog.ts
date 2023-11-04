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

router.get("/controller/:id/update", controller_controller.controller_update_get);

router.post("/controller/:id/update", controller_controller.controller_update_post);

router.get("/controller/:id/delete", controller_controller.controller_delete_get);

router.post("/controller/:id/delete", controller_controller.controller_delete_post);

router.get("/controllers", controller_controller.controller_list);

//designer routes
router.get("/designer/create", designer_controller.designer_create_get);

router.post("/designer/create", designer_controller.designer_create_post);

router.get("/designer/:id", designer_controller.designer_detail);

router.get("/designer/:id/update", designer_controller.designer_update_get);

router.post("/designer/:id/update", designer_controller.designer_update_post);

router.get("/designer/:id/delete", designer_controller.designer_delete_get);

router.post("/designer/:id/delete", designer_controller.designer_delete_post);

router.get("/designers", designer_controller.designer_list);
//types routes

router.get("/controllertypes", controllerType_controller.controllertype_list);

router.get("/controllertype/:id", controllerType_controller.controllertype_detail);

export default router;
