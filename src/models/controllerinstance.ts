import mongoose from "mongoose";

const Schema = mongoose.Schema;

const controllerInstanceSchema = new Schema({
	controller: { type: Schema.Types.ObjectId, ref: "Controller", required: true },
	status: {
		type: String,
		required: true,
		enum: ["Available", "Sold"],
		default: "Available",
	},
});

controllerInstanceSchema.virtual("url").get(function () {
	return `/catalog/instance/${this._id}`;
});

export const ControllerInstance = mongoose.model(
	"ControllerInstance",
	controllerInstanceSchema
);
