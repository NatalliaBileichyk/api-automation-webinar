'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const api = require('./utils/api');
const data = require('../server/data.json');
const arrayEqual = require('../server/arrayEqual.js');

describe('Users', () => {
       
    describe('CREATE', () => {

        afterEach(() => {
            if (newUsersId) {                
                chakram.delete(api.url('users/' + newUsersId));
            }
        });

        let newUsersId = 0;

        it('should create a new user with a new id', () => {
            const numberOfUsers = data.users[data.users.length-1].id
            const response = chakram.post(api.url('users'));
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', users => {
                expect(users.id).to.be.equal(numberOfUsers + 1);
                newUsersId = users.id
            });
            return chakram.wait();
        });        

        it('should create a new user with \"name\" and \"username\" properties', () => {
            const numberOfUsers = data.users.length;
            const newName = "Natallia";
            const newUserName = "Natallia.Bileichyk";
            const response = chakram.post(api.url('users'),{
                name: newName,
                username: newUserName
            });
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', users => {
                expect(users.name).to.be.equal(newName);
                expect(users.username).to.be.equal(newUserName);
                expect(users.id).to.be.greaterThan(numberOfUsers) 
                newUsersId = users.id
            });
        
            return chakram.wait();
        });

        it('should create a new user by address', () => {
            const numberOfUsers = data.users.length;
            const newAddress = {
                street: "Lubimova",
                city: "Minsk",
                country: "Belarus",
                zipcode: "220117"
            };
            const response = chakram.post(api.url('users'),{
                address: newAddress
            });
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', users => {
                expect(arrayEqual(users, newAddress))
                expect(users.id).to.be.greaterThan(numberOfUsers) 
                newUsersId = users.id
            });
        
            return chakram.wait();
        });

        it('should create a new user without all properties', () => {
            const numberOfUsers = data.users.length;
            const response = chakram.post(api.url('users'));        
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', users => {
                expect(users.id).to.be.greaterThan(numberOfUsers)
                newUsersId = users.id                
            });            
            return chakram.wait();
        });

        it('should not create a new user with existed id', () => {
            const response = chakram.post(api.url('users'),{
                id: data.users[data.users.length-1].id
            });
            return expect(response).to.have.status(500);
        });
        
    }); 

    describe('READ', () => {
        it('should return data of users', () => {
            const numberOfUsers = data.users.length
            const response = chakram.get(api.url('users'));
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', users => {
                expect(users.length).to.be.equal(numberOfUsers);
            });
            return chakram.wait();
        });

        it('should return data of required user', () => {
            const requiredUserID = 6;
            const response = chakram.get(api.url('users/' + requiredUserID));            
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', users => {
                expect(users.id).to.be.equal(requiredUserID);    
            });
            return chakram.wait();
        });

        it('should return users from required part of website', () => {
            const requiredPart = ".net";
            const response = chakram.get(api.url('users/?website_like=' + requiredPart));            
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', users => {
                expect(users.every(el => el.website == "requiredPart"));            
            });
            return chakram.wait();
        });
        
    });

    describe('UPDATE', () => {        
        it('should update \"username\" property of the user', () => {
            const updatedUserID = 2;
            const response = chakram.put(api.url('users/' + updatedUserID),{
                username: "I am a user"
            });
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', users => {
                expect(users.id).to.be.equal(updatedUserID);
                expect(users.username).to.be.equal("I am a user");
            });        
            return chakram.wait();
        });

        it('should not update \"id\" property of the user', () => {
            const updatedUserID = data.users[data.users.length-1].id;
            const newUserID = updatedUserID + 10;                

            const response = chakram.put(api.url('users/' + updatedUserID),{
                id: newUserID,
                title: "I'm trying to update user ID ..."
            });

            expect(response).to.have.status(200);
            expect(response).to.have.json('data', users => {
                expect(users.id).not.to.be.equal(newUserID);
                expect(users.id).to.be.equal(updatedUserID);
                expect(users.title).to.be.equal("I'm trying to update user ID ...");
            });

            return chakram.wait();
        });

        it('updated user should have only specified properties', () => {
            const updatedUserID = data.users[0].id;
            const newName = "Natallia";
            const response = chakram.put(api.url('users/' + updatedUserID),{
                name: newName
            });
            
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', users => {
                expect(users.id).to.be.equal(updatedUserID);
                expect(users.name).to.be.equal(newName);
                expect(Object.keys(users).length).to.be.equal(2);
            });
            return chakram.wait();
        });

        it('should throw an error for using not existed user id', () => {
            const updatedUserID = data.users[data.users.length-1].id + 1000;
            const response = chakram.put(api.url('users/' + updatedUserID));
            return expect(response).to.have.status(404);
        });
    });
    
    describe('DELETE', () => {
        it('should delete a user by using existed ID', () => {
            const deletedUserID = data.users[data.users.length-2].id;
            const response = chakram.delete(api.url('users/' + deletedUserID));
            expect(response).to.have.status(200);
            return response.then(() => {
                const deleteUsersById = chakram.get(api.url('users/' + deletedUserID));
                expect(deleteUsersById).to.have.status(404);
                return chakram.wait();
            });
        });

        it('should throw error if the user ID does not exist', () => {
            const response = chakram.delete(api.url('users/0'));
            expect(response).to.have.status(404);
            return chakram.wait();
        });
    });
    
});