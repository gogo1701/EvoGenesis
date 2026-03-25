/* ═══════════════════════════════════════════════════
   EvoGenesis — Evolutionary Clicker  v3
   Achievements · Events · Stats · Tutorial · Timeline
   ═══════════════════════════════════════════════════ */

// ─── CONFIGURATION ─────────────────────────────────
const STAGES = [
    { name: 'Primordial Soup', icon: '🌊' },
    { name: 'Prokaryote',      icon: '🦠' },
    { name: 'Eukaryote',       icon: '🔬' },
    { name: 'Multicellular',   icon: '🧫' },
    { name: 'Invertebrate',    icon: '🪱' },
    { name: 'Fish',            icon: '🐟' },
    { name: 'Amphibian',       icon: '🐸' },
    { name: 'Reptile',         icon: '🦎' },
    { name: 'Mammal',          icon: '🐭' },
    { name: 'Primate',         icon: '🐵' },
    { name: 'Human',           icon: '🧑' },
    { name: 'Transhuman',      icon: '✨' },
    { name: 'Galactic Entity', icon: '🌌' },
    { name: 'Universal Mind',  icon: '🧠' },
    { name: 'Omnipotence',     icon: '♾️' },
];

const TRAITS = [
    { id: 't1', name: 'Rapid Metabolism', desc: '+50% Click Power', cost: 10, type: 'Predator', check: (G) => G.evoCount >= 2 },
    { id: 't2', name: 'Symbiotic Bond', desc: '+40% Passive Income', cost: 10, type: 'Herbivore', check: (G) => G.evoCount >= 2 },
    { id: 't3', name: 'Apex Instinct', desc: 'Critical Hits now do 5x damage', cost: 50, type: 'Predator', check: (G) => G.traits.t1 },
    { id: 't4', name: 'Ancient Resilience', desc: '-20% Upgrade Costs', cost: 50, type: 'Herbivore', check: (G) => G.traits.t2 }
];

const DNA_UPG = [
    { id:'replicase',    name:'🔄 Replicase',         desc:'A primitive enzyme that makes DNA self-copy — each click grows stronger.',             base:10,    g:1.15 },
    { id:'ribosome',     name:'🏭 Ribosome',           desc:'Tiny cellular factories that quietly accumulate DNA/sec, even while idle.',            base:50,    g:1.18 },
    { id:'mitochondria', name:'⚡ Mitochondria',        desc:'The powerhouses of life — convert chaos into a steady stream of DNA.',                base:500,   g:1.22 },
    { id:'enzyme',       name:'🧪 Enzyme Complex',     desc:'Mysterious complexes that accelerate every reaction — multiply all your production.', base:2000,  g:1.80 },
    { id:'division',     name:'🔬 Cell Division',      desc:'Cells divide relentlessly — each level explosively multiplies DNA/click and DNA/sec.',base:10000, g:2.20 },
];
const MUT_UPG = [
    { id:'adaptation',    name:'🛡️ Adaptation',           desc:'Your species learns to survive — start each run with bonus starting DNA.',             base:2,  g:1.80 },
    { id:'mutagenesis',   name:'☢️ Mutagenesis',            desc:'Cosmic radiation and chaos — a permanent bonus making every click more powerful.',     base:3,  g:2.00 },
    { id:'geneExpr',      name:'📖 Gene Expression',       desc:'Your genes awaken — passive sources produce an ever-stronger flow of DNA/sec.',       base:3,  g:2.00 },
    { id:'chromosome',    name:'🧬 Chromosome Doubling',   desc:'Chromosomes copy and rearrange — each evolution grants more mutations.',              base:5,  g:2.50 },
    { id:'selection',     name:'🎯 Natural Selection',     desc:'The weak fall, the strong survive — a permanent discount on DNA upgrade costs.',      base:4,  g:2.00, max:10 },
];
const GEN_UPG = [
    { id:'cambrian',      name:'💥 Cambrian Explosion',    desc:'An explosion of life forms — each level doubles all your production.',                base:1,  g:3.0 },
    { id:'symbiogenesis',  name:'🤝 Symbiogenesis',         desc:'Organisms merge into new hybrids — evolutions grant increasingly more mutations.',   base:2,  g:3.0 },
    { id:'epigenetics',   name:'🔮 Epigenetics',            desc:'Memories encoded in DNA — mutation upgrades become cheaper over time.',               base:3,  g:4.0, max:4 },
    { id:'engineering',   name:'⚙️ Genetic Engineering',    desc:'Consciously rewrite your own genome — new cycles start with bonus mutations.',       base:5,  g:5.0 },
];

// ─── EVOLUTION SKILL TREE ─────────────────────
// Every node requires cx, cy offsets for the vertical grid. Left branches use negative cx, right branches positive.
const evolutionTree = [
    { id:'evo_root',      name:'Cellular Memory',    icon:'🧠', dnaCost: 500,    requirement: null,        type:'Click Power',  effectValue: 1, cx: 0, cy: 9 },
    
    // Middle spine
    { id:'evo_click2',    name:'Synaptic Impulse',   icon:'⚡', dnaCost: 2500,   requirement: 'evo_root',  type:'Click Power',  effectValue: 2, cx: 0, cy: 8 },
    { id:'evo_click3',    name:'Neural Network',     icon:'🕸️', dnaCost: 15000,  requirement: 'evo_click2',type:'Click Power',  effectValue: 5, cx: 0, cy: 7 },
    { id:'evo_enzyme_eff',name:'Enzyme Efficiency', icon:'🧪', dnaCost: 100000, requirement: 'evo_click3',type:'Cost Reduction',effectValue: 0.15, cx: 0, cy: 6 },

    // Left broad passive branch
    { id:'evo_passive1',  name:'Basal Metabolism',   icon:'♨️', dnaCost: 2000,   requirement: 'evo_root',  type:'Passive DNA',  effectValue: 1, cx: -2, cy: 8 },
    { id:'evo_passive2',  name:'Tissue Diffusion',   icon:'🩸', dnaCost: 10000,  requirement: 'evo_passive1', type:'Passive DNA',effectValue: 3, cx: -2, cy: 7 },
    { id:'evo_extremophile',name:'Extremophile',     icon:'🌋', dnaCost: 45000,  requirement: 'evo_passive2', type:'Passive DNA', effectValue: 15, cx: -3, cy: 6 },
    { id:'evo_tardigrade', name:'Indestructibility', icon:'🐻', dnaCost: 150000, requirement: 'evo_extremophile', type:'Multiplier', effectValue: 0.50, cx: -3, cy: 5 },

    // Right broad multiplier branch
    { id:'evo_multi1',    name:'Symbiotic Bonds',    icon:'🤝', dnaCost: 8000,   requirement: 'evo_root',  type:'Multiplier',   effectValue: 0.10, cx: 2, cy: 8 },
    { id:'evo_multi2',    name:'Complex Organs',     icon:'🫀', dnaCost: 40000,  requirement: 'evo_multi1',  type:'Multiplier', effectValue: 0.20, cx: 2, cy: 7 },
    { id:'evo_hive_mind', name:'Hive Mind',          icon:'🐝', dnaCost: 85000,  requirement: 'evo_multi2', type:'Multiplier', effectValue: 0.35, cx: 3, cy: 6 },
    { id:'evo_collective',name:'Collective Genius',  icon:'🌌', dnaCost: 350000, requirement: 'evo_hive_mind', type:'Multiplier', effectValue: 0.75, cx: 3, cy: 5 },

    // Core Branching: Predator vs Herbivore (diet path)
    { id:'evo_path_predator',   name:'Path of the Predator',   icon:'🐅',  dnaCost: 30000,  requirement: 'evo_click3',   type:'Multiplier', effectValue: 0.25, pathGroup:'diet', cx: -1, cy: 5 },
    { id:'evo_path_herbivore',  name:'Path of the Herbivore',  icon:'🦕',  dnaCost: 30000,  requirement: 'evo_click3',   type:'Multiplier', effectValue: 0.25, pathGroup:'diet', cx: 1, cy: 5 },

    { id:'evo_predator_claws',  name:'Bony Jaws',            icon:'🦷', dnaCost: 90000,  requirement: 'evo_path_predator',  type:'Click Power',  effectValue: 15, pathGroup:'diet', cx: -1, cy: 4 },
    { id:'evo_predator_pack',   name:'Wolf Pack',            icon:'🐺', dnaCost: 250000, requirement: 'evo_predator_claws', type:'Multiplier',   effectValue: 0.40, pathGroup:'diet', cx: -1, cy: 3 },
    { id:'evo_predator_apex',   name:'Apex Predator',        icon:'🦈', dnaCost: 750000, requirement: 'evo_predator_pack', type:'Click Power', effectValue: 100, pathGroup:'diet', cx: -1, cy: 2 },

    { id:'evo_herbivore_grazer',name:'Insatiable Hoarder',   icon:'🦥', dnaCost: 90000,  requirement: 'evo_path_herbivore', type:'Passive DNA',  effectValue: 6, pathGroup:'diet', cx: 1, cy: 4 },
    { id:'evo_herbivore_herd',  name:'Herd Instinct',        icon:'🐘', dnaCost: 250000, requirement: 'evo_herbivore_grazer', type:'Multiplier',   effectValue: 0.40, pathGroup:'diet', cx: 1, cy: 3 },
    { id:'evo_herbivore_titan', name:'Colossal Titan',       icon:'🦕', dnaCost: 750000, requirement: 'evo_herbivore_herd', type:'Passive DNA', effectValue: 50, pathGroup:'diet', cx: 1, cy: 2 },

    // The Convergence
    { id:'evo_apex',            name:'Evolutionary Pinnacle',icon:'🦅', dnaCost: 2000000, requirement: ['evo_predator_apex', 'evo_herbivore_titan', 'evo_tardigrade', 'evo_collective', 'evo_enzyme_eff'], type:'Multiplier', effectValue: 1.50, cx: 0, cy: 1 },

    // THE BEST UPGRADE EVER
    { id:'evo_ultimate',        name:'Omnipotence',          icon:'✨', dnaCost: 15000000, requirement: 'evo_apex', type:'Ultimate', isUltimate: true, effectValue: 9.00, cx: 0, cy: 0 },
];

