<!-- 发布宠物领养信息 -->

<template>
  <div style="margin: 20px;">
    <el-form style="width: 90%;" ref="formRef" :model="form" :rules="rules" label-width="150px" class="demo-ruleForm"
             status-icon>
      <el-form-item label="宠物姓名">
        <el-input maxlength="5" v-model="form.petName" placeholder="可不填"/>
      </el-form-item>
      <el-form-item label="宠物种类" prop="petType">
        <el-radio-group v-model="form.petType">
          <el-radio-button label="cat">猫猫</el-radio-button>
          <el-radio-button label="dog">狗狗</el-radio-button>
          <el-radio-button label="other">其他</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="性别" prop="petSex">
        <el-radio-group v-model="form.petSex">
          <el-radio-button label="1">公</el-radio-button>
          <el-radio-button label="0">母</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="免费领养" prop="isFree" required>
        <!-- 状态为on时为1，状态为off时为0 -->
        <el-switch v-model="form.isFree" active-value="1" inactive-value="0"/>
      </el-form-item>
      <el-form-item label="已绝育" prop="isSterilization" required>
        <el-switch v-model="form.isSterilization" active-value="1" inactive-value="0"/>
      </el-form-item>

      <el-row>
        <el-col :span="7">
          <el-form-item label="健康状态" prop="petHealthStatusRadio">
            <el-radio-group v-model="form.petHealthStatusRadio">
              <el-radio label="健康">健康</el-radio>
              <el-radio label="不健康">不健康</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="17">
          <!-- 仅当选择不健康时，输入框才会出现 -->
          <el-form-item label-width="0" v-if="form.petHealthStatusRadio === '不健康'"
                        prop="petHealthStatusInput"
                        required>
            <el-input placeholder="请描述病情" v-model="form.petHealthStatusInput"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="宠物照片" prop="dataList">
        <div class="set-pet-pic">
          <!-- auto-upload是否自动上传，:action自动上传的请求路径， -->
          <el-upload
              :limit="1"
              list-type="picture-card"
              :auto-upload="false"
              action="#"
              show-file-list
              :on-exceed="handleExceed"
              :on-change="handlePetChange"
              :on-preview="handlePictureCardPreview"
          >
            <el-icon size="30">
              <Plus/>
            </el-icon>
          </el-upload>
        </div>
        <el-dialog class="trans-dialog" v-model="dialogVisible" style="width:600px;">
          <el-image v-bind:src="dialogImageUrl" style="width: 100%;"/>
        </el-dialog>
      </el-form-item>
      <div style="position: relative">
        <el-form-item label="我的详细地址" prop="location">
          <el-input v-model="form.location" placeholder="请输入详细地址，右侧可快速选择"/>
        </el-form-item>
        <el-cascader placeholder="请选择"
                     style="width: 0; position: absolute; top: 0; right: 44px;"
                     :options="options"
                     v-model="form.locationArr"
                     @change="locHandleChange(form.locationArr)">
        </el-cascader>
      </div>
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
        <el-input maxlength="20" v-model="form.title" placeholder="如一只可爱的三花等一个好人家"/>
      </el-form-item>
      <el-form-item label="详细描述" prop="text">
        <el-input maxlength="300" v-model="form.text" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
                  placeholder="请描述宠物, 内容不得超过300字"/>
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
import {post, takeAccId} from '@/api/request.js'
import {options, handleChange} from "@/utils";
import {Plus} from "@element-plus/icons-vue";

// 表单选择地址并赋值给表单
const locHandleChange = (locArr) => {
  form.location = handleChange(locArr);
}

// 超出limit时触发的方法
const handleExceed = () => {
  ElMessage.warning('只能上传一个文件')
}

// 图片预览
const dialogVisible = ref(false);
const dialogImageUrl = ref('');
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
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

const form = reactive({
  petName: '', // 宠物姓名
  petType: 'cat', // 宠物种类
  petSex: '1', // 宠物性别
  isFree: '1', // 是否免费
  isSterilization: '1', // 是否绝育
  petHealthStatusRadio: '健康', // 是否健康单选框
  petHealthStatusInput: '', // 选择不健康输入框
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

// 自定义验证图片是否上传
const validatePic = (rule, value, callback) => {
  if (dataList.value.length === 0) {
    callback(new Error('请上传宠物图片'))
  } else {
    callback()
  }
}

const formRef = ref()
// 提交表单
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      // formData格式
      const awayFormData = new FormData();
      if (dataList.value.length === 0 || !dataList.value) {
        ElMessage.error('请上传图片');
        return false;
      }
      awayFormData.append("file", dataList.value[0])
      awayFormData.append("picType", "pet")
      awayFormData.append("accountId", takeAccId())
      awayFormData.append("type", 'away')
      awayFormData.append("petName", form.petName)
      awayFormData.append("petType", form.petType)
      awayFormData.append("petSex", form.petSex)
      awayFormData.append("isFree", form.isFree)
      awayFormData.append("isSterilization", form.isSterilization)
      awayFormData.append("petHealthStatus",
          form.petHealthStatusRadio === '健康' ? '健康' : form.petHealthStatusInput)
      awayFormData.append("location", form.location)
      awayFormData.append("contactsName", form.contactsName)
      awayFormData.append("contactsPhone", form.contactsPhone)
      awayFormData.append("contactsWechat", form.contactsWechat)
      awayFormData.append("contactsEmail", form.contactsEmail)
      awayFormData.append("title", form.title)
      awayFormData.append("text", form.text)
      post('/api/postBul/publishBulletin', awayFormData, () => {
        ElMessage.success('发布成功')
      }, () => {
        ElMessage.error('发布失败')
      })
    }
  })
}
// 重置表单数据
const resetForm = () => {
  formRef.value.resetFields();
}

const rules = {
  dataList: [
    {required: true, validator: validatePic, trigger: 'change'}
  ],
  petType: [
    {required: true, message: '请选择宠物种类', trigger: 'change'},
    {pattern: /^(cat|dog|other)$/, message: '宠物类型格式有误', trigger: 'blur'}
  ],
  petSex: [
    {required: true, message: '请选择性别', trigger: 'change'},
    {pattern: /^[0-1]$/, message: '性别格式有误', trigger: 'blur'}
  ],
  isFree: [
    {required: true, message: '请选择是否免费', trigger: 'change'},
    {pattern: /^[0-1]$/, message: '是否免费格式有误', trigger: 'blur'}
  ],
  isSterilization: [
    {required: true, message: '请选择是否绝育', trigger: 'change'},
    {pattern: /^[0-1]$/, message: '是否绝育格式有误', trigger: 'blur'}
  ],
  petHealthStatusRadio: [
    {required: true, message: '请选择是否健康', trigger: 'change'}
  ],
  petHealthStatusInput: [
    {required: true, message: '请描述病情', trigger: 'change'},
    {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号', trigger: 'blur'}
  ],
  location: [
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
    {required: true, message: '请输入标题', trigger: 'blur'},
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

.trans-dialog {
  background-color: rgb(0, 0, 0, 0) !important;
}

.trans-dialog .el-dialog__header {
  display: none;
}

.trans-dialog .el-dialog__body {
  padding: 0;
}
</style>