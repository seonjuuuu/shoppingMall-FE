import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { currencyFormat } from '../../../utils/number';
import styles from './OrderReceipt.module.scss';

const OrderReceipt = ({ cartList, totalPrice }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className={styles.receiptContainer}>
      <h3 className={styles.receiptTitle}>주문 내역</h3>
      <ul className={styles.receiptList}>
        {cartList.length > 0 &&
          cartList.map((item) => (
            <li key={item.productId}>
              <div className={styles.itemList}>
                <div>{item.productId.name}</div>
                <div>
                  ₩{currencyFormat(item.productId.discountPrice * item.qty)}
                </div>
              </div>
            </li>
          ))}
      </ul>
      <div className={styles.cartTotal}>
        <div>
          <strong>Total:</strong>
        </div>
        <div>
          <strong>₩ {currencyFormat(totalPrice)}</strong>
        </div>
      </div>
      {location.pathname.includes('/cart') && cartList.length > 0 && (
        <Button
          variant="dark"
          className="payment-button mt-4"
          onClick={() => navigate('/payment')}
        >
          결제 계속하기
        </Button>
      )}

      <div className={styles.infoText}>
        결제 단계에 도달하기 전까지는 정확한 가격과 배송료가 확정되지 않을 수
        있습니다. <br /> 모든 구매에 대해 30일 이내 반품이 가능하며, 일부 상품의
        경우 반품 수수료 또는 미수취 시 추가 배송 요금이 발생할 수 있습니다.
        <br />
        자세한 내용은 반품 및 환불 정책에서 확인해 주세요.
      </div>
    </div>
  );
};

export default OrderReceipt;
