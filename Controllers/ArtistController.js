const Artist = require('../Models/Artists');

async function getArtists(){
    let cursor = await Artist.find();
    console.log(Artist.find({name:"Harry Styles"}));
    console.log(cursor);
    // await cursor.forEach(console.dir);
    console.log('cuantos cursores hay');
    console.log(cursor.size());
    cursor.forEach(function(err,item){
        console.log(item);
    });
    cursor.forEach(console.dir)
    console.log('zzzzzz');
}

module.exports = {
    getArtists,
}