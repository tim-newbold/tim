
  // Animated Showcase for Projects
document.addEventListener("DOMContentLoaded", () => {
  const tagButtons = document.querySelectorAll('.tag-btn');
  const projectCards = document.querySelectorAll('.project-card');

  tagButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const tag = this.getAttribute('data-tag');

      tagButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      projectCards.forEach(card => {
        const tags = card.getAttribute('data-tags').split(',');
        if (tag === 'all' || tags.includes(tag)) {
          card.style.display = 'block';
          setTimeout(() => card.classList.add('visible'), 50);
        } else {
          card.classList.remove('visible');
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });

  // Scroll animation using IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  projectCards.forEach(card => observer.observe(card));
});
