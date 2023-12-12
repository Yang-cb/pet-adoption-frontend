<template>
  <router-view/>
  <div v-show="$route.meta.showFooter"
       style="display: flex; justify-content: center; align-items: center; height: 100%;">
    <el-row v-model="controlMenus">
      <el-col v-for="(controlMenu, index) in controlMenus"
              :span="11"
              :offset="(index % 2) === 0 ? 0 : 2"
              style="margin-bottom: 8px"
      >
        <el-card shadow="hover" class="box-card"
                 @click="router.push(`${controlMenu.link}`)">
          <template #header>
            <div class="card-header">
              <h4>{{ controlMenu.name }}</h4>
              <el-text tag="del">{{ controlMenu.englishName }}</el-text>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import router from "@/router/index.js";

const controlMenus = ref([{
  name: '用户管理',
  link: 'control/controlAccount',
  englishName: 'controlAccount',
  text: 'New York No. 1 Lake Park',
  date: '2016-10-03'
}, {
  name: '宠物布告管理',
  link: 'control/controlPet',
  englishName: 'controlPet',
  text: 'London No. 1 Lake Park',
  date: '2016-10-01'
},{
  name: '想领请求管理',
  link: 'control/controlWantAdopt',
  englishName: 'controlWantAdopt',
  text: 'New York No. 1 Lake Park',
  date: '2016-10-03'
}, {
  name: '宠物布告管理',
  link: 'control/controlPet',
  englishName: 'controlPet',
  text: 'London No. 1 Lake Park',
  date: '2016-10-01'
},
])

</script>