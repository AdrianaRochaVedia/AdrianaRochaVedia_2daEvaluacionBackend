const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.API_URL;
let token = null;

// Función de login
async function login(correo, contrasenia) {
  try {
    // Realiza la solicitud de login con correo y contraseña
    const response = await axios.post(`${BASE_URL}/api/usuarios`, { correo, contrasenia });
    if (response.data?.token) {
      // almacenar el token en una variable global
      token = response.data.token;
      return token;
    }
    throw new Error("No se obtuvo un token válido.");
  } catch (error) {
    console.error("Error en el login:", error.response?.data || error.message);
    throw new Error("Error al obtener el token.");
  }
}

// Verificar que el login esté funcionando correctamente
async function loginDefault() {
    const token = await login(process.env.API_USERNAME, process.env.API_PASSWORD);
    console.log("Token después de loginDefault:", token); 
  };
  

async function apiRequest(method, endpoint, data = null, customToken = null) {
    const authToken = customToken || token; 
    if (!authToken) {
        const newToken = await loginDefault();
        return apiRequest(method, endpoint, data, newToken);
      }

    try {
      const response = await axios({
        method,
        url: `${BASE_URL}${endpoint}`,
        data,
        headers: { 'x-token': authToken }, 
      });

      if (response.data && Object.keys(response.data).length === 0) {
        throw new Error("Respuesta vacía de la API");
      }

      return response.data;
    } catch (error) {
      console.error("Error en la solicitud:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error en la API");
    }
}


module.exports = { login, loginDefault, apiRequest };
