const CATALOGOS = {
  preto: {
    nome: "Preto",
    faixas: [
      { minimo: 30000, chave: "faixa30", nome: "30 MILHEIROS" },
      { minimo: 10000, chave: "faixa10", nome: "10 MILHEIROS" },
      { minimo: 1, chave: "faixa1", nome: "1 MILHEIRO" }
    ],
    precos: {
      "12X18": { faixa1: 35, faixa10: 33, faixa30: 31 },
      "13X25": { faixa1: 45, faixa10: 42, faixa30: 39 },
      "15X20": { faixa1: 45, faixa10: 42, faixa30: 39 },
      "15X25": { faixa1: 57, faixa10: 54, faixa30: 51 },
      "19X25": { faixa1: 64, faixa10: 61, faixa30: 59 },
      "20X30": { faixa1: 79, faixa10: 76, faixa30: 73 },
      "25X30": { faixa1: 97, faixa10: 91, faixa30: 88 },
      "25X35": { faixa1: 117, faixa10: 110, faixa30: 106 },
      "26X36": { faixa1: 120, faixa10: 118, faixa30: 114 },
      "30X40": { faixa1: 156, faixa10: 148, faixa30: 142 },
      "32X40": { faixa1: 169, faixa10: 159, faixa30: 155 },
      "40X50": { faixa1: 257, faixa10: 250, faixa30: 243 },
      "40X60": { faixa1: 307, faixa10: 298, faixa30: 290 },
      "50X60": { faixa1: 384, faixa10: 373, faixa30: 362 },
      "60X50": { faixa1: 378, faixa10: 367, faixa30: 356 },
      "50X70": { faixa1: 448, faixa10: 428, faixa30: 415 },
      "80X60": { faixa1: 602, faixa10: 585, faixa30: 568 }
    }
  },

  branco: {
    nome: "Branco",
    faixas: [
      { minimo: 20000, chave: "faixa20", nome: "20 MILHEIROS" },
      { minimo: 5000, chave: "faixa5", nome: "5 MILHEIROS" },
      { minimo: 1, chave: "faixa1", nome: "1 MILHEIRO" }
    ],
    precos: {
      "19X25": { faixa1: 124, faixa5: 112, faixa20: 107 },
      "20X30": { faixa1: 153, faixa5: 140, faixa20: 133 },
      "26X36": { faixa1: 234, faixa5: 214, faixa20: 204 },
      "32X40": { faixa1: 304, faixa5: 289, faixa20: 276 },
      "40X50": { faixa1: 469, faixa5: 447, faixa20: 426 }
    }
  },

  colorido: {
    nome: "Colorido",
    faixas: [
      { minimo: 20000, chave: "faixa20", nome: "20 MILHEIROS" },
      { minimo: 5000, chave: "faixa5", nome: "5 MILHEIROS" },
      { minimo: 1, chave: "faixa1", nome: "1 MILHEIRO" }
    ],
    precos: {
      "12X18": { faixa1: 62, faixa5: 59, faixa20: 55 },
      "15X20": { faixa1: 84, faixa5: 79, faixa20: 74 },
      "19X25": { faixa1: 128, faixa5: 121, faixa20: 113 },
      "20X30": { faixa1: 159, faixa5: 151, faixa20: 141 },
      "26X36": { faixa1: 235, faixa5: 223, faixa20: 213 },
      "32X40": { faixa1: 318, faixa5: 301, faixa20: 288 },
      "40X50": { faixa1: 489, faixa5: 467, faixa20: 444 }
    }
  }
};

