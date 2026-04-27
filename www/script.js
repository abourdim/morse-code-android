/**
 * Morse Kids Lab — Script
 * BLE · Audio · Encoder · Decoder · Tap · Challenges · i18n
 * Based on Workshop DIY template + bit-playground BLE patterns
 */

const $ = id => document.getElementById(id);

/* ═══════════════════════════════════════════════════════════════════
   MORSE CODE TABLE
   ═══════════════════════════════════════════════════════════════════ */

const MORSE_TABLE = {
  'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.',
  'H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.',
  'O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-',
  'V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-',
  '5':'.....','6':'-....','7':'--...','8':'---..','9':'----.',
  '.':'.-.-.-',',':'--..--','?':'..--..','!':'-.-.--','/':'-..-.',
  '(':'-.--.',')':'-.--.-','&':'.-...',':':'---...',';':'-.-.-.',
  '=':'-...-','+':'.-.-.','-':'-....-','_':'..--.-','"':'.-..-.',
  '$':'...-..-','@':'.--.-.','\'':'.----.'
};

const REVERSE_MORSE = {};
for (const [k, v] of Object.entries(MORSE_TABLE)) REVERSE_MORSE[v] = k;

function textToMorse(text) {
  return text.toUpperCase().split('').map(ch => {
    if (ch === ' ') return '/';
    return MORSE_TABLE[ch] || '?';
  }).join(' ');
}

function morseToText(morse) {
  const normalized = morse.replace(/·/g, '.').replace(/—/g, '-');
  return normalized.split(/\s*\/\s*/).map(word =>
    word.trim().split(/\s+/).map(code => REVERSE_MORSE[code] || '?').join('')
  ).join(' ');
}

/* ═══════════════════════════════════════════════════════════════════
   i18n
   ═══════════════════════════════════════════════════════════════════ */

