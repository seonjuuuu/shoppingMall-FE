import React, { useEffect, useRef, useState } from 'react';
import ProductCard from './components/ProductCard';
import { Row, Col, Container } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductList } from '../../features/product/productSlice';
import styles from './LandingPage.module.scss';
import LoadingSpinner from '../../common/component/LoadingSpinner';

const LandingPage = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.product.loading);
  const [query, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);
  const [list, setList] = useState([]);
  const limit = 10;
  const [target, setTarget] = useState(null);
  const name = query.get('name') || '';

  const fetchProducts = () => {
    dispatch(getProductList({ name, limit, page })).then((res) => {
      const newProducts = res.payload.data;
      const totalPageNum = res.payload.total;

      if (page >= totalPageNum || newProducts.length < limit) {
        setHasMore(false);
      }

      setList((prevList) => [...prevList, ...newProducts]);
    });
  };

  useEffect(() => {
    if (hasMore) fetchProducts();
  }, [page, name]);

  useEffect(() => {
    if (!hasMore) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        threshold: 1.0,
      }
    );

    const observerInstance = observer.current;

    if (target) observerInstance.observe(target);

    return () => {
      if (observerInstance && target) observerInstance.unobserve(target);
    };
  }, [target, hasMore]);

  const moveAllProduct = () => setSearchParams({});

  const filterList = list.filter((item) => item.status === 'active');

  return loading && page === 1 ? (
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
          filterList.map((item, index) => (
            <Col
              lg={3}
              md={6}
              sm={12}
              key={item._id}
              ref={index === filterList.length - 1 ? setTarget : null}
            >
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
      {loading && page > 1 && <LoadingSpinner spot={true} height={'70px'} />}
    </Container>
  );
};

export default LandingPage;
