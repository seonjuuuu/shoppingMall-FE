import React from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { currencyFormat } from '../../../utils/number';
import { updateQty, deleteCartItem } from '../../../features/cart/cartSlice';
import styles from './CartProductCard.module.scss';
import { Link } from 'react-router-dom';

const CartProductCard = ({ item }) => {
  const dispatch = useDispatch();

  const handleQtyChange = (id, value) => {
    dispatch(updateQty({ id, value }));
  };

  const deleteCart = (id) => {
    if (!window.confirm('이 상품을 삭제하시겠습니까?')) return;
    dispatch(deleteCartItem(id));
  };
  return (
    <div className={styles.productCardCart}>
      <div className={styles.productCard}>
        <Link
          to={`/product/${item.productId._id}`}
          className={styles.imageContainer}
        >
          <img src={item.productId.image} width={112} alt="product" />
        </Link>
        <div className={styles.detailsContainer}>
          <div className={`${styles.flex} ${styles.spaceBetween}`}>
            <h3 className={styles.productName}>{item.productId.name}</h3>
            <button className={styles.trashButton}>
              <FontAwesomeIcon
                icon={faTimes}
                width={24}
                onClick={() => deleteCart(item._id)}
              />
            </button>
          </div>

          <div className={styles.productInfo}>
            <strong className={styles.productPrice}>
              ₩ {currencyFormat(item.productId.discountPrice)}
            </strong>
            <div>사이즈: {item.size}</div>
            <div className={styles.productNum}>
              수량:
              <select
                onChange={(event) =>
                  handleQtyChange(item._id, event.target.value)
                }
                required
                defaultValue={item.qty}
                className={styles.qtyDropdown}
              >
                {[...Array(10)].map((_, index) => (
                  <option key={`${item._id}-${index}`} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.productTotal}>
              Total: ₩ {currencyFormat(item.productId.discountPrice * item.qty)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProductCard;
