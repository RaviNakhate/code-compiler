import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/theme-monokai";
import axios from "axios";
import "./home.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { key } from "../utils/constant";
import { useMediaQuery } from "react-responsive";

const CodeEditor = () => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const [previousCode, setPreviousCode] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState(52);
  const [output, setOutput] = useState("");
  const [lang, setLang] = useState([{ id: 52, name: "C++ (GCC 7.4.0)" }]);
  const [loading, setLoading] = useState(false);
  const [buttonDisplay, setButtonDisplay] = useState("Execute");
  const headers = {
    'content-type': 'application/json',
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': '0eeb0f7f9emsh5fbf936cceca7fep11c0f0jsn0daffe29c2a5',
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
  };

  useEffect(() => {
    getLanguages();
  }, []);

  // LOADING BUTTON
  useEffect(() => {
    if (loading) {
      const intervalId = setInterval(() => {
        setButtonDisplay((prevMessage) => {
          if (prevMessage === "Loading...") {
            return "Loading.";
          } else if (prevMessage === "Loading.") {
            return "Loading..";
          } else {
            return "Loading...";
          }
        });
      }, 500);
      return () => {
        clearInterval(intervalId);
      };
    } else {
      setButtonDisplay("Execute");
    }
  }, [loading]);


  // GET OUTPUT FROM judge0
  const getCodeOutput = async (token) => {
    const { data } = await axios.get(
      `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
      { headers }
    );
    console.log(data);
    if (data?.compile_output) {
      setOutput(data.compile_output);
    } else if (data?.stdout) {
      setOutput(data.stdout);
    } else {
      toast.error("Server Error", { theme: "dark" });
    }
  };

  // SEND INPUT TO judge0
  const sendCode = async (headers) => {
    const requestData = {
      language_id: language,
      source_code: code,
      stdin: "SnVkZ2Uw",
    };

    const { data } = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&fields=*",
      requestData,
      { headers }
    );
    if (data.token) {
      return data.token;
    } else {
      console.log(data);
    }
  };

  // ON CLICK SAVE & EXCUTE BUTTON
  const executeCode = async () => {
    try {
      if (code.trim() === "" || code == null) {
        setLoading(false);
        return 0;
      }

      await setPreviousCode(code);
      const token = await sendCode(headers);

      setTimeout(() => {
        getCodeOutput(token);
        setLoading(false);
      }, 5000);
    } catch (err) {
      console.log(err);
      if (
        err.response.data.message ===
        "You have exceeded the DAILY quota for Submissions on your current plan, BASIC. Upgrade your plan at https://rapidapi.com/judge0-official/api/judge0-ce"
      ) {
        toast.error("Daily Exceeded limit is full, Try Tommorrow", {
          theme: "dark",
        });
      }
    }
  };

  // GET LANGUAGES LIST
  const getLanguages = async () => {
    const headers = {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": key,
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    };
    const result = await axios.get(
      `https://judge0-ce.p.rapidapi.com/languages/`,
      {
        headers,
      }
    );
    console.log(result.data);
    setLang(result.data);
  };
  return (
    <div style={{ marginBottom: "25px" }}>
      {/* Code window */}
      <div className="code-snippet">
        <AceEditor
          mode={"javascript"}
          theme="monokai"
          value={code}
          onChange={setCode}
          height="400px"
          width={isBigScreen ? "50%" : "100%"}
          /* style={state ? { zIndex: "-1" } : {}} */
          fontSize={16}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            useWorker: false,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
          }}
        />
        {!isBigScreen ? (
          <div style={{ margin: "10px", whiteSpace: "nowrap" }}>Output :</div>
        ) : (
          ""
        )}

        <AceEditor
          mode={"javascript"}
          theme="monokai"
          value={output}
          height="400px"
          width={isBigScreen ? "50%" : "100%"}
          /* style={state ? { zIndex: "-1" } : {}} */
          fontSize={16}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={false}
          setOptions={{
            useWorker: false,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: false,
          }}
          readOnly={true}
        />
      
      {/* Buttons */}
      </div>
      <div className="flex">
        <div>
          <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="select"
        >
          {lang.map((obj, id) => {
            return (
              <option id={id} value={obj.id}>
                {obj.name}
              </option>
            );
          })}
        </select>
        </div>
        

        <div className="label">
          Compile with input
          <input type="radio" disabled></input>Yes
          <input type="radio" checked disabled></input>No
        </div>

      <div>
          <button
           onClick={async () => {
              setLoading(true);
              await executeCode();
          }}
          className="btn"
          style={loading ? { cursor: "progress" } : {}}
          //disabled={loading ? true : false}
        >
          {buttonDisplay}
          {previousCode !== code ? " *" : null}
         </button>
      </div>
       
      </div>
      <ToastContainer />
    </div>
  );
};

export default CodeEditor;
