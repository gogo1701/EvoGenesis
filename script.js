// 1. Конфигурация и Константни стойности
const STAGES = [
    'Едноклетъчно',
    'Многоклетъчно',
    'Риба',
    'Земноводно',
    'Влечуго',
    'Бозайник',
    'Примат',
    'Човек'
];

const BASE_COSTS = {
    A: 10,
    T: 10,
    G: 15,
    C: 50
};

const GROWTH_RATES = {
    A: 1.5,
    T: 1.6,
    G: 1.8,
    C: 4.0 // Повишава се агресивно, за да работи като Milestone
};

const SAVE_KEY = 'evoGenesisState';

// 2. State Management (Обект, който държи всичко за прогреса)
let gameState = {
    resources: { A: 0, T: 0, G: 0, C: 0 },
    upgrades: { A: 0, T: 0, G: 0, C: 0 }, // C тук играе роля на evolutionStage
    hasWon: false,
    lastTick: Date.now()
};

// 3. UI Елементи
const ui = {
    resA: document.getElementById('res-A'),
    resT: document.getElementById('res-T'),
    resG: document.getElementById('res-G'),
    resC: document.getElementById('res-C'),

    stageName: document.getElementById('stage-name'),

    statClick: document.getElementById('stat-click'),
    statBps: document.getElementById('stat-bps'),
    statMult: document.getElementById('stat-mult'),

    btnDNA: document.getElementById('dna-btn'),

    upgA: document.getElementById('upg-A'),
    upgT: document.getElementById('upg-T'),
    upgG: document.getElementById('upg-G'),
    upgC: document.getElementById('upg-C'),

    costA: document.getElementById('cost-A'),
    costT: document.getElementById('cost-T'),
    costG: document.getElementById('cost-G'),
    costC: document.getElementById('cost-C'),

    lvlA: document.getElementById('lvl-A'),
    lvlT: document.getElementById('lvl-T'),
    lvlG: document.getElementById('lvl-G'),
    cStatus: document.getElementById('c-status'),

    btnReset: document.getElementById('reset-btn')
};

// 4. Математически Логики
function getUpgradeCost(type) {
    const base = BASE_COSTS[type];
    const growth = GROWTH_RATES[type];
    const level = gameState.upgrades[type];
    return Math.floor(base * Math.pow(growth, level));
}

function getGlobalMultiplier() {
    // Всяко G-ниво дава 15% бонус, compounding (съставна лихва)
    return Math.pow(1.15, gameState.upgrades.G);
}

function getClickPower() {
    // Базово 1 + A-ниво, умножено по Глобалния Мултипликатор
    return (1 + gameState.upgrades.A) * getGlobalMultiplier();
}

function getBps() {
    // Базово T-ниво (1 на секунда на ниво), умножено по Глобалния Мултипликатор
    return gameState.upgrades.T * getGlobalMultiplier();
}

// 5. Функции за запазване и зареждане
function saveGame() {
    // Обновяваме lastTick, за да не получим странен бъг при връщане
    gameState.lastTick = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
}

function loadGame() {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Смесваме дефолтните стойности с тези от запазения файл (за напредничава съвместимост)
            gameState = { ...gameState, ...parsed };
            // Ако има нови под-обекти:
            gameState.resources = { ...{ A: 0, T: 0, G: 0, C: 0 }, ...parsed.resources };
            gameState.upgrades = { ...{ A: 0, T: 0, G: 0, C: 0 }, ...parsed.upgrades };
        } catch (e) {
            console.error("Грешка при зареждане на запазена игра", e);
        }
    }
    // Сихронизираме таймера при старт
    gameState.lastTick = Date.now();
    updateUI();
}

