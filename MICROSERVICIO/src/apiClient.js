const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.API_URL;
let token = null;

// Función para hacer login
async function login(correo, contrasenia) {
  console.log("Valores recibidos en login():", correo, contrasenia);
  
  if (!correo || !contrasenia || contrasenia.length < 6) {
    throw new Error("Credenciales inválidas. La contraseña debe tener al menos 6 caracteres.");
  }
  
  try {
    const response = await axios({
      method: 'post',
      url: `${BASE_URL}/api/usuarios`, 
      data: { correo, contrasenia }
    });
    
    // Verificar respuesta
    if (!response.data || !response.data.token) {
      throw new Error("No se recibió un token válido");
    }
    
    // Guardar el token globalmente
    token = response.data.token;
    
    const { token: responseToken, uid } = response.data;

    const usuario = {
      id_usuario: uid,
      correo: correo,
      tipo: response.data.tipo || "Admin" 
    };

    return { 
      token: responseToken,
      usuario 
    };
  } catch (error) {
    console.error("Error en el login:", error.response?.data || error.message);
    throw new Error("Error al obtener el token: " + 
      (error.response?.data?.msg || error.message));
  }
}


// Funcion para hacer peticiones a la API de MIGA
async function apiRequest(method, endpoint, data = null, customToken = null) {
  const authToken = customToken || token;

  if (!authToken && endpoint !== "/api/usuarios") {
    throw new Error("Se requiere autenticación para acceder a este recurso");
  }

  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {},
      data
    };
    
    if (authToken) {
      config.headers['x-token'] = authToken;
    }

    const response = await axios(config);

    if (response.data && Object.keys(response.data).length === 0) {
      console.warn("Respuesta de la API vacía");
    }

    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.response?.data?.msg || error.message;
    console.error(`Error en ${method.toUpperCase()} ${endpoint}:`, errorMsg);
    throw new Error(errorMsg || "Error en la API");
  }
}

module.exports = { login, apiRequest };