<template>
    <div class="common-layout">
        <el-container>
            <!-- 侧边菜单 -->
            <Aside />
            <el-container>
                <el-header><NavHeader /></el-header>
                <el-main>
                    <RouterView />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import Aside from '../components/Aside.vue'
import NavHeader from '../components/NavHeader.vue';
import { RouterView } from 'vue-router';
import { ref, reactive } from 'vue'

</script>

<style lang='less' scoped>
.common-layout {
    height: 100%;

    .el-container {
        height: 100%;
    }
}
</style>