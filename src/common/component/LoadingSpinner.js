import React from 'react';
import styles from './LoadingSpinner.module.scss';
import { MoonLoader, BeatLoader } from 'react-spinners';

const LoadingSpinner = ({ isBackground, size, spot = false, height }) => {
  return (
    <div
      className={isBackground ? `${styles.overlay}` : `${styles.background}`}
      style={{ height }}
    >
      {spot ? (
        <BeatLoader color={isBackground ? '#fff' : '#000'} size={size} />
      ) : (
        <MoonLoader color={isBackground ? '#fff' : '#000'} size={size} />
      )}
    </div>
  );
};

export default LoadingSpinner;
