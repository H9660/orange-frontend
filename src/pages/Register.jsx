import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { register, reset } from "../slices/auth/authSlice";
import Spinner from "../components/Spinner";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    isAdmin: false,
  });

  const { name, email, password, password2, isAdmin } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myRef = useRef(null);
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess || user) navigate("/");
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  useEffect(() => myRef.current.focus(), []);

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleIsAdmin = (e) =>
    setFormData((prev) => ({ ...prev, isAdmin: e.target.checked }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Passwords do not match");
      return;
    }

    dispatch(register({ name, email, password, isAdmin }));
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="register-container">
      <section className="register-heading">
        <h1>
          <FaUser /> Register
        </h1>
        <p>Please create an account</p>
      </section>

      <section className="register-form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={name}
              ref={myRef}
              placeholder="Enter your name"
              className="form-control"
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={email}
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

          <div className="form-group">
            <input
              type="password"
              name="password2"
              value={password2}
              placeholder="Confirm password"
              className="form-control"
              onChange={onChange}
              required
            />
          </div>

          <div className="role-selector">
            <label
              className={`role-btn ${formData.isAdmin ? "" : "active"}`}
              onClick={() => setFormData({ ...formData, isAdmin: false })}
            >
              User
            </label>
            <label
              className={`role-btn ${formData.isAdmin ? "active" : ""}`}
              onClick={() => setFormData({ ...formData, isAdmin: true })}
            >
              Admin
            </label>
          </div>

          <ul className="register-buttons">
            <li>
              <button
                type="button"
                className="btn secondary-btn"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </li>
            <li>
              <button type="submit" className="btn primary-btn">
                Register
              </button>
            </li>
          </ul>
        </form>
      </section>
    </div>
  );
}

export default Register;
