import React from 'react';
import styles from './LoadingSpinner.module.scss';
import { MoonLoader } from 'react-spinners';

const LoadingSpinner = ({ isBackground, size }) => {
  return (
    <div className={isBackground ? `${styles.overlay}` : `${styles.background}`}>
      <MoonLoader color={isBackground? '#fff' : '#000'} size={size}/>
    </div>
  );
};

export default LoadingSpinner;
