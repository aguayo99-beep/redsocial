import express from "express";
import { getFeedPosts, getUserPosts, likePost,  checkPostLike, getCountLikes } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/:id/checkLike", verifyToken, checkPostLike);
router.get("/:id/likes", verifyToken, getCountLikes);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;
