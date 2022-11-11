const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

// Define collection and schema
var userSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },

  gender: {
    type: String,
    required: true
  },

  dateOfBirth: {
    type: Date,
    required: true
  },

  city: {
    type: String,
    required: true
  },

  country: {
    type: String,
    required: true
  },

  intro: {
    type: String
  },

  interests: {
    type: String
  },

  profile_img: String,

  cloudinary_id: String,

  saltSecret: String,
},
  {
    collection: 'users',
    timestamps: true
  },
);

userSchema.pre('save', function (next) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {

      if (err) throw err;

      this.password = hash;
      this.saltSecret = salt;

      next();
    });
  });
});


userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Users', userSchema)

