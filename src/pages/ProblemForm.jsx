import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCode, FaTrashAlt, FaPlus } from "react-icons/fa";
import { reset } from "../slices/auth/authSlice";
import { createProblem } from "../slices/problem/problemSlice";
import Spinner from "../components/Spinner";

function ProblemForm() {
  const [formData, setFormData] = useState({
    title: "",
    statement: "",
    constraints: "",
  });

  const [testcases, setTestcases] = useState([{ input: "", output: "" }]);

  const { title, statement, constraints } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myRef = useRef(null);

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) toast.error(message);
    dispatch(reset());
  }, [isError, message, dispatch]);

  useEffect(() => {
    myRef.current?.focus();
  }, []);

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onTestChange = (index, field, value) => {
    const updated = [...testcases];
    updated[index][field] = value;
    setTestcases(updated);
  };

  const addTestCase = () => {
    // Check previous test case validity
    const last = testcases[testcases.length - 1];
    if (!last.input || !last.output) {
      toast.error("Please fill in the previous test case first!");
      return;
    }
    setTestcases([...testcases, { input: "", output: "" }]);
  };

  const removeTestCase = (index) => {
    const updated = [...testcases];
    updated.splice(index, 1);
    setTestcases(updated.length ? updated : [{ input: "", output: "" }]);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // Validate testcases
    if (!testcases.length || testcases.some((tc) => !tc.input || !tc.output)) {
      toast.error("All test cases must be filled!");
      return;
    }

    const problemData = { title, statement, constraints, testcases };
    dispatch(createProblem(problemData));
    navigate("/problems");
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="problem-form-container">
      <section className="heading">
        <h1 className="heading-title">
          <FaCode /> Add Problem
        </h1>
        <p className="heading-subtitle">
          Fill in the details of the new problem and create engaging coding
          challenges for your users.
        </p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              ref={myRef}
              type="text"
              name="title"
              value={title}
              onChange={onChange}
              placeholder="Problem Title"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <textarea
              name="statement"
              value={statement}
              onChange={onChange}
              placeholder="Problem Statement"
              className="form-control"
              rows={4}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="constraints"
              value={constraints}
              onChange={onChange}
              placeholder="Constraints"
              className="form-control"
            />
          </div>

          <div className="testcases-container">
            <h3>Test Cases</h3>
            {testcases.map((tc, index) => (
              <div className="testcase" key={index}>
                <textarea
                  placeholder="Input"
                  value={tc.input}
                  onChange={(e) => onTestChange(index, "input", e.target.value)}
                />
                <textarea
                  placeholder="Output"
                  value={tc.output}
                  onChange={(e) =>
                    onTestChange(index, "output", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="delete-testcase"
                  onClick={() => removeTestCase(index)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add-testcase-btn"
              onClick={addTestCase}
            >
              <FaPlus /> Add Test Case
            </button>

            <button type="submit" className="btn submit-btn">
              Create Problem
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ProblemForm;
