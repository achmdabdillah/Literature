import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Nav from '../components/Structure/Nav';
import Swal from 'sweetalert2';

import { API } from '../config/api';

const MyCollection = () => {
	const history = useHistory();

	const [data, setData] = useState([]);
	const [collectionName, setCollectionName] = useState();

	const handleOnChange = e => {
		setCollectionName(e.target.value);
	};

	const getData = async () => {
		try {
			const response = await API.get('/collection/');
			setData(response.data.collection);
		} catch (error) {
			console.log('Cannot get data');
		}
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
					text: 'Literature added',
				});
				getData();
				setCollectionName('');
			}
			console.log(response);
		} catch (error) {
			console.log(error);
		}
	};

	const handleDetail = id => {
		history.push(`/collection/${id}`);
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
											placeholder="Collection name"
											onChange={handleOnChange}
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
										className="modal-btn"
										data-bs-dismiss="modal"
										onClick={createCollection}
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
					{data?.map((item, i) => (
						<h1
							key={i}
							className="pointer"
							onClick={() => handleDetail(item?.id)}
						>
							{item.collectionName}
						</h1>
					))}
				</div>
			</div>
		</>
	);
};

export default MyCollection;
