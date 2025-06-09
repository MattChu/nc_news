const commentsRouter = require("express").Router();

const { patchCommentsVotes, deleteComment } = require("../controllers/api.comments.controller");

commentsRouter.route("/:comment_id").patch(patchCommentsVotes).delete(deleteComment);

module.exports = commentsRouter;
