import "./style.css";

const currentBalls = document.getElementById("current-balls");
const drawMeta = document.getElementById("draw-meta");
const drawOnceBtn = document.getElementById("draw-once");
const drawFiveBtn = document.getElementById("draw-five");
const autoToggleBtn = document.getElementById("auto-toggle");
const clearHistoryBtn = document.getElementById("clear-history");
const historyList = document.getElementById("history-list");
const historyCount = document.getElementById("history-count");
const totalDrawsEl = document.getElementById("total-draws");
const hotRedEl = document.getElementById("hot-red");
const hotBlueEl = document.getElementById("hot-blue");

let drawIndex = 0;
let autoTimer = null;
const history = [];

const pad = (num) => String(num).padStart(2, "0");

const uniqueNumbers = (count, max) => {
  const set = new Set();
  while (set.size < count) {
    set.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(set).sort((a, b) => a - b);
};

const drawOne = () => {
  const reds = uniqueNumbers(6, 33);
  const blue = Math.floor(Math.random() * 16) + 1;
  return { reds, blue };
};

const formatDraw = ({ reds, blue }) => {
  const redText = reds.map(pad).join(" ");
  return `${redText} | ${pad(blue)}`;
};

const renderBalls = (draw) => {
  currentBalls.innerHTML = "";
  draw.reds.forEach((num) => {
    const ball = document.createElement("div");
    ball.className = "ball red";
    ball.textContent = pad(num);
    currentBalls.appendChild(ball);
  });
  const blueBall = document.createElement("div");
  blueBall.className = "ball blue";
  blueBall.textContent = pad(draw.blue);
  currentBalls.appendChild(blueBall);
};

const renderHistory = () => {
  historyList.innerHTML = "";
  history.forEach((item) => {
    const row = document.createElement("div");
    row.className = "history-row";

    const badge = document.createElement("div");
    badge.className = "history-index";
    badge.textContent = `#${item.index}`;

    const numbers = document.createElement("div");
    numbers.className = "history-numbers";
    numbers.textContent = formatDraw(item.draw);

    const time = document.createElement("div");
    time.className = "history-time";
    time.textContent = item.time;

    row.appendChild(badge);
    row.appendChild(numbers);
    row.appendChild(time);

    historyList.appendChild(row);
  });
  historyCount.textContent = `${history.length} draw${history.length === 1 ? "" : "s"}`;
};

const renderStats = () => {
  totalDrawsEl.textContent = `${drawIndex}`;

  if (history.length === 0) {
    hotRedEl.textContent = "--";
    hotBlueEl.textContent = "--";
    return;
  }

  const redCounts = Array(34).fill(0);
  const blueCounts = Array(17).fill(0);

  history.forEach(({ draw }) => {
    draw.reds.forEach((num) => {
      redCounts[num] += 1;
    });
    blueCounts[draw.blue] += 1;
  });

  const pickHot = (counts) => {
    let max = 0;
    let candidate = 0;
    for (let i = 1; i < counts.length; i += 1) {
      if (counts[i] > max) {
        max = counts[i];
        candidate = i;
      }
    }
    return max === 0 ? "--" : `${pad(candidate)} (${max}x)`;
  };

  hotRedEl.textContent = pickHot(redCounts);
  hotBlueEl.textContent = pickHot(blueCounts);
};

const addDraw = () => {
  const draw = drawOne();
  drawIndex += 1;
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  history.unshift({ index: drawIndex, draw, time });
  if (history.length > 20) {
    history.pop();
  }

  renderBalls(draw);
  renderHistory();
  renderStats();
  drawMeta.textContent = `Draw #${drawIndex} at ${time}`;
};

const drawMany = (count) => {
  for (let i = 0; i < count; i += 1) {
    addDraw();
  }
};

const toggleAuto = () => {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
    autoToggleBtn.textContent = "Auto Draw";
    autoToggleBtn.classList.remove("active");
    return;
  }
  autoTimer = setInterval(() => {
    addDraw();
  }, 1400);
  autoToggleBtn.textContent = "Stop Auto";
  autoToggleBtn.classList.add("active");
};

const clearHistory = () => {
  history.length = 0;
  drawIndex = 0;
  historyList.innerHTML = "";
  historyCount.textContent = "0 draws";
  drawMeta.textContent = "No draw yet";
  currentBalls.innerHTML = "";
  renderStats();
};

const init = () => {
  drawOnceBtn.addEventListener("click", () => addDraw());
  drawFiveBtn.addEventListener("click", () => drawMany(5));
  autoToggleBtn.addEventListener("click", toggleAuto);
  clearHistoryBtn.addEventListener("click", clearHistory);

  renderStats();
  addDraw();
};

init();
