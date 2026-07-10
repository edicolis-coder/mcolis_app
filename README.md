# App de Pedidos

## Estrutura do projeto

```
projeto-pedidos/
├── public/
│   └── index.html      → o app (login + catálogo + comanda)
├── api/
│   └── pedido.js        → função que recebe o pedido e envia ao Olist
└── README.md
```

A Vercel reconhece essa estrutura automaticamente:
- Tudo dentro de `public/` vira o site.
- Tudo dentro de `api/` vira uma função de backend, acessível em `/api/pedido`.

## Como publicar

1. Crie uma conta gratuita em **github.com** (se ainda não tiver).
2. Crie um novo repositório (ex: `app-pedidos`) e suba estes três itens
   (`public/`, `api/`, `README.md`) exatamente nessa estrutura de pastas.
   - Pode ser pelo site do GitHub mesmo: "Add file" → "Upload files" →
     arraste a pasta inteira.
3. Crie uma conta gratuita em **vercel.com**, fazendo login com o GitHub.
4. Clique em **"Add New Project"** e selecione o repositório `app-pedidos`.
5. Antes de clicar em "Deploy", vá em **Environment Variables** e adicione:
   - `OLIST_CLIENT_ID`
   - `OLIST_CLIENT_SECRET`
   - `OLIST_ACCESS_TOKEN`
   - `OLIST_PEDIDO_URL` (a URL exata do endpoint de incluir pedido, conforme
     a documentação da API v3 do Olist)
6. Clique em **Deploy**. Em cerca de 1 minuto você recebe uma URL pública,
   tipo `app-pedidos.vercel.app`.

## Próximos ajustes antes de ir para produção

- [ ] Confirmar no Swagger da API v3 do Olist o formato exato esperado pelo
      endpoint de "incluir pedido" (nomes de campos podem variar).
- [ ] Implementar a geração/renovação do token OAuth2 (hoje a função espera
      um token já pronto em `OLIST_ACCESS_TOKEN`).
- [ ] Trocar a lista de produtos fixa no `index.html` por uma busca dinâmica
      (por exemplo, vindo do próprio estoque do Olist).
