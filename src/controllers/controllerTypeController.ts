import { body, validationResult } from "express-validator";
import { Controller } from "../models/controller";
import { ControllerInstance } from "../models/controllerinstance";
import { ControllerType } from "../models/controllertype";
import { Designer } from "../models/designer";

import asyncHandler from "express-async-handler";

exports.controllertype_list = asyncHandler(async (req, res) => {
	const allControllerTypes = await ControllerType.find().exec();
	res.render("controllertype_list", {
		title: "Controller Type List",
		controllertype_list: allControllerTypes,
	});
});
