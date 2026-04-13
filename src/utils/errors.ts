/* eslint-disable max-len */
interface DbError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

/**
 * Type guard to check if an unknown error object matches the DbError interface.
 */
const isDbError = (error: unknown): error is DbError => {
  return typeof error === 'object' && error !== null && ('code' in error || 'message' in error);
};

/**
 * Maps PostgreSQL error codes to user-friendly messages.
 *
 * @param error - The error object (from catch block).
 * @returns A localized, human-readable error message.
 */
export const mapPostgresError = (error: unknown): string => {
  if (!isDbError(error)) {
    return 'Ocorreu um erro inesperado.';
  }

  // Supabase errors usually have a 'code' property
  const code = error.code;
  const message = error.message;

  if (!code) return message || 'Ocorreu um erro inesperado.';

  switch (code) {
    case '23505':
      return 'Este registro já existe. (Violação de unicidade)';
    case '23503':
      return 'Não é possível realizar esta ação pois o registro está sendo usado em outro lugar. (Violação de chave estrangeira)';
    case '23502':
      return 'Por favor, preencha todos os campos obrigatórios. (Violação de NOT NULL)';
    case '23P01':
      return 'Esta operação viola uma restrição de exclusão.';
    default:
      // Generic integrity violation class ("23")
      if (code.startsWith('23')) {
        return 'Erro de integridade de dados. Verifique as informações enviadas.';
      }
      return message || 'Erro no banco de dados.';
  }
};