const LANG = {
  en: {
    title: 'Morse Kids Lab', subtitle: '📡 learn · ✨ tap · 🔊 listen · 🤖 connect',
    disconnected: 'Disconnected', connected: 'Connected',
    tabLearn: 'Learn', tabEncode: 'Encode', tabDecode: 'Decode', tabTap: 'Tap',
    tabListen: 'Listen', tabMicrobit: 'micro:bit', tabChallenge: 'Challenge', tabHelp: 'Help',
    learnTitle: 'Morse Code Reference', learnDesc: 'Click any character to hear it!',
    newb: 'Newb', explorer: 'Explorer', developer: 'Developer',
    learnNewb: 'Morse Code is like a secret flashlight language! You use only TWO things: short blinks (dots ·) and long blinks (dashes —). Every letter has its own pattern. SOS is ··· ——— ··· and it saved thousands of lives at sea!',
    learnExplorer: 'Morse Code was invented by Samuel Morse in 1836 for telegraph communication. Each character is encoded as a sequence of dits (·) and dahs (—). Timing: dit=1 unit, dah=3 units, letter gap=3 units, word gap=7 units. Speed is measured in WPM.',
    learnDeveloper: 'Morse is a variable-length binary encoding similar to Huffman coding. Frequent letters (E=·, T=—) get shorter codes. With 2 symbols it maps to a binary tree: left=dit, right=dah. ITU-R M.1677 standard. Detectable 10dB below noise floor — better than voice.',
    encodeTitle: 'Text → Morse Encoder', encodeDesc: 'Type text and see it in Morse code',
    encodeNewb: 'Type your name below and watch it turn into dots and dashes! It\'s like writing a secret message. Try typing SOS first!',
    encodeExplorer: 'The encoder converts each character to its Morse representation. Letters separated by spaces, words by " / ". Unknown characters show as "?".',
    encodeDeveloper: 'O(1) lookup per character. Visual flasher uses Web Audio API OscillatorNode. BLE sends UTF-8 over Nordic UART Service.',
    decodeTitle: 'Morse → Text Decoder', decodeDesc: 'Paste Morse code to read it',
    decodeNewb: 'Got a secret Morse message? Paste it here using dots (.) and dashes (-). Use space between letters and slash (/) between words!',
    decodeExplorer: 'Decoder maps each dot-dash group to a character using reverse lookup. Standard separators: space between letters, " / " between words.',
    tapTitle: 'Tap Lab', tapDesc: 'Tap to send Morse code!',
    tapNewb: 'Press the big button below! Short tap = dot (dit), long press = dash (dah). Wait a moment between letters — like a telegraph operator!',
    tapExplorer: 'Timing thresholds: press < 200ms = dit, press ≥ 200ms = dah. Gap ≥ 600ms = letter break. Gap ≥ 1400ms = word break. Farnsworth timing.',
    listenTitle: 'Listen Station', listenDesc: 'Hear Morse code played as audio',
    listenNewb: 'Type any word and press Play to hear it as beeps! Short beep = dot, long beep = dash — exactly what radio operators hear!',
    microbitTitle: 'micro:bit Lab', microbitDesc: 'Connect & communicate via Bluetooth',
    microbitNewb: 'Your micro:bit is a tiny computer that talks to this app via Bluetooth — like a secret walkie-talkie! Press Connect, then send Morse messages!',
    microbitExplorer: 'BLE uses Nordic UART Service (NUS) for serial-like connection. App sends dots/dashes as text. micro:bit controls buzzer + LEDs. Range ~10m = physical security!',
    microbitDeveloper: 'Web Bluetooth API exposes GATT services. NUS UUIDs: Service 6E400001, TX (notify) 6E400003, RX (write) 6E400002. UTF-8 over 20-byte MTU. Buttons A/B send . and - back via TX.',
    challengeTitle: 'Challenge Zone', challengeDesc: 'Test your Morse skills!',
    helpTitle: 'Help & Guide', helpDesc: 'Everything you need to know',
    inputText: 'Input Text', inputMorse: 'Input Morse Code',
    play: 'Play', stop: 'Stop', send: 'Send', copy: 'Copy', clear: 'Clear',
    connect: 'Connect', disconnect: 'Disconnect', reset: 'Reset',
    speed: 'Speed (WPM)', frequency: 'Frequency (Hz)',
    sendBle: 'Send to micro:bit', sendMorse: 'Send Morse',
    device: 'Device:', bleConnection: 'BLE Connection',
    simulator: 'Simulator', simDesc: 'Virtual micro:bit — try without hardware!',
    received: 'Received from micro:bit',
    firmwareCode: 'micro:bit Firmware (MicroPython)', copyCode: 'Copy Code',
    dot: 'Dot ·', dash: 'Dash —',
    currentMorse: 'Current Morse', decodedText: 'Decoded Text',
    tapHold: 'TAP', message: 'Message',
    score: 'Score', streak: 'Streak', best: 'Best',
    letterQuiz: 'Letter Quiz', wordDecode: 'Word Decode',
    speedRound: 'Speed Round', sosChallenge: 'SOS Challenge',
    pressStart: 'Press Start to begin!', start: 'Start', skip: 'Skip',
    glossary: 'Morse Glossary', learningPath: 'Learning Path',
    securityEthics: 'Security & Ethics', troubleshoot: 'Troubleshooting',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    bleHint: 'Requires Chrome/Edge. Make sure your micro:bit has the Morse firmware.',
    decodeHint: 'Use · or . for dit, — or - for dah, space between letters, / between words',
    securityText: 'Morse Code is encoding, NOT encryption — anyone who knows the code can read your message! BLE is short-range (~10m), which provides physical security. Always communicate respectfully, even in code!',
    troubleshootText: 'BLE not connecting? Use Chrome/Edge, enable Bluetooth, flash the MicroPython firmware. Audio not playing? Click the page first — browsers need a user gesture for audio.',
    step1: 'Learn the Morse alphabet in the Learn tab',
    step2: 'Encode your name in the Encode tab',
    step3: 'Try tapping SOS in the Tap Lab',
    step4: 'Listen to messages in the Listen Station',
    step5: 'Connect your micro:bit via BLE',
    step6: 'Beat the Challenge Zone quizzes!',
    ready: '📡 Morse Kids Lab ready!',
    langChanged: '🌐 Language → English',
    themeChanged: '🎨 Theme →',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus',
    t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    l_newb: '🟢 Newb', l_explorer: '🔵 Explorer', l_developer: '🟣 Developer',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    correct: '✅ Correct!', wrong: '❌ Try again!', awesome: '🔥 Awesome streak!',
    sosSuccess: '🆘 Perfect SOS!', sosFail: 'That wasn\'t SOS. Try: ··· ——— ···',
    timeUp: '⏰ Time\'s up!',
    // Help modal
    quickStart: '🚀 Quick Start',
    qs1: 'Open the <strong>Learn</strong> tab to see the Morse alphabet — click any letter to hear it!',
    qs2: 'Go to <strong>Encode</strong> — type your name and press ▶ Play to hear it in Morse.',
    qs3: 'Try the <strong>Tap Lab</strong> — short tap = dot, long press = dash. Tap SOS!',
    qs4: 'Use <strong>Listen Station</strong> to adjust speed and pitch of the Morse beeps.',
    qs5: 'Connect a real <strong>micro:bit</strong> via Bluetooth in the micro:bit Lab tab.',
    qs6: 'Test yourself in the <strong>Challenge Zone</strong> — letter quiz, word decode, speed round!',
    controls: '🎛️ Controls',
    hLang: 'Language', hLangDesc: 'Switch EN / FR / عربي from the top-right dropdown',
    hTheme: 'Theme', hThemeDesc: '6 themes: Mosque, Zellige, Andalus, Space, Jungle, Robot',
    hLevel: 'Level', hLevelDesc: '🟢 Newb (simple) · 🔵 Explorer (technical) · 🟣 Developer (advanced)',
    hBle: 'BLE', hBleDesc: 'Requires Chrome/Edge. micro:bit needs Morse firmware (see micro:bit tab)',
    morseBasics: '📡 Morse Basics',
    ditDesc: 'Dit — short signal (1 unit)',
    dahDesc: 'Dah — long signal (3 units)',
    sosDesc: 'S = three dits',
    oDesc: 'O = three dahs',
    sosFullDesc: 'SOS = the most famous Morse signal!',
    keyboard: '⌨️ Keyboard Shortcuts',
    kTabs: 'Switch between tabs',
    kConnect: 'Connect / Disconnect BLE',
    kClose: 'Close this help window',
    about: 'ℹ️ About',
    aboutText: 'Morse Kids Lab v1.2 — A fun educational app to learn Morse code, connect to micro:bit via BLE, and master radio communication fundamentals. Built with ❤️ for young learners.',
  },
  fr: {
    title: 'Labo Morse Enfants', subtitle: '📡 apprendre · ✨ taper · 🔊 écouter · 🤖 connecter',
    disconnected: 'Déconnecté', connected: 'Connecté',
    tabLearn: 'Apprendre', tabEncode: 'Encoder', tabDecode: 'Décoder', tabTap: 'Taper',
    tabListen: 'Écouter', tabMicrobit: 'micro:bit', tabChallenge: 'Défi', tabHelp: 'Aide',
    learnTitle: 'Référence Code Morse', learnDesc: 'Cliquez sur un caractère pour l\'entendre !',
    newb: 'Débutant', explorer: 'Explorateur', developer: 'Développeur',
    learnNewb: 'Le Code Morse, c\'est comme un langage secret avec une lampe ! Tu utilises seulement DEUX choses : des clignotements courts (points ·) et longs (tirets —). SOS c\'est ··· ——— ··· et ça a sauvé des milliers de vies en mer !',
    encodeTitle: 'Texte → Encodeur Morse', encodeDesc: 'Tape du texte et vois-le en Morse',
    decodeTitle: 'Morse → Décodeur Texte', decodeDesc: 'Colle du Morse pour le lire',
    tapTitle: 'Labo Tap', tapDesc: 'Tape pour envoyer du Morse !',
    listenTitle: 'Station d\'écoute', listenDesc: 'Écoute le code Morse en audio',
    microbitTitle: 'Labo micro:bit', microbitDesc: 'Connecte et communique via Bluetooth',
    challengeTitle: 'Zone Défi', challengeDesc: 'Teste tes compétences Morse !',
    helpTitle: 'Aide & Guide', helpDesc: 'Tout ce qu\'il faut savoir',
    play: 'Jouer', stop: 'Stop', send: 'Envoyer', copy: 'Copier', clear: 'Effacer',
    connect: 'Connecter', disconnect: 'Déconnecter', reset: 'Réinitialiser',
    speed: 'Vitesse (MPM)', frequency: 'Fréquence (Hz)',
    score: 'Score', streak: 'Série', best: 'Meilleur',
    start: 'Commencer', skip: 'Passer',
    ready: '📡 Labo Morse prêt !',
    langChanged: '🌐 Langue → Français',
    themeChanged: '🎨 Thème →',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous',
    t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    l_newb: '🟢 Débutant', l_explorer: '🔵 Explorateur', l_developer: '🟣 Développeur',
    logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    correct: '✅ Correct !', wrong: '❌ Réessaie !',
    tapHold: 'TAP', pressStart: 'Appuie sur Commencer !',
    // Help modal
    quickStart: '🚀 Démarrage Rapide',
    qs1: 'Ouvre l\'onglet <strong>Apprendre</strong> pour voir l\'alphabet Morse — clique sur une lettre pour l\'entendre !',
    qs2: 'Va dans <strong>Encoder</strong> — tape ton nom et appuie sur ▶ pour l\'entendre en Morse.',
    qs3: 'Essaie le <strong>Labo Tap</strong> — tap court = point, appui long = tiret. Tape SOS !',
    qs4: 'Utilise la <strong>Station d\'écoute</strong> pour régler la vitesse et la tonalité.',
    qs5: 'Connecte un vrai <strong>micro:bit</strong> via Bluetooth dans l\'onglet micro:bit.',
    qs6: 'Teste-toi dans la <strong>Zone Défi</strong> — quiz lettre, décodage mot, vitesse !',
    controls: '🎛️ Contrôles',
    hLang: 'Langue', hLangDesc: 'Change EN / FR / عربي depuis le menu déroulant',
    hTheme: 'Thème', hThemeDesc: '6 thèmes : Mosquée, Zellige, Andalous, Espace, Jungle, Robot',
    hLevel: 'Niveau', hLevelDesc: '🟢 Débutant · 🔵 Explorateur · 🟣 Développeur',
    hBle: 'BLE', hBleDesc: 'Nécessite Chrome/Edge. Le micro:bit doit avoir le firmware Morse',
    morseBasics: '📡 Bases du Morse',
    ditDesc: 'Dit — signal court (1 unité)',
    dahDesc: 'Dah — signal long (3 unités)',
    sosDesc: 'S = trois dits',
    oDesc: 'O = trois dahs',
    sosFullDesc: 'SOS = le signal Morse le plus célèbre !',
    keyboard: '⌨️ Raccourcis Clavier',
    kTabs: 'Changer d\'onglet',
    kConnect: 'Connecter / Déconnecter BLE',
    kClose: 'Fermer cette fenêtre d\'aide',
    about: 'ℹ️ À propos',
    aboutText: 'Labo Morse Enfants v1.2 — Une appli éducative pour apprendre le code Morse, se connecter au micro:bit via BLE, et maîtriser les fondamentaux de la communication radio. Fait avec ❤️ pour les jeunes apprenants.',
  },
  ar: {
    title: 'مختبر مورس للأطفال', subtitle: '📡 تعلّم · ✨ اطرق · 🔊 استمع · 🤖 اتصل',
    disconnected: 'غير متصل', connected: 'متصل',
    tabLearn: 'تعلّم', tabEncode: 'تشفير', tabDecode: 'فك تشفير', tabTap: 'طرق',
    tabListen: 'استمع', tabMicrobit: 'مايكروبت', tabChallenge: 'تحدي', tabHelp: 'مساعدة',
    learnTitle: 'مرجع شفرة مورس', learnDesc: 'انقر على أي حرف لسماعه!',
    newb: 'مبتدئ', explorer: 'مستكشف', developer: 'مطوّر',
    learnNewb: 'شفرة مورس مثل لغة سرية بالمصباح! تستخدم شيئين فقط: ومضات قصيرة (نقاط ·) وطويلة (شرطات —). SOS هي ··· ——— ··· وأنقذت آلاف الأرواح في البحر!',
    encodeTitle: 'نص ← مشفّر مورس', encodeDesc: 'اكتب نصاً وشاهده بشفرة مورس',
    decodeTitle: 'مورس ← نص مفكوك', decodeDesc: 'الصق شفرة مورس لقراءتها',
    tapTitle: 'مختبر الطرق', tapDesc: 'اطرق لإرسال شفرة مورس!',
    listenTitle: 'محطة الاستماع', listenDesc: 'اسمع شفرة مورس كصوت',
    microbitTitle: 'مختبر مايكروبت', microbitDesc: 'اتصل وتواصل عبر البلوتوث',
    challengeTitle: 'منطقة التحدي', challengeDesc: 'اختبر مهاراتك في مورس!',
    helpTitle: 'مساعدة ودليل', helpDesc: 'كل ما تحتاج معرفته',
    play: 'تشغيل', stop: 'إيقاف', send: 'إرسال', copy: 'نسخ', clear: 'مسح',
    connect: 'اتصال', disconnect: 'قطع', reset: 'إعادة',
    speed: 'السرعة', frequency: 'التردد',
    score: 'النقاط', streak: 'سلسلة', best: 'أفضل',
    start: 'ابدأ', skip: 'تخطي',
    ready: '📡 مختبر مورس جاهز!',
    langChanged: '🌐 اللغة ← العربية',
    themeChanged: '🎨 المظهر ←',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس',
    t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
    l_newb: '🟢 مبتدئ', l_explorer: '🔵 مستكشف', l_developer: '🟣 مطوّر',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    correct: '✅ صحيح!', wrong: '❌ حاول مرة أخرى!',
    tapHold: 'اطرق', pressStart: 'اضغط ابدأ!',
    // Help modal
    quickStart: '🚀 بداية سريعة',
    qs1: 'افتح تبويب <strong>تعلّم</strong> لرؤية أبجدية مورس — انقر على أي حرف لسماعه!',
    qs2: 'اذهب إلى <strong>تشفير</strong> — اكتب اسمك واضغط ▶ لسماعه بشفرة مورس.',
    qs3: 'جرّب <strong>مختبر الطرق</strong> — طرقة قصيرة = نقطة، ضغط طويل = شرطة. اطرق SOS!',
    qs4: 'استخدم <strong>محطة الاستماع</strong> لضبط السرعة ودرجة الصوت.',
    qs5: 'وصّل <strong>مايكروبت</strong> حقيقي عبر البلوتوث في تبويب مايكروبت.',
    qs6: 'اختبر نفسك في <strong>منطقة التحدي</strong> — اختبار حروف، فك كلمات، جولة سرعة!',
    controls: '🎛️ أدوات التحكم',
    hLang: 'اللغة', hLangDesc: 'غيّر EN / FR / عربي من القائمة المنسدلة',
    hTheme: 'المظهر', hThemeDesc: '٦ مظاهر: مسجد، زليج، أندلس، فضاء، أدغال، روبوت',
    hLevel: 'المستوى', hLevelDesc: '🟢 مبتدئ · 🔵 مستكشف · 🟣 مطوّر',
    hBle: 'بلوتوث', hBleDesc: 'يتطلب Chrome/Edge. المايكروبت يحتاج برنامج مورس الثابت',
    morseBasics: '📡 أساسيات مورس',
    ditDesc: 'نقطة — إشارة قصيرة (وحدة واحدة)',
    dahDesc: 'شرطة — إشارة طويلة (٣ وحدات)',
    sosDesc: 'S = ثلاث نقاط',
    oDesc: 'O = ثلاث شرطات',
    sosFullDesc: 'SOS = أشهر إشارة مورس في العالم!',
    keyboard: '⌨️ اختصارات لوحة المفاتيح',
    kTabs: 'التبديل بين التبويبات',
    kConnect: 'اتصال / قطع البلوتوث',
    kClose: 'إغلاق نافذة المساعدة',
    about: 'ℹ️ حول التطبيق',
    aboutText: 'مختبر مورس للأطفال v1.2 — تطبيق تعليمي ممتع لتعلم شفرة مورس، والاتصال بالمايكروبت عبر البلوتوث، وإتقان أساسيات الاتصال اللاسلكي. صُنع بـ ❤️ للمتعلمين الصغار.',
  }
};

