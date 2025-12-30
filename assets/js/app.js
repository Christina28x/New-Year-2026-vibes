//main section
// Countdown
const newYear = new Date('January 1, 2026 00:00:00');
let snowMultiplier = 1;


setInterval(() => {
  const now = new Date();
  const diff = newYear - now;

  const d = Math.floor(diff / 1000 / 60 / 60 / 24);
  const h = Math.floor(diff / 1000 / 60 / 60) % 24;
  const m = Math.floor(diff / 1000 / 60) % 60;
  const s = Math.floor(diff / 1000) % 60;

  document.getElementById('countdown').innerText =
    `${d} д ${h} ч ${m} м ${s} с`;
}, 1000);



//snow
const canvas = document.getElementById('snow');
const ctx = canvas.getContext('2d');

let width, height;
let flakes = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function createFlakes() {
  flakes = [];
  const baseCount = Math.min(120, Math.floor(width / 10));
  const count = Math.floor(baseCount * snowMultiplier);

  for (let i = 0; i < count; i++) {
    flakes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 3,   
      speed: Math.random() * 0.6 + 0.3,
      drift: Math.random() * 0.6 - 0.3,
      rotation: Math.random() * Math.PI,
      rotationSpeed: Math.random() * 0.01 - 0.005,
      opacity: Math.random() * 0.4 + 0.4
    });
  }
}
createFlakes();

function drawSnowflake(x, y, size, rotation, opacity) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
  ctx.lineWidth = 1;
  ctx.beginPath();

  for (let i = 0; i < 6; i++) {
    ctx.moveTo(0, 0);
    ctx.lineTo(0, size);
    ctx.rotate(Math.PI / 3);
  }

  ctx.stroke();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  flakes.forEach(flake => {
    drawSnowflake(
      flake.x,
      flake.y,
      flake.size,
      flake.rotation,
      flake.opacity
    );

    flake.y += flake.speed + scrollY * 0.0000000005;
    flake.x += flake.drift;
    flake.rotation += flake.rotationSpeed;

    if (flake.y > height + 10) {
      flake.y = -10;
      flake.x = Math.random() * width;
    }
  });

  requestAnimationFrame(animate);
}

let scrollY = 0;
window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
});

animate();

function setSnowMultiplier(multiplier) {
  snowMultiplier = multiplier;
  createFlakes();
}

window.setSnowMultiplier = setSnowMultiplier;


//tree
const ornaments = document.querySelectorAll('.ornament.toggleable');
const star = document.querySelector('.star');
const message = document.getElementById('easter-egg');

let offCount = 0;
let locked = false;

ornaments.forEach(ornament => {
    ornament.addEventListener('click', () => {
        if (locked) return;

        if (!ornament.classList.contains('off')) {
            ornament.classList.add('off');
            offCount++;

            // 5 отключенных — предупреждение
            if (offCount === 5) {
                showWarning();
            }

            // 7 отключенных — гасим всё
            if (offCount === 7) {
                blackout();
            }
        }
    });
});

function showWarning() {
    message.classList.add('show');
    setTimeout(() => {
        message.classList.remove('show');
    }, 3100);
}

function blackout() {
    locked = true;

    ornaments.forEach(o => o.classList.add('off'));
    star?.classList.add('off');

    setTimeout(() => {
        ornaments.forEach(o => o.classList.remove('off'));
        star?.classList.remove('off');
        offCount = 0;
        locked = false;
    }, 4500);
}

//fireworks

const fireworksCanvas = document.getElementById('fireworks');
const fwCtx = fireworksCanvas.getContext('2d');
const fireworksSound = new Audio('assets/sounds/fireworks.mp3');
fireworksSound.volume = 0.35;
fireworksSound.loop = true;

let fwWidth, fwHeight;
let fireworks = [];
let fireworksActive = false;

function resizeFireworks() {
    fwWidth = fireworksCanvas.width = window.innerWidth;
    fwHeight = fireworksCanvas.height = window.innerHeight;
}
resizeFireworks();
window.addEventListener('resize', resizeFireworks);

/* частица */
function createParticle(x, y, color) {
    return {
        x,
        y,
        radius: Math.random() * 2 + 1,
        color,
        speedX: (Math.random() - 0.5) * 6,
        speedY: (Math.random() - 0.7) * 6,
        life: 60 + Math.random() * 30
    };
}

