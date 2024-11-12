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
    <div class="search-icon" @click="toggleSearch">
      <img 
      src="/search.svg" 
      alt="검색"
      class="icon"
    />
    </div>
  </header>

  <div v-if="isSearchOpen" class="search-overlay">
    <div class="search-wrapper">
      <div class="search-input-wrapper">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="유저명은 @로 시작"
          class="search-input"
          ref="searchInput"
          @keyup="handleKeyup"
        >
        <button class="search-close" @click="toggleSearch">×</button>
      </div>
      <div v-if="showResults" class="search-results">
        <div class="results-section">
          <div v-if="searchQuery.startsWith('@')" class="profile-results">
            <div 
              v-for="(profile, index) in filteredProfiles" 
              :key="profile.user"
              class="profile-item"
              :class="{ 'selected': index === selectedIndex }"
              @click="handleProfileSelect(profile)"
            >
              <div 
                class="profile-thumb" 
                :style="{ backgroundImage: `url(${cdnUrl + profile.thumb})` }"
              ></div>
              <div class="profile-info">
                <span class="profile-user">@{{ profile.user }}</span>
                <span class="profile-nick">{{ profile.nick }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="search-backdrop" @click="toggleSearch"></div>
  </div>
</template>

<script>
import { ref, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'MainHeader',
  setup() {
    const router = useRouter()
    const store = useStore()
    const cdnUrl = import.meta.env.VITE_CDN_URL
    
    // 상태 관리
    const isSearchOpen = ref(false)
    const searchQuery = ref('')
    const searchInput = ref(null)
    const showResults = ref(false) 
    const isFirstInput = ref(true)
    const filteredProfiles = ref([])  // 필터링된 프로필 목록
    const selectedIndex = ref(-1)

    // 검색어 감시
    watch(searchQuery, (newQuery) => {
      if (!newQuery) {
        showResults.value = false
        isFirstInput.value = true
        filteredProfiles.value = []
        return
      }

      // 첫 글자가 @인 경우
      if (newQuery === '@') {
        console.log('@ 입력 감지')
        // 전체 프로필 목록 표시
        filteredProfiles.value = store.state.profile || []
        showResults.value = true
        return
      }

      // @로 시작하는 검색어인 경우
      if (newQuery.startsWith('@')) {
        const searchTerm = newQuery.slice(1).toLowerCase()  // @ 제외한 검색어
        const profiles = store.state.profile || []
        
        // 프로필 필터링
        filteredProfiles.value = profiles.filter(profile => {
          return profile.user.toLowerCase().includes(searchTerm) // 유저명으로 검색
        })
        
        showResults.value = true
        return
      }

      // 일반 검색어인 경우
      console.log('일반 검색:', newQuery)
      showResults.value = true
    })

    const goToHome = async () => {
      // await router.push('/')
      window.location.reload()
      store.dispatch('resetFilter')
    }

    const toggleSearch = async () => {
      isSearchOpen.value = !isSearchOpen.value
      if (isSearchOpen.value) {
        isFirstInput.value = true
        selectedIndex.value = -1  // 선택 초기화
        await nextTick()
        searchInput.value?.focus()
      } else {
        searchQuery.value = ''
        showResults.value = false
        selectedIndex.value = -1  // 선택 초기화
      }
    }

    const handleKeyup = (event) => {
      if (event.key === 'Escape') {
        toggleSearch()
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (showResults.value && filteredProfiles.value.length > 0) {
          if (selectedIndex.value === -1) {
            selectedIndex.value = 0
          } else {
            selectedIndex.value = Math.min(
              selectedIndex.value + 1,
              filteredProfiles.value.length - 1
            )
          }
          nextTick(() => {
            const selectedElement = document.querySelector('.profile-item.selected')
            if (selectedElement) {
              selectedElement.scrollIntoView({ block: 'nearest' })
            }
          })
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (showResults.value && selectedIndex.value > -1) {
          selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
        }
      } else if (event.key === 'Enter') {
        if (selectedIndex.value > -1) {
          const selectedProfile = filteredProfiles.value[selectedIndex.value]
          handleProfileSelect(selectedProfile)
        } else {
          const query = searchQuery.value.trim()
          if (query) {
            store.dispatch('findSearch', query)
            toggleSearch()
          }
        }
      }
    }

    const handleProfileSelect = (profile) => {
      store.dispatch('findUser', profile.user)
      toggleSearch()
    }

    return {
      cdnUrl,
      isSearchOpen,
      searchQuery,
      searchInput,
      showResults,
      goToHome,
      toggleSearch,
      handleKeyup,
      filteredProfiles,
      selectedIndex,
      handleProfileSelect,
    }
  }
}
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 2.5rem;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  width: 100%;
  top: 0;
  z-index: 100;
}

.search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
}

.search-wrapper {
  width: 90%;
  max-width: 550px;
  margin-top: 100px;
  position: relative;
  z-index: 1001;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  width: 77%;
  padding: 1.2rem 3.5rem 1.2rem 1.5rem;
  background: rgba(40, 40, 40, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.05);
}

.search-input::placeholder {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: -0.2px;
}

.search-close {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 1.8rem;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0.5rem;
}

/* PC 환경 (768px 이상) */
@media (min-width: 768px) {
  .search-close {
    right: -4.4rem;  /* 입력창 내부에 위치 */
  }
  
  .search-input {
    width: 100%;
    padding-right: 3.5rem;  /* 닫기 버튼 공간 확보 */
  }

  .search-results {
    width: 114%;
  }
 
}

/* 모바일 환경 (768px 미만) */
@media (max-width: 767px) {
  .search-close {
    right: 0;    
    color: rgb(207 207 207 / 70%);  /* 더 밝은 색상 */
    font-size: 2rem;  /* 더 큰 크기 */
  }
  
  .search-input {
    width: 87%;
    padding-right: 1.5rem;  /* 기본 패딩 */
  }
  
  .search-wrapper {
    width: 92%;     /* 모바일에서 좌우 여백 줄임 */
    margin-top: 80px;  /* 상단 여백 조정 */
  }

   .search-results {
    width: 101%;
  }
}

.search-close:hover {
  color: rgba(255, 255, 255, 0.8);
}

.search-results {
  margin-top: 0.4rem;
  background: rgba(40, 40, 40, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.profile-results {
  padding: 0.5rem;
}

.profile-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 0.2rem 0;
}

.profile-item:hover,
.profile-item.selected {
  background: rgba(255, 255, 255, 0.1);
}

.profile-thumb {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin-right: 1.2rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.profile-user {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  font-weight: 500;
}

.profile-nick {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
}

/* 스크롤바 스타일링 */
.search-results::-webkit-scrollbar {
  width: 8px;
}

.search-results::-webkit-scrollbar-track {
  background: transparent;
}

.search-results::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.search-results::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
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

.search-backdrop {
  position: absolute;
  inset: 0;
  z-index: 1000;
}
</style>