let currentLang = 'en';
let currentLevel = 'newb';

function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang];
  if (!s) return;
  // Keys that contain HTML markup — use innerHTML
  const htmlKeys = new Set(['qs1','qs2','qs3','qs4','qs5','qs6']);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (s[k] != null) {
      if (htmlKeys.has(k)) el.innerHTML = s[k];
      else el.textContent = s[k];
    }
  });
  document.querySelectorAll('[data-i18n-opt]').forEach(opt => {
    const k = opt.dataset.i18nOpt;
    if (s[k] != null) opt.textContent = s[k];
  });
  document.title = `${s.title} — Workshop DIY`;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect');
  if (sel) sel.value = lang;
  log(s.langChanged, 'info');
}

function setLevel(level) {
  currentLevel = level;
  document.querySelectorAll('.level-box').forEach(el => {
    el.classList.toggle('visible', el.dataset.level === level);
  });
  const sel = $('levelSelect');
  if (sel) sel.value = level;
}

/* ═══════════════════════════════════════════════════════════════════
   THEMES
   ═══════════════════════════════════════════════════════════════════ */

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  const sel = $('themeSelect');
  if (sel) sel.value = name;
  const s = LANG[currentLang];
  const label = s['t_' + name] || name;
  log(`${s.themeChanged} ${label}`, 'info');
}

/* ═══════════════════════════════════════════════════════════════════
   TABS
   ═══════════════════════════════════════════════════════════════════ */

