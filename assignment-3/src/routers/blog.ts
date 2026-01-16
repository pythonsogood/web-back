import express from "express";
import { blogController } from "../controllers/blog";

export const router = express.Router();

router.get("/blogs", blogController.routeGetBlogs.bind(blogController));
router.get("/blogs/:id", blogController.routeGetBlogById.bind(blogController));
router.post("/blogs", blogController.routePostBlog.bind(blogController));
router.put("/blogs/:id", blogController.routePutBlogById.bind(blogController));
router.delete("/blogs/:id", blogController.routeDeleteBlogById.bind(blogController));

router.get("/", async (req, res, next) => {
	res.render("pages/index", {});
});