import { body, validationResult } from "express-validator";
import { Controller } from "../models/controller";
import { ControllerInstance } from "../models/controllerinstance";
import { ControllerType } from "../models/controllertype";
import { Designer } from "../models/designer";

import asyncHandler from "express-async-handler";
import { nextTick } from "process";

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

//Display detail page for specific controller
exports.controller_detail = asyncHandler(async (req, res, next) => {
	const [controller, controllerInstances] = await Promise.all([
		Controller.findById(req.params.id)
			.populate("designer")
			.populate("controller_type")
			.exec(),
		ControllerInstance.find({ controller: req.params.id }, "controller status")
			.populate("status")
			.exec(),
	]);

	if (controller === null) {
		//No results
		const err = new Error("Controller not found");
		return next(err);
	}
	res.render("controller_detail", {
		title: "Controller Detail",
		controller: controller,
		controllerInstances: controllerInstances,
	});
});

// Display controller create form on GET

exports.controller_create_get = asyncHandler(async (req, res) => {
	const [allDesigners, controllerTypes] = await Promise.all([
		Designer.find().exec(),
		ControllerType.find().exec(),
	]);
	res.render("controller_form", {
		title: "Create Controller",
		allDesigners: allDesigners,
		controllerTypes: controllerTypes,
	});
});

// Handle controller create on POST

exports.controller_create_post = [
	body("product_name")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Product name must be specified."),
	body("price")
		.trim()
		.isNumeric()
		.withMessage("Price must be a number.")
		.isFloat({ min: 0 })
		.withMessage("Price must be a positive number"),
	body("description")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Description must be specified."),
	body("controller_type.*").escape(),
	body("designer.*").escape(),

	asyncHandler(async (req, res) => {
		const errors = validationResult(req);

		const controller = new Controller({
			product_name: req.body.product_name,
			price: req.body.price,
			description: req.body.description,
			controller_type: req.body.controller_type,
			designer: req.body.designer,
		});

		if (!errors.isEmpty()) {
			const [allDesigners, controllerTypes] = await Promise.all([
				Designer.find().exec(),
				ControllerType.find().exec(),
			]);

			res.render("controller_form", {
				title: "Create Controller",
				controller: controller,
				allDesigners: allDesigners,
				controllerTypes: controllerTypes,
				errors: errors.array(),
			});
			return;
		} else {
			await controller.save();
			res.redirect("/catalog/controllers");
		}
	}),
];

// Display controller delete form on GET
exports.controller_delete_get = asyncHandler(async (req, res) => {
	const [controller, controllerInstances] = await Promise.all([
		Controller.findById(req.params.id)
			.populate("designer")
			.populate("controller_type")
			.exec(),
		ControllerInstance.find({ controller: req.params.id }).exec(),
	]);

	if (controller === null) {
		//No results
		res.redirect("/catalog/controllers");
	}
	res.render("controller_delete", {
		title: "Delete Controller",
		controller: controller,
		controllerInstances: controllerInstances,
	});
});

// Handle controller delete on POST
exports.controller_delete_post = asyncHandler(async (req, res) => {
	const [controller, controllerInstances] = await Promise.all([
		Controller.findById(req.params.id)
			.populate("designer")
			.populate("controller_type")
			.exec(),
		ControllerInstance.find({ controller: req.params.id }).exec(),
	]);
	if (controller === null) {
		//No results
		res.redirect("/catalog/controllers");
	}
	if (controllerInstances.length > 0) {
		res.render("controller_delete", {
			title: "Delete Controller",
			controller: controller,
			controllerInstances: controllerInstances,
		});
		return;
	} else {
		await Controller.findByIdAndDelete(req.body.controllerid);
		res.redirect("/catalog/controllers");
	}
});

// Display controller update form on GET
exports.controller_update_get = asyncHandler(async (req, res, next) => {
	const [controller, allDesigners, controllerTypes] = await Promise.all([
		Controller.findById(req.params.id)
			.populate("designer")
			.populate("controller_type")
			.populate("price")
			.populate("description")
			.exec(),
		Designer.find().exec(),
		ControllerType.find().exec(),
	]);

	if (controller === null) {
		//No results
		const err = new Error("Controller not found");
		return next(err);
	}
	res.render("controller_form", {
		title: "Update Controller",
		controller: controller,
		allDesigners: allDesigners,
		controllerTypes: controllerTypes,
	});
});

// Handle controller update on POST
exports.controller_update_post = [
	(req: any, res: any, next: any) => {
		if (!(req.body.controller_type instanceof Array)) {
			if (typeof req.body.controller_type === "undefined") {
				req.body.controller_type = [];
			} else {
				req.body.controller_type = new Array(req.body.controller_type);
			}
		}
		next();
	},

	body("product_name")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Product name must be specified."),
	body("price")
		.trim()
		.isNumeric()
		.withMessage("Price must be a number.")
		.isFloat({ min: 0 })
		.withMessage("Price must be a positive number"),
	body("description")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Description must be specified."),
	body("controller_type.*").escape(),
	body("designer.*").escape(),

	asyncHandler(async (req, res) => {
		const errors = validationResult(req);

		const controller = new Controller({
			product_name: req.body.product_name,
			price: req.body.price,
			description: req.body.description,
			controller_type: req.body.controller_type,
			designer: req.body.designer,
		});

		if (!errors.isEmpty()) {
			const [allDesigners, controllerTypes] = await Promise.all([
				Designer.find().exec(),
				ControllerType.find().exec(),
			]);

			res.render("controller_form", {
				title: "Update Controller",
				controller: controller,
				allDesigners: allDesigners,
				controllerTypes: controllerTypes,
				errors: errors.array(),
			});
			return;
		} else{
			const theController = await Controller.findByIdAndUpdate(
				req.params.id,
				controller
			);
			res.redirect("/catalog/controllers");
		}
	})
];
