const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection, sequelize } = require('./database/config');


console.log(process.env);

// Crear el servidor de express
const app = express();

// Base de datos
dbConnection();

//Cors
app.use(cors());

// Directorio público
app.use(express.static('public'));

// Lectura y parseo del body
app.use( express.json() );

// Rutas de la app
app.use('/api/auth', require('./routes/auth'));


//Escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});

const startServer = async () => {
    try {
      // Conexión a la base de datos
      await dbConnection();               
      await sequelize.sync({ alter: true }); 
      console.log('Base de datos sincronizada');
  
      const PORT = process.env.PORT || 4000;
      app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
      });
    } catch (err) {
      console.error('No se pudo iniciar el servidor:', err);
    }
  };
  
  startServer();
