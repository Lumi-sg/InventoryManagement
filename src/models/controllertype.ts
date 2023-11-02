import mongoose from "mongoose";

export enum ControllerTypeOptions {
	Type1 = "Gamecube Controller",
	Type2 = "Box Controller",
	Type3 = "Phob",
	Type4 = "Keyboard",
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
