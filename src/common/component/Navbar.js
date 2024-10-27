import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import {
  faBars,
  faSearch,
  faShoppingCart,
  faShippingFast,
} from '@fortawesome/free-solid-svg-icons';

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/user/userSlice';
import styles from './Navbar.module.scss';

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const { cartItemCount } = useSelector((state) => state.cart);
  const isMobile = window.navigator.userAgent.indexOf('Mobile') !== -1;
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const hideMenu = ['/login', '/register'].includes(location.pathname);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);

  const onCheckEnter = (event) => {
    if (event.key === 'Enter') {
      navigate(event.target.value === '' ? '/' : `?name=${event.target.value}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
  };

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

  return (
    <div>
      <div
        className={`${styles.overlay} ${menuOpen ? styles.active : ''}`}
        onClick={closeMenu}
      ></div>
      <div
        className={styles.sideMenu}
        style={{ width: menuOpen ? '250px' : '0' }}
      >
        <div className={styles.sideLogo}>
          <Link to="/">
            <img width={130} src="/image/logo.png" alt="logo.png" />
          </Link>
        </div>
        <button className={styles.closeBtn} onClick={closeMenu}>
          &times;
        </button>
        <div className={styles.sideMenuList}>
          {menuList.map((menu, index) => (
            <button key={index}>{menu}</button>
          ))}
        </div>

        <div className={styles.sideMenuBottom}>
          {!user && <button onClick={() => navigate('/login')}>로그인</button>}
          {user && (
            <>
              {user.level === 'admin' && (
                <button onClick={() => navigate('/admin')}>관리자 계정</button>
              )}
              <button onClick={handleLogout}>로그아웃</button>
            </>
          )}
        </div>
      </div>

      <div className={styles.navHeader}>
        <div
          className={`${styles.burgerMenu} ${styles.hide}`}
          onClick={toggleMenu}
        >
          <FontAwesomeIcon icon={faBars} />
        </div>
        <div className={styles.displayFlex}>
          <div
            className={`${styles.searchContainer} ${showSearchBox ? styles.expanded : ''}`}
          >
            <FontAwesomeIcon
              icon={faSearch}
              onClick={() => setShowSearchBox(!showSearchBox)}
            />
            {showSearchBox && (
              <input
                type="text"
                placeholder="제품검색"
                onKeyPress={onCheckEnter}
                className={styles.searchInput}
              />
            )}
          </div>

          <div
            onClick={() => navigate('/cart')}
            className={`${styles.navIcon}`}
          >
            <FontAwesomeIcon icon={faShoppingCart} />
            <span className={styles.cartNum}>{cartItemCount || 0}</span>
          </div>
          <div
            onClick={() => navigate('/account/purchase')}
            className={styles.navIcon}
          >
            <FontAwesomeIcon icon={faShippingFast} />
          </div>
          {user ? (
            <div
              className={`${styles.navIcon} ${styles.navItem}`}
              onClick={toggleProfileMenu}
            >
              <FontAwesomeIcon icon={faUser} />
              <span className={styles.navName}>{user.name}</span>

              {profileMenuOpen && (
                <div className={styles.profileMenu} ref={profileMenuRef}>
                  <div className={styles.menuItem} onClick={handleLogout}>
                    <span className={styles.itemName}>로그아웃</span>
                  </div>

                  {user && user.level === 'admin' && (
                    <div className={styles.menuItem}>
                      <Link
                        to="/admin/product?page=1"
                        className={styles.linkArea}
                      >
                        <span className={styles.itemName}>관리자 페이지</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => navigate('/login')}
              className={`${styles.navIcon} ${styles.navItem}`}
            >
              <FontAwesomeIcon icon={faUser} />
              {!isMobile && <span className={styles.navName}>로그인</span>}
            </div>
          )}
        </div>
      </div>

      <Link to="/" className={styles.navLogo}>
        <img width={200} src="/image/logo.png" alt="logo.png" />
      </Link>
      {!hideMenu && (
        <div className={`${styles.mobileSearch} ${styles.expanded}`}>
          <FontAwesomeIcon
            icon={faSearch}
            onClick={() => setShowSearchBox(!showSearchBox)}
          />
          <input
            type="text"
            placeholder="제품검색"
            onKeyPress={onCheckEnter}
            className={styles.searchInput}
          />
        </div>
      )}
      {!hideMenu && (
        <div className={styles.navMenuArea}>
          <ul className={styles.menu}>
            {menuList.map((menu, index) => (
              <li key={index}>
                <a href="#">{menu}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
