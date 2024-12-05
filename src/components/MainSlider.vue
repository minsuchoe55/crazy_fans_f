<template>
  <!-- 슬라이드 -->
  <swiper
    :modules="[FreeMode]"
    :free-mode="true"
    :slidesPerView="slidesPerView"
    :space-between="4"
  >
    <swiper-slide
      @click="emit('search', data.user, true)"
      v-for="(data, index) in actor"
      :key="index"
    >
      <div
        class="actor-wrapper"
        :class="{ selectActor: selectActor === data.user }"
      >
        <img :src="`${CDN_URL}/actor/${data.actor}`" class="actor-thumb" />
        <span class="actor-user">
          {{ data.user }}
        </span>
      </div>
    </swiper-slide>
  </swiper>
  <!-- 슬라이드 -->
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

// 프롭스
const props = defineProps({
  ACTOR: Object,
  selectActor: String,
});

// 이벤트
const emit = defineEmits(["search"]);

// 글로벌
const CDN_URL = import.meta.env.VITE_CDN_URL;

// 검색
const actor = computed(() => {
  return props.ACTOR;
});

// 선택
const selectActor = computed(() => {
  return props.selectActor;
});

// 감시
const swiperRef = ref(null);
const slidesPerView = ref(null);
const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    slidesPerView.value = entry.contentRect.width / 54; // 50 + 4
  }
});

// 라이프사이클
onMounted(() => {
  swiperRef.value = document.querySelector(".swiper-wrapper");
  resizeObserver.observe(swiperRef.value);
});
onBeforeUnmount(() => {
  resizeObserver.unobserve(swiperRef.value);
});
</script>

<style scoped>
/* 슬라이드 */
.swiper {
  height: 64px;
  padding: 8px 16px 8px 16px;
}
.actor-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  width: 50px;
  line-height: 10px; /* 높이 고정 */
  text-align: center;
  color: var(--first-font-color);
  font-size: 10px;
  margin-top: 4px;
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
.actor-wrapper.selectActor .actor-thumb {
  border-color: #ff0000;
}
.actor-wrapper.selectActor .actor-user {
  color: #ff0000;
}
</style>
