const { apiRequest } = require("./apiClient");

const resolvers = {
  Query: {
    documentos: async () => (await apiRequest("get", "/api/documentos")).documentos || [],
    documento: async (_, { id }) => (await apiRequest("get", `/api/documentos/${id}`)).documento || null,
    documentosPorTipo: async (_, { tipo }) => (await apiRequest("get", `/api/documentos/buscar/tipo?tipo=${encodeURIComponent(tipo)}`)).documentos || [],
    documentosPorUsuario: async (_, { usuarioId }, context) => {
      if (!context.user || context.user.id_usuario !== usuarioId) throw new Error("No autorizado");
      return (await apiRequest("get", `/api/documentos/usuario/${usuarioId}`, null, context.token)).documentos || [];
    },
    documentosFavoritos: async (_, { usuarioId }, context) => {
      if (!context.user || context.user.id_usuario !== usuarioId) throw new Error("No autorizado");
      return (await apiRequest("get", `/api/documentos/favoritos/${usuarioId}`, null, context.token)).documentos || [];
    },
    documentosMasVistos: async (_, { limite = 10 }) => (await apiRequest("get", `/api/documentos/mas-vistos?limite=${limite}`)).documentos || [],
    versiones: async (_, { documentoId }) => (await apiRequest("get", `/api/versiones/${documentoId}`)).versiones || [],
    version: async (_, { id }) => (await apiRequest("get", `/api/version/${id}`)).version || null,
    usuarios: async () => (await apiRequest("get", "/api/usuarios")).usuarios || [],
    usuario: async (_, { id }) => (await apiRequest("get", `/api/usuarios/${id}`)).usuario || null,
    reporteDocumentos: async (_, __, context) => {
      if (!context.user) throw new Error("No autorizado");
      return await apiRequest("get", "/api/reportes/documentos", null, context.token);
    },
    reporteDocumentosPorPeriodo: async (_, { fechaInicio, fechaFin }, context) => {
      if (!context.user) throw new Error("No autorizado");
      return await apiRequest("get", `/api/reportes/documentos-periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, null, context.token);
    },
    reporteVersionesPorDocumento: async (_, { documentoId }, context) => {
      if (!context.user) throw new Error("No autorizado");
      return (await apiRequest("get", `/api/reportes/versiones/${documentoId}`, null, context.token)).versiones || [];
    },
    reporteActividad: async (_, { usuarioId, fechaInicio, fechaFin }, context) => {
      if (!context.user || context.user.id_usuario !== usuarioId) throw new Error("No autorizado");
      return await apiRequest("get", `/api/reportes/actividad?usuarioId=${usuarioId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, null, context.token);
    },
    
    buscarDocumentosPorNombre: async (_, { nombre }, context) => {
        console.log("Buscando documento con nombre:", nombre);
        const url = `/api/documentos/buscar/nombre?nombre=${encodeURIComponent(nombre)}`;
        console.log("URL de la solicitud:", url);
        const response = await apiRequest("get", url, null, context.token); // ✅ ahora sí se pasa el token
        console.log("Respuesta de la API:", response);
        return response.documentos || [];
      },
    
      
    buscarDocumentosPorPalabrasClave: async (_, { palabras_clave }) => (await apiRequest("get", `/api/documentos/buscar/palabras-clave?palabras_clave=${encodeURIComponent(palabras_clave)}`)).documentos || [],
    buscarDocumentosPorTipo: async (_, { tipo }) => (await apiRequest("get", `/api/documentos/buscar/tipo?tipo=${encodeURIComponent(tipo)}`)).documentos || [],
    buscarDocumentosPorAnio: async (_, { anio }) => (await apiRequest("get", `/api/documentos/buscar/anio?anio=${anio}`)).documentos || [],
    buscarDocumentosPorFuente: async (_, { fuente }) => (await apiRequest("get", `/api/documentos/buscar/fuente?fuente=${encodeURIComponent(fuente)}`)).documentos || [],
    filtradoInteligente: async () => (await apiRequest("get", "/api/documentos/filtrado-inteligente")).documentos || []
  },

  Documento: {
    usuario: async (parent) => parent.USUARIO_id_usuario ? (await apiRequest("get", `/api/usuarios/${parent.USUARIO_id_usuario}`)).usuario || null : null,
    versiones: async (parent) => (await apiRequest("get", `/api/versiones/${parent.id_documento}`)).versiones || [],
    fecha_creacion: (parent) => parent.createdAt,
    fecha_actualizacion: (parent) => parent.updatedAt
  },

  VersionDocumento: {
    id: (parent) => parent.id_version,
    documento: async (parent) => parent.DOCUMENTO_id_documento ? (await apiRequest("get", `/api/documentos/${parent.DOCUMENTO_id_documento}`)).documento || null : null,
    usuario: async (parent) => parent.USUARIO_id_usuario ? (await apiRequest("get", `/api/usuarios/${parent.USUARIO_id_usuario}`)).usuario || null : null
  },

  Mutation: {
    login: async (_, { correo, contrasenia }) => {
        const response = await apiRequest("post", "/api/usuarios", { correo, contrasenia });
      
        const { token, uid } = response;
      
        const usuario = {
          id_usuario: uid,
          correo: correo,
          tipo: "Administrador" // o null si no aplica
        };
      
        return { token, usuario };
      },   
}

};

module.exports = resolvers;