import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProblemBar from "../components/ProblemBar";
import Spinner from "../components/Spinner";
import { getProblems } from "../slices/problem/problemSlice";
function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  // console.log(user);
  // This useSelector is used for js but the useapp slector is used for TS
  const { problems, isLoading, isError, message } = useSelector(
    (state) => state.problems // This is a reducer
  );
  console.log(problems)
  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    dispatch(getProblems());
  }, [isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }
  
  const createProblem = (e)=>{
    navigate('/addProblem')
  }
  return (
    <>
      <section className="heading">
        <h1>Problems</h1>
      </section>

      <section className="content">
        {
          <>
            {problems.map((problem) => (
              <ProblemBar problem={problem} />
            ))}
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
