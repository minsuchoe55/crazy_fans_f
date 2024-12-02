<template>
  <!-- 비디오 있음 -->
  <div v-if="video?.length">
    <div class="grid-container">
      <div v-for="(data, index) in video" :key="index" class="grid-wrapper">
        <!-- 썸네일 -->
        <div v-if="selectVideo !== data.id" class="video-wrapper">
          <img :src="`${CDN_URL}/thumb/${data.thumb}`" class="video-thumb" />
          <div @click="selectVideo = data.id" class="video-button">
            <img src="@/assets/play.svg" class="video-play" />
          </div>
        </div>
        <!-- 썸네일 -->

        <!-- 비디오 -->
        <MainVideo v-else :video="data" :ADS="props.ADS"></MainVideo>
        <!-- 비디오 -->

        <!-- 데이터 -->
        <div class="meta-wrapper">
          <img
            @click="emit('search', data.user, true)"
            :src="`${CDN_URL}/actor/${data.actor}`"
            class="meta-thumb"
          />
          <div class="meta-data">
            <div class="meta-user">{{ data.user }}</div>
            <div>
              <span class="meta-nick">{{ data.nick }}</span>
              <span class="meta-hash">{{ data.hash }}</span>
            </div>
            <div>
              <span class="meta-date">{{ data.date.split("T")[0] }}</span>
              <span class="meta-time">{{ data.time }}</span>
            </div>
          </div>
        </div>
        <!-- 데이터 -->
      </div>
    </div>

    <!-- 페이지 -->
    <div class="pagination">
      <div
        @click="scrollTo('-')"
        class="pagination-button"
        :class="{ disabled: currentPage === 1 }"
      >
        이전
      </div>
      <div
        @click="scrollTo(page)"
        v-for="page in pages"
        :key="page"
        class="pagination-button"
        :class="{ select: currentPage === page }"
      >
        {{ page }}
      </div>
      <div
        @click="scrollTo('+')"
        class="pagination-button"
        :class="{ disabled: currentPage === totalPage }"
      >
        다음
      </div>
    </div>
    <!-- 페이지 -->
  </div>
  <!-- 비디오 있음 -->

  <!-- 비디오 없음 -->
  <div v-else class="no-search">검색 결과가 없습니다</div>
  <!-- 비디오 없음 -->
</template>

<script setup>
import { ref, computed, watch } from "vue";
import MainVideo from "@/components/MainVideo.vue";

// 프롭스
const props = defineProps({
  VIDEO: Object,
  ADS: Object,
});

// 이벤트
const emit = defineEmits(["search"]);

// 글로벌
const CDN_URL = import.meta.env.VITE_CDN_URL;

// 페이지
const perPage = 16;
const currentPage = ref(1);
const totalPage = computed(() => {
  return Math.ceil(props.VIDEO.length / perPage);
});
const pages = computed(() => {
  let start =
    currentPage.value % 10 === 5
      ? Math.floor(currentPage.value / 5) * 5 - 4
      : Math.floor(currentPage.value / 5) * 5 + 1;
  let end = Math.min(start + 4, totalPage.value);
  let pages = [];

  while (start <= end) {
    pages.push(start);
    start += 1;
  }

  return pages;
});
const scrollTo = (param) => {
  if (param === "-") {
    currentPage.value -= 1;
  } else if (param === "+") {
    currentPage.value += 1;
  } else {
    currentPage.value = param;
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// 비디오
const selectVideo = ref(null);
const video = computed(() => {
  let start = (currentPage.value - 1) * perPage;
  let end = start + perPage;

  return props.VIDEO?.slice(start, end);
});

// 감시
watch(
  () => props.VIDEO,
  () => {
    currentPage.value = 1;
  }
);
</script>

<style scoped>
/* 그리드 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  padding: 8px 16px 8px 16px;
  gap: 8px;
}

/* 비디오 */
.grid-wrapper {
  border-radius: 8px;
  background-color: rgba(40, 40, 40, 0.9);
}
.video-wrapper {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}
.video-thumb {
  width: 100%;
  height: 100%;
  border-radius: 8px 8px 0px 0px;
  object-fit: cover;
}
.video-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 45px;
  height: 45px;
  border-radius: 50%;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.6);
  transition: all 0.3s ease;
  cursor: pointer;
}
.video-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
}
.video-wrapper:hover .video-button {
  opacity: 1;
}
@media (hover: none) {
  .video-button {
    opacity: 1;
  }
}

/* 데이터 */
.meta-wrapper {
  display: flex;
  padding: 8px;
}
.meta-thumb {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid transparent;
  margin-right: 8px;
  transition: all 0.3s ease;
  box-sizing: border-box;
  cursor: pointer;
}
@media (hover: hover) {
  .meta-thumb:hover {
    transform: scale(1.2);
    border-color: #ff0000;
  }
}
.meta-data {
  height: 50px;
  line-height: 1;
  padding: 2px 0px 2px 0px;
  box-sizing: border-box;
}
.meta-user {
  color: #fff;
  font-size: 14px;
  margin-bottom: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.meta-nick {
  display: inline-block;
  color: #888;
  font-size: 12px;
  margin-right: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.meta-hash {
  display: inline-block;
  color: #888;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.meta-date {
  display: inline-block;
  color: #666;
  font-size: 12px;
  margin-right: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.meta-time {
  display: inline-block;
  color: #666;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 페이지 */
.pagination {
  display: flex;
  justify-content: center;
  padding: 48px 0px 48px 0px;
}
.pagination-button {
  padding: 8px 16px 8px 16px;
  border-radius: 8px;
  background-color: rgba(40, 40, 40, 0.9);
  color: #fff;
  font-size: 14px;
  transition: all 0.3s ease;
  margin: 0px 4px 0px 4px;
  cursor: pointer;
}
.pagination-button.disabled {
  opacity: 0.65;
  pointer-events: none;
}
.pagination-button.select {
  background-color: #888;
  pointer-events: none;
}
@media (hover: hover) {
  .pagination-button:hover:not(.disabled, .select) {
    background-color: #888;
  }
}

/* 비디오 없음 */
.no-search {
  text-align: center;
  color: #666;
  font-size: 16px;
  padding: 48px 0px 48px 0px;
}
</style>
