# Sistema de Gerenciamento de Capelania

Sistema web para gerenciamento de cadastros de capelães com controle de validade de credenciais (4 anos).

## 🌐 Deploy em Produção

**🚀 Sistema Online:** https://capelania-aa2d4.web.app

O sistema está deployado no Firebase Hosting com:
- ✅ Autenticação segura via Firebase Auth
- ✅ Banco de dados Firestore com regras de segurança
- ✅ Hosting otimizado com cache e compressão
- ✅ SSL/HTTPS automático

**Primeiros Passos:** Ver [CRIAR_ADMIN.md](./CRIAR_ADMIN.md) para criar o primeiro usuário administrador.

## ⚡ Recursos Principais

### **Imagens em Base64**
Fotos armazenadas diretamente no Firestore (sem Firebase Storage):
- ✅ Mais simples e econômico
- ✅ Compressão automática de imagens
- ✅ Validação de tamanho (máx 950KB)

Ver detalhes em [MIGRACAO_BASE64.md](./MIGRACAO_BASE64.md)

### **Exportação para Gráfica**
Sistema completo de exportação em Excel + Fotos:
- ✅ ZIP com Excel e fotos JPG
- ✅ Conversão Base64 → JPG automática
- ✅ Pronto para impressão de credenciais

Ver detalhes em [GUIA_EXPORTACAO.md](./GUIA_EXPORTACAO.md)

## 🚀 Desenvolvimento Local

## 🎯 Como Usar (Produção)

### 1. Acesse o sistema
**URL:** https://capelania-aa2d4.web.app

### 2. Primeiro Acesso
Se for a primeira vez, siga o guia: [CRIAR_ADMIN.md](./CRIAR_ADMIN.md)

### 3. Faça Login
Use as credenciais do administrador criado no passo anterior.

---

## 💻 Desenvolvimento Local

### 1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd CAPELANIA-MAICON
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Inicie o servidor local
```bash
npm run dev
```

### 4. Acesse localmente
Abra o navegador em: `http://localhost:5173`

### 5. Faça Login Local

#### Para acessar como ADMINISTRADOR:
- Email: `admin@teste.com` (ou qualquer email contendo "admin")
- Sem necessidade de senha

#### Para acessar como USUÁRIO:
- Email: `usuario@teste.com` (ou qualquer email SEM "admin")
- Sem necessidade de senha

### 4. Explore as funcionalidades

#### Como Administrador (`admin@teste.com`):
- ✅ Dashboard com estatísticas
- ✅ Lista de 5 capelões de exemplo
- ✅ Diferentes status de validade (ativo, atenção, vencido)
- ✅ Busca e filtros funcionais
- ✅ Visualização de detalhes

#### Como Usuário (`usuario@teste.com`):
- ✅ Visualização do próprio perfil
- ✅ Barra de progresso de validade
- ✅ Dados pessoais completos
- ✅ Status da credencial

## 📊 Dados Mock Disponíveis

### Capelões de Exemplo (visíveis no painel admin):

1. **João Silva Santos**
   - Status: Ativo (válido por mais 1 ano)
   - CPF: 123.456.789-00

2. **Maria Oliveira Costa**
   - Status: Atenção (válido por 6 meses)
   - CPF: 987.654.321-00

3. **Pedro Henrique Almeida**
   - Status: Próximo ao vencimento (2 meses)
   - CPF: 456.789.123-00

4. **Ana Paula Ferreira**
   - Status: Expirado
   - CPF: 321.654.987-00

5. **Carlos Eduardo Souza**
   - Status: Ativo (válido por 2 anos)
   - CPF: 789.123.456-00

## 📊 Exportação para Gráfica

Sistema completo de exportação de dados para impressão de credenciais:

- ✅ **Excel + Fotos em ZIP** - Formato pronto para gráfica
- ✅ **Conversão Base64 → JPG** - Fotos extraídas automaticamente
- ✅ **Filtros antes de exportar** - Exporte apenas o que precisa
- ✅ **Excel formatado** - Todas as colunas necessárias
- ✅ **Modal intuitivo** - Escolha o formato desejado

Ver guia completo em [GUIA_EXPORTACAO.md](./GUIA_EXPORTACAO.md)

## 🔧 Tecnologias Utilizadas

