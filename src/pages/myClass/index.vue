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
          <nut-button @click="detail(item.id)" style="margin-right: 20px" type="default" size="mini">详情
          </nut-button>
          <nut-button @click="delCurriculum(item.id)" style="margin-right: 20px" type="danger" size="mini">删除
          </nut-button>
          <nut-button @click="editCurriculum(item)" type="primary" size="mini">修改</nut-button>
        </div>
      </nut-collapse-item>
    </nut-collapse>
  </div>
  <nut-dialog title="新增" content="新增" v-model:visible="visibleDialog" @cancel="onDialogCancel" @ok="onDialogOk">
    <nut-input
        v-model="editData.name"
        placeholder="请输入名称"
        type="text"
        clearable
        clearSize="14"/>
    <nut-input
        v-model="editData.code"
        placeholder="请输入编码"
        type="text"
        clearable
        clearSize="14"/>
    <nut-cell>
      <div style="display: flex; align-items: center">
        <span>学分:     </span>
        <nut-input-number v-model="editData.credit" step="0.5" decimal-places="1" button-size="30" input-width="50"/>
      </div>
    </nut-cell>
    <nut-cell>
      <div style="display: flex; align-items: center">
        <span>选课人数: </span>
        <nut-input-number v-model="editData.maxCount" step="1" button-size="30" input-width="50"/>
      </div>
    </nut-cell>
    <nut-cell title="请选择院系" :desc="pickerDepartmentDesc"></nut-cell>
    <nut-cell title="任课教师" :desc="pickerTeacherDesc"></nut-cell>
    <nut-cell title="请选择上课地点" :desc="pickerClassRoomDesc" @click="pickerClassRoomShow = true"></nut-cell>
    <nut-cell title="请选择上课周" :desc="pickerWeekDesc" @click="pickerWeekShow = true"></nut-cell>
    <nut-cell title="请选择上课时间1" :desc="pickerTimeDesc" @click="pickerTimeShow = true"></nut-cell>
    <nut-cell title="请选择上课时间2" :desc="pickerTimeDesc1" @click="pickerTimeShow1 = true"></nut-cell>
  </nut-dialog>
  <nut-popup position="bottom" v-model:visible="pickerClassRoomShow">
    <nut-picker
        :columns="classRoomColumns" title="选择上课地点"
        @cancel="pickerClassRoomShow=false"
        @confirm="pickerClassRoomConfirm"
    >
    </nut-picker>
  </nut-popup>
  <nut-popup position="bottom" v-model:visible="pickerWeekShow">
    <nut-picker
        v-model="selectedTime"
        :columns="multipleColumns"
        title="选课上课周"
        @confirm="weekPickerConfirm"
        @cancel="pickerWeekShow = false"
    >
    </nut-picker>
  </nut-popup>
  <nut-popup position="bottom" v-model:visible="pickerTimeShow">
    <nut-picker
        v-model="selectedTimeDay"
        :columns="multipleTimeColumns"
        title="选课上课时间"
        @confirm="timePickerConfirm"
        @cancel="pickerTimeShow = false"
    >
    </nut-picker>
  </nut-popup>
  <nut-popup position="bottom" v-model:visible="pickerTimeShow1">
    <nut-picker
        v-model="selectedTimeDay1"
        :columns="multipleTimeColumns1"
        title="选课上课时间"
        @confirm="timePickerConfirm1"
        @cancel="pickerTimeShow1 = false"
    >
    </nut-picker>
  </nut-popup>
  <nut-dialog no-cancel-btn title="温馨提示" content="确定删除吗?" v-model:visible="visibleDelDialog" @ok="onDelOk"/>
  <nut-dialog title="编辑" content="编辑" v-model:visible="visibleEditDialog" @cancel="onEditDialogCancel"
              @ok="onEditDialogOk">
    <nut-input
        v-model="editData.name"
        placeholder="请输入名称"
        type="text"
        clearable
        clearSize="14"/>
    <nut-input
        v-model="editData.code"
        placeholder="请输入编码"
        type="text"
        clearable
        clearSize="14"/>
    <nut-cell>
      <div style="display: flex; align-items: center">
        <span>学分:     </span>
        <nut-input-number v-model="editData.credit" step="0.5" decimal-places="1" button-size="30" input-width="50"/>
      </div>
    </nut-cell>
    <nut-cell>
      <div style="display: flex; align-items: center">
        <span>选课人数: </span>
        <nut-input-number v-model="editData.maxCount" step="1" button-size="30" input-width="50"/>
      </div>
    </nut-cell>
    <nut-cell title="请选择院系" :desc="pickerDepartmentDesc" @click="pickerDepartmentShow = true"></nut-cell>
    <!--    <nut-cell title="请选择年级" :desc="pickerGradeDesc" @click="pickerGradeShow = true"></nut-cell>-->
    <nut-cell title="请选择任课教师" :desc="pickerTeacherDesc" @click="pickerTeacherShow = true"></nut-cell>
    <nut-cell title="请选择上课地点" :desc="pickerClassRoomDesc" @click="pickerClassRoomShow = true"></nut-cell>
    <nut-cell title="请选择上课周" :desc="pickerWeekDesc" @click="pickerWeekShow = true"></nut-cell>
    <nut-cell title="请选择上课时间1" :desc="pickerTimeDesc" @click="pickerTimeShow = true"></nut-cell>
    <nut-cell title="请选择上课时间2" :desc="pickerTimeDesc1" @click="pickerTimeShow1 = true"></nut-cell>
  </nut-dialog>
  <nut-fixed-nav
      @selected="fixedSelected"
      :overlay="false"
      :position="{bottom:'100px' }"
      v-model:visible="menuVisible"
      :nav-list="navList"
      type="right">
    <template v-slot:btn>
      <span class="text">课程操作</span>
    </template>
  </nut-fixed-nav>
  <nut-toast v-model:msg="toastMessage" center type="text" v-model:visible="toastShow" :cover="false"/>
