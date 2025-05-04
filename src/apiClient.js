const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.API_URL;
let token = null;

// ✅ Ahora login acepta correo y contraseña como argumentos
async function login(correo, contrasenia) {
  try {
    const response = await axios.post(`${BASE_URL}/api/usuarios`, {
      correo,
      contrasenia,
    });

    if (response.data && response.data.token) {
      token = response.data.token;
      return token;
    } else {
      throw new Error("No se obtuvo un token válido.");
    }
  } catch (error) {
    console.error("Error en el login:", error.response?.data || error.message);
    throw new Error("Error al obtener el token.");
  }
}

// ✅ Si necesitas login automático con las credenciales del .env
async function loginDefault() {
  return login(process.env.API_USERNAME, process.env.API_PASSWORD);
}

async function apiRequest(method, endpoint, data = null, customToken = null) {
  const authToken = customToken || token;

  if (!authToken) {
    console.log('Token no encontrado, intentando login...');
    await loginDefault();
  }

  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };

  console.log('Enviando solicitud a:', `${BASE_URL}${endpoint}`);
  console.log('Datos enviados:', data);
  console.log('Configuración de los headers:', config);

  try {
    const response = await axios({ method, url: `${BASE_URL}${endpoint}`, data, ...config });
    console.log('Respuesta de la API:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error en la solicitud:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al hacer la solicitud a la API");
  }
}

module.exports = { login, loginDefault, apiRequest };
