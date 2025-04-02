(function () {
  const canvas = document.getElementById("contact-canvas");
  let width, height, ctx, points, target, animateHeader = true;
  let lastTime = 0;
  const fpsInterval = 1000 / 30; // limit to 30 FPS

  if (!canvas) return;

  initHeader();
  initAnimation();
  addListeners();

  function initHeader() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    target = { x: width / 2, y: height / 2 };

    points = [];
    const spacingX = width / 10;
    const spacingY = height / 10;

    for (let x = 0; x < width; x += spacingX) {
      for (let y = 0; y < height; y += spacingY) {
        const px = x + Math.random() * spacingX;
        const py = y + Math.random() * spacingY;
        const p = { x: px, originX: px, y: py, originY: py };
        p.color = getRandomColor();
        points.push(p);
      }
    }

    for (let i = 0; i < points.length; i++) {
      const closest = [];
      const p1 = points[i];
      for (let j = 0; j < points.length; j++) {
        if (i === j) continue;
        const p2 = points[j];
        if (closest.length < 3) {
          closest.push(p2);
        } else {
          let maxDist = 0, maxIndex = 0;
          for (let k = 0; k < closest.length; k++) {
            const d = getDistance(p1, closest[k]);
            if (d > maxDist) {
              maxDist = d;
              maxIndex = k;
            }
          }
          if (getDistance(p1, p2) < maxDist) {
            closest[maxIndex] = p2;
          }
        }
      }
      p1.closest = closest;
    }

    for (let i = 0; i < points.length; i++) {
      points[i].circle = new Circle(points[i], 2 + Math.random() * 2);
    }

    ctx = canvas.getContext("2d");
  }

  function addListeners() {
    canvas.addEventListener("mousemove", mouseMove);
    window.addEventListener("resize", resize);
  }

  function mouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    target.x = e.clientX - rect.left;
    target.y = e.clientY - rect.top;
  }

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    initHeader();
  }

  function initAnimation() {
    animate();
    for (let i = 0; i < points.length; i++) {
      shiftPoint(points[i]);
    }
  }

  function animate(currentTime) {
    requestAnimationFrame(animate);
    const elapsed = currentTime - lastTime;
    if (elapsed < fpsInterval) return;
    lastTime = currentTime;

    if (animateHeader) {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < points.length; i++) {
        const d = getDistance(target, points[i]);
        if (d < 4000) {
          points[i].active = 0.6;
          points[i].circle.active = 0.8;
        } else if (d < 20000) {
          points[i].active = 0.3;
          points[i].circle.active = 0.5;
        } else if (d < 40000) {
          points[i].active = 0.1;
          points[i].circle.active = 0.2;
        } else {
          points[i].active = 0;
          points[i].circle.active = 0;
        }
        drawLines(points[i]);
        points[i].circle.draw();
      }
    }
  }

  function shiftPoint(p) {
    gsap.to(p, {
      duration: 2 + Math.random() * 2,
      x: p.originX - 20 + Math.random() * 40,
      y: p.originY - 20 + Math.random() * 40,
      ease: "power2.inOut",
      onComplete: () => shiftPoint(p)
    });
  }

  function drawLines(p) {
    if (!p.active) return;
    for (let i = 0; i < p.closest.length; i++) {
      const [r, g, b] = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.closest[i].x, p.closest[i].y);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${p.active})`;
      ctx.stroke();
    }
  }

  function Circle(pos, rad) {
    this.pos = pos;
    this.radius = rad;
    this.draw = () => {
      if (!this.active) return;
      const [r, g, b] = this.pos.color;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.active})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${this.active})`;
      ctx.fill();
    };
  }

  function getDistance(p1, p2) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
  }

  function getRandomColor() {
    const colors = [
      [255, 99, 132],
      [54, 162, 235],
      [255, 206, 86],
      [75, 192, 192],
      [153, 102, 255],
      [255, 159, 64],
      [98, 255, 240]
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
})();