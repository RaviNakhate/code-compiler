import React, { useEffect } from "react";
import Header from "./components/header.js";
import CodeEditor from "./pages/home.js";

const App = () => {
  return (
      <div>
        <Header />
        <CodeEditor />
      </div>
  );
};

export default App;
