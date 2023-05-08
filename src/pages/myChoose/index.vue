<template>
  <nut-empty v-show="data.length === 0" description="无数据"></nut-empty>
  <div style="margin-top: 30px">
    <nut-collapse v-model="activeName" :accordion="true">
      <nut-collapse-item v-for="item in data" :title="item.name + ' ' + item.code" :name="item.id"
                         :value="'剩余选课人数: ' + (item.maxCount - item.curCount)">
        <div style="display: flex; justify-content: space-between">
          <span>所属院系:</span>
          <span>{{ item.departmentName }}</span>
        </div>
        <div style="display: flex; justify-content: space-between">
          <span>任课教师:</span>
          <span>{{ item.teacherName }}</span>
        </div>
        <div style="display: flex; justify-content: space-between">
          <span>学分:</span>
          <span>{{ item.credit }} 分</span>
        </div>
        <div style="display: flex; justify-content: space-between">
          <span>上课地点:</span>
          <span>{{ item.classRoomName }}</span>
        </div>
        <div style="display: flex; justify-content: space-between">
          <span>上课时间:</span>
          <span>{{ item.classTime }}<br>{{ item.dayTime }}</span>
        </div>
        <div style="display: flex; justify-content: space-between">
          <span>当前选课人数:</span>
          <span>{{ item.curCount }}</span>
        </div>
        <div style="display: flex; justify-content: right">
          <nut-button @click="chooseClassDanger(item.id)" type="danger" size="mini">退选</nut-button>
        </div>
      </nut-collapse-item>
    </nut-collapse>
  </div>
  <nut-dialog title="退课" content="确定退选吗?" v-model:visible="visibleDialogDanger" @cancel="visibleDialogDanger = false" @ok="onDangerOk" />
  <nut-toast v-model:msg="toastMessage" center type="text" v-model:visible="toastShow" :cover="false"/>
</template>

<script lang="ts">
export default {
  name: "allChooseManager"
}
</script>

<script setup lang="ts">
import {commonGet, commonPost, handleBigNumber} from "../../request/commonRequest";
import {onMounted, ref} from "vue";
import router from "../../router/router";
import {Search} from "@nutui/icons-vue-taro";
import {useDataStore} from "../../pinia/pinia";

const toastMessage = ref("");
const toastShow = ref(false);

const openToast = (message: string) => {
  toastMessage.value = message;
  toastShow.value = true;
}

const store = useDataStore();

const activeName = ref(1);

const data = ref([]);
interface curriculumUser {
  userId: string,
  curriculumId: string
}
const myChoose = ref<Array<curriculumUser>>([]);

const weekDay = (day) => {
  if (day == 1) return "星期一";
  if (day == 2) return "星期二";
  if (day == 3) return "星期三";
  if (day == 4) return "星期四";
  if (day == 5) return "星期五";
  if (day == 6) return "星期六";
  if (day == 7) return "星期日";
  return "";
}

const getData = () => {
  commonGet("/curriculum/getByUserId", {userId: handleBigNumber(store.userInfo.id)}).then(res => {
    if (res.code == 200) {
      res.data.forEach(item => {
        item.id = handleBigNumber(item.id);
        item.teacherId = handleBigNumber(item.teacherId);
        item.departmentId = handleBigNumber(item.departmentId);
        item.classRoomId = handleBigNumber(item.classRoomId);
        item.classTime = "第" + item.weekTime[0] + "-" + item.weekTime[1] + "周"
        item.dayTime = "";
        item.timeDay.forEach(item1 => {
          item.dayTime += weekDay(item1[0]) + ": 第" + item1[1] + "-" + item1[2] + "节";
        })
      })
      data.value = res.data;
      visibleDialog.value = false;
    } else if (res.code == 505) {
      localStorage.removeItem("token")
      router.replace("/login")
    } else {
      openToast(res.msg);
      return;
    }
  }).catch(error => console.log(error));
}

onMounted(async () => {
  getData();
})

const visibleDialog = ref(false);
const visibleDialogDanger = ref(false);
const curriculumId = ref("");

const chooseClassDanger = (id) => {
  curriculumId.value = id;
  visibleDialogDanger.value = true;
}
const onDangerOk = () => {
  commonPost("/curriculum/user/deleteCurriculumUser", {userId: store.userInfo.id, curriculumId: curriculumId.value}).then(res => {
    if (res.code == 200) {
      openToast("退课成功!");
      getData()
      curriculumId.value = "";
    } else if (res.code == 505) {
      router.replace("/login")
    } else {
      openToast(res.msg)
    }
  }).catch(error => console.log(error));
}
</script>

<style scoped>
</style>