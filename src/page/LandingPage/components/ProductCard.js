import React from 'react';
import { useNavigate } from 'react-router-dom';
import { currencyFormat, discountPercent } from '../../../utils/number';
import styles from './ProductCard.module.scss';

const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const isSale = discountPercent(item.price, item.discountPrice) !== 0;

  return (
    <div
      className={`${styles.card} card`}
      onClick={() => showProduct(item._id)}
    >
      {isSale && <div className={styles.sale}>sale</div>}
      <img src={item?.image} alt={`상품 ${item.name}`} />
      <div className={styles.info}>
        <div className={styles.name}>{item?.name}</div>
        <div className={styles.priceList}>
          {isSale && (
            <div className={styles.discount}>
              {discountPercent(item.price, item.discountPrice)}%
            </div>
          )}
          <div className={styles.price}>
            {isSale
              ? ` ₩ ${currencyFormat(item?.discountPrice)}`
              : ` ₩ ${currencyFormat(item?.price)}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
