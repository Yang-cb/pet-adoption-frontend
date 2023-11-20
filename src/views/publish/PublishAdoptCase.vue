<!-- 发布宠物领养信息 -->
<template>
  <div style="margin: 20px;">
    <el-form style="width: 90%;" ref="formRef" :model="form" :rules="rules" label-width="150px" class="demo-ruleForm"
             status-icon>
      <el-form-item label="宠物种类" prop="petType">
        <el-radio-group v-model="form.petType">
          <el-radio-button label="cat">猫猫</el-radio-button>
          <el-radio-button label="dog">狗狗</el-radio-button>
          <el-radio-button label="other">其他</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio-button label="1">公</el-radio-button>
          <el-radio-button label="0">母</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="愿意付费" prop="isFree" required>
        <!-- 状态为on时为1，状态为off时为0 -->
        <el-switch v-model="form.isFree" active-value="1" inactive-value="0"/>
      </el-form-item>
      <el-form-item label="我的地区" prop="firstLocation">
        <el-cascader placeholder="请选择"
                     style="width: 100%"
                     :options="options"
                     v-model="form.firstLocation"
                     @change="locHandleChange(form.firstLocation)">
        </el-cascader>
      </el-form-item>
      <el-form-item label="我的详细地址" prop="lastLocation">
        <el-input v-model="form.lastLocation" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="联系人" prop="contactsName">
        <el-input minlength="1" maxlength="5" v-model="form.contactsName"/>
      </el-form-item>
      <el-form-item label="联系电话" prop="contactsPhone">
        <el-input minlength="11" maxlength="11" v-model="form.contactsPhone"/>
      </el-form-item>
      <el-form-item label="微信号" prop="contactsWechat">
        <el-input maxlength="11" v-model="form.contactsWechat" placeholder="可不填"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="contactsEmail">
        <el-input minlength="6" v-model="form.contactsEmail" placeholder="可不填"/>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input maxlength="20" v-model="form.title" placeholder="请简述你为什么要领养，内容不得超过20字"/>
      </el-form-item>
      <el-form-item label="详细描述" prop="text">
        <el-input maxlength="300" v-model="form.text" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
                  placeholder="请描述你能为宠物提供什么, 内容不得超过300字"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm()">重置</el-button>
        <el-button type="primary" @click="submitForm()">
          发布
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import {reactive, ref} from 'vue'
import {ElMessage} from 'element-plus'
import {post} from '@/api/request.js'
import {handleChange, options} from '@/utils'

const locStr = ref('')

const locHandleChange = (locArr) => {
  locStr.value = handleChange(locArr);
}

const form = reactive({
  petType: 'cat', // 宠物种类
  sex: '1', // 宠物性别
  isFree: '0', // 愿意付费 1是0否
  firstLocation: '', // 地址选择片段
  lastLocation: '', // 地址输入片段
  contactsName: '', // 联系人
  contactsPhone: '',  // 电话
  contactsWechat: '', // 微信
  contactsEmail: '', // 邮箱
  title: '', // 标题
  text: '' // 详细描述
})

const rules = {
  petType: [
    {required: true, message: '请选择宠物种类', trigger: 'change'},
    {pattern: /^(cat|dog|other)$/, message: '宠物类型格式有误', trigger: 'blur'}
  ],
  sex: [
    {required: true, message: '请选择性别', trigger: 'change'},
    {pattern: /^[0-1]$/, message: '性别格式有误', trigger: 'blur'}
  ],
  firstLocation: [
    {required: true, message: '请选择地区', trigger: 'change'},
    {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号', trigger: 'blur'}
  ],
  lastLocation: [
    {required: true, message: '请输入详细地址', trigger: 'change'},
    {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号', trigger: 'blur'}
  ],
  contactsName: [
    {required: true, message: '请输入联系人', trigger: 'change'},
    {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号', trigger: 'blur'}
  ],
  contactsPhone: [
    {required: true, message: '请输入手机号', trigger: 'change',},
    {pattern: '^1[3456789]\\d{9}$', message: '请输入合法的手机号', trigger: 'blur'}
  ],
  contactsWechat: [
    {pattern: "^[a-zA-Z][a-zA-Z0-9_-]{5,19}$", message: '请输入合法的微信号', trigger: 'blur'}
  ],
  contactsEmail: [
    {type: 'email', message: '请输入合法的电子邮件地址', trigger: 'blur'}
  ],
  title: [
    {required: true, message: '请输入标题', trigger: 'blur'}
  ],
  text: [
    {required: true, message: '请详细描述宠物信息', trigger: 'blur'}
  ],
}

const formRef = ref()

// 提交表单
const submitForm = async () => {
  await formRef.value.validate((valid) => {
    if (valid) {
      post('/api/pet/publishBulletin', {
        type: 'adopt', // 想领养
        petType: form.petType,
        sex: form.sex,
        isFree: form.isFree,
        location: locStr.value + form.lastLocation,
        contactsName: form.contactsName,
        contactsPhone: form.contactsPhone,
        contactsWechat: form.contactsWechat,
        contactsEmail: form.contactsEmail,
        title: form.title,
        text: form.text
      }, () => {
        ElMessage.success('发布成功')
        resetForm()
      })
    } else {
      ElMessage.warning('请完整填写表单内容')
    }
  })
}

// 重置表单数据
const resetForm = () => {
  formRef.value.resetFields();
}
</script>