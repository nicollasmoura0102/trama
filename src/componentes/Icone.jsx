// Ícones do site (todos decorativos: o texto de acessibilidade fica no botão ou link que os usa)
const desenhos = {
  inicio: (
  <>
    <path d="M3 10L12 3L21 10" />
    <path d="M5 9V21H19V9" />
    <path d="M9 21V14H15V21" />
  </>
),
  coracao: <path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z" />,
  busca: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M16 16l5 5" />
    </>
  ),
  usuario: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
  carrinho: (
    <>
      <path d="M3 4h2l2.5 11h10L20 8H6.5" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
    </>
  ),
  esquerda: <path d="M15 6l-6 6 6 6" />,
  direita: <path d="M9 6l6 6-6 6" />,
  baixo: <path d="M6 9l6 6 6-6" />,
  cima: <path d="M12 19V5M6 11l6-6 6 6" />,
  regua: (
    <>
      <path d="M3 17L17 3l4 4L7 21z" />
      <path d="M7 13l2 2M11 9l2 2M15 5l2 2" />
    </>
  ),
  sol: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  lua: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  olho: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  "olho-fechado": (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.2A11 11 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-2.4 3.1M6.2 6.2C3.5 8 2 12 2 12s3.5 6 10 6a10.8 10.8 0 0 0 4.1-.8" />
    </>
  ),
};

export default function Icone({ nome }) {
  return (
    <svg className="icone" viewBox="0 0 24 24" aria-hidden="true">
      {desenhos[nome]}
    </svg>
  );
}
