const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

exports.getAllUsers = async (req, res) => {
  await User.find()
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        users: docs.map((doc) => {
          return {
            _id: doc._id,
            username: doc.username,
            email: doc.email,
            request: {
              type: "GET",
              url: "http://localhost:3000/users/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.getUserbyId = async (req, res) => {
  const id = req.params.userId;
  await User.findById(id)
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          name: doc.username,
          email: doc.email,
          request: {
            type: "GET",
            url: "http://localhost:3000/users",
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to get user" });
});
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json({
        message: "Authentication failed",
      });
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(401).json({
        message: "Authentication failed",
      });
    }
    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );
    return res.status(200).json({
      message: "Authentication successful",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.signup = async (req, res) => {
   const { username, password, email } = req.body;
   try {
     const user = await User.exists({ email: email });
     if (user) {
       return res.status(409).json({
         message: "User already exists",
       });
     }
   } catch (error) {
     return res.status(500).json({
       message: error.message,
     });
   }
   try {
     await bcrypt.hash(password, 16, (err, hash) => {
       if (err) {
         return res.status(500).json({
           error: err,
         });
       } else {
         const user = new User({
           _id: new mongoose.Types.ObjectId(),
           username: username,
           email: email,
           password: hash,
         });
         user
           .save()
           .then((result) => {
             res.status(201).json({
               message: "User created",
               createdUser: {
                 _id: result._id,
                 username: result.username,
                 email: result.email,
               },
               request: {
                 type: "GET",
                 url: "http://localhost:3000/users/" + result._id,
               },
             });
           })
           .catch((err) => {
             res.status(500).json({
               error: err,
             });
           });
       }
     });
   } catch (err) {
     return res.status(500).json({
       error: err,
     });
   }
 };

exports.deleteUser = async (req, res) => {
  const id = req.params.userId;
  await User.findByIdAndDelete(id)
    .exec()
    .then((result) => {
      res.status(200).json({
        message: `User with id ${id} deleted`,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};