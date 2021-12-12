const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const Annonce = db.annonces;


// Create and Save a new annonce
exports.create = (req, res) => {
  
    // Validate request
  if (!req.body.nom_campagne || !req.body.budget || !req.body.categorie_ciblage) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Tutorial
  const annonce = new Annonce({
    nom_campagne: req.body.nom_campagne,
    createdBy: req.body.createdBy,
    objectif: req.body.objectif,
    budget: req.body.budget,
    zone_geo: req.body.Zone_geo,
    categorie_ciblage: req.body.categorie_ciblage,
    image_annonce: req.body.Image_annonce,
    titre_annonce: req.body.titre_annonce,
    description_annonce: req.body.description_annonce,
    URL_annonce: req.body.URL_annonce,
    updated: new Date,
  });

  // Save annonce in the database
  annonce
    .save(annonce)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the annonce."
      });
    });
};



// get a random annonce
exports.getRandomAnnonce = (req, res) => {
  
  Annonce.aggregate([{ $sample: { size: 1 } }])
  .then(data => {
    if (!data)
      res.status(404).send({ message: "Not found random annonce with id "});
    else res.send(data);
  })
  .catch(err => {
    res
      .status(500)
      .send({ message: "Error retrieving random annonce"});
  });
};
