-- ============================================================
-- MIGRATION V1 — FINANCIAL APP
-- ============================================================


-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE account_type AS ENUM (
  'checking',
  'savings',
  'cash',
  'investment',
  'credit_card'
);

CREATE TYPE transaction_type AS ENUM (
  'income',
  'expense',
  'transfer'
);

CREATE TYPE category_type AS ENUM (
  'income',
  'expense'
);


-- ============================================================
-- ACCOUNTS
-- ============================================================

CREATE TABLE accounts (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  type        account_type NOT NULL DEFAULT 'checking',
  balance     NUMERIC(12, 2) NOT NULL DEFAULT 0,
  color       TEXT,
  icon        TEXT,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);


-- ============================================================
-- CATEGORIES
-- ============================================================

CREATE TABLE categories (
  id          UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID          REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT          NOT NULL,
  type        category_type NOT NULL,
  icon        TEXT,
  color       TEXT,
  is_default  BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_user_id ON categories(user_id);


-- ============================================================
-- TRANSACTIONS
-- ============================================================

CREATE TABLE transactions (
  id           UUID             PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID             NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id   UUID             NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  category_id  UUID             REFERENCES categories(id) ON DELETE SET NULL,
  type         transaction_type NOT NULL,
  amount       NUMERIC(12, 2)   NOT NULL CHECK (amount > 0),
  description  TEXT,
  date         DATE             NOT NULL,
  is_paid      BOOLEAN          NOT NULL DEFAULT TRUE,
  notes        TEXT,
  created_at   TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id     ON transactions(user_id);
CREATE INDEX idx_transactions_account_id  ON transactions(account_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_date        ON transactions(date);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE accounts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;


-- ACCOUNTS
CREATE POLICY "allow select accounts"
  ON accounts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "allow insert accounts"
  ON accounts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "allow update accounts"
  ON accounts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "allow delete accounts"
  ON accounts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- CATEGORIES
CREATE POLICY "allow select categories"
  ON categories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_default = TRUE);

CREATE POLICY "allow insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "allow update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND is_default = FALSE);

CREATE POLICY "allow delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id AND is_default = FALSE);


-- TRANSACTIONS
CREATE POLICY "allow select transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "allow insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "allow update transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "allow delete transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- ============================================================
-- CATEGORIAS PADRÃO DO SISTEMA
-- ============================================================

INSERT INTO categories (name, type, icon, color, is_default) VALUES
  ('Alimentação',   'expense', '🍔', '#FF6B6B', TRUE),
  ('Transporte',    'expense', '🚗', '#FFA07A', TRUE),
  ('Moradia',       'expense', '🏠', '#4ECDC4', TRUE),
  ('Saúde',         'expense', '💊', '#45B7D1', TRUE),
  ('Educação',      'expense', '📚', '#96CEB4', TRUE),
  ('Lazer',         'expense', '🎮', '#FFEAA7', TRUE),
  ('Vestuário',     'expense', '👕', '#DDA0DD', TRUE),
  ('Assinaturas',   'expense', '📱', '#98D8C8', TRUE),
  ('Outros',        'expense', '💸', '#BDC3C7', TRUE),
  ('Salário',       'income',  '💼', '#2ECC71', TRUE),
  ('Freelance',     'income',  '💻', '#27AE60', TRUE),
  ('Investimentos', 'income',  '📊', '#F39C12', TRUE),
  ('Outros',        'income',  '💰', '#95A5A6', TRUE);