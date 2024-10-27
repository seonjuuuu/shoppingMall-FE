import React from 'react';
import { Spinner } from 'react-bootstrap';
import styles from './LoadingSpinner.module.scss';

const LoadingSpinner = () => {
  return (
    <div className={styles.overlay}>
      <Spinner animation="border" role="status" className={styles.spinner}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingSpinner;
