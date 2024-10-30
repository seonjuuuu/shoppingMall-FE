import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { currencyFormat, discountPercent } from '../../utils/number';
import { getProductDetail } from '../../features/product/productSlice';
import { addToCart } from '../../features/cart/cartSlice';
import LoadingSpinner from '../../common/component/LoadingSpinner';
import styles from './ProductDetailPage.module.scss';

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { selectedProduct, loading } = useSelector((state) => state.product);
  const [size, setSize] = useState('');
  const { id } = useParams();
  const [sizeError, setSizeError] = useState(false);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const addItemToCart = () => {
    if (size === '') {
      setSizeError(true);
      return;
    }
    if (!user) {
      navigate('/login');
    }
    dispatch(addToCart({ id, size }));
  };

  const selectSize = (value) => {
    if (sizeError) setSizeError(false);
    setSize(value);
  };

  useEffect(() => {
    dispatch(getProductDetail(id));
  }, [id, dispatch]);

  if (loading || !selectedProduct) return <LoadingSpinner />;

  const salePrice = discountPercent(
    selectedProduct.price,
    selectedProduct.discountPrice
  );
  return (
    <Container className={styles.productDetailCard}>
      <Row>
        <Col sm={6} className={styles.productDetailImage}>
          <img src={selectedProduct.image} className="w-100" alt="detail-img" />
        </Col>
        <Col className={styles.productInfoArea} sm={6}>
          <div className={styles.productNameArea}>
            <div className={styles.productName}>{selectedProduct.name}</div>
          </div>
          {salePrice > 0 && (
            <div className={styles.originPrice}>
              <div className={styles.discount}>{salePrice}%</div>
              <div className={styles.origin}>
                ₩ {currencyFormat(selectedProduct.price)}
              </div>
            </div>
          )}
          <div className={styles.productSale}>
            <div className={styles.productDiscount}>
              ₩ {currencyFormat(selectedProduct.discountPrice)}
            </div>
            {salePrice > 0 && <div className={styles.sale}>SALE</div>}
          </div>

          <div className={styles.productInfo}>
            {selectedProduct.description}
          </div>

          <Dropdown
            className={styles.sizeDropDown}
            title={size}
            align="start"
            onSelect={(value) => selectSize(value)}
          >
            <Dropdown.Toggle
              className={styles.sizeDropDown}
              variant={sizeError ? 'outline-danger' : 'outline-dark'}
              id="dropdown-basic"
              align="start"
            >
              {size === '' ? '사이즈 선택' : size.toUpperCase()}
            </Dropdown.Toggle>

            <Dropdown.Menu className={styles.sizeDropDown}>
              {Object.keys(selectedProduct.stock).length > 0 &&
                Object.keys(selectedProduct.stock).map((item, index) =>
                  selectedProduct.stock[item] > 0 ? (
                    <Dropdown.Item eventKey={item} key={index}>
                      {item.toUpperCase()}
                    </Dropdown.Item>
                  ) : (
                    <Dropdown.Item eventKey={item} disabled={true} key={index}>
                      {item.toUpperCase()}
                    </Dropdown.Item>
                  )
                )}
            </Dropdown.Menu>
          </Dropdown>
          <div className="warning-message">
            {sizeError && '사이즈를 선택해주세요.'}
          </div>
          <Button variant="dark" className="add-button" onClick={addItemToCart}>
            추가
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
