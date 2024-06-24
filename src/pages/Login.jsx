import { useState, useEffect } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, googleLogin, reset } from "../slices/auth/authSlice";
import Spinner from "../components/Spinner";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, isResetSuccessful, message } =
    useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isResetSuccessful) {
      toast.success("Password reset successful. Please log in.");
    }
    if (isSuccess || user) {
      navigate("/");
    }

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

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const resetPassword = (e) => {
    navigate(`/resetpassword`);
  };

  const googlelogin = (e) => {
    dispatch(googleLogin());
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading">
        <h1>
          <FaSignInAlt /> Login
        </h1>
        <p>Login and start solving problems</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={onChange}
            />
          </div>

          <ul id="login-buttons">
            <li>
              <button
                type="submit"
                className="btn"
              >
                Login
              </button>
            </li>
            <li>
              <button className="btn" onClick={googlelogin}>
                Login with Google
              </button>
            </li>
            <li>
              <button
                type="button"
                className="btn"
                onClick={resetPassword}
              >
                Forgot Password?
              </button>
            </li>
          </ul>
        </form>
      </section>
    </>
  );
}

export default Login;
