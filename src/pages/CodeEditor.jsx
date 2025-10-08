import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { Editor } from "@monaco-editor/react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { runCode, submitCode } from "../slices/problem/problemSlice";
import { updateSolvedProblems } from "../slices/auth/authSlice";

const CodeEditor = ({ title }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.problems);
  const { user } = useSelector((state) => state.auth);
  const [code, setCode] = useState(localStorage.getItem(`${title}-code`) || "");
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "cpp"
  );
  const [theme, setTheme] = useState("vs-dark");
  const [verdict, setVerdict] = useState("Please run your code...");
  const [input, setInput] = useState(localStorage.getItem("input") || "");

  const languages = ["cpp", "Java", "Python", "Javascript", "Ruby"];
  const themes = ["vs", "vs-dark", "monokai", "solarized-dark", "github-dark"];

  const updateCode = (value) => setCode(value);
  const updateInput = (e) => setInput(e.target.value);
  const updateLanguage = (e) => {
    setLanguage(e.target.value);
    localStorage.setItem("language", e.target.value);
  };
  const updateTheme = (e) => setTheme(e.target.value);

  const runcode = async () => {
    if (!code) return toast.error("Write some code first");
    localStorage.setItem(`${title}-code`, code);
    localStorage.setItem(`${title}-input`, input);
    const result = await dispatch(runCode({ code, language, title, input }));
    console.log(result.payload);
    if (result && result.payload) setVerdict(result.payload);
  };

  const submitcode = async () => {
    if (!code) return toast.error("Write some code first");
    if (!user) return toast.error("Please login to submit");
    localStorage.setItem(`${title}-code`, code);
    const result = await dispatch(submitCode({ code, language, title }));
    console.log(result);
    if (result && result.payload) setVerdict(result.payload);
    console.log(user.solvedProblems);
    if (result === "Accepted" && !user.solvedProblems.includes(title)) {
      await dispatch(updateSolvedProblems({ email: user.email, title }));
    }
  };

  const resetCode = () => {
    setCode("");
    setVerdict("");
  };

  return (
    <div className="code-editor">
      <div className="editor-controls">
        <select value={language} onChange={updateLanguage}>
          {languages.map((lang, idx) => (
            <option key={idx} value={lang.toLowerCase()}>
              {lang}
            </option>
          ))}
        </select>

        <select value={theme} onChange={updateTheme}>
          {themes.map((t, idx) => (
            <option key={idx} value={t.toLowerCase()}>
              {t}
            </option>
          ))}
        </select>

        <button className="run-btn" onClick={runcode}>
          Run
        </button>
        <button className="submit-btn" onClick={submitcode}>
          Submit
        </button>
        <button className="reset-btn" onClick={resetCode}>
          Reset
        </button>
      </div>

      <Editor
        height="350px"
        language={language}
        theme={theme}
        value={code}
        onChange={updateCode}
        options={{ minimap: { enabled: true } }}
      />

      <textarea
        className="editor-input"
        placeholder="Enter custom input here..."
        value={input}
        onChange={updateInput}
      />
      {isLoading ? (
        <>
          <ClipLoader color="#ffffff" size={20} />
        </>
      ) : (
        <div
          className={
            verdict.includes("error")
              ? "editor-output-error"
              : "editor-output-success"
          }
        >
          {verdict}
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
