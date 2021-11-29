module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        name: String,
        created_by: String,
        video_list: [mongoose.Schema.Types.ObjectId],
        updated: { type: Date, default: Date.now },
      }
    );
  
    const Playlist = mongoose.model("playlist", schema);
    return Playlist;
  };