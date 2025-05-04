const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const fs = require("fs");
const path = require("path");
const resolvers = require("./resolvers");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());

const typeDefs = fs.readFileSync(path.join(__dirname, "./schema.graphql"), "utf8");

// Crear el servidor Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (err) => {
    return {
      message: err.message,  
      code: err.extensions.code,  
    };
  },
  context: ({ req }) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    //Verificacion del token
    console.log("Token recibido en el contexto:", token); 
    if (!token) return {}; 
  
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      return { user, token }; 
    } catch (err) {
      console.error("Error al verificar el token:", err.message);
      return {}; 
    }
  },
  
});

// Para iniciar Apollo Server
server.start().then(() => {
  // middleware de Apollo Server a Express
  server.applyMiddleware({ app });
  app.listen({ port: 4000 }, () => {
    console.log(`GraphQL funcionando en: http://localhost:4000${server.graphqlPath}`);
  });
});