// Cria a tabela promocional automaticamente usando a última coluna
function criarCatalogoPromocao() {
  const catalogoPromocao = {
    nome: "Promoção",
    promocao: true,
    faixas: [
      {
        minimo: 1,
        chave: "faixaPromocao",
        nome: "PROMOÇÃO — PREÇO DE 30/20 MILHEIROS"
      }
    ],
    precos: {}
  };

  ["preto", "branco", "colorido"].forEach((cor) => {
    const catalogo = CATALOGOS[cor];

    const ultimaFaixa = catalogo.faixas.reduce(
      (maiorFaixa, faixaAtual) =>
        faixaAtual.minimo > maiorFaixa.minimo
          ? faixaAtual
          : maiorFaixa
    );

    Object.entries(catalogo.precos).forEach(([tamanho, precos]) => {
      const chaveProduto = cor + "|" + tamanho;

      catalogoPromocao.precos[chaveProduto] = {
        faixaPromocao: precos[ultimaFaixa.chave],
        rotulo: catalogo.nome + " — " + tamanho
      };
    });
  });

  return catalogoPromocao;
}

CATALOGOS.promocao = criarCatalogoPromocao();

const linhasCotacao = document.getElementById("linhasCotacao");
const modeloLinha = document.getElementById("modeloLinha");
const volumeTotalEl = document.getElementById("volumeTotal");
const faixaAplicadaEl = document.getElementById("faixaAplicada");
const valorTotalEl = document.getElementById("valorTotal");
const mensagemEl = document.getElementById("mensagem");
const comNotaFiscalEl = document.getElementById("comNotaFiscal");
const avisoNotaFiscalEl = document.getElementById("avisoNotaFiscal");

const ACRESCIMO_NOTA_FISCAL = 0.08;

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

const numero = new Intl.NumberFormat("pt-BR");

function criarSeletorCor() {
  const seletorExistente = document.getElementById("corEnvelope");

  if (seletorExistente) {
    return seletorExistente;
  }

  const campo = document.createElement("div");
  campo.className = "campo-cor-envelope";
  campo.style.marginBottom = "1rem";

  const label = document.createElement("label");
  label.htmlFor = "corEnvelope";
  label.textContent = "Cor do envelope ou condição";
  label.style.display = "block";
  label.style.marginBottom = "0.4rem";
  label.style.fontWeight = "700";

  const select = document.createElement("select");
  select.id = "corEnvelope";
  select.required = true;
  select.setAttribute(
    "aria-label",
    "Cor do envelope ou condição"
  );

  select.style.width = "100%";
  select.style.maxWidth = "320px";
  select.style.padding = "0.7rem";
  select.style.border = "1px solid #c8c8c8";
  select.style.borderRadius = "6px";
  select.style.backgroundColor = "#ffffff";

  [
    { valor: "", texto: "Selecione a cor ou condição" },
    { valor: "preto", texto: "Preto" },
    { valor: "branco", texto: "Branco" },
    { valor: "colorido", texto: "Colorido" },
    { valor: "promocao", texto: "Promoção" }
  ].forEach((item) => {
    const option = document.createElement("option");
    option.value = item.valor;
    option.textContent = item.texto;
    select.appendChild(option);
  });

  campo.appendChild(label);
  campo.appendChild(select);

  const tabela = linhasCotacao.closest("table");
  const referencia = tabela || linhasCotacao;

  referencia.parentNode.insertBefore(campo, referencia);

  return select;
}

const corEnvelopeEl = criarSeletorCor();

function obterCatalogoSelecionado() {
  return CATALOGOS[corEnvelopeEl.value] || null;
}

function obterFaixa(volumeTotal, catalogo) {
  if (!catalogo || volumeTotal <= 0) {
    return {
      chave: null,
      nome: "—"
    };
  }

  return (
    catalogo.faixas.find(
      (faixa) => volumeTotal >= faixa.minimo
    ) || {
      chave: null,
      nome: "—"
    }
  );
}

function criarOpcoes(select) {
  const valorAtual = select.value;
  const catalogo = obterCatalogoSelecionado();

  select.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = catalogo
    ? "Selecione"
    : "Selecione a cor primeiro";

  select.appendChild(placeholder);

  if (!catalogo) {
    select.disabled = true;
    return;
  }

  Object.keys(catalogo.precos).forEach((tamanho) => {
    const option = document.createElement("option");

    option.value = tamanho;
    option.textContent =
      catalogo.precos[tamanho].rotulo || tamanho;

    select.appendChild(option);
  });

  select.disabled = false;

  select.value = catalogo.precos[valorAtual]
    ? valorAtual
    : "";
}

