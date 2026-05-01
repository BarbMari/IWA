const toggleBtn = document.getElementById("toggleBtn");
const coresDiv = document.getElementById("cores");

let ativo = false;
let corAtual = "rgba(255, 255, 153, 0.25)";

//cores
const cores = [
  "rgba(255, 255, 153, 0.25)", // Amarelo suave
  "rgba(173, 216, 230, 0.25)", // Azul claro
  "rgba(152, 251, 152, 0.25)", // Verde menta
  "rgba(255, 218, 185, 0.25)", // Pêssego
  "rgba(221, 160, 221, 0.25)"  // Lilás
];

cores.forEach(c => {
  const btn = document.createElement("button");
  btn.className = "cor-btn";
  btn.style.backgroundColor = c;
  btn.addEventListener("click", () => {
    corAtual = c;
    chrome.storage.sync.set({ cor: corAtual });
    if (ativo) {
      enviarMensagem("mudarCor", corAtual);
    }
  });
  coresDiv.appendChild(btn);
});

//botão de liga e desliga
toggleBtn.addEventListener("click", async () => {
  ativo = !ativo;
  atualizarInterface();
  chrome.storage.sync.set({ ativo, cor: corAtual });

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (ativo) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
    enviarMensagem("ativar", corAtual);
  } else {
    enviarMensagem("desativar", corAtual);
  }
});


function enviarMensagem(acao, cor) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { acao, cor });
  });
}

function atualizarInterface() {
  if (ativo) {
    toggleBtn.textContent = "Desativar Régua";
    toggleBtn.classList.add("desativar");
    coresDiv.style.display = "flex";
  } else {
    toggleBtn.textContent = "Ativar Régua";
    toggleBtn.classList.remove("desativar");
    coresDiv.style.display = "none";
  }
}

chrome.storage.sync.get(["ativo", "cor"], (data) => {
  if (data.cor) corAtual = data.cor;
  if (data.ativo) ativo = true;
  atualizarInterface();
});
