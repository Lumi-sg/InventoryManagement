import { body, validationResult } from "express-validator";
import { Controller } from "../models/controller";
import { ControllerInstance } from "../models/controllerinstance";
import { ControllerType } from "../models/controllertype";
import { Designer } from "../models/designer";

import asyncHandler from "express-async-handler";

exports.index = asyncHandler(async (req, res) => {
	const [
		numControllers,
		numControllerInstances,
		availableConrollerInstances,
		numControllerTypes,
		numDesigners,
	] = await Promise.all([
		Controller.countDocuments({}).exec(),
		ControllerInstance.countDocuments({}).exec(),
		ControllerInstance.countDocuments({ status: "Available" }).exec(),
		ControllerType.countDocuments({}).exec(),
		Designer.countDocuments({}).exec(),
	]);

	res.render("index", {
		title: "Inventory Management",
		controller_count: numControllers,
		controllerinstance_count: numControllerInstances,
		controllerinstance_available_count: availableConrollerInstances,
		controllertype_count: numControllerTypes,
		designer_count: numDesigners,
	});
});

//Diplay list of all controllers

exports.controller_list = asyncHandler(async (req, res) => {
	const allControllers = await Controller.find({}, "product_name designer")
		.sort({ product_name: 1 })
		.populate("designer")
		.exec();
	res.render("controller_list", {
		title: "Controller List",
		controller_list: allControllers,
	});
});

// Display detail page for specific controller

// Display controller create form on GET
