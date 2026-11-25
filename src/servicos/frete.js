// Simulação de frete pelo primeiro número do CEP (não há servidor de entregas)

export const FRETE_GRATIS_A_PARTIR_DE = 199;

const faixas = [
  { de: 0, ate: 3, valor: 19.9, prazo: "3 a 6 dias úteis" },
  { de: 4, ate: 5, valor: 29.9, prazo: "5 a 9 dias úteis" },
  { de: 6, ate: 7, valor: 34.9, prazo: "6 a 10 dias úteis" },
  { de: 8, ate: 9, valor: 14.9, prazo: "2 a 5 dias úteis" },
];

export function formatarCep(texto) {
  const digitos = texto.replace(/\D/g, "").slice(0, 8);
  return digitos.length > 5 ? digitos.slice(0, 5) + "-" + digitos.slice(5) : digitos;
}

export function validarCep(texto) {
  const digitos = texto.replace(/\D/g, "");
  if (digitos.length === 0) return "Digite seu CEP.";
  if (digitos.length !== 8) return "O CEP precisa ter 8 números.";
  return "";
}

export function calcularFrete(cep, subtotal) {
  const primeiro = Number(cep.replace(/\D/g, "")[0]);
  const faixa = faixas.find((item) => primeiro >= item.de && primeiro <= item.ate);
  const gratis = subtotal >= FRETE_GRATIS_A_PARTIR_DE;
  return { valor: gratis ? 0 : faixa.valor, prazo: faixa.prazo, gratis };
}
