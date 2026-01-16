import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from "express";
import { mongo } from "mongoose";
import { Blog } from "../models/blog";

class BlogController {
	constructor() {}

	public async routeGetBlogs(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {
		const blogs = await Blog.find({});

		await res.json(blogs);
	}

	public async routeGetBlogById(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {
		const id = req.params.id;

		if (typeof id != "string") {
			await res.status(400).json({"message": "id must be a valid ObjectId"})

			next();
			return;
		}

		if (!mongo.ObjectId.isValid(id)) {
			await res.status(400).json({"message": "id must be a valid ObjectId"});

			next();
			return;
		}

		const blog = await Blog.findById(new mongo.ObjectId(id));

		if (blog == null) {
			await res.status(404).json({"message": `blog with id ${id} not found`});

			return;
		}

		await res.json(blog);
	}

	public async routePostBlog(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {
		const { title, body, author } = req.body;

		if (title == undefined) {
			await res.status(400).json({"message": "title must be specified"})

			next();
			return;
		}

		if (body == undefined) {
			await res.status(400).json({"message": "body must be specified"})

			next();
			return;
		}

		const blog = new Blog({
			title: title,
			body: body,
			author: author,
		});

		await blog.save();

		await res.json({"message": "success", "id": blog._id});
	}

	public async routePutBlogById(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {
		const id = req.params.id;

		if (typeof id != "string") {
			await res.status(400).json({"message": "id must be a valid ObjectId"})

			next();
			return;
		}

		if (!mongo.ObjectId.isValid(id)) {
			await res.status(400).json({"message": "id must be a valid ObjectId"});

			next();
			return;
		}

		const { title, body, author } = req.body;

		const blog = await Blog.findById(new mongo.ObjectId(id));

		if (blog == null) {
			await res.status(404).json({"message": `blog with id ${id} not found`});

			return;
		}

		if (title != undefined) {
			blog.title = title;
		}

		if (body != undefined) {
			blog.body = body;
		}

		if (author != undefined) {
			blog.author = author;
		}

		blog.updatedAt = new Date();

		await blog.save();

		await res.json({"message": "success"});
	}

	public async routeDeleteBlogById(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {
		const id = req.params.id;

		if (typeof id != "string") {
			await res.status(400).json({"message": "id must be a valid ObjectId"})

			next();
			return;
		}

		if (!mongo.ObjectId.isValid(id)) {
			await res.status(400).json({"message": "id must be a valid ObjectId"});

			next();
			return;
		}

		const blog = await Blog.findById(new mongo.ObjectId(id));

		if (blog == null) {
			await res.status(404).json({"message": `blog with id ${id} not found`});

			return;
		}

		await blog.deleteOne();

		await res.json({"message": "success"});
	}
}

declare global {
	var blogController: BlogController;
}

if (global.blogController == undefined) {
	global.blogController = new BlogController();
}

export const blogController = global.blogController;