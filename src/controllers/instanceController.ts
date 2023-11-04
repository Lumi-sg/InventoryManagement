import { body, validationResult } from "express-validator";
import { Controller } from "../models/controller";
import { ControllerInstance } from "../models/controllerinstance";
import { ControllerType } from "../models/controllertype";
import { Designer } from "../models/designer";

import asyncHandler from "express-async-handler";

//display instance create form on GET

exports.instance_create_get = asyncHandler(async (req, res, next) => {
	const allControllers = await Controller.find({}, "product_name").exec();

	res.render("instance_form", {
		title: "Create Controller Instance",
		controller_list: allControllers,
	});
});

// Handle instance create on POST

exports.instance_create_post = [
	body("controller", "Controller must be specified")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("status").escape(),

	asyncHandler(async (req, res) => {
		const errors = validationResult(req);

		const instance = new ControllerInstance({
			controller: req.body.controller,
			status: req.body.status,
		});
		if (!errors.isEmpty()) {
			//errors were made

			const allControllers = await Controller.find({}, "product_name").exec();

			res.render("instance_form", {
				title: "Create Instance",
				allControllers: allControllers,
				selected_controller: instance.controller,
				controllerinstance: instance,
			});
			return;
		} else {
			await instance.save();
			res.redirect("/catalog/instances");
		}
	}),
];

//display instance delete form on GET

exports.instance_delete_get = asyncHandler(async (req, res) => {
	const instance = await ControllerInstance.findById(req.params.id)
		.populate("controller")
		.exec();

	if (instance === null) {
		//No results
		res.redirect("/catalog/instances");
	}
	res.render("instance_delete", {
		title: "Delete Stock",
		instance: instance,
	});
});

//Handle instance delete on POST
exports.instance_delete_post = asyncHandler(async (req, res) => {
	await ControllerInstance.findByIdAndDelete(req.body.id);
	res.redirect("/catalog/instances");
});

//display instance update form on GET

exports.instance_update_get = asyncHandler(async (req, res, next) => {
	const [instance, allControllers] = await Promise.all([
		ControllerInstance.findById(req.params.id).populate("controller").exec(),
		Controller.find(),
	]);

	if (instance === null) {
		//No results
		const err = new Error("Instance not found");
		return next(err);
	}
	res.render("instance_form", {
		title: "Update Controller",
		controller_list: allControllers,
	});
});

// Handle instance update on POST
exports.instance_update_post = [
	body("controller", "Controller must be specified")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("status").escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const instance = new ControllerInstance({
			controller: req.body.controller,
			status: req.body.status,
			_id: req.params.id,
		});

		if (!errors.isEmpty()) {
			const allControllers = await Controller.find({}, "product_name").exec();
			res.render("instance_form", {
				title: "Update Instance",
				controller_list: allControllers,
				selected_controller: instance.controller,
				errors: errors.array(),
				instance: instance,
			});
			return;
		} else {
			await ControllerInstance.findByIdAndUpdate(req.params.id, instance);
			res.redirect("/catalog/instances");
		}
	}),
];

// Display list of all instances

exports.instance_list = asyncHandler(async (req, res) => {
	const allInstances = await ControllerInstance.find().populate("controller").exec();
	res.render("instance_list", {
		title: "Instance List",
		instance_list: allInstances,
	});
});

// Display detail page for specific instance

exports.instance_detail = asyncHandler(async (req, res, next) => {
	const controllerInstance = await ControllerInstance.findById(req.params.id)
		.populate({
			path: "controller",
			populate: {
				path: "designer",
			},
		})
		.exec();

	if (controllerInstance === null) {
		//No results
		const err = new Error("Instance not found");
		return next(err);
	}

	res.render("instance_detail", {
		title: "Controller:",
		instance: controllerInstance,
	});
});
