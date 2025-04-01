document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  const root = document.documentElement;

  toggle.addEventListener("change", () => {
    const newTheme = toggle.checked ? "light" : "dark";
    root.setAttribute("data-theme", newTheme);
  });
});