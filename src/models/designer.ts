import mongoose from "mongoose";

const Schema = mongoose.Schema;

const designerSchema = new Schema({
	name: { type: String, required: true, minlength: 1, maxlength: 50 },
	bio: { type: String, required: true },
	website: { type: String, required: true, minlength: 3, maxlength: 50 },
});

//virtual for url
designerSchema.virtual("url").get(function () {
	return `/catalog/designer/${this._id}`;
});

export const Designer = mongoose.model("Designer", designerSchema);
