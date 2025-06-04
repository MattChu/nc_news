const { fetchUsers } = require("../models/api.users.model.js");

exports.getUsers = async (req, res) => {
  const users = await fetchUsers();
  res.status(200).send({ users });
};
