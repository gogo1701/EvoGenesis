/* ═══════════════════════════════════════════════════
   EvoGenesis — Еволюционен Кликър  v3
   Achievements · Events · Stats · Tutorial · Timeline
   ═══════════════════════════════════════════════════ */

// ─── КОНФИГУРАЦИЯ ─────────────────────────────────
const STAGES = [
    { name: 'Примордиална супа', icon: '🌊' },
    { name: 'Прокариот',         icon: '🦠' },
    { name: 'Еукариот',          icon: '🔬' },
    { name: 'Многоклетъчно',     icon: '🧫' },
    { name: 'Безгръбначно',      icon: '🪱' },
    { name: 'Риба',              icon: '🐟' },
    { name: 'Земноводно',        icon: '🐸' },
    { name: 'Влечуго',           icon: '🦎' },
    { name: 'Бозайник',          icon: '🐭' },
    { name: 'Примат',            icon: '🐵' },
    { name: 'Човек',             icon: '🧑' },
    { name: 'Трансхуман',        icon: '✨' },
];

const DNA_UPG = [
    { id:'replicase',    name:'🔄 Репликаза',          desc:'Увеличава силата на клик с +1 ДНК.',                 base:10,    g:1.15 },
    { id:'ribosome',     name:'🏭 Рибозома',           desc:'Произвежда +0.5 ДНК на секунда.',                    base:50,    g:1.18 },
    { id:'mitochondria', name:'⚡ Митохондрия',         desc:'Произвежда +3 ДНК на секунда.',                      base:500,   g:1.22 },
    { id:'enzyme',       name:'🧪 Ензимен комплекс',   desc:'×1.25 към цялото производство.',                     base:2000,  g:1.80 },
    { id:'division',     name:'🔬 Клетъчно делене',    desc:'×1.50 към цялото производство.',                     base:10000, g:2.20 },
];
const MUT_UPG = [
    { id:'adaptation',    name:'🛡️ Адаптация',            desc:'Започваш с +100 ДНК след еволюция на ниво.',         base:2,  g:1.80 },
    { id:'mutagenesis',   name:'☢️ Мутагенеза',            desc:'+30% постоянен бонус към клик на ниво.',             base:3,  g:2.00 },
    { id:'geneExpr',      name:'📖 Генна експресия',       desc:'+30% постоянен бонус към авто-ДНК/сек на ниво.',     base:3,  g:2.00 },
    { id:'chromosome',    name:'🧬 Хромозомно удвояване',  desc:'+25% повече мутации при еволюция на ниво.',          base:5,  g:2.50 },
    { id:'selection',     name:'🎯 Естествен подбор',      desc:'-5% цена на ДНК ъпгрейди на ниво (макс -50%).',      base:4,  g:2.00, max:10 },
];
const GEN_UPG = [
    { id:'cambrian',      name:'💥 Камбрийска експлозия',  desc:'×2 цялото производство на ниво.',                    base:1,  g:3.0 },
    { id:'symbiogenesis',  name:'🤝 Симбиогенеза',          desc:'+50% мутации при еволюция на ниво.',                base:2,  g:3.0 },
    { id:'epigenetics',   name:'🔮 Епигенетика',           desc:'-15% цена на мутационни ъпгрейди (макс -60%).',      base:3,  g:4.0, max:4 },
    { id:'engineering',   name:'⚙️ Генно инженерство',     desc:'Започваш с +2 мутации след геномен скок на ниво.',   base:5,  g:5.0 },
];

