<template>
  <!-- 헤더 -->
  <div class="header-container">
    <img @click="refresh()" src="@/assets/logo.png" class="header-logo-icon" />
    <div>
      <img
        @click="searchOpen()"
        src="@/assets/search.svg"
        class="header-search-icon"
      />
      <img
        @click="emit('short')"
        src="@/assets/short.svg"
        class="header-short-icon"
      />
    </div>
  </div>
  <!-- 헤더 -->

  <!-- 검색 -->
  <div v-if="isSearchOpen" class="search-container">
    <!-- 검색 구역 -->
    <div class="search-front-wrapper">
      <!-- 검색 노출-->
      <div class="search-input-wrapper">
        <input
          ref="searchOpenRef"
          @keydown="prevent($event)"
          @keyup="search($event.target.value, $event.key)"
          class="search-input"
        />
        <img
          @click="searchOpen()"
          src="@/assets/close.svg"
          class="search-input-close-icon"
        />
      </div>
      <!-- 검색 노출 -->

      <!-- 결과 노출 -->
      <div v-if="actor.length" class="search-result-wrapper">
        <div
          @click="
            emit('search', data.user, true);
            emit('short');
          "
          v-for="(data, index) in actor"
          :key="index"
          class="search-result"
          :class="{ selectIndex: selectIndex === index }"
        >
          <img
            :src="`${CDN_URL}/actor/${data.actor}`"
            class="search-result-actor-thumb"
          />
          <span class="search-result-actor-user">{{ data.user }}</span>
          <span class="search-result-actor-nick">{{ data.nick }}</span>
        </div>
      </div>
      <!-- 결과 노출 -->
    </div>
    <!-- 검색 구역 -->

    <!-- 배경 구역 -->
    <div class="search-back-wrapper" @click="searchOpen()"></div>
    <!-- 배경 구역 -->
  </div>
  <!-- 검색 -->
</template>

<script setup>
import { ref, computed, nextTick } from "vue";

// 프롭스
const props = defineProps({
  ACTOR: Object,
});

// 이벤트
const emit = defineEmits(["search", "short"]);

// 글로벌
const CDN_URL = import.meta.env.VITE_CDN_URL;

// 새로고침
const refresh = () => {
  window.location.href = "/";
};

// 검색
const isSearchOpen = ref(false);
const searchOpenRef = ref(null);
const searchOpen = async () => {
  isSearchOpen.value = !isSearchOpen.value;
  actor.value = [];
  selectIndex.value = -1;

  if (isSearchOpen.value) {
    await nextTick();
    searchOpenRef.value.focus(); // 포커스 이동

    document.body.style.overflow = "hidden"; // 배경 스크롤 방지(데스크탑)
    document.body.style.touchAction = "none"; // 배경 스크롤 방지(모바일)
  } else {
    document.body.style.overflow = "auto"; // 배경 스크롤 방지 해제(데스크탑)
    document.body.style.touchAction = "auto"; // 배경 스크롤 방지 해제(모바일)
  }
};

// 검색
const actor = ref(null);
const actor_backup = computed(() => {
  return props.ACTOR.filter((data) => {
    return data.user !== "전체 보기";
  });
});
const search = (keyword, key) => {
  // 검색어 있음
  if (keyword) {
    actor.value = [...actor_backup.value].filter((data) => {
      return data.user?.includes(keyword) || data.nick?.includes(keyword);
    });
    select(keyword, key);
  }

  // 검색어 없음
  else {
    actor.value = [];
    select(keyword, key);
  }
};

// 선택
const selectIndex = ref(-1);
const select = (keyword, key) => {
  // ESC
  if (key === "Escape") {
    searchOpen();
  }

  // DOWN
  else if (key === "ArrowDown") {
    if (actor.value.length) {
      selectIndex.value = Math.min(
        selectIndex.value + 1,
        actor.value.length - 1
      );
      nextTick(() => {
        const selectedElement = document.querySelector(".selectIndex");
        if (selectedElement) {
          // 배경 스크롤 방지
          selectedElement.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          });
        }
      });
    }
  }

  // UP
  else if (key === "ArrowUp") {
    if (actor.value.length) {
      selectIndex.value = Math.max(selectIndex.value - 1, -1);
      nextTick(() => {
        const selectedElement = document.querySelector(".selectIndex");
        if (selectedElement) {
          // 배경 스크롤 방지
          selectedElement.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          });
        }
      });
    }
  }

  // ENTER
  else if (key === "Enter") {
    // 선택 있음
    if (selectIndex.value > -1) {
      emit("search", actor.value[selectIndex.value].user, true);
      emit("short");
    }

    // 선택 없음
    else {
      // 1명
      if (actor.value.length === 1) {
        emit("search", actor.value[selectIndex.value].user, true);
        emit("short");
      }

      // 1명 초과
      else {
        emit("search", keyword, false);
        emit("short");
      }
    }

    searchOpen();
  }
};

