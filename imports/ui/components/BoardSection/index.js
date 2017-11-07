import React from 'react';
import PropTypes from 'prop-types';

import Sticky from '../Sticky';

import style from './style.css';

const BoardSection = ({title, stickies}) => {
	let stickyList = stickies.map((stickyData) => (
		<Sticky key={stickyData.uuid} body={stickyData.body} color={stickyData.color}/>
	));

	return (
		<div className={style.boardSection}>
			<h2 className={style.sectionTitle}>
				{title}
			</h2>
			<div className={style.sectionStickies}>
				{stickyList}
			</div>
		</div>
	)
};

BoardSection.propTypes = {
	title: PropTypes.string.isRequired,
	stickies: PropTypes.arrayOf(PropTypes.shape({
		uuid: PropTypes.string.isRequired,
		body: PropTypes.string.isRequired,
		color: PropTypes.string,
	}).isRequired,
};

export default BoardSection;
