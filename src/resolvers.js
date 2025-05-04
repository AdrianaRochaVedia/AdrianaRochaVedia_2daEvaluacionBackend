const { apiRequest } = require("./apiClient");

const resolvers = {
  Query: {
    documentos: async () => await apiRequest("get", "/api/documentos"),
    documento: async (_, { id }) => await apiRequest("get", `/api/documentos/${id}`),
    documentosPorTipo: async (_, { tipo }) => await apiRequest("get", `/api/documentos/tipo/${tipo}`),
    documentosPorUsuario: async (_, { usuarioId }, context) => {
      if (!context.user || context.user.id !== usuarioId) {
        throw new Error("No autorizado");
      }
      return await apiRequest("get", `/api/documentos/usuario/${usuarioId}`, null, context.token);
    },
    documentosFavoritos: async (_, { usuarioId }, context) => {
      if (!context.user || context.user.id !== usuarioId) {
        throw new Error("No autorizado");
      }
      return await apiRequest("get", `/api/documentos/favoritos/${usuarioId}`, null, context.token);
    },
    documentosMasVistos: async (_, { limite }) => await apiRequest("get", `/api/documentos/mas-vistos?limite=${limite}`),
    versiones: async (_, { documentoId }) => await apiRequest("get", `/api/versiones/${documentoId}`),
    version: async (_, { id }) => await apiRequest("get", `/api/version/${id}`),
    usuarios: async () => await apiRequest("get", "/api/usuarios"),
    usuario: async (_, { id }) => await apiRequest("get", `/api/usuarios/${id}`),
    reporteDocumentos: async (_, __, context) => {
      if (!context.user) throw new Error("No autorizado");
      return await apiRequest("get", "/api/documentos", null, context.token);
    },
    reporteDocumentosPorPeriodo: async (_, { fechaInicio, fechaFin }, context) => {
      if (!context.user) throw new Error("No autorizado");
      return await apiRequest("get", `/api/documentos-periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, null, context.token);
    },
    reporteVersionesPorDocumento: async (_, { documentoId }, context) => {
      if (!context.user) throw new Error("No autorizado");
      return await apiRequest("get", `/api/reportes/versiones/${documentoId}`, null, context.token);
    },
    reporteActividad: async (_, { usuarioId, fechaInicio, fechaFin }, context) => {
      if (!context.user || context.user.id !== usuarioId) {
        throw new Error("No autorizado");
      }
      const query = `?usuarioId=${usuarioId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
      return await apiRequest("get", `/api/reportes/actividad${query}`, null, context.token);
    },
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
