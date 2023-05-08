<template>
<!--  <nut-button type="success" size="mini" @click="showDialog">新增</nut-button>-->
  <nut-empty v-show="state.data.length === 0" description="无数据"></nut-empty>
  <nut-table v-show="state.data.length !== 0" :columns="state.columns" :data="state.data"></nut-table>
  <nut-dialog title="新增" content="新增" v-model:visible="visibleDialog" @cancel="onDialogCancel" @ok="onDialogOk">
    <template v-slot:default>
      <nut-input
          v-model="basicData.name"
          class="nut-input-text"
          placeholder="请输入名称"
          type="text"
          clearable
          clearSize="14"/>
      <nut-input
          v-model="basicData.code"
          class="nut-input-text"
          placeholder="请输入编码"
          type="text"
          clearable
          clearSize="14"/>
    </template>
  </nut-dialog>
  <nut-dialog no-cancel-btn title="温馨提示" content="确定删除吗?" v-model:visible="visibleDelDialog" @ok="onDelOk" />
  <nut-dialog title="编辑" content="编辑" v-model:visible="visibleEditDialog" @cancel="onEditDialogCancel" @ok="onEditDialogOk">
    <template v-slot:header>
      编辑
      <Del2 @click="visibleDelDialog = true"/>
    </template>
    <template v-slot:default>
      <nut-input
          v-model="basicData.name"
          class="nut-input-text"
          placeholder="请输入名称"
          type="text"
          clearable
          clearSize="14"/>
      <nut-input
          v-model="basicData.code"
          class="nut-input-text"
          placeholder="请输入编码"
          type="text"
          clearable
          clearSize="14"/>
    </template>
  </nut-dialog>
  <nut-fixed-nav
      @selected="fixedSelected"
      :overlay="false"
      :position="{bottom:'100px' }"
      v-model:visible="menuVisible"
      :nav-list="navList"
      type="right">
    <template v-slot:btn>
      <span class="text">院系操作</span>
    </template>
  </nut-fixed-nav>
  <nut-toast v-model:msg="toastMessage" center type="text" v-model:visible="toastShow" :cover="false"/>
</template>

<script lang="ts">
export default {
  name: "departmentManager"
}
</script>

<script setup lang="ts">
import {onMounted, reactive, h, ref} from "vue";
import {commonDelete, commonGet, commonPost, commonPut, handleBigNumber} from "../../request/commonRequest";
import {Edit, Del2} from "@nutui/icons-vue-taro";
import router from "../../router/router";

const visibleDialog = ref(false);
const visibleEditDialog = ref(false);
const visibleDelDialog = ref(false);
const basicData = reactive({
  id: "",
  name: "",
  code: ""
})

const menuVisible = ref(false);
const fixedSelected = (content) => {
  if (content.item.id == 1) {
    visibleDialog.value = true;
  }
};

const navList = reactive([
  {
    id: 1,
    text: '新增院系',
    icon: 'https://img12.360buyimg.com/imagetools/jfs/t1/147573/29/1603/1721/5ef83e94E1393a678/5ddf1695ec989373.png'
  }
]);

const onDialogOk = () => {
  commonPost("/departmentManager/addDepartment", basicData).then(res => {
    if (res.code == 200) {
      basicData.code = "";
      basicData.name = "";
      getData();
    } else if (res.code == 505) {
      router.replace("/login");
    }
    openToast(res.msg)
  }).catch(error => {
    basicData.code = "";
    basicData.name = "";
    console.log(error)
  })
}

const onDialogCancel = () => {
  basicData.id = "";
  basicData.code = "";
  basicData.name = "";
}

const onEditDialogOk = () => {
  commonPut("/departmentManager/updateDepartment", basicData).then(res => {
    if (res.code == 200) {
      basicData.id = "";
      basicData.code = "";
      basicData.name = "";
      getData();
    } else if (res.code == 505) {
      router.replace("/login");
    }
    openToast(res.msg)
  }).catch(error => {
    basicData.id = "";
    basicData.code = "";
    basicData.name = "";
    console.log(error)
  })
}

const onEditDialogCancel = () => {
  basicData.id = "";
  basicData.code = "";
  basicData.name = "";
}

const onDelOk = () => {
  commonDelete("/departmentManager/deleteDepartment/" + basicData.id).then(res => {
    if (res.code == 200) {
      basicData.id = "";
      basicData.code = "";
      basicData.name = "";
      getData();
    } else if (res.code == 505) {
      router.replace("/login");
    }
    openToast(res.msg)
  }).catch(error => {
    basicData.id = "";
    basicData.code = "";
    basicData.name = "";
    console.log(error)
  })
  visibleEditDialog.value = false;
}

const getData = () => {
  commonGet("/departmentManager/list").then(res => {
        if (res.code == 200) {
          res.data.forEach((item, index) => {
                item.index = index + 1;
                item.operation = () => {
                  return h(
                      Edit,
                      {
                        onClick: () => {
                          visibleEditDialog.value = true;
                          basicData.id = handleBigNumber(item.id);
                          basicData.code = item.code;
                          basicData.name = item.name;
                        }
                      }
                  );
                }
              }
          )
          state.data = res.data;
        } else if (res.code == 505) {
          router.replace("/login")
        } else {
          openToast(res.msg)
        }
      }
  ).catch(error => console.log(error));
}

onMounted(() => {
  getData();
})


const state = reactive({
  columns: [
    {
      title: '序号',
      key: 'index',
      align: 'center',
    },
    {
      title: '名称',
      key: 'name',
      align: 'center',
    },
    {
      title: '编码',
      key: 'code',
      align: 'center',
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
    }
  ],
  data: [
  ]
});

const toastMessage = ref("");
const toastShow = ref(false);

const openToast = (message: string) => {
  toastMessage.value = message;
  toastShow.value = true;
}
</script>

<style scoped>

</style>