- **Frontend**: React 19 + Vite 7
- **Estilização**: Tailwind CSS 3
- **Roteamento**: React Router DOM 7
- **Banco de Dados**: Firebase Firestore
- **Autenticação**: Firebase Auth
- **Exportação**: xlsx, jszip, file-saver
- **Linguagem**: JavaScript (ES6+)

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── common/          # Componentes reutilizáveis
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── Modal.jsx
│   │   └── ImageUpload.jsx
│   ├── forms/           # Formulários
│   │   └── RegistrationForm.jsx
│   ├── dashboard/       # Componentes do dashboard
│   └── layout/          # Layout e navegação
│       ├── Header.jsx
│       └── ProtectedRoute.jsx
├── pages/
│   ├── auth/            # Páginas de autenticação
│   │   ├── Login.jsx (MODO TESTE)
│   │   └── Register.jsx
│   ├── admin/           # Páginas administrativas
│   │   └── AdminDashboard.jsx (COM DADOS MOCK)
│   └── user/            # Páginas do usuário
│       └── UserDashboard.jsx (COM DADOS MOCK)
├── contexts/            # Context API
│   └── AuthContext.jsx (MODO TESTE - USA LOCALSTORAGE)
├── utils/               # Utilitários
│   ├── validators.js
│   ├── formatters.js
│   └── dateHelpers.js
└── App.jsx              # Componente principal
```

## ✨ Funcionalidades Implementadas

### Sistema de Validade
- ✅ Cálculo automático de tempo restante
- ✅ Barra de progresso visual
- ✅ Status com cores (Verde, Amarelo, Vermelho)
- ✅ Badges de status

### Dashboard Administrativo
- ✅ Estatísticas gerais (Total, Ativos, Vencendo, Expirados)
- ✅ Listagem de capelões
- ✅ Busca por nome, CPF ou email
- ✅ Filtros por status
- ✅ Ordenação de dados

### Dashboard do Usuário
- ✅ Visualização de perfil completo
- ✅ Status de validade em destaque
- ✅ Dados pessoais organizados
- ✅ Informações de contato e endereço

### Validações (Prontas para uso)
- ✅ CPF (com validação de dígitos)
- ✅ Email
- ✅ Telefone brasileiro
- ✅ CEP
- ✅ Nome completo
- ✅ Idade mínima
- ✅ Foto 3x4 (proporção e tamanho)

### Formatações Automáticas
- ✅ CPF: `000.000.000-00`
- ✅ Telefone: `(00) 00000-0000`
- ✅ CEP: `00000-000`
- ✅ RG: `00.000.000-0`

## 🎨 Sistema de Cores

- **Verde**: Credencial válida (mais de 1 ano)
- **Amarelo**: Atenção (6 meses a 1 ano)
- **Vermelho**: Vencendo ou expirado (menos de 6 meses)

## 🔄 Próximos Passos (Produção)

Para usar em produção com dados reais:

1. **Configurar Firebase**
   - Criar projeto no Firebase Console
   - Ativar Authentication (Email/Senha)
   - Ativar Firestore Database
   - Ativar Storage

2. **Substituir Dados Mock**
   - Descomentar imports do Firebase nos componentes
   - Remover dados mock dos dashboards
   - Configurar credenciais em `src/services/firebase.js`

3. **Implementar Registro Real**
   - Ativar formulário de registro completo
   - Conectar com Firebase Authentication
   - Salvar dados no Firestore

## 📱 Responsividade

O sistema é totalmente responsivo:
- 📱 Mobile (smartphones)
- 📱 Tablet  
- 💻 Desktop

## 🐛 Modo Teste - Limitações

- Não salva dados (tudo em memória/localStorage)
- Não envia emails
- Não faz upload real de fotos
- Dados resetam ao recarregar a página
- Usuários mock fixos

## 💡 Dicas de Teste

1. Teste com email contendo "admin" para ver painel administrativo
2. Teste com email comum para ver painel de usuário
3. Observe as diferentes cores de status no dashboard admin
4. Verifique a barra de progresso no perfil do usuário
5. Teste os filtros e busca no painel admin

## 🚀 Comandos Disponíveis

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Criar build de produção
npm run build

# Preview da build
npm run preview
```

## 📞 Suporte

Sistema desenvolvido com ❤️ usando React + Vite + Tailwind CSS

---

**Status**: ✅ Pronto para testes e demonstração  
**Modo**: 🧪 Teste (sem backend)  
**Próximo passo**: Configurar Firebase para produção
