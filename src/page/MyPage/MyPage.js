import React from 'react';
import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import OrderStatusCard from './component/OrderStatusCard';
import './style/orderStatus.style.css';
import { getOrder } from '../../features/order/orderSlice';
import styles from './MyPage.module.scss';
import LoadingSpinner from '../../common/component/LoadingSpinner';

const MyPage = () => {
  const dispatch = useDispatch();
  const { orderList, loading } = useSelector((state) => state.order);
  useEffect(() => {
    dispatch(getOrder());
  }, [dispatch]);

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  if (orderList?.length === 0) {
    return (
      <Container className={styles.noOrderBox}>
        <img
          src="/image/no-process.svg"
          alt="no-data"
          className={styles.noOrderImage}
        />
        <div className={styles.noOrderText}>진행중인 주문이 없습니다</div>
      </Container>
    );
  }
  return (
    <Container className="status-card-container">
      {orderList.map((item) => (
        <OrderStatusCard
          orderItem={item}
          className="status-card-container"
          key={item._id}
        />
      ))}
    </Container>
  );
};

export default MyPage;
