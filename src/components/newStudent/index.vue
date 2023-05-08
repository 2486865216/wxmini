<template>

</template>

<script lang="ts">
export default {
  name: "newStudent",
}
</script>

<script setup lang="ts">
import {reactive} from "vue";

const basicData = reactive({
  username: "",
  password: ""
})

const demo2 = reactive({
  visible: false,
  value: [],
  options: [
    {
      text: '浙江',
      items: [
        {
          text: '杭州',
          disabled: true,
          items: [{text: '西湖区'}, {text: '余杭区'}]
        },
        {
          text: '温州',
          items: [{text: '鹿城区'}, {text: '瓯海区'}]
        }
      ]
    },
    {
      text: '福建',
      items: [
        {
          text: '福州',
          items: [{text: '鼓楼区'}, {text: '台江区'}]
        }
      ]
    }
  ]
});

function change(...args: any) {
  console.log('change', ...args);
}

function pathChange(...args: any) {
  console.log('pathChange', ...args);
}

</script>

<style scoped>

</style>