import mongoose from "mongoose";

const Schema = mongoose.Schema;

const controllerTypeSchema = new Schema({
	type: {
		type: String,
		required: true,
		enum: ["Gamecube Controller", "Box Controller", "Phob"],
		default: "Gamecube Controller",
	},
});

controllerTypeSchema.virtual("url").get(function () {
	return `/catalog/controllertype/${this._id}`;
});

export const ControllerType = mongoose.model("ControllerType", controllerTypeSchema);
