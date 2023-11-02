import mongoose from "mongoose";

export enum ControllerTypeOptions {
	GCC = "Gamecube Controller",
	BOX = "Box Controller",
	PHOB = "Phob",
	KB = "Keyboard",
}
const Schema = mongoose.Schema;

const controllerTypeSchema = new Schema({
	type: {
		type: String,
		enum: Object.values(ControllerTypeOptions),
		required: true,
	},
});

export const ControllerType = mongoose.model("ControllerType", controllerTypeSchema);