// 기타
const prevent = (event) => {
  // 포커스 이동 방지
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
  }
};
</script>

<style scoped>
/* 헤더 */
.header-container {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px 8px 16px;
  background-color: #000;
  z-index: 999;
}
.header-logo-icon {
  width: 80px;
  height: 48px; /* 5:3 비율 */
  transition: all 0.3s ease;
  cursor: pointer;
}
.header-logo-icon:hover {
  opacity: 0.8;
}
.header-search-icon {
  width: 20px;
  height: 20px;
  margin-right: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}
.header-short-icon {
  width: 22px;
  height: 22px;
  transition: all 0.3s ease;
  cursor: pointer;
}
@media (pointer: fine) {
  .header-search-icon:hover,
  .header-short-icon:hover {
    transform: scale(1.2);
  }
}

/* 검색 */
.search-container {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  inset: 0;
  z-index: 1000;
}

/* 검색 구역 */
.search-front-wrapper {
  width: 90%; /* 모바일 */
  max-width: 640px; /* 데스크탑 */
  margin-top: 152px; /* 위에서부터 64 + 80 + 8 */
  z-index: 1000;
}
@media (max-width: 768px) {
  .search-front-wrapper {
    margin-top: 64px; /* 위에서부터 64 */
  }
}

/* 배경 구역 */
.search-back-wrapper {
  position: fixed;
  background-color: var(--main-background-color);
  inset: 0;
  z-index: 999;
}

/* 검색 노출 */
.search-input-wrapper {
  position: relative;
}
.search-input {
  width: 100%;
  line-height: 20px; /* 높이 고정 */
  padding: 21px 56px 21px 16px; /* 높이 1 + 21 + 20 + 21 + 1, 좌우 16 + 40 */
  border: 1px solid var(--main-border-color);
  border-radius: 8px;
  color: var(--first-font-color);
  font-size: 16px;
  background-color: var(--sub-background-color);
  transition: all 0.3s ease;
  box-sizing: border-box;
}
.search-input:focus {
  outline: none;
  border-color: var(--main-border-hover-color);
}
.search-input-close-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 100%;
  width: 20px;
  height: 20px;
  margin-left: -40px;
  transition: all 0.3s ease;
  cursor: pointer;
}
@media (pointer: fine) {
  .search-input-close-icon:hover {
    transform: translateY(-50%) scale(1.2);
  }
}

/* 결과 노출 */
.search-result-wrapper {
  max-height: 442px; /* 6개 노출 1 + 8 + (64 + 8) * 5 + 64 + 8 + 1  + */
  overflow-y: auto;
  padding: 8px 16px 8px 16px;
  border: 1px solid var(--main-border-color);
  border-radius: 8px;
  background-color: var(--sub-background-color);
  margin-top: 8px;
  box-sizing: border-box;
}
@media (max-width: 768px) {
  .search-result-wrapper {
    max-height: 370px; /* 5개 노출 1 + 8 + (64 + 8) * 5 + 64 + 8 + 1  + */
  }
}
.search-result {
  display: flex;
  align-items: center;
  padding: 8px 0px 8px 0px;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}
.search-result:last-child {
  margin-bottom: 0px;
}
@media (pointer: fine) {
  .search-result:hover {
    background-color: var(--main-border-hover-color);
  }
}
.search-result.selectIndex {
  background-color: var(--main-border-hover-color);
}
.search-result-actor-thumb {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 8px;
}
.search-result-actor-user {
  color: var(--first-font-color);
  font-size: 16px;
  margin-right: 8px;
}
.search-result-actor-nick {
  color: var(--second-font-color);
  font-size: 16px;
}

/* 스크롤바 */
.search-result-wrapper::-webkit-scrollbar {
  width: 8px;
}
.search-result-wrapper::-webkit-scrollbar-track {
  background-color: transparent;
}
.search-result-wrapper::-webkit-scrollbar-thumb {
  background-color: var(--main-border-color);
  border-radius: 8px;
}
.search-result-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: var(--main-border-hover-color);
}
</style>
