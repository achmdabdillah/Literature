import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import Swal from 'sweetalert2';
import Nav from '../components/Structure/Nav';

import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

import { API } from '../config/api';
import downloader from '../tools/Downloader';

function PdfViewer({ attachment }) {
	return (
		<div className="detail-pdf">
			<Document file={attachment}>
				<Page pageNumber={1} />
			</Document>
		</div>
	);
}

const DetailLiteratur = () => {
	const history = useHistory();

	const dateFormatter = inputDate => {
		let data = new Date(inputDate).toString();
		const newDate = data.split(' ');
		return newDate.slice(0, 4);
	};

	const { id } = useParams();

	const [data, setData] = useState({});
	const [myCol, setMyCol] = useState([]);

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

	useEffect(() => {
		getData();
		getCollection();
	}, []);

	return (
		<>
			<Nav />
			<div className="container d-flex justify-content-between mt-3">
				<div className="preview">
					<a href={data?.attachment} target="_blank" rel="noreferrer">
						<PdfViewer attachment={data?.attachment} />
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
									<h5
										className="modal-title fs-2 mx-auto"
										id="exampleModalLabel"
									>
										Your Collection
									</h5>
								</div>
								<div className="modal-body">
									<div className="d-flex flex-column align-items-center">
										{myCol.length !== 0 ? (
											<>
												{myCol.map(item => (
													<div className="d-flex w-100 justify-content-between my-2">
														<h4 className="w-75">{item.collectionName}</h4>
														<button
															data-bs-dismiss="modal"
															className="add-btn"
															onClick={() => handleAddCollection(item?.id)}
														>
															<i class="fas fa-plus"></i>
														</button>
													</div>
												))}
											</>
										) : (
											<>
												<div className="w-100 d-flex flex-column justify-content-center">
													<h4 className="mx-auto my-3">No Collection found</h4>
													<h5 className="mx-auto">
														Start creating your collection{' '}
														<span
															className="pointer"
															data-bs-dismiss="modal"
															onClick={() => history.push('/collection')}
															style={{ color: '#af2e1c' }}
														>
															here
														</span>
													</h5>
												</div>
											</>
										)}
									</div>
								</div>
								<div className="modal-footer"></div>
							</div>
						</div>
					</div>
					{/* modal ends */}
				</div>
			</div>
		</>
	);
};

export default DetailLiteratur;
