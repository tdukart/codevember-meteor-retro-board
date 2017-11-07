import React from 'react';
import PropTypes from 'prop-types';

import { styles } from './style.scss';

const Sticky = ({ body, color }) => {
  const cssClasses = [styles.sticky];
  if (color !== '') {
    cssClasses.push(styles[color]);
  }
  return (
    <div className={cssClasses.join(' ')}>
      {body}
    </div>
  );
};

Sticky.propTypes = {
  body: PropTypes.string.isRequired,
  color: PropTypes.string,
};

Sticky.defaultProps = {
  color: '',
};

export default Sticky;
