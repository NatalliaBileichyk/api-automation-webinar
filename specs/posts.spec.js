'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const api = require('./utils/api');
const data = require('../server/data.json');

describe('Posts', () => {
       
    describe('CREATE', () => {

        afterEach(() => {
            if (newPostsId) {
                //console.log("AFTER newPostsId:" + newPostsId)
                chakram.delete(api.url('posts/' + newPostsId));
            }
        });

        let newPostsId = 0;

            it('should create a new post with all properties', () => {
                const response = chakram.post(api.url('posts'),{
                    userId: 255,
                    id: 300,
                    title: "NEW POST HELLO",
                    body: "NEW POST HAPPY NEW YEAR"
                });
                expect(response).to.have.status(201);
                expect(response).to.have.json('data', posts => {
                    expect(posts.userId).to.be.equal(255);
                    expect(posts.id).to.be.equal(300);
                    expect(posts.title).to.be.equal("NEW POST HELLO");
                    expect(posts.body).to.be.equal("NEW POST HAPPY NEW YEAR");

                    newPostsId = posts.id
                    //console.log("newPostsId:" + newPostsId)
                });
            
                return chakram.wait();
            });

            it('should create a new post without all properties', () => {
                const numberOfposts = data.posts.length;
                const response = chakram.post(api.url('posts'));
               
                expect(response).to.have.status(201);
                expect(response).to.have.json('data', posts => {
                    expect(posts.id).to.be.greaterThan(numberOfposts)

                    newPostsId = posts.id
                    //console.log("newPostsId:" + newPostsId)
                });
                
                return chakram.wait();
            });

            it('should not create a new post with existed id', () => {
                const response = chakram.post(api.url('posts'),{
                    id: data.posts[data.posts.length-1].id
                });
                return expect(response).to.have.status(500);
            });
    
            it('should create a new post with a new id', () => {
                const numberOfposts = data.posts[data.posts.length-1].id
                //console.log("numberOfposts: "+ numberOfposts)
                
                const response = chakram.post(api.url('posts'));
                expect(response).to.have.status(201);
                expect(response).to.have.json('data', posts => {
                    //console.log("response"+ posts.id)
                    expect(posts.id).to.be.equal(numberOfposts + 1);
                    newPostsId = posts.id
                    //console.log("newPostsId:" + newPostsId)
                });
                
                return chakram.wait();
            });  
            
    }); 

    describe('READ', () => {
        it('should return data of posts', () => {
            const numberOfposts = data.posts.length
            const response = chakram.get(api.url('posts'));
            
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', posts => {
                expect(posts.length).to.be.equal(numberOfposts);
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
        
    });

    describe('UPDATE', () => {
        
            it('should update post properties', () => {
                const updatedPostID = 15;
                const response = chakram.put(api.url('posts/' + updatedPostID),{
                    userId: 255,                    
                    title: "I'm updating post",
                    body: "Hello all. A day without smile is ....."
                });
                expect(response).to.have.status(200);
                expect(response).to.have.json('data', posts => {
                    expect(posts.userId).to.be.equal(255);
                    expect(posts.id).to.be.equal(updatedPostID);
                    expect(posts.title).to.be.equal("I'm updating post");
                    expect(posts.body).to.be.equal("Hello all. A day without smile is .....");
                });
            
                return chakram.wait();
            });

            it('should not update post id', () => {
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
                const response = chakram.delete(api.url('posts/10'));
                expect(response).to.have.status(200);
                return response.then(() => {
                    const deletePostById = chakram.get(api.url('posts/10'));
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

describe('Comments', () => {
});

describe('Users', () => {
});

describe('Todos', () => {
});

describe('Photos', () => {
});

describe('Albums', () => {
});
