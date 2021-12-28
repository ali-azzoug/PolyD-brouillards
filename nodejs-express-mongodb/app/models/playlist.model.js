module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        name: String,
        created_by: String,
        video_list: [{
          videoId : String,
          titre : String,
          description : String,
          embed_url: String,
          thumbnail_url: String,
          source: String
          }],
        updated: { type: Date, default: Date.now },
      }
    );
  
    const Playlist = mongoose.model("playlist", schema);
    return Playlist;
  };