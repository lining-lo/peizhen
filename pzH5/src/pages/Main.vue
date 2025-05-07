<template>
    <div>
        我是Main
        <van-button type="primary">主要按钮</van-button>
        <van-button type="success">成功按钮</van-button>
        <van-button type="default">默认按钮</van-button>
        <van-button type="danger">危险按钮</van-button>
        <van-button type="warning">警告按钮</van-button>
        <router-view></router-view>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

</script>
<style lang='less' scoped></style>