exports.HandlePostgresErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request: postgres 22P02: invalid input syntax for type" });
  } else if (err.code === "23503") {
    res
      .status(422)
      .send({ msg: "bad request: postgres 23503: insert or update on table violates foreign key constraint" });
  } else if (err.code === "42703") {
    res.status(400).send({ msg: "bad request: postgres 42703: column does not exist" });
  } else if (err.code === "23505") {
    res.status(400).send({ msg: "bad request: postgres 23505: duplicate key value violates unique constraint" });
  } else {
    next(err);
  }
};

exports.HandleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.message });
  } else {
    next(err);
  }
};

exports.HandleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: err.message });
};