function atualizarTamanhosPorCor() {
  linhasCotacao
    .querySelectorAll(".tamanho")
    .forEach((select) => criarOpcoes(select));

  mensagemEl.textContent = "";
  calcular();
}

function adicionarLinha(quantidade = "", tamanho = "") {
  const fragmento = modeloLinha.content.cloneNode(true);
  const linha = fragmento.querySelector("tr");
  const inputQuantidade =
    linha.querySelector(".quantidade");
  const selectTamanho =
    linha.querySelector(".tamanho");

  criarOpcoes(selectTamanho);

  inputQuantidade.value = quantidade;
  selectTamanho.value = tamanho;

  inputQuantidade.addEventListener("input", calcular);
  selectTamanho.addEventListener("change", calcular);

  linha
    .querySelector(".remover")
    .addEventListener("click", () => {
      linha.remove();

      if (!linhasCotacao.children.length) {
        adicionarLinha();
      }

      calcular();
    });

  linhasCotacao.appendChild(fragmento);
  calcular();
}

function coletarItens() {
  return [
    ...linhasCotacao.querySelectorAll("tr")
  ].map((linha) => ({
    linha,
    quantidade:
      Number(
        linha.querySelector(".quantidade").value
      ) || 0,
    tamanho:
      linha.querySelector(".tamanho").value
  }));
}

function calcular() {
  const itens = coletarItens();
  const catalogo = obterCatalogoSelecionado();

  const fatorNotaFiscal = comNotaFiscalEl.checked
    ? 1 + ACRESCIMO_NOTA_FISCAL
    : 1;

  const volumeTotal = itens.reduce(
    (soma, item) => soma + item.quantidade,
    0
  );

  const faixa = obterFaixa(volumeTotal, catalogo);

  let total = 0;

  itens.forEach((item) => {
    let precoMilheiro = 0;
    let subtotal = 0;

    const precosDoTamanho =
      catalogo &&
      catalogo.precos[item.tamanho];

    if (precosDoTamanho && faixa.chave) {
      precoMilheiro =
        precosDoTamanho[faixa.chave] *
        fatorNotaFiscal;

      subtotal =
        (item.quantidade / 1000) *
        precoMilheiro;

      total += subtotal;
    }

    item.linha.querySelector(
      ".preco-milheiro"
    ).textContent = moeda.format(precoMilheiro);

    item.linha.querySelector(
      ".subtotal"
    ).textContent = moeda.format(subtotal);
  });

  volumeTotalEl.textContent =
    numero.format(volumeTotal) + " unidades";

  faixaAplicadaEl.textContent = faixa.nome;
  valorTotalEl.textContent = moeda.format(total);

  avisoNotaFiscalEl.hidden =
    !comNotaFiscalEl.checked;

  mensagemEl.textContent = "";

  return {
    itens,
    volumeTotal,
    faixa,
    total,
    cor: corEnvelopeEl.value,
    catalogo,
    comNotaFiscal: comNotaFiscalEl.checked,
    fatorNotaFiscal
  };
}

