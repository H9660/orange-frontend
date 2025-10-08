import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import useSWR, { mutate } from "swr";
import problemService from "../slices/problem/problemService";
import Spinner from "../components/Spinner";
function ProblemUpdateForm() {
  const { problemTitle } = useParams();
  const [formData, setFormData] = useState({
    title: problemTitle,
    statement: "Loading...",
    constraints: "Loading...",
  });

  const fetcher = async (title) => {
    if (title) {
      const problem = await problemService.getProblem(title);
      if (problem) return problem;
    }
  };

  const [testcases, setTestcases] = useState([{ input: "", output: "" }]);
  const { title, statement, constraints } = formData;

  const myRef = useRef(null);
  const navigate = useNavigate();

  // SWR fetcher using async dispatch
  const { data, error, isLoading } = useSWR(problemTitle, fetcher, {
    revalidateOnFocus: true,
  });

  // Populate form once data is fetched
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

  useEffect(() => {
    if (data) {
      console.log(data);
      setFormData({
        title: data.title || "Loading...",
        statement: data.statement || "Loading...",
        constraints: data.constraints || "Loading...",
      });
      setTestcases(
        data.testcases?.length ? data.testcases : [{ input: "", output: "" }]
      );
    }
  }, [data]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!testcases.length || testcases.some((tc) => !tc.input || !tc.output)) {
      toast.error("All test cases must be filled!");
      return;
    }

    const updatedProblem = { ...formData, problemTitle, testcases };

    try {
      // Optimistically update SWR cache
      await mutate(
        problemTitle,
        async () => {
          await problemService.updateProblem(problemTitle, updatedProblem); // API call
          return updatedProblem; // update cache immediately
        },
        {
          optimisticData: updatedProblem,
          rollbackOnError: true,
          revalidate: false,
        }
      );

      toast.success("Problem updated successfully!");
      navigate("/problems");
    } catch (err) {
      toast.error(err.message || "Failed to update problem!");
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading problem: {error.message}</div>;

  return (
    <div className="problem-form-container">
      <section className="heading">
        <h1 className="heading-title">
          <FaEdit /> Edit Problem
        </h1>
        <p className="heading-subtitle">
          Modify the details and test cases of this coding problem.
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
              Update Problem
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ProblemUpdateForm;
