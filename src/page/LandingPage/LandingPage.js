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
  const [query, setSearchParams] = useSearchParams();
  const name = query.get('name');
  useEffect(() => {
    dispatch(
      getProductList({
        name,
      })
    );
  }, [query]);

  const moveAllProduct = () => {
    setSearchParams({});
  };

  const filterList = productList.filter((item) => item.status === 'active');

  return (
    <Container className={styles.landingPage}>
      <Row>
        {filterList.length > 0 ? (
          filterList
            .map((item) => (
              <Col lg={3} md={6} sm={12} key={item._id}>
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
                "{name || '검색'}"와 일치한 상품이 없습니다!
              </div>
            )}
            <button className={styles.allButton} onClick={moveAllProduct}>
              전체 상품 보기
            </button>
          </div>
        )}
      </Row>
    </Container>
  );
};

export default LandingPage;
