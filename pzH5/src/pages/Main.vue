<template>
    <RouterView />
    <van-tabbar v-model="active">
        <van-tabbar-item v-for="item in router.options.routes[0].children" :index="item.path" :url="`/#/${item.path}`"
            :icon="item.meta.icon">{{ item.meta.name }}</van-tabbar-item>
    </van-tabbar>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { RouterView } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';

//router实例
const router = useRouter()

//route实例
const route = useRoute()

//tabbar标签的索引值
const active = ref(0);

//挂载
onMounted(() => {
    //所有tabbar标签路由
    const routes = router.options.routes[0].children
    //动态获取tabbar标签的索引值
    active.value = routes.findIndex(item => '/' + item.path === route.path)
})





</script>
<style lang='less' scoped></style>