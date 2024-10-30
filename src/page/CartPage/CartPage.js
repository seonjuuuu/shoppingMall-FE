import React from 'react';
import { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import CartProductCard from './component/CartProductCard';
import OrderReceipt from '../PaymentPage/component/OrderReceipt';
import './style/cart.style.css';
import { getCartList } from '../../features/cart/cartSlice';
import styles from './CartPage.module.scss';
import LoadingSpinner from '../../common/component/LoadingSpinner';

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartList, totalPrice, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCartList());
  }, []);
  return (
    <Container className={styles.cartContainer}>
      <Row className={styles.cartPage}>
        <Col xs={12} md={7}>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {cartList.length > 0 ? (
                cartList.map((item, index) => (
                  <CartProductCard
                    item={item}
                    key={`${item.productId._id || item._id}-${index}`}
                  />
                ))
              ) : (
                <div className={styles.noCart}>
                  <img
                    src="/image/no-cart.svg"
                    alt="no-cart"
                    className={styles.noCartImage}
                  />
                  <h2 className={styles.noCartText}>카트가 비어있습니다</h2>
                  <div>상품을 담아주세요</div>
                </div>
              )}
            </>
          )}
        </Col>
        <Col xs={12} md={5}>
          <OrderReceipt cartList={cartList} totalPrice={totalPrice} />
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
