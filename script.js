const THEME_KEY = "theme";
const themeBtn = document.getElementById("themeToggle");
const root = document.documentElement;

function applyTheme(theme) {
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  if (themeBtn) themeBtn.textContent = root.classList.contains("dark") ? "☀️ Светлая" : "🌙 Тёмная";
}
function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
applyTheme(getPreferredTheme());
themeBtn?.addEventListener("click", () => {
  const next = root.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

const LANG_KEY = "lang";
const langBtn = document.getElementById("langToggle");
const cvLink  = document.getElementById("cvLink");

const dict = {
  ru: {
    title: "Портфолио | Anton Ilinskiy",
    langBtn: "EN",
    themeDark: "🌙 Тёмная",
    themeLight: "☀️ Светлая",
    downloadCV: "⬇️ Скачать CV",
    cvHeader: "📄 Резюме",
    cvDesc: "Вы можете скачать моё резюме на русском или английском языке:",
    cvRu: "🇷🇺 Скачать CV (RU)",
    cvEn: "🇬🇧 Download CV (EN)",
    subtitle: "Python Backend & Telegram Bots Developer",
    ctaProjects: "Мои проекты",
    ctaAbout: "Обо мне",
    ctaWeather: "Погода",
    aboutTitle: "Обо мне",
    aboutText: "Разрабатываю Telegram-ботов на <b>Python</b> (aiogram 3), хранение — <b>SQLAlchemy + SQLite/PostgreSQL</b>, фоновые задачи через <b>APScheduler</b>. Люблю понятную архитектуру и быстрый MVP.",
    hl1: "⚙️ Чистые хендлеры, сервисы и CRUD",
    hl2: "🗄️ Перенос на Postgres при необходимости",
    hl3: "⏰ Планировщик напоминаний",
    hl4: "🧪 Простые сценарии тестов",
    projectsTitle: "Проекты",
    proj1: "Запись авто на ТО: выбор услуги/мастера/слота; напоминания; история.",
    proj2: "Анкета, нормы ккал/БЖУ, тренировки (неделя/сегодня), история, стрик, напоминания.",
    proj3: "Каталог услуг, портфолио, сбор контактов, аккуратная навигация.",
    statsTitle: "Статистика",
    stats1: "Готовых бота",
    stats2: "Года практики",
    stats3: "Задач автоматизации",
    skillsTitle: "Навыки",
    weatherTitle: "Погода",
    showBtn: "Показать",
    hum: "Влажн.:",
    wind: "Ветер:",
    weatherHint: "* Нужен API-ключ OpenWeather — см. script.js → OPEN_WEATHER_KEY",
    toTop: "Наверх ↑",
    cityPlaceholder: "Город (например, Moscow)",
  },
  en: {
    title: "Portfolio | Anton Ilinskiy",
    langBtn: "RU",
    themeDark: "🌙 Dark",
    themeLight: "☀️ Light",
    downloadCV: "⬇️ Download CV",
    cvHeader: "📄 CV",
    cvDesc: "You can download my CV in Russian or English:",
    cvRu: "🇷🇺 Download CV (RU)",
    cvEn: "🇬🇧 Download CV (EN)",
    subtitle: "Python Backend & Telegram Bots Developer",
    ctaProjects: "Projects",
    ctaAbout: "About",
    ctaWeather: "Weather",
    aboutTitle: "About me",
    aboutText: "I build Telegram bots with <b>Python</b> (aiogram 3), persistence via <b>SQLAlchemy + SQLite/PostgreSQL</b>, background jobs with <b>APScheduler</b>. I value clean architecture and fast MVP.",
    hl1: "⚙️ Clean handlers, services & CRUD",
    hl2: "🗄️ Postgres migration when needed",
    hl3: "⏰ Background reminders",
    hl4: "🧪 Simple test scenarios",
    projectsTitle: "Projects",
    proj1: "Car service booking: choose service/master/slot; reminders; history.",
    proj2: "Profile, calorie/macro norms, workouts (week/today), history, streak, reminders.",
    proj3: "Service catalog, portfolio, contacts collection, clean navigation.",
    statsTitle: "Stats",
    stats1: "Bots delivered",
    stats2: "Years of practice",
    stats3: "Automation tasks",
    skillsTitle: "Skills",
    weatherTitle: "Weather",
    showBtn: "Show",
    hum: "Humidity:",
    wind: "Wind:",
    weatherHint: "* You need an OpenWeather API key — see script.js → OPEN_WEATHER_KEY",
    toTop: "Back to top ↑",
    cityPlaceholder: "City (e.g., London)",
  }
};

function getLang() { return localStorage.getItem(LANG_KEY) || "ru"; }

function applyLang(lang) {
  const map = dict[lang] || dict.ru;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n"); el.innerHTML = map[key] ?? el.innerHTML;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder"); el.setAttribute("placeholder", map[key] ?? el.getAttribute("placeholder"));
  });
  document.title = map.title;
  if (langBtn) langBtn.textContent = map.langBtn;

  if (cvLink) {
    cvLink.href = lang === "en" ? "assets/cv_en.docx" : "assets/cv_ru.docx";
    cvLink.setAttribute("download", "");
    cvLink.textContent = map.downloadCV;
  }
}

