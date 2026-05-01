(function() {
  let regua = null;

  function criarRegua(cor) {
    const existente = document.getElementById("regua-leitura");
    if (existente) {
      existente.remove();
    }

    regua = document.createElement("div");
    regua.id = "regua-leitura";
    regua.style.backgroundColor = cor || "rgba(255, 255, 153, 0.25)";
    regua.style.position = "fixed";
    regua.style.left = "0";
    regua.style.width = "100%";
    regua.style.height = "40px";
    regua.style.pointerEvents = "none";
    regua.style.zIndex = "999999";
    regua.style.transition = "top 0.05s ease, background-color 0.2s ease";
    document.body.appendChild(regua);

    document.addEventListener("mousemove", moverRegua);
  }

  function moverRegua(e) {
    if (regua) {
      regua.style.top = `${e.clientY - 20}px`;
    }
  }

  function removerRegua() {
    const existente = document.getElementById("regua-leitura");
    if (existente) {
      existente.remove();
    }
    regua = null;
    document.removeEventListener("mousemove", moverRegua);
  }

  function mudarCor(cor) {
    if (regua) {
      regua.style.backgroundColor = cor;
    }
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.acao === "ativar") {
      criarRegua(msg.cor);
    } else if (msg.acao === "desativar") {
      removerRegua();
    } else if (msg.acao === "mudarCor") {
      mudarCor(msg.cor);
    }
  });

  //pra ficar no estado salvo
  chrome.storage.sync.get(["ativo", "cor"], (data) => {
    if (data.ativo) {
      criarRegua(data.cor);
    }
  });
})();

