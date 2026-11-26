document.addEventListener("DOMContentLoaded", () => {
  // 1. サウンドマスターデータ
  const soundData = [
    { id: "sound1", name: "Rain", src: "sound/rain.mp3", category: "water" },
    { id: "sound2", name: "Coast", src: "sound/wave.mp3", category: "water" },
    { id: "sound3", name: "Waterfall", src: "sound/waterfall.mp3", category: "water" },
    { id: "sound4", name: "Fire", src: "sound/fire.mp3", category: "wood" },
    { id: "sound5", name: "Forest", src: "sound/forest.mp3", category: "wood" }
  ];

  // Audioインスタンス管理 ＆ 再生状態記録
  const audioMap = {};
  const userPlayingState = {};
  let masterVolume = 0.5;
  let activePresetKey = null;
  let isGloballyPaused = false;

  // スマートフォン判定（iPadOS等の大画面タブレットは除外し、スマホ幅または小型タッチ端末を想定）
  function isSmartphone() {
    const isNarrowScreen = window.matchMedia("(max-width: 768px)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const isSmallViewport = Math.min(window.innerWidth, window.innerHeight) <= 480;
    return isNarrowScreen || (isCoarsePointer && isSmallViewport);
  }

  soundData.forEach(item => {
    const audio = new Audio(item.src);
    audio.loop = true;
    audio.volume = masterVolume;
    audioMap[item.id] = audio;
    userPlayingState[item.id] = false;
  });

  // 音量スライダーの表示・非表示を端末に合わせて反映
  function applyVolumeSliderVisibility() {
    const hideSliders = isSmartphone();

    const masterSlider = document.getElementById("masterVolumeSlider");
    if (masterSlider) {
      const masterWrap = masterSlider.closest(".master-volume-wrapper, .volume-control-wrapper") || masterSlider.parentElement;
      if (masterWrap) {
        masterWrap.style.display = hideSliders ? "none" : "";
      } else {
        masterSlider.style.display = hideSliders ? "none" : "";
      }
    }

    soundData.forEach(item => {
      const volWrap = document.getElementById(`volWrap-${item.id}`);
      const soundItem = document.getElementById(`item-${item.id}`);
      const isPlaying = soundItem ? soundItem.classList.contains("active") : false;

      if (volWrap) {
        if (hideSliders) {
          volWrap.style.display = "none";
        } else {
          volWrap.style.display = isPlaying ? "flex" : "none";
        }
      }
    });
  }

  // モーダル開閉を最初に登録
  const soundModal = document.getElementById("soundModal");
  const openSoundListBtn = document.getElementById("openSoundListBtn");
  const closeSoundListBtn = document.getElementById("closeSoundListBtn");

  if (openSoundListBtn && soundModal) {
    openSoundListBtn.addEventListener("click", (e) => {
      e.preventDefault();
      soundModal.classList.add("open");
      applyVolumeSliderVisibility();
    });
  }

  if (closeSoundListBtn && soundModal) {
    closeSoundListBtn.addEventListener("click", () => {
      soundModal.classList.remove("open");
    });
  }

  if (soundModal) {
    soundModal.addEventListener("click", (e) => {
      if (e.target === soundModal) {
        soundModal.classList.remove("open");
      }
    });
  }

  const aboutModal = document.getElementById("aboutModal");
  const openAboutBtn = document.getElementById("openAboutBtn");
  const closeAboutBtn = document.getElementById("closeAboutBtn");

  if (openAboutBtn && aboutModal) {
    openAboutBtn.addEventListener("click", () => aboutModal.classList.add("open"));
  }
  if (closeAboutBtn && aboutModal) {
    closeAboutBtn.addEventListener("click", () => aboutModal.classList.remove("open"));
  }
  if (aboutModal) {
    aboutModal.addEventListener("click", (e) => {
      if (e.target === aboutModal) aboutModal.classList.remove("open");
    });
  }

  // サウンドリスト描画
  const container = document.getElementById("soundListContainer");
  if (container) {
    soundData.forEach(item => {
      const soundEl = document.createElement("div");
      soundEl.className = "sound-item";
      soundEl.id = `item-${item.id}`;
      soundEl.dataset.soundId = item.id;
      soundEl.dataset.category = item.category;

      soundEl.innerHTML = `
        <div class="sound-item-header">
          <span class="sound-name">${item.name}</span>
          <button class="play-toggle-btn" id="btn-${item.id}" type="button">▶︎</button>
        </div>
        <div class="volume-control-wrapper" id="volWrap-${item.id}" style="display: none;">
          <input type="range" class="vol-slider" min="0" max="1" step="0.01" value="${masterVolume}" id="slider-${item.id}">
        </div>
      `;

      container.appendChild(soundEl);

      const playBtn = soundEl.querySelector(`#btn-${item.id}`);
      const slider = soundEl.querySelector(`#slider-${item.id}`);
      const audio = audioMap[item.id];

      if (playBtn) {
        playBtn.addEventListener("click", () => {
          if (audio.paused) {
            playAudio(item.id);
          } else {
            pauseAudio(item.id);
          }
        });
      }

      if (slider) {
        slider.addEventListener("input", (e) => {
          if (isSmartphone()) return;
          const indVol = parseFloat(e.target.value);
          audio.volume = Math.max(0, Math.min(1, indVol * masterVolume));
        });
      }
    });
  }

  function playAudio(id, vol = null) {
    const audio = audioMap[id];
    const playBtn = document.getElementById(`btn-${id}`);
    const volWrap = document.getElementById(`volWrap-${id}`);
    const soundItem = document.getElementById(`item-${id}`);
    const slider = document.getElementById(`slider-${id}`);

    if (!audio) return;

    if (isSmartphone()) {
      audio.volume = masterVolume;
    } else {
      const targetVol = vol !== null ? parseFloat(vol) : (slider ? parseFloat(slider.value) : 1);
      if (slider && vol !== null) {
        slider.value = targetVol;
      }
      audio.volume = Math.max(0, Math.min(1, targetVol * masterVolume));
    }

    audio.play().catch(err => console.error("再生エラー:", err));
    if (playBtn) {
      playBtn.textContent = "⏸";
      playBtn.classList.add("playing");
    }
    if (soundItem) soundItem.classList.add("active");
    if (volWrap) {
      volWrap.style.display = isSmartphone() ? "none" : "flex";
    }
    userPlayingState[id] = true;
  }

  function pauseAudio(id) {
    const audio = audioMap[id];
    const playBtn = document.getElementById(`btn-${id}`);
    const volWrap = document.getElementById(`volWrap-${id}`);
    const soundItem = document.getElementById(`item-${id}`);

    if (!audio) return;

    audio.pause();
    if (playBtn) {
      playBtn.textContent = "▶︎";
      playBtn.classList.remove("playing");
    }
    if (soundItem) soundItem.classList.remove("active");
    if (volWrap) volWrap.style.display = "none";
    userPlayingState[id] = false;
  }

  function stopAudioCompletely(id) {
    const audio = audioMap[id];
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    userPlayingState[id] = false;

    const playBtn = document.getElementById(`btn-${id}`);
    const volWrap = document.getElementById(`volWrap-${id}`);
    const soundItem = document.getElementById(`item-${id}`);
    if (playBtn) {
      playBtn.textContent = "▶︎";
      playBtn.classList.remove("playing");
    }
    if (soundItem) soundItem.classList.remove("active");
    if (volWrap) volWrap.style.display = "none";
  }

  function stopAllSoundsCompletely() {
    soundData.forEach(item => stopAudioCompletely(item.id));
  }

  function pauseAllSounds() {
    soundData.forEach(item => {
      if (audioMap[item.id] && !audioMap[item.id].paused) {
        pauseAudio(item.id);
        userPlayingState[item.id] = true;
      }
    });
  }

  function resumeAllSounds() {
    soundData.forEach(item => {
      if (userPlayingState[item.id]) {
        playAudio(item.id);
      }
    });
  }

  function filterSoundList(target) {
    const soundItems = document.querySelectorAll(".sound-item");
    soundItems.forEach(item => {
      const soundId = item.dataset.soundId;
      const category = item.dataset.category;

      if (Array.isArray(target)) {
        item.classList.toggle("hidden", !target.includes(soundId));
      } else {
        const shouldShow = target === "all" || category === target;
        item.classList.toggle("hidden", !shouldShow);
      }
    });
  }

  const globalPauseBtn = document.getElementById("globalPauseBtn");
  if (globalPauseBtn) {
    globalPauseBtn.addEventListener("click", () => {
      if (!isGloballyPaused) {
        pauseAllSounds();
        isGloballyPaused = true;
        globalPauseBtn.textContent = "Resume All";
      } else {
        resumeAllSounds();
        isGloballyPaused = false;
        globalPauseBtn.textContent = "Pause All";
      }
    });
  }

  const masterVolumeSlider = document.getElementById("masterVolumeSlider");
  if (masterVolumeSlider) {
    masterVolumeSlider.addEventListener("input", (e) => {
      if (isSmartphone()) return;
      masterVolume = parseFloat(e.target.value);
      soundData.forEach(item => {
        const audio = audioMap[item.id];
        const slider = document.getElementById(`slider-${item.id}`);
        const indVol = slider ? parseFloat(slider.value) : 1;
        if (audio) {
          audio.volume = Math.max(0, Math.min(1, indVol * masterVolume));
        }
      });
    });
  }

  const presets = {
    rainyDay: { sound1: 0.7, sound2: 0.3 },
    forestRelax: { sound3: 0.4, sound5: 0.8 },
    bonfireNight: { sound4: 0.8, sound5: 0.2 }
  };

  const presetButtons = document.querySelectorAll(".preset-btn");
  const activePresetTagBtn = document.getElementById("activePresetTagBtn");
  const tagButtons = document.querySelectorAll(".tag-btn");

  presetButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const presetKey = btn.dataset.preset;

      if (activePresetKey === presetKey) {
        stopAllSoundsCompletely();
        activePresetKey = null;
        btn.classList.remove("active-preset");
        if (activePresetTagBtn) activePresetTagBtn.style.display = "none";

        const activeTagBtn = document.querySelector(".tag-btn.active-tag");
        const currentCategory = activeTagBtn && activeTagBtn !== activePresetTagBtn
          ? activeTagBtn.dataset.category
          : "all";

        tagButtons.forEach(b => b.classList.remove("active-tag"));
        const fallbackBtn = document.querySelector(`.tag-btn[data-category="${currentCategory}"]`);
        if (fallbackBtn) fallbackBtn.classList.add("active-tag");

        filterSoundList(currentCategory);
        return;
      }

      stopAllSoundsCompletely();
      presetButtons.forEach(b => b.classList.remove("active-preset"));
      btn.classList.add("active-preset");

      activePresetKey = presetKey;
      isGloballyPaused = false;
      if (globalPauseBtn) globalPauseBtn.textContent = "Pause All";

      const targetPreset = presets[presetKey];
      if (targetPreset) {
        const targetSoundIds = Object.keys(targetPreset);
        targetSoundIds.forEach(soundId => {
          playAudio(soundId, targetPreset[soundId]);
        });
        filterSoundList(targetSoundIds);

        if (activePresetTagBtn) {
          activePresetTagBtn.style.display = "inline-block";
          tagButtons.forEach(b => b.classList.remove("active-tag"));
          activePresetTagBtn.classList.add("active-tag");
        }
      }
    });
  });

  tagButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const selectedCategory = btn.dataset.category;
      tagButtons.forEach(b => b.classList.remove("active-tag"));
      btn.classList.add("active-tag");

      if (selectedCategory === "preset-active" && activePresetKey && presets[activePresetKey]) {
        filterSoundList(Object.keys(presets[activePresetKey]));
      } else {
        filterSoundList(selectedCategory);
      }
    });
  });

  const speedSlider = document.getElementById("speedSlider");
  if (speedSlider) {
    speedSlider.addEventListener("input", (e) => {
      const val = e.target.value;
      const circles = document.querySelectorAll(".circles li");
      circles.forEach((li, index) => {
        const durationFactor = (index % 3 === 0) ? 0.6 : (index % 2 === 0 ? 1.0 : 1.4);
        li.style.animationDuration = `${val * durationFactor}s`;
      });
    });
  }

  const toneSelect = document.getElementById("toneSelect");
  if (toneSelect) {
    toneSelect.addEventListener("change", (e) => {
      const theme = e.target.value;
      document.body.classList.remove("theme-midnight", "theme-sunset");
      if (theme === "midnight") {
        document.body.classList.add("theme-midnight");
      } else if (theme === "sunset") {
        document.body.classList.add("theme-sunset");
      }
    });
  }

  applyVolumeSliderVisibility();
  window.addEventListener("resize", applyVolumeSliderVisibility);
});

