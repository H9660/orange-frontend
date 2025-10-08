import { useSelector } from "react-redux";
import { FaClock, FaTrophy, FaBolt, FaHourglassEnd } from "react-icons/fa";

function Profile() {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <p>Loading...</p>;

  const stats = [
    {
      title: "Problems Solved",
      value: user.solvedProblems.length,
      icon: <FaTrophy />,
    },
    {
      title: "Problems Attempted",
      value: user.attemptedProblems?.length || 0,
      icon: <FaBolt />,
    },
    {
      title: "Fastest Solve",
      value: user.fastestSolve || "N/A",
      icon: <FaClock />,
    },
    {
      title: "Slowest Solve",
      value: user.slowestSolve || "N/A",
      icon: <FaHourglassEnd />,
    },
  ];

  return (
    <div className="profile-container">
      <section className="heading">
        <h1>{user.name}'s Profile</h1>
      </section>

      <section className="profile-stats">
        {stats.map((stat, idx) => (
          <div className="stat-card" key={idx}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <p>{stat.value}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Profile;
