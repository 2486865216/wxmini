<template>
  <nut-searchbar
      v-model="inputValue"
      clearable
      @search="searchClick"
  >
    <template v-slot:leftin>
      <Search />
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
      @edit-icon="editClick"
      :show-bottom-button="false"
      :data-options="dataOptions"
      swipe-edition
      show-bottom-button
  >
  </nut-address-list>
  <nut-dialog title="新增账号" content="新增账号" v-model:visible="visibleDialog" @cancel="onDialogCancel"
              @ok="onDialogOk">
    <template v-slot:default>
      <nut-input
          v-model="basicData.username"
          class="nut-input-text"
          placeholder="请输入用户名"
          type="text"
          clearable
          clearSize="14"/>
      <nut-input
          v-model="basicData.nickname"
          class="nut-input-text"
          placeholder="请输入姓名"
          type="text"
          clearable
          clearSize="14"/>
      <nut-cell title="请选择院系" :sub-title="popupDesc" @click="show = true"></nut-cell>
    </template>
  </nut-dialog>
  <nut-dialog title="删除账号" content="确定删除账号吗?" v-model:visible="visibleDelDialog" @ok="delOk" @cancel="delDialogCancel"/>
  <nut-dialog title="编辑账号" content="确定编辑账号吗?" v-model:visible="visibleEditDialog" @ok="editOk" @cancel="editDialogCancel">
    <template v-slot:default>
      <nut-input
          v-model="editData.username"
          class="nut-input-text"
          placeholder="请输入用户名"
          type="text"
          clearable
          clearSize="14"/>
      <nut-input
          v-model="editData.nickname"
          class="nut-input-text"
          placeholder="请输入姓名"
          type="text"
          clearable
          clearSize="14"/>
      <nut-cell title="请选择院系" :sub-title="popupDesc" @click="show = true"></nut-cell>
    </template>
  </nut-dialog>
  <nut-popup
      position="bottom"
      v-model:visible="show"
      v-model="selectedValue"
  >
    <nut-picker
        v-model:value="popupValue"
        :columns="columns"
        title="请选择院系"
        @confirm="popupConfirm"
        @cancel="show=false"
    >
    </nut-picker>
  </nut-popup>
  <nut-fixed-nav  @selected="fixedSelected" :overlay="false"
                  :position="{bottom:'100px' }" v-model:visible="menuVisible"
                  :nav-list="navList" type="right">
    <template v-slot:btn>
      <span class="text">账号操作</span>
    </template>
  </nut-fixed-nav>
  <nut-toast v-model:msg="toastMessage" center type="text" v-model:visible="toastShow" :cover="false"/>
</template>

<script lang="ts">
export default {
  name: "studentsManager"
}
</script>

<script setup lang="ts">
import {onMounted, reactive, h, ref} from "vue";
import {commonDelete, commonGet, commonPost, commonPut, handleBigNumber} from "../../request/commonRequest";
import {Search} from "@nutui/icons-vue-taro";
import router from "../../router/router";

const inputValue = ref('');
const visibleDelDialog = ref(false);
const visibleEditDialog = ref(false);
const deleteUserId = ref('');

const searchClick = () => {
  getListData({search: inputValue.value})
}

const listData = ref([]);
const dataOptions = reactive({
  id: 'id',
  addressName: 'idTag',
  phone: 'detail',
  fullAddress: 'class',
});

const delClick = (e, item) => {
  deleteUserId.value = item.id;
  visibleDelDialog.value = true;
}
const editClick = (e, item) => {
  editData.id = item.id;
  editData.username = item.phone;
  editData.nickname = item.fullAddress.substring(3, item.fullAddress.indexOf(","));
  visibleEditDialog.value = true;
}

const delOk = () => {
  commonDelete("/teacher/deleteTeach/" + deleteUserId.value).then(res => {
    if (res.code == 200) {
      openToast(res.msg);
      deleteUserId.value = '0'
      getListData();
    } else if (res.code == 505) {
      router.replace('/login');
    } else {
      openToast(res.msg);
    }
  })
}

const delDialogCancel = () => {
  deleteUserId.value = '';
}

const editOk = () => {
  commonPut("/teacher/updateTeach", editData).then(res => {
    if (res.code == 200) {
      openToast(res.msg);
      getListData();
    } else if (res.code == 505) {
      router.replace('/login');
    } else {
      openToast(res.msg);
    }
  })
}

const editDialogCancel = () => {
  editData.username = '';
  editData.nickname = '';
  editData.id = '';
}

const toastShow = ref(false);
const toastMessage = ref("");

const openToast = (message: string) => {
  toastMessage.value = message;
  toastShow.value = true;
}

const onDialogCancel = () => {
  basicData.username = '';
  basicData.nickname = '';
};

const onDialogOk = () => {
  commonPost("/teacher/addTeach", basicData).then(res => {
    if (res.code == 200) {
      getListData();
      menuVisible.value = false;
    } else {
      openToast(res.msg)
    }
  }).catch(error => console.log(error));
  basicData.username = '';
  basicData.nickname = '';
};

const fixedSelected = (content) => {
  if (content.item.id == 1) {
    visibleDialog.value = true;
  }
};

const menuVisible = ref(false);
const navList = reactive([
  {
    id: 1,
    text: '新增账号',
    icon: 'https://img12.360buyimg.com/imagetools/jfs/t1/147573/29/1603/1721/5ef83e94E1393a678/5ddf1695ec989373.png'
  }
]);

const basicData = reactive({
  username: "",
  nickname: "",
  departmentId: ""
})

const editData = reactive({
  id: "",
  username: "",
  nickname: "",
  departmentId: ""
})

const show = ref(false)
const popupDesc = ref()
const popupValue = ref();
const columns = ref([]);
const selectedValue = ref([])

const popupConfirm = ({selectedValue, selectedOptions}) => {
  popupDesc.value = selectedOptions.map((val: any) => val.text).join(',')
  show.value = false
  basicData.departmentId = selectedValue[selectedValue.length - 1];
  editData.departmentId = selectedValue[selectedValue.length - 1];
}

const getList = (url: string, data?: any) => {
  return new Promise(resolve => {
    commonGet(url, data).then(res => {
          if (res.code == 200) {
            let classData: any = [];
            res.data.forEach((item: any, index) => {
                  if (index == 0) {
                    let temp = [item.id];
                    selectedValue.value = temp as any;
                  }
                  classData.push({
                    value: handleBigNumber(item.id),
                    text: item.name,
                  })
                }
            )
            resolve(classData)
          }else if (res.code == 505) {
            router.replace('/login');
          } else {
            openToast(res.msg)
          }
        }
    ).catch(error => console.log(error));
  })
}

onMounted(async () => {
  columns.value = await getList("/departmentManager/list") as any;
  getListData();
})

const visibleDialog = ref(false);

const getListData = (data?: any) => {
  commonGet("/teacher/list", data).then(res => {
    if (res.code == 200) {
      res.data.forEach((item) => {
            item.id = handleBigNumber(item.id)
            item.idTag = "工号:";
            item.detail = item.username
            item.class = "姓名:" + item.nickname + ",学院:" + item.departmentName;
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

</style>