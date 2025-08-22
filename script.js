const STORAGE_KEY = "theme";
const btn = document.getElementById("themeToggle");
const root = document.documentElement;

function applyTheme(theme) {
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  btn.textContent = root.classList.contains("dark") ? "☀️ Светлая" : "🌙 Тёмная";
}

function getPreferredTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return saved;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

applyTheme(getPreferredTheme());

btn.addEventListener("click", () => {
  const next = root.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem(STORAGE_KEY, next);
  applyTheme(next);
});

const OPEN_WEATHER_KEY = "3a1a8738106f2f6f13a4103ad3e96293";

const form = document.getElementById("weatherForm");
const card = document.getElementById("weatherCard");
const elCity = document.getElementById("wCity");
const elDesc = document.getElementById("wDesc");
const elTemp = document.getElementById("wTemp");
const elHum = document.getElementById("wHum");
const elWind = document.getElementById("wWind");
const elIcon = document.getElementById("wIcon");
const elErr = document.getElementById("wError");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  elErr.classList.add("hide");
  const city = document.getElementById("city").value.trim();
  if (!city) return;

  card.classList.remove("hide");
  elCity.textContent = "—"; elDesc.textContent = "—";
  elTemp.textContent = "…"; elHum.textContent = "…"; elWind.textContent = "…";
  elIcon.src = ""; elIcon.alt = "";

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPEN_WEATHER_KEY}&units=metric&lang=ru`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Не удалось получить данные");
    const data = await res.json();

    elCity.textContent = `${data.name}, ${data.sys?.country ?? ""}`;
    elDesc.textContent = data.weather?.[0]?.description ?? "";
    elTemp.textContent = Math.round(data.main?.temp ?? 0);
    elHum.textContent = Math.round(data.main?.humidity ?? 0);
    elWind.textContent = (data.wind?.speed ?? 0).toFixed(1);
    const icon = data.weather?.[0]?.icon;
    if (icon) {
      elIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      elIcon.alt = data.weather?.[0]?.main ?? "weather";
    }
  } catch (err) {
    elErr.textContent = "Ошибка: " + (err.message || "проверьте город и ключ API");
    elErr.classList.remove("hide");
  }
});