/* взрыв */
function explode(x, y) {
    const colors = ['#ffcc55', '#ff5a5a', '#66ddff', '#ffffff'];
    const count = 40 + Math.random() * 20;

    for (let i = 0; i < count; i++) {
        fireworks.push(
            createParticle(
                x,
                y,
                colors[Math.floor(Math.random() * colors.length)]
            )
        );
    }
}

/* анимация */
function animateFireworks() {
    if (!fireworksActive) return;

    fwCtx.clearRect(0, 0, fwWidth, fwHeight);

    fireworks.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.05; // гравитация
        p.life--;

        fwCtx.beginPath();
        fwCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        fwCtx.fillStyle = p.color;
        fwCtx.fill();

        if (p.life <= 0) fireworks.splice(i, 1);
    });

    requestAnimationFrame(animateFireworks);
}

function startFireworks(duration = 4000) {
    if (fireworksActive) return;

    fireworksActive = true;
    fireworksCanvas.classList.add('active');

        // 🔊 старт звука
    fireworksSound.currentTime = 0;
    fireworksSound.play().catch(() => {});

    const interval = setInterval(() => {
        explode(Math.random() * fwWidth, 80 + Math.random() * 120);
        explode(80, Math.random() * fwHeight * 0.5);
        explode(fwWidth - 80, Math.random() * fwHeight * 0.5);
    }, 400);

    animateFireworks();

    // ⏹ стопаем новые взрывы
    setTimeout(() => {
        clearInterval(interval);

        //  начинаем плавное исчезновение canvas
        fireworksCanvas.classList.remove('active');

        let fade = setInterval(() => {
            if (fireworksSound.volume > 0.05) {
                fireworksSound.volume -= 0.05;
            } else {
                fireworksSound.pause();
                fireworksSound.volume = 0.35;
                clearInterval(fade);
            }
        }, 100);

        //  даём частицам догореть
        setTimeout(() => {
            fireworksActive = false;
            fwCtx.clearRect(0, 0, fwWidth, fwHeight);
            fireworks.length = 0;
        }, 600);
    }, duration);
}

const heroTitle = document.querySelector('.hero-title');

heroTitle.addEventListener('dblclick', () => {
    startFireworks(4000);
});


let tapCount = 0;
let tapTimer = null;

heroTitle.addEventListener('pointerup', (e) => {
    if (e.pointerType !== 'touch') return;

    tapCount++;

    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => {
        tapCount = 0;
    }, 500);

    if (tapCount === 2) {
        startFireworks(4000);
        tapCount = 0;
    }
});

//wishes section
document.addEventListener('DOMContentLoaded', () => {

    const wishes = {
        warm: [
            "Пусть в 2026 ты чаще выбираешь себя — и это будет правильно.",
            "Пусть сбываются желания, даже те, про которые ты молчал.",
            "Всё нужное уже есть внутри. Остальное — приложится.",
            "Если потеряешься — тебя найдут. Или ты найдёшь себя сам.",
            "Пусть хорошее будет не редким событием, а фоном.",
            "Пусть ты будешь с собой в одной команде.",
        ],
        toxic: [
            "Желаю в 2026 поменьше людей, которые «я просто спросить».",
            "Пусть 2026 будет лучше. Ну или хотя бы смешнее.",
            "Если снова будет пиздец — пусть хотя бы с юмором.",
            "Пусть нервы будут крепче, чем чужие мнения.",
            "Желаю меньше кринжа. Особенно не твоего.",
            "Пусть желания сбываются, а долбоёбы — проходят мимо.",
            "Желаю, чтобы фраза «да похуй» спасала чаще.",
            "Новый год — новые травмы. Ну или те же, но с блёстками.",
        ],
        witch: [
            "Пусть защита будет сильнее любых чужих намерений.",
            "Ты входишь в год силы. Не спорь с этим.",
            "Пусть всё, что тянет энергию, потеряет к тебе доступ.",
            "Ты входишь в цикл, где сила возвращается к тебе.",
            "Пусть карты лягут правильно. Или ты их перетасуешь заново.",
            "Пусть твоя тьма будет таким же союзником, как и свет.",
        ],
        it: [
            "Пусть в 2026 баги будут воспроизводимыми, а причины — очевидными.",
            "Пусть в новом году ты реже гуглишь свои же ошибки.",
            "Пусть код будет читаемым. Даже через полгода.",
            "Пусть в 2026 починится всё, кроме того, что тебе уже пофиг.",
            "Пусть дедлайны двигаются сами. Без твоего участия.",
            "Желаю жить, как идеально оформленный README — понятно, с примерами и без багов.",
            "Пусть таски сами переходят в 'Done'.",
        ]
    };
    

    let currentMode = null;
    let currentWish = "";

    const wishText = document.getElementById('wish-text');
    const modeButtons = document.querySelectorAll('.modes button');
    const againBtn = document.getElementById('again');
    const copyBtn = document.getElementById('copy');
    showWish("Выбери настроение — и я скажу ✨");


    function showWish(text) {
        wishText.classList.remove('show');

        setTimeout(() => {
            wishText.textContent = text;
            wishText.classList.add('show');
        }, 200);
    }

    function generateWish() {
        const list = wishes[currentMode];
        currentWish = list[Math.floor(Math.random() * list.length)];
        showWish(currentWish);
    }

    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentMode = btn.dataset.mode;

            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            generateWish();
        });
    });

    againBtn.addEventListener('click', generateWish);

    copyBtn.addEventListener('click', () => {
        if (!currentWish) return;

        navigator.clipboard.writeText(currentWish);
        copyBtn.textContent = "Скопировано ✨";

        setTimeout(() => {
            copyBtn.textContent = "Скопировать";
        }, 2000);
    });

});


