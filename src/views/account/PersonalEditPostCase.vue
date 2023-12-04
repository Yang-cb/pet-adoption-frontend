<!-- 修改宠物领养信息 -->
<template>
  <div style="margin: 20px;">
    <el-form style="width: 90%;" ref="formRef" :model="editForm" :rules="rules" label-width="150px"
             class="demo-ruleForm"
             status-icon>
      <el-form-item label="宠物姓名">
        <el-input maxlength="5" v-model="editForm.petName" placeholder="可不填"/>
      </el-form-item>
      <el-form-item label="宠物种类" prop="petType">
        <el-radio-group v-model="editForm.petType">
          <el-radio-button label="cat">猫猫</el-radio-button>
          <el-radio-button label="dog">狗狗</el-radio-button>
          <el-radio-button label="other">其他</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="性别" prop="petSex">
        <el-radio-group v-model="editForm.petSex">
          <el-radio-button label="1">公</el-radio-button>
          <el-radio-button label="0">母</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="免费领养" prop="isFree" required>
        <!-- 状态为on时为1，状态为off时为0 -->
        <el-switch v-model="editForm.isFree" :active-value="1" :inactive-value="0"/>
      </el-form-item>
      <el-form-item label="宠物照片" prop="dataList">
        <div style="height: 160px; position: relative">
          <!-- auto-upload是否自动上传，:action自动上传的请求路径， -->
          <el-upload
              :limit="1"
              list-type="picture-card"
              :auto-upload="false"
              action="#"
              show-file-list
              :file-list="fileList"
              :on-exceed="handleExceed"
              :on-change="handlePetChange"
              :on-preview="handlePictureCardPreview"
          >
            <span style="font-size: 30px;">+</span>
          </el-upload>
        </div>
        <el-dialog v-model="dialogVisible" style="width:600px;">
          <el-image v-bind:src="dialogImageUrl" style="width: 100%;"/>
        </el-dialog>
      </el-form-item>
      <div style="position: relative">
        <el-form-item label="我的详细地址" prop="location">
          <el-input v-model="editForm.location" placeholder="请输入详细地址，右侧可快速选择"/>
        </el-form-item>
        <el-cascader placeholder="请选择"
                     style="width: 0; position: absolute; top: 0; right: 44px;"
                     :options="options"
                     v-model="editForm.locationArr"
                     @change="locHandleChange(editForm.locationArr)">
        </el-cascader>
      </div>
      <el-form-item label="联系人" prop="contactsName">
        <el-input minlength="1" maxlength="5" v-model="editForm.contactsName"/>
      </el-form-item>
      <el-form-item label="联系电话" prop="contactsPhone">
        <el-input minlength="11" maxlength="11" v-model="editForm.contactsPhone"/>
      </el-form-item>
      <el-form-item label="微信号" prop="contactsWechat">
        <el-input maxlength="11" v-model="editForm.contactsWechat" placeholder="可不填"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="contactsEmail">
        <el-input minlength="6" v-model="editForm.contactsEmail" placeholder="可不填"/>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input maxlength="20" v-model="editForm.title" placeholder="如一只可爱的三花等一个好人家"/>
      </el-form-item>
      <el-form-item label="详细描述" prop="text">
        <el-input maxlength="300" v-model="editForm.text" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
                  placeholder="请描述宠物, 内容不得超过300字"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="router.go(-1)">取消</el-button>
        <el-button type="primary" @click="submitForm()">
          修改
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {ElMessage} from 'element-plus'
import {put, get, takeAccId} from '@/api/request.js'
import {options, handleChange, getPetImageUrl} from "@/utils";
import {useRoute} from 'vue-router'
import router from "@/router";

let route = useRoute();

const editForm = ref({
  petName: '', // 宠物姓名
  petType: '', // 宠物种类
  petSex: '', // 宠物性别
  isFree: '', // 是否免费
  locationArr: '', // 地址选择片段
  location: '', // 地址输入片段
  picName: '', // 图片名
  contactsName: '', // 联系人
  contactsPhone: '',  // 电话
  contactsWechat: '', // 微信
  contactsEmail: '', // 邮箱
  title: '', // 标题
  text: '' // 详细描述
})

