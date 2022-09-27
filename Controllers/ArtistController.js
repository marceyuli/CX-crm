const Artist = require('../Models/Artists');

//devuelve todos los artistas en un texto
async function getArtistsInText() {
    let cursor = await Artist.find();
    let artists = "los artistas disponibles son:\n";
    cursor.forEach(element => {
        artists += element.name + "\n";
    });
    return artists;
}

//devuelve un artista por su nombre
async function getArtist(artistName) {
    let cursor = await Artist.findOne({ name: artistName });
    return cursor;
}

module.exports = {
    getArtistsInText,
    getArtist
}