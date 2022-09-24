const Artist = require('../Models/Artists');
async function getArtists(){
    console.log(Artist.find({}));
}

module.exports = {
    getArtists,
}