function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const page = $(`page-${btn.dataset.tab}`);
      if (page) page.classList.add('active');
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════
   LOG
   ═══════════════════════════════════════════════════════════════════ */

const logContainer = $('logContainer');

function log(msg, type = 'info') {
  if (!logContainer) return;
  const d = document.createElement('div');
  d.className = `log-line ${type}`;
  d.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  logContainer.appendChild(d);
  logContainer.scrollTop = logContainer.scrollHeight;
  while (logContainer.children.length > 300) logContainer.removeChild(logContainer.firstChild);
}

function clearLog() {
  if (logContainer) logContainer.innerHTML = '';
  log(LANG[currentLang].logCleared);
}

async function copyLog() {
  if (!logContainer) return;
  const t = Array.from(logContainer.children).map(d => d.textContent).join('\n');
  try { await navigator.clipboard.writeText(t); showToast(LANG[currentLang].copied, 'success'); }
  catch { showToast(LANG[currentLang].copyFail, 'error'); }
}

/* ═══════════════════════════════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════════════════════════════ */

function showToast(message, type = 'info', duration = 3000) {
  const container = $('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-show'));
  setTimeout(() => {
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/* ═══════════════════════════════════════════════════════════════════
   STATUS
   ═══════════════════════════════════════════════════════════════════ */

let isConnected = false;

function setStatus(connected) {
  isConnected = connected;
  const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang];
  if (txt) txt.textContent = connected ? s.connected : s.disconnected;
  if (pill) pill.classList.toggle('connected', connected);
  // Enable/disable BLE buttons
  document.querySelectorAll('[id$="BleBtn"], #bleSendBtn').forEach(btn => {
    btn.disabled = !connected;
  });
  const cb = $('connectBtn'), db = $('disconnectBtn');
  if (cb) cb.disabled = connected;
  if (db) db.disabled = !connected;
}

/* ═══════════════════════════════════════════════════════════════════
   WEB AUDIO — Morse Beep Engine
   ═══════════════════════════════════════════════════════════════════ */

let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function beep(freq, durationMs) {
  return new Promise(resolve => {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0.3;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => { osc.stop(); resolve(); }, durationMs);
  });
}

function wpmToUnit(wpm) {
  // PARIS standard: 50 units per word
  return 1200 / wpm; // ms per dit
}

async function playMorseAudio(morseStr, wpm = 15, freq = 700, onElement = null) {
  const unit = wpmToUnit(wpm);
  const lamp = $('flasherLamp');

  for (let i = 0; i < morseStr.length; i++) {
    if (playbackAborted) break;
    const ch = morseStr[i];
    if (ch === '.' || ch === '·') {
      if (lamp) lamp.classList.add('on');
      if (onElement) onElement(i, true);
      await beep(freq, unit);
      if (lamp) lamp.classList.remove('on');
      if (onElement) onElement(i, false);
      await sleep(unit); // gap between parts
    } else if (ch === '-' || ch === '—') {
      if (lamp) lamp.classList.add('on');
      if (onElement) onElement(i, true);
      await beep(freq, unit * 3);
      if (lamp) lamp.classList.remove('on');
      if (onElement) onElement(i, false);
      await sleep(unit);
    } else if (ch === '/') {
      await sleep(unit * 7);
    } else if (ch === ' ') {
      await sleep(unit * 3);
    }
  }
  if (lamp) lamp.classList.remove('on');
}

let playbackAborted = false;
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ═══════════════════════════════════════════════════════════════════
   MORSE CHART (Learn Tab)
   ═══════════════════════════════════════════════════════════════════ */

function buildMorseChart() {
  const container = $('morseChart');
  if (!container) return;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
  chars.forEach(ch => {
    const code = MORSE_TABLE[ch];
    const div = document.createElement('div');
    div.className = 'morse-char';
    div.innerHTML = `<span class="char-letter">${ch}</span><span class="char-code">${code.replace(/\./g, '·').replace(/-/g, '—')}</span>`;
    div.addEventListener('click', async () => {
      div.classList.add('playing');
      await playMorseAudio(code, 15, 700);
      div.classList.remove('playing');
    });
    container.appendChild(div);
  });
}

/* ═══════════════════════════════════════════════════════════════════
   ENCODER TAB
   ═══════════════════════════════════════════════════════════════════ */

function initEncoder() {
  const input = $('encodeInput');
  const output = $('encodeMorseText');
  const speedSlider = $('encodeSpeed');
  const speedVal = $('encodeSpeedVal');
  const playBtn = $('encodePlayBtn');
  const copyBtn = $('encodeCopyBtn');
  const bleBtn = $('encodeBleBtn');

  if (input) input.addEventListener('input', () => {
    const morse = textToMorse(input.value);
    if (output) output.textContent = morse.replace(/\./g, '·').replace(/-/g, '—') || '···  ———  ···';
  });

  if (speedSlider) speedSlider.addEventListener('input', () => {
    if (speedVal) speedVal.textContent = speedSlider.value + ' WPM';
  });

  if (playBtn) playBtn.addEventListener('click', async () => {
    playbackAborted = false;
    const morse = textToMorse(input?.value || 'SOS');
    const wpm = parseInt(speedSlider?.value || 15);
    playBtn.disabled = true;
    log(`▶ Playing: ${input?.value || 'SOS'}`, 'tx');
    await playMorseAudio(morse, wpm);
    playBtn.disabled = false;
  });

  if (copyBtn) copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(output?.textContent || '');
      showToast(LANG[currentLang].copied, 'success');
    } catch { showToast(LANG[currentLang].copyFail, 'error'); }
  });

  if (bleBtn) bleBtn.addEventListener('click', () => {
    const morse = textToMorse(input?.value || '');
    sendBle(morse);
  });
}

/* ═══════════════════════════════════════════════════════════════════
   DECODER TAB
   ═══════════════════════════════════════════════════════════════════ */

function initDecoder() {
  const input = $('decodeInput');
  const output = $('decodeResultText');
  const playBtn = $('decodePlayBtn');

  if (input) input.addEventListener('input', () => {
    const text = morseToText(input.value);
    if (output) output.textContent = text || '...';
  });

  if (playBtn) playBtn.addEventListener('click', async () => {
    playbackAborted = false;
    const morse = input?.value?.replace(/·/g, '.').replace(/—/g, '-') || '';
    playBtn.disabled = true;
    await playMorseAudio(morse, 15, 700);
    playBtn.disabled = false;
  });
}

/* ═══════════════════════════════════════════════════════════════════
   TAP LAB
   ═══════════════════════════════════════════════════════════════════ */

