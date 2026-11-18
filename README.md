# Trama

Loja online de roupas. Trabalho da disciplina DIU 2026/2.

## Telas

| Tela | Arquivo | Status |
|------|---------|--------|
| Login | `login.html` | Pronta (validação, carregando, sucesso e erro) |
| Home | `index.html` | Pronta (banner, busca, filtros, favoritos) |
| Página de produto | `produto.html` | Pronta (galeria, tamanho, sacola, frete e avaliações) |
| Busca e filtros | `busca.html` | Pronta (filtros, ordenação, chips e favoritos) |

Para testar o login, use qualquer e-mail válido com a senha `trama1234`.

## Estrutura

```
css/   base.css (variáveis e tipografia) · layout.css (grids) · components.css (componentes)
js/    login.js · loja.js · produto.js · busca.js
img/   logotipo, ícone e ilustrações dos produtos
```

## Roadmap

Evoluções planejadas para o sistema. O status mostra o que já existe como protótipo no código.

| # | Evolução | Status |
|---|----------|--------|
| 1 | Busca inteligente com IA e pesquisa por foto | Planejado (hoje há busca simples por nome na Home) |
| 2 | Filtros mais claros e organizados | Protótipo funcionando em `busca.html` (categoria, tamanho, cor, preço e avaliação, com chips removíveis e ordenação) |
| 3 | Recomendação inteligente de tamanho com base nas medidas cadastradas | Protótipo (regra simples por altura e peso; as medidas ficam salvas no navegador) |
| 4 | Provador virtual com IA | Protótipo de interface (envio de foto e prévia; a IA ainda não existe) |
| 5 | Visualização 3D/360° dos produtos | Protótipo de interface (giro simulado; falta gerar as imagens 360°) |
| 6 | Página de perfil melhorada | Planejado |
| 7 | Maior consistência visual entre loja, carrinho e checkout | Planejado (a sacola já é salva no navegador, mas falta a tela de carrinho) |
| 8 | Experiência customizada | Planejado |
| 9 | Avaliações dos produtos | Protótipo funcionando (resumo por nota, lista, "útil", denúncia e nova avaliação) |

### Próximos passos (sprint do Checkpoint 3)

- Criar a tela de sacola/carrinho e ligar com o contador do cabeçalho.
- Fazer a página de produto funcionar para todos os itens da Home, e não só para a camiseta.
- Unificar o catálogo: Home, busca e produto ainda usam listas de produtos separadas.
- Ligar cada produto da busca à sua própria página (hoje todos abrem `produto.html`).
- Adicionar contagem de resultados em cada opção de filtro.
- Trocar os emojis e ilustrações por fotos reais dos produtos.
