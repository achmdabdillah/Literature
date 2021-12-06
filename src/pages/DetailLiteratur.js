import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router';
import Swal from 'sweetalert2';
import Nav from '../components/Structure/Nav';

import { API } from '../config/api';
import downloader from '../tools/Downloader';
import { AuthContext } from '../context/AuthContext';

const DetailLiteratur = () => {
	const history = useHistory();
	const { state } = useContext(AuthContext);
	const dateFormatter = inputDate => {
		let data = new Date(inputDate).toString();
		const newDate = data.split(' ');
		return newDate.slice(0, 4);
	};

	const { id } = useParams();

	const [data, setData] = useState({});
	// const [collectionItem, setCollectionItem] = useState([]);
	const [myCol, setMyCol] = useState([]);
	const [collectionID, setCollectionID] = useState(null);

	const getData = async () => {
		try {
			const response = await API.get(`/literatures/${id}`);
			setData(response.data.data);
		} catch (error) {
			alert('Cannot get data');
		}
	};

	const date = dateFormatter(data?.publication_date);

	const getCollection = async () => {
		try {
			const response = await API.get(`/collection`);
			setMyCol(response.data.collection);
		} catch (error) {
			alert('Cannot get data');
		}
	};

	// const getCollectionItem = async () => {
	// 	try {
	// 		const response = await API.get(`/all-collection/`);
	// 		setCollectionItem(response.data.data);
	// 	} catch (error) {
	// 		console.log('Cannot get data');
	// 	}
	// };

	const handleAddCollection = async idCollection => {
		try {
			const config = {
				headers: {
					'Content-type': 'application/json',
				},
			};

			const response = await API.post(
				'/collections/add',
				JSON.stringify({ idLiterature: data?.id, idCollection }),
				config
			);
			getCollection();

			if (response.status === 200) {
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: 'Literature added',
				});
			}
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Failed',
				text: 'Literature already added',
			});
		}
	};

	// const getCollectionID = async () => {
	// 	try {
	// 		const response = await API.get(`/collections/${id}`);

	// 		if (response.status === 200) {
	// 			setCollectionID(response?.data?.col?.id);
	// 		}
	// 	} catch (error) {
	// 		alert('Cannot get data');
	// 	}
	// };

	// const deleteCollection = async () => {
	// 	try {
	// 		const response = await API.delete(`/collections/${collectionID}`);
	// 		if (response.status === 200) {
	// 			setCollectionID(null);
	// 		}
	// 		getCollection();
	// 	} catch (error) {
	// 		alert('Cannot get data');
	// 	}
	// };

	// const deleteLiterature = async () => {
	// 	try {
	// 		const response = await API.delete(`/literatures/${data?.id}`);
	// 		if (response.status === 200) {
	// 			Swal.fire({
	// 				icon: 'success',
	// 				title: 'Success',
	// 				text: 'Literature deleted',
	// 			});
	// 			history.push('/profile');
	// 		}
	// 	} catch (error) {
	// 		alert('Cannot get data');
	// 	}
	// };

	useEffect(() => {
		getData();
		getCollection();
		// getCollectionItem();
		// getCollectionID();
	}, []);

	return (
		<>
			<Nav />
			<div className="container d-flex justify-content-between mt-3">
				<div className="preview">
					<a href={data?.attachment} target="_blank" rel="noreferrer">
						<div
							className={
								data?.status === 'Waiting Approve' ? 'waiting' : data?.status
							}
						>
							<img
								className="pointer"
								style={{ borderRadius: 10 }}
								src={data?.thumbnail}
								height="450"
								alt=""
							/>
						</div>
					</a>
				</div>
				<div className="d-flex flex-column detail-info w-75 mx-5 avenir-thin">
					<div className="mb-5">
						<h1 className="timesNewRoman mb-4" style={{ fontSize: 36 }}>
							{data?.title}
						</h1>
						<h2 style={{ fontSize: 24, color: '#929292' }}>{data?.author}</h2>
					</div>
					<div className="mb-5">
						<h1 className="mb-4" style={{ fontSize: 24, fontWeight: 'bolder' }}>
							Publication Date
						</h1>
						<h2 style={{ fontSize: 18, color: '#929292' }}>
							{date[1]} {date[3]}
						</h2>
					</div>
					<div className="mb-3">
						<h1
							className="mb-4"
							style={{ fontSize: 24, fontWeight: 'bolder', color: '#af2e1e' }}
						>
							ISBN
						</h1>
						<h2 style={{ fontSize: 18, color: '#929292' }}>{data?.ISBN}</h2>
					</div>
					<div>
						<button
							className="download-btn rounded"
							onClick={() => downloader(data?.attachment, data?.title)}
						>
							Download
							<img
								className="ms-3"
								src="/assets/cloud.png"
								height="20px"
								alt=""
							/>
						</button>
					</div>
				</div>
				<div className="w-25 d-flex flex-column mt-0">
					<button
						type="button"
						className="create-collection-btn"
						data-bs-toggle="modal"
						data-bs-target="#exampleModal"
					>
						Add To Collection
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
										Your Collection
									</h5>
								</div>
								<div className="modal-body">
									<div className="d-flex flex-column align-items-center">
										{myCol.map(item => (
											<div className="d-flex w-100 border justify-content-between">
												<h4 className="w-75">{item.collectionName}</h4>
												<button
													data-bs-dismiss="modal"
													className="w-25"
													onClick={() => handleAddCollection(item?.id)}
												>
													+
												</button>
											</div>
										))}
									</div>
								</div>
								<div className="modal-footer"></div>
							</div>
						</div>
					</div>
					{/* modal ends */}
					{/* {state.user.id !== data.idUser && data?.idUser !== undefined ? (
						<>
							{myCol.find(item => item.literatures.id === data?.id) ? (
								<>
									<button
										onClick={deleteCollection}
										className="my-collection-btn rounded"
									>
										Remove
										<img
											className="ms-3"
											src="/assets/saved.png"
											height="20px"
											alt=""
										/>
									</button>
								</>
							) : (
								<>
									<button
										onClick={handleAddCollection}
										className="my-collection-btn rounded"
									>
										Add My Collection
										<img
											className="ms-3"
											src="/assets/save.png"
											height="20px"
											alt=""
										/>
									</button>
								</>
							)}
						</>
					) : (
						<>
							{data?.status === 'Cancelled' ? (
								<>
									<button
										className="my-collection-btn rounded"
										data-bs-toggle="modal"
										data-bs-target="#staticBackdrop"
									>
										Delete
									</button>

									<div
										className="modal fade"
										id="staticBackdrop"
										data-bs-keyboard="false"
										tabIndex="-1"
										aria-labelledby="staticBackdropLabel"
										aria-hidden="true"
									>
										<div className="modal-dialog modal-dialog-centered">
											<div className="modal-content">
												<div className="modal-header">
													<h5 className="modal-title" id="staticBackdropLabel">
														Delete literature?
													</h5>
												</div>
												<div className="modal-body">
													<p>Note that this action cannot be undone</p>
												</div>
												<div className="modal-footer">
													<button
														onClick={deleteLiterature}
														className="my-collection-btn w-50 rounded"
														data-bs-dismiss="modal"
													>
														Delete
													</button>
												</div>
											</div>
										</div>
									</div>
								</>
							) : (
								<></>
							)}
						</>
					)} */}
				</div>
			</div>
		</>
	);
};

export default DetailLiteratur;
