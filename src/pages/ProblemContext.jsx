import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import CodeEditor from "./CodeEditor";
import { getProblem } from "../slices/problem/problemSlice";
import { FaExclamationCircle } from "react-icons/fa";

function ProblemContext(title) {
  const solveSuccess = false;
  const compilerError = false;
  const failure = false;

  const dispatch = useDispatch();

  const { problem, isLoading, isError, message } = useSelector(
    (state) => state.problems
  );
  console.log(problem)
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getProblem(title));
  }, [dispatch, isError, title, message]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {problem ? (
        <div id="main">
          <div id="problem">
            <ul id="problem-heading">
              <li>{problem.title}</li>
              <ul>
                <li>{problem.difficulty}</li>
                <li>✔Solved</li>
              </ul>
            </ul>
            {solveSuccess ? (
              <>
                <div id="success-solve">Success</div>
                <ul id="navigate-buttons">
                  <li>◀◀ Previous</li>
                  <li>Next ▶▶</li>
                </ul>
              </>
            ) : compilerError ? (
              <>
                <div id="compiler-error">Compiler Error</div>
                <ul id="navigate-buttons">
                  <li>◀◀ Previous</li>
                  <li>Next ▶▶</li>
                </ul>
              </>
            ) : failure ? (
              <>
                <div id="failure-solve">Failure</div>
                <ul id="navigate-buttons">
                  <li>◀◀ Previous</li>
                  <li>Next ▶▶</li>
                </ul>
              </>
            ) : (
              <>
                <div id="problem-statement">{problem.statement}</div>
                <ul id="problem-specs">
                  {problem.testcases.length > 0 ? (
                    <li>
                      Input: {problem.testcases[0].input}
                      <br></br>
                      Output: {problem.testcases[0].output}
                    </li>
                  ) : (
                    <div></div>
                  )}

                  {problem.testcases.length > 1 ? (
                    <li>
                      Input: {problem.testcases[1].input}
                      <br></br>
                      Output: {problem.testcases[1].output}
                    </li>
                  ) : (
                    <div></div>
                  )}

                  {problem.constrants ? (
                    <li>{problem.constraints}</li>
                  ) : (
                    <li>No constraints on input</li>
                  )}
                </ul>
              </>
            )}
          </div>

          <CodeEditor title={title} />
        </div>
      ) : (
        <>
          <div id="not-found">
            <FaExclamationCircle
              id="exclaim"
              size="120px"
            ></FaExclamationCircle>
          </div>
          <div id="not-found">Problem not found</div>
        </>
      )}
    </>
  );
}

export default ProblemContext;
