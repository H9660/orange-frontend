import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { runCode, submitCode } from "../slices/problem/problemSlice";
import { updateSolvedProblems } from "../slices/auth/authSlice";
const CodeEditor = (title) => {
  const [code, setCode] = useState(localStorage.getItem("code") || "");
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "cpp"
  );
  const [theme, setTheme] = useState("vs-dark");
  const [verdict, setVerdict] = useState("");
  const [input, setInput] = useState(localStorage.getItem("input") || "");
  const languages = ["cpp", "Java", "Python", "Javascript", "Ruby"];
  const themes = [
    "vs",
    "vs-dark",
    "hc-black",
    "monokai",
    "solarized-dark",
    "solarized-light",
    "github",
    "github-dark",
    "github-light",
  ];
  const dispatch = useDispatch();
  const { result } = useSelector((state) => state.problems);
  const { user } = useSelector((state) => state.auth);
  const updateLanguage = (event) => {
    setLanguage(event.target.value);
    localStorage.setItem("language", event.target.value);
  };

  const updateTheme = (event) => {
    setTheme(event.target.value);
  };

  const updateCode = (value) => {
    setCode(value);
  };

  const updateInput = (e) => {
    setInput(e.target.value);
  };
  const resetCode = () => {
    setCode("");
    setVerdict("");
  };

  const runcode = (e) => {
    if (code === "") {
      toast.error("Write some code first");
      return;
    }

    localStorage.setItem("code", code);
    localStorage.setItem("input", input);
    const submitData = {
      code: code,
      language: language,
      title: title,
      input: input,
    };
    dispatch(runCode(submitData));
  };

  const submitcode = (e) => {
    if (code === "") {
      toast.error("Write some code first");
      return;
    }

    if (localStorage.getItem("user") == null) {
      toast.error("Please login to submit");
      return;
    }

    localStorage.setItem("code", code);
    const submitData = {
      code: code,
      language: language,
      title: title.title,
  };
    dispatch(submitCode(submitData));
    console.log(result);
    if (result === "Accepted" && !user.solvedProblems.includes(title)) {
      const email = user.email;
      const updateData = {
        email,
        title,
      };
      dispatch(updateSolvedProblems(updateData));
    }
  };

  useEffect(() => {
    console.log(result);
    setVerdict(result);
  }, [dispatch, result]);

  return (
    <div id="editor">
      <ul id="editor-heading">
        <li>
          <select
            name="languages"
            value={language}
            id="langauge-select"
            onChange={updateLanguage}
          >
            {languages.map((lang, index) => (
              <option key={index} value={lang.toLowerCase()}>
                {lang}
              </option>
            ))}
          </select>
        </li>
        <li>
          <select
            name="themes"
            value={theme}
            id="theme-select"
            onChange={updateTheme}
          >
            {themes.map((theme, index) => (
              <option key={index} value={theme.toLowerCase()}>
                {theme}
              </option>
            ))}
          </select>
        </li>
        <ul>
          <li onClick={runcode}>Run</li>
          <li onClick={submitcode}>Submit</li>
        </ul>
      </ul>
      <Editor
        height="350px"
        language={language}
        placeholder="Write your code here..."
        name="code"
        value={code}
        theme={theme}
        onChange={updateCode} // Call handleCodeChange when the content changes
        options={{
          mouseWheelZoom: true, // Enable zooming with the mouse wheel
        }}
      />
      <div id="input-output">
        <textarea
          id="input"
          defaultValue={input}
          onChange={updateInput}
          placeholder="Enter you input here..."
        ></textarea>
        <div id="output">
          <h3>Output/Error:</h3>
          {verdict && <pre>{verdict}</pre>}
        </div>
      </div>
      <div id="code-reset" onClick={resetCode}>
        Reset
      </div>
    </div>
  );
};

export default CodeEditor;