// ─── ПОСТИЖЕНИЯ (Achievements) ───────────────────
const ACHIEVEMENTS = [
    { id:'click1',     name:'First Molecule',     desc:'Make your first click.',           icon:'👆', check: g => g.totalClicks >= 1 },
    { id:'click100',   name:'Initial Organism',  desc:'100 clicks.',                        icon:'🖱️', check: g => g.totalClicks >= 100 },
    { id:'click1k',    name:'Diligent Replication',  desc:'1,000 clicks.',                     icon:'⚡', check: g => g.totalClicks >= 1000 },
    { id:'click10k',   name:'Eternal Clicker',        desc:'10,000 clicks.',                    icon:'💎', check: g => g.totalClicks >= 10000 },
    { id:'dna100',     name:'First Nucleotides',   desc:'Accumulate 100 DNA.',                 icon:'🧬', check: g => g.allTimeDNA >= 100 },
    { id:'dna10k',     name:'DNA Library',     desc:'Accumulate 10,000 DNA total.',         icon:'📚', check: g => g.allTimeDNA >= 10000 },
    { id:'dna1m',      name:'Genetic Power',       desc:'Accumulate 1,000,000 DNA total.',     icon:'🔥', check: g => g.allTimeDNA >= 1e6 },
    { id:'dna1b',      name:'Genome Archive',       desc:'Accumulate 1,000,000,000 DNA total.', icon:'🌟', check: g => g.allTimeDNA >= 1e9 },
    { id:'dps10',      name:'Automation',       desc:'Reach 10 DNA/sec.',             icon:'🏭', check: g => dps() >= 10 },
    { id:'dps100',     name:'Bio-factory',         desc:'Reach 100 DNA/sec.',            icon:'⚙️', check: g => dps() >= 100 },
    { id:'dps1k',      name:'Industrialization',    desc:'Reach 1,000 DNA/sec.',          icon:'🏗️', check: g => dps() >= 1000 },
    { id:'evo1',       name:'First Evolution',     desc:'Evolve for the first time.',            icon:'🌱', check: g => g.evoCount >= 1 },
    { id:'evo3',       name:'Adaptive Species',       desc:'Evolve 3 times.',               icon:'🌿', check: g => g.evoCount >= 3 },
    { id:'evo5',       name:'Dominant Organism', desc:'Evolve 5 times.',               icon:'🌳', check: g => g.evoCount >= 5 },
    { id:'evo10',      name:'Master of Evolution',desc:'Evolve 10 times.',              icon:'👑', check: g => g.evoCount >= 10 },
    { id:'leap1',      name:'Genomic Pioneer',     desc:'Make your first genomic leap.',      icon:'🚀', check: g => g.leapCount >= 1 },
    { id:'leap3',      name:'Genetic Tycoon',     desc:'Make 3 genomic leaps.',        icon:'🔬', check: g => g.leapCount >= 3 },
    { id:'frenzy1',    name:'Cosmic Radiation', desc:'Survive your first DNA wave.',      icon:'☄️', check: g => g.totalFrenzies >= 1 },
    { id:'frenzy5',    name:'Wave Veteran',  desc:'Survive 5 DNA waves.',            icon:'🌊', check: g => g.totalFrenzies >= 5 },
    { id:'rich',       name:'Mutant Collector', desc:'Hold 50 mutations at once.',  icon:'🧪', check: g => g.mutations >= 50 },
    { id:'win',        name:'Transhuman',           desc:'Reach the final stage.',         icon:'✨', check: g => g.hasWon },
    { id:'evo25',      name:'Master of All',        desc:'Evolve 25 times.',               icon:'🧬', check: g => g.evoCount >= 25 },
    { id:'leap5',      name:'Genomic Legend',       desc:'Make 5 genomic leaps.',           icon:'🔬', check: g => g.leapCount >= 5 },
    { id:'click100k',  name:'Obsessive Clicker',    desc:'100,000 clicks.',                icon:'🫨', check: g => g.totalClicks >= 100000 },
    { id:'dps10k',     name:'Transcendent Output',  desc:'Reach 10,000 DNA/sec.',          icon:'🚀', check: g => dps() >= 10000 },
    { id:'art4',       name:'Collector',            desc:'Find 4 artifacts.',              icon:'🦴', check: g => g.artifacts.length >= 4 },
    { id:'art8',       name:'Treasure Hunter',      desc:'Find 8 artifacts.',              icon:'💎', check: g => g.artifacts.length >= 8 },
    { id:'art12',      name:'Master Curator',       desc:'Find all 12 artifacts.',         icon:'🌟', check: g => g.artifacts.length >= 12 },
];

const ARTIFACTS = [
    // Common (0.10% drop rate)
    { id: 'a1', name: 'Fossilized Bone', icon: '🦴', rarity: 'common', desc: '+10% Click Power', effect: () => ({ clickMult: 1.1 }) },
    { id: 'a2', name: 'Amber Mosquito', icon: '🦟', rarity: 'common', desc: '+10% Passive Income', effect: () => ({ dpsMult: 1.1 }) },
    { id: 'a3', name: 'Crystalized Nucleus', icon: '💎', rarity: 'common', desc: '+5% Crit Chance', effect: () => ({ critChance: 0.05 }) },
    { id: 'a4', name: 'Ancient Feather', icon: '🪶', rarity: 'common', desc: '×1.2 Production', effect: () => ({ prodMult: 1.2 }) },
    // Rare (0.04% drop rate)
    { id: 'a5', name: 'Primordial Soup Vial', icon: '🧪', rarity: 'rare', desc: '+20% Passive Income', effect: () => ({ dpsMult: 1.2 }) },
    { id: 'a6', name: 'Meteorite Shard', icon: '☄️', rarity: 'rare', desc: '+25% Click Power', effect: () => ({ clickMult: 1.25 }) },
    { id: 'a7', name: 'Petrified Egg', icon: '🥚', rarity: 'rare', desc: '+8% Crit Chance', effect: () => ({ critChance: 0.08 }) },
    { id: 'a8', name: 'Trilobite Fossil', icon: '🐚', rarity: 'rare', desc: '×1.35 Production', effect: () => ({ prodMult: 1.35 }) },
    // Legendary (0.01% drop rate)
    { id: 'a9', name: 'Dragon Scale', icon: '🐉', rarity: 'legendary', desc: '+50% Click Power', effect: () => ({ clickMult: 1.5 }) },
    { id: 'a10', name: 'Phoenix Feather', icon: '🔥', rarity: 'legendary', desc: '×1.75 Production', effect: () => ({ prodMult: 1.75 }) },
    { id: 'a11', name: 'Cosmic Seed', icon: '🌟', rarity: 'legendary', desc: '+50% Passive Income', effect: () => ({ dpsMult: 1.5 }) },
    { id: 'a12', name: 'Time Crystal', icon: '⏳', rarity: 'legendary', desc: '+15% Crit Chance', effect: () => ({ critChance: 0.15 }) },
];
const RARITY_DROP = { common: 0.001, rare: 0.0004, legendary: 0.0001 };

const EVENTS = [
    { name: 'DNA Wave',       emoji: '⚡', text: '×3 production!',         mult: 3,   dur: 30 },
    { name: 'Mutation Boom',  emoji: '☢️', text: '×5 click power!',       mult: 5,   dur: 20, clickOnly: true },
    { name: 'Solar Flare',    emoji: '☀️', text: 'The sun erupts — ×2 production briefly.', mult: 2,   dur: 45 },
    { name: 'Ice Age',        emoji: '❄️', text: 'Production drops, but mutations are doubled!', mult: 0.35, dur: 35, mutGainMult: 2 },
    { name: 'Genetic Drift',  emoji: '🎲', text: 'Chaotic changes — ×4 production!', mult: 4,   dur: 15 },
    { name: 'Genetic Puzzle', emoji: '🧬', text: 'Solve the sequence for a permanent boost!', type: 'puzzle' },
    { name: 'Symbiotic Surge',emoji: '🤝', text: '×2 production for 60s!',  mult: 2,   dur: 60 },
    { name: 'Extinction Event',emoji:'💀', text: 'Production halved, but ×3 mutations!', mult: 0.5, dur: 40, mutGainMult: 3 },
    { name: 'Golden Gene',    emoji: '✨', text: '×6 click power for 10s!', mult: 6,   dur: 10, clickOnly: true },
    { name: 'Primordial Rain', emoji:'🌧️', text: '×2.5 production for 25s!', mult: 2.5, dur: 25 },
];

const SAVE_KEY   = 'evoGenesis_v3';
const EVO_BASE   = 1000;
const EVO_GROWTH = 8;
const LEAP_REQ   = 5;

// ─── MILESTONES ────────────────────────────────
const MILESTONES = [
    { id:'ms1', name:'Persistent Clicker',  desc:'Auto-click 1×/sec',            icon:'🤖', type:'evo',  req:3,  autoClick:1 },
    { id:'ms2', name:'Rapid Adaptation',    desc:'+10% all production',           icon:'⚡', type:'evo',  req:5,  prodBonus:0.10 },
    { id:'ms3', name:'Genetic Memory',      desc:'Keep 10% DNA on evolution',     icon:'🧠', type:'evo',  req:10, dnaRetain:0.10 },
    { id:'ms4', name:'Eternal Evolution',   desc:'+25% mutation gain',            icon:'♾️', type:'evo',  req:15, mutBonus:0.25 },
    { id:'ms5', name:'Cosmic Awareness',    desc:'Auto-click 3×/sec',             icon:'🌌', type:'evo',  req:25, autoClick:3 },
    { id:'ms6', name:'Genome Pioneer',      desc:'+20% all production',           icon:'🔬', type:'leap', req:1,  prodBonus:0.20 },
    { id:'ms7', name:'Genomic Master',      desc:'-15% all costs',                icon:'🧬', type:'leap', req:3,  costReduce:0.15 },
    { id:'ms8', name:'Transcendent',        desc:'Auto-click 5×/sec',             icon:'✨', type:'leap', req:5,  autoClick:5 },
];

function isMilestoneUnlocked(m) {
    if (m.type === 'evo') return G.evoCount >= m.req;
    if (m.type === 'leap') return G.leapCount >= m.req;
    return false;
}
function getAutoClickRate() {
    let rate = 0;
    MILESTONES.forEach(m => { if (m.autoClick && isMilestoneUnlocked(m)) rate = Math.max(rate, m.autoClick); });
    return rate;
}
function milestoneProdMult() {
    let m = 1;
    MILESTONES.forEach(ms => { if (ms.prodBonus && isMilestoneUnlocked(ms)) m *= (1 + ms.prodBonus); });
    return m;
}
function milestoneMutMult() {
    let m = 1;
    MILESTONES.forEach(ms => { if (ms.mutBonus && isMilestoneUnlocked(ms)) m *= (1 + ms.mutBonus); });
    return m;
}
function milestoneCostMult() {
    let m = 1;
    MILESTONES.forEach(ms => { if (ms.costReduce && isMilestoneUnlocked(ms)) m *= (1 - ms.costReduce); });
    return m;
}
function milestoneDnaRetain() {
    let r = 0;
    MILESTONES.forEach(ms => { if (ms.dnaRetain && isMilestoneUnlocked(ms)) r = Math.max(r, ms.dnaRetain); });
    return r;
}

