# 🔐 Como Criar o Primeiro Usuário Admin

## ⚠️ IMPORTANTE - Leia Antes de Começar

O sistema está deployado e as regras de segurança estão ativas. Você precisa criar o primeiro admin para poder acessar o sistema.

---

## 📝 Método 1: Firebase Console (Recomendado)

### **Passo 1: Criar Usuário no Authentication**

1. Acesse: https://console.firebase.google.com/project/capelania-aa2d4/authentication/users

2. Clique em **"Add User"**

3. Preencha:
   - **Email:** `admin@capelania.com` (ou seu email)
   - **Password:** `Admin@2025` (ou senha segura)

4. Clique em **"Add User"**

5. **COPIE O UID** do usuário criado (algo como: `kX9mL2pQ3rT5vZ8wY1...`)

---

### **Passo 2: Criar Documento no Firestore**

1. Acesse: https://console.firebase.google.com/project/capelania-aa2d4/firestore

2. Clique em **"Start Collection"** (se for a primeira vez) ou encontre a collection **"users"**

3. **Collection ID:** `users`

4. Clique em **"Add Document"**

5. **Document ID:** [Cole o UID que você copiou]

6. Adicione os seguintes campos:

| Campo | Tipo | Valor |
|-------|------|-------|
| uid | string | [O UID copiado] |
| email | string | admin@capelania.com |
| role | string | admin |
| nomeCompleto | string | Administrador do Sistema |
| createdAt | string | 2025-12-12T00:00:00.000Z |
| updatedAt | string | 2025-12-12T00:00:00.000Z |

7. Clique em **"Save"**

---

### **Passo 3: Fazer Login**

1. Acesse: https://capelania-aa2d4.web.app

2. Clique em **"Entrar"**

3. Use as credenciais:
   - **Email:** `admin@capelania.com`
   - **Senha:** `Admin@2025`

4. ✅ Você será redirecionado para o **Painel Administrativo**

---

## 📝 Método 2: Temporariamente Liberar Registro

Se preferir criar pelo próprio sistema (mais fácil):

### **Passo 1: Editar Regras Temporariamente**

Edite o arquivo `firestore.rules` e substitua a seção de users:

```javascript
// Collection: users
match /users/{userId} {
  // TEMPORÁRIO - Permite criação livre
  allow read, create: if request.auth != null;
  allow update: if isOwner(userId);
  allow delete: if isAdmin();
}
```

### **Passo 2: Deploy das Regras**

```bash
firebase deploy --only firestore:rules
```

### **Passo 3: Criar Conta pelo Sistema**

1. Acesse: https://capelania-aa2d4.web.app/register
2. Preencha o formulário de registro
3. Faça login

### **Passo 4: Promover a Admin**

1. Acesse o Firestore Console
2. Encontre o documento do seu usuário em `users/[seu-uid]`
3. Edite o campo `role` e mude para `"admin"`
4. Salve

### **Passo 5: Restaurar Regras**

Restaure o `firestore.rules` original e faça deploy:

```bash
firebase deploy --only firestore:rules
```

---

## 🔒 Verificar se Funcionou

### **Checklist:**

1. ✅ Consegue fazer login?
2. ✅ É redirecionado para `/admin`?
3. ✅ Vê o dashboard administrativo?
4. ✅ Consegue criar novo capelão?
5. ✅ Vê botão "Exportar Dados"?

Se todos os itens acima são "SIM", está funcionando! 🎉

---

## 🆘 Problemas Comuns

### **"Missing or insufficient permissions"**

**Causa:** O campo `role` não está como `"admin"` ou o documento não existe.

**Solução:**
1. Verifique no Firestore Console
2. Confirme que o documento existe em `users/[uid]`
3. Confirme que `role` = `"admin"` (exatamente assim, minúsculo)

---

### **"User not found"**

**Causa:** Usuário criado no Authentication mas não no Firestore.

**Solução:**
1. Crie o documento no Firestore seguindo o Método 1
2. Use o mesmo UID do Authentication

---

### **Não redireciona para admin**

**Causa:** O sistema verifica o campo `role` no documento do Firestore.

**Solução:**
1. Faça logout
2. Verifique o Firestore
3. Faça login novamente

---

## 📋 Template JSON para Copiar/Colar

Se o console permitir importar JSON:

```json
{
  "uid": "COLE_O_UID_AQUI",
  "email": "admin@capelania.com",
  "role": "admin",
  "nomeCompleto": "Administrador do Sistema",
  "createdAt": "2025-12-12T00:00:00.000Z",
  "updatedAt": "2025-12-12T00:00:00.000Z"
}
```

**Lembre-se:** Substitua `COLE_O_UID_AQUI` pelo UID real!

---

## 🎯 Após Criar o Admin

1. **Fazer backup das credenciais**
2. **Criar outros usuários pelo sistema**
3. **Cadastrar capelões**
4. **Testar exportação**
5. **Configurar outros admins se necessário**

---

## 🔐 Segurança

⚠️ **Nunca compartilhe:**
- Senha do admin
- UID dos usuários
- Chaves do Firebase

✅ **Boas práticas:**
- Use senha forte (mín 12 caracteres)
- Ative 2FA no Google Account
- Faça backup regular do Firestore
- Monitore logs de acesso

---

**Sistema pronto para uso!** 🚀

URL: https://capelania-aa2d4.web.app
