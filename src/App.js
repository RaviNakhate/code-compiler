import React from "react";
import Header from "./components/header.js";
import CodeEditor from "./pages/home.js";
import store from "./redux/store.js";
import { Provider } from "react-redux";

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <Header />
        <CodeEditor />
      </div>
    </Provider>
  );
};

export default App;
