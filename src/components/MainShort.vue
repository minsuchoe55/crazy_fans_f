<template>
  <!-- 슬라이드 -->
  <swiper
    :modules="[Virtual]"
    virtual
    :direction="'vertical'"
    @slideChange="slideChange"
    @slidesUpdated="slidesUpdated"
  >
    <swiper-slide
      v-for="(data, index) in video"
      :key="index"
      :virtualIndex="index"
    >
      <!-- 플레이어 -->
      <media-player
        @contextmenu.prevent
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
          <!-- 직접 선택 -->
          <div
            v-if="data.id && isControlsVisible"
            @pointerup="
              emit('search', data.user, true);
              props.shortState && emit('shortButton');
            "
            class="overlay-wrapper"
          >
            <img
              :src="`${CDN_URL}/actor/${data.actor}`"
              class="overlay-actor-thumb"
            />
            <span class="overlay-actor-user">
              {{ data.user }}
            </span>
          </div>

          <div
            v-else-if="!data.id && isControlsVisible"
            @pointerup="fresh(data.href)"
            class="overlay-wrapper"
          >
            <img
              :src="`${CDN_URL}/ads/${data.thumb}`"
              class="overlay-actor-thumb"
            />
            <span class="overlay-actor-user">
              {{ data.partner }}
            </span>
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
import { ref, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Virtual } from "swiper/modules";
import "swiper/css";
import "vidstack/bundle";

// 프롭스
const props = defineProps({
  VIDEO: Object,
  ADS: Object,
  shortState: Boolean,
});

// 이벤트
const emit = defineEmits(["search", "shortButton"]);

// 글로벌
const CDN_URL = import.meta.env.VITE_CDN_URL;

// 새창
const fresh = (href) => {
  window.open(href);
};

// 비디오
const video = computed(() => {
  return props.VIDEO.reduce((acc, data, index) => {
    if (!data.short) {
      // TODO
      // if (data.short === true) {
      acc.push(data);
    }

    // 광고
    if (index > 0 && index % 9 === 0) {
      const random = Math.floor(Math.random() * props.ADS.length);

      acc.push({
        partner: props.ADS[random].partner,
        thumb: props.ADS[random].thumb,
        video: props.ADS[random].video,
        href: props.ADS[random].href,
      });
    }

    return acc;
  }, []);
});

// 슬라이드
const slideChange = (event) => {
  const players = document.querySelectorAll("media-player");
  const sliders = document.querySelectorAll("media-time-slider");

  // 재생
  if (players.length === 2) {
    if (event.previousIndex < event.activeIndex) {
      players[0].pause();
      players[1].subscribe(({ canPlay }) => {
        if (canPlay === true) {
          players[1].play();
        }
      });
    } else {
      players[1].pause();
      players[0].subscribe(({ canPlay }) => {
        if (canPlay === true) {
          players[0].play();
        }
      });
    }
  } else if (players.length === 3) {
    if (event.previousIndex < event.activeIndex) {
      players[1].pause();
      players[2].subscribe(({ canPlay }) => {
        if (canPlay === true) {
          players[2].play();
        }
      });
    } else {
      players[1].pause();
      players[0].subscribe(({ canPlay }) => {
        if (canPlay === true) {
          players[0].play();
        }
      });
    }
  }

  // 광고
  if (event.activeIndex > 0 && event.activeIndex % 10 === 0) {
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

// 기타
const isControlsVisible = ref(true);
const slidesUpdated = () => {
  const players = document.querySelectorAll("media-player");

  // 오버레이 숨겨질 때 커스텀 오버레이도 숨겨지게 변경
  for (let player of players) {
    player.subscribe(({ controlsVisible }) => {
      isControlsVisible.value = controlsVisible;
    });
  }
};

document.documentElement.style.setProperty(
  // 100vh의 기준을 innerHeight으로 변경
  "--vh",
  `${window.innerHeight * 0.01}px`
);
</script>

<style scoped>
/* 오버레이 */
.overlay-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  left: 16px;
  bottom: 10%;
  z-index: 999;
}
.overlay-actor-thumb {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  box-sizing: border-box;
  cursor: pointer;
}
.overlay-actor-user {
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
  .overlay-wrapper:hover .overlay-actor-thumb {
    border-color: #ff0000;
    transform: scale(1.2);
  }
  .overlay-wrapper:hover .overlay-actor-user {
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
