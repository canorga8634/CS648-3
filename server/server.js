const express = require('express');
const fs = require('fs');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { Kind } = require('graphql/language');

let aboutMessage = "My Company Inventory for CS648";

const productsDB = [];

const resolvers = {
  Query: {
    about: () => aboutMessage,
    productList,
  },
  Mutation: {
    setAboutMessage,
    productAdd,
  },
};

function setAboutMessage(_, { message }) {
  return aboutMessage = message;
}

function productList() {
  return productsDB;
}

function productAdd(_, { product }) {
  product.id = productsDB.length + 1;
  productsDB.push(product);
  return product;
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
});

const app = express();
app.use(express.static('public'));
server.applyMiddleware({ app, path: '/graphql' });
app.listen(3000, function () {
  console.log('App started on port 3000');
});