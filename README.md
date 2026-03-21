# Finance Pro 👋

**Finance Pro** é uma solução premium de gestão financeira pessoal, projetada para oferecer controle total sobre suas finanças com uma experiência visual de alto nível.

## 🚀 Funcionalidades

- **Dashboard Holístico**: Acompanhe seu patrimônio total, receitas e despesas mensais em uma interface intuitiva.
- **Análise de Gastos**: Gráficos dinâmicos (Donut Chart) que detalham a distribuição de despesas por categoria.
- **Multi-Contas**: Gerencie diferentes contas bancárias e acompanhe saldos individuais de forma centralizada.
- **Histórico Inteligente**: Filtre e revise suas transações recentes com ícones e cores customizadas por categoria.
- **Design de Elite**: Interface moderna com suporte a **Modo Escuro (Dark Mode)** e gradientes elegantes.
- **Autenticação Segura**: Fluxo completo de login e cadastro integrado ao Supabase.

## 🛠️ Tecnologias

- **Core**: [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **Estilização**: StyleSheet nativo com [Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)
- **Data Fetching**: [React Query](https://tanstack.com/query/latest) (@tanstack/react-query)
- **Validation**: [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)

## 📁 Estrutura do Projeto

- `src/app`: Rotas e telas principais (Tabs).
- `src/ui`: Componentes visuais organizados por domínio (Auth, Dashboard, Transactions).
- `src/domain`: Modelos de dados e interfaces de negócio.
- `src/data`: Implementação de repositórios e serviços de integração (Supabase).
- `src/core`: Temas (Cores, Tipografia) e hooks fundamentais.

## 🏃 Como Iniciar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
3. Use o **Expo Go** no seu celular ou um emulador para visualizar o app.