// ─── ПОСТИЖЕНИЯ (Achievements) ───────────────────
const ACHIEVEMENTS = [
    { id:'click1',     name:'Първа молекула',     desc:'Направи първия си клик.',           icon:'👆', check: g => g.totalClicks >= 1 },
    { id:'click100',   name:'Начален организъм',  desc:'100 клика.',                        icon:'🖱️', check: g => g.totalClicks >= 100 },
    { id:'click1k',    name:'Усърдна репликация',  desc:'1,000 клика.',                     icon:'⚡', check: g => g.totalClicks >= 1000 },
    { id:'click10k',   name:'Вечен кликър',        desc:'10,000 клика.',                    icon:'💎', check: g => g.totalClicks >= 10000 },
    { id:'dna100',     name:'Първи нуклеотиди',   desc:'Натрупай 100 ДНК.',                 icon:'🧬', check: g => g.allTimeDNA >= 100 },
    { id:'dna10k',     name:'ДНК библиотека',     desc:'Натрупай 10,000 ДНК общо.',         icon:'📚', check: g => g.allTimeDNA >= 10000 },
    { id:'dna1m',      name:'Генетична мощ',       desc:'Натрупай 1,000,000 ДНК общо.',     icon:'🔥', check: g => g.allTimeDNA >= 1e6 },
    { id:'dna1b',      name:'Геномен архив',       desc:'Натрупай 1,000,000,000 ДНК общо.', icon:'🌟', check: g => g.allTimeDNA >= 1e9 },
    { id:'dps10',      name:'Автоматизация',       desc:'Достигни 10 ДНК/сек.',             icon:'🏭', check: g => dps() >= 10 },
    { id:'dps100',     name:'Био-фабрика',         desc:'Достигни 100 ДНК/сек.',            icon:'⚙️', check: g => dps() >= 100 },
    { id:'dps1k',      name:'Индустриализация',    desc:'Достигни 1,000 ДНК/сек.',          icon:'🏗️', check: g => dps() >= 1000 },
    { id:'evo1',       name:'Първа еволюция',     desc:'Еволюирай за пръв път.',            icon:'🌱', check: g => g.evoCount >= 1 },
    { id:'evo3',       name:'Адаптивен вид',       desc:'Еволюирай 3 пъти.',               icon:'🌿', check: g => g.evoCount >= 3 },
    { id:'evo5',       name:'Доминиращ организъм', desc:'Еволюирай 5 пъти.',               icon:'🌳', check: g => g.evoCount >= 5 },
    { id:'evo10',      name:'Мастър на еволюцията',desc:'Еволюирай 10 пъти.',              icon:'👑', check: g => g.evoCount >= 10 },
    { id:'leap1',      name:'Геномен пионер',     desc:'Направи първия геномен скок.',      icon:'🚀', check: g => g.leapCount >= 1 },
    { id:'leap3',      name:'Генетичен магнат',     desc:'Направи 3 геномни скока.',        icon:'🔬', check: g => g.leapCount >= 3 },
    { id:'frenzy1',    name:'Космическа радиация', desc:'Преживей първата ДНК вълна.',      icon:'☄️', check: g => g.totalFrenzies >= 1 },
    { id:'frenzy5',    name:'Ветеран на вълните',  desc:'Преживей 5 ДНК вълни.',            icon:'🌊', check: g => g.totalFrenzies >= 5 },
    { id:'rich',       name:'Мутантен колекционер', desc:'Притежавай 50 мутации наведнъж.',  icon:'🧪', check: g => g.mutations >= 50 },
    { id:'win',        name:'Трансхуман',           desc:'Достигни последния етап.',         icon:'✨', check: g => g.hasWon },
];

const EVENTS = [
    { name: 'ДНК Вълна',       emoji: '⚡', text: '×3 производство!',         mult: 3,   dur: 30 },
    { name: 'Мутационен бум',   emoji: '☢️', text: '×5 клик сила!',            mult: 5,   dur: 20, clickOnly: true },
    { name: 'Слънчево изригване',emoji: '☀️', text: '×2 производство!',         mult: 2,   dur: 45 },
    { name: 'Генетичен дрифт',  emoji: '🎲', text: '×4 производство!',         mult: 4,   dur: 15 },
];

const SAVE_KEY   = 'evoGenesis_v3';
const EVO_BASE   = 1000;
const EVO_GROWTH = 8;
const LEAP_REQ   = 5;

// ─── СЪСТОЯНИЕ ──────────────────────────────────
function defaults() {
    return {
        dna: 0, totalDNA: 0, allTimeDNA: 0,
        mutations: 0, totalMutations: 0,
        genomes: 0,
        du: { replicase:0, ribosome:0, mitochondria:0, enzyme:0, division:0 },
        mu: { adaptation:0, mutagenesis:0, geneExpr:0, chromosome:0, selection:0 },
        gu: { cambrian:0, symbiogenesis:0, epigenetics:0, engineering:0 },
        evoCount: 0, leapCount: 0,
        hasWon: false,
        totalClicks: 0,
        totalFrenzies: 0,
        startTime: Date.now(),
        totalPlayTime: 0,   // ms
        achUnlocked: [],
        settings: { confirmEvo: true, confirmLeap: true, particles: true, notation: 'short' },
        lastTick: Date.now(),
    };
}
let G = defaults();
let buyQty = 1; // 1, 10, 25, 'max'
let activeEvent = null; // { type, endTime }

// ─── ПОМОЩНИ ────────────────────────────────────
function fmt(n) {
    if (n < 0) return '-' + fmt(-n);
    if (n < 1000) return Math.floor(n).toLocaleString('bg-BG');
    if (G.settings && G.settings.notation === 'scientific' && n >= 1e6)
        return n.toExponential(2);
    const S = ['','K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc'];
    const t = Math.min(Math.floor(Math.log10(n) / 3), S.length - 1);
    if (t === 0) return Math.floor(n).toLocaleString('bg-BG');
    const s = n / Math.pow(10, t * 3);
    return (s < 10 ? s.toFixed(2) : s < 100 ? s.toFixed(1) : s.toFixed(0)) + S[t];
}
function fmtTime(sec) {
    if (sec < 60) return Math.floor(sec) + ' сек';
    if (sec < 3600) return Math.floor(sec / 60) + ' мин';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return h + ' ч ' + m + ' мин';
}

// ─── КАЛКУЛАЦИИ ────────────────────────────────
function dnaCostMult()  { return Math.max(0.5, 1 - 0.05 * G.mu.selection); }
function mutCostMult()  { return Math.max(0.4, 1 - 0.15 * G.gu.epigenetics); }
function eventMultAll() { return (activeEvent && !activeEvent.clickOnly) ? activeEvent.mult : 1; }
function eventMultClk() { return (activeEvent && activeEvent.clickOnly) ? activeEvent.mult : 1; }

