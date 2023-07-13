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
import { useDispatch } from "react-redux";
import replaceQuotesAndNewlines from "../utils/replaceQuotesAndNewlines.js";
import convertEscapedCharacters from "../utils/convertEscapedCharacters.js";
import { urlApi } from "../utils/constant";

const CodeEditor = () => {
  const dispatch = useDispatch();
  const [previousCode, setPreviousCode] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState(52);
  const [output, setOutput] = useState("");
  const [lang, setLang] = useState([{ id: 52, name: "C++ (GCC 7.4.0)" }]);

  useEffect(() => {
    getData();
    getLanguages();
  }, []);

  const getCodeOutput = async (headers, token) => {
    const { data } = await axios.get(
      `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
      { headers }
    );
    console.log(data);
    if (data.stdout) {
      setOutput(data.stdout);
    } else {
      toast.error("Server Error", { theme: "dark" });
    }
  };

  const sendCode = async (headers) => {
    const requestData = {
      language_id: language,
      source_code: replaceQuotesAndNewlines(code),
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

  const executeCode = async () => {
    try {
      if (previousCode === code) {
        return 0;
      }
      if (code.trim() === "" || code == null) {
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

      const headers = await {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": data.key,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      };

      const token = await sendCode(headers);
      await getCodeOutput(headers, token);
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

  const getData = async () => {
    const username = await localStorage.getItem("username");
    const { data } = await axios.get(`${urlApi}/submissions/${username}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    setCode(convertEscapedCharacters(data.source_code));
    setPreviousCode(convertEscapedCharacters(data.source_code));
  };

  const getLanguages = async () => {
    const { data } = await axios.get(`${urlApi}/auth/key`);
    const headers = await {
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
    <div>
      <div className="code-snippet">
        <AceEditor
          mode={"javascript"}
          theme="monokai"
          value={code}
          onChange={setCode}
          height="400px"
          width="50%"
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
        <AceEditor
          mode={"javascript"}
          theme="monokai"
          value={output}
          height="400px"
          width="50%"
          style={{ zIndex: "-1" }}
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
          /* onClick={executeCode}  */ onClick={() => {
            if (localStorage.getItem("token")) executeCode();
            else dispatch({ type: "true" });
          }}
          className="btn"
        >
          Save & Execute {previousCode !== code ? "*" : null}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CodeEditor;
