<template>
  <media-player
    load="visible"
    poster-load="visible"
    view-type="video"
    stream-type="on-demand"
    storage="storage"
    src="https://fansonly.b-cdn.net/ads/LbfKWghLeQCmgzxQ.mp4"
    playsInline
  >
    <media-poster
      :src="props.video.thumb"
      alt=""
      class="vds-poster"
    ></media-poster>
    <media-provider> </media-provider>
    <media-video-layout> </media-video-layout>
  </media-player>
</template>


<script setup>
import { ref, onMounted } from "vue"
import "vidstack/bundle";

const props = defineProps({
  video: Object
});

const cdnUrl = import.meta.env.VITE_CDN_URL

const videoPlay = () => {
  const player = document.querySelector("media-player");

  // 이벤트 구독
  player.subscribe(({ canPlay, ended, source }) => {
    // 영상 재생
    if (canPlay === true && ended === false) {
      player.play();

      // 슬라이더 숨김
      const slider = document.querySelector("media-time-slider");
      if (source.src.includes(".net/ads/")) {
        slider.disabled = true;
      } else {
        slider.disabled = false;
      }
    }

    // 영상 교체
    if (ended === true) {
      if (source.src.includes(".net/ads/")) {
        localStorage.removeItem("https://fansonly.b-cdn.net/ads/LbfKWghLeQCmgzxQ.mp4:0:0")
        player.src = `${cdnUrl}${props.video.src}`;
      } else {
        player.src = "https://fansonly.b-cdn.net/ads/LbfKWghLeQCmgzxQ.mp4";
      }
    }
  });
};

onMounted(()=>{
  videoPlay()
})
</script>

<style>
media-menu-button,
media-pip-button,
media-google-cast-button {
  display: none !important;
}
</style>