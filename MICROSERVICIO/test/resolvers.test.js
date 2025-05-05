const { apiRequest } = require('../src/apiClient');
jest.mock('../src/apiClient');

const resolvers = require('../src/resolvers');

describe('buscarDocumentosPorNombre', () => {
  const context = { token: 'fake-token' };

  it('debe retornar los documentos si la respuesta es exitosa', async () => {
    const nombre = 'Adriana';
    const documentosMock = [{ id: 1, nombre: 'Adriana' }];

    apiRequest.mockResolvedValue({ documentos: documentosMock });

    const result = await resolvers.Query.buscarDocumentosPorNombre(null, { nombre }, context);

    expect(apiRequest).toHaveBeenCalledWith(
      'get',
      `/api/documentos/buscar/nombre?nombre=Adriana`,
      null,
      'fake-token'
    );
    expect(result).toEqual(documentosMock);
  });

  it('debe retornar array vacío si no hay documentos en la respuesta', async () => {
    const nombre = 'Inexistente';
    apiRequest.mockResolvedValue({});

    const result = await resolvers.Query.buscarDocumentosPorNombre(null, { nombre }, context);

    expect(result).toEqual([]);
  });

  it('debe lanzar un error si la solicitud falla', async () => {
    const nombre = 'Error';
    apiRequest.mockRejectedValue(new Error('Fallo API'));

    await expect(
      resolvers.Query.buscarDocumentosPorNombre(null, { nombre }, context)
    ).rejects.toThrow('Error en la búsqueda por nombre');
  });
});
