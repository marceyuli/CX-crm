const Artist = require('../Models/Artists');

async function getArtistsInText(){
    let cursor = await Artist.find();
    let artists = "los artistas disponibles son:\n";
    cursor.forEach(element => {
        artists+=element.name + "\n";
    });
    return artists;
}

module.exports = {
    getArtistsInText,
}