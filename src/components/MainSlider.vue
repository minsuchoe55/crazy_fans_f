<template>
  <swiper
    :modules="[Navigation, Pagination]"
    :slides-per-view="6"
    :space-between="30"
    :breakpoints="breakpoints"
    :speed="1600"                 
    :grab-cursor="true"         
    :centered-slides="false"  
    :loop="false"                
    :effect="'slide'"          
    :autoplay="{
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    }"
    :css-mode="false"            
    navigation
  >
    <swiper-slide v-for="(slide, index) in store.state.profile" :key="index">
      <div class="slide-content">
        <div 
          class="profile-image" 
          :class="{ 'selected': store.state.selectedProfileIndex === index }"
          :style="{ backgroundImage: `url(${cdnUrl + slide.thumb})` }"
          @click="() => store.dispatch('selectProfile', slide)"
        ></div>
         <span 
          class="profile-name" 
          @click="() => store.dispatch('selectProfile', slide)"
        >
          {{ slide.nick }}
        </span>
      </div>
    </swiper-slide>
  </swiper>
  <!-- 필터 리셋 버튼 -->
  <div 
    v-if="store.state.filter_video" 
    class="reset-filter" 
    @click="() => store.dispatch('selectProfile', null)"
  >
    전체보기
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default {
  name: 'MainSlider',
  components: {
    Swiper,
    SwiperSlide
  },
  setup() {
    const store = useStore()
    const cdnUrl = import.meta.env.VITE_CDN_URL

    // 반응형 breakpoints 설정
    const breakpoints = {
      640: {
        slidesPerView: 10,
        spaceBetween: 10
      },
      768: {
        slidesPerView: 14,
        spaceBetween: 10
      },
      1024: {
        slidesPerView: 20,
        spaceBetween: 10
      }
    }

    return {
      store,
      cdnUrl,
      breakpoints,
      Navigation,
      Pagination
    }
  }
}
</script>

<style scoped>
.slide-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* border: 1px solid #ccc; */
  border-radius: 8px;
  /* padding: 20px; */
  box-sizing: border-box;
}

.profile-image {
  width: 46px;
  height: 46px;
  border-radius: 50px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
}

.profile-image.selected {
  border-color: #ff0000;
  transform: scale(1.1);
}

.profile-image:hover {
  transform: scale(1.05);
  border-color: rgba(255, 0, 0, 0.5);
}

.profile-name {
  color: #FFF;
  font-family: Itim;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 5px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.profile-name:hover {
  color: #ff0000;
}

.reset-filter {
  text-align: center;
  color: #666;
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.reset-filter:hover {
  color: #ff0000;
}

.slide-content h3 {
  margin: 10px 0;
  font-size: 18px;
  color: white;
}

.slide-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

/* Swiper 네비게이션 버튼 스타일 */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  display: none;
  color: #666;
  transition: color 0.3s ease;
  
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  color: #ff0000;
}

/* Swiper 페이지네이션 스타일 */
:deep(.swiper-pagination-bullet) {
  background: #000;
}

:deep(.swiper-pagination-bullet-active) {
  background: #000;
}

/* 추가 스타일 */
.swiper {
  padding: 2px 15px;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>