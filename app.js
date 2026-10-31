(() => {
  "use strict";

  const block = document.getElementById("questionBlock");
  const volume = document.getElementById("volume");
  const volumeValue = document.getElementById("volumeValue");
  const audioError = document.getElementById("audioError");

  // 音量は起動ごとに30%へ初期化する。設定値は保存しない。
  volume.value = "30";
  let audioContext = null;
  let activeVoices = 0;
  let animationTimer = null;

  function updateVolumeLabel() {
    volumeValue.value = `${volume.value}%`;
    volumeValue.textContent = `${volume.value}%`;
  }
  updateVolumeLabel();
  volume.addEventListener("input", updateVolumeLabel);

  function getAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error("Web Audio API is unavailable");
    if (!audioContext) audioContext = new AudioContextClass();
    return audioContext;
  }

  // 明るいコイン獲得音を目指したオリジナルの短い上昇音。
  // 参考音源そのものは複製せず、Web Audio APIでブラウザ内生成する。
  async function playCoinSound() {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") await ctx.resume();

    const master = ctx.createGain();
    const volumeLevel = Math.max(0, Math.min(1, Number(volume.value) / 100));
    master.gain.setValueAtTime(volumeLevel * 0.22, ctx.currentTime);
    master.connect(ctx.destination);

    const start = ctx.currentTime + 0.005;
    const notes = [
      { freq: 988, at: 0.00, dur: 0.105, peak: 0.75 },
      { freq: 1318.5, at: 0.075, dur: 0.12, peak: 0.68 },
      { freq: 1760, at: 0.17, dur: 0.20, peak: 0.52 }
    ];

    notes.forEach((note, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const tone = ctx.createOscillator();
      const toneGain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(note.freq, start + note.at);
      // ごく短いピッチの上昇を加え、ゲームらしい輪郭を作る。
      osc.frequency.setValueAtTime(note.freq * 1.035, start + note.at + 0.025);
      gain.gain.setValueAtTime(0.0001, start + note.at);
      gain.gain.linearRampToValueAtTime(note.peak, start + note.at + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + note.at + note.dur);
      osc.connect(gain);
      gain.connect(master);
      osc.start(start + note.at);
      osc.stop(start + note.at + note.dur + 0.015);

      // 高音のきらめき。ごく小さく混ぜる。
      tone.type = "sine";
      tone.frequency.setValueAtTime(note.freq * 2, start + note.at);
      toneGain.gain.setValueAtTime(0.0001, start + note.at);
      toneGain.gain.linearRampToValueAtTime(index === 2 ? 0.14 : 0.08, start + note.at + 0.006);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, start + note.at + note.dur * 0.78);
      tone.connect(toneGain);
      toneGain.connect(master);
      tone.start(start + note.at);
      tone.stop(start + note.at + note.dur + 0.015);
    });

    // すべての音が終わった後に接続を片付ける。
    const cleanupMs = 650;
    window.setTimeout(() => {
      try { master.disconnect(); } catch (_) {}
    }, cleanupMs);
  }

  function animateBlock() {
    block.classList.add("is-pressed");
    if (animationTimer) window.clearTimeout(animationTimer);
    animationTimer = window.setTimeout(() => {
      block.classList.remove("is-pressed");
      animationTimer = null;
    }, 95);
  }

  block.addEventListener("click", async () => {
    animateBlock();
    audioError.hidden = true;
    try {
      await playCoinSound();
    } catch (error) {
      console.warn("効果音を再生できませんでした。", error);
      audioError.hidden = false;
    }
  });

  // アプリは最初にオンラインで読み込まれた後、主要ファイルをキャッシュしてオフライン利用を支援する。
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch(error => {
        console.warn("オフライン用キャッシュを登録できませんでした。", error);
      });
    });
  }
})();
