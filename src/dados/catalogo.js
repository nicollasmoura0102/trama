// Catálogo de produtos da loja (dados fixos, como viriam de um servidor).
// Tudo que o USUÁRIO cria (conta, sacola, favoritos, pedidos, avaliações) vai para o LocalStorage.

// Cria a quantidade de avaliações por nota (1 a 5) que resulta numa média próxima da nota alvo
function criarDistribuicao(total, notaAlvo) {
  let baixo = -3;
  let alto = 6;
  let contagens = [];
  for (let passo = 0; passo < 40; passo++) {
    const inclinacao = (baixo + alto) / 2;
    const pesos = [1, 2, 3, 4, 5].map((nota) => Math.exp(inclinacao * nota));
    const soma = pesos.reduce((acumulado, peso) => acumulado + peso, 0);
    const media = pesos.reduce((acumulado, peso, indice) => acumulado + peso * (indice + 1), 0) / soma;
    if (media < notaAlvo) {
      baixo = inclinacao;
    } else {
      alto = inclinacao;
    }
    contagens = pesos.map((peso) => (peso / soma) * total);
  }
  const inteiros = contagens.map(Math.round);
  inteiros[4] += total - inteiros.reduce((acumulado, valor) => acumulado + valor, 0);
  return { 1: inteiros[0], 2: inteiros[1], 3: inteiros[2], 4: inteiros[3], 5: inteiros[4] };
}

const pasta = "/img/produtos/";

