import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import {
  faBars,
  faBox,
  faSearch,
  faShoppingBag,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/user/userSlice';
import styles from './Navbar.module.scss';

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const { cartItemCount } = useSelector((state) => state.cart);
  const isMobile = window.navigator.userAgent.indexOf('Mobile') !== -1;
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [width, setWidth] = useState(0);
  const menuList = [
    '여성',
    'Divided',
    '남성',
    '신생아/유아',
    '아동',
    'H&M HOME',
    'Sale',
    '지속가능성',
  ];
  const navigate = useNavigate();

  const onCheckEnter = (event) => {
    if (event.key === 'Enter') {
      navigate(event.target.value === '' ? '/' : `?name=${event.target.value}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      {showSearchBox && (
        <div
          className={`${styles.displaySpaceBetween} ${styles.mobileSearchBox}`}
        >
          <div className={`${styles.search} ${styles.displaySpaceBetween} `}>
            <div>
              <FontAwesomeIcon className={styles.searchIcon} icon={faSearch} />
              <input
                type="text"
                placeholder="제품검색"
                onKeyPress={onCheckEnter}
              />
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => setShowSearchBox(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
      <div className={styles.sideMenu} style={{ width }}>
        <button className={styles.closeBtn} onClick={() => setWidth(0)}>
          &times;
        </button>
        <div className={styles.sideMenuList} id="menu-list">
          {menuList.map((menu, index) => (
            <button key={index}>{menu}</button>
          ))}
        </div>
      </div>
      <div className={styles.navHeader}>
        <div className={`${styles.burgerMenu} ${styles.hide}`}>
          <FontAwesomeIcon icon={faBars} onClick={() => setWidth(250)} />
        </div>
        <div>
          <div className={styles.displayFlex}>
            {user ? (
              <div onClick={handleLogout} className={styles.navIcon}>
                <FontAwesomeIcon icon={faUser} />
                {!isMobile && <span>로그아웃</span>}
              </div>
            ) : (
              <div
                onClick={() => navigate('/login')}
                className={styles.navIcon}
              >
                <FontAwesomeIcon icon={faUser} />
                {!isMobile && <span>로그인</span>}
              </div>
            )}
            <div onClick={() => navigate('/cart')} className={styles.navIcon}>
              <FontAwesomeIcon icon={faShoppingBag} />
              {!isMobile && (
                <span
                  className={styles.navName}
                >{`쇼핑백(${cartItemCount || 0})`}</span>
              )}
            </div>
            <div
              onClick={() => navigate('/account/purchase')}
              className={styles.navIcon}
            >
              <FontAwesomeIcon icon={faBox} />
              {!isMobile && <span className={styles.navName}>내 주문</span>}
            </div>
            {isMobile && (
              <div
                className={styles.navIcon}
                onClick={() => setShowSearchBox(true)}
              >
                <FontAwesomeIcon icon={faSearch} />
              </div>
            )}
            {user && user.level === 'admin' && (
              <div className={styles.navIcon}>
                <FontAwesomeIcon icon={faUserShield} />
                <Link to="/admin/product?page=1" className={styles.linkArea}>
                  {!isMobile && (
                    <span className={styles.navName}>관리자 페이지</span>
                  )}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.navLogo}>
        <Link to="/">
          <img width={200} src="/image/logo.png" alt="logo.png" />
        </Link>
      </div>
      <div className={styles.navMenuArea}>
        <ul className={styles.menu}>
          {menuList.map((menu, index) => (
            <li key={index}>
              <a href="#">{menu}</a>
            </li>
          ))}
        </ul>
        {!isMobile && (
          <div className={`${styles.searchBox} ${styles.landingSearchBox}`}>
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="제품검색"
              onKeyPress={onCheckEnter}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
