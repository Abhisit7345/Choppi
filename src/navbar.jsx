import logo from "./assets/logo.png";
import profile from "./assets/profile.png";
import "./css/navbar.css";
import { useAuth } from "./contexts/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTotalChatNumber } from "./getTotalChatNumber";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { currentUser } = useAuth();
  const { signout } = useAuth();
  const [totalChatNum, setTotalChatNum] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleSignOut = () => {
    signout();
  };

  let getChatNum = {};
  if (currentUser != null) {
    getChatNum = getTotalChatNumber(currentUser.uid);
  }

  let num = 0;
  for (const item in getChatNum) {
    num = num + getChatNum[item];
  }
  useEffect(() => {
    setTotalChatNum(num);
  }, [num]);
  return (
    <div className="navbar">
      <ul className="navbar-list">
        <Link to="/" style={{ textDecoreation: "none" }}>
          <li>
            <img className="logo nav-static" src={logo} alt="" />
            <span className="nav-text"></span>
          </li>
        </Link>

        <Link to="/profile" style={{ textDecoration: "none", color:"inherit" }}>
          <li className="li-item">
            <span className="nav-icon">
            <span className="material-symbols-outlined" style={{fontSize:"70px", color:"inherit"}}>
account_circle
</span>
            </span>
            <span className="nav-text">Profile</span>
          </li>
        </Link>

        <Link to="/mainchat" style={{ textDecoration: "none", color:"inherit" }}>
          <li className="li-item">
            <span className="nav-icon chat">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "60px" }}
              >
                chat
              </span>
              <span className="notification-badge">{totalChatNum}</span>
            </span>

            <span className="nav-text">Notifications</span>
          </li>
        </Link>
        <Link to="/mystore" style={{ textDecoration: "none", color:"inherit" }}>
          {" "}
          <li className="li-item">
            <span className="nav-icon">
              <span
                style={{ fontSize: "70px" }}
                className="material-symbols-outlined"
              >
                storefront
              </span>
            </span>
            <span className="nav-text">My Store</span>
          </li>
        </Link>

        <li>
          <span className="nav-icon">
            <Link to="/signin" style={{ textDecoration: "none" }}>
              <span className="signout nav-icon" onClick={handleSignOut}>
                Sign Out
              </span>
            </Link>
          </span>
          <span className="nav-text"></span>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
