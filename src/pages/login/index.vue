<template>
  <div style="position: absolute; z-index: -1; width: 100%; height: 100%; background-color: red;background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);">
    <h1 style="text-align: center; padding-top: 50px">选课系统</h1>
  </div>
  <div style="padding: 20px; margin-top: 50%; ">
    <div>
      <nut-form>
        <nut-form-item
            label="用户名"
        >
          <nut-input v-model="basicData.username" class="nut-input-text" placeholder="请输入用户名" type="text"/>
        </nut-form-item>
        <nut-form-item
            label="密码"
        >
          <nut-input v-model="basicData.password" class="nut-input-text" placeholder="请输入密码" type="password"/>
        </nut-form-item>
        <nut-form-item label-align="center" body-align="center">
          <nut-button type="success" size="large" @click="myLogin">登录</nut-button>
        </nut-form-item>
      </nut-form>
    </div>
  </div>
  <nut-toast v-model:msg="toastMessage" @close="onClosed" center type="text" v-model:visible="toastShow"
             :cover="false"/>
</template>
<script lang="ts">
export default {
  name: "Login"
}
</script>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';
import {login, loginData} from "../../request/loginRequest";
import router from "../../router/router";
import {useDataStore} from "../../pinia/pinia";
import {commonGet} from "../../request/commonRequest";

const store = useDataStore();

onMounted(() => {
  localStorage.removeItem("token");
})

const toastShow = ref(false);
const toastMessage = ref("");

const openToast = (message: string) => {
  toastMessage.value = message;
  toastShow.value = true;
}

const onClosed = () => console.log('closed')


const basicData: loginData = reactive({
  username: "",
  password: ""
});


const myLogin = () => {
  if (basicData.username?.length == 0) {
    openToast("用户名不能为空!")
    return;
  }
  if (basicData.password?.length == 0) {
    openToast("密码不能为空!")
    return;
  }
  login(basicData).then(res => {
        if (res.code === 200) {
          localStorage.setItem("token", res.data);
          commonGet("/login/getInfo").then(res => {
            if (res.code == 200) {
              store.updateUserInfo(res.data);
              openToast("登录成功!");
              router.replace("/");
            } else {
              openToast(res.msg)
            }
          }).catch(err => {
            openToast("登录失败!")
            console.log(err)
          })
        } else {
          openToast(res.msg)
        }
      }
  ).catch(err => {
    openToast("登录失败!")
    console.log(err)
  })
}

</script>

<style scoped>
</style>