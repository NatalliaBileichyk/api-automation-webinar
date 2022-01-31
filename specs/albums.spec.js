'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const api = require('./utils/api');
const data = require('../server/data.json');

describe('Albums', () => {
       
    describe('CREATE', () => {

        afterEach(() => {
            if (newAlbumsId) {                
                chakram.delete(api.url('albums/' + newAlbumsId));
            }
        });

        let newAlbumsId = 0;

        it('should create a new album with a new id', () => {
            const numberOfAlbums = data.albums[data.albums.length-1].id
            const response = chakram.post(api.url('albums'));
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', albums => {
                expect(albums.id).to.be.equal(numberOfAlbums + 1);
                newAlbumsId = albums.id
            });
            return chakram.wait();
        });        

        it('should create a new album with \"userId\" property', () => {
            const numberOfAlbums = data.albums.length;
            const response = chakram.post(api.url('albums'),{
                userId: 10
            });
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', albums => {
                expect(albums.userId).to.be.equal(10);
                expect(albums.id).to.be.greaterThan(numberOfAlbums) 
                newAlbumsId = albums.id
            });
        
            return chakram.wait();
        });

        it('should create a new album without all properties', () => {
            const numberOfAlbums = data.albums.length;
            const response = chakram.post(api.url('albums'));        
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', albums => {
                expect(albums.id).to.be.greaterThan(numberOfAlbums)
                newAlbumsId = albums.id                
            });            
            return chakram.wait();
        });

        it('should not create a new album with existed id', () => {
            const response = chakram.post(api.url('albums'),{
                id: data.albums[data.albums.length-1].id
            });
            return expect(response).to.have.status(500);
        });
        
    }); 

    describe('READ', () => {
        it('should return data of albums', () => {
            const numberOfAlbums = data.albums.length
            const response = chakram.get(api.url('albums'));
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', albums => {
                expect(albums.length).to.be.equal(numberOfAlbums);
            });
            return chakram.wait();
        });

        it('should return data of required post', () => {
            const requiredAlbumID = 19;
            const response = chakram.get(api.url('albums/' + requiredAlbumID));            
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', albums => {
                expect(albums.id).to.be.equal(requiredAlbumID);                
            });
            return chakram.wait();
        });

        it('should return data of albums from _start to _end', () => {
            const startNumber = data.albums.length - 2
            const endNumber = data.albums.length
            const response = chakram.get(api.url('albums?_start=' + startNumber +'&_end=' + endNumber));
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', albums => {
                expect(albums.length).to.be.equal(endNumber - startNumber);
            });
            return chakram.wait();
        });

        it('should return album with required \"title\"', () => {
            const neccessaryTitle = "eaque aut omnis a";            
            const response = chakram.get(api.url('albums?title_like=' + neccessaryTitle));

            expect(response).to.have.status(200);
            expect(response).to.have.json('data', albums => {
                expect(albums[0].title).to.be.equal(neccessaryTitle);
            });
            return chakram.wait();
        });
        
    });

    describe('UPDATE', () => {        
        it('should update \"userId\" property of the album', () => {
            const updatedAlbumID = 15;
            const response = chakram.put(api.url('albums/' + updatedAlbumID),{
                userId: 200000000
            });
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', albums => {
                expect(albums.id).to.be.equal(updatedAlbumID);
                expect(albums.userId).to.be.equal(200000000);
            });        
            return chakram.wait();
        });

        it('should update \"title\" property of the album', () => {
            const updatedAlbumID = 35;
            const response = chakram.put(api.url('albums/' + updatedAlbumID),{
                title: "I'm updating an interesting album"
            });
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', albums => {
                expect(albums.id).to.be.equal(updatedAlbumID);
                expect(albums.title).to.be.equal("I'm updating an interesting album");
            });        
            return chakram.wait();
        });

        it('should not update \"id\" property of the album', () => {
            const updatedAlbumID = data.albums[data.albums.length-1].id;
            const newAlbumID = updatedAlbumID + 10;                

            const response = chakram.put(api.url('albums/' + updatedAlbumID),{
                id: newAlbumID,
                title: "I'm trying to update album once more ..."
            });

            expect(response).to.have.status(200);
            expect(response).to.have.json('data', albums => {
                expect(albums.id).not.to.be.equal(newAlbumID);
                expect(albums.id).to.be.equal(updatedAlbumID);
                expect(albums.title).to.be.equal("I'm trying to update album once more ...");
            });

            return chakram.wait();
        });

        it('updated album should have only specified properties', () => {
            const updatedAlbumID = data.albums[0].id;
            const response = chakram.put(api.url('albums/' + updatedAlbumID),{
                userId: 255
            });
            
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', albums => {
                expect(albums.id).to.be.equal(updatedAlbumID);
                expect(albums.userId).to.be.equal(255);
            });
            expect(response).not.to.have.json('data', albums => {
                expect(albums.title)
                expect(albums.body)
            })

            return chakram.wait();
        });

        it('should throw an error for using not existed album id', () => {
            const updatedAlbumID = data.albums[data.albums.length-1].id + 1000;
            const response = chakram.put(api.url('albums/' + updatedAlbumID),{
                title: "I'm trying to update album once more ..."
            });
            return expect(response).to.have.status(404);
        });
    });
    
    describe('DELETE', () => {
        const deletedAlbumID = data.albums[data.albums.length-1].id;
        it('should delete a album by using existed ID', () => {
            const response = chakram.delete(api.url('albums/' + deletedAlbumID));
            expect(response).to.have.status(200);
            return response.then(() => {
                const deleteAlbumByID = chakram.get(api.url('albums/' + deletedAlbumID));
                expect(deleteAlbumByID).to.have.status(404);
                return chakram.wait();
            });
        });

        it('should throw error if the album ID does not exist', () => {
            const response = chakram.delete(api.url('albums/0'));
            expect(response).to.have.status(404);
            return chakram.wait();
        });
    });
    
});