function montarTextoWhatsapp() {
  const resultado = calcular();

  if (!resultado.catalogo) {
    mensagemEl.textContent =
      "Selecione a cor dos envelopes.";
    return null;
  }

  const itensValidos = resultado.itens.filter(
    (item) =>
      item.quantidade > 0 &&
      item.tamanho
  );

  if (!itensValidos.length) {
    mensagemEl.textContent =
      "Preencha ao menos um item.";
    return null;
  }

  const linhas = [
    "*COTAÇÃO – SEU PACOTIN*",
    "",
    resultado.catalogo.promocao
      ? "Condição: *PROMOÇÃO*"
      : "Cor: *" +
        resultado.catalogo.nome +
        "*",
    "Faixa aplicada: *" +
      resultado.faixa.nome +
      "*",
    resultado.comNotaFiscal
      ? "Valores com Nota Fiscal (+8%)"
      : "",
    ""
  ].filter(
    (linha, indice, array) =>
      !(
        linha === "" &&
        indice > 0 &&
        array[indice - 1] === ""
      )
  );

  itensValidos.forEach((item) => {
    const dadosProduto =
      resultado.catalogo.precos[item.tamanho];

    const descricaoProduto =
      dadosProduto.rotulo || item.tamanho;

    const precoMilheiro =
      dadosProduto[resultado.faixa.chave] *
      resultado.fatorNotaFiscal;

    const subtotal =
      (item.quantidade / 1000) *
      precoMilheiro;

    linhas.push(
      "• " +
        numero.format(item.quantidade) +
        " un – " +
        descricaoProduto
    );

    linhas.push(
      moeda.format(precoMilheiro) +
        " cada milheiro"
    );

    linhas.push(
      "Subtotal: *" +
        moeda.format(subtotal) +
        "*"
    );

    linhas.push("");
  });

  linhas.push("──────────────");

  linhas.push(
    "*TOTAL: " +
      moeda.format(resultado.total) +
      "*"
  );

  linhas.push("");
  linhas.push("Seu Pacotin Embalagens");

  return linhas.join("\n");
}

async function copiarWhatsapp() {
  const texto = montarTextoWhatsapp();

  if (!texto) {
    return;
  }

  try {
    await navigator.clipboard.writeText(texto);

    mensagemEl.textContent =
      "Cotação copiada. Agora cole no WhatsApp.";
  } catch {
    const area =
      document.createElement("textarea");

    area.value = texto;

    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();

    mensagemEl.textContent =
      "Cotação copiada. Agora cole no WhatsApp.";
  }
}

function novaCotacao() {
  corEnvelopeEl.value = "";
  linhasCotacao.innerHTML = "";

  adicionarLinha();
  adicionarLinha();
  adicionarLinha();

  mensagemEl.textContent =
    "Nova cotação iniciada. Selecione a cor ou a opção Promoção.";
}

document
  .getElementById("adicionarLinha")
  .addEventListener(
    "click",
    () => adicionarLinha()
  );

document
  .getElementById("copiarWhatsapp")
  .addEventListener(
    "click",
    copiarWhatsapp
  );

document
  .getElementById("novaCotacao")
  .addEventListener(
    "click",
    novaCotacao
  );

comNotaFiscalEl.addEventListener(
  "change",
  calcular
);

corEnvelopeEl.addEventListener(
  "change",
  atualizarTamanhosPorCor
);

adicionarLinha();
adicionarLinha();
adicionarLinha();

// Instalação como aplicativo (PWA)
let eventoInstalacao = null;
const instalacaoAppEl = document.getElementById("instalacaoApp");
const instalarAppEl = document.getElementById("instalarApp");
const statusConexaoEl = document.getElementById("statusConexao");

window.addEventListener("beforeinstallprompt", (evento) => {
  evento.preventDefault();
  eventoInstalacao = evento;
  instalacaoAppEl.hidden = false;
});

instalarAppEl.addEventListener("click", async () => {
  if (!eventoInstalacao) return;
  eventoInstalacao.prompt();
  await eventoInstalacao.userChoice;
  eventoInstalacao = null;
  instalacaoAppEl.hidden = true;
});

window.addEventListener("appinstalled", () => {
  instalacaoAppEl.hidden = true;
  mensagemEl.textContent = "Aplicativo instalado com sucesso.";
});

function atualizarStatusConexao() {
  statusConexaoEl.textContent = navigator.onLine
    ? "Online - dados atualizados"
    : "Offline - calculadora disponível";
}

window.addEventListener("online", atualizarStatusConexao);
window.addEventListener("offline", atualizarStatusConexao);
atualizarStatusConexao();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {
      statusConexaoEl.textContent = "Calculadora disponível";
    });
  });
}
