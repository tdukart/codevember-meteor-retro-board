import React from 'react';
import PropTypes from 'prop-types';

import style from './style.css';

const Sticky = ({body, color}) => {
	let cssClasses = [style.sticky];
	if (color) {

	}
	return (
		<div className={cssClasses.join(' ')}>
			{body}
		</div>
	)
};

Sticky.propTypes = {
	body: PropTypes.string.isRequired,
};

export default Sticky;