function initTapLab() {
  const btn = $('tapBtn');
  const morseOut = $('tapMorseOutput');
  const textOut = $('tapDecodedOutput');
  const waveform = $('tapWaveform');
  const dotInd = $('tapDotIndicator');
  const dashInd = $('tapDashIndicator');
  const clearBtn = $('tapClearBtn');
  const bleBtn = $('tapBleBtn');

  let tapStart = 0;
  let tapTimer = null;
  let wordTimer = null;
  let currentLetterMorse = '';
  let fullMorse = '';
  let fullText = '';

  const DIT_THRESHOLD = 200;
  const LETTER_GAP = 600;
  const WORD_GAP = 1400;

  function commitLetter() {
    if (!currentLetterMorse) return;
    const ch = REVERSE_MORSE[currentLetterMorse] || '?';
    fullText += ch;
    fullMorse += ' ';
    currentLetterMorse = '';
    if (textOut) textOut.textContent = fullText || '...';
    if (morseOut) morseOut.textContent = fullMorse.replace(/\./g, '·').replace(/-/g, '—') || '···';
  }

  function commitWord() {
    commitLetter();
    fullText += ' ';
    fullMorse += '/ ';
    if (textOut) textOut.textContent = fullText || '...';
    if (morseOut) morseOut.textContent = fullMorse.replace(/\./g, '·').replace(/-/g, '—') || '···';
  }

  function addWaveBar(type) {
    if (!waveform) return;
    const bar = document.createElement('div');
    bar.className = `wave-bar ${type}`;
    waveform.appendChild(bar);
    waveform.scrollLeft = waveform.scrollWidth;
  }

  function handleDown(e) {
    e.preventDefault();
    tapStart = Date.now();
    btn.classList.add('pressed');
    clearTimeout(tapTimer);
    clearTimeout(wordTimer);
    // Start audio
    getAudioCtx();
  }

  function handleUp(e) {
    e.preventDefault();
    if (!tapStart) return;
    const dur = Date.now() - tapStart;
    tapStart = 0;
    btn.classList.remove('pressed');

    if (dur < DIT_THRESHOLD) {
      // Dit
      currentLetterMorse += '.';
      fullMorse += '.';
      beep(700, 80);
      dotInd.classList.add('active');
      setTimeout(() => dotInd.classList.remove('active'), 200);
      addWaveBar('dot');
    } else {
      // Dah
      currentLetterMorse += '-';
      fullMorse += '-';
      beep(700, 200);
      dashInd.classList.add('active');
      setTimeout(() => dashInd.classList.remove('active'), 300);
      addWaveBar('dash');
    }

    if (morseOut) morseOut.textContent = fullMorse.replace(/\./g, '·').replace(/-/g, '—') || '···';

    // Set timers for letter/word gaps
    tapTimer = setTimeout(() => {
      commitLetter();
      addWaveBar('gap');
    }, LETTER_GAP);

    wordTimer = setTimeout(() => {
      commitWord();
    }, WORD_GAP);

    // Ripple effect
    const ripple = $('tapRipple');
    if (ripple) {
      ripple.classList.remove('animate');
      void ripple.offsetWidth;
      ripple.classList.add('animate');
    }
  }

  if (btn) {
    btn.addEventListener('mousedown', handleDown);
    btn.addEventListener('mouseup', handleUp);
    btn.addEventListener('mouseleave', handleUp);
    btn.addEventListener('touchstart', handleDown, { passive: false });
    btn.addEventListener('touchend', handleUp, { passive: false });
  }

  if (clearBtn) clearBtn.addEventListener('click', () => {
    currentLetterMorse = '';
    fullMorse = '';
    fullText = '';
    if (morseOut) morseOut.textContent = '···';
    if (textOut) textOut.textContent = '...';
    if (waveform) waveform.innerHTML = '';
  });

  if (bleBtn) bleBtn.addEventListener('click', () => {
    sendBle(fullMorse);
  });
}

/* ═══════════════════════════════════════════════════════════════════
   LISTEN STATION
   ═══════════════════════════════════════════════════════════════════ */

function initListenStation() {
  const input = $('listenInput');
  const freqSlider = $('listenFreq');
  const freqVal = $('listenFreqVal');
  const speedSlider = $('listenSpeed');
  const speedVal = $('listenSpeedVal');
  const playBtn = $('listenPlayBtn');
  const stopBtn = $('listenStopBtn');
  const timeline = $('listenTimeline');

  if (freqSlider) freqSlider.addEventListener('input', () => {
    if (freqVal) freqVal.textContent = freqSlider.value + ' Hz';
  });
  if (speedSlider) speedSlider.addEventListener('input', () => {
    if (speedVal) speedVal.textContent = speedSlider.value + ' WPM';
  });

  function buildTimeline(morse) {
    if (!timeline) return;
    timeline.innerHTML = '';
    for (const ch of morse) {
      const el = document.createElement('div');
      if (ch === '.' || ch === '·') el.className = 'tl-dot';
      else if (ch === '-' || ch === '—') el.className = 'tl-dash';
      else if (ch === '/') el.className = 'tl-word-space';
      else if (ch === ' ') el.className = 'tl-space';
      else continue;
      timeline.appendChild(el);
    }
  }

  if (playBtn) playBtn.addEventListener('click', async () => {
    playbackAborted = false;
    const text = input?.value || 'SOS';
    const morse = textToMorse(text);
    const freq = parseInt(freqSlider?.value || 700);
    const wpm = parseInt(speedSlider?.value || 15);
    buildTimeline(morse);
    playBtn.disabled = true;
    log(`🔊 Playing: ${text}`, 'tx');

    const tlElements = timeline?.children;
    await playMorseAudio(morse, wpm, freq, (idx, active) => {
      if (tlElements && tlElements[idx]) {
        tlElements[idx].classList.toggle('active', active);
      }
    });
    playBtn.disabled = false;
  });

  if (stopBtn) stopBtn.addEventListener('click', () => {
    playbackAborted = true;
  });
}

/* ═══════════════════════════════════════════════════════════════════
   BLE — Based on bit-playground patterns
   ═══════════════════════════════════════════════════════════════════ */

const UART_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const BLE_MTU_PAYLOAD = 20;

let btDevice = null;
let btServer = null;
let uartService = null;
let notifyChar = null;
let writeChar = null;
let reconnectAttempts = 0;
const MAX_RECONNECT = 3;

// BLE RX buffer for incoming Morse from micro:bit
let bleRxBuffer = '';
let bleRxTimer = null;

function onUartNotification(event) {
  const dv = event.target.value;
  let text = '';
  for (let i = 0; i < dv.byteLength; i++) {
    text += String.fromCharCode(dv.getUint8(i));
  }
  log(`📥 RX: ${text}`, 'rx');

  // Handle incoming dots/dashes from micro:bit buttons
  for (const ch of text) {
    if (ch === '.' || ch === '-') {
      bleRxBuffer += ch;
      clearTimeout(bleRxTimer);
      bleRxTimer = setTimeout(() => {
        // Commit letter after gap
        const decoded = REVERSE_MORSE[bleRxBuffer] || '?';
        const rxMorse = $('bleRxMorse');
        const rxText = $('bleRxText');
        if (rxMorse) rxMorse.textContent = (rxMorse.textContent === '—' ? '' : rxMorse.textContent + ' ') + bleRxBuffer.replace(/\./g, '·').replace(/-/g, '—');
        if (rxText) rxText.textContent = (rxText.textContent === '—' ? '' : rxText.textContent) + decoded;
        bleRxBuffer = '';
      }, 800);
    }
  }

  // Also handle sim LED if on microbit tab
  for (const ch of text) {
    if (ch === '.' || ch === '-') simFlashLed(ch);
  }
}

