import React, { useEffect } from 'react';
import ProductCard from './components/ProductCard';
import { Row, Col, Container } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductList } from '../../features/product/productSlice';
import styles from './LandingPage.module.scss';

const LandingPage = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.product.productList);
  const [query] = useSearchParams();
  const name = query.get('name');
  useEffect(() => {
    dispatch(
      getProductList({
        name,
      })
    );
  }, [query]);

  return (
    <Container>
      <Row>
        {productList.length > 0 ? (
          productList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          <div className={styles.productText}>
            <img
              src="/image/no-data.png"
              alt="no-data"
              className={styles.noDataImage}
            />
            {name === '' ? (
              <div className={styles.noProduct}>등록된 상품이 없습니다!</div>
            ) : (
              <div className={styles.noProduct}>
                {name || '검색'}과 일치한 상품이 없습니다!
              </div>
            )}
          </div>
        )}
      </Row>
    </Container>
  );
};

export default LandingPage;
