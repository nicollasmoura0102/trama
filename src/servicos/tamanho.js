import { ordemDosTamanhos } from "../dados/catalogo.js";

// Regra simples: o peso define o tamanho base e a altura ajusta para cima ou para baixo
export function sugerirTamanho(altura, peso, produto) {
  let indice = 0;
  if (peso >= 98) indice = 5;
  else if (peso >= 85) indice = 4;
  else if (peso >= 72) indice = 3;
  else if (peso >= 60) indice = 2;
  else if (peso >= 50) indice = 1;

  if (altura >= 185) indice += 1;
  if (altura <= 155) indice -= 1;
  indice = Math.max(0, Math.min(ordemDosTamanhos.length - 1, indice));

  // Entre os tamanhos que existem e não estão esgotados, escolhe o mais próximo
  const disponiveis = produto.tamanhos
    .filter((nome) => !produto.esgotados.includes(nome) && ordemDosTamanhos.includes(nome))
    .map((nome) => ({ nome, posicao: ordemDosTamanhos.indexOf(nome) }));
  if (disponiveis.length === 0) {
    return "";
  }
  disponiveis.sort((a, b) => Math.abs(a.posicao - indice) - Math.abs(b.posicao - indice) || a.posicao - b.posicao);
  return disponiveis[0].nome;
}
