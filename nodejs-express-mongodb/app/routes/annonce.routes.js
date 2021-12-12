module.exports = app => {
    const annonces = require("../controllers/annonce.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Annonce
    router.post("/", annonces.create);
  
    // Retrieve a random annonce 
    router.post("/getAnnonce", annonces.getRandomAnnonce);

    app.use('/api/annonces', router);
  };