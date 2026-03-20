Quero que você construa neste projeto react native e expo(cash-forge) um app de controle financeiro completo O banco de dados é Supabase que ja está configurado no projeto e já existe a seguinte estrutura de tabelas:

---

## ESTRUTURA DO BANCO DE DADOS

- As tabelas ja existem e os schemas são esses: 

--============================================================
-- ENUMS
-- ============================================================

CREATE TYPE account_type AS ENUM ('checking', 'savings', 'cash', 'investment', 'credit_card');
CREATE TYPE transaction_type AS ENUM ('income', 'expense', 'transfer');
CREATE TYPE frequency_type AS ENUM ('daily', 'weekly', 'monthly', 'yearly');
CREATE TYPE category_type AS ENUM ('income', 'expense');

-- ============================================================
-- USERS (Usuários autenticados)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  email text NOT NULL UNIQUE,
  full_name text,
  avatar_url text
);


-- ============================================================
-- ACCOUNTS (Contas / Carteiras)
-- ============================================================

CREATE TABLE accounts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  type            account_type NOT NULL DEFAULT 'checking',
  balance         NUMERIC(12, 2) NOT NULL DEFAULT 0,
  color           TEXT,
  icon            TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);


-- ============================================================
-- CATEGORIES (Categorias)
-- ============================================================

CREATE TABLE categories (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL = categoria padrão do sistema
  name            TEXT NOT NULL,
  type            category_type NOT NULL,
  icon            TEXT,
  color           TEXT,
  is_default      BOOLEAN NOT NULL DEFAULT FALSE, -- TRUE para categorias pré-definidas do sistema
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_user_id ON categories(user_id);


-- ============================================================
-- RECURRENCES (Transações Recorrentes)
-- ============================================================

CREATE TABLE recurrences (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id          UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  category_id         UUID REFERENCES categories(id) ON DELETE SET NULL,
  description         TEXT NOT NULL,
  amount              NUMERIC(12, 2) NOT NULL,
  type                transaction_type NOT NULL,
  frequency           frequency_type NOT NULL DEFAULT 'monthly',
  start_date          DATE NOT NULL,
  end_date            DATE,
  next_due_date       DATE NOT NULL,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recurrences_user_id ON recurrences(user_id);
CREATE INDEX idx_recurrences_next_due_date ON recurrences(next_due_date);


-- ============================================================
-- INSTALLMENTS (Parcelamentos)
-- ============================================================

CREATE TABLE installments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description           TEXT NOT NULL,
  total_amount          NUMERIC(12, 2) NOT NULL,
  installment_count     INT NOT NULL CHECK (installment_count > 0),
  installment_amount    NUMERIC(12, 2) NOT NULL,
  start_date            DATE NOT NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_installments_user_id ON installments(user_id);


-- ============================================================
-- TRANSACTIONS (Transações — tabela principal)
-- ============================================================

CREATE TABLE transactions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id        UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  category_id       UUID REFERENCES categories(id) ON DELETE SET NULL,
  recurrence_id     UUID REFERENCES recurrences(id) ON DELETE SET NULL,
  installment_id    UUID REFERENCES installments(id) ON DELETE SET NULL,
  type              transaction_type NOT NULL,
  amount            NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  description       TEXT,
  date              DATE NOT NULL,
  is_paid           BOOLEAN NOT NULL DEFAULT TRUE,
  installment_number INT, -- ex: 3 (de 12)
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);


-- ============================================================
-- BUDGETS (Orçamentos por categoria/mês)
-- ============================================================

CREATE TABLE budgets (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id   UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  amount        NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  month         SMALLINT NOT NULL CHECK (month BETWEEN 1 AND 12),
  year          SMALLINT NOT NULL CHECK (year >= 2000),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, category_id, month, year) -- apenas 1 orçamento por categoria/mês
);

CREATE INDEX idx_budgets_user_id ON budgets(user_id);


-- ============================================================
-- TAGS
-- ============================================================

CREATE TABLE tags (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, name)
);

CREATE TABLE transaction_tags (
  transaction_id  UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  tag_id          UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (transaction_id, tag_id)
);

---

## TELAS E FUNCIONALIDADES

### Autenticação
- Tela de login usando Supabase Auth (email + senha) utilizando o authRepository que ja existe e redirecionando para tela inicial ao logar corretamente.

