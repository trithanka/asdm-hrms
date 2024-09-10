import SignInPage from "../features/authentication/page";
import "../styles/authStyles.css";
import AshokStumb from "../assets/ashokstumb.png";

export default function Auth() {
  return (
    <>
      <header className="auth_header">
        <div className="logo_container">
          <img src={AshokStumb} alt="ASDM Logo" />
          <div>
            <h3>Assam Skill Development Mission</h3>
            <h6>Human Resource Management System</h6>
          </div>
        </div>
      </header>

      <SignInPage />

      <footer>
        Copyright ©All Rights Reserved - 2023 | Assam skill Development Mission
      </footer>
    </>
  );
}