applyLang(getLang());

langBtn?.addEventListener("click", () => {
  const next = getLang() === "ru" ? "en" : "ru";
  localStorage.setItem(LANG_KEY, next);
  applyLang(next);
});

const OPEN_WEATHER_KEY = "3a1a8738106f2f6f13a4103ad3e96293";
const form = document.getElementById("weatherForm");
const card = document.getElementById("weatherCard");
const elCity = document.getElementById("wCity");
const elDesc = document.getElementById("wDesc");
const elTemp = document.getElementById("wTemp");
const elHum  = document.getElementById("wHum");
const elWind = document.getElementById("wWind");
const elIcon = document.getElementById("wIcon");
const elErr  = document.getElementById("wError");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  elErr.classList.add("hide");
  const city = document.getElementById("city").value.trim();
  if (!city) return;

  card.classList.remove("hide");
  elCity.textContent = "—"; elDesc.textContent = "—";
  elTemp.textContent = "…"; elHum.textContent = "…"; elWind.textContent = "…";
  elIcon.src = ""; elIcon.alt = "";

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPEN_WEATHER_KEY}&units=metric&lang=${getLang()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Fetch failed");
    const data = await res.json();

    elCity.textContent = `${data.name}, ${data.sys?.country ?? ""}`;
    elDesc.textContent = data.weather?.[0]?.description ?? "";
    elTemp.textContent = Math.round(data.main?.temp ?? 0);
    elHum.textContent  = Math.round(data.main?.humidity ?? 0);
    elWind.textContent = (data.wind?.speed ?? 0).toFixed(1);
    const icon = data.weather?.[0]?.icon;
    if (icon) { elIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`; elIcon.alt = data.weather?.[0]?.main ?? "weather"; }
  } catch (err) {
    elErr.textContent = getLang() === "en" ? "Error: check city and API key" : "Ошибка: проверьте город и ключ API";
    elErr.classList.remove("hide");
  }
});

if (!OPEN_WEATHER_KEY || OPEN_WEATHER_KEY === "PUT_YOUR_API_KEY_HERE") {
  const hint = document.querySelector(".weather__hint");
  if (hint) hint.textContent = getLang() === "en" ?
    "Add your OpenWeather API key in script.js (OPEN_WEATHER_KEY)." :
    "Добавьте API-ключ OpenWeather в script.js (OPEN_WEATHER_KEY).";
}

const io = new IntersectionObserver((entries) => {
  entries.forEach(en => { if (en.isIntersecting) en.target.classList.add("in-view"); });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

const sections = ["projects", "about", "weather"];
const buttons = {
  projects: document.querySelector('a[href="#projects"]'),
  about:    document.querySelector('a[href="#about"]'),
  weather:  document.querySelector('a[href="#weather"]'),
};
const navObs = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      const id = en.target.id;
      Object.values(buttons).forEach(b => b && b.classList.remove("active"));
      if (buttons[id]) buttons[id].classList.add("active");
    }
  });
},{threshold: 0.5});
sections.forEach(id => { const el = document.getElementById(id); if (el) navObs.observe(el); });

const pre = document.getElementById("preloader");
window.addEventListener("load", () => {
  setTimeout(() => pre?.classList.add("done"), 250);
});

/************ COUNTERS (on scroll) ************/
function animateCounter(el, duration = 1200) {
  const target = Number(el.getAttribute("data-target") || "0");
  const start = 0;
  const startTs = performance.now();
  function tick(ts) {
    const p = Math.min((ts - startTs) / duration, 1);
    el.textContent = Math.floor(start + (target - start) * p);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counters = document.querySelectorAll(".counter");
const countersObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      animateCounter(en.target);
      obs.unobserve(en.target); // запускать один раз
    }
  });
}, { threshold: 0.6 });
counters.forEach(c => countersObs.observe(c));


const skillSection = document.querySelector(".skills");
if (skillSection) {
  const bars = skillSection.querySelectorAll(".fill");
  const sbObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        bars.forEach(b => b.style.width = getComputedStyle(b).getPropertyValue("--val").trim());
        obs.disconnect(); // один раз
      }
    });
  }, { threshold: 0.35 });
  sbObs.observe(skillSection);
}