</template>

<script lang="ts">
export default {
  name: "allChooseManager"
}
</script>

<script setup lang="ts">
import {commonDelete, commonGet, commonPost, commonPut, handleBigNumber} from "../../request/commonRequest";
import {onMounted, reactive, ref} from "vue";
import router from "../../router/router";
import {Search} from "@nutui/icons-vue-taro";
import {useDataStore} from "../../pinia/pinia";

const store = useDataStore();

const toastMessage = ref("");
const toastShow = ref(false);

const openToast = (message: string) => {
  toastMessage.value = message;
  toastShow.value = true;
}

const detail = (id) => {
  router.push({path: "/curriculumDetail", query: {id: handleBigNumber(id)}})
}

const activeName = ref(1);

const data = ref([]);

const weekDay = (day) => {
  if (day == 1) return "星期一";
  if (day == 2) return "星期二";
  if (day == 3) return "星期三";
  if (day == 4) return "星期四";
  if (day == 5) return "星期五";
  if (day == 6) return "星期六";
  if (day == 7) return "星期日";
}

const weekDayTime = (time) => {
  if (time == 1) return '第1节';
  if (time == 2) return '第2节';
  if (time == 3) return '第3节';
  if (time == 4) return '第4节';
  if (time == 5) return '第5节';
  if (time == 6) return '第6节';
  if (time == 7) return '第7节';
  if (time == 8) return '第8节';
  if (time == 9) return '第9节';
  if (time == 10) return '第10节';
  if (time == 11) return '第11节';
  if (time == 12) return '第12节';
  if (time == 13) return '第13节';
  return "";
}

const gradeResult = (grade): string => {
  if (grade == 1) return "一年级";
  if (grade == 2) return "二年级";
  if (grade == 3) return "三年级";
  if (grade == 4) return "四年级";
  return "";
}

const weekResult = (week): string => {
  if (week == 1) return '第1周';
  if (week == 1) return '第2周';
  if (week == 1) return '第3周';
  if (week == 1) return '第4周';
  if (week == 1) return '第5周';
  if (week == 1) return '第6周';
  if (week == 1) return '第7周';
  if (week == 1) return '第8周';
  if (week == 1) return '第9周';
  if (week == 1) return '第10周';
  if (week == 1) return '第11周';
  if (week == 1) return '第12周';
  if (week == 1) return '第13周';
  if (week == 1) return '第14周';
  if (week == 1) return '第15周';
  if (week == 1) return '第16周';
  if (week == 1) return '第17周';
  if (week == 1) return '第18周';
  if (week == 1) return '第19周';
  if (week == 1) return '第20周';
  return "";
}

