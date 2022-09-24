const Artist = require('../Models/Artists');

async function getArtists(){
    let cursor = Artist.find();
    console.log(cursor);
    // await cursor.forEach(console.dir);
    console.log('cuantos cursores hay');
    console.log(cursor.count());
    
    console.log('zzzzzz');
    cursor.forEach(element => {
        console.log(element);
    });
}

module.exports = {
    getArtists,
}