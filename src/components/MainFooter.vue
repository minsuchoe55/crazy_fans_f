<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-links">
        <a href="#" class="footer-link">
          <img 
            src="/telegram.svg" 
            alt="telegram"
            class="telegram-icon"
            />
          crazyfans
        </a>
        <span class="divider">|</span>
        <a href="#" class="footer-link">우회주소 : crazyfans.io</a>
      </div>
      <div class="copyright">
        &copy; 2024 Fans. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'MainFooter'
}
</script>

<style scoped>
.footer {
  border-top: 1px solid #333;
  padding: 20px 0;
  margin-top: 50px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.footer-links {
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-link {
  color: #999;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
  display: inline-flex;
  align-items: center;
  height: 20px;
  line-height: 20px;
}

.telegram-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  transition: transform 0.2s ease;
  vertical-align: middle;
}

.footer-link:hover .telegram-icon {
  transform: scale(1.1);
}

.footer-link:hover {
  color: #fff;
}

.divider {
  color: #666;
  margin: 0 15px;
  font-size: 14px;
  height: 20px;
  line-height: 20px;
}

.copyright {
  color: #666;
  font-size: 12px;
  margin-top: 10px;
}

/* 반응형 디자인 */
@media (max-width: 480px) {
  .footer {
    padding: 15px 0;
  }

  .footer-link {
    font-size: 12px;
    height: 18px;
    line-height: 18px;
  }

  .telegram-icon {
    width: 14px;
    height: 14px;
  }

  .divider {
    margin: 0 10px;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
  }

  .copyright {
    font-size: 11px;
  }
}
</style>
