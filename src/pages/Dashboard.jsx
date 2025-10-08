import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProblemBar from "../components/ProblemBar";
import Spinner from "../components/Spinner";
import { getProblems } from "../slices/problem/problemSlice";
import { toast } from "react-toastify";
import { FaExclamationCircle, FaPlus } from "react-icons/fa";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { problems, isLoading, isError, message } = useSelector(
    (state) => state.problems
  );

  useEffect(() => {
    if (isError) toast.error(message);
    dispatch(getProblems());
  }, [isError, message, dispatch]);

  const createProblem = () => navigate("/addProblem");

  if (isLoading) return <Spinner />;

  return (
    <div className="dashboard-container">
      {/* Heading + Admin Add Button */}
      <section className="dashboard-heading">
        <h1>Problems</h1>
        {user?.isAdmin && (
          <button className="add-btn" onClick={createProblem}>
            <FaPlus /> Add Problem
          </button>
        )}
      </section>

      {/* Problem List or Empty State */}
      <section className="dashboard-content">
        {Array.isArray(problems) && problems.length > 0 ? (
          problems.map((problem) => (
            <ProblemBar key={problem.id} problem={problem} />
          ))
        ) : (
          <div className="empty-state">
            <FaExclamationCircle size={100} className="empty-icon" />
            <h2>{isError ? "Something went wrong!" : "No problems found"}</h2>
            {isError && <p>{message}</p>}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
