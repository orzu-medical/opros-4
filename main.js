const ENDPOINT = "https://orzu-medical-2-production.up.railway.app/submit";
const state = Object.fromEntries(QUESTIONS.map((q) => [q.id, null]));
const total = QUESTIONS.length;
const bar = document.getElementById("progressBar");
const txt = document.getElementById("progressText");

// Подсчёт выполненных вопросов
function countDone() {
  return Object.values(state).filter((v) => v).length;
}

// Обновление прогресса
function updateProgressUI() {
  const done = countDone();
  bar.style.width = (done / total) * 100 + "%";
  txt.textContent = done + " / " + total;

  document.querySelectorAll(".rating").forEach((r) => {
    const k = r.dataset.key;
    r.querySelectorAll(".btn").forEach((btn) =>
      btn.classList.toggle("active", state[k] == btn.dataset.value)
    );
  });

  document.querySelectorAll(".option").forEach((b) => {
    const k = b.dataset.key;
    b.classList.toggle("active", state[k] == b.dataset.value);
  });
}

updateProgressUI();

// Создание кнопок рейтинга
const makeRatingButtons = (container) => {
  for (let i = 1; i <= 10; i++) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn";
    b.textContent = i;
    b.dataset.value = i;
    container.appendChild(b);
  }
};

// Генерация слайдов
const swiperWrapper = document.querySelector(".swiper-wrapper");
QUESTIONS.forEach((q, idx) => {
  const slide = document.createElement("div");
  slide.className = "swiper-slide";

  let inputHtml = "";
  if (q.type === "rating") inputHtml = `<div class="rating" data-key="${q.id}"></div>`;
  else if (q.type === "options")
    inputHtml = q.options
      .map(
        (opt) =>
          `<button type="button" class="btn option" data-key="${q.id}" data-value="${opt}">${opt}</button>`
      )
      .join("");
  else if (q.type === "text")
    inputHtml = `<input type="text" class="shortAnswer" data-key="${q.id}" placeholder="Введите ответ" style="padding:10px; border-radius:8px; border:none; width:100%;" />`;

  slide.innerHTML = `
    <div class="card" data-q="${idx + 1}">
      <div class="media"><img src="${q.img}" /></div>
      <div class="q">${idx + 1}. ${q.text}</div>
      ${q.muted ? `<div class="muted">${q.muted}</div>` : ""}
      ${inputHtml}
      <div class="controls">
        <span class="pill">Вопрос ${idx + 1} / ${QUESTIONS.length}</span>
        <div class="nav">
          <button class="iconbtn next">⟶</button>
        </div>
      </div>
    </div>
  `;
  swiperWrapper.appendChild(slide);
  if (q.type === "rating") makeRatingButtons(slide.querySelector(".rating"));
});

// Слайд формы Ф.И.О и филиала
const formSlide = document.createElement("div");
formSlide.className = "swiper-slide";
formSlide.innerHTML = `
  <div class="card" data-q="form">
    <div class="q">Пожалуйста, заполните свои данные</div>
    <div class="muted">Это необходимо для идентификации ответов</div>
    <div class="controls" style="flex-direction: column; gap: 10px;">
      <input type="text" id="fullName" placeholder="Ф.И.О." style="padding:10px; border-radius:8px; border:none; width:100%;" />
      <select id="branch" style="padding:10px; border-radius:8px; border:none; width:100%;">
        <option value="">Выберите филиал</option>
        ${BRANCHES.map((b) => `<option value="${b}">${b}</option>`).join("")}
      </select>
    </div>
    <div class="submit">
      <button id="submitBtn">Отправить ответы</button>
    </div>
  </div>
`;
swiperWrapper.appendChild(formSlide);

// Инициализация Swiper
const swiper = new Swiper(".swiper", {
  effect: "coverflow",
  centeredSlides: true,
  slidesPerView: "auto",
  coverflowEffect: { rotate: 12, depth: 160, modifier: 1, slideShadows: true },
  speed: 500,
  on: { slideChange: updateProgressUI },
});

// Обработчики
document.querySelectorAll(".rating").forEach((r) =>
  r.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn")) {
      state[r.dataset.key] = e.target.dataset.value;
      updateProgressUI();
      setTimeout(() => swiper.slideNext(), 250);
    }
  })
);

document.querySelectorAll(".option").forEach((b) =>
  b.addEventListener("click", () => {
    state[b.dataset.key] = b.dataset.value;
    updateProgressUI();
    setTimeout(() => swiper.slideNext(), 250);
  })
);

document.querySelectorAll(".shortAnswer").forEach((input) =>
  input.addEventListener("input", () => {
    state[input.dataset.key] = input.value.trim() || null;
    updateProgressUI();
  })
);

document.querySelectorAll(".next").forEach((b) => b.addEventListener("click", () => swiper.slideNext()));
document.querySelectorAll(".prev").forEach((b) => b.addEventListener("click", () => swiper.slidePrev()));

const toast = document.getElementById("toast");
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => toast.classList.remove("show"), 2200);
}

function blockPage(msg) {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background-color:rgba(0,0,0,0.7);z-index:9999;
    display:flex;justify-content:center;align-items:center;
    color:#fff;font-size:1.8em;text-align:center;padding:20px;
  `;
  overlay.innerText = msg;
  document.body.appendChild(overlay);
  document.body.style.pointerEvents = "none";
  overlay.style.pointerEvents = "auto";
}

// Отправка формы
const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", async () => {
  const fullName = document.getElementById("fullName").value.trim();
  const branch = document.getElementById("branch").value;

  if (!fullName || !branch) return showToast("Пожалуйста, заполните Ф.И.О. и выберите филиал");
  if (countDone() < total) return showToast("Ответьте на все вопросы");

  const payload = { ...state, fullName, branch };

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "Отправка...";

    await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    Object.keys(state).forEach((k) => (state[k] = null));
    document.getElementById("fullName").value = "";
    document.getElementById("branch").value = "";
    updateProgressUI();
    swiper.slideTo(0);

    blockPage("Спасибо! Ваша оценка успешно отправлена.");
  } catch (e) {
    console.error(e);
    showToast("Ошибка отправки");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Отправить";
  }
});
