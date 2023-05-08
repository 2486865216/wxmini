<template>
  <nut-cell center style="margin-top: 50px" :title="showData.username" round-radius="20"></nut-cell>
  <nut-cell center :title="showData.nickname" round-radius="20"></nut-cell>
  <nut-cell center :title="showData.className" v-if="showClass" round-radius="20"></nut-cell>
  <nut-cell center icon="my" :title="showData.myChoose" v-if="showMyChoose" round-radius="20"
            @click="toMyCurriculum"></nut-cell>
  <nut-button block @click="updatePassword" type="warning">修改密码</nut-button>
  <nut-dialog title="修改密码" content="修改密码。" v-model:visible="visible" @cancel="onCancel" @ok="onOk">
    <nut-input
        placeholder="请输入旧密码"
        v-model="updateData.oldPassword"
        type="password"
        clearable
    />
    <nut-input
        placeholder="请输入新密码"
        v-model="updateData.newPassword"
        type="password"
        clearable
    />
    <nut-input
        placeholder="请输入新密码"
        v-model="updateData.newPassword2"
        type="password"
        clearable
    />
  </nut-dialog>
  <nut-button block style="margin-top: 10px" @click="loginout" type="danger">退出登录</nut-button>
  <nut-toast v-model:msg="toastMessage" center type="text" v-model:visible="toastShow" :cover="false"/>
</template>

<script lang="ts">
export default {
  name: "my",
}
</script>

<script setup lang="ts">
import {useDataStore} from "../../pinia/pinia";
import router from "../../router/router";
import {onMounted, reactive, ref} from "vue";
import {commonPut} from "../../request/commonRequest";

const toastMessage = ref("");
const toastShow = ref(false);
const openToast = (message: string) => {
  toastShow.value = true;
  toastMessage.value = message;
}

const store = useDataStore();

const emptyUserInfo = reactive({
  id: "",
  username: "",
  nickname: "",
  role: "",
  classId: "",
  className: "",
  professionalId: "",
  professionalName: "",
  departmentId: "",
  departmentName: "",
})
const showData = reactive({
  username: "",
  nickname: "",
  className: "",
  myChoose: ""
})

const showClass = ref(true);
const showMyChoose = ref(true);

const showInfo = () => {
  let info = store.userInfo;
  let role = Number(info.role);
  if (role == 2) {
    showData.username = "学号: " + info.username;
    showData.nickname = "姓名: " + info.nickname;
    showData.className = "班级: " + info.departmentName + "" + info.professionalName + "," + info.className;
    showData.myChoose = "我的选课"
  } else if (role == 1) {
    showData.username = "工号: " + info.username;
    showData.nickname = "姓名: " + info.nickname;
    showData.className = "院系: " + info.departmentName;
    showData.myChoose = "我的课程"
  } else if (role == 0) {
    showData.username = info.username;
    showData.nickname = info.nickname;
    showClass.value = false;
    showMyChoose.value = false;
  }
}

onMounted(() => {
  showInfo();
})

const loginout = () => {
  store.updateIndex(0);
  store.updateUserInfo(emptyUserInfo);
  localStorage.removeItem("token");
  router.replace("/login")
}

const visible = ref(false);
const updateData = reactive({
  oldPassword: "",
  newPassword: "",
  newPassword2: "",
})
const onCancel = () => {
  updateData.oldPassword = "";
  updateData.newPassword = "";
  updateData.newPassword2 = "";
}
const onOk = () => {
  if (updateData.oldPassword.length == 0) {
    openToast("旧密码不能为空！");
    visible.value = true;
  } else if (updateData.newPassword.length == 0) {
    openToast("新密码不能为空！");
    visible.value = true;
  } else if (updateData.newPassword2.length == 0) {
    openToast("新密码不能为空！");
    visible.value = true;
  } else if (updateData.newPassword != updateData.newPassword2) {
    openToast("两次输入的新密码不一致！");
    visible.value = true;
  } else {
    commonPut("/login/updatePassword", updateData).then(res => {
      if (res.code == 200) {
        loginout();
      } else if (res.code == 505) {
        router.replace("/login");
        visible.value = true;
      }
      openToast(res.msg);
    }).catch(error => console.log(error))
  }
}

const updatePassword = () => {
  visible.value = true;
}

function toMyCurriculum() {
  router.push("/myChoose");
  store.updateIndex(0);
  store.updateHeadTitle(showData.myChoose);
}
</script>

<style scoped>
</style>