import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router';
import Swal from 'sweetalert2';
import Nav from '../components/Nav';

import { API } from '../config/api';
import downloader from '../tools/Downloader';
import { AuthContext } from '../context/AuthContext';

const DetailLiteratur = () => {
	const { state } = useContext(AuthContext);

	const history = useHistory();

	const dateFormatter = inputDate => {
		let data = new Date(inputDate).toString();
		const newDate = data.split(' ');
		return newDate.slice(0, 4);
	};

	const { id } = useParams();
	const [data, setData] = useState({});
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

	const handleAddCollection = async () => {
		try {
			const config = {
				headers: {
					'Content-type': 'application/json',
				},
			};

			const response = await API.post(
				'/collections',
				JSON.stringify({ idLiterature: data?.id }),
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

	const getCollectionID = async () => {
		try {
			const response = await API.get(`/collections/${id}`);

			if (response.status === 200) {
				setCollectionID(response?.data?.col?.id);
			}
		} catch (error) {
			alert('Cannot get data');
		}
	};
	const deleteCollection = async () => {
		try {
			await API.delete(`/collections/${collectionID}`);
			getCollection();
		} catch (error) {
			alert('Cannot get data');
		}
	};

	useEffect(() => {
		getData();
		getCollection();
		getCollectionID();
	}, []);

	return (
		<>
			<Nav />
			<div className="container d-flex justify-content-between mt-3">
				<div className="preview">
					<a href={data?.attachment}>
						<img
							className="pointer"
							style={{ borderRadius: 10 }}
							src={data?.thumbnail}
							height="450"
							alt=""
						/>
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
				<div>
					{state.user.id === data?.idUser ? (
						<></>
					) : (
						<>
							{myCol.find((item, i) => item.literatures.id === data?.id) ? (
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
					)}
				</div>
			</div>
		</>
	);
};

export default DetailLiteratur;
