<template>
  <MainHeader :ACTOR="ACTOR" @search="search"></MainHeader>
  <MainSlider
    :ACTOR="ACTOR"
    :selectActor="selectActor"
    @search="search"
  ></MainSlider>
  <MainList :VIDEO="VIDEO" :ADS="ADS" @search="search"></MainList>
  <MainFooter></MainFooter>
</template>

<script setup>
import { ref } from "vue";
import MainHeader from "@/components/MainHeader.vue";
import MainSlider from "@/components/MainSlider.vue";
import MainList from "@/components/MainList.vue";
import MainFooter from "@/components/MainFooter.vue";

// JSON
const VIDEO = ref(null);
const VIDEO_BACKUP = ref(null);
const ACTOR = ref(null);
const ADS = ref(null);

// 글로벌
const CDN_URL = import.meta.env.VITE_CDN_URL;

// 검색
const selectActor = ref("전체 보기");
const search = (keyword, isActor) => {
  // 검색어 있음
  if (keyword && keyword !== "전체 보기") {
    // 배우 있음
    if (isActor) {
      VIDEO.value = [...VIDEO_BACKUP.value].filter((data) => {
        return data.user === keyword;
      });
      selectActor.value = keyword;
    }

    // 배우 없음
    else {
      VIDEO.value = [...VIDEO_BACKUP.value].filter((data) => {
        return data.user.includes(keyword) || data.nick.includes(keyword);
      });
      selectActor.value = null;
    }
  }

  // 검색어 없음
  else {
    VIDEO.value = [...VIDEO_BACKUP.value];
    selectActor.value = "전체 보기";
  }
};

// 초기화
(async () => {
  try {
    const videos = await fetch(`${CDN_URL}/json/video.json`);
    VIDEO.value = await videos.json();
    VIDEO_BACKUP.value = [...VIDEO.value];

    const actors = await fetch(`${CDN_URL}/json/actor.json`);
    ACTOR.value = await actors.json();

    const ads = await fetch(`${CDN_URL}/json/ads.json`);
    ADS.value = await ads.json();
  } catch {
    VIDEO.value = [];
    ACTOR.value = [];
    ADS.value = [];
  }
})();
</script>

<style scoped></style>