function costDNA(i, lv) {
    if (lv === undefined) lv = G.du[DNA_UPG[i].id];
    const u = DNA_UPG[i];
    return Math.max(1, Math.floor(u.base * Math.pow(u.g, lv) * dnaCostMult()));
}
function costMut(i, lv) {
    if (lv === undefined) lv = G.mu[MUT_UPG[i].id];
    const u = MUT_UPG[i];
    return Math.max(1, Math.floor(u.base * Math.pow(u.g, lv) * mutCostMult()));
}
function costGen(i, lv) {
    if (lv === undefined) lv = G.gu[GEN_UPG[i].id];
    const u = GEN_UPG[i];
    return Math.max(1, Math.floor(u.base * Math.pow(u.g, lv)));
}

/* Cost for buying N levels */
function costBulk(costFn, idx, idKey, upgArr, currency, n) {
    if (n === 'max') {
        let total = 0, lv = G[idKey][upgArr[idx].id], count = 0;
        while (true) {
            const c = costFn(idx, lv);
            if (total + c > currency || (upgArr[idx].max && lv >= upgArr[idx].max)) break;
            total += c; lv++; count++;
        }
        return { count, total };
    }
    let total = 0, lv = G[idKey][upgArr[idx].id];
    const maxLv = upgArr[idx].max;
    for (let k = 0; k < n; k++) {
        if (maxLv && lv >= maxLv) break;
        total += costFn(idx, lv); lv++;
    }
    return { count: Math.min(n, maxLv ? maxLv - G[idKey][upgArr[idx].id] : n), total };
}

function prodMult() {
    const enz  = Math.pow(1.25, G.du.enzyme);
    const div  = Math.pow(1.50, G.du.division);
    const camb = Math.pow(2.00, G.gu.cambrian);
    return enz * div * camb * eventMultAll();
}
function clickPow() {
    const base = 1 + G.du.replicase;
    const mBon = 1 + 0.30 * G.mu.mutagenesis;
    return base * mBon * prodMult() * eventMultClk();
}
function dps() {
    const base = G.du.ribosome * 0.5 + G.du.mitochondria * 3;
    const mBon = 1 + 0.30 * G.mu.geneExpr;
    return base * mBon * prodMult();
}

function evoThresh() { return EVO_BASE * Math.pow(EVO_GROWTH, G.evoCount); }
function mutGain()   {
    const raw  = Math.floor(Math.pow(G.totalDNA / 100, 0.5));
    const cBon = 1 + 0.25 * G.mu.chromosome;
    const sBon = 1 + 0.50 * G.gu.symbiogenesis;
    return Math.max(1, Math.floor(raw * cBon * sBon));
}
function genGain() { return Math.max(1, Math.floor(Math.pow(G.totalMutations / 5, 0.5))); }
function canEvo()  { return G.totalDNA >= evoThresh(); }
function canLeap() { return G.evoCount >= LEAP_REQ; }

function dnaEffect(i) {
    const lv = G.du[DNA_UPG[i].id];
    switch (i) {
        case 0: return 'Текущо: +' + lv + ' ДНК/клик';
        case 1: return 'Текущо: +' + (lv * 0.5).toFixed(1) + ' ДНК/сек';
        case 2: return 'Текущо: +' + (lv * 3) + ' ДНК/сек';
        case 3: return 'Текущо: ×' + Math.pow(1.25, lv).toFixed(2);
        case 4: return 'Текущо: ×' + Math.pow(1.50, lv).toFixed(2);
    }
}
function mutEffect(i) {
    const lv = G.mu[MUT_UPG[i].id];
    switch (i) {
        case 0: return 'Текущо: +' + (lv * 100) + ' начални ДНК';
        case 1: return 'Текущо: +' + (lv * 30) + '% клик бонус';
        case 2: return 'Текущо: +' + (lv * 30) + '% авто бонус';
        case 3: return 'Текущо: +' + (lv * 25) + '% мутации';
        case 4: return 'Текущо: -' + Math.min(lv * 5, 50) + '% ДНК цени';
    }
}
function genEffect(i) {
    const lv = G.gu[GEN_UPG[i].id];
    switch (i) {
        case 0: return 'Текущо: ×' + Math.pow(2, lv).toFixed(0) + ' производство';
        case 1: return 'Текущо: +' + (lv * 50) + '% мутации';
        case 2: return 'Текущо: -' + Math.min(lv * 15, 60) + '% мут. цени';
        case 3: return 'Текущо: +' + (lv * 2) + ' начални мутации';
    }
}

// ─── ДЕЙСТВИЯ ──────────────────────────────────
function doClick(e) {
    const pw = clickPow();
    G.dna += pw; G.totalDNA += pw; G.allTimeDNA += pw; G.totalClicks++;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top;
    spawnFloat('+' + fmt(pw), cx + (Math.random() - 0.5) * 50, cy - 5);
    if (G.settings.particles) spawnParticles(e.clientX || cx, e.clientY || (cy + rect.height / 2), 5);
    checkAchievements();
}

function buyDNA(i) {
    const { count, total } = costBulk(costDNA, i, 'du', DNA_UPG, G.dna, buyQty);
    if (count > 0 && G.dna >= total) { G.dna -= total; G.du[DNA_UPG[i].id] += count; buildShop(); }
}
function buyMut(i) {
    const u = MUT_UPG[i];
    if (u.max && G.mu[u.id] >= u.max) return;
    const { count, total } = costBulk(costMut, i, 'mu', MUT_UPG, G.mutations, buyQty);
    if (count > 0 && G.mutations >= total) { G.mutations -= total; G.mu[u.id] += count; buildShop(); }
}
function buyGen(i) {
    const u = GEN_UPG[i];
    if (u.max && G.gu[u.id] >= u.max) return;
    const { count, total } = costBulk(costGen, i, 'gu', GEN_UPG, G.genomes, buyQty);
    if (count > 0 && G.genomes >= total) { G.genomes -= total; G.gu[u.id] += count; buildShop(); }
}