const lista = [
  {
    id: 1, nome: "Camiseta Oversized", categoria: "Camisetas", publicos: ["feminino", "masculino"], tamanhos: ["PP", "P", "M", "G", "GG", "XG"],
    esgotados: ["XG"], cores: ["Preto", "Verde", "Lima", "Azul"], preco: 79.9, nota: 4.8, total: 126, lancamento: "2026-10-05", emoji: "👕",
    descricao: "Algodão 100%, modelagem ampla e caimento solto.",
    fotos: [
      { arquivo: pasta + "camiseta-preta.svg", alt: "Camiseta oversized preta" },
      { arquivo: pasta + "camiseta-verde-oliva.svg", alt: "Camiseta oversized verde-oliva" },
      { arquivo: pasta + "camiseta-lima.svg", alt: "Camiseta oversized lima" },
      { arquivo: pasta + "camiseta-azul.svg", alt: "Camiseta oversized azul" },
    ],
    comentarios: [
      { id: "c1", autor: "Mariana S.", data: "12/10/2026", nota: 5, texto: "Tecido grosso e macio. O caimento oversized ficou perfeito, recomendo pedir o tamanho de sempre.", uteis: 12 },
      { id: "c2", autor: "Lucas P.", data: "08/10/2026", nota: 4, texto: "Muito boa pelo preço. Só achei a manga um pouco longa, mas combina com a proposta da peça.", uteis: 5 },
      { id: "c3", autor: "Ana Clara R.", data: "02/10/2026", nota: 5, texto: "Chegou antes do prazo e a cor é igual à da foto. Já pedi mais uma em outra cor.", uteis: 9 },
    ],
  },
  { id: 2, nome: "Camiseta Básica Branca", categoria: "Camisetas", publicos: ["feminino", "masculino"], tamanhos: ["P", "M", "G", "GG"], cores: ["Branco"], preco: 59.9, nota: 4.5, total: 210, lancamento: "2026-08-20", emoji: "👕", descricao: "Básica de algodão penteado, combina com tudo." },
  { id: 3, nome: "Camiseta Estampada", categoria: "Camisetas", publicos: ["feminino"], tamanhos: ["M", "G"], cores: ["Lima", "Preto"], preco: 89.9, nota: 4.3, total: 44, lancamento: "2026-10-12", emoji: "👚", descricao: "Estampa exclusiva da coleção de primavera." },
  { id: 4, nome: "Calça Cargo", categoria: "Calças", publicos: ["masculino"], tamanhos: ["P", "M", "G", "GG"], cores: ["Verde", "Preto"], preco: 189.9, nota: 4.6, total: 84, lancamento: "2026-09-18", emoji: "👖", descricao: "Bolsos laterais e tecido resistente.", fotos: [{ arquivo: pasta + "calca-cargo.svg", alt: "Calça cargo verde-oliva" }] },
  { id: 5, nome: "Calça Jeans Reta", categoria: "Calças", publicos: ["feminino", "masculino"], tamanhos: ["P", "M", "G", "GG"], cores: ["Azul"], preco: 219.9, nota: 4.7, total: 97, lancamento: "2026-07-30", emoji: "👖", descricao: "Jeans com elastano e corte reto." },
  { id: 6, nome: "Vestido Midi", categoria: "Vestidos", publicos: ["feminino"], tamanhos: ["P", "M", "G"], cores: ["Roxo"], preco: 229.9, nota: 4.9, total: 57, lancamento: "2026-10-10", emoji: "👗", descricao: "Leve, com cintura marcada.", fotos: [{ arquivo: pasta + "vestido-midi.svg", alt: "Vestido midi lilás" }] },
  { id: 7, nome: "Vestido Curto Floral", categoria: "Vestidos", publicos: ["infantil"], tamanhos: ["PP", "P", "M"], cores: ["Vermelho", "Branco"], preco: 179.9, nota: 4.2, total: 31, lancamento: "2026-09-02", emoji: "👗", descricao: "Estampa floral e tecido fluido." },
  { id: 8, nome: "Jaqueta Jeans", categoria: "Jaquetas", publicos: ["masculino"], tamanhos: ["M", "G", "GG"], cores: ["Azul"], preco: 259.9, nota: 4.7, total: 203, lancamento: "2026-06-15", emoji: "🧥", descricao: "Clássica, com botões e bolsos frontais.", fotos: [{ arquivo: pasta + "jaqueta-jeans.svg", alt: "Jaqueta jeans azul" }] },
  { id: 9, nome: "Jaqueta Corta-Vento", categoria: "Jaquetas", publicos: ["infantil"], tamanhos: ["P", "M", "G"], cores: ["Preto", "Lima"], preco: 199.9, nota: 4.4, total: 58, lancamento: "2026-10-01", emoji: "🧥", descricao: "Leve e resistente à chuva fraca." },
  { id: 10, nome: "Boné Aba Curva", categoria: "Acessórios", publicos: ["infantil"], tamanhos: ["Único"], cores: ["Vermelho", "Preto"], preco: 69.9, nota: 4.5, total: 39, lancamento: "2026-08-05", emoji: "🧢", descricao: "Ajuste traseiro e aba curva.", fotos: [{ arquivo: pasta + "bone.svg", alt: "Boné aba curva coral" }] },
  { id: 11, nome: "Mochila Urbana", categoria: "Acessórios", publicos: ["infantil"], tamanhos: ["Único"], cores: ["Preto"], preco: 159.9, nota: 4.6, total: 72, lancamento: "2026-09-25", emoji: "🎒", descricao: "Cabe notebook de 15 polegadas." },
  { id: 12, nome: "Cinto de Couro", categoria: "Acessórios", publicos: ["masculino"], tamanhos: ["P", "M", "G"], cores: ["Preto"], preco: 99.9, nota: 3.8, total: 18, lancamento: "2026-05-10", emoji: "👔", descricao: "Couro legítimo com fivela metálica." },
].map((produto) => ({ ...produto, publicos: produto.publicos ?? [], esgotados: produto.esgotados ?? [], fotos: produto.fotos ?? [], comentarios: produto.comentarios ?? [], distribuicao: criarDistribuicao(produto.total, produto.nota) }));

export const catalogo = lista;
export const categorias = ["Camisetas", "Calças", "Vestidos", "Jaquetas", "Acessórios"];
export const ordemDosTamanhos = ["PP", "P", "M", "G", "GG", "XG"];

export function buscarProduto(id) {
  return catalogo.find((produto) => produto.id === Number(id)) ?? null;
}

// Soma as avaliações do catálogo com as escritas pelo usuário (guardadas no LocalStorage)
export function resumirAvaliacoes(produto, avaliacoesDoUsuario = []) {
  const distribuicao = { ...produto.distribuicao };
  avaliacoesDoUsuario.forEach((avaliacao) => {
    distribuicao[avaliacao.nota] += 1;
  });
  let total = 0;
  let soma = 0;
  for (let nota = 1; nota <= 5; nota++) {
    total += distribuicao[nota];
    soma += distribuicao[nota] * nota;
  }
  return { distribuicao, total, media: total === 0 ? 0 : soma / total };
}

export function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatarNota(nota) {
  return nota.toFixed(1).replace(".", ",");
}