// ─── SOUND SYSTEM ──────────────────────────────
const SFX = {
    ctx: null,
    init() { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {} },
    play(freq, dur, type = 'sine', vol = 0.12) {
        if (!G.settings.sound || !this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = type; o.frequency.value = freq;
        g.gain.setValueAtTime(vol, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
        o.connect(g); g.connect(this.ctx.destination);
        o.start(); o.stop(this.ctx.currentTime + dur);
    },
    click()   { this.play(600, 0.06, 'sine', 0.08); },
    crit()    { this.play(800, 0.12, 'square', 0.08); setTimeout(() => this.play(1200, 0.08, 'sine', 0.06), 50); },
    buy()     { this.play(500, 0.08, 'triangle', 0.07); },
    evolve()  { this.play(400, 0.25, 'sine', 0.10); setTimeout(() => this.play(600, 0.25, 'sine', 0.10), 80); setTimeout(() => this.play(800, 0.3, 'sine', 0.10), 160); },
    achieve() { this.play(700, 0.12, 'sine', 0.08); setTimeout(() => this.play(900, 0.15, 'sine', 0.08), 80); },
    artifact(){ this.play(500, 0.15, 'sine', 0.08); setTimeout(() => this.play(700, 0.12, 'sine', 0.08), 60); setTimeout(() => this.play(1000, 0.2, 'sine', 0.06), 130); },
    event()   { this.play(300, 0.15, 'triangle', 0.08); setTimeout(() => this.play(500, 0.15, 'triangle', 0.08), 120); },
};

// ─── NOTIFICATION LOG ──────────────────────────
const notifLog = [];
const MAX_LOG = 50;
function logNotif(icon, title, desc) {
    notifLog.unshift({ icon, title, desc, time: new Date().toLocaleTimeString() });
    if (notifLog.length > MAX_LOG) notifLog.pop();
}

// ─── EXPORT / IMPORT ───────────────────────────
function exportSave() {
    save();
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) return;
    const encoded = btoa(unescape(encodeURIComponent(data)));
    navigator.clipboard.writeText(encoded).then(() => {
        showToast('event-toast', '📋', 'Exported!', 'Save code copied to clipboard.');
    }).catch(() => {
        prompt('Copy this save code:', encoded);
    });
}
function importSave() {
    const code = prompt('Paste your save code:');
    if (!code || !code.trim()) return;
    try {
        const decoded = decodeURIComponent(escape(atob(code.trim())));
        JSON.parse(decoded);
        localStorage.setItem(SAVE_KEY, decoded);
        location.reload();
    } catch(e) {
        alert('Invalid save code!');
    }
}

// ─── КЕШИРАНИ DOM ЕЛЕМЕНТИ ──────────────────────
const DOM = {};
function cacheDom() {
    DOM.dnaVal = document.getElementById('dna-val');
    DOM.mutVal = document.getElementById('mut-val');
    DOM.genVal = document.getElementById('gen-val');
    DOM.mutBox = document.getElementById('mut-box');
    DOM.genBox = document.getElementById('gen-box');
    DOM.tabMut = document.getElementById('tab-mut');
    DOM.tabGen = document.getElementById('tab-gen');
    DOM.tabTree = document.getElementById('tab-tree');
    DOM.stageName = document.getElementById('stage-name');
    DOM.stageIcon = document.getElementById('stage-icon');
    DOM.organism = document.getElementById('organism');
    DOM.sClick = document.getElementById('s-click');
    DOM.sDps = document.getElementById('s-dps');
    DOM.sMult = document.getElementById('s-mult');
    DOM.sTotal = document.getElementById('s-total');
    DOM.clickSub = document.getElementById('click-sub');
    DOM.evoFill = document.getElementById('evo-fill');
    DOM.evoText = document.getElementById('evo-text');
    DOM.evoBtn = document.getElementById('evo-btn');
    DOM.evoInfo = document.getElementById('evo-info');
    DOM.leapBtn = document.getElementById('leap-btn');
    DOM.leapInfo = document.getElementById('leap-info');
    DOM.fEvo = document.getElementById('f-evo');
    DOM.fLeap = document.getElementById('f-leap');
    DOM.fPlaytime = document.getElementById('f-playtime');
    DOM.eventBanner = document.getElementById('event-banner');
    DOM.eventText = document.getElementById('event-text');
    DOM.eventTimer = document.getElementById('event-timer');
    DOM.clickBtn = document.getElementById('click-btn');
    DOM.floats = document.getElementById('floats');
    DOM.toasts = document.getElementById('toasts');
    DOM.modalOverlay = document.getElementById('modal-overlay');
    DOM.modalTitle = document.getElementById('modal-title');
    DOM.modalBody = document.getElementById('modal-body');
    DOM.tDna = document.getElementById('t-dna');
    DOM.tMut = document.getElementById('t-mut');
    DOM.tTree = document.getElementById('t-tree');
    DOM.tGen = document.getElementById('t-gen');
    DOM.bgContainer = document.getElementById('bg-container');
    DOM.tabCol = document.getElementById('tab-col');
    DOM.artifactGrid = document.getElementById('artifact-grid');
}

// ─── ADAPTIVE BIOMES ───────────────────────────
function updateBiome() {
    if (!DOM.bgContainer) return;
    let biome = 'biome-soup';
    if (G.evoCount >= 7) biome = 'biome-galactic';
    else if (G.evoCount >= 3) biome = 'biome-land';
    
    if (!document.body.classList.contains(biome)) {
        document.body.classList.remove('biome-soup', 'biome-land', 'biome-galactic');
        document.body.classList.add(biome);
    }
}

// ─── BACKGROUND ENTITIES ───────────────────────
const bgEntities = [];
const BIOME_EMOJIS = {
    'biome-soup': ['🦠', '🫧', '🧬', '💧'],
    'biome-land': ['🦋', '🌱', '🦟', '🍃'],
    'biome-galactic': ['✨', '☄️', '🌌', '⭐']
};

function initBgEntities() {
    if (!DOM.bgContainer) return;
    for (let i = 0; i < 15; i++) {
        const el = document.createElement('div');
        el.className = 'bg-entity';
        const biome = 'biome-soup';
        el.textContent = BIOME_EMOJIS[biome][0];
        DOM.bgContainer.appendChild(el);
        
        const en = {
            el,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            biome: 'biome-soup'
        };
        bgEntities.push(en);
    }
    requestAnimationFrame(tickBgEntities);
}

function tickBgEntities() {
    if (!DOM.bgContainer) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const currentBiome = Array.from(document.body.classList).find(c => c.startsWith('biome-')) || 'biome-soup';

    bgEntities.forEach(en => {
        if (en.biome !== currentBiome) {
            en.biome = currentBiome;
            const emojis = BIOME_EMOJIS[currentBiome];
            en.el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        }
        en.x += en.vx; en.y += en.vy;
        if (en.x < -50) en.x = vw + 50; if (en.x > vw + 50) en.x = -50;
        if (en.y < -50) en.y = vh + 50; if (en.y > vh + 50) en.y = -50;
        en.el.style.transform = `translate(${en.x}px, ${en.y}px)`;
    });
    requestAnimationFrame(tickBgEntities);
}

// ─── СЪСТОЯНИЕ ──────────────────────────────────
function defaults() {
    return {
        dna: 0, totalDNA: 0, allTimeDNA: 0,
        mutations: 0, totalMutations: 0,
        genomes: 0,
        du: { replicase:0, ribosome:0, mitochondria:0, enzyme:0, division:0 },
        mu: { adaptation:0, mutagenesis:0, geneExpr:0, chromosome:0, selection:0 },
        gu: { cambrian:0, symbiogenesis:0, epigenetics:0, engineering:0 },
        evoSkills: {},
        evoCount: 0, leapCount: 0,
        hasWon: false,
        traits: {},
        puzzleMult: 1,
        artifacts: [],
        totalClicks: 0,
        totalFrenzies: 0,
        startTime: Date.now(),
        totalPlayTime: 0,   // ms
        achUnlocked: [],
        settings: { confirmEvo: true, confirmLeap: true, particles: true, notation: 'short', sound: true },
        lastTick: Date.now(),
    };
}
let G = defaults();
let buyQty = 1; // 1, 10, 25, 'max'
let activeEvent = null; // { type, endTime }
let _lastAchCheck = 0; // throttle achievement checks

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
    if (sec < 60) return Math.floor(sec) + ' sec';
    if (sec < 3600) return Math.floor(sec / 60) + ' min';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return h + ' h ' + m + ' min';
}

// ─── КАЛКУЛАЦИИ ────────────────────────────────
function dnaCostMult()  { 
    const baseMult = Math.max(0.5, 1 - 0.05 * G.mu.selection);
    const leapMult = Math.pow(0.95, G.leapCount);
    const enzymeMult = evoEnzymeMult();
    const traitMult = G.traits?.t4 ? 0.8 : 1;
    return baseMult * leapMult * enzymeMult * traitMult * milestoneCostMult();
}
function mutCostMult()  { 
    const baseMult = Math.max(0.4, 1 - 0.15 * G.gu.epigenetics);
    const leapMult = Math.pow(0.95, G.leapCount);
    const enzymeMult = evoEnzymeMult();
    const traitMult = G.traits?.t4 ? 0.8 : 1;
    return baseMult * leapMult * enzymeMult * traitMult * milestoneCostMult();
}
function eventMultAll() { return (activeEvent && !activeEvent.clickOnly) ? activeEvent.mult : 1; }
function eventMultClk() { return (activeEvent && activeEvent.clickOnly) ? activeEvent.mult : 1; }
function eventMutGainMult() { return (activeEvent && activeEvent.mutGainMult) ? activeEvent.mutGainMult : 1; }

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
    let m = 1;
    G.artifacts.forEach(id => {
        const a = ARTIFACTS.find(x => x.id === id);
        if (a && a.effect(G).prodMult) m *= a.effect(G).prodMult;
    });
    const enz  = Math.pow(1.25, G.du.enzyme);
    const div  = Math.pow(1.50, G.du.division);
    const camb = Math.pow(2.00, G.gu.cambrian);
    return enz * div * camb * evoGlobalMult() * eventMultAll() * G.puzzleMult * m * milestoneProdMult();
}
function clickPow() {
    let m = 1;
    G.artifacts.forEach(id => {
        const a = ARTIFACTS.find(x => x.id === id);
        if (a && a.effect(G).clickMult) m *= a.effect(G).clickMult;
    });
    const base = 1 + G.du.replicase + evoClickBonusFlat();
    const mBon = 1 + 0.30 * G.mu.mutagenesis;
    const traitMult = G.traits?.t1 ? 1.5 : 1;
    return base * mBon * prodMult() * eventMultClk() * traitMult * m;
}
function dps() {
    let m = 1;
    G.artifacts.forEach(id => {
        const a = ARTIFACTS.find(x => x.id === id);
        if (a && a.effect(G).dpsMult) m *= a.effect(G).dpsMult;
    });
    const base = G.du.ribosome * 0.5 + G.du.mitochondria * 3 + evoDpsBonusFlat();
    const mBon = 1 + 0.30 * G.mu.geneExpr;
    const traitMult = G.traits?.t2 ? 1.4 : 1;
    return base * mBon * prodMult() * traitMult * m;
}

