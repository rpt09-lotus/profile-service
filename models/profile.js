const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Profile Schema
const ProfileSchema = new Schema({
  _id: {
    type: Number,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  dateJoined: {
    type: String,
    default: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
      Date.now()
    ),
    required: true
  },
  bio: {
    type: String
  },
  photoUrl: {
    type: String
  },
  pro: {
    type: Boolean,
    required: true
  },
  activities: [String]
});

module.exports = Profile = mongoose.model('Profile', ProfileSchema);
