const QUESTIONS = [
  {
    id: "Вопрос-1",
    text: "Насколько удобной была запись на прием? (1–10)",
    muted: "1 — неудобно, 10 — очень удобно",
    img: "https://orzumed.uz/wp-content/uploads/2024/08/zangata-adres-2048x1365-1.jpg",
  },
  {
    id: "Вопрос-2",
    text: "Насколько внимателен был врач? (1–10)",
    muted: "1 — невнимательно, 10 — очень внимательно",
    img: "https://orzumed.uz/wp-content/uploads/2024/06/0m5a9144-scaled.jpg",
  },
  {
    id: "Вопрос-3",
    text: "Чувствовали ли вы заботу и комфорт? (1–10)",
    muted: "1 — нет, 10 — максимально",
    img: "https://clinics.uz/components/com_mtree/img/listings/m/5162.jpg",
  },
  {
    id: "Вопрос-4",
    text: "Порекомендуете ли клинику друзьям? (1–10)",
    muted: "1 — нет, 10 — да",
    img: "https://sendsay.ru/blog/storage/2023/12/11/2c7563b76b3bdcb0f46ea5b2c8d93dfab1def7a0.svg",
  },
];

const BRANCHES = [
  "Зангиота",
  "Юнусобод",
  "Фотима-Султон",
  "Паркент",
  "Янгибазар",
  "Аккурган",
  "Чиноз",
];

const swiperWrapper = document.querySelector(".swiper-wrapper");

// Создаём слайды вопросов
QUESTIONS.forEach((q, idx) => {
  const slide = document.createElement("div");
  slide.className = "swiper-slide";
  slide.innerHTML = `
    <div class="card" data-q="${idx + 1}">
      <div class="media"><img src="${q.img}" /></div>
      <div class="q">${idx + 1}. ${q.text}</div>
      <div class="muted">${q.muted}</div>
      <div class="rating" data-key="${q.id}"></div>
      <div class="controls">
        <span class="pill">Вопрос ${idx + 1} / ${QUESTIONS.length}</span>
        <div class="nav">
           <button class="iconbtn next">⟶</button>
        </div>
      </div>
    </div>
  `;
  swiperWrapper.appendChild(slide);
});

// Создаём слайд формы для Ф.И.О. и филиала
const formSlide = document.createElement("div");
formSlide.className = "swiper-slide";
formSlide.innerHTML = `
  <div class="card" data-q="form">
    <div class="q">Пожалуйста, заполните свои данные</div>
    <div class="muted">Это необходимо для идентификации ответов</div>
    <div class="controls" style="flex-direction: column; gap: 10px;">
      <input type="text" id="fullName" placeholder="Ф.И.О." style="padding: 10px; border-radius: 8px; border: none; width: 100%;" />
      <select id="branch" style="padding: 10px; border-radius: 8px; border: none; width: 100%;">
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
