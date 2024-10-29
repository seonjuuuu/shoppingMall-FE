import React, { useEffect } from 'react';
import ProductCard from './components/ProductCard';
import { Row, Col, Container } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductList } from '../../features/product/productSlice';
import styles from './LandingPage.module.scss';
import LoadingSpinner from '../../common/component/LoadingSpinner';

const LandingPage = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.productList);
  const loading = useSelector((state) => state.product.loading);
  const [query, setSearchParams] = useSearchParams();

  const name = query.get('name') || '';
  const filterList = productList.filter((item) => item.status === 'active');

  useEffect(() => {
    dispatch(getProductList({ name }));
  }, [name, dispatch]);

  const moveAllProduct = () => setSearchParams({});

  return loading ? (
    <LoadingSpinner />
  ) : (
    <Container className={styles.landingPage}>
      {name && filterList.length > 0 && (
        <div className={styles.searchInfo}>
          "<span className={styles.searchName}>{name}</span>" 에 대한 검색결과
          {filterList.length}건
        </div>
      )}
      <Row>
        {filterList.length > 0 ? (
          filterList.map((item) => (
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
            <div className={styles.noProduct}>
              {name
                ? `"${name}"와 일치한 상품이 없습니다!`
                : '등록된 상품이 없습니다!'}
            </div>
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
