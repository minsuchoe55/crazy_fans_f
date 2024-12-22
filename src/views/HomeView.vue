<template>
  <MainHeader
    :ACTOR="ACTOR"
    @search="search"
    :shortState="shortState"
    @shortButton="shortButton"
  ></MainHeader>

  <div v-if="!shortState">
    <MainSlider
      :ACTOR="ACTOR"
      :selectActor="selectActor"
      @search="search"
    ></MainSlider>
    <MainList :VIDEO="VIDEO_FILTER" :ADS="ADS" @search="search"></MainList>
    <MainFooter></MainFooter>
  </div>

  <MainShort
    v-else
    :VIDEO="VIDEO_ORIGIN"
    :ADS="ADS"
    @search="search"
    :shortState="shortState"
    @shortButton="shortButton"
  ></MainShort>
</template>

<script setup>
import { ref } from "vue";
import MainHeader from "@/components/MainHeader.vue";
import MainSlider from "@/components/MainSlider.vue";
import MainList from "@/components/MainList.vue";
import MainFooter from "@/components/MainFooter.vue";
import MainShort from "@/components/MainShort.vue";

// 프롭스
const props = defineProps({
  actor: String,
});

// JSON
const VIDEO_ORIGIN = ref(null);
const VIDEO_FILTER = ref(null);
const ACTOR = ref(null);
const ADS = ref(null);

// 글로벌
const CDN_URL = import.meta.env.VITE_CDN_URL;

// 선택
const selectActor = ref("전체 보기");

// 검색
const search = (keyword, isActor) => {
  // 검색어 있음
  if (keyword && keyword !== "전체 보기") {
    // 배우 있음
    if (isActor) {
      VIDEO_FILTER.value = [...VIDEO_ORIGIN.value].filter((data) => {
        return data.user === keyword;
      });
      selectActor.value = keyword;
    }

    // 배우 없음
    else {
      VIDEO_FILTER.value = [...VIDEO_ORIGIN.value].filter((data) => {
        return data.user.includes(keyword) || data.nick.includes(keyword);
      });
      selectActor.value = null;
    }
  }

  // 검색어 없음
  else {
    VIDEO_FILTER.value = [...VIDEO_ORIGIN.value];
    selectActor.value = "전체 보기";
  }
};

// 쇼츠
const shortState = ref(false);
const shortButton = () => {
  shortState.value = !shortState.value;
};

// 초기화
(async () => {
  try {
    const videos = await fetch(`${CDN_URL}/json/video.json`);
    VIDEO_ORIGIN.value = await videos.json();
    VIDEO_FILTER.value = [...VIDEO_ORIGIN.value];

    const actors = await fetch(`${CDN_URL}/json/actor.json`);
    ACTOR.value = await actors.json();

    const ads = await fetch(`${CDN_URL}/json/ads.json`);
    ADS.value = await ads.json();
  } catch {
    VIDEO_ORIGIN.value = [];
    VIDEO_FILTER.value = [];
    ACTOR.value = [];
    ADS.value = [];
  }

  // 라우터
  if (props.actor) {
    search(props.actor, true);
  }
})();
</script>

<style scoped></style>
