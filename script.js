document.body.classList.add("js-enabled");

const animatedElements = document.querySelectorAll(
  ".fade-in, .hero-title, .hero-subtitle, .service, .text-block"
);

const revealElement = (element) => {
  element.classList.add("visible");
};

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealElement(entry.target);
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  animatedElements.forEach((element) => observer.observe(element));
} else {
  animatedElements.forEach(revealElement);
}

const navbar = document.querySelector(".navbar");

const updateNavbarState = () => {
  if (!navbar) return;
  navbar.classList.toggle("navbar-scrolled", window.scrollY > 24);
};

updateNavbarState();
window.addEventListener("scroll", updateNavbarState, { passive: true });

// Valida la aceptacion de la politica de privacidad antes de enviar el formulario.
const contactForm = document.querySelector(".contact-form");
const privacyCheckbox = document.querySelector("#aceptacion_privacidad");
const privacyError = document.querySelector("#privacidad-error");

const showPrivacyError = () => {
  if (!privacyCheckbox || !privacyError) return;
  privacyError.hidden = false;
  privacyCheckbox.setAttribute("aria-invalid", "true");
  privacyCheckbox.focus();
};

const hidePrivacyError = () => {
  if (!privacyCheckbox || !privacyError) return;
  privacyError.hidden = true;
  privacyCheckbox.removeAttribute("aria-invalid");
};

if (contactForm && privacyCheckbox) {
  contactForm.addEventListener("submit", (event) => {
    hidePrivacyError();

    if (!privacyCheckbox.checked) {
      event.preventDefault();
      showPrivacyError();
      return;
    }

    if (!contactForm.checkValidity()) {
      event.preventDefault();
      contactForm.reportValidity();
      return;
    }
  });

  privacyCheckbox.addEventListener("change", () => {
    if (privacyCheckbox.checked) {
      hidePrivacyError();
    }
  });
}

const canvas = document.getElementById("neuralCanvas");
const ctx = canvas.getContext("2d");

let width, height;
let mouse = { x: null, y: null };

const nodes = [];
const NODE_COUNT = 80;

// Resize
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// Mouse tracking
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Node class
class Node {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(197,106,45,0.6)";
    ctx.fill();
  }
}

// Create nodes
for (let i = 0; i < NODE_COUNT; i++) {
  nodes.push(new Node());
}

// Draw connections
function connectNodes() {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(197,106,45,${1 - dist / 120})`;
        ctx.lineWidth = 1;
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }

    // conexión con el ratón
    if (mouse.x && mouse.y) {
      const dx = nodes[i].x - mouse.x;
      const dy = nodes[i].y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${1 - dist / 150})`;
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, width, height);

  nodes.forEach((node) => {
    node.update();
    node.draw();
  });

  connectNodes();

  requestAnimationFrame(animate);
}

animate();