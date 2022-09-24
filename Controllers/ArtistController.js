const Artist = require('../Models/Artists');

async function getArtists(){
    let cursor = Artist.find();
    console.log(cursor);
    // await cursor.forEach(console.dir);
    console.log('zzzzzz');
    // console.log();
}

module.exports = {
    getArtists,
}