//let-go section
document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('let-go-text');
    const button = document.getElementById('let-go-button');
    const finalText = document.getElementById('let-go-final');
    const burnArea = document.getElementById('burn-area');

    const title = document.querySelector('.let-go-title');
    const subtitle = document.querySelector('.let-go-subtitle');

    const burnSound = new Audio('assets/sounds/burn.mp3');
    burnSound.volume = 0.45;

    textarea.addEventListener('input', handleEasterEggs);


    function splitText(text) {
        return text.split('').map(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.classList.add('burn-char');
            return span;
        });
    }

    button.addEventListener('click', () => {

        const value = textarea.value.trim();
        if (!value) return;

        textarea.style.display = 'none';
        button.style.display = 'none';

        burnSound.play().catch(() => {});

        burnArea.innerHTML = '';
        burnArea.classList.remove('hidden');

        const chars = splitText(value);
        chars.forEach(span => burnArea.appendChild(span));

        chars.forEach((char, i) => {
            setTimeout(() => {
                char.classList.add('burn');
            }, i * 60); // 
        });

        setTimeout(() => {
            title.style.display = 'none';
            subtitle.style.display = 'none';
            burnArea.style.display = 'none';
            button.style.display = 'none';

            finalText.classList.remove('hidden');
            finalText.classList.add('show');
        }, chars.length * 60 + 1200);
    });

    let hohoTriggered = false;
    let supportTriggered = false;

    const supportOverlay = document.getElementById('support-overlay');
    const supportSound = new Audio('assets/sounds/windows-error.mp3');
    supportSound.volume = 0.5;

    const supportRebootSound = new Audio('assets/sounds/windows-reboot.mp3');
    supportRebootSound.volume = 0.3;

function normalize(text) {
    return text
        .toLowerCase()
        .replace(/\s+/g, '')
        .trim();
}

function handleEasterEggs() {
    const value = textarea.value;
    const normalized = normalize(value);

    /* 🎄 hohoho / хохохо */
    if (!hohoTriggered) {
        if (normalized.includes('hohoho') || normalized.includes('хохохо')) {
            hohoTriggered = true;
            setSnowMultiplier(5);
            showSystemMessage('СНЕГООООПАД ❄️❄️❄️');
        }
    }

    /* 🧑‍💻 support / поддержка */
    if (!supportTriggered) {
        if (normalized.includes('support') || normalized.includes('поддержка')) {
            supportTriggered = true;

            supportSound.play().catch(() => {});

            supportOverlay.classList.remove('hidden');
            supportOverlay.classList.add('show');

            setTimeout(() => {
                supportRebootSound.play().catch(() => {});
                supportOverlay.classList.remove('show');
                setTimeout(() => {
                    supportOverlay.classList.add('hidden');
                }, 300);
            }, 4000);
        }
    }
}


function showSystemMessage(text) {
    const toast = document.getElementById('system-toast');
    toast.textContent = text;

    toast.classList.remove('hidden');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2200);
}
});