const getList = (url: string, data?: any) => {
  return new Promise(resolve => {
    commonGet(url, data).then(res => {
          if (res.code == 200) {
            let classData: any = [];
            res.data.forEach(item => {
                  classData.push({
                    value: handleBigNumber(item.id),
                    text: item.name ? item.name : item.username + item.nickname,
                  })
                }
            )
            resolve(classData)
          } else if (res.code == 505) {
            router.replace('/login');
          } else {
            openToast(res.msg)
          }
        }
    ).catch(error => console.log(error));
  })
}

const getData = (searchData?: any) => {
  if (parseInt(store.userInfo.role) == 1) {
    if (searchData) {
      searchData.teacherId = handleBigNumber(store.userInfo.id);
    } else {
      searchData = {
        teacherId: handleBigNumber(store.userInfo.id)
      }
    }
  }
  commonGet("/curriculum/getByTeacherId", searchData).then(res => {
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
      menuVisible.value = false;
    } else if (res.code == 505) {
      localStorage.removeItem("token")
      router.replace("/login")
    } else {
      openToast(res.msg);
    }
  }).catch(error => console.log(error));
}

onMounted(async () => {
  getData();
  classRoomColumns.value = await getList("/class/room/list") as any;
  editData.departmentId = handleBigNumber(store.userInfo.departmentId)
  editData.teacherId = handleBigNumber(store.userInfo.id)
  pickerTeacherDesc.value = store.userInfo.nickname;
  commonGet('/departmentManager/getById', {id: handleBigNumber(store.userInfo.departmentId)}).then(res => {
    pickerDepartmentDesc.value = res.data.name;
  })
})
const menuVisible = ref(false);

const delCurriculum = (id) => {
  visibleDelDialog.value = true;
  delId.value = id;
}
const editCurriculum = (item) => {
  editData.id = item.id;
  editData.name = item.name;
  editData.code = item.code;
  editData.credit = item.credit;
  editData.grade = item.grade;
  editData.departmentId = item.departmentId;
  editData.teacherId = item.teacherId;
  editData.classRoomId = item.classRoomId;
  editData.weekTime = item.weekTime;
  editData.timeDay = item.timeDay;
  editData.maxCount = item.maxCount;

  pickerWeekDesc.value = weekResult(item.weekTime[0]) + "," + weekResult(item.weekTime[1])
  pickerGradeDesc.value = gradeResult(item.grade);
  pickerDepartmentDesc.value = item.departmentName;
  pickerTeacherDesc.value = item.teacherName;
  pickerClassRoomDesc.value = item.classRoomName;
  pickerTimeDesc.value = weekDay(item.timeDay[0][0]) + "," + weekDayTime(item.timeDay[0][1]) + "," + weekDayTime(item.timeDay[0][2])
  if (item.timeDay.length == 2) {
    pickerTimeDesc1.value = weekDay(item.timeDay[1][0]) + "," + weekDayTime(item.timeDay[1][1]) + "," + weekDayTime(item.timeDay[1][2])
  }
  visibleEditDialog.value = true;
}

const editData = reactive({
  id: "",
  name: "",
  code: "",
  credit: 0,
  grade: "",
  departmentId: "",
  teacherId: "",
  classRoomId: "",
  weekTime: [],
  timeDay: [[], []],
  maxCount: 0,
})

const visibleDialog = ref(false);
const onDialogCancel = () => {
  menuVisible.value = false;
}
const isOkData = () => {
  if (editData.timeDay.length < 1) {
    openToast("请选择上课时间!");
    return false;
  }
  if (editData.maxCount == 0) {
    openToast("选课人数不能为0!");
    return false;
  }
  if (editData.timeDay.length == 2) {
    let firstTime = editData.timeDay[0];
    let secondTime = editData.timeDay[1];
    if (firstTime[0] == secondTime[0]) {
      if (!(firstTime[2] < secondTime[1] || firstTime[1] > secondTime[2])) {
        openToast("两次选择的上课时间有冲突!");
        visibleDialog.value = true;
        return false;
      }
    }
  }
  return true;
}
const onDialogOk = () => {
  if (!isOkData()) return;
  commonPost("/curriculum/addCurriculum", editData).then(res => {
    if (res.code == 200) {
      getData();
      openToast(res.msg);
      visibleDialog.value = false;
      menuVisible.value = false;
      clearData();
    } else if (res.code == 505) {
      router.replace("/login");
    } else {
      openToast(res.msg);
      visibleDialog.value = true;
      return;
    }
  })
}

const pickerDepartmentDesc = ref("");

const pickerTeacherDesc = ref("");

