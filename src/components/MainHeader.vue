<template>
  <header>
    <h1 @click="goToHome" class="home-link">
      Crazy Fans
      <img 
      src="/crazyfans.svg" 
      alt="로고"
      class="logo"
    />
    </h1>
    <img 
      src="/search.svg" 
      alt="검색"
      class="icon"
      @click="closeSearch"
    />
  </header>

  <!-- 검색 모달 -->
  <div v-if="isSearchOpen" class="search-modal">
    <div class="search-container">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="검색어를 입력하세요"
        class="search-input"
        ref="searchInput"
        @keyup="handleKeyup"
      >
      <button class="close-button" @click="closeSearch">×</button>
    </div>
    <div class="modal-backdrop" @click="closeSearch"></div>
  </div>
</template>

<script>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'MainHeader',
  setup() {
    const router = useRouter()
    const store = useStore()
    const isSearchOpen = ref(false)
    const searchQuery = ref('')
    const searchInput = ref(null)

    const goToHome = async () => {
      await router.push('/')
      window.location.reload()
      store.dispatch('resetFilter')  // 홈으로 갈 때 필터 초기화
    }

    const closeSearch = async () => {
      isSearchOpen.value = !isSearchOpen.value
      if (isSearchOpen.value) {
        await nextTick()
        searchInput.value?.focus()
      } else {
        searchQuery.value = '' // 모달이 닫힐 때 검색어 초기화
      }
    }

    const handleSearch = () => {
      const query = searchQuery.value.trim()
      if (query) {
        if (query.startsWith('#')) {
          // 해시태그 검색
          store.dispatch('filterVideoData', query)
        } else {
          // 일반 검색어는 해시태그로 변환
          store.dispatch('filterVideoData', `#${query}`)
        }
        closeSearch()
      }
    }

    // 검색어 입력 감시
    const handleKeyup = (event) => {
      if (event.key === 'Enter') {
        handleSearch()
      } else if (event.key === 'Escape') {
        closeSearch()
      }
    }

    return {
      isSearchOpen,
      searchQuery,
      searchInput,
      goToHome,
      closeSearch,
      handleSearch,
      handleKeyup
    }
  }
}
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: black;
  color: white;
  padding: 20px;
  box-sizing: border-box;
}

h1 {
  margin: 0;
  cursor: pointer;
  transition: opacity 0.3s;
}

h1:hover {
  opacity: 0.8;
}

.icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.icon:hover {
  transform: scale(1.1);
}

/* 검색 모달 스타일 */
.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1000;
}

.search-container {
  position: relative;
  width: 80%;
  max-width: 600px;
  margin-top: 100px;
  z-index: 1001;
}

.search-input {
  width: 100%;
  padding: 15px 100px 15px 15px; /* 오른쪽 패딩 증가 */
  font-size: 18px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  outline: none;
  background-color: #333;
  color: azure;
}

.close-button {
  position: absolute;
  right: -100px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.home-link {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.logo {
  width: 32px;  /* 로고 크기 조정 */
  height: 20px; /* 비율 유지하면서 높이 조정 */
  margin-right: 2px;
}

.logo:hover {
  opacity: 0.8;
}

.search-button {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  padding: 8px 16px;
  background-color: #ff0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover:not(:disabled) {
  background-color: #cc0000;
}

.search-button:disabled {
  background-color: #666;
  cursor: not-allowed;
}
</style>