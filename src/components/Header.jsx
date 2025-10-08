import { useState } from "react";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../slices/auth/authSlice";
import { getProblems } from "../slices/problem/problemSlice";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const showProfile = () => {
    setMobileMenuOpen(false);
    navigate(`/${user.name}`);
  };

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    setMobileMenuOpen(false);
    navigate("/");
  };

  const fetchProblems = () => {
    dispatch(getProblems());
    setMobileMenuOpen(false);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">OrangeCode</Link>
      </div>

      <button
        className="hamburger"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <nav className={`nav ${mobileMenuOpen ? "open" : ""}`}>
        <ul className="nav-links">
          <li>
            <Link to="/problems" onClick={fetchProblems}>
              <FaSignInAlt /> Problems
            </Link>
          </li>
        </ul>

        <ul className="user-actions">
          {user ? (
            <>
              <li>
                <button className="mobile-btn" onClick={showProfile}>
                  <FaUser /> {user.name}
                </button>
              </li>
              <li>
                <button className="mobile-btn" onClick={onLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button
                  className="mobile-btn"
                  onClick={() => {
                    navigate("/login");
                    closeMenu();
                  }}
                >
                  <FaSignInAlt /> Login
                </button>
              </li>
              <li>
                <button
                  className="mobile-btn"
                  onClick={() => {
                    navigate("/register");
                    closeMenu();
                  }}
                >
                  <FaUser /> Sign Up
                </button>
              </li>
            </>
          )}
        </ul>

        {/* Optional overlay to close menu by clicking outside */}
        <div
          className={`overlay ${mobileMenuOpen ? "show" : ""}`}
          onClick={closeMenu}
        />
      </nav>
    </header>
  );
}

export default Header;