// ─── EVOLUTION TREE EFFECTS ───────────────────
function hasSkill(id) {
    return !!(G.evoSkills && G.evoSkills[id]);
}

function evoClickBonusFlat() {
    if (!G.evoSkills) return 0;
    let add = 0;
    evolutionTree.forEach(s => {
        if (hasSkill(s.id) && s.type === 'Click Power') add += s.effectValue || 0;
    });
    return add;
}

function evoDpsBonusFlat() {
    if (!G.evoSkills) return 0;
    let add = 0;
    evolutionTree.forEach(s => {
        if (hasSkill(s.id) && s.type === 'Passive DNA') add += s.effectValue || 0;
    });
    return add;
}

function evoGlobalMult() {
    if (!G.evoSkills) return 1;
    let m = 1;
    evolutionTree.forEach(s => {
        if (hasSkill(s.id) && (s.type === 'Multiplier' || s.type === 'Ultimate')) m *= 1 + (s.effectValue || 0);
    });
    return m;
}

function evoEnzymeMult() {
    if (!G.evoSkills) return 1;
    let m = 1;
    evolutionTree.forEach(s => {
        if (hasSkill(s.id) && s.type === 'Cost Reduction') m *= 1 - (s.effectValue || 0);
    });
    return m;
}

function evoThresh() { return EVO_BASE * Math.pow(EVO_GROWTH, G.evoCount); }
function mutGain()   {
    const raw  = Math.floor(Math.pow(G.totalDNA / 100, 0.5));
    const cBon = 1 + 0.25 * G.mu.chromosome;
    const sBon = 1 + 0.50 * G.gu.symbiogenesis;
    return Math.max(1, Math.floor(raw * cBon * sBon * eventMutGainMult() * milestoneMutMult()));
}
function genGain() { return Math.max(1, Math.floor(Math.pow(G.totalMutations / 5, 0.5))); }
function canEvo()  { return G.totalDNA >= evoThresh(); }
function canLeap() { return G.evoCount >= LEAP_REQ; }

function dnaEffect(i) {
    const lv = G.du[DNA_UPG[i].id];
    switch (i) {
        case 0: return 'Current: +' + lv + ' DNA/click';
        case 1: return 'Current: +' + (lv * 0.5).toFixed(1) + ' DNA/sec';
        case 2: return 'Current: +' + (lv * 3) + ' DNA/sec';
        case 3: return 'Current: ×' + Math.pow(1.25, lv).toFixed(2);
        case 4: return 'Current: ×' + Math.pow(1.50, lv).toFixed(2);
    }
}
function mutEffect(i) {
    const lv = G.mu[MUT_UPG[i].id];
    switch (i) {
        case 0: return 'Current: +' + (lv * 100) + ' starting DNA';
        case 1: return 'Current: +' + (lv * 30) + '% click bonus';
        case 2: return 'Current: +' + (lv * 30) + '% auto bonus';
        case 3: return 'Current: +' + (lv * 25) + '% mutations';
        case 4: return 'Current: -' + Math.min(lv * 5, 50) + '% DNA costs';
    }
}
function genEffect(i) {
    const lv = G.gu[GEN_UPG[i].id];
    switch (i) {
        case 0: return 'Current: ×' + Math.pow(2, lv).toFixed(0) + ' production';
        case 1: return 'Current: +' + (lv * 50) + '% mutations';
        case 2: return 'Current: -' + Math.min(lv * 15, 60) + '% mut. costs';
        case 3: return 'Current: +' + (lv * 2) + ' starting mutations';
    }
}

// ─── ДЕЙСТВИЯ ──────────────────────────────────
function doClick(e) {
    let addCrit = 0;
    G.artifacts.forEach(id => {
        const a = ARTIFACTS.find(x => x.id === id);
        if (a && a.effect(G).critChance) addCrit += a.effect(G).critChance;
    });
    const isCrit = Math.random() < (0.05 + addCrit);
    const critLevel = G.traits?.t3 ? 5 : 3;
    const critMult = isCrit ? critLevel : 1;
    const pw = clickPow() * critMult;
    
    G.dna += pw; G.totalDNA += pw; G.allTimeDNA += pw; G.totalClicks++;
    if (isCrit) SFX.crit(); else SFX.click();
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top;
    
    const txt = (isCrit ? '✨ CRIT! +' : '+') + fmt(pw);
    spawnFloat(txt, cx + (Math.random() - 0.5) * 50, cy - 5, isCrit);
    
    if (G.settings.particles) spawnParticles(e.clientX || cx, e.clientY || (cy + rect.height / 2), isCrit ? 10 : 4);
    throttledAchCheck();
    if (DOM.dnaVal) DOM.dnaVal.textContent = fmt(G.dna);
    tryDropArtifact();
}

function buyDNA(i) {
    const { count, total } = costBulk(costDNA, i, 'du', DNA_UPG, G.dna, buyQty);
    if (count > 0 && G.dna >= total) { G.dna -= total; G.du[DNA_UPG[i].id] += count; SFX.buy(); buildShop(); }
}
function buyMut(i) {
    const u = MUT_UPG[i];
    if (u.max && G.mu[u.id] >= u.max) return;
    const { count, total } = costBulk(costMut, i, 'mu', MUT_UPG, G.mutations, buyQty);
    if (count > 0 && G.mutations >= total) { G.mutations -= total; G.mu[u.id] += count; SFX.buy(); buildShop(); }
}
function buyGen(i) {
    const u = GEN_UPG[i];
    if (u.max && G.gu[u.id] >= u.max) return;
    const { count, total } = costBulk(costGen, i, 'gu', GEN_UPG, G.genomes, buyQty);
    if (count > 0 && G.genomes >= total) { G.genomes -= total; G.gu[u.id] += count; SFX.buy(); buildShop(); }
}

// ─── EVOLUTION TREE BUY LOGIC ─────────────────
function hasPathConflict(node) {
    if (!node.pathGroup) return false;
    const groupNodes = evolutionTree.filter(n => n.pathGroup === node.pathGroup);
    const mySubPath = node.cx;
    const otherSubPathNodes = groupNodes.filter(n => n.cx !== mySubPath);
    
    // Check if the other path has any bought skills
    const otherPurchased = otherSubPathNodes.filter(n => isSkillPurchased(n));
    if (otherPurchased.length === 0) return false; // No conflict
    
    // If the other path was touched, it's a conflict UNLESS they reached the very bottom capstone
    const maxOtherCy = Math.max(...otherSubPathNodes.map(n => n.cy));
    const isOtherMaxed = otherSubPathNodes.some(n => n.cy === maxOtherCy && isSkillPurchased(n));
    
    return !isOtherMaxed; // If other is not maxed out, there is a conflict
}

function isSkillUnlocked(node) {
    if (!node.requirement) return true;
    if (Array.isArray(node.requirement)) {
        return node.requirement.some(req => hasSkill(req));
    }
    return hasSkill(node.requirement);
}

function isSkillPurchased(node) {
    return hasSkill(node.id);
}

function canBuySkill(node) {
    if (isSkillPurchased(node)) return false;
    if (!isSkillUnlocked(node)) return false;
    if (hasPathConflict(node)) return false;
    return G.dna >= node.dnaCost;
}

function buyEvolutionSkill(id) {
    const node = evolutionTree.find(n => n.id === id);
    if (!node) return;
    if (!canBuySkill(node)) return;
    G.dna -= node.dnaCost;
    if (!G.evoSkills) G.evoSkills = {};
    G.evoSkills[id] = true;
    showToast('tree-toast', '🌿', 'New DNA Skill', `${node.name} was unlocked.`, 3500);
    buildShop();
    updateUI();

    // Pulse animation
    const btn = document.querySelector(`.evo-skill[data-id="${id}"]`);
    if (btn) {
        btn.classList.add('skill-bought-anim');
        setTimeout(() => btn.classList.remove('skill-bought-anim'), 600);
    }
}

function evolve() {
    if (!canEvo()) return;
    const gain = mutGain();
    if (G.settings.confirmEvo) {
        if (!confirm(`🧬 Evolution Leap!\n\nYou will gain: +${gain} mutations\nYou will lose: all DNA points and DNA upgrades.\n\nContinue?`)) return;
    }
    G.mutations += gain; G.totalMutations += gain; G.evoCount++;
    const retainPct = milestoneDnaRetain();
    const retainedDNA = retainPct > 0 ? Math.floor(G.dna * retainPct) : 0;
    G.dna = G.mu.adaptation * 100 + retainedDNA; G.totalDNA = 0;
    SFX.evolve();
    G.du = { replicase:0, ribosome:0, mitochondria:0, enzyme:0, division:0 };
    flashScreen();
    showToast('evo-toast', '🧬', 'Evolution!', `+${fmt(gain)} mutations · Stage: ${STAGES[Math.min(G.evoCount, STAGES.length-1)].name}`);
    const si = Math.min(G.evoCount, STAGES.length - 1);
    if (si === STAGES.length - 1 && !G.hasWon) {
        G.hasWon = true;
        setTimeout(() => showToast('ach-toast', '🎉', 'Victory!', `Reached "${STAGES[si].name}"! The game continues...`), 500);
    }
    checkAchievements(); buildShop(); updateUI(); buildTimeline();
}

