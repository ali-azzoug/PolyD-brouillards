module.exports = app => {
    const playlists = require("../controllers/playlist.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", playlists.create);
  
    // Retrieve all playlists by username
    router.post("/findPlaylists", playlists.FindPlaylistsByUsername);

  // Retrieve all playlists by username
    router.post("/addVideo", playlists.addVideo);

    router.post("/getOnePlaylist/", playlists.getOnePlaylist);

    router.post("/getAllVideoFromPlaylist/", playlists.getAllVideoFromPlaylist);

    router.post("/removeVideo", playlists.deleteVideo);

    router.post("/updateName", playlists.ChangePlaylistName);

    router.post("/updateImage", playlists.ChangePlaylistUrl);

    router.post("/deletePlaylist", playlists.deletePlaylist);

    app.use('/api/playlists', router);
  };