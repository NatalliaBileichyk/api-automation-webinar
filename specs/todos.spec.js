'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const api = require('./utils/api');
const data = require('../server/data.json');

describe('Todos', () => {
       
    describe('CREATE', () => {

        afterEach(() => {
            if (newTodosId) {                
                chakram.delete(api.url('todos/' + newTodosId));
            }
        });

        let newTodosId = 0;

        it('should create a new todo with a new id', () => {
            const numberOfTodos = data.todos[data.todos.length-1].id
            const response = chakram.post(api.url('todos'));
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', todos => {
                expect(todos.id).to.be.equal(numberOfTodos + 1);
                newTodosId = todos.id
            });
            return chakram.wait();
        });        

        it('should create a new todo with \"userId\" property', () => {
            const numberOfTodos = data.todos.length;
            const response = chakram.post(api.url('todos'),{
                userId: 255
            });
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', todos => {
                expect(todos.userId).to.be.equal(255);
                expect(todos.id).to.be.greaterThan(numberOfTodos) 
                newTodosId = todos.id
            });
        
            return chakram.wait();
        });

        it('should create a new todo without all properties', () => {
            const numberOfTodos = data.todos.length;
            const response = chakram.post(api.url('todos'));        
            expect(response).to.have.status(201);
            expect(response).to.have.json('data', todos => {
                expect(todos.id).to.be.greaterThan(numberOfTodos)
                newTodosId = todos.id                
            });            
            return chakram.wait();
        });

        it('should not create a new todo with existed id', () => {
            const response = chakram.post(api.url('todos'),{
                id: data.todos[data.todos.length-1].id
            });
            return expect(response).to.have.status(500);
        });
        
    }); 

    describe('READ', () => {
        it('should return data of todos', () => {
            const numberOfTodos = data.todos.length
            const response = chakram.get(api.url('todos'));
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', todos => {
                expect(todos.length).to.be.equal(numberOfTodos);
            });
            return chakram.wait();
        });

        it('should return data of required post', () => {
            const requiredTodoID = 15;
            const response = chakram.get(api.url('todos/' + requiredTodoID));            
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', todos => {
                expect(todos.id).to.be.equal(requiredTodoID);                
            });
            return chakram.wait();
        });
        
    });

    describe('UPDATE', () => {        
        it('should update \"userId\" property of the todo', () => {
            const updatedTodoID = 15;
            const response = chakram.put(api.url('todos/' + updatedTodoID),{
                userId: 255
            });
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', todos => {
                expect(todos.id).to.be.equal(updatedTodoID);
                expect(todos.userId).to.be.equal(255);
            });        
            return chakram.wait();
        });

        it('should not update \"id\" property of the todo', () => {
            const updatedTodoID = data.todos[data.todos.length-1].id;
            const newTodoID = updatedTodoID + 10;                

            const response = chakram.put(api.url('todos/' + updatedTodoID),{
                id: newTodoID,
                title: "I'm trying to update todo ..."
            });

            expect(response).to.have.status(200);
            expect(response).to.have.json('data', todos => {
                expect(todos.id).not.to.be.equal(newTodoID);
                expect(todos.id).to.be.equal(updatedTodoID);
                expect(todos.title).to.be.equal("I'm trying to update todo ...");
            });

            return chakram.wait();
        });

        it('updated todo should have only specified properties', () => {
            const updatedTodoID = data.todos[0].id;
            const response = chakram.put(api.url('todos/' + updatedTodoID),{
                title: "I want to see Hungary"
            });
            
            expect(response).to.have.status(200);
            expect(response).to.have.json('data', todos => {
                expect(todos.id).to.be.equal(updatedTodoID);
                expect(todos.title).to.be.equal("I want to see Hungary");
                expect(Object.keys(todos).length).to.be.equal(2);
            });

            return chakram.wait();
        });

        it('should throw an error for using not existed todo id', () => {
            const updatedTodoID = data.todos[data.todos.length-1].id + 1000;
            const response = chakram.put(api.url('todos/' + updatedTodoID),{
                title: "I'm trying to update todo once more ..."
            });
            return expect(response).to.have.status(404);
        });
    });
    
    describe('DELETE', () => {
        it('should delete a todo by using existed ID', () => {
            const deletedTodoID = 7;
            const response = chakram.delete(api.url('todos/' + deletedTodoID));
            expect(response).to.have.status(200);
            return response.then(() => {
                const deleteTodosById = chakram.get(api.url('todos/' + deletedTodoID));
                expect(deleteTodosById).to.have.status(404);
                return chakram.wait();
            });
        });

        it('should throw error if the todo ID does not exist', () => {
            const response = chakram.delete(api.url('todos/0'));
            expect(response).to.have.status(404);
            return chakram.wait();
        });
    });
    
});