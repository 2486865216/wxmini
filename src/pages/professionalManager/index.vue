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
      <nut-cell title="请选择院系" :desc="pickerDesc" @click="pickerShow = true"></nut-cell>
    </template>
  </nut-dialog>
  <nut-popup position="bottom" v-model:visible="pickerShow">
    <nut-picker
        :columns="columns" title="选择院系"
        @cancel="pickerShow=false"
        @confirm="pickerConfirm"
    >
    </nut-picker>
  </nut-popup>
  <nut-dialog no-cancel-btn title="温馨提示" content="确定删除吗?" v-model:visible="visibleDelDialog" @ok="onDelOk"/>
  <nut-dialog title="编辑" content="编辑" v-model:visible="visibleEditDialog" @cancel="onEditDialogCancel"
              @ok="onEditDialogOk">
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
      <nut-cell title="请选择院系" :desc="pickerDesc" @click="pickerShow = true"></nut-cell>
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
      <span class="text">专业操作</span>
    </template>
  </nut-fixed-nav>
  <nut-toast v-model:msg="toastMessage" center type="text" v-model:visible="toastShow" :cover="false"/>
</template>

<script lang="ts">
export default {
  name: "professionalManager"
}
</script>

<script setup lang="ts">
import {onMounted, reactive, h, ref} from "vue";
import {commonDelete, commonGet, commonPost, commonPut, handleBigNumber} from "../../request/commonRequest";
import {Edit, Del2} from "@nutui/icons-vue-taro";
import router from "../../router/router";
import {Search} from "@nutui/icons-vue-taro";

const inputValue = ref('');
const visibleDialog = ref(false);
const visibleEditDialog = ref(false);
const visibleDelDialog = ref(false);
const basicData = reactive({
  id: "",
  name: "",
  code: "",
  departmentId: ""
});

const pickerDesc = ref("");
const pickerShow = ref(false);
const columns = ref<any>([]);

const menuVisible = ref(false);
const fixedSelected = (content) => {
  if (content.item.id == 1) {
    visibleDialog.value = true;
  }
};

const navList = reactive([
  {
    id: 1,
    text: '新增专业',
    icon: 'https://img12.360buyimg.com/imagetools/jfs/t1/147573/29/1603/1721/5ef83e94E1393a678/5ddf1695ec989373.png'
  }
]);

const searchClick = () => {
  getData({search: inputValue.value})
}

const pickerConfirm = ({ selectedValue, selectedOptions }) => {
  basicData.departmentId = selectedValue[0];
  pickerShow.value = false;
  pickerDesc.value = selectedOptions.map((val: any) => val.text).join(',');
}

const getList = (url: string, data?: any) => {
  return new Promise(resolve => {
    commonGet(url, data).then(res => {
          if (res.code == 200) {
            let classData: any = [];
            res.data.forEach(item => {
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

const showDialog = async () => {
  visibleDialog.value = true;
}

const onDialogOk = () => {
  commonPost("/professional/addProfessional", basicData).then(res => {
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
  basicData.departmentId = ""
}

const onEditDialogOk = () => {
  commonPut("/professional/updateProfessional", basicData).then(res => {
    if (res.code == 200) {
      basicData.id = "";
      basicData.code = "";
      basicData.name = "";
      basicData.departmentId = "";
      getData();
    } else if (res.code == 505) {
      router.replace("/login");
    }
    openToast(res.msg)
  }).catch(error => {
    basicData.id = "";
    basicData.code = "";
    basicData.name = "";
    basicData.departmentId = "";
    console.log(error)
  })
}

const onEditDialogCancel = () => {
  basicData.id = "";
  basicData.code = "";
  basicData.name = "";
  basicData.departmentId = "";
}

const onDelOk = () => {
  commonDelete("/professional/deleteProfessional/" + basicData.id).then(res => {
    if (res.code == 200) {
      basicData.id = "";
      basicData.code = "";
      basicData.name = "";
      basicData.departmentId = "";
      getData();
    } else if (res.code == 505) {
      router.replace("/login");
    }
    openToast(res.msg)
  }).catch(error => {
    basicData.id = "";
    basicData.code = "";
    basicData.name = "";
    basicData.departmentId = "";
    console.log(error)
  })
  visibleEditDialog.value = false;
}

const getData = async (data?: any) => {
  commonGet("/professional/list", data).then(res => {
        if (res.code == 200) {
          res.data.forEach((item, index) => {
                item.operation = () => {
                  return h(
                      Edit,
                      {
                        onClick: () => {
                          visibleEditDialog.value = true;
                          basicData.id = handleBigNumber(item.id);
                          basicData.code = item.code;
                          basicData.name = item.name;
                          pickerDesc.value = item.departmentName;
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

  columns.value = await getList("/departmentManager/list");
}

onMounted(() => {
  getData();
})


const state = reactive({
  columns: [
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
      title: '所属院系',
      key: 'departmentName',
      align: 'center',
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
    }
  ],
  data: []
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