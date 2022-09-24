const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    name: String
},);

module.exports = mongoose.model('artists', ArtistSchema);