const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const fs = require("fs");
const path = require("path");
const resolvers = require("./resolvers");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());

// Leer el archivo schema.graphql como texto
const typeDefs = fs.readFileSync(path.join(__dirname, "./schema.graphql"), "utf8");

// Crear el servidor Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (err) => {
    // Manejo personalizado de errores para evitar detalles innecesarios
    return {
      message: err.message,  // Solo muestra el mensaje del error
      code: err.extensions.code,  // Si el error tiene un código, lo devuelve también
    };
  },
  context: ({ req }) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    console.log("Token recibido en el contexto:", token); // Verificar que el token está presente
    if (!token) return {}; // Si no hay token, retorna un objeto vacío
  
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      return { user, token }; // Retorna el usuario y el token en el contexto
    } catch (err) {
      console.error("Error al verificar el token:", err.message);
      return {}; // Si el token no es válido, retorna un objeto vacío
    }
  },
  
});

// Iniciar el servidor Apollo y configurar Express
server.start().then(() => {
  // Aplicamos el middleware de Apollo Server a Express
  server.applyMiddleware({ app });

  // Iniciamos el servidor Express en el puerto 4000
  app.listen({ port: 4000 }, () => {
    console.log(`GraphQL funcionando en: http://localhost:4000${server.graphqlPath}`);
  });
});