module.exports = app => {
    const annonces = require("../controllers/annonce.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", annonces.create);
  
    // Retrieve all playlists by username
    //router.post("/findAnnonce", annonces.FindAnnonces);

    app.use('/api/annonces', router);
  };