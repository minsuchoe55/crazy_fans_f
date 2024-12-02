<template>
  <!-- 헤더 -->
  <div class="header-container">
    <img @click="refresh()" src="@/assets/logo.png" class="header-logo" />
    <img @click="searchOpen()" src="@/assets/search.svg" class="header-icon" />
  </div>
  <!-- 헤더 -->

  <!-- 검색 -->
  <div v-if="isSearchOpen" class="search-overlay">
    <div class="search-front">
      <!-- 검색 -->
      <div class="search-input-wrapper">
        <input
          ref="searchOpenRef"
          @keydown="prevent($event)"
          @keyup="search($event.target.value, false, $event.key)"
          class="search-input"
        />
        <img
          @click="searchOpen()"
          src="@/assets/close.svg"
          class="search-close"
        />
      </div>
      <!-- 검색 -->

      <!-- 결과 -->
      <div v-if="actor.length" class="search-result-wrapper">
        <div
          @click="search(data.user, true, null)"
          v-for="(data, index) in actor"
          :key="index"
          class="search-result"
          :class="{ selectIndex: selectIndex === index }"
        >
          <img :src="`${CDN_URL}/actor/${data.actor}`" class="actor-thumb" />
          <span class="actor-user">{{ data.user }}</span>
          <span class="actor-nick">{{ data.nick }}</span>
        </div>
      </div>
      <!-- 결과 -->
    </div>

    <!-- 배경 -->
    <div class="search-back" @click="searchOpen()"></div>
    <!-- 배경 -->
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
const emit = defineEmits(["search"]);

// 글로벌
const CDN_URL = import.meta.env.VITE_CDN_URL;

// 새로고침
const refresh = () => {
  window.location.href = "/";
};

// 모달
const isSearchOpen = ref(false);
const searchOpenRef = ref(null);
const searchOpen = async () => {
  isSearchOpen.value = !isSearchOpen.value;
  actor.value = [];
  selectIndex.value = -1;

  if (isSearchOpen.value) {
    await nextTick();
    searchOpenRef.value.focus();
  }
};

// 검색
const actor = ref(null);
const actor_backup = computed(() => {
  return props.ACTOR.filter((data) => {
    return data.user !== "전체 보기";
  });
});
const search = (keyword, isActor, key) => {
  // 검색어 있음
  if (keyword) {
    // 선택 있음
    if (isActor) {
      actor.value = [...actor_backup.value].filter((data) => {
        return data.user === keyword;
      });
      emit("search", keyword, true);
      searchOpen();
    }

    // 선택 없음
    else {
      actor.value = [...actor_backup.value].filter((data) => {
        return data.user?.includes(keyword) || data.nick?.includes(keyword);
      });
      select(keyword, key);
    }
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
          selectedElement.scrollIntoView({
            block: "center",
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
          selectedElement.scrollIntoView({
            block: "center",
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
    }

    // 선택 없음
    else {
      // 1명
      if (actor.value.length === 1) {
        emit("search", actor.value[selectIndex.value].user, true);
      }

      // 1명 초과
      else {
        emit("search", keyword, false);
      }
    }

    searchOpen();
  }
};

// 기타
const prevent = (event) => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
  }
};
</script>

<style scoped>
/* 헤더 */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px 8px 16px;
}
.header-logo {
  width: 80px;
  height: 48px; /* 5:3 비율 */
  transition: all 0.3s ease;
  cursor: pointer;
}
.header-logo:hover {
  opacity: 0.8;
}
.header-icon {
  width: 20px;
  height: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
}
.header-icon:hover {
  transform: scale(1.2);
}

/* 모달 */
.search-overlay {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
}
.search-front {
  width: 90%;
  max-width: 620px; /* 5:3 비율 */
  margin-top: 152px;
  z-index: 1000;
}
@media (max-width: 768px) {
  .search-front {
    margin-top: 64px;
  }
}
.search-back {
  position: fixed;
  inset: 0;
  z-index: 999;
}

/* 검색 */
.search-input-wrapper {
  position: relative;
}
.search-input {
  width: 100%;
  line-height: 20px;
  padding: 21px 32px 21px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  background-color: rgba(40, 40, 40, 0.9);
  transition: all 0.3s ease;
  box-sizing: border-box;
}
.search-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.2);
}
.search-close {
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
.search-close:hover {
  transform: translateY(-50%) scale(1.2);
}

/* 결과 */
.search-result-wrapper {
  max-height: 730px;
  overflow-y: auto;
  padding: 8px 16px 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background-color: rgba(40, 40, 40, 0.9);
  margin-top: 8px;
  box-sizing: border-box;
}

/* 배우 */
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
.search-result:hover,
.search-result.selectIndex {
  background-color: rgba(255, 255, 255, 0.2);
}
.actor-thumb {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 8px;
}
.actor-user {
  color: #fff;
  font-size: 16px;
  margin-right: 8px;
}
.actor-nick {
  color: #888;
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
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}
.search-result-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