### Dashboard (tela inicial)
- Saldo total somando todas as contas ativas
- Resumo do mês atual: total de receitas, total de despesas e saldo do período
- Lista das últimas 5 transações com ícone da categoria, descrição, valor e data
- Atalho para adicionar nova transação

### Contas (accounts)
- Listagem de todas as contas com nome, tipo, saldo atual e cor/ícone
- Botão para adicionar nova conta (formulário com nome, tipo, saldo inicial, cor e ícone)
- Swipe ou menu de contexto para editar e deletar conta
- Ao deletar: impedir exclusão se houver transações vinculadas (exibir mensagem de erro)

### Categorias (categories)
- Listagem separada por tipo: receitas e despesas
- Exibir categorias padrão do sistema (somente leitura) e categorias do usuário (editáveis)
- Adicionar nova categoria com nome, tipo (income/expense), ícone e cor
- Editar e deletar apenas categorias próprias (não as do sistema)

### Transações (transactions) — CRUD principal
- Listagem com filtro por: período (mês/ano), tipo (income/expense/transfer), conta e categoria
- Cada item exibe: ícone da categoria, descrição, valor formatado (R$), data e badge de status (pago/pendente)
- Indicação visual quando a transação é parte de parcelamento (ex: "3/12") ou recorrência
- Formulário de adição com os campos:
  - Tipo (income / expense / transfer)
  - Valor
  - Descrição
  - Data
  - Conta (select buscando de accounts)
  - Categoria (select filtrado pelo tipo, buscando de categories)
  - Status (is_paid: sim/não)
  - Notas (opcional)
  - Tags (multi-select buscando de tags, com opção de criar nova tag inline)
  - Opção de vincular a um parcelamento existente ou criar novo parcelamento
- Editar transação (mesmos campos)
- Deletar transação com confirmação

### Recorrências (recurrences)
- Listagem com nome, valor, frequência e próxima data de vencimento
- Badge visual indicando se está ativa ou inativa
- Formulário para adicionar recorrência: descrição, valor, tipo, frequência, data de início, data de fim (opcional), conta e categoria
- Editar e deletar recorrência
- Ao deletar: perguntar se deseja deletar também as transações geradas por ela

### Parcelamentos (installments)
- Listagem com descrição, valor total, número de parcelas e data de início
- Ao clicar em um parcelamento: exibir todas as transações vinculadas (por installment_id) com número da parcela, valor e status de pagamento
- Formulário para criar novo parcelamento: descrição, valor total, número de parcelas, data da 1ª parcela, conta e categoria — ao salvar, criar automaticamente N transações em transactions com installment_number preenchido
- Editar dados gerais do parcelamento
- Deletar parcelamento e suas transações vinculadas (com confirmação)

### Orçamentos (budgets)
- Listagem do mês atual com barra de progresso por categoria (gasto atual vs limite definido)
- Indicador visual: verde (abaixo de 75%), amarelo (75–99%), vermelho (acima do limite)
- Formulário para adicionar orçamento: categoria, valor limite, mês e ano
- Editar e deletar orçamento
- Ao exibir a lista: fazer join com transactions para calcular o total gasto no mês por categoria

### Tags (tags)
- Listagem de tags criadas pelo usuário
- Adicionar, editar nome e deletar tag
- Ao deletar: remover automaticamente os vínculos em transaction_tags

---

## REQUISITOS TÉCNICOS

- Cores utilizando o colors do useTheme que está em src/core/theme.provider.tsx
- 
- Utiliza o LoadingOverlay sempre que realizar operações com o banco
- Formatar valores monetários em BRL (R$ 1.234,56) usando Intl.NumberFormat
- Tratar erros do Supabase e exibir feedback ao usuário (loading states, mensagens de erro e sucesso)
- Componentes reutilizáveis para: TransactionCard, AccountCard, CategoryBadge, ProgressBar, ConfirmDeleteModal e FormField
- TypeScript obrigatório com types/interfaces para cada entidade do banco

---

## ESTRUTURA DE PASTAS ESPERADA
- Utilize a arquitetura MVVM, seguindo exemplos que ja existem para a feature auth que ja existe no projeto

---

Comece pela configuração do Supabase client, os types TypeScript de todas as entidades e o fluxo de autenticação. Depois implemente tela por tela na ordem listada acima.