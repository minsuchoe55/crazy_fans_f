<template>
  <!-- 슬라이드 -->
  <swiper
    :modules="[Virtual]"
    virtual
    :direction="'vertical'"
    @slideChange="slideChange"
  >
    <swiper-slide
      v-for="(data, index) in video"
      :key="index"
      :virtualIndex="index"
    >
      <!-- 플레이어 -->
      <media-player
        load="eager"
        view-type="video"
        stream-type="on-demand"
        :src="
          data.id
            ? `${CDN_URL}/video/${data.video}`
            : `${CDN_URL}/ads/${data.video}`
        "
        :autoplay="index === 0"
        :loop="data.id"
        playsInline
      >
        <media-provider>
          <div
            v-if="data.id"
            @touchend="
              emit('search', data.user, true);
              emit('short');
            "
            class="actor-wrapper"
          >
            <img :src="`${CDN_URL}/actor/${data.actor}`" class="actor-thumb" />
            <span class="actor-user">
              {{ data.user }}
            </span>
          </div>
          <div v-else class="actor-wrapper">
            <a :href="data.href" target="_blank"
              ><img
                :src="`${CDN_URL}/actor/${data.actor}`"
                class="actor-thumb"
              />
              <span class="actor-user">
                {{ data.partner }}
              </span></a
            >
          </div>
        </media-provider>
        <media-video-layout> </media-video-layout>
      </media-player>
      <!-- 플레이어 -->
    </swiper-slide>
  </swiper>
  <!-- 슬라이드 -->
</template>

<script setup>
import { computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Virtual } from "swiper/modules";
import "swiper/css";
import "vidstack/bundle";

// 프롭스
const props = defineProps({
  VIDEO: Object,
  ADS: Object,
});

// 이벤트
const emit = defineEmits(["search", "short"]);

// 글로벌
const CDN_URL = import.meta.env.VITE_CDN_URL;

// 슬라이드
const slideChange = async (event) => {
  const players = document.querySelectorAll("media-player");
  const sliders = document.querySelectorAll("media-time-slider");

  // 재생
  if (players.length === 2) {
    if (event.previousIndex < event.activeIndex) {
      players[0].pause();
      // await new Promise((resolve) => setTimeout(resolve, 500));
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
      players[2].play();
    } else if (event.previousIndex > event.activeIndex) {
      players[1].pause();
      players[0].play();
    } else {
      players[1].play();
    }
  }

  // 광고
  if (event.activeIndex % 10 === 0) {
    // 광고 재생 시 슬라이드 고정
    event.allowTouchMove = false;
    event.allowSlideNext = false;
    event.allowSlidePrev = false;
    sliders[2].disabled = true;

    players[2].subscribe(({ ended }) => {
      if (ended) {
        // 비디오 재생 시 슬라이드 고정 해제
        event.allowTouchMove = true;
        event.allowSlideNext = true;
        event.allowSlidePrev = true;
        sliders[2].disabled = false;
        event.slideNext();
      }
    });
  }
};

// 비디오
const video = computed(() => {
  return props.VIDEO.reduce((acc, data, index) => {
    acc.push(data);

    // 광고 삽입
    if (index > 0 && index % 9 === 0) {
      const random = Math.floor(Math.random() * props.ADS.length);

      acc.push({
        video: props.ADS[random].src,
        href: props.ADS[random].href,
      });
    }

    return acc;
  }, []);
});

// 기타
document.documentElement.style.setProperty(
  "--vh",
  `${window.innerHeight * 0.01}px`
);
</script>

<style scoped>
/* 오버레이 */
.actor-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  left: 16px;
  bottom: 10%;
  z-index: 999;
}
.actor-thumb {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  box-sizing: border-box;
  cursor: pointer;
}
.actor-user {
  color: var(--first-font-color);
  font-size: 16px;
  margin-left: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
  cursor: pointer;
}
@media (pointer: fine) {
  .actor-wrapper:hover .actor-thumb {
    border-color: #ff0000;
    transform: scale(1.2);
  }
  .actor-wrapper:hover .actor-user {
    color: #ff0000;
  }
}

/* 플레이어 */
@media (pointer: fine) {
  .swiper {
    height: calc(100vh - 64px);
  }
}
@media (pointer: coarse) {
  .swiper {
    height: calc(var(--vh, 1vh) * 100 - 64px);
  }
  .swiper media-player {
    height: calc(var(--vh, 1vh) * 100 - 64px); /* 가로 대응 */
  }
}
</style>