function sendBle(data) {
  if (!writeChar || !isConnected) {
    log('TX blocked (not connected)', 'error');
    showToast('Not connected to micro:bit', 'error');
    return;
  }
  const enc = new TextEncoder();
  const bytes = enc.encode(data + '\n');

  if (bytes.byteLength <= BLE_MTU_PAYLOAD) {
    writeChar.writeValue(bytes)
      .then(() => log(`📤 TX: ${data}`, 'tx'))
      .catch(err => log(`TX error: ${err}`, 'error'));
  } else {
    let offset = 0;
    const chunks = [];
    while (offset < bytes.byteLength) {
      chunks.push(bytes.slice(offset, Math.min(offset + BLE_MTU_PAYLOAD, bytes.byteLength)));
      offset += BLE_MTU_PAYLOAD;
    }
    let chain = Promise.resolve();
    chunks.forEach(chunk => { chain = chain.then(() => writeChar.writeValue(chunk)); });
    chain
      .then(() => log(`📤 TX: ${data} (${chunks.length} chunks)`, 'tx'))
      .catch(err => log(`TX error: ${err}`, 'error'));
  }
}

async function bleConnect() {
  try {
    if (!navigator.bluetooth) {
      log('Web Bluetooth not available. Use Chrome or Edge.', 'error');
      showToast('Web Bluetooth not available', 'error');
      return;
    }

    log('Requesting micro:bit device...', 'info');

    btDevice = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'BBC micro:bit' }],
      optionalServices: [UART_SERVICE_UUID]
    });

    btDevice.addEventListener('gattserverdisconnected', () => {
      log('Device disconnected unexpectedly', 'error');
      setStatus(false);
      attemptReconnect();
    });

    log('Connecting GATT...', 'info');
    btServer = await btDevice.gatt.connect();

    log('Getting UART service...', 'info');
    uartService = await btServer.getPrimaryService(UART_SERVICE_UUID);

    const chars = await uartService.getCharacteristics();
    notifyChar = null;
    writeChar = null;

    let c2 = null, c3 = null;
    for (const ch of chars) {
      const id = ch.uuid.toLowerCase();
      if (id.includes('6e400002')) c2 = ch;
      else if (id.includes('6e400003')) c3 = ch;
    }

    const isNotifier = ch => ch && (ch.properties.notify || ch.properties.indicate);
    const isWriter = ch => ch && (ch.properties.write || ch.properties.writeWithoutResponse);

    if (isNotifier(c3)) notifyChar = c3;
    if (isWriter(c2)) writeChar = c2;

    if (!notifyChar || !writeChar) {
      for (const ch of chars) {
        if (!notifyChar && isNotifier(ch)) notifyChar = ch;
        if (!writeChar && isWriter(ch)) writeChar = ch;
      }
    }

    if (!notifyChar || !writeChar) {
      log('UART characteristics not found', 'error');
      setStatus(false);
      return;
    }

    await notifyChar.startNotifications();
    notifyChar.addEventListener('characteristicvaluechanged', onUartNotification);

    const name = $('deviceName');
    if (name && btDevice.name) name.textContent = btDevice.name;

    setStatus(true);
    log('✅ Connected to ' + (btDevice.name || 'micro:bit'), 'success');
    showToast('Connected to micro:bit!', 'success');

    sendBle('HELLO');
  } catch (err) {
    console.error(err);
    log('Connection failed: ' + err, 'error');
    setStatus(false);
  }
}

let userDisconnected = false;

async function bleDisconnect() {
  userDisconnected = true;
  try {
    if (notifyChar) try { await notifyChar.stopNotifications(); } catch {}
    if (btDevice && btDevice.gatt && btDevice.gatt.connected) btDevice.gatt.disconnect();
  } catch (e) { console.error(e); }
  finally {
    log('Disconnected', 'info');
    setStatus(false);
    showToast('Disconnected', 'info');
  }
}

async function attemptReconnect() {
  if (userDisconnected || !btDevice || reconnectAttempts >= MAX_RECONNECT) {
    reconnectAttempts = 0;
    return;
  }
  reconnectAttempts++;
  log(`Reconnecting (${reconnectAttempts}/${MAX_RECONNECT})...`, 'info');
  await sleep(2000);
  try {
    btServer = await btDevice.gatt.connect();
    uartService = await btServer.getPrimaryService(UART_SERVICE_UUID);
    const chars = await uartService.getCharacteristics();
    let c2 = null, c3 = null;
    for (const ch of chars) {
      const id = ch.uuid.toLowerCase();
      if (id.includes('6e400002')) c2 = ch;
      else if (id.includes('6e400003')) c3 = ch;
    }
    const isNotifier = ch => ch && (ch.properties.notify || ch.properties.indicate);
    const isWriter = ch => ch && (ch.properties.write || ch.properties.writeWithoutResponse);
    notifyChar = isNotifier(c3) ? c3 : null;
    writeChar = isWriter(c2) ? c2 : null;
    if (!notifyChar || !writeChar) { attemptReconnect(); return; }
    await notifyChar.startNotifications();
    notifyChar.addEventListener('characteristicvaluechanged', onUartNotification);
    setStatus(true);
    reconnectAttempts = 0;
    log('Reconnected!', 'success');
  } catch { attemptReconnect(); }
}

function initBLE() {
  const connectBtn = $('connectBtn');
  const disconnectBtn = $('disconnectBtn');
  const sendBtn = $('bleSendBtn');
  const sendInput = $('bleSendInput');
  const copyFw = $('copyFirmwareBtn');

  if (connectBtn) connectBtn.addEventListener('click', () => { userDisconnected = false; bleConnect(); });
  if (disconnectBtn) disconnectBtn.addEventListener('click', bleDisconnect);

  if (sendBtn && sendInput) sendBtn.addEventListener('click', () => {
    const text = sendInput.value.trim();
    if (!text) return;
    const morse = textToMorse(text);
    sendBle(morse);
    log(`📤 Sent: "${text}" → ${morse}`, 'tx');
    // Also play on sim
    simPlayMorse(morse);
  });

  if (copyFw) copyFw.addEventListener('click', async () => {
    const code = $('firmwareCode')?.textContent || '';
    try { await navigator.clipboard.writeText(code); showToast(LANG[currentLang].copied, 'success'); }
    catch { showToast(LANG[currentLang].copyFail, 'error'); }
  });
}

/* ═══════════════════════════════════════════════════════════════════
   MICRO:BIT SIMULATOR
   ═══════════════════════════════════════════════════════════════════ */

const LED_PATTERNS = {
  '.': [ // small diamond
    [0,0,0,0,0],
    [0,0,1,0,0],
    [0,1,0,1,0],
    [0,0,1,0,0],
    [0,0,0,0,0]
  ],
  '-': [ // big diamond
    [0,0,1,0,0],
    [0,1,0,1,0],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,0,1,0,0]
  ],
  'clear': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ]
};

function setLedMatrix(pattern) {
  const leds = document.querySelectorAll('#ledMatrix .led');
  leds.forEach(led => {
    const r = parseInt(led.dataset.r);
    const c = parseInt(led.dataset.c);
    if (pattern[r] && pattern[r][c]) {
      led.classList.add('on');
      led.classList.remove('off');
    } else {
      led.classList.remove('on');
      led.classList.add('off');
    }
  });
}

async function simFlashLed(ch) {
  const pat = LED_PATTERNS[ch] || LED_PATTERNS['clear'];
  setLedMatrix(pat);
  const dur = ch === '-' ? 400 : 150;
  beep(800, dur);
  await sleep(dur + 50);
  setLedMatrix(LED_PATTERNS['clear']);
}

async function simPlayMorse(morse) {
  for (const ch of morse) {
    if (ch === '.' || ch === '-') {
      await simFlashLed(ch);
      await sleep(100);
    } else if (ch === ' ') {
      await sleep(300);
    } else if (ch === '/') {
      await sleep(600);
    }
  }
}