function evolve() {
    if (!canEvo()) return;
    const gain = mutGain();
    if (G.settings.confirmEvo) {
        if (!confirm(`🧬 Еволюция!\n\nЩе получиш: +${gain} мутации\nЩе загубиш: всички ДНК точки и ДНК ъпгрейди.\n\nПродължаваш?`)) return;
    }
    G.mutations += gain; G.totalMutations += gain; G.evoCount++;
    G.dna = G.mu.adaptation * 100; G.totalDNA = 0;
    G.du = { replicase:0, ribosome:0, mitochondria:0, enzyme:0, division:0 };
    flashScreen();
    showToast('evo-toast', '🧬', 'Еволюция!', `+${fmt(gain)} мутации · Етап: ${STAGES[Math.min(G.evoCount, STAGES.length-1)].name}`);
    const si = Math.min(G.evoCount, STAGES.length - 1);
    if (si === STAGES.length - 1 && !G.hasWon) {
        G.hasWon = true;
        setTimeout(() => showToast('ach-toast', '🎉', 'Победа!', `Достигна "${STAGES[si].name}"! Играта продължава...`), 500);
    }
    checkAchievements(); buildShop(); updateUI(); buildTimeline();
}

function genomeLeap() {
    if (!canLeap()) return;
    const gain = genGain();
    if (G.settings.confirmLeap) {
        if (!confirm(`🔬 Геномен скок!\n\nЩе получиш: +${gain} геноми\nЩе загубиш: ВСИЧКО освен геномни ъпгрейди.\n\nПродължаваш?`)) return;
    }
    const savedGU = { ...G.gu }, savedLC = G.leapCount + 1, savedGems = G.genomes + gain;
    const savedAT = G.allTimeDNA, savedWon = G.hasWon;
    const savedClicks = G.totalClicks, savedFrenzies = G.totalFrenzies;
    const savedStart = G.startTime, savedPlayTime = G.totalPlayTime;
    const savedAch = [...G.achUnlocked], savedSettings = { ...G.settings };

    G = defaults();
    G.gu = savedGU; G.leapCount = savedLC; G.genomes = savedGems;
    G.allTimeDNA = savedAT; G.hasWon = savedWon;
    G.mutations = G.gu.engineering * 2;
    G.totalClicks = savedClicks; G.totalFrenzies = savedFrenzies;
    G.startTime = savedStart; G.totalPlayTime = savedPlayTime;
    G.achUnlocked = savedAch; G.settings = savedSettings;

    flashScreen();
    showToast('evo-toast', '🔬', 'Геномен скок!', `+${fmt(gain)} геноми`);
    checkAchievements(); buildShop(); updateUI(); buildTimeline();
}

// ─── FLOATING TEXT & PARTICLES ─────────────────
function spawnFloat(txt, x, y) {
    const el = document.createElement('div');
    el.className = 'ft'; el.textContent = txt;
    el.style.left = x + 'px'; el.style.top = y + 'px';
    document.getElementById('floats').appendChild(el);
    setTimeout(() => el.remove(), 900);
}

function spawnParticles(x, y, n) {
    const cont = document.getElementById('floats');
    for (let i = 0; i < n; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const angle = Math.random() * Math.PI * 2;
        const dist = 40 + Math.random() * 60;
        p.style.left = x + 'px'; p.style.top = y + 'px';
        p.style.setProperty('--px', Math.cos(angle) * dist + 'px');
        p.style.setProperty('--py', Math.sin(angle) * dist + 'px');
        cont.appendChild(p);
        setTimeout(() => p.remove(), 600);
    }
}

function flashScreen() {
    document.body.classList.add('evo-flash');
    setTimeout(() => document.body.classList.remove('evo-flash'), 600);
}

// ─── TOAST NOTIFICATIONS ───────────────────────
function showToast(cls, icon, title, desc, duration) {
    const c = document.getElementById('toasts');
    const t = document.createElement('div');
    t.className = 'toast ' + cls;
    t.innerHTML = `<span class="toast-ico">${icon}</span><div class="toast-body"><div class="toast-title">${title}</div><div class="toast-desc">${desc}</div></div>`;
    c.appendChild(t);
    const dur = duration || 4000;
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, dur);
}

// ─── ACHIEVEMENTS ──────────────────────────────
function checkAchievements() {
    ACHIEVEMENTS.forEach(a => {
        if (G.achUnlocked.includes(a.id)) return;
        if (a.check(G)) {
            G.achUnlocked.push(a.id);
            showToast('ach-toast', '🏆', a.name, a.desc, 5000);
        }
    });
}

