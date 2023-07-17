import React, { useEffect } from "react";
import Header from "./components/header.js";
import CodeEditor from "./pages/home.js";
import store from "./redux/store.js";
import { Provider } from "react-redux";

const App = () => {
  useEffect(() => {
    alert("No input are used in the output window.");
  }, []);
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
