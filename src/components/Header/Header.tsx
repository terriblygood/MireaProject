import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { filterProducts } from "../../store/slices/productsSlice";
import { RootState } from "../../store/store";
import styles from "./Header.module.scss";
import profileIcon from "../../assets/profile-icon.svg";
import cartIcon from "../../assets/cart-icon.svg";
import Button from "../Button/Button";
import Account from "../../pages/Account/Account";

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const uniqueItemCount = cartItems.length;
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(filterProducts(value));
  };
  const handleResetSearcher = () => {
    setSearchTerm('');
  }
  
  const handleLogoClick = () => {
    navigate("/");
    window.location.reload(); // Обновление страницы при клике на логотип
  };

  const [lk, setlk] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={handleLogoClick}>
        Веб-Ларёк
      </div>
      <input
        type="text"
        placeholder="Поиск товаров..."
        value={searchTerm}
        onChange={handleSearchChange}
        className={styles.searchInput}
      />
      <div className={styles.icons}>
        <Button color="blue" onClick={() => setlk((prev) => !prev)}>ЛК</Button>
        <img
          src={profileIcon}
          alt="Profile"
          className={styles.icon}
          onClick={() => navigate("/profile")}
        />
        <div
          className={styles.cartIconWrapper}
          onClick={() => navigate("/cart")}
        >
          <img src={cartIcon} alt="Cart" className={styles.icon} />
          {uniqueItemCount > 0 && (
            <div className={styles.cartBadge}>{uniqueItemCount}</div>
          )}
        </div>
        <div
          className={styles.ordersLink}
          onClick={() => navigate("/orders")}
        >
          Мои заказы
        </div>
      </div>
      <Account isOpen={lk} setlk={setlk} />
    </header>
  );
};

export default Header;