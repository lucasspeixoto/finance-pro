/* eslint-disable max-len */
import { mapPostgresError } from '../errors';

describe('mapPostgresError', () => {
  it('should return default message for non-error object', () => {
    expect(mapPostgresError(null)).toBe('Ocorreu um erro inesperado.');
    expect(mapPostgresError(undefined)).toBe('Ocorreu um erro inesperado.');
    expect(mapPostgresError({})).toBe('Ocorreu um erro inesperado.');
  });

  it('should handle specific Postgres error codes', () => {
    expect(mapPostgresError({ code: '23505' })).toBe('Este registro já existe. (Violação de unicidade)');
    expect(mapPostgresError({ code: '23503' })).toBe(
      'Não é possível realizar esta ação pois o registro está sendo usado em outro lugar. (Violação de chave estrangeira)',
    );
    expect(mapPostgresError({ code: '23502' })).toBe(
      'Por favor, preencha todos os campos obrigatórios. (Violação de NOT NULL)',
    );
    expect(mapPostgresError({ code: '23P01' })).toBe('Esta operação viola uma restrição de exclusão.');
  });

  it('should handle generic integrity violation class (23)', () => {
    expect(mapPostgresError({ code: '23000' })).toBe(
      'Erro de integridade de dados. Verifique as informações enviadas.',
    );
  });

  it('should return error message if code is not recognized', () => {
    const errorMsg = 'Custom error message';
    expect(mapPostgresError({ message: errorMsg })).toBe(errorMsg);
    expect(mapPostgresError({ code: '99999', message: errorMsg })).toBe(errorMsg);
  });

  it('should return "Erro no banco de dados" for unknown code without message', () => {
    expect(mapPostgresError({ code: '99999' })).toBe('Erro no banco de dados.');
  });
});