// ─── RANDOM EVENTS ─────────────────────────────
let eventTimer = null;
function trySpawnEvent() {
    if (activeEvent) return;
    if (dps() < 1 && G.totalClicks < 10) return; // don't fire too early
    if (Math.random() > 0.15) return; // ~15% chance every 60s
    const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    activeEvent = { ...ev, endTime: Date.now() + ev.dur * 1000 };
    G.totalFrenzies++;
    const banner = document.getElementById('event-banner');
    banner.classList.remove('hidden');
    document.getElementById('event-text').textContent = ev.name + '! ' + ev.text;
    document.getElementById('click-btn').classList.add('frenzy');
    showToast('event-toast', ev.emoji, ev.name, ev.text + ` (${ev.dur} сек)`, 3000);
    checkAchievements();
}
function updateEvent() {
    if (!activeEvent) return;
    const rem = Math.max(0, (activeEvent.endTime - Date.now()) / 1000);
    document.getElementById('event-timer').textContent = Math.ceil(rem) + 'с';
    if (rem <= 0) {
        activeEvent = null;
        document.getElementById('event-banner').classList.add('hidden');
        document.getElementById('click-btn').classList.remove('frenzy');
    }
}

// ─── UI: SHOP ──────────────────────────────────
function buildShop() { buildDNATab(); buildMutTab(); buildGenTab(); }

function makeUpgBtn(cls, name, desc, effect, lvl, costStr, disabled, maxed, onClick) {
    const b = document.createElement('button');
    b.className = 'upg ' + cls + (maxed ? ' maxed' : '');
    b.disabled = disabled || maxed;
    b.innerHTML =
        `<div class="upg-name">${name}</div>` +
        `<div class="upg-desc">${desc}</div>` +
        `<div class="upg-effect">${effect}</div>` +
        `<div class="upg-foot"><span class="upg-lvl">${maxed ? 'МАКС' : 'Ниво: ' + lvl}</span><span class="upg-cost">${costStr}</span></div>`;
    if (!maxed) b.addEventListener('click', onClick);
    return b;
}

function bulkLabel(count, total, symbol, color) {
    if (count <= 0) return `<span class="${color}">—</span>`;
    const suffix = count > 1 ? ` (×${count})` : '';
    return `<span class="${color}">${symbol} ${fmt(total)}${suffix}</span>`;
}

function buildDNATab() {
    const el = document.getElementById('t-dna'); el.innerHTML = '';
    DNA_UPG.forEach((u, i) => {
        const { count, total } = costBulk(costDNA, i, 'du', DNA_UPG, G.dna, buyQty);
        el.appendChild(makeUpgBtn('dna-u', u.name, u.desc, dnaEffect(i), G.du[u.id],
            bulkLabel(count, total, '🧬', 'dna-cost'), G.dna < total || count <= 0, false, () => buyDNA(i)));
    });
}
function buildMutTab() {
    const el = document.getElementById('t-mut'); el.innerHTML = '';
    if (G.evoCount === 0 && G.mutations === 0 && G.leapCount === 0) {
        el.innerHTML = '<div class="lock-msg"><span class="lock-emoji">🔒</span>Еволюирай поне веднъж,<br>за да отключиш мутациите!</div>';
        return;
    }
    MUT_UPG.forEach((u, i) => {
        const mx = u.max && G.mu[u.id] >= u.max;
        const { count, total } = mx ? {count:0,total:0} : costBulk(costMut, i, 'mu', MUT_UPG, G.mutations, buyQty);
        el.appendChild(makeUpgBtn('mut-u', u.name, u.desc, mutEffect(i), G.mu[u.id],
            mx ? '—' : bulkLabel(count, total, '🧪', 'mut-cost'), G.mutations < total || count <= 0, mx, () => buyMut(i)));
    });
}
function buildGenTab() {
    const el = document.getElementById('t-gen'); el.innerHTML = '';
    if (G.leapCount === 0 && G.genomes === 0) {
        el.innerHTML = '<div class="lock-msg"><span class="lock-emoji">🔒</span>Направи геномен скок,<br>за да отключиш геномите!</div>';
        return;
    }
    GEN_UPG.forEach((u, i) => {
        const mx = u.max && G.gu[u.id] >= u.max;
        const { count, total } = mx ? {count:0,total:0} : costBulk(costGen, i, 'gu', GEN_UPG, G.genomes, buyQty);
        el.appendChild(makeUpgBtn('gen-u', u.name, u.desc, genEffect(i), G.gu[u.id],
            mx ? '—' : bulkLabel(count, total, '🔬', 'gen-cost'), G.genomes < total || count <= 0, mx, () => buyGen(i)));
    });
}

