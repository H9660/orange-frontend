import { useDispatch, useSelector } from "react-redux";
import { deleteProblem } from "../slices/problem/problemSlice";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { useState, useEffect } from "react";

function ProblemBar({ problem }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);

  const showProblem = () => navigate(`/problems/${problem.title}`);

  const handleDeleteConfirm = () => {
    dispatch(deleteProblem(problem.title));
    setShowModal(false);
  };
  useEffect(() => {
    if (showModal) {
      // prevent background scroll and keep layout stable
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${
        window.innerWidth - document.documentElement.clientWidth
      }px`;
    } else {
      // restore scroll
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      // cleanup on unmount
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [showModal]);

  return (
    <>
      <div className="problem-bar">
        {/* Problem Info */}
        <div className="problem-info" onClick={showProblem}>
          <h2>{problem.title}</h2>
        </div>

        {/* Admin Actions */}
        {user?.isAdmin && (
          <div className="problem-actions">
            <span
              className={`difficulty ${
                problem.difficulty?.toLowerCase() || "easy"
              }`}
            >
              {problem.difficulty || "Easy"}
            </span>

            <button
              className="edit-btn"
              onClick={() => {
                console.log(problem.title);
                navigate(`/edit/${problem.title}`);
              }}
            >
              <FaEdit />
            </button>

            <button className="delete-btn" onClick={() => setShowModal(true)}>
              <FaTrashAlt />
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure you want to delete this problem?</h3>
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleDeleteConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProblemBar;
