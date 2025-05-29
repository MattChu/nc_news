const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (objectArray, key, val) => {
  return objectArray.reduce((outObject, thisObject) => {
    outObject[thisObject[key]] = thisObject[val];
    return outObject;
  }, {});
};
