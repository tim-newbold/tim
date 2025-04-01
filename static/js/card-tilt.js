
  // Apply dynamic tilt effect to all elements with the class "tilt-card"
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const cardWidth = rect.width;
      const cardHeight = rect.height;
      // Calculate mouse offset relative to card center
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      const centerX = cardWidth / 2;
      const centerY = cardHeight / 2;
      // Map offset to rotation: maximum rotation of 20 degrees
      const rotateY = ((offsetX - centerX) / centerX) * 20;
      const rotateX = -((offsetY - centerY) / centerY) * 20;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.transition = 'transform 0.3s ease'; // Inside mousemove
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    });
  });
