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
import { useSelector, useDispatch } from "react-redux";
import replaceQuotesAndNewlines from "../utils/replaceQuotesAndNewlines.js";
import convertEscapedCharacters from "../utils/convertEscapedCharacters.js";
import { urlApi } from "../utils/constant";
import { useMediaQuery } from "react-responsive";

const CodeEditor = () => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [previousCode, setPreviousCode] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState(52);
  const [output, setOutput] = useState("");
  const [lang, setLang] = useState([{ id: 52, name: "C++ (GCC 7.4.0)" }]);
  const [loading, setLoading] = useState(false);
  const [buttonDisplay, setButtonDisplay] = useState("Save & Execute");
  const headers = {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": localStorage.getItem("key"),
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  };

  useEffect(() => {
    getData();
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
      setButtonDisplay("Save & Execute");
    }
  }, [loading]);

  // SET judge0 INPUT TOKEN
  const setTokenKey = async (token) => {
    try {
      const { data } = await axios.post(
        `${urlApi}/submissions/setTokenKey`,
        {
          token_key: token,
          username: localStorage.getItem("username"),
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data?.error) {
        toast.error(data.error, { theme: "dark" });
      }
    } catch (err) {
      toast.error("Server Error", { theme: "dark" });
    }
  };

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
        if (localStorage.getItem("token_key")) {
          await getCodeOutput(localStorage.getItem("token_key"));
        }
        setLoading(false);
        return 0;
      }
      const { data } = await axios.post(
        `${urlApi}/submissions/`,
        {
          language_id: language,
          source_code: replaceQuotesAndNewlines(code),
          username: localStorage.getItem("username"),
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setPreviousCode(code);

      const token = await sendCode(headers);
      // const token = "7016fcda-bb9d-4410-a06a-dc6c6163abea";
      localStorage.removeItem("token_key");
      await setTokenKey(token);
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

  // GET SOURCE_CODE ON REFREST USING useEffect
  const getData = async () => {
    const username = await localStorage.getItem("username");
    const { data } = await axios.get(`${urlApi}/submissions/${username}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    setCode(convertEscapedCharacters(data.source_code));
    setPreviousCode(convertEscapedCharacters(data.source_code));
    localStorage.setItem("token_key", data?.token_key);
  };

  // GET LANGUAGES LIST
  const getLanguages = async () => {
    const { data } = await axios.get(`${urlApi}/auth/key`);
    const headers = {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": data.key,
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    };
    const result = await axios.get(
      `https://judge0-ce.p.rapidapi.com/languages/`,
      {
        headers,
      }
    );
    setLang(result.data);
  };
  return (
    <div style={{ marginBottom: "25px" }}>
      <div className="code-snippet">
        <AceEditor
          mode={"javascript"}
          theme="monokai"
          value={code}
          onChange={setCode}
          height="400px"
          width={isBigScreen ? "50%" : "100%"}
          style={state ? { zIndex: "-1" } : {}}
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
          style={state ? { zIndex: "-1" } : {}}
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
      </div>
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

        <button
          /* onClick={executeCode}  */ onClick={async () => {
            if (localStorage.getItem("token")) {
              setLoading(true);
              await executeCode();
            } else dispatch({ type: "true" });
          }}
          className="btn"
          style={loading ? { cursor: "progress" } : {}}
          disabled={loading ? true : false}
        >
          {buttonDisplay}
          {previousCode !== code ? "*" : null}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CodeEditor;
