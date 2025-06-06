const { selectUsers, selectUserById } = require("../models/api.users.model.js");

exports.getUsers = async (req, res) => {
  const users = await selectUsers();
  res.status(200).send({ users });
};

exports.getUserById = async (req, res) => {
  const user = await selectUserById(req.params);
  res.status(200).send({ user });
};
