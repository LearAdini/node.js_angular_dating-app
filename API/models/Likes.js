const mongoose = require('mongoose');

var likeSchema = new mongoose.Schema({
  sourceUser: {
    type: String
  },

  targetUser: {
    type: String,
  },
  
  targetNsource:{
    type: String,
     unique: true
  }
},
  {
    collection: 'likes'
  },
);

module.exports = mongoose.model('Likes', likeSchema)

