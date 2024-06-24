import axios from "axios";

const STAT_URL = "/api/stats/";

const getStats = async (userData) => {
  // Extracting the user value from userData
  console.log(userData);
  const response = await axios.get(STAT_URL + `${userData._id}`);
  console.log(response);
  return response.data;
};

// The stats would be created when ever a user is created
const updateStats = async (userData) => {
  const response = await axios.put(STAT_URL + `?userId=${userData._id}`, userData);
  return response.data;
};

const statService = {
  getStats,
  updateStats,
};

export default statService;
