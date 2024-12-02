<template>
  <div class="footer-container">
    <div class="footer-wrapper">
      <a :href="`${CONTACT_URL}`" class="footer-link">
        {{ `텔레그램 ${CONTACT_NAME}` }}</a
      >
      <!-- <img src="@/assets/telegram.svg" class="footer-icon" /> -->
      <span class="footer-divider">|</span>
      <a :href="`${SITE_URL}`" class="footer-link">{{
        `우회주소 ${SITE_NAME}`
      }}</a>

      <div class="footer-copyright">
        &copy; 2024 CrazyFans. All rights reserved.
      </div>
    </div>
  </div>
</template>

<script setup>
const CONTACT_NAME = import.meta.env.VITE_CONTACT_NAME;
const CONTACT_URL = import.meta.env.VITE_CONTACT_URL;
const SITE_NAME = import.meta.env.VITE_SITE_NAME;
const SITE_URL = import.meta.env.VITE_SITE_URL;
</script>

<style scoped>
.footer-container {
  text-align: center;
  padding: 16px 0px 16px 0px;
  margin: 0px 16px 0px 16px;
  border-top: 1px solid #666;
}
.footer-wrapper {
  height: 14px;
  line-height: 1; /* 높이 고정 */
}
.footer-link {
  color: #888;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.3s ease;
}
.footer-link:hover {
  color: #fff;
}
/* .footer-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  vertical-align: sub;
} */
.footer-divider {
  color: #888;
  font-size: 14px;
  margin: 0px 8px 0px 8px;
}
.footer-copyright {
  color: #666;
  font-size: 12px;
  margin-top: 16px;
}
</style>
