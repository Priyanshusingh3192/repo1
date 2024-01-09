const mongoose = require("mongoose");

const ProfilePicSchema = mongoose.Schema({
    
    username :{
      type:String,
      required:true
    },
    ImageUrl :{
        type:String,
        required:true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProfilePic", ProfilePicSchema);