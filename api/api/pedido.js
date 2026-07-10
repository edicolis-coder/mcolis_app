// api/pedido.js
//
// Esta função roda no servidor (nunca no navegador do cliente).
// Ela recebe o pedido do app e repassa para o Olist ERP.
//
// As credenciais ficam em variáveis de ambiente, configuradas no painel
// da Vercel (Settings > Environment Variables), NUNCA escritas aqui no código:
//   OLIST_CLIENT_ID
//   OLIST_CLIENT_SECRET
//   OLIST_ACCESS_TOKEN   (gerado depois que você autorizar o app no Olist)
//
// Preencha OLIST_TOKEN_URL e OLIST_PEDIDO_URL conforme a documentação
// oficial da API v3 do Olist (Swagger), pois os endpoints exatos e o
// formato de autenticação (OAuth2) precisam ser conferidos lá antes de
// colocar em produção: https://erp.tiny.com.br (documentação da API v3)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const order = req.body;

  if (!order || !order.cliente || !order.itens || order.itens.length === 0) {
    return res.status(400).json({ error: 'Pedido inválido' });
  }

  // --- 1. Monta o corpo no formato que a API de Pedidos de Venda do Olist espera ---
  // ATENÇÃO: os nomes de campo abaixo são um ponto de partida — confirme o
  // schema exato na documentação/Swagger antes de usar em produção.
  const olistPayload = {
    cliente: {
      nome: order.cliente.name,
      email: order.cliente.email,
      fone: order.cliente.phone,
    },
    itens: order.itens.map((item) => ({
      descricao: item.produto,
      quantidade: item.quantidade,
      valorUnitario: item.preco_unitario,
    })),
    valorTotal: order.total,
  };

  try {
    // --- 2. Autentica com o Olist ---
    // Se você já gerar e renovar o token em outro processo, pode simplesmente
    // usar OLIST_ACCESS_TOKEN direto. Caso contrário, troque client_id/secret
    // por um token aqui (fluxo OAuth2 client_credentials ou refresh_token,
    // conforme a documentação do Olist).
    const accessToken = process.env.OLIST_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({
        error: 'Token do Olist não configurado. Defina OLIST_ACCESS_TOKEN nas variáveis de ambiente.',
      });
    }

    // --- 3. Envia o pedido para o Olist ---
    const olistResponse = await fetch(process.env.OLIST_PEDIDO_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(olistPayload),
    });

    if (!olistResponse.ok) {
      const errorText = await olistResponse.text();
      console.error('Erro do Olist:', errorText);
      return res.status(502).json({ error: 'Falha ao registrar pedido no Olist' });
    }

    const olistData = await olistResponse.json();
    return res.status(200).json({ ok: true, olist: olistData });
  } catch (err) {
    console.error('Erro ao enviar pedido:', err);
    return res.status(500).json({ error: 'Erro interno ao processar o pedido' });
  }
}
