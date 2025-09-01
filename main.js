// URL теперь на наш Node.js прокси
const ENDPOINT = "https://orzu-medical-1-production.up.railway.app/submit";
const MAX_SUBMISSIONS = 1;

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
document.querySelectorAll(".rating").forEach(makeRatingButtons);

// Инициализация Swiper
const swiper = new Swiper(".swiper", {
  effect: "coverflow",
  centeredSlides: true,
  slidesPerView: "auto",
  coverflowEffect: { rotate: 12, depth: 160, modifier: 1, slideShadows: true },
  speed: 500,
  on: { slideChange: updateProgressUI },
});

// Инициализация состояния
const state = Object.fromEntries(QUESTIONS.map((q) => [q.id, null]));
const total = QUESTIONS.length;
const bar = document.getElementById("progressBar");
const txt = document.getElementById("progressText");

// Подсчёт выполненных вопросов
function countDone() {
  return Object.values(state).filter((v) => v).length;
}

// Обновление UI прогресса и активных кнопок
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
}

updateProgressUI();

// Выбор рейтинга
document.querySelectorAll(".rating").forEach((r) =>
  r.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn")) {
      state[r.dataset.key] = e.target.dataset.value;
      updateProgressUI();
      setTimeout(() => swiper.slideNext(), 250);
    }
  })
);

// Навигация стрелками
document
  .querySelectorAll(".prev")
  .forEach((b) => b.addEventListener("click", () => swiper.slidePrev()));
document
  .querySelectorAll(".next")
  .forEach((b) => b.addEventListener("click", () => swiper.slideNext()));

// Toast уведомления
const toast = document.getElementById("toast");
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => toast.classList.remove("show"), 2200);
}

// Счётчик отправок
let submissionCount = 0;

// Блокировка всей страницы
function blockPage(msg) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0,0,0,0.7)";
  overlay.style.zIndex = 9999;
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.color = "#fff";
  overlay.style.fontSize = "1.8em";
  overlay.style.textAlign = "center";
  overlay.style.padding = "20px";
  overlay.innerText = msg;
  document.body.appendChild(overlay);

  // Блокируем все клики на странице
  document.body.style.pointerEvents = "none";
  overlay.style.pointerEvents = "auto";
}

// Отправка данных через прокси
const submitBtn = document.getElementById("submitBtn");
if (submitBtn) {
  submitBtn.addEventListener("click", async () => {
    const fullName = document.getElementById("fullName").value.trim();
    const branch = document.getElementById("branch").value;

    if (!fullName || !branch) {
      showToast("Пожалуйста, заполните Ф.И.О. и выберите филиал");
      return;
    }

    if (countDone() < total) {
      showToast("Ответьте на все вопросы");
      return;
    }

    const payload = { ...state, fullName, branch };

    try {
      // Включаем loading
      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Отправка...";

      await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      submissionCount++;
      // Сброс состояния и формы
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
}
