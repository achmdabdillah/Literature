import React from 'react';
import { useHistory } from 'react-router';

const CardPDF = ({ item, getData }) => {
	const history = useHistory();

	const handleDetail = () => {
		history.push(`/literatures/${item?.id}`);
	};

	return (
		<div onClick={handleDetail} className="item pointer">
			<div className="pdf-preview">
				<img src={item.thumbnail} alt="" />
			</div>
			<div className="pdf-title timesNewRoman mb-3" style={{ fontSize: 24 }}>
				{item?.title}
			</div>
			<div className="pdf-info avenir-thin" style={{ color: '#929292' }}>
				<div className="d-flex flex-row justify-content-between">
					<p className="me-2 w-50">{item?.author}</p>
					<p>{item?.public_year}</p>
				</div>
			</div>
		</div>
	);
};

export default CardPDF;
