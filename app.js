const screens = {
    intro: document.getElementById("intro"),
    home: document.getElementById("home"),
    lobby: document.getElementById("lobby"),
    game: document.getElementById("game")
};

const createModal = document.getElementById("createModal");
const joinModal = document.getElementById("joinModal");

const generatedCode = document.getElementById("generatedCode");
const lobbyCode = document.getElementById("lobbyCode");
const roomInput = document.getElementById("roomInput");
const joinError = document.getElementById("joinError");
const playerCount = document.getElementById("playerCount");
const playersList = document.getElementById("playersList");

const timerElement = document.getElementById("timer");
const player = document.getElementById("player");

let currentRoom = "";
let timeLeft = 300;
let timerInterval = null;

let playerPosition = {
    x: 300,
    y: 350
};

const speed = 4;


/* الانتقال بين الشاشات */

function showScreen(name) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove("active");
    });

    screens[name].classList.add("active");
}


/* توليد رقم غرفة من 4 أرقام */

function generateRoomCode() {
    return String(Math.floor(1000 + Math.random() * 9000));
}


/* البداية */

document.getElementById("enterBtn").addEventListener("click", () => {
    showScreen("home");
});


/* النوافذ */

document.getElementById("createBtn").addEventListener("click", () => {
    currentRoom = generateRoomCode();
    generatedCode.textContent = currentRoom;
    createModal.classList.add("active");
});

document.getElementById("joinBtn").addEventListener("click", () => {
    joinError.textContent = "";
    roomInput.value = "";
    joinModal.classList.add("active");
});

document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => {
        document
            .getElementById(button.dataset.close)
            .classList.remove("active");
    });
});


/* إنشاء الغرفة */

document.getElementById("createRoom").addEventListener("click", () => {

    lobbyCode.textContent = currentRoom;

    createModal.classList.remove("active");
    showScreen("lobby");

});


/* دخول غرفة */

document.getElementById("joinRoom").addEventListener("click", () => {

    const code = roomInput.value.trim();

    if (!/^\d{4}$/.test(code)) {
        joinError.textContent = "اكتب رمزًا مكوّنًا من 4 أرقام.";
        return;
    }

    currentRoom = code;
    lobbyCode.textContent = code;

    joinModal.classList.remove("active");
    showScreen("lobby");

});


/* النسخ */

document.getElementById("copyCode").addEventListener("click", async () => {

    try {
        await navigator.clipboard.writeText(currentRoom);
    } catch {
        // بعض المتصفحات تمنع النسخ التلقائي
    }

    document.getElementById("copyCode").textContent = "تم";
    
    setTimeout(() => {
        document.getElementById("copyCode").textContent = "نسخ";
    }, 1200);
});


/* مغادرة */

document.getElementById("leaveLobby").addEventListener("click", () => {
    showScreen("home");
});


/* بدء الجولة */

document.getElementById("startGame").addEventListener("click", () => {
    showScreen("game");
    startTimer();
});


/* المؤقت */

function startTimer() {

    clearInterval(timerInterval);

    timeLeft = 300;

    updateTimer();

    timerInterval = setInterval(() => {

        timeLeft--;

        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerElement.textContent = "00:00";
            alert("انتهى الوقت!");
        }

    }, 1000);
}


function updateTimer() {

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerElement.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


/* حركة اللاعب */

const keys = {};

window.addEventListener("keydown", event => {

    const allowed = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "w",
        "a",
        "s",
        "d"
    ];

    if (!allowed.includes(event.key)) return;

    keys[event.key] = true;
});

window.addEventListener("keyup", event => {
    keys[event.key] = false;
});


function movePlayer() {

    let moved = false;

    if (keys["ArrowUp"] || keys["w"]) {
        playerPosition.y -= speed;
        moved = true;
    }

    if (keys["ArrowDown"] || keys["s"]) {
        playerPosition.y += speed;
        moved = true;
    }

    if (keys["ArrowLeft"] || keys["a"]) {
        playerPosition.x -= speed;
        moved = true;
    }

    if (keys["ArrowRight"] || keys["d"]) {
        playerPosition.x += speed;
        moved = true;
    }

    if (moved) {

        playerPosition.x = Math.max(20, Math.min(900, playerPosition.x));
        playerPosition.y = Math.max(80, Math.min(580, playerPosition.y));

        player.style.left = `${playerPosition.x}px`;
        player.style.top = `${playerPosition.y}px`;
    }

    requestAnimationFrame(movePlayer);
}

movePlayer();


/* أزرار الجوال */

document.querySelectorAll(".joystick button").forEach(button => {

    const direction = button.dataset.dir;

    const press = () => {

        if (direction === "up") keys["ArrowUp"] = true;
        if (direction === "down") keys["ArrowDown"] = true;
        if (direction === "left") keys["ArrowLeft"] = true;
        if (direction === "right") keys["ArrowRight"] = true;

    };

    const release = () => {

        keys["ArrowUp"] = false;
        keys["ArrowDown"] = false;
        keys["ArrowLeft"] = false;
        keys["ArrowRight"] = false;

    };

    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointerleave", release);
});


/* التفاعل */

document.querySelector(".action-btn").addEventListener("click", () => {

    document.getElementById("objective").textContent =
        "تم التفاعل — ابحث عن البطاقة التالية";

});


/* إضافة لاعبين تجريبيين للعرض */

function addDemoPlayer(name, letter) {

    const item = document.createElement("div");

    item.className = "player";

    item.innerHTML = `
        <div class="avatar">${letter}</div>
        <div>
            <strong>${name}</strong>
            <span>جاهز</span>
        </div>
        <i></i>
    `;

    playersList.appendChild(item);

    const count = playersList.children.length;

    playerCount.textContent = count;
}


/* عرض لاعبين داخل الغرفة */

setTimeout(() => {
    if (screens.lobby.classList.contains("active")) {
        addDemoPlayer("لاعب 2", "م");
    }
}, 1000);

setTimeout(() => {
    if (screens.lobby.classList.contains("active")) {
        addDemoPlayer("لاعب 3", "س");
    }
}, 2000);
