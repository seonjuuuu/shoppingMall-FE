import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import styles from './RegisterPage.module.scss';

import { registerUser } from '../../features/user/userSlice';
import LoadingSpinner from '../../common/component/LoadingSpinner';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    policy: false,
  });
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState('');
  const [policyError, setPolicyError] = useState(false);
  const { registrationError } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const register = (event) => {
    event.preventDefault();
    const { name, email, password, confirmPassword, policy } = formData;

    const checkConfirmPassword = password === confirmPassword;
    if (!checkConfirmPassword) {
      setPasswordError('비밀번호 중복확인이 일치하지 않습니다.');
      return;
    }

    if (!policy) {
      setPolicyError(true);
      return;
    }
    setPasswordError('');
    setPolicyError(false);
    setIsLoading(true);

    dispatch(registerUser({ name, email, password, navigate }))
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Login Error:', error);
        setIsLoading(false);
      });
  };

  const handleChange = (event) => {
    let { id, value, type, checked } = event.target;
    if (id === 'confirmPassword' && passwordError) setPasswordError('');
    if (type === 'checkbox') {
      if (policyError) setPolicyError(false);
      setFormData((prevState) => ({ ...prevState, [id]: checked }));
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner isBackground={true} />}
      <Container className={styles.registerArea}>
        {registrationError && (
          <div>
            <Alert variant="danger" className="error-message">
              {registrationError.message ??
                registrationError ??
                '회원가입 오류가 발생하였습니다.'}
            </Alert>
          </div>
        )}
        <Form onSubmit={register}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              id="email"
              placeholder="Enter email"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              id="name"
              placeholder="Enter name"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              id="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
              isInvalid={passwordError}
            />
            <Form.Control.Feedback type="invalid">
              {passwordError}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="이용약관에 동의합니다"
              id="policy"
              onChange={handleChange}
              isInvalid={policyError}
              checked={formData.policy}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            회원가입
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default RegisterPage;
