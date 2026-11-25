import { useEffect, useState } from "react";
import Campo from "../Campo.jsx";
import Janela from "../Janela.jsx";
import { useAviso } from "../../contextos/AvisoContexto.jsx";
import { useLoja } from "../../contextos/LojaContexto.jsx";

// ---------- Usar minhas medidas ----------
export function JanelaMedidas({ aberta, aoFechar, aoSalvar }) {
  const { medidas, salvarMedidas } = useLoja();
  const [altura, setAltura] = useState(medidas ? String(medidas.altura) : "");
  const [peso, setPeso] = useState(medidas ? String(medidas.peso) : "");
  const [erros, setErros] = useState({});

  function validarNumero(valor, minimo, maximo, nome) {
    if (valor === "" || Number.isNaN(Number(valor))) return "Digite sua " + nome + ".";
    if (Number(valor) < minimo || Number(valor) > maximo) return "Digite um valor entre " + minimo + " e " + maximo + ".";
    return "";
  }

  function enviar(evento) {
    evento.preventDefault();
    const novos = { altura: validarNumero(altura, 120, 220, "altura"), peso: validarNumero(peso, 30, 200, "peso") };
    setErros(novos);
    if (novos.altura || novos.peso) {
      document.getElementById(novos.altura ? "altura" : "peso").focus();
      return;
    }
    if (salvarMedidas({ altura: Number(altura), peso: Number(peso) })) {
      aoSalvar({ altura: Number(altura), peso: Number(peso) });
    } else {
      setErros({ peso: "Não foi possível salvar as medidas neste navegador." });
    }
  }

  return (
    <Janela aberta={aberta} aoFechar={aoFechar} idDoTitulo="titulo-medidas">
      <form className="janela__corpo" onSubmit={enviar} noValidate>
        <h2 id="titulo-medidas">Usar minhas medidas</h2>
        <p>Informe sua altura e seu peso para sugerirmos o melhor tamanho. Elas ficam salvas neste navegador.</p>
        <Campo id="altura" rotulo="Altura (cm)" type="number" min="120" max="220" inputMode="numeric" placeholder="Ex.: 172" required value={altura} onChange={(e) => setAltura(e.target.value)} erro={erros.altura} />
        <Campo id="peso" rotulo="Peso (kg)" type="number" min="30" max="200" inputMode="numeric" placeholder="Ex.: 68" required value={peso} onChange={(e) => setPeso(e.target.value)} erro={erros.peso} />
        <div className="janela__acoes">
          <button className="botao botao--claro" type="button" onClick={aoFechar}>
            Cancelar
          </button>
          <button className="botao" type="submit">
            Ver tamanho
          </button>
        </div>
      </form>
    </Janela>
  );
}

