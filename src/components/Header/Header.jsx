import React, { useState, useEffect, useContext } from "react";
import styles from "./Header.module.css";
import CNMLogo from "../../assets/CNMLogo-NoBG.png";
import LoginRegisterModal from "../loginRegisterModal/LoginRegisterModal";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { CatererContext } from "../../CatererContext";
import { toastMessage } from "../../../utility";
import find from "../../assets/images/find.png";
import booking from "../../assets/images/booking1.png";
import profile from "../../assets/images/profile.jpg";
import logout from "../../assets/images/logout.jpg";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [isLoggedName, setIsLoggedName] = useState(false);
  const { isCaterer, setIsCaterer, catererId, setCatererId } =
    useContext(CatererContext);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsLoggedName(true);
      if (user.firstName) {
        setFirstName(user.firstName);
      }
      if (user.role.id == 3) {
        setIsCaterer(true);
      }
    }
  }, []);

  useEffect(() => {
    const storedFirstName = localStorage.getItem("firstName");
    if (storedFirstName && isLoggedName) {
      setFirstName(storedFirstName);
      setIsLoggedName(true);
    }

    const handleClick = (e) => {
      const isDropDownButton = e.target.matches("[data-dropdown-button]");
      if (!isDropDownButton && e.target.closest("[data-dropdown]") != null)
        return;

      let currentDropdown;

      if (isDropDownButton) {
        currentDropdown = e.target.closest("[data-dropdown]");
        currentDropdown.classList.toggle(styles.active);
      }

      document
        .querySelectorAll(`[data-dropdown].${styles.active}`)
        .forEach((dropdown) => {
          if (dropdown === currentDropdown) return;
          dropdown.classList.remove(styles.active);
        });
    };

    document.addEventListener("click", handleClick);

    const handleStorageChange = (event) => {
      if (event.key === "firstName") {
        if (event.newValue) {
          setFirstName(event.newValue);
          setIsLoggedName(true);
        } else {
          setFirstName("");
          setIsLoggedName(false);
          navigate("/");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate, setIsCaterer]);
  if (catererId == "") {
    setCatererId(JSON.parse(localStorage.getItem("catererId")));
  }
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSignout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("firstName");
    localStorage.removeItem("dishDetails");
    localStorage.removeItem("catererId");
    localStorage.removeItem("catererData");
    localStorage.removeItem("cartData");
    setIsCaterer(false);
    setUser({});
    setFirstName("");
    setIsLoggedName(false);
    navigate("/");
    toastMessage("Signed Out!");
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          {/* <div className={styles.imgContainer}>
            <img className={styles.logoImg} src={CNMLogo} alt="CNM" />
          </div> */}
          <h1 className={styles.logoText} onClick={() => navigate("/")}>
            <img
              className={styles.logoImg}
              src={CNMLogo}
              alt="caterersnearme logo"
            />
            CATERERSNEARME
          </h1>
          <h5 className={styles.logoNumber}>📞+919321291563</h5>
        </div>
        <div className={styles.hamburger}>
          <div className={styles.dropdown} data-dropdown>
            <button className={styles.hamburgerBtn} data-dropdown-button>
              <i className="fa-solid fa-bars"></i>
            </button>
            <div className={styles.dropdownMenu}>
              <ul className={styles.navLinks1}>
                {!isCaterer && (
                  <li
                    className={styles.findCaterers}
                    onClick={() => navigate("/caterer")}
                  >
                    <img className={styles.findImg} src={find} />
                    Find Caterers
                  </li>
                )}
                {isLoggedName && (
                  <li
                    className={styles.booking}
                    onClick={() => navigate("/my-orders")}
                  >
                    <img className={styles.findImg} src={booking} />
                    Bookings
                  </li>
                )}
                {!isLoggedName && (
                  <li className={styles.booking} onClick={openModal}>
                    <img className={styles.findImg} src={profile} />
                    <span>Login/Register</span>
                  </li>
                )}
                {isLoggedName && (
                  <li className={styles.booking}>
                    <img className={styles.findImg} src={profile} />
                    <span>{firstName}</span>
                  </li>
                )}
                {isLoggedName && (
                  <li className={styles.booking} onClick={handleSignout}>
                    <img className={styles.findImg} src={logout} />
                    <span>SignOut</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <ul className={`${styles.navLinks2}`}>
          {!isCaterer && (
            <li
              className={styles.findCaterers}
              onClick={() => navigate("caterer")}
            >
              <img className={styles.findImg} src={find} />
              <span>Find Caterers</span>
            </li>
          )}
          {isLoggedName && (
            <li
              className={styles.booking}
              onClick={() => navigate("/my-orders")}
            >
              <img className={styles.findImg} src={booking} />
              Bookings
            </li>
          )}
          {/* <li className={styles.navContact}>+91 123456789</li> */}
          {!isLoggedName && (
            <li className={styles.booking} onClick={openModal}>
              <img className={styles.findImg} src={profile} />
              <span>Login/Register</span>
            </li>
          )}
          {isLoggedName && (
            <li className={styles.booking}>
              <img className={styles.findImg} src={profile} />
              <span>{firstName}</span>
            </li>
          )}
          {isLoggedName && (
            <li className={styles.booking} onClick={handleSignout}>
              <img className={styles.findImg} src={logout} />
              <span>SignOut</span>
            </li>
          )}
        </ul>
      </nav>
      <LoginRegisterModal
        firstName={firstName}
        setFirstName={(name) => {
          setFirstName(name);
          localStorage.setItem("firstName", name);
        }}
        setIsLoggedName={setIsLoggedName}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default Header;