function genomeLeap() {
    if (!canLeap()) return;
    const gain = genGain();
    if (G.settings.confirmLeap) {
        if (!confirm(`🔬 Genomic Leap!\n\nYou will gain: +${gain} genomes\nYou will lose: EVERYTHING except genome upgrades.\n\nContinue?`)) return;
    }
    const savedGU = { ...G.gu }, savedLC = G.leapCount + 1, savedGems = G.genomes + gain;
    const savedAT = G.allTimeDNA, savedWon = G.hasWon;
    const savedClicks = G.totalClicks, savedFrenzies = G.totalFrenzies;
    const savedStart = G.startTime, savedPlayTime = G.totalPlayTime;
    const savedAch = [...G.achUnlocked], savedSettings = { ...G.settings };
    const savedSkills = { ...(G.evoSkills || {}) }; // persist skills

    G = defaults();
    G.gu = savedGU; G.leapCount = savedLC; G.genomes = savedGems;
    G.allTimeDNA = savedAT; G.hasWon = savedWon;
    G.mutations = G.gu.engineering * 2;
    G.totalClicks = savedClicks; G.totalFrenzies = savedFrenzies;
    G.startTime = savedStart; G.totalPlayTime = savedPlayTime;
    G.achUnlocked = savedAch; G.settings = savedSettings;
    G.evoSkills = savedSkills; // restore skills

    flashScreen();
    SFX.evolve();
    showToast('evo-toast', '🔬', 'Genomic Leap!', `+${fmt(gain)} genomes`);
    checkAchievements(); buildShop(); updateUI(); buildTimeline();
}

// ─── FLOATING TEXT & PARTICLES ─────────────────
const effectPools = { ft: [], particle: [] };

function getEffectEl(type, className) {
    if (effectPools[type].length > 0) {
        const el = effectPools[type].pop();
        el.style.animation = 'none';
        void el.offsetWidth; // trigger reflow
        el.style.animation = null;
        return el;
    }
    const el = document.createElement('div');
    el.className = className;
    DOM.floats.appendChild(el);
    return el;
}

function releaseEffectEl(type, el) {
    el.style.left = '-999px';
    el.style.top = '-999px';
    effectPools[type].push(el);
}

function spawnFloat(txt, x, y, isCrit = false) {
    const el = getEffectEl('ft', 'ft');
    el.textContent = txt;
    if (isCrit) el.classList.add('crit');
    else el.classList.remove('crit');
    el.style.left = x + 'px'; el.style.top = y + 'px';
    setTimeout(() => releaseEffectEl('ft', el), 900);
}

function spawnParticles(x, y, n) {
    for (let i = 0; i < n; i++) {
        const p = getEffectEl('particle', 'particle');
        const angle = Math.random() * Math.PI * 2;
        const dist = 40 + Math.random() * 60;
        p.style.left = x + 'px'; p.style.top = y + 'px';
        p.style.setProperty('--px', Math.cos(angle) * dist + 'px');
        p.style.setProperty('--py', Math.sin(angle) * dist + 'px');
        setTimeout(() => releaseEffectEl('particle', p), 600);
    }
}

function flashScreen() {
    document.body.classList.add('evo-flash');
    setTimeout(() => document.body.classList.remove('evo-flash'), 600);
}

// ─── TOAST NOTIFICATIONS ───────────────────────
function showToast(cls, icon, title, desc, duration) {
    const t = document.createElement('div');
    t.className = 'toast ' + cls;
    t.innerHTML = `<span class="toast-ico">${icon}</span><div class="toast-body"><div class="toast-title">${title}</div><div class="toast-desc">${desc}</div></div>`;
    DOM.toasts.appendChild(t);
    const dur = duration || 4000;
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, dur);
    logNotif(icon, title, desc);
}

// ─── ACHIEVEMENTS ──────────────────────────────
function checkAchievements() {
    const unlocked = G.achUnlocked;
    for (let i = 0; i < ACHIEVEMENTS.length; i++) {
        const a = ACHIEVEMENTS[i];
        if (unlocked.includes(a.id)) continue;
        if (a.check(G)) {
            unlocked.push(a.id);
            showToast('ach-toast', '🏆', a.name, a.desc, 5000);
            SFX.achieve();
        }
    }
}
function throttledAchCheck() {
    const now = performance.now();
    if (now - _lastAchCheck > 2000) {
        _lastAchCheck = now;
        checkAchievements();
    }
}

// ─── RANDOM EVENTS ─────────────────────────────
let eventTimer = null;
function trySpawnEvent() {
    if (activeEvent) return;
    if (dps() < 1 && G.totalClicks < 10) return;
    if (Math.random() > 0.15) return;
    const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    if (ev.type === 'puzzle') {
        startGeneticPuzzle();
        return;
    }
    activeEvent = { ...ev, endTime: Date.now() + ev.dur * 1000 };
    G.totalFrenzies++;
    DOM.eventBanner.classList.remove('hidden');
    DOM.eventText.textContent = ev.name + '! ' + ev.text;
    DOM.clickBtn.classList.add('frenzy');
    showToast('event-toast', ev.emoji, ev.name, ev.text + ` (${ev.dur} sec)`, 3000);
    SFX.event();
    checkAchievements();
}
function updateEvent() {
    if (!activeEvent) return;
    const rem = Math.max(0, (activeEvent.endTime - Date.now()) / 1000);
    DOM.eventTimer.textContent = Math.ceil(rem) + 's';
    if (rem <= 0) {
        activeEvent = null;
        DOM.eventBanner.classList.add('hidden');
        DOM.clickBtn.classList.remove('frenzy');
    }
}

// ─── UI: SHOP ──────────────────────────────────
function buildShop() { buildDNATab(); buildMutTab(); buildTreeTab(); buildGenTab(); }

function makeUpgBtn(cls, name, desc, effect, lvl, costStr, disabled, maxed, onClick) {
    const b = document.createElement('button');
    b.className = 'upg ' + cls + (maxed ? ' maxed' : '');
    b.disabled = disabled || maxed;
    b.innerHTML =
        `<div class="upg-name">${name}</div>` +
        `<div class="upg-desc">${desc}</div>` +
        `<div class="upg-effect">${effect}</div>` +
        `<div class="upg-foot"><span class="upg-lvl">${maxed ? 'MAX' : 'Level: ' + lvl}</span><span class="upg-cost">${costStr}</span></div>`;
    if (!maxed) b.addEventListener('click', onClick);
    return b;
}

function bulkLabel(count, total, symbol, color) {
    if (count <= 0) return `<span class="${color}">—</span>`;
    const suffix = count > 1 ? ` (×${count})` : '';
    return `<span class="${color}">${symbol} ${fmt(total)}${suffix}</span>`;
}

function buildDNATab() {
    const el = DOM.tDna; el.innerHTML = '';
    const frag = document.createDocumentFragment();
    DNA_UPG.forEach((u, i) => {
        const { count, total } = costBulk(costDNA, i, 'du', DNA_UPG, G.dna, buyQty);
        frag.appendChild(makeUpgBtn('dna-u', u.name, u.desc, dnaEffect(i), G.du[u.id],
            bulkLabel(count, total, '🧬', 'dna-cost'), G.dna < total || count <= 0, false, () => buyDNA(i)));
    });
    el.appendChild(frag);
}
function buildMutTab() {
    const el = DOM.tMut; el.innerHTML = '';
    if (G.evoCount === 0 && G.mutations === 0 && G.leapCount === 0) {
        el.innerHTML = '<div class="lock-msg"><span class="lock-emoji">🔒</span>Evolve at least once<br>to unlock mutations!</div>';
        return;
    }
    const frag = document.createDocumentFragment();
    MUT_UPG.forEach((u, i) => {
        const mx = u.max && G.mu[u.id] >= u.max;
        const { count, total } = mx ? {count:0,total:0} : costBulk(costMut, i, 'mu', MUT_UPG, G.mutations, buyQty);
        frag.appendChild(makeUpgBtn('mut-u', u.name, u.desc, mutEffect(i), G.mu[u.id],
            mx ? '—' : bulkLabel(count, total, '🧪', 'mut-cost'), G.mutations < total || count <= 0, mx, () => buyMut(i)));
    });
    el.appendChild(frag);

    // Traits Section
    const traitHeader = document.createElement('div');
    traitHeader.className = 'section-header';
    traitHeader.innerHTML = '<h3>Specialized Traits</h3><p>Unique permanent modifications</p>';
    el.appendChild(traitHeader);

    const traitGrid = document.createElement('div');
    traitGrid.className = 'trait-grid';
    TRAITS.forEach(t => {
        const canAfford = G.mutations >= t.cost;
        const isLocked = !t.check(G);
        const isBought = G.traits[t.id];
        
        const btn = document.createElement('button');
        btn.className = `trait-btn ${isBought ? 'bought' : ''} ${isLocked ? 'locked' : ''} ${canAfford ? 'affordable' : ''}`;
        btn.disabled = isLocked || isBought || !canAfford;
        btn.innerHTML = `
            <div class="trait-name">${t.name}</div>
            <div class="trait-desc">${t.desc}</div>
            <div class="trait-cost">${isBought ? 'OWNED' : (isLocked ? 'LOCKED' : '🧪 ' + t.cost)}</div>
        `;
        btn.onclick = () => buyTrait(t.id);
        traitGrid.appendChild(btn);
    });
    el.appendChild(traitGrid);
}
function buildGenTab() {
    const el = DOM.tGen; el.innerHTML = '';
    if (G.leapCount === 0 && G.genomes === 0) {
        el.innerHTML = '<div class="lock-msg"><span class="lock-emoji">🔒</span>Make a genomic leap<br>to unlock genomes!</div>';
        return;
    }
    const frag = document.createDocumentFragment();
    GEN_UPG.forEach((u, i) => {
        const mx = u.max && G.gu[u.id] >= u.max;
        const { count, total } = mx ? {count:0,total:0} : costBulk(costGen, i, 'gu', GEN_UPG, G.genomes, buyQty);
        frag.appendChild(makeUpgBtn('gen-u', u.name, u.desc, genEffect(i), G.gu[u.id],
            mx ? '—' : bulkLabel(count, total, '🔬', 'gen-cost'), G.genomes < total || count <= 0, mx, () => buyGen(i)));
    });
    el.appendChild(frag);
}

