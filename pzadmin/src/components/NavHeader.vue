<template>
    <div class="header-container">
        <div class="header-left flex-box">
            <el-icon class="icons" size="20" @click="store.commit('collapseMenu')">
                <component :is="isCollapse ? 'Expand' : 'Fold'"></component>
            </el-icon>
            <ul class="flex-box">
                <li :class="{ selected: route.path === item.path }" class="tab flex-box"
                    v-for="(item, index) in selectMenu">
                    <el-icon size="12">
                        <component :is="item.icon"></component>
                    </el-icon>
                    <router-link class="text" :to="item.path">{{ item.name }}</router-link>
                    <el-icon class="close" @click="closeTag(item, index)" size="12">
                        <Close />
                    </el-icon>
                </li>
            </ul>
        </div>
        <div class="header-right">
            <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link flex-box">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    <p class="user-name">Admin</p>
                </span>
                <template #dropdown>
                    <el-dropdown-menu >
                        <el-dropdown-item command="logout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ref, reactive, computed } from 'vue'

//获取vuex仓库
const store = useStore()

//获取route实例
const route = useRoute()

//获取router实例
const router = useRouter()

//菜单的状态
const isCollapse = computed(() => store.state.menu.isCollapse)

//tag数组
const selectMenu = store.state.menu.selectMenu

//点击关闭tag的方法
const closeTag = (item, index) => {
    store.commit('closeMenu', item)
    //如果删除的不是当前标签 --> 不做处理；
    if (route.path !== item.path) {
        return
    }
    //如果删除的是当前标签，而且是最后一个标签
    if (index === selectMenu.length) {
        //前面没有标签,跳转到首页
        if (!selectMenu.length) {
            router.push('/')
        } else {
            //前面还有标签，路由跳转到前一个标签；
            router.push(selectMenu[index - 1].path)
        }
    } else {
        //如果删除的是当前标签，而且是中间的标签，路由跳转到后一个标签；
        router.push(selectMenu[index].path)
    }
}

//退出登录
const handleCommand = (command) => {
  if (command === 'logout') {
   //清除浏览器的token及用户信息
   localStorage.removeItem('pz_token')
   localStorage.removeItem('pz_userInfo')
   localStorage.removeItem('pz_v3pz')
   //跳转到登录页面
   window.location.href = window.location.origin
   //提示用户
   ElMessage.success('退出成功')
  }
}

</script>

<style lang='less' scoped>
.flex-box {
    display: flex;
    align-items: center;
    height: 100%;
}

.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    background-color: #fff;
    padding-right: 25px;

    .header-left {
        height: 100%;

        .icons {
            width: 45px;
            height: 100%;
            cursor: pointer;
        }

        .icons:hover {
            background-color: #f5f5f5;
        }

        .tab {
            padding: 0 10px;
            height: 100%;

            .text {
                margin: 0 5px;
            }

            .close {
                visibility: hidden;
            }

            &.selected {
                a {
                    color: #409eff;
                }

                i {
                    color: #409eff;
                }

                background-color: #f5f5f5;
            }
        }

        .tab:hover {
            background-color: #f5f5f5;

            .close {
                visibility: inherit;
                cursor: pointer;
                color: #000;
            }
        }
    }

    .header-right {
        .user-name {
            margin-left: 10px;
        }
    }
}

a {
    color: #333;
    font-size: 15px;
}
</style>