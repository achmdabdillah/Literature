import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Nav from '../components/Structure/Nav';
import Swal from 'sweetalert2';

import { API } from '../config/api';

const MyCollection = () => {
	const history = useHistory();

	const [data, setData] = useState([]);

	const getData = async () => {
		try {
			const response = await API.get('/collection/');
			setData(response.data.collection);
		} catch (error) {
			console.log('Cannot get data');
		}
	};

	const [collectionName, setCollectionName] = useState('');

	const handleOnChange = e => {
		setCollectionName(e.target.value);
	};

	const handleDetail = id => {
		history.push(`/collection/${id}`);
	};

	const createCollection = async () => {
		try {
			const config = {
				headers: {
					'Content-type': 'application/json',
				},
			};

			const data = { collectionName };
			const response = await API.post(
				'/collections',
				JSON.stringify(data),
				config
			);
			if (response.status === 200) {
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: 'Collection created',
				});
				getData();
				setCollectionName('');
			}
		} catch (error) {}
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<>
			<Nav />
			<div className="container">
				<div className="d-flex justify-content-between mb-3">
					<h1 className="timesNewRoman my-auto" style={{ fontSize: 30 }}>
						My Collections
					</h1>
					<button
						type="button"
						className="create-collection-btn"
						data-bs-toggle="modal"
						data-bs-target="#exampleModal"
					>
						Create New Collection
					</button>
					{/* Modal Start */}
					<div
						className="modal fade"
						id="exampleModal"
						tabIndex="-1"
						aria-labelledby="exampleModalLabel"
						aria-hidden="true"
					>
						<div className="modal-dialog modal-dialog-centered">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title fs-2" id="exampleModalLabel">
										Give your collection a name
									</h5>
								</div>
								<div className="modal-body">
									<div className="modal-input">
										<input
											onChange={handleOnChange}
											placeholder="Collection name"
											type="text"
											id="collection_name"
											name="collection_name"
											value={collectionName}
										/>
									</div>
								</div>
								<div className="modal-footer">
									<button
										type="button"
										onClick={createCollection}
										className="modal-btn"
									>
										Create
									</button>
								</div>
							</div>
						</div>
					</div>
					{/* modal ends */}
				</div>
				<div>
					{data?.length !== 0 ? (
						<>
							{data?.map((item, i) => (
								<h1
									key={i}
									className="pointer collection-title"
									onClick={() => handleDetail(item?.id)}
								>
									{item.collectionName}
								</h1>
							))}
						</>
					) : (
						<>
							<div className="w-100 d-flex flex-column justify-content-center">
								<h1 className="mx-auto my-5">No Collection found</h1>
								<h3 className="mx-auto">Start creating your collection</h3>
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default MyCollection;
