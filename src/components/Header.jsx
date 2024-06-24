import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../slices/auth/authSlice";
import { getProblems } from "../slices/problem/problemSlice";
function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const showProfile = () => {
    navigate(`/${user.name}`);
  };

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">OrangeCode</Link>
      </div>
      <ul id="problem-button">
        <li>
          <Link
            to="/problems"
            onClick={() => {
              dispatch(getProblems());
            }}
          >
            <FaSignInAlt /> Problems
          </Link>
        </li>
      </ul>

      <ul id="user-buttons">
        {user ? (
          <>
            <li>
              <button className="btn" onClick={showProfile}>
                <FaUser /> {user.name}
              </button>
            </li>
            <li>
              <button className="btn" onClick={onLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <button className="btn" onClick={()=>{navigate('/login')}}>
                <FaSignInAlt /> Login
              </button>
            </li>
            <li>
              <button className="btn" onClick={()=>{navigate('/register')}}>
                <FaUser /> Sign Up
              </button>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