// ─── UI: UPDATE ────────────────────────────────
function updateUI() {
    DOM.dnaVal.textContent = fmt(G.dna);
    DOM.mutVal.textContent = fmt(G.mutations);
    DOM.genVal.textContent = fmt(G.genomes);

    const mutVis = G.evoCount > 0 || G.mutations > 0 || G.leapCount > 0;
    const genVis = G.leapCount > 0 || G.genomes > 0;
    DOM.mutBox.classList.toggle('hidden', !mutVis);
    DOM.genBox.classList.toggle('hidden', !genVis);
    if (mutVis) {
        DOM.tabMut.classList.remove('locked');
        DOM.tabMut.textContent = '🧪 Mutations';
        DOM.tabTree.classList.remove('locked');
        DOM.tabTree.textContent = '🌿 Skill Tree';
    }
    if (genVis) { DOM.tabGen.classList.remove('locked'); DOM.tabGen.textContent = '🔬 Genomes'; }

    const si = Math.min(G.evoCount, STAGES.length - 1);
    DOM.stageName.textContent = STAGES[si].name;
    DOM.stageIcon.textContent = STAGES[si].icon;
    DOM.organism.textContent   = STAGES[si].icon;

    const cpw = clickPow();
    DOM.sClick.textContent = fmt(cpw);
    DOM.sDps.textContent   = fmt(dps());
    DOM.sMult.textContent  = '×' + prodMult().toFixed(2);
    DOM.sTotal.textContent = fmt(G.totalDNA);
    DOM.clickSub.textContent = '+' + fmt(cpw) + ' DNA';

    const th = evoThresh(), pct = Math.min(G.totalDNA / th, 1);
    DOM.evoFill.style.width = (pct * 100) + '%';
    DOM.evoText.textContent = fmt(G.totalDNA) + ' / ' + fmt(th);

    const canE = canEvo();
    DOM.evoBtn.disabled = !canE;
    DOM.evoBtn.classList.toggle('ready', canE);
    DOM.evoInfo.textContent =
        canE ? '+' + fmt(mutGain()) + ' mutations' : 'Needed: ' + fmt(th) + ' DNA';

    if (G.evoCount >= 3 || G.leapCount > 0) {
        DOM.leapBtn.classList.remove('hidden');
        const canL = canLeap();
        DOM.leapBtn.disabled = !canL;
        DOM.leapBtn.classList.toggle('ready', canL);
        DOM.leapInfo.textContent =
            canL ? '+' + fmt(genGain()) + ' genomes' : `Needed: ${LEAP_REQ} evolutions (${G.evoCount}/${LEAP_REQ})`;
    }

    DOM.fEvo.textContent  = G.evoCount;
    DOM.fLeap.textContent = G.leapCount;

    // Playtime
    const pt = (G.totalPlayTime + Date.now() - G.startTime) / 1000;
    DOM.fPlaytime.textContent = 'Time: ' + fmtTime(pt);

    updateShopState();
    updateEvent();
    updateBiome();
}

