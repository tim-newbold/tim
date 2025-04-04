document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll(".section:not(.visible)").forEach(section => {
    observer.observe(section);
  });
});


document.addEventListener("DOMContentLoaded", () => {
  // Step 1: Ensure sections are visible by default (mobile-safe)
  document.querySelectorAll(".section").forEach(section => {
    section.classList.add("pre-visible");
  });

  // Step 2: Initialize scroll observer for animation
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll(".section").forEach(section => {
    observer.observe(section);
  });
});