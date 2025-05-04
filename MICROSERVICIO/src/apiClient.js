const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.API_URL;
let token = null;

// Para el login 
async function login(correo, contrasenia) {
  try {
    const response = await axios.post(`${BASE_URL}/api/usuarios`, { correo, contrasenia });
    if (response.data?.token) {
      // para almacenar el token en una variable global
      token = response.data.token;
      return token;
    }
    throw new Error("No se obtuvo un token valido.");
  } catch (error) {
    console.error("Error en el login:", error.response?.data || error.message);
    throw new Error("Error al obtener el token.");
  }
}

// Para verificar que el login esté funcionando correctamente
async function loginDefault() {
    const token = await login(process.env.API_USERNAME, process.env.API_PASSWORD);
    console.log("Token después de loginDefault:", token); 
  };
  

  //Para realziar las peticiones a la API de MIGA
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
        throw new Error("Respuesta de la API vacia o erronea");
      }

      return response.data;
    } catch (error) {
      console.error("Error en la solicitud:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error en la API");
    }
}


module.exports = { login, loginDefault, apiRequest };
