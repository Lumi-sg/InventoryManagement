import { body, validationResult } from "express-validator";
import { Controller } from "../models/controller";
import { ControllerInstance } from "../models/controllerinstance";
import { ControllerType } from "../models/controllertype";
import { Designer } from "../models/designer";

import asyncHandler from "express-async-handler";

//Display list of all designers
exports.designer_list = asyncHandler(async (req, res) => {
	const allDesigners = await Designer.find().sort({ name: 1 }).exec();
	res.render("designer_list", {
		title: "Designer List",
		designer_list: allDesigners,
	});
});

//Display detail page for specific designer
exports.designer_detail = asyncHandler(async (req, res, next) => {
	const [designer, allControllersByDesigner] = await Promise.all([
		Designer.findById(req.params.id).exec(),
		Controller.find({ designer: req.params.id }, "product_name description").exec(),
	]);

	if (designer === null) {
		//No results
		const err = new Error("Designer not found");
		return next(err);
	}

	res.render("designer_detail", {
		title: "Designer Detail",
		designer: designer,
		designer_controllers: allControllersByDesigner,
	});
});

//Display designer create form on GET
exports.designer_create_get = asyncHandler(async (req, res) => {
	res.render("designer_form", {
		title: "Create Designer",
	});
});

//Handle designer create on POST
exports.designer_create_post = [
	body("name")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Name must be specified.")
		.isAlphanumeric()
		.withMessage("Name has non-alphanumeric characters."),
	body("bio")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Bio must be specified.")
		.isAlphanumeric()
		.withMessage("Bio has non-alphanumeric characters."),
	body("website")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Website must be specified.")
		.isURL()
		.withMessage("Website must be a valid URL."),

	asyncHandler(async (req, res) => {
		const errors = validationResult(req);

		const designer = new Designer({
			name: req.body.name,
			bio: req.body.bio,
			website: req.body.website,
		});
		if (!errors.isEmpty()) {
			res.render("designer_form", {
				title: "Create Designer",
				designer,
				errors: errors.array(),
			});
			return;
		} else {
			await designer.save();
			res.redirect("/catalog");
		}
	}),
];
