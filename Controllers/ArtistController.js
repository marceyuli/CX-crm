const Artist = require('../Models/Artists');

//devuelve todos los artistas en un texto
async function getArtistsInText() {
    let cursor = await Artist.find();
    let artists = "No contamos con mercancia de ese artista, pero tenemos de los siguientes:\n";
    cursor.forEach(element => {
        artists += element.name + "\n";
    });
    artists += "¿Desea de alguno de ellos?"
    return artists;
}

//devuelve un artista por su nombre
async function getArtistByName(artistName) {
    let cursor = await Artist.findOne({ name: artistName });
    return cursor;
}

module.exports = {
    getArtistsInText,
    getArtistByName
}