// ─── UI: UPDATE ────────────────────────────────
function updateUI() {
    document.getElementById('dna-val').textContent = fmt(G.dna);
    document.getElementById('mut-val').textContent = fmt(G.mutations);
    document.getElementById('gen-val').textContent = fmt(G.genomes);

    const mutVis = G.evoCount > 0 || G.mutations > 0 || G.leapCount > 0;
    const genVis = G.leapCount > 0 || G.genomes > 0;
    document.getElementById('mut-box').classList.toggle('hidden', !mutVis);
    document.getElementById('gen-box').classList.toggle('hidden', !genVis);
    const tMut = document.getElementById('tab-mut');
    const tGen = document.getElementById('tab-gen');
    if (mutVis) { tMut.classList.remove('locked'); tMut.textContent = '🧪 Мутации'; }
    if (genVis) { tGen.classList.remove('locked'); tGen.textContent = '🔬 Геноми'; }

    const si = Math.min(G.evoCount, STAGES.length - 1);
    document.getElementById('stage-name').textContent = STAGES[si].name;
    document.getElementById('stage-icon').textContent = STAGES[si].icon;
    document.getElementById('organism').textContent   = STAGES[si].icon;

    document.getElementById('s-click').textContent = fmt(clickPow());
    document.getElementById('s-dps').textContent   = fmt(dps());
    document.getElementById('s-mult').textContent  = '×' + prodMult().toFixed(2);
    document.getElementById('s-total').textContent = fmt(G.totalDNA);
    document.getElementById('click-sub').textContent = '+' + fmt(clickPow()) + ' ДНК';

    const th = evoThresh(), pct = Math.min(G.totalDNA / th, 1);
    document.getElementById('evo-fill').style.width = (pct * 100) + '%';
    document.getElementById('evo-text').textContent = fmt(G.totalDNA) + ' / ' + fmt(th);

    const eBtn = document.getElementById('evo-btn');
    eBtn.disabled = !canEvo();
    document.getElementById('evo-info').textContent =
        canEvo() ? '+' + fmt(mutGain()) + ' мутации' : 'Нужни: ' + fmt(th) + ' ДНК';

    const lBtn = document.getElementById('leap-btn');
    if (G.evoCount >= 3 || G.leapCount > 0) {
        lBtn.classList.remove('hidden');
        lBtn.disabled = !canLeap();
        document.getElementById('leap-info').textContent =
            canLeap() ? '+' + fmt(genGain()) + ' геноми' : `Нужни: ${LEAP_REQ} еволюции (${G.evoCount}/${LEAP_REQ})`;
    }

    document.getElementById('f-evo').textContent  = G.evoCount;
    document.getElementById('f-leap').textContent = G.leapCount;

    // Playtime
    const pt = (G.totalPlayTime + Date.now() - G.startTime) / 1000;
    document.getElementById('f-playtime').textContent = 'Време: ' + fmtTime(pt);

    updateShopState();
    updateEvent();
}

function updateShopState() {
    document.querySelectorAll('#t-dna .upg').forEach((b, i) => {
        if (b.classList.contains('maxed')) return;
        const { count, total } = costBulk(costDNA, i, 'du', DNA_UPG, G.dna, buyQty);
        b.disabled = G.dna < total || count <= 0;
        const costEl = b.querySelector('.dna-cost');
        if (costEl) costEl.textContent = '🧬 ' + fmt(total) + (count > 1 ? ` (×${count})` : '');
        const lvEl = b.querySelector('.upg-lvl');
        if (lvEl) lvEl.textContent = 'Ниво: ' + G.du[DNA_UPG[i].id];
        const efEl = b.querySelector('.upg-effect');
        if (efEl) efEl.textContent = dnaEffect(i);
    });
    document.querySelectorAll('#t-mut .upg').forEach((b, i) => {
        if (b.classList.contains('maxed')) return;
        const { count, total } = costBulk(costMut, i, 'mu', MUT_UPG, G.mutations, buyQty);
        b.disabled = G.mutations < total || count <= 0;
    });
    document.querySelectorAll('#t-gen .upg').forEach((b, i) => {
        if (b.classList.contains('maxed')) return;
        const { count, total } = costBulk(costGen, i, 'gu', GEN_UPG, G.genomes, buyQty);
        b.disabled = G.genomes < total || count <= 0;
    });
}

// ─── TIMELINE ──────────────────────────────────
function buildTimeline() {
    const el = document.getElementById('timeline'); el.innerHTML = '';
    const si = Math.min(G.evoCount, STAGES.length - 1);
    STAGES.forEach((s, i) => {
        if (i > 0) {
            const line = document.createElement('div');
            line.className = 'tl-line' + (i <= si ? ' done' : '');
            el.appendChild(line);
        }
        const node = document.createElement('div');
        node.className = 'tl-node' + (i < si ? ' done' : i === si ? ' current' : ' locked');
        node.innerHTML = `<div class="tl-icon">${s.icon}</div><div class="tl-name">${s.name}</div>`;
        el.appendChild(node);
    });
}

// ─── МОДАЛИ ────────────────────────────────────
function openModal(title, bodyHTML) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHTML;
    document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Help Modal
