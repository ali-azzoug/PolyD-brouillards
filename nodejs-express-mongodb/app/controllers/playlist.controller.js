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

  if(!req.body.playlist_url){
    req.body.playlist_url = "https://decizia.com/blog/wp-content/uploads/2017/06/default-placeholder.png";
  }

  // Create a playlist
  const playlist = new Playlist({
    name: req.body.name,
    video_list: [],
    playlist_url:req.body.playlist_url,
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

  // Change name of playlist
exports.ChangePlaylistName = (req, res) => {

  const id = req.body.idPlaylist

  Playlist.findByIdAndUpdate(id, {"name" : req.body.newName} )
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

  // Change url image of playlist
  exports.ChangePlaylistUrl = (req, res) => {

    const id = req.body.idPlaylist
  
    Playlist.findByIdAndUpdate(id, {"playlist_url" : req.body.newUrl} )
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
  const myObject = {
    videoId: req.body.videoId,
    titre: req.body.titre,
    description: req.body.description,
    embed_url: req.body.embed_url,
    thumbnail_url: req.body.thumbnail_url,
    source: req.body.source
  };
  const id = req.body.idPlaylist

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
  
    const id = req.body.idPlaylist;
  
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
  
    const id = req.body.idPlaylist;

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

  exports.deleteVideo = (req, res) => {
    const id = req.body.idPlaylist;
    const videoId = req.body.videoId;

    Playlist.findByIdAndUpdate(id, {"$pull" : {"video_list" : {"videoId": videoId} }})
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete video with id=${id}. Maybe video was not found!`
          });
        } else {
          res.send({
            message: "Video was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Video with id=" + id
        });
      });
  };


  exports.deletePlaylist = (req, res) => {
    const id = req.body.idPlaylist;

    Playlist.deleteOne({ "_id" : id})
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete playlist with id=${id}. Maybe video was not found!`
          });
        } else {
          res.send({
            message: "Playlist was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Playlist with id=" + id
        });
      });
  };
