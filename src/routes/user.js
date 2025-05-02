const express = require("express");
const { userAuth } = require("../middlerwares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  const USER_VALUES =
    "firstName lastName _id gender dob about skills photoUrl createdAt updatedAt age";

  try {
    const isLoggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: isLoggedInUser._id },
        { fromUserId: isLoggedInUser._id },
      ],
      status: "interested",
    })
      .populate("toUserId", USER_VALUES)
      .populate("fromUserId", USER_VALUES);
    let data = [];
    let reviewUserId = [];
    if(!connectionRequest){
      res.status(200).json({
        success: true,
        message:"Connection Request does not exist",
        connectionRequest: connectionRequest,
        data: data,
        reviewData: reviewUserId,
      });
    }
    connectionRequest?.forEach((conn) => {
      let user;
      if (conn?.toUserId?._id.toString() === isLoggedInUser?._id?.toString()) {
        data.push({
          ...conn?.fromUserId?.toObject(),
          connectionId: conn?._id,
          sender: true,
        });
        user = { ...conn?.fromUserId?.toObject(), connectionId: conn?._id };
        reviewUserId.push(user);
      } else if (
        conn?.fromUserId?._id.toString() === isLoggedInUser?._id?.toString()
      ) {
        const value=conn?.toUserId?.toObject();
      
        if(value ){
          data.push({
            ...conn?.toUserId?.toObject(),
            connectionId: conn?._id,
            sender: false,
          });
        }
       
      }
    });
    res.status(200).json({
      success: true,
      connectionRequest: connectionRequest,
      data: data,
      reviewData: reviewUserId,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error" + error.message,
      success: false,
    });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  const USER_VALUES =
    "firstName lastName _id gender dob about skills photoUrl createdAt updatedAt age";

  try {
    const isLoggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: isLoggedInUser._id },
        { fromUserId: isLoggedInUser._id },
      ],
      status: "accepted",
    })
      .populate("toUserId", USER_VALUES)
      .populate("fromUserId", USER_VALUES);

    let data = [];
    connections.forEach((conn) => {
      if (conn?.toUserId?._id.toString() === isLoggedInUser._id.toString()) {
        data.push(conn.fromUserId);
      } else if (
        conn?.fromUserId?._id.toString() === isLoggedInUser._id.toString()
      ) {
        data.push(conn.toUserId);
      }
    });

    res.status(200).json({
      message: "connection who request are accept",
      data: data,
      connections: connections,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error  in connection accepted requests" + error.message,
    });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  const USER_VALUES =
    "firstName lastName _id gender dob about skills photoUrl createdAt updatedAt";
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit > 50 ? 50 : limit;
  const skip = (page - 1) * limit;

  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    });
    const excludeUserIds = new Set();

    connections.map((conn) => {
      excludeUserIds.add(conn.fromUserId.toString());
      excludeUserIds.add(conn.toUserId.toString());
    });

    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(excludeUserIds) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_VALUES)
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error in feed " + error.message,
    });
  }
});
module.exports = userRouter;
