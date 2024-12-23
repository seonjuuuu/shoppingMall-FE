import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import SearchBox from '../../common/component/SearchBox';
import NewItemDialog from './component/NewItemDialog';
import ProductTable from './component/ProductTable';
import {
  getProductList,
  deleteProduct,
  setSelectedProduct,
  getDeletedProduct,
  updateStatus,
  silentGetProductList,
} from '../../features/product/productSlice';
import styles from './AdminProductPage.module.scss';
import LoadingSpinner from '../../common/component/LoadingSpinner';

const AdminProductPage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const { productList, totalPageNum, loading } = useSelector(
    (state) => state.product
  );
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    page: query.get('page') || 1,
    name: query.get('name') || '',
  });
  const [listMode, setListMode] = useState('operation');
  const [mode, setMode] = useState('new');

  const tableHeader = [
    '#',
    'Sku',
    '이름',
    '정가',
    '할인가',
    '할인율',
    '재고',
    '이미지',
    '상태',
    '수정',
    '삭제',
  ];

  useEffect(() => {
    if (listMode === 'deleted') {
      dispatch(getDeletedProduct({ ...searchQuery }));
    } else {
      dispatch(getProductList({ ...searchQuery }));
    }
  }, [listMode, searchQuery, dispatch]);

  useEffect(() => {
    if (searchQuery.name === '') {
      delete searchQuery.name;
    }
    const params = new URLSearchParams(searchQuery);
    const query = params.toString();

    navigate(`?${query}`);
  }, [searchQuery, navigate]);

  const deleteItem = (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    dispatch(deleteProduct(id)).then(() => {
      dispatch(getProductList({ ...searchQuery }));
    });
  };

  const openEditForm = (product) => {
    setMode('edit');
    dispatch(setSelectedProduct(product));
    setShowDialog(true);
  };

  const handleClickNewItem = () => {
    setMode('new');
    setShowDialog(true);
  };

  const handlePageClick = ({ selected }) => {
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };

  const handleDeleteItem = () => {
    setListMode('deleted');
    const initialQuery = { page: 1, name: '' };
    setSearchQuery(initialQuery);
  };

  const handleProductItem = () => {
    setListMode('operation');
    const initialQuery = { page: 1, name: '' };
    setSearchQuery(initialQuery);
  };

  const handleStatusUpdate = (id, status) => {
    const changeStatus = status === 'active' ? 'inactive' : 'active';
    dispatch(updateStatus({ id, status: changeStatus })).then(() => {
      dispatch(silentGetProductList({ ...searchQuery }));
    });
  };

  return (
    <div className={styles.locateCenter}>
      <Container>
        <div className={styles.searchBox}>
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="제품 이름으로 검색"
            field="name"
          />
        </div>
        <div className={styles.buttonList}>
          <Button className={styles.productButton} onClick={handleClickNewItem}>
            아이템 등록 +
          </Button>
          <div className={styles.listButton}>
            <Button
              variant="success"
              className={styles.productButton}
              onClick={handleProductItem}
            >
              운영 리스트
            </Button>
            <Button
              variant="danger"
              className={styles.productButton}
              onClick={handleDeleteItem}
            >
              삭제 리스트
            </Button>
          </div>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <ProductTable
              header={tableHeader}
              data={productList}
              deleteItem={deleteItem}
              openEditForm={openEditForm}
              handleStatusUpdate={handleStatusUpdate}
            />
            <ReactPaginate
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={totalPageNum}
              forcePage={searchQuery.page - 1}
              previousLabel="<"
              renderOnZeroPageCount={null}
              pageClassName={styles.pageItem}
              pageLinkClassName={styles.pageLink}
              previousClassName={styles.pageItem}
              previousLinkClassName={styles.pageLink}
              nextClassName={styles.pageItem}
              nextLinkClassName={styles.pageLink}
              breakLabel="..."
              breakClassName={styles.pageItem}
              breakLinkClassName={styles.pageLink}
              containerClassName={styles.pagination}
              activeClassName={styles.active}
              className={styles.paging}
            />
          </>
        )}
      </Container>

      <NewItemDialog
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
      />
    </div>
  );
};

export default AdminProductPage;
