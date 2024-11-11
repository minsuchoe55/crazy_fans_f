<template>
  <div>
    <!-- 데이터가 없을 경우 표시할 메시지 -->
    <div v-if="!paginatedVideos.length" class="no-data">
      데이터를 불러오는 중입니다...
    </div>

    <!-- 기존 템플릿 -->
    <div v-else>
      <div class="video-grid">
        <div class="video-item" v-for="(video, index) in paginatedVideos" :key="index">
          <div class="video-thumb-container">
            <MainVideo v-if="videoID === video.id" ref="player" :video=video></MainVideo>
            <div v-else
              class="video-thumb"
              :style="{ backgroundImage: `url(${cdnUrl + video.thumb})` }"
            >
              <div class="play-button" @click="videoID = video.id">
                <svg fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" class="vds-icon vds-play-icon" viewBox="0 0 32 32" data-icon="play">
                  <path d="M10.6667 6.6548C10.6667 6.10764 11.2894 5.79346 11.7295 6.11862L24.377 15.4634C24.7377 15.7298 24.7377 16.2692 24.3771 16.5357L11.7295 25.8813C11.2895 26.2065 10.6667 25.8923 10.6667 25.3451L10.6667 6.6548Z" fill="currentColor"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="video-info">
            <div class="profile-container">
              <div 
                class="profile-image" 
                :style="{ backgroundImage: `url(${cdnUrl + video.profile})` }"
                @click="handleProfileClick(video)"
              ></div>
              <div class="profile-details">
                <div class="video-title">{{video.nick}}</div>
                <div class="video-profile">{{video.disc}}</div>
                <div class="video-stats">
                  <span class="stats-item">
                    <i class="fas fa-eye"></i> {{video.user}}
                  </span>
                  <span class="stats-item">
                    <i class="far fa-clock"></i> {{video.date}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="pagination-button"
        >
          이전
        </button>
        
        <!-- 페이지 번호 버튼들 -->
        <div class="page-numbers">
          <button
            v-for="pageNumber in displayedPages"
            :key="pageNumber"
            @click="currentPage = pageNumber"
            :class="['page-number', { active: currentPage === pageNumber }]"
          >
            {{ pageNumber }}
          </button>
        </div>

        <button 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="pagination-button"
        >
          다음
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import MainVideo from '../components/MainVideo.vue'

export default {
  components: {
    MainVideo
  },

  setup(){
    const store = useStore()
    const cdnUrl = import.meta.env.VITE_CDN_URL
    const videoID = ref(null)
    const player = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = 16 // 한 페이지당 보여줄 아이템 수

    // 페이지 변경 감지
    watch(currentPage, () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'  // 부드러운 스크롤 효과
      })
    })

    // 표시할 비디오 데이터 결정
    const videos = computed(() => {
      return store.state.filter_video !== null 
        ? store.state.filter_video 
        : store.state.video || []
    })

    // 전체 페이지 수 계산
    const totalPages = computed(() => {
      return Math.ceil(videos.value.length / itemsPerPage)
    })

    // 현재 페이지에 표시할 비디오 목록
    const paginatedVideos = computed(() => {
      if (!videos.value.length) return [] // 데이터가 없을 경우 빈 배열 반환
      
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return videos.value.slice(start, end)
    })

    // 표시할 페이지 번호 계산
    const displayedPages = computed(() => {
      const total = totalPages.value
      const current = currentPage.value
      const delta = 2 // 현재 페이지 기준 좌우로 보여줄 페이지 수
      
      let start = Math.max(1, current - delta)
      let end = Math.min(total, current + delta)
      
      // 시작이나 끝이 잘린 경우 반대쪽에 더 많은 페이지를 보여줌
      const padding = 5 - (end - start + 1)
      if (padding > 0) {
        if (start === 1) {
          end = Math.min(total, end + padding)
        } else {
          start = Math.max(1, start - padding)
        }
      }
      
      // 페이지 번호 배열 생성
      return Array.from(
        { length: end - start + 1 },
        (_, i) => start + i
      )
    })

    const handleProfileClick = (video) => {
      if (!video) return
      store.dispatch('filterVideoData', video.user)
    }

    return {
      store,
      cdnUrl,
      videoID,
      player,
      currentPage,
      totalPages,
      paginatedVideos,
      displayedPages,
      handleProfileClick,
    }
  }
}
</script>

<style scoped>
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.video-item {
  width: 100%;
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
}

.video-thumb-container {
  position: relative;
  width: 100%;
}

.video-thumb {
  width: 100%;
  padding-bottom: 56.25%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.play-icon {
  width: 30px;
  height: 30px;
  filter: invert(1);
}

.video-thumb:hover {
  transform: scale(1.05);
}

.video-thumb:hover .play-button {
  opacity: 1;
}

.video-info {
  padding: 12px;
  background: #1a1a1a;
}

.profile-container {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
  border: 2px solid #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.profile-details {
  flex-grow: 1;
  min-width: 0; /* 텍스트 오버플로우 방지 */
}

.video-title {
  color: white;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-profile {
  color: #999;
  font-size: 14px;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-stats {
  display: flex;
  gap: 12px;
  color: #666;
  font-size: 12px;
}

.stats-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stats-item i {
  font-size: 14px;
}

/* 호버 효과 */
.profile-image:hover {
  transform: scale(1.05);
  border-color: #ff0000;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .profile-image {
    width: 36px;
    height: 36px;
  }

  .video-title {
    font-size: 14px;
  }

  .video-profile {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .profile-image {
    width: 32px;
    height: 32px;
  }

  .video-stats {
    font-size: 11px;
  }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .video-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
    padding: 15px;
  }
  
  .play-button {
    width: 50px;
    height: 50px;
    opacity: 1;
  }
  
  .play-icon {
    width: 25px;
    height: 25px;
  }

  .video-thumb:hover {
    transform: none;
  }

  .video-thumb:hover .play-button {
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .video-grid {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 10px;
  }
  
  .play-button {
    width: 40px;
    height: 40px;
    opacity: 1;
  }
  
  .play-icon {
    width: 20px;
    height: 20px;
  }
}

/* 터치 디바이스에 대한 추가 스타일 */
@media (hover: none) {
  .play-button {
    opacity: 1;
  }

  .video-thumb:hover {
    transform: none;
  }
}

/* 페이지네이션 스타일 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  margin-bottom: 30px;
}

.pagination-button {
  padding: 8px 16px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination-button:disabled {
  background-color: #666;
  cursor: not-allowed;
}

.pagination-button:hover:not(:disabled) {
  background-color: #444;
}

.page-info {
  color: white;
  font-size: 16px;
}

/* 반응형 페이지네이션 */
@media (max-width: 768px) {
  .pagination {
    gap: 10px;
  }

  .pagination-button {
    padding: 6px 12px;
    font-size: 14px;
  }

  .page-info {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .pagination {
    gap: 8px;
  }

  .pagination-button {
    padding: 4px 8px;
    font-size: 12px;
  }

  .page-info {
    font-size: 12px;
  }
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-number {
  padding: 8px 12px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.page-number.active {
  background-color: #666;
  cursor: default;
}

.page-number:hover:not(.active) {
  background-color: #444;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .page-number {
    padding: 6px 10px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .page-number {
    padding: 4px 8px;
    font-size: 12px;
  }
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}
</style>