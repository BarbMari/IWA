(function() {
  let ruler = null;

  function createRuler(color) {
    const exists = document.getElementById("reading-ruler");
    if (exists) {
      exists.remove();
    }

    ruler = document.createElement("div");
    ruler.id = "reading-ruler";
    ruler.style.backgroundColor = color || "rgba(255, 255, 153, 0.25)";
    ruler.style.position = "fixed";
    ruler.style.left = "0";
    ruler.style.width = "100%";
    ruler.style.height = "40px";
    ruler.style.pointerEvents = "none";
    ruler.style.zIndex = "999999";
    ruler.style.transition = "top 0.05s ease, background-color 0.2s ease";
    document.body.appendChild(ruler);

    document.addEventListener("mousemove", moveRuler);
  }

  function moveRuler(e) {
    if (ruler) {
      ruler.style.top = `${e.clientY - 20}px`;
    }
  }

  function removeRuler() {
    const exists = document.getElementById("reading-ruler");
    if (exists) {
      exists.remove();
    }
    ruler = null;
    document.removeEventListener("mousemove", moveRuler);
  }

  function changeColor(color) {
    if (ruler) {
      ruler.style.backgroundColor = color;
    }
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "enable") {
      createRuler(msg.color);
    } else if (msg.action === "disable") {
      removeRuler();
    } else if (msg.action === "changeColor") {
      changeColor(msg.color);
    }
  });

  //pra ficar no estado salvo
  chrome.storage.sync.get(["active", "color"], (data) => {
    if (data.active) {
      createRuler(data.color);
    }
  });
})();