// 6. Обновяване на DOM (UI)
function updateUI() {
    // Обновяване на ресурсите (показваме закръглено надолу)
    ui.resA.innerText = Math.floor(gameState.resources.A);
    ui.resT.innerText = Math.floor(gameState.resources.T);
    ui.resG.innerText = Math.floor(gameState.resources.G);
    ui.resC.innerText = Math.floor(gameState.resources.C);

    // Обновяване на статистиките
    ui.statClick.innerText = getClickPower().toFixed(1);
    ui.statBps.innerText = getBps().toFixed(1);
    ui.statMult.innerText = 'x' + getGlobalMultiplier().toFixed(2);

    // Обновяване на Етапа
    const currentStageIndex = Math.min(gameState.upgrades.C, STAGES.length - 1);
    ui.stageName.innerText = STAGES[currentStageIndex];

    // Цени и нива на ъпгрейди
    const costA = getUpgradeCost('A');
    const costT = getUpgradeCost('T');
    const costG = getUpgradeCost('G');
    const costC = getUpgradeCost('C');

    ui.costA.innerText = costA;
    ui.costT.innerText = costT;
    ui.costG.innerText = costG;
    ui.costC.innerText = costC;

    ui.lvlA.innerText = gameState.upgrades.A;
    ui.lvlT.innerText = gameState.upgrades.T;
    ui.lvlG.innerText = gameState.upgrades.G;

    // Специфично управление за бутона за Еволюция (C)
    if (gameState.upgrades.C >= STAGES.length - 1) {
        ui.upgC.disabled = true;
        ui.cStatus.innerText = "Макс Еволюция";
        ui.costC.innerText = "---";
    } else {
        ui.upgC.disabled = gameState.resources.C < costC;
        ui.cStatus.innerText = "Следващ етап";
    }

    // Проверка за достъпност (дали стават за натискане)
    ui.upgA.disabled = gameState.resources.A < costA;
    ui.upgT.disabled = gameState.resources.T < costT;
    ui.upgG.disabled = gameState.resources.G < costG;
}

// 7. Основен Game Loop (Пасивен доход)
function gameLoop() {
    const now = Date.now();
    // Изчисляваме делта времето в секунди
    const dt = (now - gameState.lastTick) / 1000;
    gameState.lastTick = now;

    const bps = getBps();
    if (bps > 0 && dt > 0) {
        const generation = bps * dt;
        gameState.resources.A += generation;
        gameState.resources.T += generation;
        gameState.resources.G += generation;
        gameState.resources.C += generation;
    }

    updateUI();

    // Запазваме играта всяка секунда автоматично (или когато player-а излезе)
    requestAnimationFrame(gameLoop);
}

// За да намалим разходите за запазване на всеки кадър, запазваме на всеки 2 секунди
setInterval(saveGame, 2000);

// 8. Обработка на събития

// Ръчен Клик
ui.btnDNA.addEventListener('click', () => {
    const power = getClickPower();
    // Кликът дава ресурс към всички бази едновременно, 
    // за да се избегне блокаж в прогресията и да има баланс.
    gameState.resources.A += power;
    gameState.resources.T += power;
    gameState.resources.G += power;
    gameState.resources.C += power;

    updateUI();
});

// Купуване на Ъпгрейди
function buyUpgrade(type) {
    const cost = getUpgradeCost(type);

    if (gameState.resources[type] >= cost) {
        // Проверка за макс еволюция
        if (type === 'C' && gameState.upgrades.C >= STAGES.length - 1) return;

        gameState.resources[type] -= cost;
        gameState.upgrades[type] += 1;

        // Проверка на Win State
        if (type === 'C' && gameState.upgrades.C === STAGES.length - 1 && !gameState.hasWon) {
            gameState.hasWon = true;
            setTimeout(() => {
                alert(`Поздравления! Достигнахте до етап "${STAGES[STAGES.length - 1]}"!\nСпечелихте играта!\nМожете да продължите да развивате базите си.`);
            }, 100);
        }

        updateUI();
    }
}

ui.upgA.addEventListener('click', () => buyUpgrade('A'));
ui.upgT.addEventListener('click', () => buyUpgrade('T'));
ui.upgG.addEventListener('click', () => buyUpgrade('G'));
ui.upgC.addEventListener('click', () => buyUpgrade('C'));

// Нулиране
ui.btnReset.addEventListener('click', () => {
    if (confirm('Сигурни ли сте, че искате да изтриете целия си прогрес?')) {
        localStorage.removeItem(SAVE_KEY);
        // Рестартиране на страницата
        location.reload();
    }
});

// 9. Инициализация
loadGame();
requestAnimationFrame(gameLoop);
