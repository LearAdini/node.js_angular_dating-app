const express = require('express');
const usersRoute = express.Router();
var jwt = require("jsonwebtoken");
const upload = require("../multer");
const cloudinary = require("../cloudinary");
const Pusher = require("pusher");

// Add your Pusher config from https://pusher.com
const pusher = new Pusher({
  appId: "",
  key: "",
  secret: "",
  cluster: "ap2",
  useTLS: true
});

// Models
const Users = require('../models/Users.js');
const Messages = require('../models/Messages.js');
const Likes = require('../models/Likes.js');


// Register User
usersRoute.route('/register').post((req, res, next) => {
  Users.create(req.body, (error, data) => {
    if (error) {
      return res.status(401).json({ message: `username or email already exists` })
    }
    else {
      res.json(data)
    }

  })
});

// Login User
usersRoute.route('/login').post((req, res) => {
  try {
    Users.findOne({ username: req.body.username }, function (err, data) {
      if (err) throw err;

      if (!data || !data.comparePassword(req.body.password)) {
        return res.status(401).json({ message: `Invalid Username or Password, Try Again..'` })
      }

      return res.json({

        token: jwt.sign({ username: data.username, _id: data._id }, 'RESTFULAPIs', { algorithm: 'HS512' }, { expiresIn: '24h' }),
        username: req.body.username
      });

    });
  }
  catch (err) {
    console.log(err)
  }
});

// Get all users
usersRoute.route('/members').get((req, res) => {
  Users.find((error, data) => {

    if (error) {
      console.log(error)
      throw error;
    }
    else {
      res.json(data)
    }
  })
})

// Get Single Member 
usersRoute.route('/members/:username').get((req, res) => {
  Users.findOne({ username: { $eq: req.params.username } }, (error, data) => {
    if (error) {
      console.log(error)
      throw error;
    }
    else {
      res.json(data)
    }
  })
})


//Update Member Profile
usersRoute.route('/member/edit').put((req, res) => {
  var update = {
    intro: req.body.intro,
    interests: req.body.interests,
    city: req.body.city,
    country: req.body.country
  };

  Users.findOneAndUpdate({ username: req.body.username }, { $set: update }, { upsert: true }, function (error, data) {
    if (error) {
      console.log(error)
      throw error;
    } else {
      res.json(data)
    }
  })
})

//Update Member Password
usersRoute.route('/member/edit/password').put((req, res) => {
  var update = {
    password: req.body.password
  };

  Users.findOneAndUpdate({ username: req.body.username }, { $set: update }, {new: true}, function (error, data) {
    if (error) {
      console.log(error)
      throw error;
    } else {
      res.json(data.save())
    }
  })
})


// Upload Image To Cloudinary & Update Profile Image
usersRoute.put("/member/upload", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    const result = await cloudinary.uploader.upload(file.path);

    var update = {
      profile_img: result.secure_url,
      cloudinary_id: result.public_id,
    };

    Users.findOneAndUpdate({ username: req.body.username }, { $set: update }, { upsert: true }, function (error, data) {
      if (error) {
        console.log(error)
        throw error;
      } else {
        res.status(200).send({ data })
      }
    })
  } catch (err) {
    console.log(err);
  }
});

//Send New Message
usersRoute.route("/messages").post((req, res) => {
  let params = {
    recipientUsername: req.body.recipientUsername,
    senderUsername: req.body.senderUsername,
    content: req.body.content
  }
  Users.findOne({ username: { $eq: req.params.username } }, (error, data) => {
    if (error) {
      console.log(error)
      throw error;
    }
    else {
      pusher.trigger("events-channel", "new-message", {
        recipientUsername: req.body.recipientUsername,
        senderUsername: req.body.senderUsername,
        content: req.body.content
      });
      Messages.create(params);
    }
  })
})


//Get Messages Of Users
usersRoute.route("/messages/thread/:username/:senderUsername").get(async (req, res) => {
  const query = {
    senderUsername: req.params.senderUsername,
    recipientUsername: req.params.username,
  };
  const query2 = {
    senderUsername: req.params.username,
    recipientUsername: req.params.senderUsername,
  };

  const messages = await Messages.find({ $or: [query, query2] }).exec();
  // pusher.trigger(req.params.username, req.params.senderUsername, {
  //   message: "hello"
  // });
  res.json(messages);
});

//Get All Messages
usersRoute.route("/messages").get(async (req, res) => {
  const sender = await Messages.find(req.params.senderUsername).exec();
  const recipient = await Messages.find(req.params.recipientUsername).exec();
  res.json(sender,recipient);
})

// Delete Message
usersRoute.route("/messages/:id").delete((req, res) => {
  Messages.findOneAndDelete({ _id: req.params.id }, (error, data) => {
    if (error) {
      console.log(error)
      throw error;
    }
    else {
      console.log(data);
      res.json(data);
    }
  })
})

// Add Like
usersRoute.route("/likes/:targetUser/:sourceUser").post((req, res) => {

  let params = {
    targetUser: req.params.targetUser,
    sourceUser: req.params.sourceUser,
    targetNsource: req.params.targetUser + req.params.sourceUser
  }
  Likes.create(params, (error, data) => {

    if (error) {
      console.log(error);
      res.status(401).json({ message: `Already Liked ${req.params.targetUser}` })
    }
    else if (req.params.sourceUser == req.params.targetUser) {
      res.status(401).json({ message: `Cant Like Yourself` })
    }

    else {
      return res.json(data);
    }
  })
})

// Dislike
usersRoute.route("/likes/:id").delete((req, res) => {

  Likes.findOneAndDelete({ _id: req.params.id }, (error, data) => {
    if (error) {
      console.log(error)
      throw error;
    }
    else {
      console.log(data);
      res.json(data);
    }
  })
})

//Get All Likes
usersRoute.route("/likes/:sourceUser").get(async (req, res) => {

  const query = { sourceUser: req.params.sourceUser }

  const likes = await Likes.find(query).exec();

  res.json(likes);
})

//Get Who Liked
usersRoute.route("/wholiked/:targetUser").get(async (req, res) => {

  const query = { targetUser: req.params.targetUser }

  const likes = await Likes.find(query).exec();

  res.json(likes);
})


module.exports = usersRoute
