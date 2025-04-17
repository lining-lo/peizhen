<template>
    <div class="header-container">
        <div class="header-left">
            <el-icon class="icons" size="20" @click="store.commit('collapseMenu')">
                <component :is="isCollapse?'Expand':'Fold'"></component>
            </el-icon>
        </div>
        <div class="header-right">
            <el-dropdown>
                <span class="el-dropdown-link flex-box">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    <p class="user-name">Admin</p>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { ref, reactive, computed } from 'vue'

//获取vuex仓库
const store = useStore()

const isCollapse = computed(() => store.state.menu.isCollapse)


</script>

<style lang='less' scoped>
.flex-box {
    display: flex;
    align-items: center;
}
.header-container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    background-color: #fff;
    padding-right: 25px;
    .header-left{
        height: 100%;
        .icons{
            width: 45px;
            height: 100%;
            cursor: pointer;
        }
        .icons:hover{
            background-color: #f5f5f5;
        }
    }
    .header-right{
        .user-name{
            margin-left: 10px;
        }
    }
}
</style>