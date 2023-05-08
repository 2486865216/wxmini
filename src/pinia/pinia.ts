import { defineStore } from 'pinia'

export const useDataStore = defineStore('tabBarIndex', {
    state: () => {
        return {
            index: 0,
            headTitle: "院系管理",
            userInfo: {
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
            }
        }
    },
    actions: {
        updateIndex(newIndex: Number) {
            this.index = newIndex;
        },
        updateHeadTitle(title: string) {
            this.headTitle = title;
        },
        updateUserInfo(userInfo: any) {
            this.userInfo = userInfo;
        },
    },
})