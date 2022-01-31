'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const api = require('./utils/api');
const data = require('../server/data.json');

describe('Posts', () => {
       
    describe('CREATE', () => {

        afterEach(() => {
            if (newPostsId) {                
                chakram.delete(api.url('posts/' + newPostsId));
            }
        });

        let newPostsId = 0;

        it('should create a new post with a new id', () => {
            const numberOfPosts = data.posts[data.posts.length-1].id
            const response = chakram.post(api.url('posts'));
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', posts => {
                expect(posts.id).to.be.equal(numberOfPosts + 1);
                newPostsId = posts.id
            });
            return chakram.wait();
        });        

        it('should create a new post with \"userId\" property', () => {
            const numberOfPosts = data.posts.length;
            const response = chakram.post(api.url('posts'),{
                userId: 255
            });
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', posts => {
                expect(posts.userId).to.be.equal(255);
                expect(posts.id).to.be.greaterThan(numberOfPosts) 
                newPostsId = posts.id
            });
        
            return chakram.wait();
        });

        it('should create a new post with \"title\" property', () => {
            const numberOfPosts = data.posts.length;
            const response = chakram.post(api.url('posts'),{
                title: "NEW POST HELLO",
            });
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', posts => {
                expect(posts.title).to.be.equal("NEW POST HELLO");
                expect(posts.id).to.be.greaterThan(numberOfPosts) 
                newPostsId = posts.id
            });
        
            return chakram.wait();
        });

        it('should create a new post with \"body\" property', () => {
            const numberOfPosts = data.posts.length;
            const response = chakram.post(api.url('posts'),{
                body: "NEW POST HAPPY NEW YEAR",
            });
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', posts => {
                expect(posts.body).to.be.equal("NEW POST HAPPY NEW YEAR");
                expect(posts.id).to.be.greaterThan(numberOfPosts) 
                newPostsId = posts.id
            });
        
            return chakram.wait();
        });

        it('should create a new post without all properties', () => {
            const numberOfPosts = data.posts.length;
            const response = chakram.post(api.url('posts'));        
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', posts => {
                expect(posts.id).to.be.greaterThan(numberOfPosts)
                newPostsId = posts.id                
            });            
            return chakram.wait();
        });

        it('should not create a new post with existed id', () => {
            const response = chakram.post(api.url('posts'),{
                id: data.posts[data.posts.length-1].id
            });
            return expect(response).to.have.status(500);
        });
        
    }); 

    describe('READ', () => {
        it('should return data of posts', () => {
            const numberOfPosts = data.posts.length
            const response = chakram.get(api.url('posts'));
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', posts => {
                expect(posts.length).to.be.equal(numberOfPosts);
            });
            return chakram.wait();
        });

        it('should return data of required post', () => {
            const requiredPostID = 15;
            const response = chakram.get(api.url('posts/' + requiredPostID));            
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', posts => {
                expect(posts.id).to.be.equal(requiredPostID);                
            });
            return chakram.wait();
        });

        it('should return data of posts from _start to _end', () => {
            const startNumber = data.posts.length - 20
            const endNumber = data.posts.length
            const response = chakram.get(api.url('posts?_start=' + startNumber +'&_end=' + endNumber));
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', posts => {
                expect(posts.length).to.be.equal(endNumber - startNumber);
            });
            return chakram.wait();
        });

        it('should return data of limited number of posts', () => {
            const startNumber = data.posts[5]
            const limit = data.posts.length
            const response = chakram.get(api.url('posts?_start=' + startNumber +'&_limit' + limit));
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', posts => {
                expect(posts.length).to.be.equal(limit);
            });
            return chakram.wait();
        });
        
    });

    describe('UPDATE', () => {        
        it('should update \"userId\" property of the post', () => {
            const updatedPostID = 15;
            const response = chakram.put(api.url('posts/' + updatedPostID),{
                userId: 255
            });
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', posts => {
                expect(posts.id).to.be.equal(updatedPostID);
                expect(posts.userId).to.be.equal(255);
            });        
            return chakram.wait();
        });

        it('should update \"title\" property of the post', () => {
            const updatedPostID = 35;
            const response = chakram.put(api.url('posts/' + updatedPostID),{
                title: "I'm updating post"
            });
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', posts => {
                expect(posts.id).to.be.equal(updatedPostID);
                expect(posts.title).to.be.equal("I'm updating post");
            });        
            return chakram.wait();
        });

        it('should update \"body\" property of the post', () => {
            const updatedPostID = 67;
            const response = chakram.put(api.url('posts/' + updatedPostID),{
                body: "Hello all. A day without smile is ....."
            });
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', posts => {
                expect(posts.id).to.be.equal(updatedPostID);
                expect(posts.body).to.be.equal("Hello all. A day without smile is .....");
            });        
            return chakram.wait();
        });

        it('should not update \"id\" property of the post', () => {
            const updatedPostID = data.posts[data.posts.length-1].id;
            const newPostID = updatedPostID + 10;                

            const response = chakram.put(api.url('posts/' + updatedPostID),{
                id: newPostID,
                title: "I'm trying to update post once more ..."
            });

            expect(response).to.have.status(200);
            expect(response).to.have.json('data', posts => {
                expect(posts.id).not.to.be.equal(newPostID);
                expect(posts.id).to.be.equal(updatedPostID);
                expect(posts.title).to.be.equal("I'm trying to update post once more ...");
            });

            return chakram.wait();
        });

        it('updated post should have only specified properties', () => {
            const updatedPostID = data.posts[0].id;
            const response = chakram.put(api.url('posts/' + updatedPostID),{
                userId: 255
            });
            
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', posts => {
                expect(posts.id).to.be.equal(updatedPostID);
                expect(posts.userId).to.be.equal(255);
            });
            expect(response).not.to.have.json('data', posts => {
                expect(posts.title)
                expect(posts.body)
            })

            return chakram.wait();
        });

        it('should throw an error for using not existed post id', () => {
            const updatedPostID = data.posts[data.posts.length-1].id + 1000;
            const response = chakram.put(api.url('posts/' + updatedPostID),{
                title: "I'm trying to update post once more ..."
            });
            return expect(response).to.have.status(404);
        });
    });
    
    describe('DELETE', () => {
        it('should delete a post by using existed ID', () => {
            const deletedPostID = 94;
            const response = chakram.delete(api.url('posts/' + deletedPostID));
            expect(response).to.have.status(200);
            return response.then(() => {
                const deletePostById = chakram.get(api.url('posts/' + deletedPostID));
                expect(deletePostById).to.have.status(404);
                return chakram.wait();
            });
        });

        it('should throw error if the post ID does not exist', () => {
            const response = chakram.delete(api.url('posts/0'));
            expect(response).to.have.status(404);
            return chakram.wait();
        });
    });
    
});