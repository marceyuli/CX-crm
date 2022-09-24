const Artist = require('../Models/Artists');
async function getArtists(){
    console.log((await Artist.find({})).values('name'));
    console.log('zzzzzz');
    console.log(Artist.find()[1]);
}

module.exports = {
    getArtists,
}