document.getElementById('btn-help').addEventListener('click', () => {
    openModal('❓ Как се играе', `
        <h3>🧬 Основи</h3>
        <p>Кликай върху бутона за да генерираш <strong>ДНК точки</strong>. Използвай ги за да купуваш ъпгрейди, които увеличават добива ти на клик и автоматичното производство (ДНК/сек).</p>

        <h3>🧪 Еволюция (Престиж 1)</h3>
        <p>Когато натрупаш достатъчно ДНК, можеш да <strong>еволюираш</strong>. Това нулира ДНК и ДНК ъпгрейдите ти, но получаваш <strong>мутации</strong> — валута за постоянни бонуси. Всяка еволюция те придвижва напред по еволюционната верига!</p>

        <h3>🔬 Геномен скок (Престиж 2)</h3>
        <p>След <strong>5 еволюции</strong> отключваш геномния скок. Той нулира всичко (включително мутации), но ти дава <strong>геноми</strong> — най-мощната валута за невероятни ъпгрейди.</p>

        <h3>⚡ Събития</h3>
        <p>На всеки ~60 секунди има шанс да се появи <strong>случайно събитие</strong> — временен бонус към производството ти. Следи банера!</p>

        <h3>🏆 Постижения</h3>
        <p>Отключвай постижения за различни milestone-и. Провери раздела с 🏆 за да видиш прогреса си.</p>

        <h3>💡 Съвети</h3>
        <p>• Инвестирай в <strong>Рибозоми</strong> и <strong>Митохондрии</strong> рано за пасивен доход.<br>
        • <strong>Ензимни комплекси</strong> и <strong>Клетъчно делене</strong> мултиплицират ЦЯЛОТО производство.<br>
        • Еволюирай бързо за да натрупаш мутации — те правят следващия рън много по-бърз.<br>
        • Използвай <strong>×10</strong> или <strong>Макс</strong> бутоните за бързо купуване.</p>

        <h3>⌨️ Клавишни комбинации</h3>
        <table class="hk-table">
            <tr><td><kbd>Space</kbd></td><td>Клик</td></tr>
            <tr><td><kbd>1-4</kbd></td><td>Количество: ×1, ×10, ×25, Макс</td></tr>
            <tr><td><kbd>E</kbd></td><td>Еволюция</td></tr>
            <tr><td><kbd>H</kbd></td><td>Помощ (тази страница)</td></tr>
            <tr><td><kbd>Esc</kbd></td><td>Затвори прозорец</td></tr>
        </table>
    `);
});

// Stats Modal
document.getElementById('btn-stats').addEventListener('click', () => {
    const pt = (G.totalPlayTime + Date.now() - G.startTime) / 1000;
    const d = dps();
    const timeToEvo = d > 0 ? Math.max(0, (evoThresh() - G.totalDNA) / d) : Infinity;
    openModal('📊 Статистика', `
        <div class="stats-grid">
            <div class="sg-item"><small>Общо кликове</small><strong>${fmt(G.totalClicks)}</strong></div>
            <div class="sg-item"><small>ДНК/клик</small><strong>${fmt(clickPow())}</strong></div>
            <div class="sg-item"><small>ДНК/сек</small><strong>${fmt(d)}</strong></div>
            <div class="sg-item"><small>Множител</small><strong>×${prodMult().toFixed(2)}</strong></div>
            <div class="sg-item"><small>ДНК (текущи)</small><strong>${fmt(G.dna)}</strong></div>
            <div class="sg-item"><small>ДНК (този рън)</small><strong>${fmt(G.totalDNA)}</strong></div>
            <div class="sg-item"><small>ДНК (всички)</small><strong>${fmt(G.allTimeDNA)}</strong></div>
            <div class="sg-item"><small>Мутации</small><strong>${fmt(G.mutations)}</strong></div>
            <div class="sg-item"><small>Общо мутации</small><strong>${fmt(G.totalMutations)}</strong></div>
            <div class="sg-item"><small>Геноми</small><strong>${fmt(G.genomes)}</strong></div>
            <div class="sg-item"><small>Еволюции</small><strong>${G.evoCount}</strong></div>
            <div class="sg-item"><small>Геномни скокове</small><strong>${G.leapCount}</strong></div>
            <div class="sg-item"><small>Събития преживени</small><strong>${G.totalFrenzies}</strong></div>
            <div class="sg-item"><small>Постижения</small><strong>${G.achUnlocked.length} / ${ACHIEVEMENTS.length}</strong></div>
            <div class="sg-item"><small>Време на игра</small><strong>${fmtTime(pt)}</strong></div>
            <div class="sg-item"><small>Време до еволюция</small><strong>${timeToEvo === Infinity ? '∞' : fmtTime(timeToEvo)}</strong></div>
        </div>
    `);
});

// Achievements Modal
document.getElementById('btn-ach').addEventListener('click', () => {
    let html = '<div class="ach-grid">';
    ACHIEVEMENTS.forEach(a => {
        const done = G.achUnlocked.includes(a.id);
        html += `<div class="ach ${done ? '' : 'locked'}">
            <span class="ach-ico">${done ? a.icon : '🔒'}</span>
            <div class="ach-info"><div class="ach-name">${done ? a.name : '???'}</div><div class="ach-desc">${done ? a.desc : 'Все още не е отключено.'}</div></div>
            ${done ? '<span class="ach-check">✓</span>' : ''}
        </div>`;
    });
    html += '</div>';
    openModal('🏆 Постижения (' + G.achUnlocked.length + '/' + ACHIEVEMENTS.length + ')', html);
});

// Settings Modal
document.getElementById('btn-settings').addEventListener('click', () => {
    openModal('⚙️ Настройки', `
        <div class="setting-row">
            <div class="setting-label">Потвърждение при еволюция<small>Показвай диалог преди еволюция</small></div>
            <button class="toggle ${G.settings.confirmEvo ? 'on' : ''}" data-setting="confirmEvo"></button>
        </div>
        <div class="setting-row">
            <div class="setting-label">Потвърждение при геномен скок<small>Показвай диалог преди скок</small></div>
            <button class="toggle ${G.settings.confirmLeap ? 'on' : ''}" data-setting="confirmLeap"></button>
        </div>
        <div class="setting-row">
            <div class="setting-label">Частици при клик<small>Визуален ефект при кликане</small></div>
            <button class="toggle ${G.settings.particles ? 'on' : ''}" data-setting="particles"></button>
        </div>
        <div class="setting-row">
            <div class="setting-label">Нотация на числа<small>Кратка: 1.5M · Научна: 1.50e+6</small></div>
            <button class="toggle ${G.settings.notation === 'scientific' ? 'on' : ''}" data-setting="notation"></button>
        </div>
    `);
    document.querySelectorAll('.toggle[data-setting]').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.setting;
            if (key === 'notation') {
                G.settings.notation = G.settings.notation === 'short' ? 'scientific' : 'short';
                btn.classList.toggle('on', G.settings.notation === 'scientific');
            } else {
                G.settings[key] = !G.settings[key];
                btn.classList.toggle('on', G.settings[key]);
            }
        });
    });
});

