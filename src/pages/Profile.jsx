import { useSelector } from "react-redux";
function Profile() {
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  return (
    <>
      <section className="heading">
        <h1>{user.name}</h1>
      </section>

      <section className="content">
        <>
          <div className="bar">
            <div className="bar-content">
              Problems solved: {user.solvedProblems.length}
            </div>
          </div>
          <div className="bar">
            <div className="bar-content">
              Problems attempted: {user.solvedProblems.length}
            </div>
          </div>
          <div className="bar">
            <div className="bar-content">
              Fastest solve: {user.solvedProblems.length}
            </div>
          </div>
          <div className="bar">
            <div className="bar-content">
              Slowest solve: {user.solvedProblems.length}
            </div>
          </div>
        </>
      </section>
    </>
  );
}

export default Profile;
