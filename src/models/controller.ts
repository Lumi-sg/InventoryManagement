import mongoose from "mongoose";

const Schema = mongoose.Schema;

const controllerSchema = new Schema({
	product_name: { type: String, required: true },
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
	return `/controller/${this._id}`;
});

export const Controller = mongoose.model("Controller", controllerSchema);