function initSimulator() {
  const btnA = $('simBtnAClick');
  const btnB = $('simBtnBClick');
  const resetBtn = $('simResetBtn');
  const svgA = $('simBtnA');
  const svgB = $('simBtnB');

  async function simDit() {
    await simFlashLed('.');
    // If connected, also send via BLE
    if (isConnected) sendBle('.');
    const rxMorse = $('bleRxMorse');
    if (rxMorse) rxMorse.textContent = (rxMorse.textContent === '—' ? '' : rxMorse.textContent) + '·';
  }

  async function simDah() {
    await simFlashLed('-');
    if (isConnected) sendBle('-');
    const rxMorse = $('bleRxMorse');
    if (rxMorse) rxMorse.textContent = (rxMorse.textContent === '—' ? '' : rxMorse.textContent) + '—';
  }

  if (btnA) btnA.addEventListener('click', simDit);
  if (btnB) btnB.addEventListener('click', simDah);
  if (svgA) svgA.addEventListener('click', simDit);
  if (svgB) svgB.addEventListener('click', simDah);

  if (resetBtn) resetBtn.addEventListener('click', () => {
    setLedMatrix(LED_PATTERNS['clear']);
    const rxMorse = $('bleRxMorse');
    const rxText = $('bleRxText');
    if (rxMorse) rxMorse.textContent = '—';
    if (rxText) rxText.textContent = '—';
  });
}

/* ═══════════════════════════════════════════════════════════════════
   CHALLENGE ZONE
   ═══════════════════════════════════════════════════════════════════ */

let challengeScore = 0;
let challengeStreak = 0;
let challengeBest = 0;
let challengeMode = 'letter';
let challengeAnswer = '';
let challengeActive = false;
let challengeTimerInterval = null;

const CHALLENGE_WORDS = ['SOS', 'HELP', 'HI', 'BYE', 'OK', 'YES', 'NO', 'GO', 'STOP', 'CAT', 'DOG', 'RUN', 'FUN', 'CODE', 'HACK', 'BIT', 'LED', 'IOT', 'APP', 'BLE'];

function initChallenge() {
  const startBtn = $('challengeStartBtn');
  const skipBtn = $('challengeSkipBtn');
  const modeButtons = document.querySelectorAll('.challenge-mode-btn');

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      challengeMode = btn.dataset.mode;
    });
  });

  if (startBtn) startBtn.addEventListener('click', startChallenge);
  if (skipBtn) skipBtn.addEventListener('click', () => nextChallenge());

  // Load saved scores
  try {
    challengeBest = parseInt(localStorage.getItem('morseBest') || '0');
    const bestEl = $('bestVal');
    if (bestEl) bestEl.textContent = challengeBest;
  } catch {}
}

function startChallenge() {
  challengeActive = true;
  challengeScore = 0;
  challengeStreak = 0;
  updateScoreDisplay();
  $('challengeStartBtn').disabled = true;
  $('challengeSkipBtn').disabled = false;
  nextChallenge();
}

