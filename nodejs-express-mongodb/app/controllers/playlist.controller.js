const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const Playlist = db.playlists;


// Create and Save a new playlist
exports.create = (req, res) => {
  
    //let token = req.headers["x-access-token"];
    //const decodedToken = jwt.verify(token, config.secret);
    
    // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Tutorial
  const playlist = new Playlist({
    name: req.body.name,
    video_list: null,
    created_by: req.body.createdBy,
    updated: new Date,
  });

  // Save playlist in the database
  playlist
    .save(playlist)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the playlist."
      });
    });
};

// Find All playlists by users
exports.FindPlaylistsByUsername = (req, res) => {
    Playlist.find({ created_by: req.body.createdBy})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving playlists."
        });
      });
  };