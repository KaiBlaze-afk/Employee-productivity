import { atom } from "recoil";


export const userInfoState = atom({
  key: "userInfoState",
  default: null,
});

export const tasksAssignedToUserState = atom({
  key: "tasksAssignedToUserState",
  default: [],
});

export const tasksAssignedByUserState = atom({
  key: "tasksAssignedByUserState",
  default: [],
});

export const allTasksState = atom({
  key: "allTasksState",
  default: [],
});

export const employeesState = atom({
  key: "employeesState",
  default: [],
});

export const loadingState = atom({
  key: "loadingState",
  default: true,
});

export const messageState = atom({
  key: "messageState",
  default: { text: "", type: "" },
});

export const showAssignTaskState = atom({
  key: "showAssignTaskState",
  default: false,
});

export const graphViewState = atom({
  key: "graphViewState",
  default: false,
});

export const EmployeeViewState = atom({
  key: "EmployeeViewState",
  default: false,
});

export const userTaskState = atom({
    key:"userTaskState",
    default:[]
})
