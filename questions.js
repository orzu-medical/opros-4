// Вопросы с фокусом на боли и ожидания
const QUESTIONS = [
  {
    id: "Вопрос-1",
    text: "С какой главной проблемой вы пришли в клинику?",
    type: "options",
    options: ["Боль", "Эстетика", "Профилактика", "Другое"],
    img: "https://orzumed.uz/wp-content/uploads/2024/08/zangata-adres-2048x1365-1.jpg",
  },
  {
    id: "Вопрос-2",
    text: "Насколько качественно решена ваша проблема? (1–10)",
    type: "rating",
    muted: "1 — плохо, 10 — отлично",
    img: "https://orzumed.uz/wp-content/uploads/2024/06/0m5a9144-scaled.jpg",
  },
  {
    id: "Вопрос-3",
    text: "Что для вас было самым важным при выборе клиники?",
    type: "options",
    options: ["Врач", "Цена", "Сервис", "Удобство"],
    img: "https://clinics.uz/components/com_mtree/img/listings/m/5162.jpg",
  },
  {
    id: "Вопрос-4",
    text: "Чего вам не хватило во время визита?",
    type: "text",
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
