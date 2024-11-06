import React from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./OrderCompletePage.module.scss";

const OrderCompletePage = () => {
  const { orderNum } = useSelector((state) => state.order);
  if (orderNum === "")
    return (
      <Container className={styles.confirmationPage}>
        <h2 className={styles.infoText}>주문 실패</h2>
        <div className={styles.infoTitle}>
          <img src="/image/no-data.png" width={200} alt="no-data" />
          주문에 실패하였습니다. <br/> 메인페이지로 돌아가세요
          <Link to={"/"} className={styles.orderBtn}>홈으로 이동 </Link>
        </div>
      </Container>
    );
  return (
    <Container className={styles.confirmationPage}>
      <img
        src="/image/greenCheck.png"
        width={100}
        className={styles.checkImage}
        alt="greenCheck.png"
      />
      <h2 className={styles.infoText}>결제 완료</h2>
      <div className={styles.infoTitle}>주문번호: {orderNum}</div>
      <div className={styles.infoTitle}>
        주문 확인은 내 메뉴에서 확인해주세요
        <div className="text-align-center">
          <Link to={"/account/purchase"} className={styles.orderBtn}>내 주문 바로가기</Link>
        </div>
      </div>
    </Container>
  );
};

export default OrderCompletePage;
