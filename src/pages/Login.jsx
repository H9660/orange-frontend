import { useState, useEffect, useRef } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../slices/auth/authSlice";
import Spinner from "../components/Spinner";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myRef = useRef(null);
  const { user, isLoading, isError, isSuccess, isResetSuccessful, message } =
    useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) toast.error(message);
    if (isResetSuccessful)
      toast.success("Password reset successful. Please log in.");
    if (isSuccess || user) navigate("/");
    dispatch(reset());
  }, [
    isResetSuccessful,
    user,
    isError,
    isSuccess,
    message,
    navigate,
    dispatch,
  ]);

  useEffect(() => myRef.current.focus(), []);

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const resetPassword = () => navigate(`/resetpassword`);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="login-container">
      <section className="login-heading">
        <h1>
          <FaSignInAlt /> Login
        </h1>
        <p>Login and start solving problems</p>
      </section>

      <section className="login-form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={email}
              ref={myRef}
              placeholder="Enter your email"
              className="form-control"
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter password"
              className="form-control"
              onChange={onChange}
              required
            />
          </div>

          <ul className="login-buttons">
            <li>
              <button type="submit" className="btn primary-btn">
                Login
              </button>
            </li>
            <li>
              <button
                type="button"
                className="btn secondary-btn"
                onClick={resetPassword}
              >
                Forgot Password?
              </button>
            </li>
          </ul>
        </form>
      </section>
    </div>
  );
}

export default Login;
