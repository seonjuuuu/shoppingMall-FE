import React from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { currencyFormat, discountPercent } from '../../../utils/number';
import styles from './ProductTable.module.scss';
import { useSearchParams } from 'react-router-dom';

const ProductTable = ({ header, data, deleteItem, openEditForm }) => {
  const [query] = useSearchParams();
  const page = Number(query.get('page')) - 1 ?? 0;
  const limit = 5;
  const startIndex = limit * page + 1;
  return (
    <div className={styles.productTable}>
      <Table bordered>
        <thead>
          <tr>
            {header.map((title, index) => (
              <th key={index}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={index}
                className={
                  item.status === 'disactive' ? `${styles.inactive}` : ''
                }
              >
                <th>{startIndex + index}</th>
                <th>{item.sku}</th>
                <th style={{ minWidth: '100px' }}>{item.name}</th>
                <th>{currencyFormat(item.price)}</th>
                <th>{currencyFormat(item.discountPrice)}</th>
                <th>{discountPercent(item.price, item.discountPrice)}%</th>
                <th>
                  {Object.keys(item.stock).map((size, index) => (
                    <div key={index}>
                      {size}:{item.stock[size]}
                    </div>
                  ))}
                </th>
                <th>
                  <img src={item.image} width={100} alt="product-img" />
                </th>
                <th>{item.status}</th>
                <th style={{ minWidth: '100px' }}>
                  <Button size="sm" onClick={() => openEditForm(item)}>
                    수정
                  </Button>
                </th>
                <th style={{ minWidth: '100px' }}>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteItem(item._id)}
                    className="mr-1"
                  >
                    삭제
                  </Button>
                </th>
              </tr>
            ))
          ) : (
            <tr className={styles.noData}>
              <td colSpan={header.length}>등록된 제품이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};
export default ProductTable;