// ─── TABS & BUY QTY ───────────────────────────
function initTabs() {
    document.querySelectorAll('.tab').forEach(t => {
        t.addEventListener('click', () => {
            if (t.classList.contains('locked')) return;
            document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
            t.classList.add('active');
            document.getElementById(t.dataset.tab).classList.add('active');
        });
    });
    document.querySelectorAll('.bq').forEach(b => {
        b.addEventListener('click', () => {
            document.querySelectorAll('.bq').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            buyQty = b.dataset.qty === 'max' ? 'max' : parseInt(b.dataset.qty);
            buildShop();
        });
    });
}

// ─── ЗАПАЗВАНЕ / ЗАРЕЖДАНЕ ─────────────────────
function save() {
    G.lastTick = Date.now();
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(G)); } catch(e) {}
}
function load() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    try {
        const p = JSON.parse(raw);
        const d = defaults();
        G = { ...d, ...p };
        G.du = { ...d.du, ...(p.du || {}) };
        G.mu = { ...d.mu, ...(p.mu || {}) };
        G.gu = { ...d.gu, ...(p.gu || {}) };
        G.settings = { ...d.settings, ...(p.settings || {}) };
        G.achUnlocked = p.achUnlocked || [];
    } catch(e) { console.error('Грешка при зареждане:', e); }

    const dt = (Date.now() - G.lastTick) / 1000;
    if (dt > 5) {
        const d = dps();
        if (d > 0) {
            const cap = 4 * 3600;
            const eff = Math.min(dt, cap);
            const gain = d * eff;
            G.dna += gain; G.totalDNA += gain; G.allTimeDNA += gain;
            setTimeout(() => showToast('event-toast', '⏱️', 'Офлайн прогрес',
                `${fmtTime(eff)} → +${fmt(gain)} ДНК`, 5000), 400);
        }
    }
    G.lastTick = Date.now();
}

// ─── GAME LOOP ─────────────────────────────────
function tick(now) {
    const dt = (now - (G._prev || now)) / 1000;
    G._prev = now;
    const d = dps();
    if (d > 0 && dt > 0 && dt < 2) {
        const gain = d * dt;
        G.dna += gain; G.totalDNA += gain; G.allTimeDNA += gain;
    }
    checkAchievements();
    updateUI();
    requestAnimationFrame(tick);
}

// ─── СЪБИТИЯ ────────────────────────────────────
document.getElementById('click-btn').addEventListener('click', doClick);
document.getElementById('evo-btn').addEventListener('click', evolve);
document.getElementById('leap-btn').addEventListener('click', genomeLeap);
document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('🗑️ Сигурни ли сте? Целият прогрес ще бъде изтрит завинаги!')) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
});

document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (document.getElementById('modal-overlay').classList.contains('hidden') === false) return;
    switch (e.code) {
        case 'Space':
            e.preventDefault();
            const btn = document.getElementById('click-btn');
            const rect = btn.getBoundingClientRect();
            const pw = clickPow();
            G.dna += pw; G.totalDNA += pw; G.allTimeDNA += pw; G.totalClicks++;
            spawnFloat('+' + fmt(pw), rect.left + rect.width/2, rect.top - 5);
            if (G.settings.particles) spawnParticles(rect.left + rect.width/2, rect.top + rect.height/2, 5);
            checkAchievements();
            break;
        case 'Digit1': case 'Numpad1': setQty(1); break;
        case 'Digit2': case 'Numpad2': setQty(10); break;
        case 'Digit3': case 'Numpad3': setQty(25); break;
        case 'Digit4': case 'Numpad4': setQty('max'); break;
        case 'KeyE': if (canEvo()) evolve(); break;
        case 'KeyH': document.getElementById('btn-help').click(); break;
    }
});

function setQty(q) {
    buyQty = q;
    document.querySelectorAll('.bq').forEach(b => {
        b.classList.toggle('active', b.dataset.qty === String(q));
    });
    buildShop();
}

// ─── ИНИЦИАЛИЗАЦИЯ ──────────────────────────────
load();
initTabs();
buildShop();
buildTimeline();
updateUI();
G._prev = performance.now();
requestAnimationFrame(tick);
setInterval(save, 2000);
setInterval(trySpawnEvent, 60000); // try event every 60s
// Check event on load too (after 10s to not overwhelm)
setTimeout(trySpawnEvent, 10000);
// Show help on very first play
if (G.totalClicks === 0 && G.evoCount === 0) {
    setTimeout(() => document.getElementById('btn-help').click(), 500);
}
