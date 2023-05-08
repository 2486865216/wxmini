<template>
  <nut-searchbar
      v-model="inputValue"
      clearable
      @search="searchClick"
  >
    <template v-slot:leftout>
      <Left @click="back"/>
    </template>
    <template v-slot:leftin>
      <Search/>
    </template>
    <template v-slot:rightout>
      <nut-button type='primary' @click="searchClick" size="small">搜索</nut-button>
    </template>
  </nut-searchbar>
  <nut-empty v-show="listData.length === 0" description="无数据"></nut-empty>
  <nut-address-list
      :data="listData"
      @del-icon="delClick"
      @swipe-del="delClick"
      :show-bottom-button="false"
      :data-options="dataOptions"
      swipe-edition
  >
  </nut-address-list>
  <nut-dialog title="删除" content="确定删除吗?" v-model:visible="visibleDelDialog" @ok="delOk"
              @cancel="delDialogCancel"/>
  <nut-toast v-model:msg="toastMessage" center type="text" v-model:visible="toastShow" :cover="false"/>
</template>

<script lang="ts">
export default {
  name: "studentsManager"
}
</script>

<script setup lang="ts">
import {onMounted, reactive, h, ref} from "vue";
import {commonGet, commonPost, commonPut, handleBigNumber} from "../../request/commonRequest";
import {Search, Left} from "@nutui/icons-vue-taro";
import router from "../../router/router";
import {useDataStore} from "../../pinia/pinia";
import {useRoute} from "vue-router";

const route = useRoute();
const inputValue = ref('');
const visibleDelDialog = ref(false);
const store = useDataStore();

const searchClick = () => {
  getListData({search: inputValue.value, id: route.query.id})
}

const back = () => {
  router.back();
}

const listData = ref([]);
const dataOptions = reactive({
  id: 'id',
  addressName: 'idTag',
  phone: 'detail',
  fullAddress: 'class',
});

const delData = {
  userId: "",
  curriculumId: "",
}

const delClick = (e, item) => {
  delData.userId = item.id;
  delData.curriculumId = route.query.id as string;
  visibleDelDialog.value = true;
}

const delOk = () => {
  commonPost("/curriculum/user/deleteCurriculumUser", delData).then(res => {
    if (res.code == 200) {
      openToast(res.msg);
      delData.userId = "";
      delData.curriculumId = "";
      getListData({id: route.query.id});
    } else if (res.code == 505) {
      router.replace('/login');
    } else {
      openToast(res.msg);
      return;
    }
  })
}

const delDialogCancel = () => {
  delData.userId = "";
  delData.curriculumId = "";
}

const toastShow = ref(false);
const toastMessage = ref("");

const openToast = (message: string) => {
  toastMessage.value = message;
  toastShow.value = true;
}

onMounted(async () => {
  getListData({id: route.query.id});
})

const getListData = (data?: any) => {
  commonGet("/student/getUserByCurriculumId", data).then(res => {
    if (res.code == 200) {
      res.data.forEach((item) => {
            item.id = handleBigNumber(item.id)
            item.idTag = "学号:";
            item.detail = item.username
            item.class = "姓名:" + item.nickname + ",班级:" + item.departmentName + "," + item.professionalName + "," + item.className;
          }
      )
      listData.value = res.data;
    } else if (res.code == 505) {
      router.replace('/login');
    } else {
      openToast(res.msg)
    }
  }).catch(error => console.log(error));
}
</script>

<style scoped>
/deep/ .nut-address-list-item__info-handle-edit {
  display: none;
}
</style>