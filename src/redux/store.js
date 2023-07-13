import { createStore } from "redux";
const modalValue = false;

const disaptcher = (state = modalValue, { type }) => {
  switch (type) {
    case "true":
      state = true;
      return state;
    case "false":
      state = false;
      return state;
    default:
      return state;
  }
};

const store = createStore(disaptcher);
export default store;
