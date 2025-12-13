# Templates de Credencial

## Como adicionar as imagens dos templates

1. **Salve as imagens do Canva** em alta resolução (PNG):
   - Frente da credencial: salvar como `credential-front.png`
   - Verso da credencial: salvar como `credential-back.png`

2. **Coloque os arquivos nesta pasta** (`public/templates/`)

3. **Requisitos das imagens**:
   - Formato: PNG
   - Resolução recomendada: 1080x680 pixels ou superior
   - Qualidade: Alta (para impressão)

## Posicionamento dos dados (coordenadas aproximadas)

### Frente (credential-front.png):
- **Nome**: x: 235, y: 390 (fonte: Arial Bold 32px)
- **Função**: x: 235, y: 480 (fonte: Arial Bold 28px, texto fixo: "Capelão")
- **Foto 3x4**: x: 795, y: 285, width: 150, height: 200

### Verso (credential-back.png):
- **RG**: x: 46, y: 220 (fonte: Arial Bold 24px)
- **CPF**: x: 312, y: 220
- **Data de Expedição**: x: 524, y: 220
- **Naturalidade**: x: 46, y: 295
- **Data de Nascimento**: x: 524, y: 295
- **Nome da Mãe**: x: 46, y: 370
- **Nome do Pai**: x: 46, y: 407
- **Data de Validade**: x: 680, y: 395

## Ajuste fino

Se as posições não estiverem perfeitas após adicionar as imagens, edite o arquivo:
`src/services/credentialService.js`

Procure pelas linhas com `ctx.fillText()` e ajuste os valores de X e Y conforme necessário.

## Teste

1. Faça login no sistema
2. Acesse o Dashboard do Usuário
3. Clique em "Ver Minha Credencial"
4. Verifique se os dados estão posicionados corretamente
5. Ajuste as coordenadas se necessário
