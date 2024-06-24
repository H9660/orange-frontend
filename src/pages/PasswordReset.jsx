import { useState, useEffect } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword, reset } from "../slices/auth/authSlice";
import Spinner from "../components/Spinner";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isError, isLoading, message } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(reset());
  }, [isError, message, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const resetData = {
      email: email,
      password: password,
    };
    localStorage.removeItem("user");
    dispatch(resetPassword(resetData));
    navigate("/login");
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading">
        <h1>
          <FaSyncAlt /> Password Reset
        </h1>
        <p></p>
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
              placeholder="Enter new password"
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <button type="submit" className="password-reset">
              Reset Password
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Login;
