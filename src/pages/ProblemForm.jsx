import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCode } from "react-icons/fa";
import { reset } from "../slices/auth/authSlice";
import { createProblem } from "../slices/problem/problemSlice";
import Spinner from "../components/Spinner";

function ProblemForm() {
  const [formData, setFormData] = useState({
    title: "",
    statement: "",
    testcases: [],
    constraints: "",
  });

  const [testData, setTestData] = useState({
    input: "",
    output: "",
  });

  const { title, statement, testcases, constraints } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth // this is a reducer
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onTestChange = (e) => {
    setTestData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const resetTestData = () => {
    setTestData({
      input: "",
      output: "",
    });
  };

  const removeLastTestCase = () => {
    console.log("Remove");
    const testCasesDiv = document.getElementById("testCases");
    console.log(
      "testcaseslength " +
        testcases.length +
        "  " +
        "childrenLength " +
        testCasesDiv.children.length
    );

    if (testCasesDiv.children.length === testcases.length - 1) testcases.pop();
  };

  const AddTestCase = () => {
    const testCasesDiv = document.getElementById("testCases");
    if (
      testCasesDiv.children.length > 0 &&
      (testData.input.length === 0 || testData.output.length === 0)
    ) {
      toast.error("Please enter all the test fields");
      return;
    }
    resetTestData();
    // Get the reference to the testCases div
    // Create a container div for the entire set of inputs
    const containerDiv = document.createElement("div");

    // Create the form group div for the first set of inputs
    const formGroupDiv1 = document.createElement("div");
    formGroupDiv1.className = "form-group";

    // Testcase input
    const inputInput1 = document.createElement("textarea");
    inputInput1.className = "testcase-input";
    inputInput1.name = "input";
    inputInput1.placeholder = "Enter input";
    inputInput1.addEventListener("change", onTestChange);

    // Testcase output
    const outputInput1 = document.createElement("textarea");
    outputInput1.className = "testcase-output";
    outputInput1.name = "output";
    outputInput1.placeholder = "Enter expected output";
    outputInput1.addEventListener("change", onTestChange);

    // Append the input elements to the form group div for the first set
    formGroupDiv1.appendChild(inputInput1);
    formGroupDiv1.appendChild(outputInput1);

    // Append the form group div for the first set to the container div
    containerDiv.appendChild(formGroupDiv1);

    // Append the container div to the testCases div
    testCasesDiv.appendChild(containerDiv);
    const removeBtn = document.getElementById("removeTestCase");
    if (testCasesDiv && testCasesDiv.children.length === 1) {
      removeBtn.style.display = "block";
    }

    if (testData.input.length > 0 && testData.output.length > 0)
      testcases.push(testData);

    console.log("Add");
    console.log(
      "testcaseslength " +
        testcases.length +
        "  " +
        "childrenLength " +
        testCasesDiv.children.length
    );

    console.log(testData.input);
    resetTestData();
  };

  function removeTestCase() {
    const container = document.getElementById("testCases");
    if (container && container.children.length > 0) {
      container.removeChild(container.lastChild);

      // Hide the remove button if no test cases are left
      if (container && container.children.length === 0) {
        document.getElementById("removeTestCase").style.display = "none";
      }

      resetTestData();
      removeLastTestCase();
    }
  }

  const onSubmit = (e) => {
    e.preventDefault();
    // For the first test case and the last one
    if (testData.input.length > 0 && testData.output.length > 0)
      testcases.push(testData);
    if (testcases.length === 0) {
      toast.error("At least one test case is required");
      return;
    }

    const testdata = {
      title,
      statement,
      testcases,
      constraints,
    };
    console.log(testdata)
    dispatch(createProblem(testdata));
    navigate("/problems");
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading">
        <h1>
          <FaCode /> Add Problem
        </h1>
        <p>Add the details of the new problem</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={title}
              placeholder="Title"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="statement"
              name="statement"
              value={statement}
              placeholder="Enter problem statement"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="constraints"
              name="constraints"
              value={constraints}
              placeholder="Enter the constraints"
              onChange={onChange}
            />
          </div>
          <div className="form-group" id="testCases"></div>

          <ul id="new-problem-buttons">
            <li>
              <button
                type="button"
                // id="register"
                className="btn"
                onClick={AddTestCase}
              >
                Add testcase
              </button>
            </li>
            <li>
              <button
                type="button"
                id="removeTestCase"
                className="btn"
                style={{ display: "none" }}
                onClick={removeTestCase}
              >
                Remove last testcase
              </button>
            </li>
            <li>
              <button type="submit" className="btn">
                Create Problem
              </button>
            </li>
          </ul>
        </form>
      </section>
    </>
  );
}

export default ProblemForm;
