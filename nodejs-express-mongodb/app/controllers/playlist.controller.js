const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const { json } = require("body-parser");
const Playlist = db.playlists;


// Create and Save a new playlist
exports.create = (req, res) => {
  
    // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a playlist
  const playlist = new Playlist({
    name: req.body.name,
    video_list: [],
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


  // Update a playlist by adding a video in the request
exports.addVideo = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  const myObject = {videoId:"001",titre:"best video",description:"test"};
  const id = req.body.id

  Playlist.findByIdAndUpdate(id, {"$push" :{"video_list" : myObject }})
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found playlist with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving playlist with id=" + id });
    });
  
};

  // GET 1 playlist
  exports.getOnePlaylist = (req, res) => {
  
    const id = req.body.id;
  
    Playlist.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found playlist with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving playlist with id=" + id });
      });
    
  };

   // Update a playlist by adding a video in the request
   exports.getAllVideoFromPlaylist = (req, res) => {
  
    const id = req.body.id;

    Playlist.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found playlist with id " + id });
        else res.send(data.video_list);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving playlist with id=" + id });
      });
    
  };