const Artist = require('../Models/Artists');

async function getArtistsInText(){
    let cursor = await Artist.find();
    console.log(cursor);
    let artists = "los artistas disponibles son:\n";
    cursor.forEach(element => {
        artists+=element.name + "\n";
    });
    return artists;
}

async function getArtist(artistName){
    let cursor = await Artist.find({name:artistName});
    console.log(cursor);
    return cursor;
}

module.exports = {
    getArtistsInText,
    getArtist
}