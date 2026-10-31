(() => {
  "use strict";
  const block = document.getElementById("questionBlock");
  const volume = document.getElementById("volume");
  const volumeValue = document.getElementById("volumeValue");
  const audioError = document.getElementById("audioError");

  // 音量は起動ごとに30%へ戻す。設定値は保存しない。
  volume.value = "30";
  const soundPath = "./coin-pickup-3.mp3";
  let animationTimer = null;

  function updateVolumeLabel() {
    volumeValue.value = `${volume.value}%`;
    volumeValue.textContent = `${volume.value}%`;
  }
  updateVolumeLabel();
  volume.addEventListener("input", updateVolumeLabel);

  function animateBlock() {
    block.classList.add("is-pressed");
    if (animationTimer) window.clearTimeout(animationTimer);
    animationTimer = window.setTimeout(() => {
      block.classList.remove("is-pressed");
      animationTimer = null;
    }, 100);
  }

  // 音声ファイルを毎回複製することで、連続タップ時に音を重ねて再生できる。
  block.addEventListener("click", async () => {
    animateBlock();
    audioError.hidden = true;
    try {
      const audio = new Audio(soundPath);
      audio.preload = "auto";
      audio.volume = Math.max(0, Math.min(1, Number(volume.value) / 100));
      audio.currentTime = 0;
      const cleanup = () => {
        audio.removeEventListener("ended", cleanup);
        audio.removeEventListener("error", showError);
        audio.src = "";
      };
      const showError = () => {
        audioError.hidden = false;
        cleanup();
      };
      audio.addEventListener("ended", cleanup, { once: true });
      audio.addEventListener("error", showError, { once: true });
      await audio.play();
    } catch (error) {
      console.warn("効果音を再生できませんでした。", error);
      audioError.hidden = false;
    }
  });

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch(error => {
        console.warn("オフライン用キャッシュを登録できませんでした。", error);
      });
    });
  }
})();