const pickerClassRoomDesc = ref("");
const pickerClassRoomShow = ref(false);
const classRoomColumns = ref([])
const pickerClassRoomConfirm = ({selectedValue, selectedOptions}) => {
  editData.classRoomId = selectedValue[0];
  pickerClassRoomDesc.value = selectedOptions.map((val: any) => val.text).join(',');
  pickerClassRoomShow.value = false;
}

const pickerGradeDesc = ref("");
const pickerGradeShow = ref(false);
const columns = ref([
  {text: "一年级", value: "1"},
  {text: "二年级", value: "2"},
  {text: "三年级", value: "3"},
  {text: "四年级", value: "4"},
])

const pickerWeekShow = ref(false);
const pickerWeekDesc = ref("");
const selectedTime = ref(['第1周', '第1周']);
const multipleColumns = ref([
  // 第一列
  [
    {text: '第1周', value: '1'},
    {text: '第2周', value: '2'},
    {text: '第3周', value: '3'},
    {text: '第4周', value: '4'},
    {text: '第5周', value: '5'},
    {text: '第6周', value: '6'},
    {text: '第7周', value: '7'},
    {text: '第8周', value: '8'},
    {text: '第9周', value: '9'},
    {text: '第10周', value: '10'},
    {text: '第11周', value: '11'},
    {text: '第12周', value: '12'},
    {text: '第13周', value: '13'},
    {text: '第14周', value: '14'},
    {text: '第15周', value: '15'},
    {text: '第16周', value: '16'},
    {text: '第17周', value: '17'},
    {text: '第18周', value: '18'},
    {text: '第19周', value: '19'},
    {text: '第20周', value: '20'},
  ],
  // 第二列
  [
    {text: '第1周', value: '1'},
    {text: '第2周', value: '2'},
    {text: '第3周', value: '3'},
    {text: '第4周', value: '4'},
    {text: '第5周', value: '5'},
    {text: '第6周', value: '6'},
    {text: '第7周', value: '7'},
    {text: '第8周', value: '8'},
    {text: '第9周', value: '9'},
    {text: '第10周', value: '10'},
    {text: '第11周', value: '11'},
    {text: '第12周', value: '12'},
    {text: '第13周', value: '13'},
    {text: '第14周', value: '14'},
    {text: '第15周', value: '15'},
    {text: '第16周', value: '16'},
    {text: '第17周', value: '17'},
    {text: '第18周', value: '18'},
    {text: '第19周', value: '19'},
    {text: '第20周', value: '20'},
  ],
]);

const weekPickerConfirm = ({selectedValue, selectedOptions}) => {
  if (parseInt(selectedValue[0]) > parseInt(selectedValue[1])) {
    openToast("上课周选择有误")
    return;
  }
  editData.weekTime = selectedValue;
  pickerWeekDesc.value = selectedOptions.map((val: any) => val.text).join(',');
  pickerWeekShow.value = false;
}

const pickerTimeShow = ref(false);
const pickerTimeDesc = ref("");
const selectedTimeDay = ref(['星期一', '第1节', '第1节']);
const multipleTimeColumns = ref([
  // 第一列
  [
    {text: '星期一', value: '1'},
    {text: '星期二', value: '2'},
    {text: '星期三', value: '3'},
    {text: '星期四', value: '4'},
    {text: '星期五', value: '5'},
    {text: '星期六', value: '6'},
    {text: '星期七', value: '7'},
  ],
  // 第二列
  [
    {text: '第1节', value: '1'},
    {text: '第2节', value: '2'},
    {text: '第3节', value: '3'},
    {text: '第4节', value: '4'},
    {text: '第5节', value: '5'},
    {text: '第6节', value: '6'},
    {text: '第7节', value: '7'},
    {text: '第8节', value: '8'},
    {text: '第9节', value: '9'},
    {text: '第10节', value: '10'},
    {text: '第11节', value: '11'},
    {text: '第12节', value: '12'},
    {text: '第13节', value: '13'},
  ],
  // 第三列
  [
    {text: '第1节', value: '1'},
    {text: '第2节', value: '2'},
    {text: '第3节', value: '3'},
    {text: '第4节', value: '4'},
    {text: '第5节', value: '5'},
    {text: '第6节', value: '6'},
    {text: '第7节', value: '7'},
    {text: '第8节', value: '8'},
    {text: '第9节', value: '9'},
    {text: '第10节', value: '10'},
    {text: '第11节', value: '11'},
    {text: '第12节', value: '12'},
    {text: '第13节', value: '13'},
  ]
]);
const timePickerConfirm = ({selectedValue, selectedOptions}) => {
  if (selectedValue[1] > selectedValue[2]) {
    openToast("选择的上课时间有误!");
    return;
  }
  editData.timeDay[0] = selectedValue;
  pickerTimeDesc.value = selectedOptions.map((val: any) => val.text).join(',');
  pickerTimeShow.value = false;
}

