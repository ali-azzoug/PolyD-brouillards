module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        nom_campagne: String,
        objectif: String,
        createdBy: String,
        budget: Number,
        zone_geo: String,
        categorie_ciblage: String,
        image_annonce: String,
        titre_annonce: String,
        description_annonce: String,
        URL_annonce: String,
        created: { type: Date, default: Date.now },
      }
    );
  
    const Annonce = mongoose.model("annonces", schema);
    return Annonce;
  };