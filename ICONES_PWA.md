# Ícones PWA - Instruções

Para o PWA funcionar corretamente, você precisa adicionar 2 ícones na pasta `public/`:

## Ícones Necessários:

1. **icon-192x192.png** (192x192 pixels)
2. **icon-512x512.png** (512x512 pixels)

## Como Criar os Ícones:

### Opção 1: Usar o Logo DECAP
- Pegue o logo do DECAP (aquele com a chama vermelha)
- Redimensione para 512x512 pixels
- Salve como `icon-512x512.png`
- Redimensione para 192x192 pixels
- Salve como `icon-192x192.png`

### Opção 2: Usar Ferramenta Online
1. Acesse: https://www.pwabuilder.com/imageGenerator
2. Faça upload do logo do DECAP
3. Baixe os ícones gerados
4. Renomeie para os nomes corretos

### Opção 3: Criar com Fundo Colorido
- Crie um quadrado 512x512 com fundo azul (#2563eb)
- Coloque o logo DECAP centralizado
- Exporte em PNG

## Onde Colocar:
Coloque os arquivos na pasta:
```
D:\CAPELANIA-MAICON-backup\CAPELANIA-MAICON\public\
```

## Depois de Adicionar:
1. Faça build: `npm run build`
2. Deploy: `firebase deploy --only hosting`
3. Teste no celular abrindo https://capelania-aa2d4.web.app
4. Clique em "Adicionar à Tela Inicial"
