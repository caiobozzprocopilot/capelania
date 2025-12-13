# 📋 Exemplo de Estrutura do Excel Exportado

## Aba: "Capelões"

| Nome Completo | CPF | RG | Data de Nascimento | Idade | Nome da Mãe | Nome do Pai | Cargo Eclesiástico | Igreja | Cidade Natal | Cidade Atual | Telefone | Email | Rua | Número | Complemento | Bairro | CEP | Data de Validade | Data de Cadastro | Status | Arquivo da Foto |
|--------------|-----|----|--------------------|-------|-------------|-------------|-------------------|--------|--------------|--------------|----------|-------|-----|--------|-------------|--------|-----|------------------|------------------|--------|-----------------|
| João Silva Santos | 123.456.789-00 | 12.345.678-9 | 15/05/1980 | 45 | Maria Silva | José Santos | Pastor | Igreja Central | São Paulo | São Paulo | (11) 98765-4321 | joao@email.com | Rua das Flores | 123 | Apto 45 | Centro | 01234-567 | 01/01/2029 | 01/01/2025 | active | fotos/capelao_12345678900.jpg |
| Maria Oliveira Costa | 987.654.321-00 | 98.765.432-1 | 20/08/1985 | 40 | Ana Oliveira | Paulo Costa | Presbítera | Igreja do Vale | Rio de Janeiro | São Paulo | (11) 91234-5678 | maria@email.com | Av. Paulista | 1000 | Sala 10 | Bela Vista | 01310-100 | 15/06/2026 | 15/06/2022 | warning | fotos/capelao_98765432100.jpg |
| Pedro Henrique | 456.789.123-00 | 45.678.912-3 | 10/03/1975 | 50 | Rosa Henrique | Carlos Silva | Evangelista | Assembleia | Curitiba | Curitiba | (41) 99876-5432 | pedro@email.com | Rua XV | 500 | - | Alto da Glória | 80060-000 | 20/11/2025 | 20/11/2021 | expiring-soon | fotos/capelao_45678912300.jpg |

---

## Aba: "Informações"

```
Sistema de Gerenciamento de Capelania
Data de Exportação:     12/12/2025 14:30:25
Total de Registros:     3

Instruções para a Gráfica:
1. As fotos estão na pasta "fotos" dentro do ZIP
2. Os nomes dos arquivos seguem o padrão: capelao_CPF.jpg
3. A coluna "Arquivo da Foto" indica o caminho de cada foto
4. Fotos sem cadastro aparecem como "SEM FOTO"
```

---

## 📁 Estrutura do ZIP

```
credenciais_para_grafica_2025-12-12.zip (15.2 MB)
│
├── credenciais_para_grafica.xlsx (45 KB)
│   ├── Aba: Capelões (dados principais)
│   └── Aba: Informações (instruções)
│
└── fotos/ (15.1 MB)
    ├── capelao_12345678900.jpg (180 KB)
    ├── capelao_98765432100.jpg (165 KB)
    ├── capelao_45678912300.jpg (172 KB)
    └── ... (outras fotos)
```

---

## 🎨 Formatação Aplicada

### **Larguras de Coluna**
- Nome Completo: 30 caracteres
- CPF/RG: 15 caracteres
- Datas: 15 caracteres
- Endereços: 20-35 caracteres
- Arquivo da Foto: 35 caracteres

### **Formatação de Dados**
✅ CPF: `123.456.789-00` (com pontos e hífen)
✅ Telefone: `(11) 98765-4321` (formatado)
✅ CEP: `01234-567` (com hífen)
✅ Datas: `DD/MM/AAAA`

### **Status**
- `active` = Ativo
- `warning` = Atenção
- `expiring-soon` = Vencendo em breve
- `expired` = Expirado

---

## 📸 Exemplo de Fotos

### **Nomenclatura**
```
capelao_[CPF_SEM_FORMATACAO].jpg

Exemplos:
- capelao_12345678900.jpg
- capelao_98765432100.jpg
- capelao_45678912300.jpg
```

### **Formato**
- Tipo: JPEG
- Qualidade: 80%
- Tamanho: ~50-200 KB por foto
- Dimensões: Proporcional (máx 800px largura)
- Orientação: Vertical (3x4)

---

## 🔗 Relação Excel ↔ Foto

### **Como a Gráfica Usa**

1. **Abre o Excel**
2. **Lê a linha do capelão**
3. **Verifica coluna "Arquivo da Foto"**
4. **Abre a foto correspondente**: `fotos/capelao_12345678900.jpg`
5. **Imprime credencial** com os dados + foto

### **Software Gráfico Compatível**
- Adobe InDesign (Data Merge)
- CorelDRAW (Merge Print)
- Microsoft Publisher
- Qualquer software com recurso de "mala direta"

---

## ⚙️ Configuração na Gráfica

### **InDesign - Data Merge**
```
1. Criar template da credencial
2. File → Utilities → Data Merge
3. Select Data Source → credenciais_para_grafica.xlsx
4. Arrastar campos para o template
5. Para foto: Link to Image → @Arquivo da Foto@
6. Preview → Export → Generate
```

### **CorelDRAW - Merge Print**
```
1. Criar template da credencial
2. Ferramentas → Mala Direta → Criar/Carregar
3. Selecionar credenciais_para_grafica.xlsx
4. Inserir campos no template
5. Foto: Inserir → Merge Field → Picture
6. Merge → Print/Export
```

---

## 📊 Exemplo Visual

```
╔══════════════════════════════════════════════════════════╗
║  CREDENCIAL DE CAPELÃO                                   ║
╠════════════════════════╤═════════════════════════════════╣
║                        │  Nome: João Silva Santos        ║
║   [FOTO 3x4]          │  CPF: 123.456.789-00           ║
║   capelao_            │  Cargo: Pastor                  ║
║   12345678900.jpg     │  Igreja: Igreja Central         ║
║                        │  Cidade: São Paulo              ║
║                        │  Validade: 01/01/2029           ║
╚════════════════════════╧═════════════════════════════════╝
```

---

## ✅ Checklist para Gráfica

Antes de imprimir, verificar:

- [ ] Todas as fotos estão abrindo corretamente?
- [ ] CPFs estão legíveis e formatados?
- [ ] Datas de validade estão corretas?
- [ ] Nomes estão completos?
- [ ] Cargos eclesiásticos estão claros?
- [ ] Igrejas e cidades estão corretas?
- [ ] Template está vinculado corretamente?
- [ ] Preview de impressão está OK?

---

**Arquivo pronto para uso profissional!** 🎉
