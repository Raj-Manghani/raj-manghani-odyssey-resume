import React from 'react';
import styles from './PowerCell.module.scss';

const PowerCell = ({ level, maxLevel = 5 }) => {
  const fillPercentage = (level / maxLevel) * 100;

  return (
    <div className={styles.powerCellContainer} title={`Level: ${level}/${maxLevel}`}>
      <div className={styles.powerCellFill} style={{ width: `${fillPercentage}%` }}>
        {/* Optional: Add internal segments or glow effects here */}
      </div>
    </div>
  );
};

export default PowerCell; 