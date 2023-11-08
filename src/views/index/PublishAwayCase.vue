<!-- 发布宠物领养信息 -->
<template>
  <div style="margin: 20px;">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="150px" class="demo-ruleForm" :size="formSize"
      status-icon>
      <el-form-item label="宠物姓名">
        <el-input v-model="ruleForm.petName" placeholder="如果不知道，可不填" />
      </el-form-item>
      <el-form-item label="宠物种类" prop="petType">
        <el-radio-group v-model="ruleForm.petType">
          <el-radio-button label="cat">猫猫</el-radio-button>
          <el-radio-button label="dog">狗狗</el-radio-button>
          <el-radio-button label="other">其他</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="ruleForm.sex">
          <el-radio-button label="1">公</el-radio-button>
          <el-radio-button label="0">母</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="免费领养" prop="isFree" required>
        <!-- 状态为on时为1，状态为off时为0 -->
        <el-switch v-model="ruleForm.isFree" active-value="1" inactive-value="0" />
      </el-form-item>
      <el-form-item label="宠物照片" prop="pictureId">
        <!-- auto-upload是否自动上传，:action自动上传的请求路径， -->
        <el-upload v-model="ruleForm.pictureId" :auto-upload="false" :action="''" :show-file-list="false"
          :on-change="handleAvatarChangeIcon">
          <el-button size="mini" type="primary">选取文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="出生日期" prop="birthdate">
        <el-date-picker v-model="ruleForm.birthdate" type="date" placeholder="宠物出生日期" style="width: 100%" />
      </el-form-item>
      <el-form-item label="领养地址" prop="location">
        <el-input v-model="ruleForm.location" />
      </el-form-item>
      <el-form-item label="联系人" prop="contactsName">
        <el-input v-model="ruleForm.contactsName" />
      </el-form-item>
      <el-form-item label="联系电话" prop="contactsPhone">
        <el-input v-model="ruleForm.contactsPhone" />
      </el-form-item>
      <el-form-item label="微信号" prop="contactsWechat">
        <el-input v-model="ruleForm.contactsWechat" placeholder="可不填" />
      </el-form-item>
      <el-form-item label="邮箱" prop="contactsEmail">
        <el-input v-model="ruleForm.contactsEmail" placeholder="可不填" />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="ruleForm.title" placeholder="该内容会展示在最显眼的地方，如一只可爱的三花等一个好人家" />
      </el-form-item>
      <el-form-item label="详细描述" prop="text">
        <el-input v-model="ruleForm.text" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
          placeholder="内容不得超过300字" />
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          发布
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
  
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { post } from '@/utils/request.js'

// 选中文件触发的change事件
const handleAvatarChangeIcon = (file, fileList) => {
  // 限制文件后缀名
  const isJPG = file.raw.type === 'image/jpeg'
  const isPNG = file.raw.type === 'image/png'
  // 限制上传文件的大小
  const isLt5M = file.raw.size / 1024 / 1024 < 5
  if (!isPNG && !isJPG) {
    ElMessage.error('图片只能是 JPG/PNG 格式')
    return false
  } else if (!isLt5M) {
    ElMessage.error('图片应在5MB以内')
    return false
  } else {
    // 发起请求
    var param = new FormData();; //formdata格式
    param.append("file", file.raw);
    post('/api/file/upload', param, (res) => {
      ElMessage.success('上传成功');
      // 返回值为图片id
      ruleForm.pictureId = res
    })
  }
}

interface RuleForm {
  petName: string
  petType: string
  sex: string
  isFree: string
  birthdate: string
  location: string
  pictureId: string
  contactsName: string
  contactsPhone: string
  contactsWechat: string
  contactsEmail: string
  title: string
  text: string
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  petName: '', // 宠物姓名
  petType: 'cat', // 宠物种类
  sex: '1', // 宠物性别
  isFree: '1', // 是否免费
  birthdate: '', // 出生日期
  location: '', // 领养地址
  pictureId: '', // 图片id
  contactsName: '', // 联系人
  contactsPhone: '',  // 电话
  contactsWechat: '', // 微信
  contactsEmail: '', // 邮箱
  title: '', // 标题
  text: '' // 详细描述
})

const validateFileUrl = (rule, value, callback) => {
  if (value.length < 1) {//我控制了FileList 长度代表文件个数
    callback(new Error("请上传文件"))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<RuleForm>>({
  petType: [
    {
      required: true,
      message: '请选择种类',
      trigger: 'change',
    },
  ],
  sex: [
    {
      required: true,
      message: '请选择性别',
      trigger: 'change',
    },
  ],
  birthdate: [
    {
      type: 'date',
      message: '请输入出生日期',
      trigger: 'change',
    },
    {
      type: 'date',
      message: '请输入正确的出生日期',
      trigger: 'change'
    }
  ],
  location: [
    {
      required: true,
      message: '请输入领养地址',
      trigger: 'change',
    },
  ],
  pictureId: [
    {
      required: true, validator: validateFileUrl, trigger: 'change'
    },
  ],
  contactsName: [
    {
      required: true,
      message: '请输入联系人',
      trigger: 'change',
    },
  ],
  contactsPhone: [
    { required: true, message: '请输入手机号', trigger: 'change', },
    {}
  ],
  contactsWechat: [
    {
      message: '请输入合法的微信地址',
      trigger: 'change',
    },
  ],
  contactsEmail: [
    {
      type: 'email',
      message: '请输入合法的电子邮件地址',
      trigger: ['blur']
    }
  ],
  title: [
    {
      required: true,
      message: '请输入标题',
      trigger: 'blur',
    },
  ],
  text: [
    {
      required: true,
      message: '请详细描述宠物信息',
      trigger: 'blur',
    },
  ],
})

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      post('/api/pet/publishBulletin', {
        type: 'away',
        petName: ruleForm.petName,
        petType: ruleForm.petType,
        sex: ruleForm.sex,
        isFree: ruleForm.isFree,
        birthdate: ruleForm.birthdate,
        location: ruleForm.location,
        pictureId: ruleForm.pictureId,
        contactsName: ruleForm.contactsName,
        contactsPhone: ruleForm.contactsPhone,
        contactsWechat: ruleForm.contactsWechat,
        contactsEmail: ruleForm.contactsEmail,
        title: ruleForm.title,
        text: ruleForm.text
      }, () => {
        ElMessage.success('发布成功')
        formEl.resetFields()
      })
    } else {
      ElMessage.warning('请完整填写表单内容')
    }
  })
}

// 重置表单数据
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
  