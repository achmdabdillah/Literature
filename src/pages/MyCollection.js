import React, { useEffect, useState } from 'react';
import Nav from '../components/Structure/Nav';
import CardPDF from '../components/Cards/CardPDF';

import { API } from '../config/api';

const MyCollection = () => {
	const [data, setData] = useState([]);

	const getData = async () => {
		try {
			const response = await API.get('/collection');
			setData(response.data.collection);
		} catch (error) {
			console.log('Cannot get data');
		}
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<>
			<Nav />
			<div className="container mt-5">
				<h1 className="timesNewRoman mb-5" style={{ fontSize: 30 }}>
					My Collection
				</h1>
				{data.length !== 0 ? (
					<>
						<div className="items">
							{data.map(item => (
								<CardPDF item={item.literatures} />
							))}
						</div>
					</>
				) : (
					<div className="w-100 d-flex flex-column justify-content-center">
						<h1 className="mx-auto mb-5">No Collection</h1>
						<h3 className="mx-auto">Start adding your favorite literature</h3>
					</div>
				)}
			</div>
		</>
	);
};

export default MyCollection;
