'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const api = require('./utils/api');
const data = require('../server/data.json');

describe('Comments', () => {
       
    describe('CREATE', () => {

        afterEach(() => {
            if (newCommentsId) {                
                chakram.delete(api.url('comments/' + newCommentsId));
            }
        });

        let newCommentsId = 0;

        it('should create a new comment with a new id', () => {
            const numberOfComments = data.comments[data.comments.length-1].id
            const response = chakram.post(api.url('comments'));
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', comments => {
                expect(comments.id).to.be.equal(numberOfComments + 1);
                newCommentsId = comments.id
            });
            return chakram.wait();
        });        

        it('should create a new comment with \"postId\" property', () => {
            const numberOfComments = data.comments.length;
            const response = chakram.post(api.url('comments'),{
                postId: 255
            });
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', comments => {
                expect(comments.postId).to.be.equal(255);
                expect(comments.id).to.be.greaterThan(numberOfComments) 
                newCommentsId = comments.id
            });
        
            return chakram.wait();
        });

        it('should create a new comment with \"name\" property', () => {
            const numberOfComments = data.comments.length;
            const newName = "Do you like to write comments, feedback or complains"
            const response = chakram.post(api.url('comments'),{
                name: newName,
            });
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', comments => {
                expect(comments.name).to.be.equal(newName);
                expect(comments.id).to.be.greaterThan(numberOfComments) 
                newCommentsId = comments.id
            });
        
            return chakram.wait();
        });

        it('should create a new comment with \"body\" property', () => {
            const numberOfComments = data.comments.length;
            const response = chakram.post(api.url('comments'),{
                body: "HAPPY NEW YEAR",
            });
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', comments => {
                expect(comments.body).to.be.equal("HAPPY NEW YEAR");
                expect(comments.id).to.be.greaterThan(numberOfComments) 
                newCommentsId = comments.id
            });
        
            return chakram.wait();
        });

        it('should create a new comment with \"email\" property', () => {
            const numberOfComments = data.comments.length;
            const newEmail = "Natallia_Bileichyk@epam.com";
            const response = chakram.post(api.url('comments'),{
                email: newEmail,
            });
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', comments => {
                expect(comments.email).to.be.equal(newEmail);
                expect(comments.id).to.be.greaterThan(numberOfComments) 
                newCommentsId = comments.id
            });
        
            return chakram.wait();
        });

        it('should create a new comment without all properties', () => {
            const numberOfComments = data.comments.length;
            const response = chakram.post(api.url('comments'));        
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', comments => {
                expect(comments.id).to.be.greaterThan(numberOfComments)
                newCommentsId = comments.id                
            });            
            return chakram.wait();
        });

        it('should not create a new comment with existed id', () => {
            const response = chakram.post(api.url('comments'),{
                id: data.comments[data.comments.length-1].id
            });
            return expect(response).to.have.status(500);
        });
        
    }); 

    describe('READ', () => {
        it('should return data of all comments', () => {
            const numberOfComments = data.comments.length
            const response = chakram.get(api.url('comments'));
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', comments => {
                expect(comments.length).to.be.equal(numberOfComments);
            });
            return chakram.wait();
        });

        it('should return data of required comment', () => {
            const requiredCommentID = 15;
            const response = chakram.get(api.url('comments/' + requiredCommentID));            
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', comments => {
                expect(comments.id).to.be.equal(requiredCommentID);                
            });
            return chakram.wait();
        });

        it('should return data of comments excluding a particular ID', () => {
            const exceptID = 1
            const response = chakram.get(api.url('comments?id_ne=' + exceptID));
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', comments => {                
                expect(comments[0].id).not.to.be.equal(exceptID);
            });
            return chakram.wait();
        });
        
    });

    describe('UPDATE', () => {        
        it('should update \"postId\" property of the comment', () => {
            const updatedCommentID = 15;
            const newPostID = 255000000;
            const response = chakram.put(api.url('comments/' + updatedCommentID),{
                postId: newPostID
            });
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', comments => {
                expect(comments.id).to.be.equal(updatedCommentID);
                expect(comments.postId).to.be.equal(newPostID);
            });        
            return chakram.wait();
        });

        it('should update \"name\" property of the comment', () => {
            const updatedCommentID = 35;
            const response = chakram.put(api.url('comments/' + updatedCommentID),{
                name: "I'm updating wait I want"
            });
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', comments => {
                expect(comments.id).to.be.equal(updatedCommentID);
                expect(comments.name).to.be.equal("I'm updating wait I want");
            });        
            return chakram.wait();
        });

        it('should update \"body\" property of the comment', () => {
            const updatedCommentID = 67;
            const response = chakram.put(api.url('comments/' + updatedCommentID),{
                body: "Hello all. A day without smile is ....."
            });
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', comments => {
                expect(comments.id).to.be.equal(updatedCommentID);
                expect(comments.body).to.be.equal("Hello all. A day without smile is .....");
            });        
            return chakram.wait();
        });

        it('should not update \"id\" property of the comment', () => {
            const updatedCommentID = data.comments[data.comments.length-1].id;
            const newCommentID = updatedCommentID + 10;                

            const response = chakram.put(api.url('comments/' + updatedCommentID),{
                id: newCommentID,
                name: "I'm trying to update comment ..."
            });

            expect(response).to.have.status(200);
            expect(response).to.have.json('data', comments => {
                expect(comments.id).not.to.be.equal(newCommentID);
                expect(comments.id).to.be.equal(updatedCommentID);
                expect(comments.name).to.be.equal("I'm trying to update comment ...");
            });

            return chakram.wait();
        });

        it('updated comment should have only specified properties', () => {
            const updatedCommentID = data.comments[0].id;
            const response = chakram.put(api.url('comments/' + updatedCommentID),{
                postId: 255
            });
            
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', comments => {
                expect(comments.id).to.be.equal(updatedCommentID);
                expect(comments.postId).to.be.equal(255);
            });
            expect(response).not.to.have.json('data', comments => {
                expect(comments.name)
                expect(comments.body)
                expect(comments.email)
            })

            return chakram.wait();
        });

        it('should throw an error for using not existed comment id', () => {
            const updatedCommentID = data.comments[data.comments.length-1].id + 1000;
            const response = chakram.put(api.url('comments/' + updatedCommentID),{
                name: "I'm trying to update comment once more ..."
            });
            return expect(response).to.have.status(404);
        });
    });
    
    describe('DELETE', () => {
        it('should delete a comment by using existed ID', () => {
            const deletedCommentID = 60;
            const response = chakram.delete(api.url('comments/' + deletedCommentID));
            expect(response).to.have.status(200);
            return response.then(() => {
                const deleteCommentById = chakram.get(api.url('comments/' + deletedCommentID));
                expect(deleteCommentById).to.have.status(404);
                return chakram.wait();
            });
        });

        it('should throw error if the comment ID does not exist', () => {
            const notExistedID = -5;
            const response = chakram.delete(api.url('comments/' + notExistedID));
            expect(response).to.have.status(404);
            return chakram.wait();
        });
    });
    
});
