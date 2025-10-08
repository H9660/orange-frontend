import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL + "/api/problems/";
// Create new problem
const createProblem = async (problemData) => {
  const response = await axios.post(API_URL, problemData);
  return response.data;
};

export const getProblem = async (title) => {
  try {
    const response = await axios.get(API_URL + `${title}`);
    if (response.data) return response.data;
  } catch (error) {
    console.error("Error occurred:", error);
  }
};
// Get problems
const getProblems = async () => {
  try {
    const response = await axios.get(API_URL);
    if (response.data) return response.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Delete problem
const deleteProblem = async (title) => {
  const response = await axios.delete(API_URL + title);
  return response.data;
};

const updateProblem = async (title, updatedProblem) => {
  try {
    const response = await axios.patch(
      `${API_URL}update/${title}`,
      updatedProblem,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
        // withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating problem:", error);
    throw error.response?.data || error.message;
  }
};

const runCode = async (runData) => {
  try {
    const response = await axios.post(API_URL + "run", runData);
    return response.data.output;
  } catch (err) {
    console.log(err);
  }
};

const submitCode = async (submitData) => {
  try {
    const response = await axios.post(API_URL + "submit", submitData);
    return response.data.output;
  } catch (err) {
    console.log(err);
  }
};
const problemService = {
  createProblem,
  getProblem,
  getProblems,
  updateProblem,
  deleteProblem,
  runCode,
  submitCode,
};

export default problemService;
