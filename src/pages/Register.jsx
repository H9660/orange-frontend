import { useState, useEffect } from "react";
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

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth // this is a reducer
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      // To navigate to the admin profile we can use this line after changing it a bit
      navigate("/");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    console.log(e.target.checked);
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleIsAdmin = (e) => {
    setFormData({
      ...formData, // Keep all other fields unchanged
      isAdmin: e.target.checked, // Toggle the value of isAdmin
    });
  };

  const onSubmit = (e) => {
    console.log(e.target); // This is the triggerrer of the event
    // This is done to prevent automatically page reloading
    e.preventDefault();
    // The use case of this is that if the user inputs some wrong data like unmatched passwords then this will prevent the page from reloading thereby saving other entered data
    console.log(isAdmin);
    if (password !== password2) {
      toast.error("Passwords do not match");
    } else {
      const userData = {
        name,
        email,
        password,
        isAdmin,
      };

      dispatch(register(userData)); // This is sending the dispatch actions to the redux store
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading">
        <h1>
          <FaUser /> Register
        </h1>
        <p>Please create an account</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              placeholder="Enter your name"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              checked={formData.isAdmin}
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
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password2"
              name="password2"
              value={password2}
              placeholder="Confirm password"
              onChange={onChange}
            />
          </div>
          
          <ul id="register-buttons">
            <li>
              <input
                type="checkbox"
                id="adminCheckbox"
                name="isAdmin"
                onChange={toggleIsAdmin}
              ></input>
              <label id="AdminText" for="adminCheckbox">
                Admin?
              </label>
            </li>
             <li>
              <button type="button" className="btn" onClick={()=>{navigate("/login")}}>
                Sign In
              </button>
            </li>
            <li>
              <button type="submit" className="btn">
                Register
              </button>
            </li>
          </ul>
        </form>
      </section>
    </>
  );
}

export default Register;
