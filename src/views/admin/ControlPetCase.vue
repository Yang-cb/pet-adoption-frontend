<template>
  <div class="table-box" ref="tableBox">
    <el-table v-if="tableHeight"
              :max-height="tableHeight + 'px'"
              :data="pets"
              :default-sort="{ prop: 'petId', order: 'ascending' }">
      <el-table-column type="expand">
        <template #default="props">
          <el-row>
            <el-col :span="5" :offset="1">
              <el-image style="width: 253px; height: 253px; margin: 10px" v-bind:src="props.row.picName"/>
            </el-col>
            <el-col :span="8">
              <h3>宠物其他信息</h3>
              <p>
                <el-text tag="b">布告标题:</el-text>
                {{ props.row.title }}
              </p>
              <p>
                <el-text tag="b">详细描述:</el-text>
                {{ props.row.text }}
              </p>
              <p>
                <el-text tag="b">领养地址:</el-text>
                {{ props.row.location }}
              </p>
            </el-col>
            <el-col :span="6" :offset="1">
              <h3>发布者信息</h3>
              <p>
                <el-text tag="b">联系人:</el-text>
                {{ props.row.contactsName }}
              </p>
              <p>
                <el-text tag="b">电话:</el-text>
                {{ props.row.contactsPhone }}
              </p>
              <p>
                <el-text tag="b">邮箱:</el-text>
                {{ props.row.contactsEmail }}
              </p>
              <p>
                <el-text tag="b">微信:</el-text>
                {{ props.row.contactsWechat }}
              </p>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column sortable label="ID" prop="petId" width="100"/>
      <el-table-column label="种类" width="80">
        <template #default="props">
          <el-tag v-if="props.row.petType==='cat'">猫猫</el-tag>
          <el-tag type="warning" v-if="props.row.petType==='dog'">狗狗</el-tag>
          <el-tag type="info" v-if="props.row.petType==='other'">其他</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="80">
        <template #default="props">
          <el-tag v-if="props.row.petSex===1">公</el-tag>
          <el-tag type="warning" v-else>母</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否免费" width="100">
        <template #default="props">
          <span v-if="props.row.isFree===1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="是否已领养" width="100">
        <template #default="props">
          <span v-if="props.row.isAdopt===1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="是否绝育" width="100">
        <template #default="props">
          <span v-if="props.row.isSterilization===1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="健康状态" prop="petHealthStatus" width="180"/>
      <el-table-column label="宠物姓名" prop="petName" width="120"/>
      <el-table-column label="创建时间" prop="gmtCreate" width="120"/>
      <el-table-column label="修改时间" prop="gmtModified" width="120"/>
      <el-table-column fixed="right" prop="bulletinStatus" label="状态" width="80">
        <template #default="props">
          <el-tag :type="getTagType(props.row.bulletinStatus)">
            {{ getBulletinStatus(props.row.bulletinStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="审核" width="120">
        <template #default="props">
          <el-popconfirm title="一次性操作，你确定要同意吗?" width="250"
                         @confirm="editBulletinStatus(props.row.petId, 1)">
            <template #reference>
              <el-button link :disabled="props.row.bulletinStatus!==0" type="primary">同意</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm title="一次性操作，你确定要拒绝吗?" width="250"
                         @confirm="editBulletinStatus(props.row.petId, 2)">
            <template #reference>
              <el-button link :disabled="props.row.bulletinStatus!==0" type="danger">拒绝</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {get, put} from "@/api/request.js";
import {getPetImageUrl} from "@/utils";
import {ElMessage} from "element-plus";

// el表格高度
const tableHeight = ref(0)
const getTableHeight = () => {
  tableHeight.value = document.documentElement.clientHeight - 60
}
getTableHeight()

// 修改布告状态
const editBulletinStatus = (petId, bulletinStatus) => {
  put('/api/admin/updateBulletinStatus', {
    petId: petId,
    bulletinStatus: bulletinStatus
  }, () => {
    ElMessage.success('操作成功')
    getAllPet()
  })
}


// 图片预览
const srcList = ref([]);
const preview = (photo) => {
  // 清除原本的预览
  srcList.value = [];
  srcList.value.push(photo);
}

// 所有账户信息
const pets = ref([])
// 获取所有账户信息
const getAllPet = () => {
  get('/api/admin/getAllPet', (data) => {
    for (let i = 0; i < data.length; i++) {
      data[i].picName = getPetImageUrl(data[i].picName)
    }
    pets.value = data
    console.log(data)
  })
}
getAllPet()

// 获取状态
const getBulletinStatus = (bulletinStatus) => {
  switch (bulletinStatus) {
    case 0:
      return '待审核'
    case 1:
      return '已通过'
    case 2:
      return '未通过'
  }
}

// 获取状态颜色
const getTagType = (bulletinStatus) => {
  switch (bulletinStatus) {
    case 0:
      return 'info'
    case 1:
      return 'success'
    case 2:
      return 'danger'
  }
}
</script>

<style>
.table-box {
  height: calc(100vh - 60px);
}
</style>