// ---------- Escrever avaliação ----------
export function JanelaAvaliacao({ aberta, aoFechar, produto }) {
  const { usuario, adicionarAvaliacao } = useLoja();
  const anunciar = useAviso();
  const [autor, setAutor] = useState(usuario ? usuario.nome : "");
  const [nota, setNota] = useState(0);
  const [texto, setTexto] = useState("");
  const [erros, setErros] = useState({});
  const [status, setStatus] = useState("");

  function enviar(evento) {
    evento.preventDefault();
    const novos = {};
    if (autor.trim().length < 2) novos.autor = "Digite seu nome (pelo menos 2 letras).";
    if (nota === 0) novos.nota = "Escolha uma nota de 1 a 5.";
    if (texto.trim().length < 10) novos.texto = "Escreva pelo menos 10 caracteres.";
    setErros(novos);
    setStatus("");
    if (novos.autor || novos.nota || novos.texto) {
      document.getElementById(novos.autor ? "autor" : novos.nota ? "nota-1" : "comentario").focus();
      return;
    }
    if (adicionarAvaliacao(produto.id, { autor: autor.trim(), nota, texto: texto.trim() })) {
      anunciar("Avaliação publicada. Obrigado!");
      aoFechar();
    } else {
      setStatus("Não foi possível salvar a avaliação neste navegador.");
    }
  }

  return (
    <Janela aberta={aberta} aoFechar={aoFechar} idDoTitulo="titulo-avaliacao">
      <form className="janela__corpo" onSubmit={enviar} noValidate>
        <h2 id="titulo-avaliacao">Escrever avaliação</h2>
        <Campo id="autor" rotulo="Seu nome" type="text" minLength={2} autoComplete="given-name" required value={autor} onChange={(e) => setAutor(e.target.value)} erro={erros.autor} />

        <fieldset className="tamanhos" aria-describedby="erro-nota">
          <legend className="tamanhos__legenda">Sua nota</legend>
          <div className={"tamanhos__lista" + (erros.nota ? " tamanhos__lista--erro" : "")}>
            {[1, 2, 3, 4, 5].map((valor) => (
              <div className="tamanho" key={valor}>
                <input className="tamanho__entrada" id={"nota-" + valor} type="radio" name="nota" value={valor} checked={nota === valor} onChange={() => setNota(valor)} aria-label={valor + (valor === 1 ? " estrela" : " estrelas")} />
                <span className="tamanho__rotulo">{valor} ★</span>
              </div>
            ))}
          </div>
          <p className="campo__mensagem" id="erro-nota" hidden={!erros.nota}>
            {erros.nota}
          </p>
        </fieldset>

        <Campo id="comentario" rotulo="Comentário" area rows="4" minLength={10} required value={texto} onChange={(e) => setTexto(e.target.value)} erro={erros.texto} />
        <p className="formulario__status formulario__status--erro" role="status">
          {status}
        </p>
        <div className="janela__acoes">
          <button className="botao botao--claro" type="button" onClick={aoFechar}>
            Cancelar
          </button>
          <button className="botao" type="submit">
            Publicar
          </button>
        </div>
      </form>
    </Janela>
  );
}

// ---------- Provador virtual (a IA ainda é só interface) ----------
export function JanelaProvador({ aberta, aoFechar }) {
  const [arquivo, setArquivo] = useState(null);
  const [previa, setPrevia] = useState("");
  const [status, setStatus] = useState({ texto: "", tipo: "" });

  // Cria o endereço temporário da foto e libera da memória quando não precisar mais
  useEffect(() => {
    if (!arquivo) return undefined;
    const endereco = URL.createObjectURL(arquivo);
    setPrevia(endereco);
    return () => URL.revokeObjectURL(endereco);
  }, [arquivo]);

  function escolherFoto(evento) {
    const escolhido = evento.target.files[0];
    setArquivo(null);
    setPrevia("");
    if (!escolhido) {
      setStatus({ texto: "", tipo: "" });
    } else if (!escolhido.type.startsWith("image/")) {
      setStatus({ texto: "Escolha um arquivo de imagem (JPG, PNG ou WebP).", tipo: "erro" });
    } else if (escolhido.size > 5 * 1024 * 1024) {
      setStatus({ texto: "A foto precisa ter no máximo 5 MB.", tipo: "erro" });
    } else {
      setArquivo(escolhido);
      setStatus({ texto: "Foto pronta. A prévia fica só no seu navegador.", tipo: "sucesso" });
    }
  }

  return (
    <Janela aberta={aberta} aoFechar={aoFechar} idDoTitulo="titulo-provador">
      <div className="janela__corpo">
        <h2 id="titulo-provador">Provador virtual</h2>
        <p>Envie uma foto sua de corpo inteiro. Em breve, a IA vai vestir a peça para você.</p>
        <div className="campo">
          <label className="campo__rotulo" htmlFor="foto-provador">
            Sua foto
          </label>
          <input className="campo__entrada" id="foto-provador" type="file" accept="image/*" onChange={escolherFoto} />
        </div>
        <div className="provador__previa">
          {previa ? <img className="provador__imagem" src={previa} alt="Prévia da foto enviada" /> : <p>Nenhuma foto selecionada.</p>}
        </div>
        <p className={"formulario__status" + (status.tipo ? " formulario__status--" + status.tipo : "")} role="status">
          {status.texto}
        </p>
        <div className="janela__acoes">
          <button className="botao botao--claro" type="button" onClick={aoFechar}>
            Fechar
          </button>
          <button className="botao" type="button" disabled={!arquivo} onClick={() => setStatus({ texto: "Em breve: a IA vai vestir a peça na sua foto. Nada foi enviado a nenhum servidor.", tipo: "" })}>
            Provar peça
          </button>
        </div>
      </div>
    </Janela>
  );
}