function nextChallenge() {
  const morseEl = $('challengeMorse');
  const hintEl = $('challengeHint');
  const optionsEl = $('challengeOptions');
  const feedbackEl = $('challengeFeedback');
  const timerEl = $('challengeTimer');

  if (feedbackEl) feedbackEl.textContent = '';
  if (optionsEl) optionsEl.innerHTML = '';
  if (timerEl) timerEl.textContent = '';
  clearInterval(challengeTimerInterval);

  if (challengeMode === 'letter') {
    // Random letter quiz
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const correct = letters[Math.floor(Math.random() * letters.length)];
    challengeAnswer = correct;
    const morse = MORSE_TABLE[correct];
    if (morseEl) morseEl.textContent = morse.replace(/\./g, '·').replace(/-/g, '—');
    if (hintEl) hintEl.textContent = 'Which letter is this?';

    // Generate options (4 choices)
    const options = new Set([correct]);
    while (options.size < 4) {
      options.add(letters[Math.floor(Math.random() * letters.length)]);
    }
    const shuffled = [...options].sort(() => Math.random() - 0.5);
    shuffled.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'challenge-opt-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => checkAnswer(opt, btn));
      optionsEl.appendChild(btn);
    });

  } else if (challengeMode === 'word') {
    const word = CHALLENGE_WORDS[Math.floor(Math.random() * CHALLENGE_WORDS.length)];
    challengeAnswer = word;
    const morse = textToMorse(word);
    if (morseEl) morseEl.textContent = morse.replace(/\./g, '·').replace(/-/g, '—');
    if (hintEl) hintEl.textContent = 'Decode this word! Type your answer:';

    const inputDiv = document.createElement('div');
    inputDiv.className = 'input-row';
    inputDiv.style.justifyContent = 'center';
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.placeholder = 'Your answer...';
    inp.style.maxWidth = '200px';
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        checkAnswer(inp.value.toUpperCase().trim(), null);
      }
    });
    const submitBtn = document.createElement('button');
    submitBtn.className = 'primary';
    submitBtn.textContent = '✓';
    submitBtn.addEventListener('click', () => checkAnswer(inp.value.toUpperCase().trim(), null));
    inputDiv.appendChild(inp);
    inputDiv.appendChild(submitBtn);
    optionsEl.appendChild(inputDiv);
    inp.focus();

  } else if (challengeMode === 'speed') {
    // Timed letter quiz — 10 seconds
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const correct = letters[Math.floor(Math.random() * letters.length)];
    challengeAnswer = correct;
    const morse = MORSE_TABLE[correct];
    if (morseEl) morseEl.textContent = morse.replace(/\./g, '·').replace(/-/g, '—');
    if (hintEl) hintEl.textContent = '⚡ Quick! Which letter?';

    let timeLeft = 10;
    if (timerEl) timerEl.textContent = `⏰ ${timeLeft}s`;
    challengeTimerInterval = setInterval(() => {
      timeLeft--;
      if (timerEl) timerEl.textContent = `⏰ ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(challengeTimerInterval);
        const s = LANG[currentLang];
        if (feedbackEl) feedbackEl.textContent = s.timeUp || '⏰ Time\'s up!';
        feedbackEl.style.color = '#f87171';
        challengeStreak = 0;
        updateScoreDisplay();
        setTimeout(nextChallenge, 1500);
      }
    }, 1000);

    const options = new Set([correct]);
    while (options.size < 4) options.add(letters[Math.floor(Math.random() * letters.length)]);
    [...options].sort(() => Math.random() - 0.5).forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'challenge-opt-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => { clearInterval(challengeTimerInterval); checkAnswer(opt, btn); });
      optionsEl.appendChild(btn);
    });

  } else if (challengeMode === 'sos') {
    if (morseEl) morseEl.textContent = '? ? ?';
    if (hintEl) hintEl.textContent = 'Tap the SOS pattern below! (··· ——— ···)';

    const inputDiv = document.createElement('div');
    inputDiv.className = 'input-row';
    inputDiv.style.justifyContent = 'center';
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.placeholder = '... --- ...';
    inp.style.maxWidth = '200px';
    inp.style.fontFamily = "'JetBrains Mono', monospace";
    const submitBtn = document.createElement('button');
    submitBtn.className = 'primary';
    submitBtn.textContent = '🆘 Check';
    submitBtn.addEventListener('click', () => {
      const val = inp.value.replace(/·/g, '.').replace(/—/g, '-').replace(/\s+/g, ' ').trim();
      const isSos = val === '... --- ...' || val === '...---...' || morseToText(val).trim() === 'SOS';
      checkAnswer(isSos ? 'SOS' : val, null);
    });
    challengeAnswer = 'SOS';
    inputDiv.appendChild(inp);
    inputDiv.appendChild(submitBtn);
    optionsEl.appendChild(inputDiv);
    inp.focus();
  }
}

function checkAnswer(answer, btnEl) {
  const feedbackEl = $('challengeFeedback');
  const s = LANG[currentLang];

  if (answer === challengeAnswer) {
    challengeScore += (challengeMode === 'speed' ? 20 : 10);
    challengeStreak++;
    if (challengeScore > challengeBest) {
      challengeBest = challengeScore;
      try { localStorage.setItem('morseBest', challengeBest); } catch {}
    }
    if (feedbackEl) {
      feedbackEl.textContent = challengeStreak >= 3 ? (s.awesome || '🔥 Awesome streak!') : (s.correct || '✅ Correct!');
      feedbackEl.style.color = '#86efac';
    }
    if (btnEl) btnEl.classList.add('correct');
    beep(880, 150);
  } else {
    challengeStreak = 0;
    if (feedbackEl) {
      feedbackEl.textContent = `${s.wrong || '❌ Try again!'} → ${challengeAnswer}`;
      feedbackEl.style.color = '#fca5a5';
    }
    if (btnEl) btnEl.classList.add('wrong');
    beep(220, 300);
  }

  updateScoreDisplay();
  // Disable all option buttons
  document.querySelectorAll('.challenge-opt-btn').forEach(b => b.disabled = true);

  setTimeout(nextChallenge, 1500);
}

function updateScoreDisplay() {
  const scoreEl = $('scoreVal');
  const streakEl = $('streakVal');
  const bestEl = $('bestVal');
  if (scoreEl) scoreEl.textContent = challengeScore;
  if (streakEl) streakEl.textContent = challengeStreak;
  if (bestEl) bestEl.textContent = challengeBest;
}

/* ═══════════════════════════════════════════════════════════════════
   HELP — GLOSSARY
   ═══════════════════════════════════════════════════════════════════ */

function buildGlossary() {
  const container = $('glossaryContent');
  if (!container) return;
  const terms = [
    ['Dit (·)', 'Short signal — the basic unit of Morse code'],
    ['Dah (—)', 'Long signal — 3x the length of a dit'],
    ['WPM', 'Words Per Minute — speed measurement using "PARIS" as reference word'],
    ['Farnsworth', 'Timing method that slows gaps between characters for learners'],
    ['CW', 'Continuous Wave — the radio mode used for Morse transmission'],
    ['SOS', '··· ——— ··· — international distress signal, not an acronym'],
    ['BLE', 'Bluetooth Low Energy — short-range wireless for IoT devices'],
    ['UART', 'Universal Async Receiver/Transmitter — serial communication protocol'],
    ['NUS', 'Nordic UART Service — BLE serial protocol used by micro:bit'],
    ['GATT', 'Generic Attribute Profile — BLE data exchange standard'],
    ['MTU', 'Maximum Transmission Unit — max data per BLE packet (usually 20 bytes)'],
    ['Encoding', 'Converting data to another format — Morse is encoding, NOT encryption'],
  ];
  terms.forEach(([term, def]) => {
    const item = document.createElement('div');
    item.className = 'glossary-item';
    item.innerHTML = `<div class="glossary-term">${term}</div><div class="glossary-def">${def}</div>`;
    container.appendChild(item);
  });
}

/* ═══════════════════════════════════════════════════════════════════
   LOGO SVG
   ═══════════════════════════════════════════════════════════════════ */

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" role="img" aria-label="Morse Kids Lab">
  <defs>
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:var(--accent)"/>
      <stop offset="100%" style="stop-color:var(--accent2)"/>
    </linearGradient>
  </defs>
  <rect x="4" y="4" width="72" height="72" rx="16" fill="none" stroke="url(#logoGrad)" stroke-width="2" opacity=".4"/>
  <circle cx="22" cy="40" r="5" fill="var(--accent)"/>
  <circle cx="40" cy="40" r="5" fill="var(--accent)"/>
  <circle cx="58" cy="40" r="5" fill="var(--accent)"/>
  <rect x="14" cy="54" y="52" width="20" height="6" rx="3" fill="var(--accent2)"/>
  <rect x="40" y="52" width="28" height="6" rx="3" fill="var(--accent2)"/>
  <text x="40" y="26" text-anchor="middle" font-size="11" font-family="var(--font-h)" fill="var(--accent)" font-weight="700">MORSE</text>
</svg>`;

/* ═══════════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════════ */

function init() {
  // Logo
  const lw = $('logoWrap');
  if (lw) lw.innerHTML = LOGO_SVG;

  // Lang/Theme/Level
  const langSel = $('langSelect');
  if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));
  const themeSel = $('themeSelect');
  if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));
  const levelSel = $('levelSelect');
  if (levelSel) levelSel.addEventListener('change', () => setLevel(levelSel.value));

  // Log buttons
  const clb = $('clearLogBtn'), cpb = $('copyLogBtn');
  if (clb) clb.onclick = clearLog;
  if (cpb) cpb.onclick = copyLog;

  // Initialize all modules
  initTabs();
  buildMorseChart();
  initEncoder();
  initDecoder();
  initTapLab();
  initListenStation();
  initBLE();
  initSimulator();
  initChallenge();
  buildGlossary();

  // Set initial level
  setLevel('newb');

  // Ready
  log(LANG[currentLang].ready, 'success');

  // Help FAB + Modal
  initHelpModal();

  // Keyboard shortcuts
  initKeyboardShortcuts();
}

/* ═══════════════════════════════════════════════════════════════════
   HELP MODAL
   ═══════════════════════════════════════════════════════════════════ */

function initHelpModal() {
  const fab = $('fabHelp');
  const modal = $('helpModal');
  const closeBtn = $('helpModalClose');

  function openHelp() {
    if (modal) modal.classList.add('visible');
  }
  function closeHelp() {
    if (modal) modal.classList.remove('visible');
  }

  if (fab) fab.addEventListener('click', openHelp);
  if (closeBtn) closeBtn.addEventListener('click', closeHelp);

  // Click outside to close
  if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) closeHelp();
  });
}

/* ═══════════════════════════════════════════════════════════════════
   KEYBOARD SHORTCUTS
   ═══════════════════════════════════════════════════════════════════ */

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    // Escape → close help modal
    if (e.code === 'Escape') {
      const modal = $('helpModal');
      if (modal && modal.classList.contains('visible')) {
        modal.classList.remove('visible');
        return;
      }
    }

    // Space → BLE connect/disconnect
    if (e.code === 'Space') {
      e.preventDefault();
      if (isConnected) bleDisconnect();
      else { userDisconnected = false; bleConnect(); }
      return;
    }

    // 1-8 → switch tabs
    const tabKeys = ['Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8'];
    const tabIdx = tabKeys.indexOf(e.code);
    if (tabIdx >= 0) {
      const tabs = document.querySelectorAll('.tab-btn');
      if (tabs[tabIdx]) tabs[tabIdx].click();
      return;
    }

    // H or ? → open help
    if (e.code === 'KeyH' || e.key === '?') {
      const modal = $('helpModal');
      if (modal) modal.classList.toggle('visible');
      return;
    }
  });
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
