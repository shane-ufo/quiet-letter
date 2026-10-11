// ========== 打开信封 ==========
const envelope = document.getElementById("envelope");
const cover = document.getElementById("cover");
const content = document.getElementById("content");

document.body.classList.add("locked");

envelope.addEventListener("click", () => {
  if (envelope.classList.contains("open")) return;
  envelope.classList.add("open");

  setTimeout(() => {
    cover.classList.add("gone");
    content.hidden = false;
    document.body.classList.remove("locked");
    window.scrollTo(0, 0);
    startReveal();
  }, 1700);
});

// ========== 滚动时文字淡入 ==========
function startReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("show"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
  );
  items.forEach((el) => io.observe(el));
}

// ========== 飘落的花瓣 ==========
const canvas = document.getElementById("petals");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let petals = [];
let w, h, dpr;

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = w < 600 ? 14 : 24;
  petals = Array.from({ length: count }, () => makePetal(true));
}

function makePetal(randomY) {
  return {
    x: Math.random() * w,
    y: randomY ? Math.random() * h : -20,
    size: 6 + Math.random() * 8,
    speed: 0.3 + Math.random() * 0.6,
    drift: (Math.random() - 0.5) * 0.6,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.02,
    sway: Math.random() * Math.PI * 2,
    alpha: 0.35 + Math.random() * 0.4,
  };
}

function drawPetal(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = "#e7b9bd";
  ctx.beginPath();
  ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function tick() {
  ctx.clearRect(0, 0, w, h);
  for (const p of petals) {
    p.sway += 0.01;
    p.y += p.speed;
    p.x += p.drift + Math.sin(p.sway) * 0.3;
    p.angle += p.spin;
    if (p.y > h + 20) Object.assign(p, makePetal(false));
    drawPetal(p);
  }
  requestAnimationFrame(tick);
}

window.addEventListener("resize", resize);
resize();
if (!reduceMotion) tick();
else petals.forEach(drawPetal);
