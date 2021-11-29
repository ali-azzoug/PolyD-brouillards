module.exports = app => {
    const playlists = require("../controllers/playlist.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", playlists.create);
  
    // Retrieve all playlists by username
    router.post("/findPlaylists", playlists.FindPlaylistsByUsername);

    app.use('/api/playlists', router);
  };