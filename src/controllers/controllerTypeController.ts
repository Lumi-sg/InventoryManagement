import { body, validationResult } from "express-validator";
import { Controller } from "../models/controller";
import { ControllerInstance } from "../models/controllerinstance";
import { ControllerType } from "../models/controllertype";
import { Designer } from "../models/designer";

import asyncHandler from "express-async-handler";

//Display list of all controller types
exports.controllertype_list = asyncHandler(async (req, res) => {
	const allControllerTypes = await ControllerType.find().exec();
	res.render("controllertype_list", {
		title: "Controller Type List",
		controllertype_list: allControllerTypes,
	});
});

//Display detail page for specific controller type
exports.controllertype_detail = asyncHandler(async (req, res, next) => {
	const [controllertype, allControllersByControllertype] = await Promise.all([
		ControllerType.findById(req.params.id).exec(),
		Controller.find(
			{ controller_type: req.params.id },
			"product_name description"
		).exec(),
	]);
	if (controllertype === null) {
		//No results
		const err = new Error("Controllertype not found");
		return next(err);
	}
	res.render("controllertype_detail", {
		title: "Controller Type Detail",
		controllertype: controllertype,
		allControllersByControllertype: allControllersByControllertype,
	});
});
