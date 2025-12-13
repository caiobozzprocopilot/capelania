# 🚀 Guia de Deploy - Firebase

## ✅ Deploy Realizado com Sucesso!

**URL da Aplicação:** https://capelania-aa2d4.web.app
**Console do Firebase:** https://console.firebase.google.com/project/capelania-aa2d4/overview

---

## 📦 O Que Foi Deployado

### 1. **Firebase Hosting**
- ✅ Build de produção (pasta `dist/`)
- ✅ Configuração de SPA (rewrites)
- ✅ Cache otimizado para assets
- ✅ Compressão gzip automática

### 2. **Firestore Rules**
- ✅ Regras de segurança atualizadas
- ✅ Controle de acesso por role (admin/user)
- ✅ Proteção contra auto-promoção
- ✅ Validações de permissões

### 3. **Firestore Indexes**
- ✅ Configuração de índices (firestore.indexes.json)

---

## 🔐 Configuração Inicial - IMPORTANTE!

### **Criar Primeiro Usuário Admin**

Como o sistema exige autenticação e as regras estão ativas, você precisa criar o primeiro admin manualmente:

#### **Opção 1: Via Firebase Console (Recomendado)**

1. **Acesse o Firebase Console:**
   https://console.firebase.google.com/project/capelania-aa2d4/firestore

2. **Crie o primeiro usuário no Authentication:**
   - Vá em: Authentication → Users → Add User
   - Email: `admin@capelania.com` (ou seu email)
   - Senha: `SenhaSegura123!`
   - Copie o **UID** gerado

3. **Adicione o documento no Firestore:**
   - Vá em: Firestore Database → users (collection)
   - Add Document
   - Document ID: [Cole o UID copiado]
   - Campos:
     ```json
     {
       "uid": "[UID copiado]",
       "email": "admin@capelania.com",
       "role": "admin",
       "nomeCompleto": "Administrador",
       "createdAt": "[data atual ISO]",
       "updatedAt": "[data atual ISO]"
     }
     ```

#### **Opção 2: Temporariamente Abrir as Regras**

Se preferir criar pelo próprio sistema:

1. **Edite temporariamente firestore.rules:**
   ```javascript
   match /users/{userId} {
     allow create: if request.auth != null; // Permite criar qualquer usuário
   }
   ```

2. **Deploy das regras:**
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Acesse a aplicação e registre-se**

4. **Promova a admin no Firestore Console:**
   - Vá no documento do usuário criado
   - Edite o campo `role` para `"admin"`

5. **Restaure as regras originais e faça deploy novamente**

---

## 🔒 Regras de Segurança Implementadas

### **Collection: users**
```
✅ Leitura: Próprio usuário ou admin
✅ Criação: Qualquer autenticado (role: user)
✅ Atualização: Próprio usuário (não pode mudar role)
✅ Exclusão: Apenas admin
```

### **Collection: capeloes**
```
✅ Leitura: Qualquer autenticado
✅ Criação: Apenas admin
✅ Atualização: Apenas admin
✅ Exclusão: Apenas admin
```

---

## 📋 Comandos Úteis

### **Build Local:**
```bash
npm run build
```

### **Preview do Build:**
```bash
npm run preview
```

### **Deploy Completo:**
```bash
firebase deploy
```

### **Deploy Apenas Hosting:**
```bash
firebase deploy --only hosting
```

### **Deploy Apenas Firestore Rules:**
```bash
firebase deploy --only firestore:rules
```

### **Ver Logs:**
```bash
firebase functions:log
```

---

## 🌐 URLs Importantes

- **Aplicação:** https://capelania-aa2d4.web.app
- **Console Firebase:** https://console.firebase.google.com/project/capelania-aa2d4
- **Authentication:** https://console.firebase.google.com/project/capelania-aa2d4/authentication/users
- **Firestore:** https://console.firebase.google.com/project/capelania-aa2d4/firestore
- **Hosting:** https://console.firebase.google.com/project/capelania-aa2d4/hosting

---

## 🔄 Fluxo de Atualização

### **Para fazer novas alterações:**

1. **Desenvolver localmente:**
   ```bash
   npm run dev
   ```

2. **Testar as mudanças**

3. **Fazer build:**
   ```bash
   npm run build
   ```

4. **Deploy:**
   ```bash
   firebase deploy
   ```

---

## ⚙️ Configurações do Projeto

### **firebase.json:**
```json
{
  "hosting": {
    "public": "dist",           // Pasta do build
    "rewrites": [               // SPA routing
      {"source": "**", "destination": "/index.html"}
    ],
    "headers": [                // Cache otimizado
      {"source": "**/*.@(jpg|jpeg|gif|png|svg|webp)", 
       "headers": [{"key": "Cache-Control", "value": "max-age=31536000"}]},
      {"source": "**/*.@(js|css)", 
       "headers": [{"key": "Cache-Control", "value": "max-age=31536000"}]}
    ]
  }
}
```

### **Variáveis de Ambiente:**
As credenciais do Firebase estão em:
- `src/services/firebase.js` (hardcoded)
- `.env.example` (template)

> ⚠️ **Nota:** Em produção, as chaves do Firebase podem ficar expostas no frontend. Isso é normal e seguro desde que as regras do Firestore estejam configuradas corretamente.

---

## 🐛 Troubleshooting

### **Erro: "Missing or insufficient permissions"**
→ Verifique as regras do Firestore
→ Confirme que o usuário tem role "admin"

### **Erro 404 ao recarregar página**
→ Já configurado! O rewrite no firebase.json resolve isso.

### **Build muito grande (>500KB)**
→ Normal para o tamanho do projeto
→ Firebase faz compressão gzip automática

### **Deploy falha**
```bash
# Login novamente
firebase login --reauth

# Tente novamente
firebase deploy
```

---

## ✅ Checklist Pós-Deploy

- [ ] Aplicação acessível em https://capelania-aa2d4.web.app
- [ ] Login funciona
- [ ] Criar primeiro usuário admin
- [ ] Testar cadastro de capelão
- [ ] Testar upload de foto (Base64)
- [ ] Testar exportação para Excel
- [ ] Verificar filtros no dashboard
- [ ] Testar em dispositivo móvel
- [ ] Configurar domínio customizado (opcional)

---

## 🎯 Próximos Passos Recomendados

1. **Domínio Customizado (Opcional):**
   - Firebase Hosting → Add custom domain
   - Configurar DNS
   - SSL automático

2. **Monitoring:**
   - Ativar Firebase Analytics
   - Configurar alertas de erro
   - Monitorar uso do Firestore

3. **Backup:**
   - Configurar backup automático do Firestore
   - Export regular dos dados

4. **Segurança:**
   - Rotação de senhas de admin
   - Auditoria de acessos
   - Review de permissões

---

**Deploy completo e funcional!** 🎉

Acesse: https://capelania-aa2d4.web.app