// 图片预览
const dialogVisible = ref(false);
const dialogImageUrl = ref('');
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
}

// 超出limit时触发的方法
const handleExceed = () => {
  ElMessage.warning('只能上传一个文件')
}

// 暂存上传的文件
const dataList = ref('')
// 选中文件触发的change事件
const handlePetChange = (file, fileList) => {
  // 限制文件后缀名
  const isJPG = file.raw.type === 'image/jpeg'
  const isPNG = file.raw.type === 'image/png'
  // 限制上传文件的大小
  const isLt3M = file.raw.size / 1024 / 1024 < 3
  if (!isPNG && !isJPG) {
    ElMessage.error('图片只能是 JPG/PNG 格式')
    return false
  } else if (!isLt3M) {
    ElMessage.error('图片应在3MB以内')
    return false
  } else {
    let arr = [];
    fileList.forEach((item) => {
      arr.push(item.raw);
    });
    dataList.value = arr;
  }
}

const formRef = ref()
// 提交表单
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      // formData格式
      const formData = new FormData();
      if (dataList.value.length !== 0 && dataList.value) {
        formData.append("file", dataList.value[0])
      }
      formData.append("petId", route.query.petId)
      formData.append("picType", "pet")
      formData.append("accountId", takeAccId())
      formData.append("type", 'away')
      formData.append("petName", editForm.value.petName)
      formData.append("petType", editForm.value.petType)
      formData.append("petSex", editForm.value.petSex)
      formData.append("isFree", editForm.value.isFree)
      formData.append("location", editForm.value.location)
      formData.append("contactsName", editForm.value.contactsName)
      formData.append("contactsPhone", editForm.value.contactsPhone)
      formData.append("contactsWechat", editForm.value.contactsWechat)
      formData.append("contactsEmail", editForm.value.contactsEmail)
      formData.append("title", editForm.value.title)
      formData.append("text", editForm.value.text)
      put('/api/postBul/updatePetByPetId', formData, () => {
        ElMessage.success('修改成功')
        router.go(-1)
      })
    } else {
      ElMessage.warning('请完整填写表单内容')
    }
  })
}

const fileList = ref([])

// 获取数据
get('/api/pet/getPBByPetId?petId=' + route.query.petId, (data) => {
  data.picName = getPetImageUrl(data.picName)
  fileList.value.push({
    name: data.picName,
    url: data.picName
  })
  editForm.value = data
  console.log(data)
})

// 表单选择地址赋值给表单
const locHandleChange = (locArr) => {
  editForm.value.location = handleChange(locArr);
}

const rules = {
  petType: [
    {required: true, message: '请选择种类', trigger: 'change'}
  ],
  petSex: [
    {required: true, message: '请选择性别', trigger: 'change',}
  ],
  location: [
    {required: true, message: '请输入详细地址', trigger: 'change',},
  ],
  contactsName: [
    {required: true, message: '请输入联系人', trigger: 'change',},
  ],
  contactsPhone: [
    {required: true, message: '请输入手机号', trigger: 'change',},
    {}
  ],
  contactsWechat: [
    {message: '请输入合法的微信地址', trigger: 'change'}
  ],
  contactsEmail: [
    {type: 'email', message: '请输入合法的电子邮件地址', trigger: ['blur']}
  ],
  title: [
    {required: true, message: '请输入标题', trigger: 'blur',},
  ],
  text: [
    {required: true, message: '请详细描述宠物信息', trigger: 'blur',},
  ],
}
</script>

<style>
.avatar-uploader .el-upload {
  border: dashed 2px #d8dde3 !important;
  border-radius: 4px !important;
  background: #fcfcfc;
}

.avatar-uploader .avatar-uploader-icon {
  background: #fcfcfc;
}

.avatar-uploader .el-icon-plus:before {
  content: "上传图片" !important;
  font-size: 12px;
  color: #000;
}

</style>