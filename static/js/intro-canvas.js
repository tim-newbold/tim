
(function() {
  var canvas = document.getElementById("demo-canvas"),
      width, height, ctx, points, target, animateHeader = true;

  initHeader();
  initAnimation();
  addListeners();

  function initHeader() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    target = {x: width / 2, y: height / 2};

    // Create points in a grid with randomness
    points = [];
    var spacingX = width / 20,
        spacingY = height / 20;
    for (var x = 0; x < width; x += spacingX) {
      for (var y = 0; y < height; y += spacingY) {
        var px = x + Math.random() * spacingX,
            py = y + Math.random() * spacingY;
        var p = {x: px, originX: px, y: py, originY: py};
        points.push(p);
      }
    }

    // For each point, find the 5 closest points
    for (var i = 0; i < points.length; i++) {
      var closest = [];
      var p1 = points[i];
      for (var j = 0; j < points.length; j++) {
        if (i === j) continue;
        var p2 = points[j];
        if (closest.length < 5) {
          closest.push(p2);
        } else {
          var maxDist = 0, maxIndex = 0;
          for (var k = 0; k < closest.length; k++) {
            var d = getDistance(p1, closest[k]);
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

    // Assign a circle object to each point
    for (var i = 0; i < points.length; i++) {
      points[i].circle = new Circle(points[i], 2 + Math.random() * 2, 'rgba(156,217,249,0.3)');
    }

    ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
  }

  function addListeners() {
    // Use document-level mousemove so the effect works even over overlays
    document.addEventListener('mousemove', mouseMove);
    window.addEventListener('scroll', scrollCheck);
    window.addEventListener('resize', resize);
  }

  function mouseMove(e) {
    var posx = e.pageX || e.clientX,
        posy = e.pageY || e.clientY;
    target.x = posx;
    target.y = posy;
  }

  function scrollCheck() {
    if(document.body.scrollTop > height) animateHeader = false;
    else animateHeader = true;
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initHeader();
  }

  function initAnimation() {
    animate();
    // Begin shifting points continuously using GSAP
    for (var i = 0; i < points.length; i++) {
      shiftPoint(points[i]);
    }
  }

  function animate() {
    if (animateHeader) {
      ctx.clearRect(0, 0, width, height);
      for (var i = 0; i < points.length; i++) {
        // Determine active state based on distance from target
        var d = getDistance(target, points[i]);
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
    requestAnimationFrame(animate);
  }

  function shiftPoint(p) {
    gsap.to(p, {
      duration: 1 + Math.random(),
      x: p.originX - 50 + Math.random() * 100,
      y: p.originY - 50 + Math.random() * 100,
      ease: "power2.inOut",
      onComplete: function() {
        shiftPoint(p);
      }
    });
  }

  function drawLines(p) {
    if (!p.active) return;
    for (var i = 0; i < p.closest.length; i++) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.closest[i].x, p.closest[i].y);
      // Use a neon cyan color that lights up according to the active value
      ctx.strokeStyle = 'rgba(0,255,255,' + p.active + ')';
      ctx.stroke();
    }
  }

  function Circle(pos, rad, color) {
    var _this = this;
    _this.pos = pos;
    _this.radius = rad;
    _this.color = color;
    this.draw = function() {
      if (!_this.active) return;
      ctx.beginPath();
      ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'rgba(156,217,249,' + _this.active + ')';
      ctx.fill();
    };
  }

  function getDistance(p1, p2) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
  }
})();
