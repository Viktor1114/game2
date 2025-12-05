/* ====== ИНТРО ====== */
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("intro-btn").addEventListener("click", () => {
        const intro = document.getElementById("intro-screen");
        intro.classList.add("intro-hidden");
        setTimeout(() => intro.remove(), 900);

        const music = document.getElementById("bg-music");
        music.volume = 0.4;
        music.play().catch(()=>{});
    });
});

/* ====== ГЛАВНАЯ ЛОГИКА ====== */

let step = 0;
let isPlayingGame = false;   // <<< ОЧЕНЬ ВАЖНО — защищает от скипов

const questions = [
    "Готова к новой порции эмоций? ✨",
    "Ты знаешь, что ты особенная? 💗",
    "Особенная, потому что делаешь меня счастливым 😚",
    "Хочешь мини-игру? 🎮",
    "Мини-игра №1 → Найди сердечко 💖",
    "Продолжаем? 💕",
    "Мини-игра №2 → Нажми 5 раз ⏳",
    "Готова ещё немного? 😊",
    "Мини-игра №3 → Поймай кнопку 😆",
    "Мини-игра №4 → Сотри и смотри ✨",
    "Мини-игра №5 → Собери фразу 💬"
];

const answers = [
    ["Готоваа!", "Погнали 😎"],
    ["Знаю 🥰", "Почему? 😊"],
    ["Улыбаюсь 😁", "Давай дальше 💗"],
    ["Хочу игру!", "Погнали 😂"],
    ["Я справлюсь!", "Попробую 😳"],
    ["Дааа 💕", "Пойдём дальше 🤭"],
    ["Готова!", "Я смогу 😋"],
    ["Скорееее 😤😂", "Почти идём!"],
    ["Поймаю!", "Она не уйдёт 😎"],
    ["Хочу!", "Погнали ✨"],
    ["Ну давай ❤️", "Собираем 😍"]
];

document.getElementById("yes-btn").onclick = nextStep;
document.getElementById("no-btn").onclick  = nextStep;

function nextStep() {

    if (isPlayingGame) return;  // <<< Блокируем скипы игр

    step++;

    /* Запуск игр */
    if (step === 4) return startFindHeart();
    if (step === 6) return startClickRace();
    if (step === 8) return startRunaway();
    if (step === 10) return startScratch();
    if (step === 11) return startWordPuzzle();
    if (step === 12) return showFinal();

    /* Обычный вывод текста */
    updateScreen();
}

function updateScreen() {
    document.getElementById("question-text").innerText = questions[step];
    document.getElementById("yes-btn").innerText = answers[step][0];
    document.getElementById("no-btn").innerText  = answers[step][1];
}

/* ====== ИГРА 1: Найди сердце ====== */

function startFindHeart() {
    isPlayingGame = true;

    const card = document.getElementById("card");
    card.innerHTML = `
        <h2>Найди настоящее сердечко 💗</h2>
        <div id="grid" style="display:grid;grid-template-columns:repeat(3,1fr); gap:18px; width:260px;margin:20px auto;"></div>
    `;

    const grid = document.getElementById("grid");
    const correct = Math.floor(Math.random()*6);

    for (let i = 0; i < 6; i++) {
        const el = document.createElement("div");
        el.innerHTML = "💜";
        el.style.fontSize = "38px";
        el.style.cursor = "pointer";

        el.onclick = () => {
            if (i === correct) {
                el.innerHTML = "💗";
                setTimeout(() => {
                    isPlayingGame = false;
                    nextStep();
                }, 600);
            }
        };

        grid.appendChild(el);
    }
}

/* ====== ИГРА 2: 5 кликов ====== */

function startClickRace() {
    isPlayingGame = true;

    const card = document.getElementById("card");

    card.innerHTML = `
        <h2>Нажми 5 раз за 7 секунд! ⏳</h2>
        <p id="timer">7.0</p>
        <button id="click-btn" class="neon-btn">ЖМИ! 💥</button>
        <p id="count"></p>
    `;

    let clicks = 0;
    let time = 7;

    const timer = document.getElementById("timer");

    const interval = setInterval(() => {
        time -= 0.1;
        timer.innerText = time.toFixed(1);

        if (time <= 0) {
            clearInterval(interval);
            startClickRace(); // перезапуск
        }
    }, 100);

    document.getElementById("click-btn").onclick = () => {
        clicks++;

        document.getElementById("count").innerText = `Нажатий: ${clicks}/5`;

        if (clicks >= 5) {
            clearInterval(interval);
            setTimeout(() => {
                isPlayingGame = false;
                nextStep();
            }, 600);
        }
    };
}

