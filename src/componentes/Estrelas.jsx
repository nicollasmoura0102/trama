// Mostra a nota com estrelas e um texto para leitores de tela
export default function Estrelas({ nota }) {
  const cheias = Math.round(nota);
  const texto = String(nota.toFixed ? nota.toFixed(1) : nota).replace(".", ",");

  return (
    <p className="estrelas">
      <span aria-hidden="true">{"★".repeat(cheias) + "☆".repeat(5 - cheias)}</span>
      <span className="visualmente-oculto">Nota {texto} de 5</span>
    </p>
  );
}
