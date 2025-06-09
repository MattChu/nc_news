const usersRouter = require("express").Router();

const { getUsers, getUserById } = require("../controllers/api.users.controller");

usersRouter.route("/").get(getUsers);
usersRouter.route("/:username").get(getUserById);

module.exports = usersRouter;
