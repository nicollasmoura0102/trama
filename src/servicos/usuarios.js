// A senha nunca é guardada: salvamos só o "hash" (impressão digital) dela.

function paraHexadecimal(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function gerarSal() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return paraHexadecimal(bytes);
}

export async function gerarHash(senha, sal) {
  const texto = sal + senha;
  if (window.crypto && window.crypto.subtle) {
    const dados = new TextEncoder().encode(texto);
    const resumo = await crypto.subtle.digest("SHA-256", dados);
    return paraHexadecimal(new Uint8Array(resumo));
  }
  // Alternativa simples para páginas abertas sem HTTPS (onde crypto.subtle não existe)
  let numero = 5381;
  for (const letra of texto) {
    numero = ((numero << 5) + numero + letra.charCodeAt(0)) | 0;
  }
  return String(numero);
}

export function criarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
