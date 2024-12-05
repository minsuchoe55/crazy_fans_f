<template>
  <!-- 푸터 -->
  <div class="footer-container">
    <div class="footer-wrapper">
      <!-- 푸터 1행 -->
      <a :href="`${CONTACT_URL}`" class="footer-link">
        <!-- <img src="@/assets/telegram.svg" class="footer-icon" /> -->
        {{ `텔레그램 ${CONTACT_NAME}` }}</a
      >
      <span class="footer-divide">|</span>
      <a :href="`${SITE_URL}`" class="footer-link">{{
        `우회주소 ${SITE_NAME}`
      }}</a>
      <!-- 푸터 1행 -->

      <!-- 푸터 2행 -->
      <div class="footer-copyright">
        &copy; 2024 CrazyFans. All rights reserved.
      </div>
      <!-- 푸터 2행 -->
    </div>
  </div>

  <!-- 푸터 -->
</template>

<script setup>
const CONTACT_NAME = import.meta.env.VITE_CONTACT_NAME;
const CONTACT_URL = import.meta.env.VITE_CONTACT_URL;
const SITE_NAME = import.meta.env.VITE_SITE_NAME;
const SITE_URL = import.meta.env.VITE_SITE_URL;
</script>

<style scoped>
/* 푸터 */
.footer-container {
  text-align: center;
  padding: 16px 0px 16px 0px;
  margin: 0px 16px 0px 16px;
  border-top: 1px solid var(--third-font-color);
}
.footer-wrapper {
  height: 42px;
  line-height: 1; /* 높이 고정 */
}

/* 푸터 1행 */
.footer-link {
  color: var(--second-font-color);
  font-size: 14px;
  text-decoration: none;
  transition: all 0.3s ease;
}
@media (pointer: fine) {
  .footer-link:hover {
    color: var(--first-font-color);
  }
}
/* .footer-icon {
  width: 16px;
  height: 16px;
  vertical-align: bottom;
} */
.footer-divide {
  color: var(--second-font-color);
  font-size: 14px;
  margin: 0px 8px 0px 8px;
}

/* 푸터 2행 */
.footer-copyright {
  color: var(--third-font-color);
  font-size: 12px;
  margin-top: 16px;
}
</style>
