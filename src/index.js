import { wrapWords, roundedRect, clearCanvas } from "./helpers";

const canvas = document.getElementById("myCanvas");

const context = canvas.getContext("2d", { alpha: false });

const capturedImg = document.querySelector("img"); // document.createElement("img");
const toggleInput = document.querySelector("input");
toggleInput.onchange = initializeCanvas;
const showBackground = document.getElementById("showBackground");
showBackground.onchange = initializeCanvas;

const colorInput = document.querySelector("input[type=color]");
colorInput.onchange = initializeCanvas;

/**
  
 * Output an image/thumb from the captured canvas,
 * basically just checking to make sure effects get applied the same
 */
function captureImage() {
  const hiddenImageCanvas = document.createElement("canvas", {
    alpha: false
  });
  hiddenImageCanvas.height = canvas.height;
  hiddenImageCanvas.width = canvas.width;
  const hiddenImageCtx = hiddenImageCanvas.getContext("2d");

  hiddenImageCtx.drawImage(canvas, 0, 0);
  hiddenImageCtx.font = "24px serif";
  hiddenImageCtx.fillStyle = "red";
  hiddenImageCtx.fillText("(Captured Image)", canvas.width, 100);
  hiddenImageCtx.fillStyle = "none";

  capturedImg.height = canvas.height;
  capturedImg.width = canvas.width;

  capturedImg.src = hiddenImageCtx.canvas.toDataURL("image/jpeg", 1);
}

function clearAllCanvas() {
  document.querySelectorAll("canvas").forEach(c => {
    console.log("clearing");
    clearCanvas(c.getContext("2d"));
  });
}

function resetShadow(ctx) {
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
}

let isOffscreenImageLoaded = false;
const offscreenImage = new Image();
offscreenImage.crossOrigin = "Anonymous";

async function initializeCanvas() {
  clearAllCanvas();

  if (!isOffscreenImageLoaded) {
    await new Promise(resolve => {
      offscreenImage.src =
        "https://uploads.codesandbox.io/uploads/user/6502eb54-fc86-4bda-965c-6e2a42c3926e/90DO-desktop-example.jpg"; // "./images/desktop-example.png";
      offscreenImage.addEventListener(
        "load",
        () => {
          isOffscreenImageLoaded = true;

          resolve();
        },
        { once: true }
      );
    });
  }

  // the "background"
  canvas.height = offscreenImage.height;
  canvas.width = offscreenImage.width;

  if (showBackground.checked) {
    context.drawImage(offscreenImage, 0, 0, canvas.width, canvas.width);
  }

  // the "recorder" window

  if (toggleInput.checked) {
    context.fillStyle = colorInput.value;

    // Apply shadow via
    context.shadowColor = "#ff6700";
    context.shadowOffsetX = 3;
    context.shadowOffsetY = 3;
    context.shadowBlur = 10;
    roundedRect(context, 0.1 * canvas.width, 0.1 * canvas.height, 380, 215, 10);
    context.fill();

    resetShadow(context);
    // the text overlay
    context.fillStyle = "#000";
    context.font = "26px Arial";
    wrapWords(context, "Using canvas shadowBlur, etc", 150, 150, 300, 40);
    // A second "recorder" to compare

    context.fillStyle = colorInput.value;
    context.filter = "drop-shadow(3px 3px 10px #ff6700)";

    roundedRect(context, 650, 200, 380, 215, 10);
    context.stroke();
    context.fill();

    // clear that filter
    context.filter = "none";

    // the text overlay
    context.fillStyle = "#000";
    context.font = "26px Arial";
    wrapWords(
      context,
      "Using drop-shadow filter (better in theory for performance) ",
      660,
      260,
      300,
      40
    );
  }

  captureImage();
}
initializeCanvas();
