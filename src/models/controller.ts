import mongoose from "mongoose";

const Schema = mongoose.Schema;

const controllerSchema = new Schema({
	product_name: { type: String, required: true, minlength: 1, maxlength: 50 },
	price: { type: Number, required: true },
	description: { type: String, required: true },
	controller_type: {
		type: Schema.Types.ObjectId,
		ref: "ControllerType",
		required: true,
	},

	designer: { type: Schema.Types.ObjectId, ref: "Designer", required: true },
});

controllerSchema.virtual("url").get(function () {
	return `/catalog/controller/${this._id}`;
});

export const Controller = mongoose.model("Controller", controllerSchema);
