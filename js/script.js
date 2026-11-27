document.addEventListener("DOMContentLoaded", () => {
  // 1. 多言語辞書（EN / JA）
  let currentLang = "en";

  const i18n = {
    en: {
      aboutBtn: "About",
      aboutTitle: "overtone",
      aboutBody: `
        <h3 class="about-section-title">Introduction</h3>
        <p>overtone is a web space designed to create a comfortable atmosphere and mental breathing room in your daily life by layering everyday environmental sounds.</p>
        <p>In acoustics, an overtone refers to the higher frequency components that resonate alongside a fundamental tone, shaping a sound's timbre, richness, and depth. When multiple sounds overlap, their overtones combine to alter the warmth, brightness, and spatial dimension of the resonance. In the same way, by letting various environmental sounds resonate together, this project aims to create a rich soundscape tailored to you—guiding you into a space where you can feel at ease.</p>
        <p>We hope this offers a quiet moment to step away from the rush of constant information and time, helping you reconnect with your own senses and pace.</p>

        <h3 class="about-section-title">How to Use</h3>
        <p class="about-step-title">1. Layer Your Sounds</p>
        <p>Select any sounds that catch your ear from the sound list in the center, and adjust their volume balance freely. Alongside discovering your own combinations, you can also explore curated presets inspired by specific scenes and moods.</p>
        <p class="about-step-title">2. Tune the Atmosphere</p>
        <p>Along with the audio, you can adjust the background color and the movement speed of the visual shapes. Choose the brightness and rhythm intuitively to match your time, place, and mood, and shape an environment that feels right for you.</p>
      `,
      soundSelection: "Sound Selection",
      backBtn: "Back",
      presetsTitle: "Presets",
      categoriesTitle: "Categories",
      catAll: "All",
      catWater: "Water",
      catNature: "Nature",
      catLife: "Life",
      catCity: "City",
      catActive: "Active",
      presetSummer:"midsummer shade",
      presetOcean:"shoreline dusk",
      presetHouse:"morning kitchen",
      presetForest: "deep woods rain",
      presetRainy: "rainy commute",
      speedLabel: "Speed",
      toneLabel: "Tone",
      toneTeal: "Teal (Default)",
      toneMidnight: "Midnight Blue",
      toneSunset: "Warm Sunset",
      sounds: {
        sound1: "waves",
        sound2: "stream-deep",
        sound3: "stream",
        sound4: "stream&birds",
        sound5: "rainy forest",
        sound6: "cicadas",
        sound7: "brown cicadas",
        sound8: "bell cricket",
        sound9: "clock",
        sound10: "running water",
        sound11: "city traffic",
        sound12: "rainy street"
      }
    },
    ja: {
      aboutBtn: "このサイトについて",
      aboutTitle: "overtone",
      aboutBody: `
        <h3 class="about-section-title">はじめに</h3>
        <p>overtone は、日常の環境音を重ね合わせることで、心地よい空気感と心の余白をつくるためのウェブ空間です。</p>
        <p>音響学における「倍音（overtone）」とは、基音とともに響く高い周波数成分を指し、音の音色や豊かさ、奥行きを形づくる要素です。複数の音が重なり合うと、それぞれの倍音が混ざり合い、響きの温かさや明るさ、空間の広がりが変化します。同じように、さまざまな環境音を響き合わせることで、あなた自身に寄り添う豊かなサウンドスケープを生み出し、ほっと落ち着ける空間へと導くことを目指しています。</p>
        <p>絶え間ない情報や時間の流れから少し離れ、自分の感覚やペースを取り戻す静かなひとときになれば幸いです。</p>

        <h3 class="about-section-title">使い方</h3>
        <p class="about-step-title">1. 音を重ねる</p>
        <p>画面中央のサウンドリストから気になる音を選び、音量バランスを自由に調整できます。自分だけの組み合わせを見つけるほか、特定の情景や気分をイメージしたプリセットも楽しめます。</p>
        <p class="about-step-title">2. 空間の雰囲気を整える</p>
        <p>音だけでなく、背景の色合いや図形の動く速さも調整できます。時間や場所、そのときの気分に合わせて明るさやリズムを直感的に選び、心地よい環境を整えてみてください。</p>
      `,
      soundSelection: "サウンド選択",
      backBtn: "戻る",
      presetsTitle: "プリセット",
      categoriesTitle: "カテゴリー",
      catAll: "すべて",
      catWater: "水",
      catNature: "自然",
      catLife: "生活",
      catCity: "街",
      catActive: "再生中",
      presetSummer:"真夏の木陰",
      presetOcean:"夕暮れの波打ち際",
      presetHouse:"朝の台所",
      presetForest: "雨の森の奥",
      presetRainy: "雨の日の窓辺",
      speedLabel: "速さ",
      toneLabel: "色合い",
      toneTeal: "ティール（初期設定）",
      toneMidnight: "ミッドナイトブルー",
      toneSunset: "ウォームサンセット",
      sounds: {
        sound1: "波音",
        sound2: "深い小川",
        sound3: "小川の流れ",
        sound4: "小川と鳥たち",
        sound5: "雨の日の森",
        sound6: "蝉の声",
        sound7: "アブラゼミ",
        sound8: "スズムシ",
        sound9: "秒針の音",
        sound10: "水道から流れる水",
        sound11: "街の中",
        sound12: "雨の日の街中"
      }
    }
  };

  // 2. サウンドマスターデータ
  const soundData = [
    { id: "sound1", name: "waves", src: "sound/waves.wav", category: "Water" },
    { id: "sound2", name: "stream-deep", src: "sound/stream-deep.wav", category: "Water" },
    { id: "sound3", name: "stream", src: "sound/stream.wav", category: "water" },
    { id: "sound4", name: "stream&birds", src: "sound/stream&birds.wav", category: "Water" },
    { id: "sound5", name: "rainyforest", src: "sound/rainyforest.wav", category: "Nature" },
    { id: "sound6", name: "cicadas", src: "sound/cicadas.wav", category: "Nature" },
    { id: "sound7", name: "brown cicada", src: "sound/cicadas2.wav", category: "Nature" },
    { id: "sound8", name: "bell cricket", src: "sound/eveninginsects.wav", category: "Nature" },
    { id: "sound9", name: "clock", src: "sound/clock.mp3", category: "Life" },
    { id: "sound10", name: "running water", src: "sound/runningwater.wav", category: "Life" },
    { id: "sound11", name: "city traffic", src: "sound/citytraffic.mp3", category: "City" },
    { id: "sound12", name: "rainy street", src: "sound/rainystreet.mp3", category: "City" }
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
        if (key === "aboutBody") {
          el.innerHTML = dict[key];
        } else {
          el.textContent = dict[key];
        }
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
    Summer: { sound6: 0.6, sound2: 0.5 , sound4: 0.25},
    Ocean: { sound1: 0.7, sound8: 0.35, sound11: 0.2 },
    House: { sound10: 0.55, sound9: 0.7, sound4: 0.25 },
    RainyForest: { sound5: 0.7, sound2: 0.4, sound6: 0.15 },
    Rainyday: { sound12: 0.55, sound9: 0.7, sound10: 0.25 }
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