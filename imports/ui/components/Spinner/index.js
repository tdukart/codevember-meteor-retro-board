import React from 'react';

import { styles } from './style.scss';

const Spinner = () => (
  <div className={styles['sk-folding-cube']}>
    <div className={`${styles['sk-cube1']} ${styles['sk-cube']}`} />
    <div className={`${styles['sk-cube2']} ${styles['sk-cube']}`} />
    <div className={`${styles['sk-cube4']} ${styles['sk-cube']}`} />
    <div className={`${styles['sk-cube3']} ${styles['sk-cube']}`} />
  </div>
);

export default Spinner;
