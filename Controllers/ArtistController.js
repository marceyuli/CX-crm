const Artist = require('../Models/Artists');

async function getArtists(){
    let cursor = Artist.find();
    console.log(Artist.findOne({name:"Harry Styles"}));
    console.log(cursor.all());
    // await cursor.forEach(console.dir);
    console.log('cuantos cursores hay');
    console.log(cursor.size());
    
    console.log('zzzzzz');
}

module.exports = {
    getArtists,
}