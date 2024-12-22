<template>
  <!-- 비디오 있음 -->
  <div v-if="video_filter?.length">
    <div class="grid-container">
      <div
        v-for="(data, index) in video_filter"
        :key="index"
        class="grid-wrapper"
      >
        <!-- 썸네일 -->
        <div v-if="selectVideo !== data.id" class="video-wrapper">
          <img :src="`${CDN_URL}/thumb/${data.thumb}`" class="video-thumb" />
          <div @click="selectVideo = data.id" class="video-play-button-wrapper">
            <img src="@/assets/play.svg" class="video-play-button" />
          </div>
        </div>
        <!-- 썸네일 -->

        <!-- 플레이어 -->
        <MainVideo v-else :video="data" :ads="ads"></MainVideo>
        <!-- 플레이어 -->

        <!-- 데이터 -->
        <div class="meta-wrapper">
          <!-- 직접 선택 -->
          <img
            @click="emit('search', data.user, true)"
            :src="`${CDN_URL}/actor/${data.actor}`"
            class="meta-thumb"
          />
          <div class="meta-data">
            <div class="meta-user">{{ data.user }}</div>
            <div class="meta-sub-data">
              <span class="meta-nick">{{ data.nick }}</span>
              <span v-if="data.hash !== 'undefined'" class="meta-hash">{{
                data.hash
              }}</span>
              <span class="meta-time">{{ data.time }}</span>
            </div>
            <div v-if="data.disc !== 'undefined'" class="meta-date">
              {{ data.disc.replace(/<[^>]*>/g, "") }}
            </div>
          </div>
        </div>
        <!-- 데이터 -->
      </div>
    </div>

    <!-- 페이지 -->
    <div class="pagination">
      <div
        @click="
          scrollTo('-');
          pushState();
        "
        class="pagination-button"
        :class="{ disable: currentPage === 1 }"
      >
        이전
      </div>
      <div
        @click="
          scrollTo(page);
          pushState();
        "
        v-for="page in pages"
        :key="page"
        class="pagination-button"
        :class="{ select: currentPage === page }"
      >
        {{ page }}
      </div>
      <div
        @click="
          scrollTo('+');
          pushState();
        "
        class="pagination-button"
        :class="{ disable: currentPage === totalPage }"
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
import { ref, computed, watch, onMounted } from "vue";
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

// 비디오
const video = computed(() => {
  return props.VIDEO?.filter((video) => {
    return video.short === false;
  });
});

// 리스트
const video_filter = computed(() => {
  let start = (currentPage.value - 1) * perPage;
  let end = start + perPage;

  return video.value?.slice(start, end);
});

// 광고
const ads = computed(() => {
  return props.ADS?.filter((ads) => {
    return ads.expire > new Date().toISOString();
  });
});

// 선택
const selectVideo = ref(null);

// 페이지
const perPage = 20;
const currentPage = ref(1);
const totalPage = computed(() => {
  return Math.ceil(video.value.length / perPage);
});
const pages = computed(() => {
  // 5개 노출
  let start =
    currentPage.value % 5 === 0
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

// 기타
const scrollTo = (page) => {
  // 페이지 이동 시 스크롤 초기화
  if (page === "-") {
    currentPage.value -= 1;
  } else if (page === "+") {
    currentPage.value += 1;
  } else {
    currentPage.value = page;
  }

  document.documentElement.scrollTop = 0;
};

// 감시
watch(
  () => props.VIDEO,
  () => {
    // 비디오 변경 시 페이지 초기화
    currentPage.value = 1;
    // 비디오 변경 시 비디오 초기화
    selectVideo.value = null;
  }
);

// 뒤로가기
const pushState = () => {
  // 페이지 이동 시 히스토리 삽입
  window.history.pushState({ page: currentPage.value }, null, location.href);
};

onMounted(() => {
  window.onpopstate = (event) => {
    if (event.state.page) {
      // 히스토리 있으면 해당 페이지로 이동
      currentPage.value = event.state.page;
    } else {
      // 히스토리로 없으면 첫 페이지로 이동
      currentPage.value = 1;
    }
  };
});
</script>

<style scoped>
/* 그리드 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  padding: 8px 16px 8px 16px;
  gap: 8px;
}

/* 썸네일 */
.grid-wrapper {
  border-radius: 8px;
  background-color: var(--sub-background-color);
}
.video-wrapper {
  position: relative;
  aspect-ratio: 16 / 9; /* 비율 고정 */
}
.video-thumb {
  width: 100%;
  height: 100%;
  border-radius: 8px 8px 0px 0px;
  object-fit: cover;
}
.video-play-button-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 45px;
  height: 45px;
  border-radius: 50%;
  opacity: 0;
  background-color: var(--video-background-color);
  transition: all 0.3s ease;
  cursor: pointer;
}
.video-play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
}
@media (pointer: fine) {
  .video-wrapper:hover .video-play-button-wrapper {
    opacity: 1;
  }
}
@media (pointer: coarse) {
  .video-play-button-wrapper {
    opacity: 1;
  }
}

/* 데이터 */
.meta-wrapper {
  display: flex;
  padding: 8px 8px 8px 8px;
}
.meta-thumb {
  width: 50px;
  height: 50px; /* 높이 고정 */
  border-radius: 50%;
  border: 2px solid transparent;
  margin-right: 8px;
  transition: all 0.3s ease;
  box-sizing: border-box; /* 헤더 동일, 데이터와 맞춤 */
  cursor: pointer;
}
@media (pointer: fine) {
  .meta-thumb:hover {
    transform: scale(1.2);
    border-color: #ff0000;
  }
}
.meta-data {
  height: 50px;
  line-height: 1; /* 높이 고정 */
  padding: 2px 0px 2px 0px;
  box-sizing: border-box; /* 썸네일과 맞춤 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.meta-user {
  color: var(--first-font-color);
  font-size: 14px;
  margin-bottom: 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.meta-sub-data {
  display: flex;
}
.meta-nick,
.meta-hash {
  color: var(--second-font-color);
  font-size: 12px;
  margin-right: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.meta-time {
  color: var(--second-font-color);
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.meta-date {
  color: var(--third-font-color);
  font-size: 12px;
  margin-top: 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 페이지 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px 0px 48px 0px; /* 결과와 맞춤 */
}
.pagination-button {
  padding: 8px 16px 8px 16px;
  border-radius: 8px;
  background-color: var(--sub-background-color);
  color: var(--first-font-color);
  font-size: 14px;
  transition: all 0.3s ease;
  margin: 0px 4px 0px 4px;
  cursor: pointer;
}
.pagination-button.disable {
  opacity: 0.65;
  pointer-events: none;
}
.pagination-button.select {
  background-color: var(--second-font-color);
  pointer-events: none;
}
@media (pointer: fine) {
  .pagination-button:hover:not(.disable, .select) {
    background-color: var(--second-font-color);
  }
}

/* 비디오 없음 */
.no-search {
  text-align: center;
  color: var(--third-font-color);
  font-size: 16px;
  padding: 48px 0px 48px 0px; /* 페이지와 맞춤 */
}
</style>
