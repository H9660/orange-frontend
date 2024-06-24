// This page will have the problem bar
import { useDispatch, useSelector } from "react-redux";
import { deleteProblem } from "../slices/problem/problemSlice";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
function ProblemBar({ problem }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const showProblemContext = () => {
    navigate(`/problems/${problem.title}`);
  };
  return (
    <>
      <div className="bar">
        <h1 onClick={showProblemContext}>{problem.title}</h1>
        <ul>
          <div>
            <h1>Easy</h1>
          </div>
          {user && user.isAdmin === true && (
            <>
              <li>
                <button
                  onClick={() => {
                    dispatch(deleteProblem(problem.title));
                  }}
                  className="delete-button"
                >
                  <FaEdit style={{ width: "30px", height: "30px" }} />
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    dispatch(deleteProblem(problem.title));
                  }}
                  className="delete-button"
                >
                  <FaTrashAlt style={{ width: "30px", height: "30px" }} />
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}

export default ProblemBar;
