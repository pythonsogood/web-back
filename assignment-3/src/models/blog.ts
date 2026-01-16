import { model, Schema } from "mongoose";

export const blogSchema = new Schema({
	title: {type: String, required: true},
	body: {type: String, required: true},
	author: {type: String, default: "Anonymous"},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date},
}, {collection: "blogs"});

export const Blog = model("Blog", blogSchema);