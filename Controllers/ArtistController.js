const Artist = require('../Models/Artists');

async function getArtists(){
    let cursor = Artist.find();
    console.log(cursor);
    // await cursor.forEach(console.dir);
    console.log('zzzzzz');
    console.log(cursor.count());
    
    console.log('zzzzzz');
    cursos.forEach(element => {
        console.log(element);
    });
}

module.exports = {
    getArtists,
}