import styles from './Footer.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faInstagram,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.customerSupport}>
          <h4>고객 지원</h4>
          <p>FAQ</p>
          <p>배송 및 반품 정책</p>
          <p>이용 약관</p>
          <p>개인정보 보호 정책</p>
        </div>

        <div className={styles.companyInfo}>
          <h4>회사 정보</h4>
          <p>FIT PICK</p>
          <p>서울특별시 강남구 테헤란로</p>
          <p>전화: 02-1234-5678</p>
          <p>이메일: moonsun9116@gmail.com</p>
        </div>

        <div className={styles.socialMedia}>
          <h4>팔로우하기</h4>
          <div className={styles.socialIcons}>
            <FontAwesomeIcon icon={faFacebook} />
            <FontAwesomeIcon icon={faInstagram} />
            <FontAwesomeIcon icon={faTwitter} />
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© 2024 FITPICK Corp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
