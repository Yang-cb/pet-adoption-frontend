<script setup>
import {logout} from '@/api/request.js'
import router from "@/router/index.js";
import {ref} from 'vue'
import {Location, Menu, ArrowDownBold} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";
import {get, takeAccId} from "@/api/request.js";
import {getAccImageUrl} from "@/utils";

// 用户数据
const personalData = ref([])
get('/api/account?id=' + takeAccId(), (data) => {
  personalData.value = data
}, (err) => {
  ElMessage.error(err)
})

// 菜单是否收起
const isCollapse = ref(false)

// 退出登录
function userLogout() {
  logout(() => router.push("/"))
}

// 收起菜单前往个人资料
const toPersonalData = () => {
  router.push('personalData');
}

</script>

<template>
  <div style="height: 100vh; ">
    <!-- 外层容器。当子元素中包含<el-header>时，全部子元素会垂直上下排列，否则会水平左右排列。 -->
    <el-container class="layout-container-demo" style="height: 100vh">
      <!-- 顶栏容器 -->
      <el-header style="position: relative">
        <!-- 面包屑 -->
        <span style="position: absolute; left: 210px; bottom: 5px">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item
                v-for="breadcrumb in router.currentRoute.value.matched"
                :key="breadcrumb.path" :to="{ path: breadcrumb.path }">
              {{ breadcrumb.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </span>
        <!-- 收起菜单-->
        <el-radio-group v-model="isCollapse" style="height: 100%;">
          <el-radio-button :label="!isCollapse">
            <el-icon>
              <Menu/>
            </el-icon>
          </el-radio-button>
        </el-radio-group>
        <div class="toolbar">
          <!-- 头像 -->
          <div>
            <el-avatar v-bind:src="getAccImageUrl(personalData.picName)"/>
          </div>
          <!-- 下拉菜单 -->
          <el-dropdown>
            <el-icon style="margin-left: 6px; margin-right: 8px; margin-top: 1px">
              <ArrowDownBold/>
            </el-icon>
            <template #dropdown>
              <div style="width: 180px; padding-top: 20px">
                <div style="margin-left: 20px; margin-bottom: 20px">
                  <!-- 头像 -->
                  <div>
                    <el-button type='' link @click="toPersonalData()">
                      <el-avatar :size="80" :src="getAccImageUrl(personalData.picName)"/>
                    </el-button>
                  </div>
                  <div style="margin-top: 5px; font-size: 12px;  color: rgb(133, 133, 133);">
                    @{{ personalData.username }}
                  </div>
                </div>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-button style="height: 30px; font-size: 14px" type='text' link @click="toPersonalData">个人资料
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button style="height: 30px; font-size: 14px" type='text' link @click="userLogout">退出登录
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </div>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-container>
        <!-- 侧边栏容器 -->
        <el-aside :width="isCollapse?'0px':'200px'">
          <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              :collapse="isCollapse"
              :collapse-transition="false"
              router
          >
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <location/>
                </el-icon>
                <span>Navigator One</span>
              </template>
              <el-menu-item-group>
                <template #title><span>Group One</span></template>
                <el-menu-item index="/index/allPB">全部宠物</el-menu-item>
                <el-menu-item index="1-2">item two</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="Group Two">
                <el-menu-item index="1-3">item three</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon>
                  <location/>
                </el-icon>
                <span>发布领养信息</span>
              </template>
              <el-menu-item index="/index/publishAway">求抱走</el-menu-item>
              <el-menu-item index="/index/publishAdopt">想领养</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>

        <!-- 主要区域容器 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  float: right;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
  margin-right: 30px;
}

.el-aside {
  transition: width 0.25s;
  -webkit-transition: width 0.25s;
  -moz-transition: width 0.25s;
  -o-transition: width 0.25s;
}
</style>