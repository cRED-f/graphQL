import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import axios from "axios";

async function startApolloServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs: `
    type User {
      id: ID!
      name: String!
      username: String!
    }

    type todo {
      id: ID!
      title: String!
      completed: Boolean
      user: User
    }
    type Query {

      getTodo:[todo]
      getAllUsers:[User]
      getUser(id:ID!):User
    }
  
    `,
    resolvers: {
      todo: {
        user: async (parent) => {
          const { data } = await axios.get(
            `https://jsonplaceholder.typicode.com/users/${parent.id}`
          );
          return data;
        },
      },

      Query: {
        getTodo: async () => {
          const { data } = await axios.get(
            "https://jsonplaceholder.typicode.com/todos"
          );
          return data;
        },
        getAllUsers: async () => {
          const { data } = await axios.get(
            "https://jsonplaceholder.typicode.com/users"
          );
          return data;
        },
        getUser: async (parent, { id }) => {
          const { data } = await axios.get(
            `https://jsonplaceholder.typicode.com/users/${id}`
          );
          return data;
        },
      },
    },
  });

  app.use(cors());
  app.use(bodyParser.json());

  await server.start();

  app.use("/graphql", expressMiddleware(server));
  app.listen(8000, () => console.log("Server is running on port 8000"));
}

startApolloServer();
