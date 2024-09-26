<template>
  <div class="main-container">
    <canvas id="myCanvas" ref="canvas"></canvas>
    <theme/>

  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import theme from '@/components/home/theme.vue';


const particleCount = 300;
const particleSpeed = 0.25;
const particleSize = 2;
const maxDistance = 100;
const lightningColor = "#fff";

const canvas = ref(null);

let animationFrameId;

onMounted(() => {
  const ctx = canvas.value.getContext("2d");

  function setCanvasSize() {
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
  }

  setCanvasSize();
  window.addEventListener('resize', setCanvasSize);

  const particles = [];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.value.width;
      this.y = Math.random() * canvas.value.height;
      this.angle = Math.random() * 2 * Math.PI;
      this.speed = Math.random() * particleSpeed;
      this.opacity = Math.random() * 0.5 + 0.5;
    }

    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;

      if (this.x < 0 || this.x > canvas.value.width || this.y < 0 || this.y > canvas.value.height) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, particleSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  function createParticles() {
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = lightningColor;
          ctx.lineWidth = 0.2 * (1 - distance / maxDistance);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    drawConnections();
    animationFrameId = requestAnimationFrame(animate);
  }

  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    particles.forEach(particle => {
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        particle.angle = Math.atan2(dy, dx);
        particle.speed = 5;
      } else {
        particle.speed = Math.random() * particleSpeed;
      }
    });
  });

  createParticles();
  animate();

  onUnmounted(() => {
    window.removeEventListener('resize', setCanvasSize);
    cancelAnimationFrame(animationFrameId);
  });
});
</script>

<style scoped>
.main-container {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

canvas {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #15ccff, #7772ff);
  z-index: 1; /* 背景层次 */
}

</style>
