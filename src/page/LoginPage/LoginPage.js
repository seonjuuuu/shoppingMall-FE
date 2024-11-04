import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { loginWithEmail, loginWithGoogle } from '../../features/user/userSlice';
import { clearErrors } from '../../features/user/userSlice';
import styles from './LoginPage.module.scss';
import LoadingSpinner from '../../common/component/LoadingSpinner';
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loginError } = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(clearErrors());
      navigate('/');
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (loginError) {
      console.error('로그인 에러:', loginError);
    }
  }, [loginError]);

  const handleLoginWithEmail = (event) => {
    event.preventDefault();
    setIsLoading(true);
    dispatch(loginWithEmail({ email, password }))
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Login Error:', error);
        setIsLoading(false);
      });
  };

  const handleGoogleLogin = async (googleData) => {
    //구글 로그인 하기
  };

  return (
    <>
      {isLoading && <LoadingSpinner isBackground={true} />}
      <Container className={styles.loginArea}>
        {loginError && (
          <div className="error-message">
            <Alert variant="danger">
              {loginError.message ??
                loginError ??
                '로그인 오류가 발생하였습니다.'}
            </Alert>
          </div>
        )}
        <Form className={styles.loginForm} onSubmit={handleLoginWithEmail}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Group>
          <div className={styles.loginButtonArea}>
            <Button variant="primary" type="submit">
              Login
            </Button>
            <div className={styles.text}>
              아직 계정이 없으세요? <Link to="/register">회원가입 하기</Link>
            </div>
          </div>

          <div className={styles.google}>
            <p className={styles.googleText}>외부 계정으로 로그인하기</p>
            <div className="display-center">
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => {
                    console.log('Login Failed');
                  }}
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default Login;
