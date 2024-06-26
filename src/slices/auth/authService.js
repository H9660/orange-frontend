import axios from "axios";

const USER_URL = process.env.REACT_APP_BACKEND_URL + "/api/users/";
const STAT_URL = process.env.REACT_APP_BACKEND_URL + "/api/stats/";
const GOOGLE_AUTH = process.env.REACT_APP_BACKEND_URL + "/auth";
// Register user
const register = async (userData) => {
  // Here at the time of registration we need to create a stat object as well for the user
  const response = await axios.post(USER_URL, userData);
  console.log(response);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  const statData = {
    userId: response.data._id,
    solved: 0,
    attempted: 0,
    fastestSolve: 0,
    slowestSolve: 0,
  };
  const stats = await axios.post(STAT_URL, statData);
  console.log(stats);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(USER_URL + "login", userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

const googleLogin = async () => {
  try {
    const response = await axios.get(GOOGLE_AUTH)
    
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    console.error("Error occurred:", error);
    // Handle the error gracefully
    return null;
  }
};

const resetPassword = async (resetData) => {
  const response = await axios.post(USER_URL + "resetpassword", resetData);
  console.log(response.data)
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

const updateSolvedProblems = async (updatedData) => {
  const response = await axios.put(USER_URL, updatedData);
  console.log(response.data)
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};
// Logout user
const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  logout,
  login,
  resetPassword,
  googleLogin,
  updateSolvedProblems
};

export default authService;
