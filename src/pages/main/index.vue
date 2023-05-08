<template>
  <nut-navbar
      :title="store.headTitle"
      :border="true"
      :fixed="true"
      :placeholder="false"
      @on-click-back="showMenu"
  >
    <template #left>
      <Scan style="color: black"/>
    </template>
  </nut-navbar>
  <nut-divider></nut-divider>

  <router-view></router-view>

  <nut-popup
      position="left"
      v-model:visible="menuShow"
      :style="{ width, height }"
  >
    <div>
      <nut-tabs
          v-model="menuData.value"
          title-scroll
          direction="vertical"
          @change="tabChange"
      >
        <nut-tab-pane v-for="item in menuData.list" :pane-key="item.value" :title="item.name">
        </nut-tab-pane>
      </nut-tabs>
    </div>
  </nut-popup>

  <nut-tabbar v-model="store.index" :bottom="true" :placeholder="true" @tab-switch="tabSwitch">
    <nut-tabbar-item tab-title="首页" :icon="Home"></nut-tabbar-item>
<!--    <nut-tabbar-item tab-title="通知" :icon="Category"> </nut-tabbar-item>-->
    <nut-tabbar-item tab-title="个人中心" :icon="My"></nut-tabbar-item>
  </nut-tabbar>
</template>

<script lang="ts">
export default {
  name: "main"
}
</script>

<script setup lang="ts">
import {Scan} from '@nutui/icons-vue-taro';
import {ref, reactive, onMounted} from "vue";
import router from "../../router/router";
import { Home,Category,My} from '@nutui/icons-vue-taro';
import {useDataStore} from "../../pinia/pinia";

const components = reactive({Home, Category, My});
const store = useDataStore();

function tabSwitch(item, index) {
  if (index == 0) {
    let role = parseInt(store.userInfo.role);
    if (role == 0) {
      router.push("/departmentManager");
      store.updateHeadTitle("院系管理");
    } else if (role == 1) {
      router.push("/classManagement");
      store.updateHeadTitle("班级管理");
    } else if (role == 2) {
      router.push("/allChoose");
      store.updateHeadTitle("所有选课");
    }
  } else if (index == 2) {
    router.push("/notice")
  } else if (index == 1) {
    router.push("/my")
  }
  store.updateIndex(index);
  if (index != 0) {
    store.updateHeadTitle(item.tabTitle);
  }
}

onMounted(() => {
  router.push(menuData.value);
  store.updateHeadTitle(menuData.list[0].name);
})

const menuShow = ref(false);
const width = ref("40%");
const height = ref("100%");

const showMenu = () => {
  menuShow.value = true;
}

const menuList = [
  {
    value: "/departmentManager",
    icon_name: "user",
    name: "院系管理",
  },
  {
    value: "/professionalManagement",
    icon_name: "user",
    name: "专业管理",
  },
  {
    value: "/classManagement",
    icon_name: "user",
    name: "班级管理",
  },
  {
    value: "/curriculumManagement",
    icon_name: "user",
    name: "课程管理",
  },
  {
    value: "/teachersManager",
    icon_name: "user",
    name: "教师管理"
  },
  {
    value: "/studentsManager",
    icon_name: "user",
    name: "学生管理"
  },
  {
    value: "/allChoose",
    icon_name: "root-list",
    name: "全部选课"
  },
  {
    value: "/myChoose",
    icon_name: "user",
    name: "我的选课"
  },
]

const menuListAdmin = [
  {
    value: "/departmentManager",
    icon_name: "user",
    name: "院系管理",
  },
  {
    value: "/professionalManagement",
    icon_name: "user",
    name: "专业管理",
  },
  {
    value: "/classManagement",
    icon_name: "user",
    name: "班级管理",
  },
  {
    value: "/curriculumManagement",
    icon_name: "user",
    name: "课程管理",
  },
  {
    value: "/teachersManager",
    icon_name: "user",
    name: "教师管理"
  },
  {
    value: "/studentsManager",
    icon_name: "user",
    name: "学生管理"
  },
]

const menuListTeacher = [
  {
    value: "/classManagement",
    icon_name: "user",
    name: "班级管理",
  },
  {
    value: "/studentsManager",
    icon_name: "user",
    name: "学生管理"
  },
  {
    value: "/myClass",
    icon_name: "root-list",
    name: "我的课程"
  }
]

const menuListStudent = [
  {
    value: "/allChoose",
    icon_name: "root-list",
    name: "全部选课"
  },
  {
    value: "/myChoose",
    icon_name: "user",
    name: "我的选课"
  },
]

const role = parseInt(store.userInfo.role);

const menuData = reactive({
  list: role == 0 ? menuListAdmin : role == 1 ? menuListTeacher : menuListStudent,
  value: role == 0 ? menuListAdmin[0].value : role == 1 ? menuListTeacher[0].value : menuListStudent[0].value,
});

const tabChange = (choose) => {
  store.updateIndex(0);
  store.updateHeadTitle(choose.title);
  menuShow.value = false;
  router.push(choose.paneKey)
}

</script>

<style scoped>
/deep/ .nut-tabs.vertical .nut-tabs__titles.scroll-vertical {
  width: 100% !important;
}
</style>