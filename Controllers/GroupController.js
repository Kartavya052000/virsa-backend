// groupController.js

const Group = require("../Models/GroupModel");

exports.getGroups = async (req, res, next) => {
  try {
    const groups = await Group.find();
    // const reversedGroups = groups.reverse();

    res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
