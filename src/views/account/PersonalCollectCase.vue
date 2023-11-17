<template>
  <div>
    <el-space :fill="true" wrap style="width: 100%; align-content: center;">
      <el-card v-for="postData in personalPostData" :key="personalPostData" style="height: 300px; margin: 0 100px">
        <template #header>
          <div style="display: flex; justify-content: space-between;">
            <div>
              <p style="font-size: 18px; font-weight: bold">{{ postData.title }}</p>
              <p style="font-size: 14px; font-weight: bold">{{
                  getType(postData.petType)
                }}({{ postData.sex === 1 ? '公' : '母' }})</p>
            </div>
            <div style="margin-top: 20px">
              <el-button-group>
                <el-button type="primary" :icon="Edit"/>
                <el-button type="primary"  @click="deleteOnePost(postData.id)" :icon="Delete"/>
              </el-button-group>
            </div>
          </div>
        </template>
        <div>
          <el-descriptions>
            <el-descriptions-item label="联系人">{{ postData.contactsName }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ postData.contactsPhone }}</el-descriptions-item>
            <el-descriptions-item label="微信">{{ postData.contactsWechat }}</el-descriptions-item>
            <el-descriptions-item label="邮件">{{ postData.contactsEmail }}</el-descriptions-item>
            <el-descriptions-item label="宠物类型">
              <el-tag size="small">{{ getType(postData.petType) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="领养地址">{{ postData.location }}</el-descriptions-item>
          </el-descriptions>
          <div style="font-size: 14px">详细描述 {{ postData.text }}</div>
        </div>
      </el-card>
    </el-space>
  </div>
</template>
<script setup>
import {Delete, Edit} from "@element-plus/icons-vue";
</script>