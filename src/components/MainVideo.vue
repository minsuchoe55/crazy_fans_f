<template>
  <!-- 플레이어 -->
  <media-player
    view-type="video"
    stream-type="on-demand"
    :src="ads"
    playsInline
  >
    <media-provider> </media-provider>
    <media-video-layout> </media-video-layout>
  </media-player>
  <!-- 플레이어 -->
</template>

<script setup>
import { computed, onMounted } from "vue";
import "vidstack/bundle";

// 프롭스
const props = defineProps({
  video: Object,
  ADS: Object,
});

// 글로벌
const CDN_URL = import.meta.env.VITE_CDN_URL;

// 광고
const ads = computed(() => {
  return `${CDN_URL}/ads/${
    props.ADS[Math.floor(Math.random() * props.ADS.length)].src
  }`;
});

// 플레이
const play = () => {
  const player = document.querySelector("media-player");

  player.subscribe(({ canPlay, ended, source }) => {
    // 영상 재생
    if (canPlay === true && ended === false) {
      player.play();

      // 광고 고정
      const slider = document.querySelector("media-time-slider");
      if (source.src.includes(".net/ads/")) {
        slider.disabled = true;
      } else {
        slider.disabled = false;
      }
    }

    // 영상 교체
    if (ended === true && source.src.includes(".net/ads/")) {
      player.src = `${CDN_URL}/video/${props.video.video}`;
    }
  });
};

// 라이프사이클
onMounted(() => {
  play();
});
</script>

<style>
/* 플레이어 */
media-menu-button,
media-pip-button,
media-google-cast-button,
media-spinner {
  display: none !important;
}
</style>
