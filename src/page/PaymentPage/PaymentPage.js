import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import OrderReceipt from './component/OrderReceipt';
import PaymentForm from './component/PaymentForm';
import './style/paymentPage.style.css';
import { cc_expires_format, formatPhoneNumber } from '../../utils/number';
import { createOrder } from '../../features/order/orderSlice';
import styles from './PaymentPage.module.scss';

const PaymentPage = () => {
  const dispatch = useDispatch();
  const { orderNum } = useSelector((state) => state.order);
  const [cardValue, setCardValue] = useState({
    cvc: '',
    expiry: '',
    focus: '',
    name: '',
    number: '',
  });
  const navigate = useNavigate();
  const [firstLoading, setFirstLoading] = useState(true);
  const [shipInfo, setShipInfo] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    address: '',
    city: '',
    zip: '',
  });
  const { cartList, totalPrice } = useSelector((state) => state.cart);
  useEffect(() => {
    // 오더번호를 받으면 어디로 갈까?
  }, [orderNum]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const { firstName, lastName, contact, address, city, zip } = shipInfo;
    dispatch(
      createOrder({
        totalPrice,
        shipTo: { address, city, zip },
        contact: { firstName, lastName, contact },
        orderList: cartList.map((item) => {
          return {
            productId: item.productId._id,
            price: item.productId.price,
            qty: item.qty,
            size: item.size,
          };
        }),
      })
    );
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    if (name === 'contact') {
      let newValue = formatPhoneNumber(value);
      setShipInfo({ ...shipInfo, [name]: newValue });
      return;
    }
    setShipInfo({ ...shipInfo, [name]: value });
  };

  const handlePaymentInfoChange = (event) => {
    const { name, value } = event.target;
    if (name === 'expiry') {
      let newValue = cc_expires_format(value);
      setCardValue({ ...cardValue, [name]: newValue });
      return;
    }
    setCardValue({ ...cardValue, [name]: value });
  };

  const handleInputFocus = (e) => {
    setCardValue({ ...cardValue, focus: e.target.name });
  };
  if (cartList?.length === 0) {
    navigate('/cart');
  }
  return (
    <Container className={styles.container}>
      <Row>
        <Col lg={7}>
          <div>
            <h2 className={styles.heading}>배송 주소</h2>
            <div>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="lastName">
                    <Form.Label>성</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="lastName"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="firstName">
                    <Form.Label>이름</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="firstName"
                    />
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridAddress1">
                  <Form.Label>연락처</Form.Label>
                  <Form.Control
                    placeholder="숫자만 입력하세요"
                    onChange={handleFormChange}
                    required
                    name="contact"
                    value={shipInfo.contact}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridAddress2">
                  <Form.Label>주소</Form.Label>
                  <Form.Control
                    placeholder="Apartment, studio, or floor"
                    onChange={handleFormChange}
                    required
                    name="address"
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      onChange={handleFormChange}
                      required
                      name="city"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridZip">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control
                      onChange={handleFormChange}
                      required
                      name="zip"
                    />
                  </Form.Group>
                </Row>
                <div className={styles.mobileReceiptArea}>
                  <OrderReceipt cartList={cartList} totalPrice={totalPrice} />
                </div>
                <div>
                  <h2 className={styles.paymentTitle}>결제 정보</h2>
                  <PaymentForm
                    cardValue={cardValue}
                    handleInputFocus={handleInputFocus}
                    handlePaymentInfoChange={handlePaymentInfoChange}
                  />
                </div>

                <Button
                  variant="dark"
                  className={styles.payButton}
                  type="submit"
                >
                  결제하기
                </Button>
              </Form>
            </div>
          </div>
        </Col>
        <Col lg={5} className={styles.receiptArea}>
          <OrderReceipt cartList={cartList} totalPrice={totalPrice} />
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
