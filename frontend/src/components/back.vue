<template>
  <a href="/" class="back-button">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round"/>
      </svg>
      返回
    </a>
</template>
<style>
.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #4285f4;
  font-size: 16px;
  transition: color 0.3s ease;
  z-index: 999;
}

.back-button:hover {
  color: #3367d6; /* 悬停时颜色变深 */
}

.back-button svg {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}
</style>