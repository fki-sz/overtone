document.addEventListener("DOMContentLoaded", () => {
  // 1. 多言語辞書（EN / JA）
  let currentLang = "en";

  const i18n = {
    en: {
      aboutBtn: "About",
      aboutTitle: "overtone",
      aboutBody: "This website allows you to mix ambient sounds and transports you to a variety of different spaces. By clicking the sound button in the center of the site, you can access multiple ambient sounds, combine them as you like, and adjust the volume balance to create an experience that feels just right for you. Alternatively, you can select one of our recommended sound presets to enjoy a curated ambient soundscape that immerses you in a specific setting.",
      soundSelection: "Sound Selection",
      backBtn: "Back",
      presetsTitle: "Presets",
      categoriesTitle: "Categories",
      catAll: "All",
      catWater: "Water",
      catWood: "Wood",
      catActive: "Active",
      presetRainy: "Rainy Reading",
      presetForest: "Deep Forest",
      presetBonfire: "Silent Bonfire",
      speedLabel: "Speed",
      toneLabel: "Tone",
      toneTeal: "Teal (Default)",
      toneMidnight: "Midnight Blue",
      toneSunset: "Warm Sunset",
      sounds: {
        sound1: "Rain",
        sound2: "Coast",
        sound3: "Waterfall",
        sound4: "Fire",
        sound5: "Forest"
      }
    },
    ja: {
      aboutBtn: "このサイトについて",
      aboutTitle: "overtone",
      aboutBody: "環境音を自由に組み合わせて、さまざまな空間へと誘うサウンドスケープサイトです。画面下の再生ボタンから複数の環境音を選び、自分好みのバランスで重ねたり、おすすめのプリセットから特定の情景に浸ったりして過ごせます。",
      soundSelection: "サウンド選択",
      backBtn: "戻る",
      presetsTitle: "プリセット",
      categoriesTitle: "カテゴリー",
      catAll: "すべて",
      catWater: "水",
      catWood: "森・焚き火",
      catActive: "再生中",
      presetRainy: "雨の日の読書",
      presetForest: "深い森",
      presetBonfire: "静かな焚き火",
      speedLabel: "速さ",
      toneLabel: "色合い",
      toneTeal: "ティール（初期設定）",
      toneMidnight: "ミッドナイトブルー",
      toneSunset: "ウォームサンセット",
      sounds: {
        sound1: "雨音",
        sound2: "海岸の波",
        sound3: "滝",
        sound4: "焚き火",
        sound5: "森のざわめき"
      }
    }
  };

  // 2. サウンドマスターデータ
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

  // スマートフォン判定（iPadOS等の大画面タブレットは除外し、スマホ幅または小型タッチ端末を想定）
  function isSmartphone() {
    const isNarrowScreen = window.matchMedia("(max-width: 768px)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const isSmallViewport = Math.min(window.innerWidth, window.innerHeight) <= 480;
    return isNarrowScreen || (isCoarsePointer && isSmallViewport);
  }

  // 【機能】全サウンドのループ再生設定と初期音量を設定
  soundData.forEach(item => {
    const audio = new Audio(item.src);
    audio.loop = true;
    audio.volume = masterVolume;
    audioMap[item.id] = audio;
    userPlayingState[item.id] = false;
  });

  // 左上の再生・一時停止ボタンの表示を更新（再生中：赤丸に⏸ / 停止中：▶︎）
  const globalPauseBtn = document.getElementById("globalPauseBtn");

  function updateGlobalPlayButtonUI() {
    if (!globalPauseBtn) return;
    const isAnyPlaying = soundData.some(item => audioMap[item.id] && !audioMap[item.id].paused);
    const iconEl = globalPauseBtn.querySelector(".global-btn-icon");

    if (isAnyPlaying) {
      globalPauseBtn.classList.add("is-playing");
      globalPauseBtn.classList.remove("is-paused");
      if (iconEl) {
        iconEl.textContent = "⏸";
      } else {
        globalPauseBtn.textContent = "⏸";
      }
      globalPauseBtn.setAttribute("aria-label", "Pause All");
    } else {
      globalPauseBtn.classList.remove("is-playing");
      globalPauseBtn.classList.add("is-paused");
      if (iconEl) {
        iconEl.textContent = "▶︎";
      } else {
        globalPauseBtn.textContent = "▶︎";
      }
      globalPauseBtn.setAttribute("aria-label", "Resume All");
    }
  }

  // 言語切替の反映
  const langToggleBtn = document.getElementById("langToggleBtn");

  function applyLanguage(lang) {
    currentLang = lang;
    const dict = i18n[lang];

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (dict && dict[key]) {
        el.textContent = dict[key];
      }
    });

    soundData.forEach(item => {
      const nameEl = document.querySelector(`#item-${item.id} .sound-name`);
      if (nameEl && dict.sounds && dict.sounds[item.id]) {
        nameEl.textContent = dict.sounds[item.id];
      }
    });

    if (langToggleBtn) {
      langToggleBtn.textContent = lang === "en" ? "JA" : "EN";
    }
  }


  // 【機能】言語切替ボタンをクリックしたときに英語と日本語を入れ替える
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      applyLanguage(currentLang === "en" ? "ja" : "en");
    });
  }

  // 音量スライダーの表示・非表示を端末に合わせて反映
  function applyVolumeSliderVisibility() {
    const hideSliders = isSmartphone();

    const masterSlider = document.getElementById("masterVolumeSlider");
    if (masterSlider) {
      const masterWrap = masterSlider.closest(".master-vol-wrapper, .volume-control-wrapper") || masterSlider.parentElement;
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

  // 【機能】サウンドリストモーダルの開く・閉じる・背景クリックで閉じる操作
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


  // 【機能】Aboutモーダルの開く・閉じる・背景クリックで閉じる操作
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


  // 【機能】サウンド一覧のDOM要素を生成し、各サウンドの再生/停止・個別音量操作を紐づける
  const container = document.getElementById("soundListContainer");
  if (container) {
    soundData.forEach(item => {
      const soundEl = document.createElement("div");
      soundEl.className = "sound-item";
      soundEl.id = `item-${item.id}`;
      soundEl.dataset.soundId = item.id;
      soundEl.dataset.category = item.category;

      const initialName = (i18n[currentLang] && i18n[currentLang].sounds[item.id]) || item.name;

      soundEl.innerHTML = `
        <div class="sound-item-header">
          <span class="sound-name">${initialName}</span>
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


  // 【機能】指定したサウンドを再生し、音量・ボタン表示・再生中状態を更新する
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

    audio.play()
      .then(() => {
        updateGlobalPlayButtonUI();
      })
      .catch(err => console.error("再生エラー:", err));

    if (playBtn) {
      playBtn.textContent = "⏸";
      playBtn.classList.add("playing");
    }
    if (soundItem) soundItem.classList.add("active");
    if (volWrap) {
      volWrap.style.display = isSmartphone() ? "none" : "flex";
    }
    userPlayingState[id] = true;
    updateGlobalPlayButtonUI();
  }

  // 【機能】指定したサウンドを一時停止し、ボタンと表示状態を戻す
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
    updateGlobalPlayButtonUI();
  }


  // 【機能】指定したサウンドを停止し、再生位置（currentTime）を先頭（0秒）に戻す
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
    updateGlobalPlayButtonUI();
  }


  // 【機能】すべてのサウンドを完全停止する
  function stopAllSoundsCompletely() {
    soundData.forEach(item => stopAudioCompletely(item.id));
  }

  // 【機能】現在再生中のすべてのサウンドを一時停止する
  function pauseAllSounds() {
    soundData.forEach(item => {
      if (audioMap[item.id] && !audioMap[item.id].paused) {
        pauseAudio(item.id);
        userPlayingState[item.id] = true;
      }
    });
    updateGlobalPlayButtonUI();
  }

  // 【機能】一時停止前に鳴っていた音（なければ最初の音）を再開する
  function resumeAllSounds() {
    const hasSavedPlaying = soundData.some(item => userPlayingState[item.id]);
    if (hasSavedPlaying) {
      soundData.forEach(item => {
        if (userPlayingState[item.id]) {
          playAudio(item.id);
        }
      });
    } else if (soundData.length > 0) {
      playAudio(soundData[0].id);
    }
    updateGlobalPlayButtonUI();
  }

  // 【機能】選択されたカテゴリーまたはID配列に合わせてサウンド一覧の表示・非表示を切り替える
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

  // 左上の再生・一時停止ボタン（再生中は赤丸に⏸、停止中は▶︎）
  if (globalPauseBtn) {
    globalPauseBtn.addEventListener("click", () => {
      const isAnyPlaying = soundData.some(item => audioMap[item.id] && !audioMap[item.id].paused);
      if (isAnyPlaying) {
        pauseAllSounds();
      } else {
        resumeAllSounds();
      }
    });
  }

  // 【機能】マスターボリュームスライダーを動かしたとき、全サウンドの音量に反映する
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


  // 【機能】おすすめプリセットの定義（プリセット名：{ サウンドID: 個別音量 }）
  const presets = {
    rainyDay: { sound1: 0.7, sound2: 0.3 },
    forestRelax: { sound3: 0.4, sound5: 0.8 },
    bonfireNight: { sound4: 0.8, sound5: 0.2 }
  };

  const presetButtons = document.querySelectorAll(".preset-btn");
  const activePresetTagBtn = document.getElementById("activePresetTagBtn");
  const tagButtons = document.querySelectorAll(".tag-btn");


  // 【機能】プリセットボタンのクリック処理（選択で再生・絞り込み、再クリックで解除・停止）
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


  // 【機能】カテゴリータブをクリックしたときの絞り込みとアクティブ表示切替
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


  // 【機能】背景アニメーションの速さスライダー変更時に各円のアニメーション時間を更新
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


  // 【機能】背景色合い（Tone）の選択に応じて body のテーマクラスとSVGアイコンを切り替える
  const toneSelect = document.getElementById("toneSelect");

  function updateThemeIcons(theme) {
    const isDark = theme === "midnight";
    document.querySelectorAll("img[data-icon-light][data-icon-dark]").forEach(img => {
      img.src = isDark ? img.dataset.iconDark : img.dataset.iconLight;
    });
  }

  if (toneSelect) {
    toneSelect.addEventListener("change", (e) => {
      const theme = e.target.value;
      document.body.classList.remove("theme-midnight", "theme-sunset");
      if (theme === "midnight") {
        document.body.classList.add("theme-midnight");
      } else if (theme === "sunset") {
        document.body.classList.add("theme-sunset");
      }
      // 色合いを変えたときにもアイコンを切り替える
      updateThemeIcons(theme);
    });

    // 初期表示時のテーマに合わせてアイコンを反映
    updateThemeIcons(toneSelect.value);
  }

  // 【機能】ページ読み込み時の初期表示反映と、画面サイズ変更時のスライダー再判定
  applyLanguage("en");
  applyVolumeSliderVisibility();
  updateGlobalPlayButtonUI();
  window.addEventListener("resize", applyVolumeSliderVisibility);
});