<template>
  <div class="welcome">
    <p class="welcome-text">Welcome administrator</p>
    <img src="~assets/images/welcome.png" class="welcome-img">
  </div>
</template>

<script>
  export default {
    name: "Welcome"
  }
</script>

<style scoped>
  @font-face {
    font-family: magicFont;
    src: url("../assets/fonts/MagicOwl.otf");
  }

  .welcome {
    text-align: center;
  }

  .welcome-text {
    font-family: magicFont;
    font-size: 50px;
    margin: 0;
  }

  .welcome-img {
    width: 450px;
  }
</style>
