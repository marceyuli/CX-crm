const Artist = require('../Models/Artists');

async function getArtists(){
    cursor = Artist.find();
    await cursor.forEach(console.dir);
    console.log('zzzzzz');
    console.log();
}

module.exports = {
    getArtists,
}