# 🔥 Como Aplicar as Regras do Firestore

## ⚠️ URGENTE - Faça isso AGORA para o sistema funcionar!

### Passo 1: Acessar Firebase Console

1. Abra o navegador
2. Vá em: https://console.firebase.google.com/project/capelania-aa2d4/firestore/rules
3. Faça login com sua conta Google se necessário

---

### Passo 2: Aplicar Regras do Firestore

1. Na página que abrir, você verá um editor de código
2. **DELETE TUDO** que está no editor
3. **COPIE E COLE** exatamente isto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Clique no botão **"Publish"** (ou "Publicar") no canto superior direito
5. Confirme a publicação

---

### Passo 3: Configurar o Usuário Admin

1. No Firebase Console, vá em: **Firestore Database**
2. Clique na aba **"Data"** (ou "Dados")
3. Procure a coleção **"users"**
4. Clique na coleção **"users"** para abrir
5. Encontre o documento do usuário **admin@gmail.com**
6. Clique nesse documento
7. Clique em **"Add field"** (Adicionar campo)
8. Preencha:
   - **Field name:** `role`
   - **Type:** `string`
   - **Value:** `admin`
9. Clique em **"Add"** ou **"Save"**

---

### Passo 4: Testar o Sistema

1. Volte para o seu navegador com o sistema (localhost:5173)
2. Pressione **Ctrl + Shift + R** para limpar o cache e recarregar
3. Faça login com:
   - Email: admin@gmail.com
   - Senha: (a senha que você criou)
4. Você deve conseguir acessar o painel admin sem erros!

---

## ✅ Checklist de Verificação

- [ ] Regras do Firestore publicadas
- [ ] Campo `role: "admin"` adicionado ao usuário admin
- [ ] Navegador atualizado com Ctrl + Shift + R
- [ ] Login funcionando sem erros
- [ ] Dashboard carregando normalmente

---

## 🆘 Se ainda der erro

Se depois de fazer tudo isso ainda der erro de permissão:

1. Abra o Console do navegador (F12)
2. Vá na aba "Console"
3. Copie TODOS os erros vermelhos
4. Me envie para eu analisar

---

## 📝 Observações Importantes

- As regras atuais são **MUITO PERMISSIVAS** para facilitar o desenvolvimento
- **TODO:** Antes de colocar em produção, ajuste as regras para serem mais restritivas
- O Storage (upload de fotos) está temporariamente desabilitado
- Para habilitar o Storage, você precisa criar o bucket primeiro
