import React, { useState } from 'react';
import { Offcanvas, Navbar, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.scss';

const Sidebar = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleSelectMenu = (url) => {
    setShow(false);
    navigate(url);
  };

  const NavbarContent = () => {
    return (
      <div>
        <Link to="/">
          <img width={200} src="/image/logo.png" alt="logo.png" />
        </Link>
        <div className={styles.sidebarItem}>Admin Account</div>
        <ul className={styles.sidebarArea}>
          <li
            className={styles.sidebarItem}
            onClick={() => handleSelectMenu('/admin/product?page=1')}
          >
            product
          </li>
          <li
            className={styles.sidebarItem}
            onClick={() => handleSelectMenu('/admin/order?page=1')}
          >
            order
          </li>
        </ul>
      </div>
    );
  };

  return (
    <>
      <div className={styles.sidebarToggle}>{NavbarContent()}</div>

      <Navbar bg="light" expand={false} className={styles.mobileSidebarToggle}>
        <Container fluid>
          <img width={150} src="/image/logo.png" alt="logo.png" />
          <Navbar.Brand href="#"></Navbar.Brand>
          <Navbar.Toggle
            aria-controls="offcanvasNavbar"
            onClick={() => setShow(true)}
          />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
            className={styles.sidebar}
            show={show}
            onHide={() => setShow(false)}
          >
            <Offcanvas.Header closeButton></Offcanvas.Header>
            <Offcanvas.Body>{NavbarContent()}</Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default Sidebar;
