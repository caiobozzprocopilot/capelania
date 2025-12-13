# Migração de Storage para Base64

## ✅ Alterações Implementadas

### 1. **Novo Helper para Imagens** (`src/utils/imageHelpers.js`)
Criado utilitário completo para manipulação de imagens em Base64:
- `compressImageFile()` - Comprime imagens mantendo qualidade
- `stripDataPrefix()` - Remove prefixo data:image
- `addDataPrefix()` - Adiciona prefixo para exibição
- `validateBase64Size()` - Valida tamanho máximo (950KB)

### 2. **Atualização do capelaoService.js**
- ✅ Removidos imports do Firebase Storage
- ✅ Removidas funções `uploadPhoto()` e `deletePhoto()`
- ✅ `createCapelao()` agora salva `fotoB64` e `fotoMime` no Firestore
- ✅ `updateCapelao()` atualizado para trabalhar com Base64
- ✅ `deleteCapelao()` simplificado (não precisa mais deletar do Storage)
- ✅ Validação de tamanho Base64 adicionada

### 3. **Atualização do ImageUpload.jsx**
- ✅ Compressão automática de imagens (800px largura, 80% qualidade)
- ✅ Validação de tamanho final (máx 950KB)
- ✅ Retorna Base64 puro ao invés de File
- ✅ Preview funcional com data URL
- ✅ Mensagens de erro melhoradas

### 4. **Atualização do RegistrationForm.jsx**
- ✅ Estado alterado de `foto/fotoPreview` para `fotoB64/fotoMime`
- ✅ `handleImageChange()` recebe Base64 ao invés de File
- ✅ Validação atualizada para verificar `fotoB64`

### 5. **Atualização das Páginas de Exibição**
- ✅ **AdminDashboard.jsx** - Usa `addDataPrefix()` para exibir fotos
- ✅ **UserDashboard.jsx** - Usa `addDataPrefix()` para exibir fotos
- ✅ Ambas verificam `fotoB64` ao invés de `photoURL`

### 6. **Atualização do Firebase**
- ✅ **firebase.js** - Removido import e export do Storage
- ✅ **firebase.json** - Removida configuração de Storage
- ⚠️ **storage.rules** - Pode ser deletado (não é mais usado)

## 📊 Estrutura de Dados no Firestore

### Antes (com Storage):
```javascript
{
  nomeCompleto: "João Silva",
  cpf: "12345678900",
  photoURL: "https://firebasestorage.googleapis.com/...",
  // ... outros campos
}
```

### Agora (com Base64):
```javascript
{
  nomeCompleto: "João Silva",
  cpf: "12345678900",
  fotoB64: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBD...", // Base64 puro
  fotoMime: "image/jpeg",
  // ... outros campos
}
```

## 🎯 Vantagens da Mudança

### ✅ Simplicidade
- Não precisa gerenciar Firebase Storage
- Menos configuração e complexidade
- Um serviço a menos para manter

### ✅ Performance
- Menos requisições HTTP (tudo em uma query)
- Compressão automática otimiza tamanho
- Cache do Firestore funciona melhor

### ✅ Custo
- Economia no Firebase Storage
- Apenas Firestore (já incluído no plano)

### ✅ Segurança
- Regras mais simples (apenas Firestore)
- Controle centralizado de acesso
- Menos superfície de ataque

## ⚠️ Limitações

### Tamanho Máximo
- **Firestore**: 1MB por documento
- **Nossa implementação**: 950KB para foto (margem de segurança)
- Compressão automática para 800px largura

### Tipos Suportados
- JPEG (recomendado)
- PNG (convertido para JPEG na compressão)

## 🔧 Como Funciona

### 1. Upload de Foto
```javascript
// Usuário seleciona arquivo
const file = e.target.files[0];

// Comprime automaticamente
const { dataUrl } = await compressImageFile(file, 800, 0.8);

// Extrai Base64 puro
const base64 = stripDataPrefix(dataUrl);

// Valida tamanho
if (base64.length > 950000) {
  alert("Imagem muito grande!");
  return;
}

// Salva no Firestore
await createCapelao({
  ...dados,
  fotoB64: base64,
  fotoMime: "image/jpeg"
});
```

### 2. Exibição de Foto
```javascript
// Adiciona prefixo para exibição
const dataUrl = addDataPrefix(capelao.fotoB64, capelao.fotoMime);

// Renderiza
<img src={dataUrl} alt="Foto" />
```

## 🚀 Próximos Passos

### Migração de Dados Existentes
Se houver dados antigos com `photoURL`, criar script de migração:

```javascript
// Script de migração (executar uma vez)
const migratePhotos = async () => {
  const capeloes = await getAllCapeloes();
  
  for (const capelao of capeloes.data) {
    if (capelao.photoURL && !capelao.fotoB64) {
      // Baixar foto do Storage
      const response = await fetch(capelao.photoURL);
      const blob = await response.blob();
      
      // Converter para Base64
      const { dataUrl } = await compressImageFile(blob);
      const base64 = stripDataPrefix(dataUrl);
      
      // Atualizar Firestore
      await updateCapelao(capelao.id, {
        fotoB64: base64,
        fotoMime: "image/jpeg"
      });
      
      // Opcional: deletar do Storage
      await deletePhoto(capelao.photoURL);
    }
  }
};
```

### Limpeza
- [ ] Deletar arquivo `storage.rules` (não é mais usado)
- [ ] Executar script de migração se houver dados antigos
- [ ] Desabilitar Storage no console do Firebase (opcional)

## 📝 Notas Técnicas

### Compressão
- Largura máxima: 800px (proporcional)
- Qualidade JPEG: 80%
- Formato de saída: sempre JPEG

### Validação
- Tipos aceitos: JPEG, PNG
- Tamanho do arquivo original: até 2MB
- Tamanho Base64 final: até 950KB

### Performance
- Compressão client-side (não sobrecarrega servidor)
- Preview instantâneo
- Validação em tempo real
