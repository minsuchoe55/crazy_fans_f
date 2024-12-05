<template>
  <!-- 슬라이드 -->
  <swiper
    :modules="[Virtual]"
    virtual
    :direction="'vertical'"
    @slideChange="slideChange"
    :slidesPerView="1"
  >
    <swiper-slide
      v-for="(data, index) in props.VIDEO"
      :key="index"
      :virtualIndex="index"
    >
      <!-- 플레이어 -->
      <media-player
        load="eager"
        view-type="video"
        stream-type="on-demand"
        :src="`${CDN_URL}/video/${data.video}`"
        :autoplay="index === 0"
        loop
        playsInline
      >
        <media-provider> </media-provider>
        <media-video-layout> </media-video-layout>
      </media-player>
      <!-- 플레이어 -->
    </swiper-slide>
  </swiper>
  <!-- 슬라이드 -->
</template>

<script setup>
// import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Virtual } from "swiper/modules";
import "swiper/css";
import "vidstack/bundle";

// 프롭스
const props = defineProps({
  VIDEO: Object,
  ADS: Object,
});

// // 이벤트
// const emit = defineEmits(["search"]);

// 글로벌
const CDN_URL = import.meta.env.VITE_CDN_URL;

// 플레이
const slideChange = async (event) => {
  const players = document.querySelectorAll("media-player");

  if (players.length === 2) {
    if (event.previousIndex < event.activeIndex) {
      players[0].pause();
      await new Promise((resolve) => setTimeout(resolve, 500));
      players[1].play();
    } else if (event.previousIndex > event.activeIndex) {
      players[1].pause();
      players[0].play();
    } else {
      players[0].play();
    }
  } else {
    if (event.previousIndex < event.activeIndex) {
      players[1].pause();
      await new Promise((resolve) => setTimeout(resolve, 500));
      players[2].play();
    } else if (event.previousIndex > event.activeIndex) {
      players[1].pause();
      players[0].play();
    } else {
      players[1].play();
    }
  }
};

// 검색 넣기
// 자동 재생
// 광고 넣기

// id: data.id,
// user: data["actor"].user,
// nick: data["actor"].nick,
// actor: data["actor"].actor,
// plat: data["actor"].plat,
// thumb: data.thumb,
// video: data.video,
// time: data.time,
// date: data.date,
// hash: data.hash,

// 기타
const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);
</script>

<style scoped>
/* 슬라이드 */
.swiper {
  height: calc(var(--vh, 1vh) * 100 - 64px);
}

/* 플레이어 */
media-player {
  aspect-ratio: 9 / 16; /* 비율 고정 */
}
</style>
