import React, { useState, useEffect } from 'react';
import { Form, Modal, Button, Row, Col, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import CloudinaryUploadWidget from '../../../utils/CloudinaryUploadWidget';
import { CATEGORY, STATUS, SIZE } from '../../../constants/product.constants';
import '../style/adminProduct.style.css';
import {
  clearError,
  createProduct,
  editProduct,
  getProductList,
  resetSuccess,
} from '../../../features/product/productSlice';
import styles from './NewItemDialog.module.scss';
import { useSearchParams } from 'react-router-dom';

const InitialFormData = {
  name: '',
  sku: '',
  stock: {},
  image: '',
  description: '',
  category: [],
  status: 'active',
  price: 0,
  discountPrice: 0,
};

const NewItemDialog = ({ mode, showDialog, setShowDialog }) => {
  const { error, success, selectedProduct } = useSelector(
    (state) => state.product
  );
  const [formData, setFormData] = useState(
    mode === 'new' ? { ...InitialFormData } : selectedProduct
  );
  const [stock, setStock] = useState([]);
  const dispatch = useDispatch();
  const [stockError, setStockError] = useState(false);
  const [searchParams] = useSearchParams();
  const query = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (success) {
      setShowDialog(false);
      dispatch(getProductList(query));
      dispatch(resetSuccess());
    }
  }, [success]);

  useEffect(() => {
    if (error || !success) {
      dispatch(clearError());
    }
    if (showDialog) {
      if (mode === 'edit') {
        setFormData(selectedProduct);
        // 객체형태로 온 stock을  다시 배열로 세팅해주기
        const sizeArray = Object.keys(selectedProduct.stock).map((size) => [
          size,
          selectedProduct.stock[size],
        ]);
        setStock(sizeArray);
      } else {
        setFormData({ ...InitialFormData });
        setStock([]);
      }
    }
  }, [showDialog]);

  const handleClose = () => {
    setFormData({ ...InitialFormData });
    setShowDialog(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (stock.length === 0) {
      setStockError(true);
      return;
    }

    if (!formData.price) {
      alert('정가금액을 입력해주세요.');
      return;
    }

    if (formData.discountPrice > formData.price) {
      alert('할인가는 정가보다 높을 수 없습니다.');
      return;
    }

    const totalStock = stock.reduce((total, item) => {
      return { ...total, [item[0]]: parseInt(item[1]) };
    }, {});

    const updatedFormData = {
      ...formData,
      discountPrice:
        Number(formData.discountPrice) === 0
          ? formData.price
          : formData.discountPrice,
      stock: totalStock,
    };

    console.log('update', updatedFormData);

    if (mode === 'new') {
      dispatch(createProduct(updatedFormData));
    } else {
      dispatch(editProduct({ ...updatedFormData, id: selectedProduct._id }));
    }
  };

  useEffect(() => {
    const stockList = stock.filter((item) => item[0] !== '');
    setFormData((prev) => ({
      ...prev,
      stock: stockList,
    }));
  }, [stock]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const newValue = Number(value);

    if ((name === 'price' || name === 'discountPrice') && newValue < 0) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const addStock = () => {
    setStock((prevStock) => [...prevStock, ['', 0]]);
  };

  const deleteStock = (idx) => {
    setStock((prevStock) => {
      const stockList = [...prevStock];
      stockList.splice(idx, 1);
      return stockList;
    });
  };
  const handleSizeChange = (value, index) => {
    setStock((prevStock) =>
      prevStock.map((item, idx) => (idx === index ? [value, item[1]] : item))
    );
  };

  const handleStockChange = (value, index) => {
    const newValue = Number(value);
    if (newValue >= 0) {
      setStock((prevStock) =>
        prevStock.map((item, idx) =>
          idx === index ? [item[0], newValue] : item
        )
      );
    }
  };

  const onHandleCategory = (event) => {
    if (formData.category.includes(event.target.value)) {
      const newCategory = formData.category.filter(
        (item) => item !== event.target.value
      );
      setFormData({
        ...formData,
        category: [...newCategory],
      });
    } else {
      setFormData({
        ...formData,
        category: [...formData.category, event.target.value],
      });
    }
  };

  const uploadImage = (url) => {
    setFormData({ ...formData, image: url });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <Modal show={showDialog} onHide={handleClose}>
      <Modal.Header closeButton>
        {mode === 'new' ? (
          <Modal.Title>제품 등록</Modal.Title>
        ) : (
          <Modal.Title>제품 수정</Modal.Title>
        )}
      </Modal.Header>
      {error && (
        <div className="error-message">
          <Alert variant="danger">{error}</Alert>
        </div>
      )}
      <Form className="form-container" onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="sku">
            <Form.Label>Sku</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="string"
              placeholder="Enter Sku"
              required
              value={formData.sku}
              name="sku"
            />
          </Form.Group>

          <Form.Group as={Col} controlId="name">
            <Form.Label>상품 이름</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="string"
              placeholder="상품 이름"
              required
              value={formData.name}
              name="name"
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>상품 설명</Form.Label>
          <Form.Control
            type="string"
            placeholder="상품 설명"
            as="textarea"
            onChange={handleChange}
            rows={3}
            value={formData.description}
            name="description"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="stock">
          <Form.Label className="mr-1">Stock</Form.Label>
          {stockError && (
            <span className="error-message">재고를 추가해주세요</span>
          )}
          <Button size="sm" onClick={addStock}>
            Add +
          </Button>
          <div className="mt-2">
            {stock.map((item, index) => (
              <Row key={index} className="mt-1">
                <Col sm={4}>
                  <Form.Select
                    onChange={(event) =>
                      handleSizeChange(event.target.value, index)
                    }
                    required
                    value={item[0] ? item[0].toLowerCase() : ''}
                  >
                    <option value="" disabled hidden>
                      선택
                    </option>
                    {SIZE.map((item, index) => (
                      <option
                        value={item.toLowerCase()}
                        disabled={stock.some(
                          (size) => size[0] === item.toLowerCase()
                        )}
                        key={index}
                      >
                        {item}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col sm={6}>
                  <Form.Control
                    onChange={(event) =>
                      handleStockChange(event.target.value, index)
                    }
                    type="number"
                    placeholder="number of stock"
                    value={item[1]}
                    required
                  />
                </Col>
                <Col sm={2}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteStock(index)}
                  >
                    -
                  </Button>
                </Col>
              </Row>
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="Image" required>
          <Form.Label>상품 이미지</Form.Label>
          <CloudinaryUploadWidget uploadImage={uploadImage} />
          <img
            id="uploadedImage"
            src={formData.image || '/image/no-image.jpg'}
            className={styles.uploadImage}
            alt="uploadedImage"
          />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="price">
            <Form.Label>정가</Form.Label>
            <Form.Control
              value={formData.price}
              required
              onChange={handleChange}
              type="number"
              placeholder="0"
              name="price"
            />
          </Form.Group>
          <Form.Group as={Col} controlId="discountPrice">
            <Form.Label>
              할인가
              <span className={styles.info}>
                * 미입력시(0 입력시) 자동으로 정가금액 셋팅 *
              </span>
            </Form.Label>
            <Form.Control
              value={formData.discountPrice}
              required
              onChange={handleChange}
              type="number"
              placeholder="0"
              name="discountPrice"
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              multiple
              onChange={onHandleCategory}
              value={formData.category}
              required
            >
              {CATEGORY.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={formData.status}
              onChange={handleChange}
              name="status"
              required
            >
              {STATUS.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>
        {mode === 'new' ? (
          <Button variant="primary" type="submit">
            등록
          </Button>
        ) : (
          <Button variant="primary" type="submit">
            Edit
          </Button>
        )}
      </Form>
    </Modal>
  );
};

export default NewItemDialog;
