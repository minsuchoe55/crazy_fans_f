<template>
  <router-view></router-view>
</template>

<script setup></script>

<style>
html {
  scroll-behavior: smooth;
}

/* 변수 */
:root {
  --main-background-color: rgba(0, 0, 0, 0.9);
  --sub-background-color: rgba(40, 40, 40, 0.9);

  --main-border-color: rgba(255, 255, 255, 0.1);
  --main-border-hover-color: rgba(255, 255, 255, 0.2);

  --video-background-color: rgba(0, 0, 0, 0.6);

  --first-font-color: #fff;
  --second-font-color: #888;
  --third-font-color: #666;
}

/* 바디 */
body {
  margin: 0;
  background-color: #000;
}

/* 플레이어 */
.grid-container video {
  aspect-ratio: 16 / 9; /* 비율 고정 */
}
@media (pointer: fine) {
  .swiper-wrapper video {
    aspect-ratio: 16 / 9; /* 비율 고정 */
  }
}
@media (pointer: coarse) {
  .swiper-wrapper video {
    aspect-ratio: 9 / 16; /* 비율 고정 */
    height: 100%; /* 가로 대응 */
  }
}
media-menu-button,
media-pip-button,
media-google-cast-button {
  visibility: hidden; /* 높이 고정 */
}
</style>
