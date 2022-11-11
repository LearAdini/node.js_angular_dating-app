const mongoose = require('mongoose');

// Define collection and schema
var messageSchema = new mongoose.Schema({

  id: {
    type: Number,
  },

  senderId: {
    type: Number
  },

  senderUsername: {
    type: String
  },

  recipientId: {
    type: Number
  },

  recipientUsername: {
    type: String
  },

  content: {
    type: String,
    required:true
  },

},
  {
    collection: 'messages',
    timestamps: true
  },
);

module.exports = mongoose.model('Messages', messageSchema)

