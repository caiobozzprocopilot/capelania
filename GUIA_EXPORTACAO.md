# 📊 Guia de Exportação para Gráfica

## ✅ Funcionalidade Implementada

Sistema completo de exportação de dados dos capelões para envio à gráfica para impressão das credenciais.

---

## 🎯 Como Usar

### 1. **Acesse o Painel Administrativo**
- Login como admin
- Dashboard mostra todos os capelões cadastrados

### 2. **Aplique Filtros (Opcional)**
Você pode filtrar antes de exportar:
- 🔍 **Busca** por nome, CPF ou email
- 📊 **Status**: Ativos, Vencendo, Expirados
- 🏙️ **Cidade**: Filtrar por cidade específica
- ⛪ **Igreja**: Filtrar por igreja específica

### 3. **Clique em "Exportar Dados"**
- Botão no topo direito do dashboard
- Mostra quantos registros serão exportados
- Abre modal com opções de exportação

### 4. **Escolha o Formato**

#### **Opção A: ZIP com Excel + Fotos** ⭐ (Recomendado)
```
credenciais_para_grafica_2025-12-12.zip
├── credenciais_para_grafica.xlsx
└── fotos/
    ├── capelao_12345678900.jpg
    ├── capelao_98765432100.jpg
    └── ...
```

**Conteúdo do Excel:**
| Coluna | Descrição |
|--------|-----------|
| Nome Completo | Nome do capelão |
| CPF | Formatado com pontos |
| RG | Número do RG |
| Data de Nascimento | DD/MM/AAAA |
| Idade | Calculada automaticamente |
| Nome da Mãe | Nome completo |
| Nome do Pai | Nome completo |
| Cargo Eclesiástico | Pastor, Presbítero, etc |
| Igreja | Nome da congregação |
| Cidade Natal | Onde nasceu |
| Cidade Atual | Onde reside |
| Telefone | Formatado (11) 99999-9999 |
| Email | Email de contato |
| Rua | Endereço - Rua/Avenida |
| Número | Endereço - Número |
| Complemento | Apto, bloco, etc |
| Bairro | Nome do bairro |
| CEP | Formatado 00000-000 |
| Data de Validade | Validade da credencial |
| Data de Cadastro | Quando foi cadastrado |
| Status | active/expired/warning |
| Arquivo da Foto | Caminho: fotos/capelao_CPF.jpg |

**Aba "Informações":**
- Data da exportação
- Total de registros
- Instruções para a gráfica

#### **Opção B: Apenas Excel (sem fotos)**
Apenas a planilha com os dados, útil para:
- Relatórios
- Análises
- Quando não precisa das fotos

---

## 📸 Como Funcionam as Fotos

### **Conversão Base64 → JPG**
1. Sistema lê Base64 do Firestore
2. Converte para arquivo JPG real
3. Nomeia como: `capelao_CPF.jpg`
4. Adiciona na pasta "fotos/" do ZIP

### **Referência no Excel**
Coluna "Arquivo da Foto" contém:
- ✅ `fotos/capelao_12345678900.jpg` - tem foto
- ⚠️ `SEM FOTO` - não cadastrou foto

### **Qualidade das Fotos**
- Formato: JPEG
- Compressão: 80% (já otimizado)
- Tamanho: ~50-200KB por foto
- Resolução: Mantém original (até 800px largura)

---

## 📦 O Que Enviar para a Gráfica

### **Arquivo Completo**
```
✉️ Envie: credenciais_para_grafica_YYYY-MM-DD.zip
```

### **Instruções para a Gráfica**
```
Prezada Gráfica,

Segue arquivo com dados para impressão de credenciais:

📄 Arquivo: credenciais_para_grafica_2025-12-12.zip

📋 Conteúdo:
- Excel com todos os dados dos capelães
- Pasta "fotos" com as fotos 3x4 em JPG
- Aba "Informações" com instruções

🔗 Relação Foto-Dados:
- Coluna "Arquivo da Foto" indica qual imagem usar
- Exemplo: fotos/capelao_12345678900.jpg

📊 Total de credenciais: XX registros

Qualquer dúvida, estou à disposição.

Atenciosamente,
[Seu nome]
```

---

## 🎯 Casos de Uso

### **1. Nova Remessa de Credenciais**
```
1. Filtrar: Status = "Ativos"
2. Exportar com fotos
3. Enviar para gráfica
```

### **2. Renovações Específicas**
```
1. Filtrar: Status = "Vencendo" ou "Expirados"
2. Exportar com fotos
3. Enviar para renovação
```

### **3. Por Igreja**
```
1. Filtrar: Igreja = "Igreja Central"
2. Exportar com fotos
3. Lote específico
```

### **4. Relatório sem Fotos**
```
1. Aplicar filtros desejados
2. Escolher "Apenas Excel"
3. Usar para análises
```

---

## 🔧 Especificações Técnicas

### **Bibliotecas Utilizadas**
- `xlsx` (SheetJS) - Geração de Excel
- `jszip` - Criação de ZIP
- `file-saver` - Download de arquivos

### **Formato de Arquivos**
- **Excel**: .xlsx (Office Open XML)
- **Fotos**: .jpg (JPEG, 80% qualidade)
- **ZIP**: Compressão padrão

### **Limites**
- ✅ Até 1000 registros por exportação
- ✅ Fotos até 950KB cada (Base64)
- ✅ ZIP final: ~10-100MB (depende de quantos)

### **Performance**
- Exportação de 100 registros: ~5-10 segundos
- Inclui conversão Base64 → JPG
- Download automático ao finalizar

---

## ❓ Perguntas Frequentes

### **P: A gráfica precisa de software especial?**
R: Não! É um ZIP normal com Excel e JPG. Qualquer software gráfico lê.

### **P: Posso exportar apenas alguns capelães?**
R: Sim! Use os filtros antes de exportar. Apenas os filtrados serão exportados.

### **P: E se um capelão não tem foto?**
R: Aparecerá "SEM FOTO" no Excel. A gráfica saberá que precisa solicitar.

### **P: Posso exportar várias vezes?**
R: Sim! Cada exportação gera novo arquivo com data no nome.

### **P: O arquivo fica muito grande?**
R: Depende da quantidade. ~100 registros = ~10-20MB.

### **P: Preciso ter Excel instalado?**
R: Não para exportar. Mas para visualizar o resultado sim (ou Google Sheets, LibreOffice).

---

## 🚀 Próximos Passos

1. **Testar exportação** com poucos registros
2. **Validar com a gráfica** se o formato está OK
3. **Ajustar campos** se a gráfica pedir algo específico
4. **Documentar processo interno** para outros admins

---

## 🆘 Suporte

**Problemas comuns:**

❌ **"Nenhum capelão encontrado"**
→ Remova os filtros ou cadastre capelões

❌ **"Erro ao exportar"**
→ Verifique se há fotos corrompidas
→ Tente exportar sem fotos primeiro

❌ **"Arquivo muito grande"**
→ Exporte em lotes menores
→ Use filtros para dividir

---

**Sistema pronto para uso!** 🎉