function updateShopState() {
    document.querySelectorAll('#t-dna .upg').forEach((b, i) => {
        if (b.classList.contains('maxed')) return;
        const { count, total } = costBulk(costDNA, i, 'du', DNA_UPG, G.dna, buyQty);
        const isTooPricey = total > G.dna * 500 && G.du[DNA_UPG[i].id] > 0;
        b.classList.toggle('hidden', isTooPricey);
        b.disabled = G.dna < total || count <= 0;
        const costEl = b.querySelector('.dna-cost');
        if (costEl) costEl.textContent = '🧬 ' + fmt(total) + (count > 1 ? ` (×${count})` : '');
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

    updateEvolutionTreeState();
}

function buyAllDNA() {
    let changed = false;
    DNA_UPG.forEach((u, i) => {
        const { count, total } = costBulk(costDNA, i, 'du', DNA_UPG, G.dna, 'max');
        if (count > 0 && G.dna >= total) {
            G.dna -= total;
            G.du[u.id] += count;
            changed = true;
        }
    });
    if (changed) {
        showToast('buy-toast', '⚡', 'Bulk Purchase', 'All affordable upgrades bought!');
        buildShop(); updateUI();
    }
}

function buyTrait(id) {
    const t = TRAITS.find(x => x.id === id);
    if (!t || G.traits[id] || G.mutations < t.cost || !t.check(G)) return;
    G.mutations -= t.cost;
    G.traits[id] = true;
    showToast('trait-toast', '🧬', 'Trait Acquired', t.name);
    buildShop(); updateUI();
}

// ─── EVOLUTION TREE UI ────────────────────────
function buildTreeTab() {
    const el = DOM.tTree;
    el.innerHTML = '';
    if (G.evoCount === 0 && G.mutations === 0 && G.leapCount === 0) {
        el.innerHTML = '<div class="lock-msg"><span class="lock-emoji">🔒</span>Evolve at least once<br>to unlock the evolution tree!</div>';
        return;
    }
    buildEvolutionTree(el);
}

function buildEvolutionTree(parentEl) {
    const wrap = document.createElement('div');
    wrap.className = 'evo-tree';

    const title = document.createElement('div');
    title.className = 'evo-tree-title';
    title.innerHTML = 'Evolution Tree (DNA Skills) <small style="display:block; font-weight:normal; margin-top:4px; opacity:0.8;">💡 Hover over circles to see what the upgrade gives. Click to unlock!</small>';
    wrap.appendChild(title);

    const viewport = document.createElement('div');
    viewport.className = 'evo-tree-viewport';

    const radial = document.createElement('div');
    radial.className = 'evo-tree-radial';

    // Layout logic: static grid mapping based on cx, cy
    const centerX = 1500;
    const topY = 200;
    const colWidth = 260; // horizontal spacing between paths
    const rowHeight = 180; // vertical spacing
    const nodeSize = 80;

    const positions = {};
    evolutionTree.forEach(n => {
        positions[n.id] = {
            x: centerX + (n.cx || 0) * colWidth,
            y: topY + (n.cy || 0) * rowHeight
        };
    });

    // Draw links
    evolutionTree.forEach(n => {
        if (!n.requirement) return;
        const reqs = Array.isArray(n.requirement) ? n.requirement : [n.requirement];
        reqs.forEach(req => {
            const p = positions[req];
            const c = positions[n.id];
            if (!p || !c) return;
            const dx = c.x - p.x;
            const dy = c.y - p.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const ang = Math.atan2(dy, dx);
            const link = document.createElement('div');
            link.className = 'evo-link';
            link.style.width = dist + 'px';
            link.style.left = p.x + 'px';
            link.style.top = p.y + 'px';
            link.style.transform = 'rotate(' + ang + 'rad)';
            radial.appendChild(link);
        });
    });

    // Draw nodes
    evolutionTree.forEach(n => {
        const pos = positions[n.id];
        if (!pos) return;
        const nodeEl = makeSkillNode(n);
        nodeEl.classList.add('radial-node');
        
        const r = n.isUltimate ? 40 : 30; // 80px vs 60px diameter
        nodeEl.style.left = (pos.x - r) + 'px';
        nodeEl.style.top  = (pos.y - r) + 'px';
        radial.appendChild(nodeEl);
    });

    viewport.appendChild(radial);
    wrap.appendChild(viewport);
    parentEl.appendChild(wrap);

    // Center the world on root node
    const vw = viewport.clientWidth || 480;
    const vh = viewport.clientHeight || 480;
    
    // Calculate initial translation to show the bottom root area
    // Root is now at cy: 9 -> y = topY + 9 * rowHeight = 200 + 1620 = 1820
    const rootPos = positions['evo_root'] || { x: centerX, y: 1820 };
    const initialTx = vw / 2 - rootPos.x;
    const initialTy = vh / 2 - rootPos.y + 120; // offset upwards so the root is visible
    setupTreeDrag(viewport, radial, initialTx, initialTy);
}

function makeSkillNode(node) {
    const btn = document.createElement('button');
    btn.className = 'evo-skill' + (node.isUltimate ? ' ultimate-node' : '');
    btn.dataset.id = node.id;

    const purchased = isSkillPurchased(node);
    const unlocked = isSkillUnlocked(node);
    const conflict  = hasPathConflict(node);
    const affordable = canBuySkill(node);

    if (purchased) btn.classList.add('purchased');
    if (!unlocked || conflict) btn.classList.add('locked-parent');
    if (affordable && !purchased) btn.classList.add('affordable');

    btn.disabled = !affordable;

    let stateText;
    if (purchased) stateText = 'Purchased';
    else if (!unlocked) stateText = 'Locked (requires previous skill)';
    else if (conflict) stateText = 'Locked (another evolution path chosen)';
    else if (G.dna < node.dnaCost) stateText = 'Not enough DNA';
    else stateText = 'Available';

    let effectLabel = '';
    if (node.type === 'Click Power') {
        effectLabel = `Effect: +${node.effectValue} DNA on every click`;
    } else if (node.type === 'Passive DNA') {
        effectLabel = `Effect: +${node.effectValue} DNA per second (passive)`;
    } else if (node.type === 'Multiplier') {
        effectLabel = `Effect: +${Math.round((node.effectValue || 0) * 100)}% to all production`;
    } else if (node.type === 'Cost Reduction') {
        effectLabel = `Effect: -${Math.round((node.effectValue || 0) * 100)}% to DNA & Mutation costs`;
    } else if (node.type === 'Ultimate') {
        effectLabel = `Effect: ×${Math.round((node.effectValue || 0))} multiplier to ALL production!`;
    } else {
        effectLabel = node.type || '';
    }

    const costLabel = purchased ? 'Purchased' : `Cost: 🧬 ${fmt(node.dnaCost)}`;

    btn.innerHTML =
        `<div class="evo-skill-icon">${node.icon || '❔'}</div>` +
        `<div class="evo-skill-tooltip">
            <div class="evo-skill-name">${node.name}</div>
            ${effectLabel ? `<div class="evo-skill-effect">${effectLabel}</div>` : ''}
            <div class="evo-skill-cost">${costLabel}</div>
            <div class="evo-skill-state">${stateText}</div>
        </div>`;

    if (!purchased) {
        btn.addEventListener('click', () => buyEvolutionSkill(node.id));
    }

    return btn;
}

function setupTreeDrag(viewport, radial, startTx = 0, startTy = 0) {
    const state = { dragging:false, lastX:0, lastY:0, tx:startTx, ty:startTy, scale:1 };

    function apply() {
        radial.style.transform = `translate(${state.tx}px, ${state.ty}px) scale(${state.scale})`;
    }

    // Apply initial centering
    apply();

    viewport.addEventListener('pointerdown', e => {
        // Не стартирай drag, ако кликът е върху умение
        if (e.target && e.target.closest && e.target.closest('.evo-skill')) return;
        if (e.button !== 0) return; // само ляв бутон
        state.dragging = true;
        state.lastX = e.clientX;
        state.lastY = e.clientY;
        viewport.classList.add('dragging');
        try { viewport.setPointerCapture(e.pointerId); } catch(_) {}
    });

    viewport.addEventListener('pointermove', e => {
        if (!state.dragging) return;
        const dx = e.clientX - state.lastX;
        const dy = e.clientY - state.lastY;
        state.lastX = e.clientX;
        state.lastY = e.clientY;
        state.tx += dx;
        state.ty += dy;
        apply();
    });

    function endDrag(e){
        if (!state.dragging) return;
        state.dragging = false;
        viewport.classList.remove('dragging');
        try { viewport.releasePointerCapture(e.pointerId); } catch(_) {}
    }

    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);

    // Zoom with mouse wheel – focus around cursor
    viewport.addEventListener('wheel', e => {
        e.preventDefault();
        const zoomDir = e.deltaY < 0 ? 1 : -1;
        const factor = zoomDir > 0 ? 1.1 : 0.9;
        const oldScale = state.scale;
        let newScale = oldScale * factor;
        const minScale = 0.4, maxScale = 2.5;
        if (newScale < minScale) newScale = minScale;
        if (newScale > maxScale) newScale = maxScale;
        if (newScale === oldScale) return;

        const rect = viewport.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;

        // world coordinates under cursor before zoom
        const worldX = (cx - state.tx) / oldScale;
        const worldY = (cy - state.ty) / oldScale;

        state.scale = newScale;
        // adjust translation so the same world point stays under the cursor
        state.tx = cx - worldX * newScale;
        state.ty = cy - worldY * newScale;
        apply();
    }, { passive:false });
}

function updateEvolutionTreeState() {
    evolutionTree.forEach(node => {
        const el = document.querySelector(`.evo-skill[data-id="${node.id}"]`);
        if (!el) return;
        const purchased = isSkillPurchased(node);
        const unlocked = isSkillUnlocked(node);
        const conflict  = hasPathConflict(node);
        const affordable = canBuySkill(node);

        el.classList.toggle('purchased', purchased);
        el.classList.toggle('locked-parent', !unlocked || conflict);
        el.classList.toggle('affordable', affordable && !purchased);
        el.disabled = !affordable;

        const st = el.querySelector('.evo-skill-state');
        const costEl = el.querySelector('.evo-skill-cost');
        if (st) {
            if (purchased) st.textContent = 'Purchased';
            else if (!unlocked) st.textContent = 'Locked (requires previous skill)';
            else if (conflict) st.textContent = 'Locked (another evolution path chosen)';
            else if (G.dna < node.dnaCost) st.textContent = 'Not enough DNA';
            else st.textContent = 'Available';
        }
        if (costEl) {
            costEl.textContent = purchased ? 'Purchased' : `Cost: 🧬 ${fmt(node.dnaCost)}`;
        }
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
    DOM.modalTitle.textContent = title;
    DOM.modalBody.innerHTML = bodyHTML;
    DOM.modalOverlay.classList.remove('hidden');
    DOM.modalOverlay.classList.add('active');
}
function closeModal() {
    DOM.modalOverlay.classList.remove('active');
    DOM.modalOverlay.classList.add('hidden');
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === DOM.modalOverlay) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Help Modal
document.getElementById('btn-help').addEventListener('click', () => {
    openModal('❓ How to Play', `
        <h3>🧬 Basics</h3>
        <p>Click the button to generate <strong>DNA points</strong>. Use them to buy upgrades that increase your yield per click and automatic production (DNA/sec).</p>

        <h3>🧪 Evolution (Prestige 1)</h3>
        <p>When you accumulate enough DNA, you can <strong>evolve</strong>. This resets your DNA and DNA upgrades, but you gain <strong>mutations</strong> — a currency for permanent bonuses. Each evolution moves you forward in the evolutionary chain!</p>

        <h3>🔬 Genomic Leap (Prestige 2)</h3>
        <p>After <strong>5 evolutions</strong>, you unlock the genomic leap. It resets everything (including mutations), but gives you <strong>genomes</strong> — the most powerful currency for incredible upgrades.</p>

        <h3>⚡ Events</h3>
        <p>Every ~60 seconds there is a chance for a <strong>random event</strong> to appear — a temporary bonus to your production. Keep an eye on the banner!</p>

        <h3>🏆 Achievements</h3>
        <p>Unlock achievements for various milestones. Check the 🏆 tab to view your progress.</p>

        <h3>💡 Tips</h3>
        <p>• Invest in <strong>Ribosomes</strong> and <strong>Mitochondria</strong> early for passive income.<br>
        • <strong>Enzyme Complexes</strong> and <strong>Cell Division</strong> multiply ALL production.<br>
        • Evolve quickly to accumulate mutations — they make the next run much faster.<br>
        • Use the <strong>×10</strong> or <strong>Max</strong> buttons to buy quickly.</p>

        <h3>⌨️ Hotkeys</h3>
        <table class="hk-table">
            <tr><td><kbd>Space</kbd></td><td>Click</td></tr>
            <tr><td><kbd>1-4</kbd></td><td>Quantity: ×1, ×10, ×25, Max</td></tr>
            <tr><td><kbd>E</kbd></td><td>Evolve</td></tr>
            <tr><td><kbd>L</kbd></td><td>Genomic Leap</td></tr>
            <tr><td><kbd>H</kbd></td><td>Help (this page)</td></tr>
            <tr><td><kbd>S</kbd></td><td>Statistics</td></tr>
            <tr><td><kbd>A</kbd></td><td>Achievements</td></tr>
            <tr><td><kbd>N</kbd></td><td>Notification Log</td></tr>
            <tr><td><kbd>M</kbd></td><td>Settings</td></tr>
            <tr><td><kbd>Esc</kbd></td><td>Close Window</td></tr>
        </table>
    `);
});

// Stats Modal
document.getElementById('btn-stats').addEventListener('click', () => {
    const pt = (G.totalPlayTime + Date.now() - G.startTime) / 1000;
    const d = dps();
    const timeToEvo = d > 0 ? Math.max(0, (evoThresh() - G.totalDNA) / d) : Infinity;
    openModal('📊 Statistics', `
        <div class="stats-grid">
            <div class="sg-item"><small>Total Clicks</small><strong>${fmt(G.totalClicks)}</strong></div>
            <div class="sg-item"><small>DNA/click</small><strong>${fmt(clickPow())}</strong></div>
            <div class="sg-item"><small>DNA/sec</small><strong>${fmt(d)}</strong></div>
            <div class="sg-item"><small>Multiplier</small><strong>×${prodMult().toFixed(2)}</strong></div>
            <div class="sg-item"><small>DNA (current)</small><strong>${fmt(G.dna)}</strong></div>
            <div class="sg-item"><small>DNA (this run)</small><strong>${fmt(G.totalDNA)}</strong></div>
            <div class="sg-item"><small>DNA (all time)</small><strong>${fmt(G.allTimeDNA)}</strong></div>
            <div class="sg-item"><small>Mutations</small><strong>${fmt(G.mutations)}</strong></div>
            <div class="sg-item"><small>Total Mutations</small><strong>${fmt(G.totalMutations)}</strong></div>
            <div class="sg-item"><small>Genomes</small><strong>${fmt(G.genomes)}</strong></div>
            <div class="sg-item"><small>Evolutions</small><strong>${G.evoCount}</strong></div>
            <div class="sg-item"><small>Genomic Leaps</small><strong>${G.leapCount}</strong></div>
            <div class="sg-item"><small>Events Survived</small><strong>${G.totalFrenzies}</strong></div>
            <div class="sg-item"><small>Achievements</small><strong>${G.achUnlocked.length} / ${ACHIEVEMENTS.length}</strong></div>
            <div class="sg-item"><small>Artifacts</small><strong>${G.artifacts.length} / ${ARTIFACTS.length}</strong></div>
            <div class="sg-item"><small>Auto-Click</small><strong>${getAutoClickRate() > 0 ? getAutoClickRate() + '×/sec' : 'None'}</strong></div>
            <div class="sg-item"><small>Play Time</small><strong>${fmtTime(pt)}</strong></div>
            <div class="sg-item"><small>Time to Evolution</small><strong>${timeToEvo === Infinity ? '∞' : fmtTime(timeToEvo)}</strong></div>
        </div>
        <div class="section-header" style="margin-top:18px"><h3>🏅 Milestones</h3><p>Permanent bonuses from evolution progress</p></div>
        ${buildMilestoneHTML()}
    `);
});

// Achievements Modal
document.getElementById('btn-ach').addEventListener('click', () => {
    let html = '<div class="ach-grid">';
    ACHIEVEMENTS.forEach(a => {
        const done = G.achUnlocked.includes(a.id);
        html += `<div class="ach ${done ? '' : 'locked'}">
            <span class="ach-ico">${done ? a.icon : '🔒'}</span>
            <div class="ach-info"><div class="ach-name">${done ? a.name : '???'}</div><div class="ach-desc">${done ? a.desc : 'Not unlocked yet.'}</div></div>
            ${done ? '<span class="ach-check">✓</span>' : ''}
        </div>`;
    });
    html += '</div>';
    openModal('🏆 Achievements (' + G.achUnlocked.length + '/' + ACHIEVEMENTS.length + ')', html);
});

// Settings Modal
document.getElementById('btn-settings').addEventListener('click', () => {
    openModal('⚙️ Settings', `
        <div class="setting-row">
            <div class="setting-label">Evolution Leap Confirmation<small>Show dialog before evolution leap</small></div>
            <button class="toggle ${G.settings.confirmEvo ? 'on' : ''}" data-setting="confirmEvo"></button>
        </div>
        <div class="setting-row">
            <div class="setting-label">Leap Confirmation<small>Show dialog before genomic leap</small></div>
            <button class="toggle ${G.settings.confirmLeap ? 'on' : ''}" data-setting="confirmLeap"></button>
        </div>
        <div class="setting-row">
            <div class="setting-label">Click Particles<small>Visual effect on click</small></div>
            <button class="toggle ${G.settings.particles ? 'on' : ''}" data-setting="particles"></button>
        </div>
        <div class="setting-row">
            <div class="setting-label">Sound Effects<small>Click, evolution, and event sounds</small></div>
            <button class="toggle ${G.settings.sound ? 'on' : ''}" data-setting="sound"></button>
        </div>
        <div class="setting-row">
            <div class="setting-label">Number Notation<small>Short: 1.5M · Scientific: 1.50e+6</small></div>
            <button class="toggle ${G.settings.notation === 'scientific' ? 'on' : ''}" data-setting="notation"></button>
        </div>
        <div class="setting-divider"></div>
        <h3>💾 Save Management</h3>
        <div class="save-actions">
            <button class="save-btn export-btn" id="btn-export">📤 Export Save</button>
            <button class="save-btn import-btn" id="btn-import">📥 Import Save</button>
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
    document.getElementById('btn-export').addEventListener('click', exportSave);
    document.getElementById('btn-import').addEventListener('click', importSave);
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

            // Разширен изглед за дървото и геномите
            if (t.dataset.tab === 't-tree' || t.dataset.tab === 't-gen') {
                document.body.classList.add('wide-shop');
            } else {
                document.body.classList.remove('wide-shop');
            }
            if (t.dataset.tab === 't-col') buildArtifacts();
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
        G.evoSkills = { ...d.evoSkills, ...(p.evoSkills || {}) };
        G.settings = { ...d.settings, ...(p.settings || {}) };
        G.achUnlocked = p.achUnlocked || [];
    } catch(e) { console.error('Error loading:', e); }

    const dt = (Date.now() - G.lastTick) / 1000;
    if (dt > 5) {
        const d = dps();
        if (d > 0) {
            const cap = 4 * 3600;
            const eff = Math.min(dt, cap);
            const gain = d * eff;
            G.dna += gain; G.totalDNA += gain; G.allTimeDNA += gain;
            setTimeout(() => showToast('event-toast', '⏱️', 'Offline progress',
                `${fmtTime(eff)} → +${fmt(gain)} DNA`, 5000), 400);
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
    // Auto-clicker from milestones
    const acRate = getAutoClickRate();
    if (acRate > 0 && dt > 0 && dt < 2) {
        const autoPw = clickPow() * acRate * dt;
        G.dna += autoPw; G.totalDNA += autoPw; G.allTimeDNA += autoPw;
    }

    throttledAchCheck();

    // Fast path: buttery smooth 60 FPS counting for main resources
    DOM.dnaVal.textContent = fmt(G.dna);
    DOM.sTotal.textContent = fmt(G.totalDNA);
    const th = evoThresh(), pct = Math.min(G.totalDNA / th, 1);
    DOM.evoFill.style.width = (pct * 100) + '%';
    DOM.evoText.textContent = fmt(G.totalDNA) + ' / ' + fmt(th);

    requestAnimationFrame(tick);
}

// ─── СЪБИТИЯ ────────────────────────────────────
function bindEvents() {
    DOM.clickBtn.addEventListener('click', doClick);
    
    // 3D Tilt Effect
    DOM.clickBtn.addEventListener('mousemove', (e) => {
        const rect = DOM.clickBtn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xc = (x / rect.width - 0.5) * 2;
        const yc = (y / rect.height - 0.5) * 2;
        DOM.clickBtn.style.transform = `perspective(1000px) rotateX(${yc * -15}deg) rotateY(${xc * 15}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    DOM.clickBtn.addEventListener('mouseleave', () => {
        DOM.clickBtn.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
    });

    DOM.evoBtn.addEventListener('click', evolve);
    DOM.leapBtn.addEventListener('click', genomeLeap);
    document.getElementById('reset-btn').addEventListener('click', () => {
        if (confirm('🗑️ Are you sure? All progress will be deleted permanently!')) {
            localStorage.removeItem(SAVE_KEY);
            location.reload();
        }
    });

    document.addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (DOM.modalOverlay.classList.contains('active')) return;
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                if (DOM.clickBtn) doClick({ currentTarget: DOM.clickBtn });
                break;
            case 'Digit1': case 'Numpad1': setQty(1); break;
            case 'Digit2': case 'Numpad2': setQty(10); break;
            case 'Digit3': case 'Numpad3': setQty(25); break;
            case 'Digit4': case 'Numpad4': setQty('max'); break;
            case 'KeyE': if (canEvo()) evolve(); break;
            case 'KeyH': document.getElementById('btn-help').click(); break;
            case 'KeyS': document.getElementById('btn-stats').click(); break;
            case 'KeyA': document.getElementById('btn-ach').click(); break;
            case 'KeyL': if (canLeap()) genomeLeap(); break;
            case 'KeyM': { const ms = document.getElementById('btn-settings'); if (ms) ms.click(); } break;
            case 'KeyN': openNotifLog(); break;
        }
    });
    const bab = document.getElementById('btn-buy-all');
    if (bab) bab.addEventListener('click', buyAllDNA);
}

function setQty(q) {
    buyQty = q;
    document.querySelectorAll('.bq').forEach(b => {
        b.classList.toggle('active', b.dataset.qty === String(q));
    });
    buildShop();
}

// ─── NOTIFICATION LOG VIEWER ───────────────
function openNotifLog() {
    let html = '<div class="notif-log">';
    if (notifLog.length === 0) {
        html += '<div class="notif-empty">No notifications yet.</div>';
    } else {
        notifLog.forEach(n => {
            html += `<div class="notif-entry"><span class="notif-ico">${n.icon}</span><div class="notif-body"><div class="notif-title">${n.title}</div><div class="notif-desc">${n.desc}</div></div><span class="notif-time">${n.time}</span></div>`;
        });
    }
    html += '</div>';
    openModal('📜 Notification Log', html);
}

// ─── MILESTONES VIEWER (in Stats) ─────────
function buildMilestoneHTML() {
    let html = '<div class="milestone-grid">';
    MILESTONES.forEach(m => {
        const done = isMilestoneUnlocked(m);
        html += `<div class="milestone-item ${done ? 'unlocked' : 'locked-ms'}">
            <span class="ms-ico">${done ? m.icon : '🔒'}</span>
            <div class="ms-info"><div class="ms-name">${done ? m.name : '???'}</div><div class="ms-desc">${done ? m.desc : (m.type === 'evo' ? m.req + ' evolutions' : m.req + ' leaps') + ' required'}</div></div>
            ${done ? '<span class="ms-check">✓</span>' : ''}
        </div>`;
    });
    html += '</div>';
    return html;
}

// ─── ИНИЦИАЛИЗАЦИЯ ──────────────────────────────
cacheDom();
bindEvents();
load();
initTabs();
initBgEntities();
SFX.init();
buildShop();
buildTimeline();
updateUI();
G._prev = performance.now();
requestAnimationFrame(tick);
setInterval(updateUI, 120); // Throttle full UI updates to ~8 frames per second
setInterval(save, 2000);
setInterval(trySpawnEvent, 60000); // try event every 60s
// Check event on load too (after 10s to not overwhelm)
setTimeout(trySpawnEvent, 10000);
// Notification log button
const btnLog = document.getElementById('btn-log');
if (btnLog) btnLog.addEventListener('click', openNotifLog);
// ─── GENETIC PUZZLE ────────────────────────────
let puzzleSequence = [];
let puzzleInput = [];

function startGeneticPuzzle() {
    const bases = ['A', 'T', 'G', 'C'];
    puzzleSequence = [];
    puzzleInput = [];
    for (let i = 0; i < 5; i++) {
        puzzleSequence.push(bases[Math.floor(Math.random() * 4)]);
    }

    DOM.modalTitle.textContent = '🧬 Genetic Sequence Puzzle';
    DOM.modalBody.innerHTML = `
        <div class="puzzle-wrap">
            <p>Match the sequence to strengthen your DNA permanently!</p>
            <div class="puzzle-seq">${puzzleSequence.join(' ')}</div>
            <div class="puzzle-input" id="puzzle-input-display">...</div>
            <div class="puzzle-btns">
                <button class="btn-action puzzle-btn" onclick="handlePuzzleClick('A')">A</button>
                <button class="btn-action puzzle-btn" onclick="handlePuzzleClick('T')">T</button>
                <button class="btn-action puzzle-btn" onclick="handlePuzzleClick('G')">G</button>
                <button class="btn-action puzzle-btn" onclick="handlePuzzleClick('C')">C</button>
            </div>
        </div>
    `;
    DOM.modalOverlay.classList.add('active');
}

function handlePuzzleClick(base) {
    puzzleInput.push(base);
    const display = document.getElementById('puzzle-input-display');
    if (display) display.textContent = puzzleInput.join(' ');

    const idx = puzzleInput.length - 1;
    if (puzzleInput[idx] !== puzzleSequence[idx]) {
        showToast('fail-toast', '❌', 'Sequence Broken', 'Transformation failed...');
        DOM.modalOverlay.classList.remove('active');
        return;
    }

    if (puzzleInput.length === puzzleSequence.length) {
        G.puzzleMult *= 1.1;
        showToast('puzzle-toast', '✨', 'Sequence Complete!', 'Permanent ×1.10 production boost!');
        DOM.modalOverlay.classList.remove('active');
        updateUI();
    }
}

function tryDropArtifact() {
    const unowned = ARTIFACTS.filter(a => !G.artifacts.includes(a.id));
    if (unowned.length === 0) return;
    // Roll for each rarity tier
    const roll = Math.random();
    let candidates = [];
    if (roll < RARITY_DROP.legendary) candidates = unowned.filter(a => a.rarity === 'legendary');
    else if (roll < RARITY_DROP.rare) candidates = unowned.filter(a => a.rarity === 'rare');
    else if (roll < RARITY_DROP.common) candidates = unowned.filter(a => a.rarity === 'common');
    if (candidates.length === 0) return;
    const art = candidates[Math.floor(Math.random() * candidates.length)];
    G.artifacts.push(art.id);
    const rarityLabel = art.rarity.charAt(0).toUpperCase() + art.rarity.slice(1);
    showToast('art-toast', art.icon, rarityLabel + ' Artifact!', art.name + ' — ' + art.desc);
    SFX.artifact();
    buildArtifacts(); updateUI();
}

function buildArtifacts() {
    if (!DOM.artifactGrid) return;
    DOM.artifactGrid.innerHTML = '';
    ARTIFACTS.forEach(a => {
        const owned = G.artifacts.includes(a.id);
        const el = document.createElement('div');
        el.className = `artifact-item ${owned ? 'owned' : 'missing'} rarity-${a.rarity}`;
        el.innerHTML = `
            <div class="art-icon">${owned ? a.icon : '❓'}</div>
            <div class="art-info">
                <div class="art-name">${owned ? a.name : 'Unknown Artifact'}</div>
                <div class="art-desc">${owned ? a.desc : 'Keep clicking to discover...'}</div>
                <div class="art-rarity ${a.rarity}">${a.rarity.toUpperCase()}</div>
            </div>
        `;
        DOM.artifactGrid.appendChild(el);
    });
}
