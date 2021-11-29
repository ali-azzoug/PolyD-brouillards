const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

// Ajouter tous les modeles ici !
// db.tutorials = require("./tutorial.model.js")(mongoose);
db.user = require("./user.model.js");
db.role = require("./role.model");
db.playlists = require("./playlist.model.js")(mongoose);
db.annonces = require("./annonce.model.js")(mongoose);

db.ROLES = ["user", "admin", "annonceur"];

module.exports = db;