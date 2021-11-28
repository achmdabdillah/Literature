import React from 'react';
import { useHistory } from 'react-router';

const CardPDF = ({ item }) => {
	const history = useHistory();

	const handleDetail = () => {
		history.push(`/literatures/${item?.id}`);
	};
	return (
		<div onClick={handleDetail} className="item pointer me-5 border">
			<div className="pdf-preview">
				<img src={item.thumbnail} alt="" />
				{/* <embed
					onClickCapture={() => console.log('object')}
					src={item?.attachment}
					width="300px"
					height="300px"
					className="pointer"
					type="application/pdf"
				/> */}
			</div>
			<div className="pdf-title">{item?.title}</div>
			<div className="pdf-info">
				<div className="d-flex flex-row justify-content-between">
					<p className="me-2">{item?.author}</p>
					<p>{item?.public_year}</p>
				</div>
			</div>
		</div>
	);
};

export default CardPDF;