const pickerTimeShow1 = ref(false);
const pickerTimeDesc1 = ref("");
const selectedTimeDay1 = ref(['星期一', '第1节', '第1节']);
const multipleTimeColumns1 = ref([
  // 第一列
  [
    {text: '星期一', value: '1'},
    {text: '星期二', value: '2'},
    {text: '星期三', value: '3'},
    {text: '星期四', value: '4'},
    {text: '星期五', value: '5'},
    {text: '星期六', value: '6'},
    {text: '星期七', value: '7'},
  ],
  // 第二列
  [
    {text: '第1节', value: '1'},
    {text: '第2节', value: '2'},
    {text: '第3节', value: '3'},
    {text: '第4节', value: '4'},
    {text: '第5节', value: '5'},
    {text: '第6节', value: '6'},
    {text: '第7节', value: '7'},
    {text: '第8节', value: '8'},
    {text: '第9节', value: '9'},
    {text: '第10节', value: '10'},
    {text: '第11节', value: '11'},
    {text: '第12节', value: '12'},
    {text: '第13节', value: '13'},
  ],
  // 第三列
  [
    {text: '第1节', value: '1'},
    {text: '第2节', value: '2'},
    {text: '第3节', value: '3'},
    {text: '第4节', value: '4'},
    {text: '第5节', value: '5'},
    {text: '第6节', value: '6'},
    {text: '第7节', value: '7'},
    {text: '第8节', value: '8'},
    {text: '第9节', value: '9'},
    {text: '第10节', value: '10'},
    {text: '第11节', value: '11'},
    {text: '第12节', value: '12'},
    {text: '第13节', value: '13'},
  ]
]);
const timePickerConfirm1 = ({selectedValue, selectedOptions}) => {
  if (selectedValue[1] > selectedValue[2]) {
    openToast("选择的上课时间有误!");
    return;
  }
  editData.timeDay[1] = selectedValue;
  pickerTimeDesc1.value = selectedOptions.map((val: any) => val.text).join(',');
  pickerTimeShow1.value = false;
}

const visibleDelDialog = ref(false);
const delId = ref("");
const onDelOk = () => {
  commonDelete("/curriculum/delete/" + delId.value).then(res => {
    if (res.code == 200) {
      getData();
      openToast(res.msg);
    } else if (res.code == 505) {
      router.replace("/login")
    } else {
      openToast(res.msg);
    }
  }).catch(error => console.log(error))
}

const visibleEditDialog = ref(false);
const clearData = () => {
  editData.id = "";
  editData.name = "";
  editData.code = "";
  editData.credit = 0;
  editData.grade = "";
  editData.classRoomId = "";
  editData.weekTime = [];
  editData.timeDay = [[], []];
  editData.maxCount = 0;

  pickerWeekDesc.value = "";
  pickerGradeDesc.value = "";
  pickerDepartmentDesc.value = "";
  pickerTeacherDesc.value = "";
  pickerClassRoomDesc.value = "";
  pickerTimeDesc.value = "";
  pickerTimeDesc1.value = "";
}
const onEditDialogCancel = () => {
  clearData();
}
const onEditDialogOk = () => {
  if (!isOkData()) return;
  commonPut("/curriculum/updateCurriculum", editData).then(res => {
    if (res.code == 200) {
      getData();
      openToast(res.msg);
      visibleDialog.value = false;
      menuVisible.value = false;
      clearData();
    } else if (res.code == 505) {
      router.replace("/login");
    } else {
      openToast(res.msg);
      return;
    }
  }).catch(error => {
    console.log(error)
  })
}

const fixedSelected = (content) => {
  if (content.item.id == 1) {
    visibleDialog.value = true;
  }
};

const navList = reactive([
  {
    id: 1,
    text: '新增课程',
    icon: 'https://img12.360buyimg.com/imagetools/jfs/t1/147573/29/1603/1721/5ef83e94E1393a678/5ddf1695ec989373.png'
  }
]);


</script>

<style scoped>
</style>