import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import CardPDF from '../components/CardPDF';

import { API } from '../config/api';

const MyCollection = () => {
	const [data, setData] = useState([]);
	console.log(data);

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

	// const arr = [1, 2, 3, 4];
	return (
		<>
			<Nav />
			<div className="container mt-5">
				<h1>My Collection</h1>
				<div className="items border">
					{data.map(item => (
						<CardPDF item={item.literatures} />
					))}
				</div>
			</div>
		</>
	);
};

export default MyCollection;
