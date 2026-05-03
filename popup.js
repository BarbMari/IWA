const toggleBtnRuler = document.getElementById("toggleBtnRuler");
const colorsDiv = document.getElementById("colors");

let active = false;
let currentColor = "rgba(255, 255, 153, 0.25)";

//colors
const colors = [
  "rgba(255, 255, 153, 0.25)", // Amarelo suave
  "rgba(173, 216, 230, 0.25)", // Azul claro
  "rgba(152, 251, 152, 0.25)", // Verde menta
  "rgba(255, 218, 185, 0.25)", // Pêssego
  "rgba(221, 160, 221, 0.25)"  // Lilás
];

colors.forEach(c => {
  const btn = document.createElement("button");
  btn.className = "color-btn";
  btn.style.backgroundColor = c;
  btn.addEventListener("click", () => {
    currentColor = c;
    chrome.storage.sync.set({ color: currentColor });
    if (active) {
      sendMessage("changeColor", currentColor);
    }
  });
  colorsDiv.appendChild(btn);
});

//botão de liga e desliga
toggleBtnRuler.addEventListener("click", async () => {
  active = !active;
  updateInterface();
  chrome.storage.sync.set({ active, color: currentColor });

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (active) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
    sendMessage("enable", currentColor);
  } else {
    sendMessage("disable", currentColor);
  }
});


function sendMessage(action, color) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action, color });
  });
}

function updateInterface() {
  if (active) {
    toggleBtnRuler.textContent = "Desativar Régua";
    toggleBtnRuler.classList.add("disable");
    colorsDiv.style.display = "flex";
  } else {
    toggleBtnRuler.textContent = "Ativar Régua";
    toggleBtnRuler.classList.remove("disable");
    colorsDiv.style.display = "none";
  }
}

chrome.storage.sync.get(["active", "color"], (data) => {
  if (data.color) currentColor = data.color;
  if (data.active) active = true;
  updateInterface();
});
