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

// 비디오
const video = computed(() => {
  return props.video.video;
});

// 광고
const ads = computed(() => {
  return `${CDN_URL}/ads/${
    props.ADS[Math.floor(Math.random() * props.ADS.length)].src
  }`;
});

// 플레이
const play = () => {
  const player = document.querySelector("media-player");
  const button = document.querySelector("media-play-button");
  const slider = document.querySelector("media-time-slider");

  player.subscribe(({ canLoad, canPlay, ended, source }) => {
    // 로드
    if (
      canLoad === true &&
      ended === false &&
      !source.src.includes(".net/ads/")
    ) {
      // 비디오 로드 시 플레이 버튼 숨김
      button.style.visibility = "hidden";
    }

    // 재생
    if (canPlay === true && ended === false) {
      player.play();

      // 비디오 재생 시 플레이 버튼 숨김 해제
      button.style.visibility = "visible";

      // 비디오 재생 시 슬라이더 고정 해제
      slider.disabled = false;
      if (source.src.includes(".net/ads/")) {
        // 광고 재생 시 슬라이더 고정
        slider.disabled = true;
      }
    }

    // 종료
    if (ended === true && source.src.includes(".net/ads/")) {
      // 광고 종료 시 비디오로 소스 교체
      player.src = `${CDN_URL}/video/${video.value}`;
    }
  });
};

// 라이프사이클
onMounted(() => {
  play();
});
</script>

<style scoped></style>