/* ====== ИГРА 3: Убегающая кнопка ====== */

function startRunaway() {
    isPlayingGame = true;

    const card = document.getElementById("card");
    card.innerHTML = `
        <h2>Поймай кнопку 😆</h2>
        <button id="run-btn" class="neon-btn" style="position:relative;">Лови меня 😂</button>
    `;

    const btn = document.getElementById("run-btn");

    btn.onmouseover = () => {
        const x = Math.random() * 300 - 100;
        const y = Math.random() * 200 - 80;
        btn.style.transform = `translate(${x}px, ${y}px)`;
    };

    btn.onclick = () => {
        btn.innerHTML = "Поймала 💗";
        setTimeout(() => {
            isPlayingGame = false;
            nextStep();
        }, 700);
    };
}

/* ====== ИГРА 4: Сотри ====== */

function startScratch() {
    isPlayingGame = true;

    const card = document.getElementById("card");
    card.innerHTML = `
        <h2>Сотри и узнаешь ✨</h2>
        <p style="opacity:0.75;">Потри экран пальцем или мышкой 😊</p>
        <canvas id="scratch" width="300" height="200"></canvas>
    `;

    const canvas = document.getElementById("scratch");
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#999";
    ctx.fillRect(0,0,300,200);
    ctx.globalCompositeOperation = "destination-out";

    let scratching = false;

    function scratch(e) {
        if (!scratching) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();

        checkErase();
    }

    function checkErase() {
        const pix = ctx.getImageData(0,0,300,200).data;
        let cleared = 0;

        for (let i = 3; i < pix.length; i += 4) {
            if (pix[i] === 0) cleared++;
        }

        if (cleared / (300*200) > 0.55) {
            canvas.style.opacity = 0;
            setTimeout(() => {
                isPlayingGame = false;
                nextStep();
            }, 500);
        }
    }

    canvas.addEventListener("mousedown",()=>scratching=true);
    canvas.addEventListener("mouseup",()=>scratching=false);
    canvas.addEventListener("mousemove",scratch);

    canvas.addEventListener("touchstart",()=>scratching=true);
    canvas.addEventListener("touchend",()=>scratching=false);
    canvas.addEventListener("touchmove",scratch);
}

/* ====== ИГРА 5: Собери фразу ====== */

function startWordPuzzle() {
    isPlayingGame = true;

    const card = document.getElementById("card");
    card.innerHTML = `
        <h2>Собери фразу 💬</h2>
        <p>Составь: <b>Ты моя жизнь!</b></p>

        <div id="letters" style="display:flex; gap:6px; flex-wrap:wrap; justify-content:center;"></div>
        <div id="target" style="margin-top:20px; min-height:50px; border:2px dashed rgba(255,255,255,0.5); padding:10px; border-radius:10px;"></div>
    `;

    const phrase = Array.from("Ты моя жизнь!");
    const shuffled = phrase.slice().sort(() => Math.random()-0.5);

    const lettersBox = document.getElementById("letters");
    const target = document.getElementById("target");

    shuffled.forEach(char => {
        const tile = document.createElement("div");
        tile.style.padding = "10px";
        tile.style.border = "1px solid white";
        tile.style.borderRadius = "6px";
        tile.style.cursor = "pointer";
        tile.dataset.char = char;
        tile.innerText = char === " " ? "␣" : char;

        tile.onclick = () => {
            target.appendChild(tile);
            check();
        };

        lettersBox.appendChild(tile);
    });

    function check() {
        const text = Array.from(target.children).map(x=>x.dataset.char).join("");

        if (text === phrase.join("")) {
            target.style.borderColor = "#32ff87";
            setTimeout(() => {
                isPlayingGame = false;
                nextStep();
            }, 700);
        }
    }
}
/* ====== ФИНАЛ ====== */

function showFinal() {
    const card = document.getElementById("card");
    card.innerHTML = `
        <h2 style="font-size:32px;">Ты прошла всё! 💗</h2>
        <p>Ты самая красивая и милая, ты моя любовь! ✨</p>
        <p>Я рядом!💕</p>
    `;

    setInterval(createHeart, 250);
}

function createHeart() {
    const c = document.getElementById("hearts-container");
    const icons = ["💗","💖","💘","💞","🥰","😘","😍","✨","🌸"];

    const el = document.createElement("div");
    el.className = "heart";
    el.style.left = Math.random()*90 + "vw";
    el.innerText = icons[Math.floor(Math.random()*icons.length)];
    el.style.fontSize = "40px";

    c.appendChild(el);

    setTimeout(()=>el.remove(),5000);
}