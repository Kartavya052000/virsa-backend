// groupController.js

const Group = require("../Models/GroupModel");

exports.getGroups = async (req, res, next) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
