const { removeCommentFromDB } = require("../models/api.comments.model");

exports.deleteComment = async (req, res) => {
  const deletedComment = await removeCommentFromDB(req.params);
  res.status(204).send();
};
