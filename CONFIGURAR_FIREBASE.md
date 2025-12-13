# Guia Rápido - Configurar Permissões no Firebase

## ⚠️ IMPORTANTE - Execute estes passos AGORA

O erro "Missing or insufficient permissions" acontece porque as regras de segurança do Firestore não estão configuradas.

---

## 📋 Passo 1: Configurar Firestore Rules

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto: **capelania-aa2d4**
3. No menu lateral, clique em **Firestore Database**
4. Clique na aba **Rules** (Regras)
5. **Substitua todo o conteúdo** pelo código abaixo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Coleção de usuários
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    
    // Coleção de capelães
    match /capeloes/{capelaoId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == capelaoId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

6. Clique em **Publish** (Publicar)

---

## 📋 Passo 2: Configurar Storage Rules

1. No Firebase Console, clique em **Storage** no menu lateral
2. Clique na aba **Rules** (Regras)
3. **Substitua todo o conteúdo** pelo código abaixo:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Clique em **Publish** (Publicar)

---

## 📋 Passo 3: Verificar se o usuário admin foi criado

1. No Firebase Console, vá em **Firestore Database**
2. Clique na aba **Data** (Dados)
3. Procure pela coleção **users**
4. Encontre o documento do seu usuário admin (admin@gmail.com)
5. Verifique se existe o campo **role** com valor **"admin"**
6. Se não existir, clique no documento e adicione:
   - Campo: `role`
   - Tipo: `string`
   - Valor: `admin`

---

## 🔄 Passo 4: Testar

Depois de aplicar as regras:

1. Feche todas as abas do navegador
2. Limpe o cache (Ctrl + Shift + Delete)
3. Acesse novamente: http://localhost:5173
4. Faça login com admin@gmail.com

---

## ✅ O que essas regras fazem?

### Firestore:
- ✅ Qualquer usuário autenticado pode **ler** qualquer documento
- ✅ Qualquer usuário autenticado pode **criar** seu próprio registro
- ✅ Usuários podem **atualizar** apenas seus próprios dados
- ✅ **Admins** podem atualizar qualquer registro

### Storage:
- ✅ Qualquer usuário autenticado pode fazer upload e download de arquivos

---

## ⚠️ SEGURANÇA

**IMPORTANTE:** Estas regras são adequadas para desenvolvimento e testes.

Para produção, você deve:
1. Restringir mais as permissões de leitura
2. Adicionar validação de dados
3. Limitar tamanho de upload
4. Validar tipos de arquivo

---

## 🆘 Ainda com erro?

Se ainda aparecer erro de permissão:

1. Verifique se você fez login (veja no canto superior direito do app)
2. Verifique no Console do Firebase se as regras foram publicadas
3. Aguarde 1-2 minutos (às vezes demora para propagar)
4. Limpe o cache do navegador novamente
5. Feche e abra o navegador completamente

---

## 📝 Estrutura esperada no Firestore

Após o registro, você deve ter:

```
users (coleção)
  └── {uid} (documento)
      ├── email: "admin@gmail.com"
      ├── role: "admin"
      ├── createdAt: timestamp
      └── updatedAt: timestamp

capeloes (coleção)
  └── {uid} (documento)
      ├── nomeCompleto: "..."
      ├── email: "..."
      ├── cpf: "..."
      ├── telefone: "..."
      ├── cargoEclesiastico: "..."
      ├── igreja: "..."
      ├── cidadeAtual: "..."
      ├── expirationDate: timestamp
      └── ... (outros campos)
```

---

## 🎯 Próximos Passos

1. ✅ Configure as regras do Firestore (Passo 1)
2. ✅ Configure as regras do Storage (Passo 2)
3. ✅ Adicione role="admin" ao seu usuário (Passo 3)
4. ✅ Teste o sistema (Passo 4)
5. 📝 Cadastre alguns capelães para testar
6. 🎨 Customize conforme necessário

---

**Qualquer dúvida, me avise! 🚀**
