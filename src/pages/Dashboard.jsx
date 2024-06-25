import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProblemBar from "../components/ProblemBar";
import Spinner from "../components/Spinner";
import { getProblems } from "../slices/problem/problemSlice";
import { toast } from "react-toastify";
import { FaExclamationCircle } from "react-icons/fa";
function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  // console.log(user);
  // This useSelector is used for js but the useapp slector is used for TS
  const { problems, isLoading, isError, message } = useSelector(
    (state) => state.problems // This is a reducer
  );
  console.log(problems);
  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
    dispatch(getProblems());
  }, [isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  const createProblem = (e) => {
    navigate("/addProblem");
  };
  return (
    <>
      <section className="heading">
        <h1>Problems</h1>
      </section>

      <section className="content">
        {
          <>
            {Array.isArray(problems) && problems.length !== 0 ? (
              problems.map((problem) => (
                <ProblemBar key={problem.id} problem={problem} />
              ))
            ) : isError ? (
              (
                <>
                  <div id="not-found">
                    <FaExclamationCircle
                      id="exclaim"
                      size="120px"
                    ></FaExclamationCircle>
                  </div>
                </>
              )
            ): (
              <>
                <div id="not-found">
                  <FaExclamationCircle
                    id="exclaim"
                    size="120px"
                  ></FaExclamationCircle>
                </div>
                <div id="not-found">No problems found</div>
              </>
            )}
          </>
        }
      </section>

      {user && user.isAdmin === true && (
        <button className="add-btn" onClick={createProblem}>
          Add Problem
        </button>
      )}
    </>
  );
}

export default Dashboard;
