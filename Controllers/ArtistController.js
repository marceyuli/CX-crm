const Artist = require('../Models/Artists');

async function getArtists(){
    let cursor = Artist.find();
    console.log(Artist.find({name:"Harry Styles"}));
    console.log(cursor[1]);
    // await cursor.forEach(console.dir);
    console.log('cuantos cursores hay');
    console.log(cursor.count);
    
    console.log('zzzzzz');
}

module.exports = {
    getArtists,
}