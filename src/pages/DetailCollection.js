import React, { useEffect, useState } from 'react';
import Nav from '../components/Structure/Nav';
import CardPDF from '../components/Cards/CardPDF';
import NotFound from './NotFound';
import Swal from 'sweetalert2';

import { API } from '../config/api';
import { useParams } from 'react-router';

const DetailCollection = () => {
	const [data, setData] = useState([]);
	const { id } = useParams();
	const [edit, setEdit] = useState(false);
	const [isOwner, setIsOwner] = useState(true);

	const getData = async () => {
		try {
			const response = await API.get(`/collection/${id}`);
			setData(response.data.data);
		} catch (error) {
			console.log(error.response);
			if (error.response.status === 401) {
				setIsOwner(false);
			}
		}
	};

	const handleDelete = async idLiterature => {
		try {
			let dataItem = { idLiterature, idCollection: parseInt(id) };
			const res = await API.delete('/collection/item', {
				data: dataItem,
			});
			if (res.status === 200) {
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: 'Literature added',
				});
				getData();
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<>
			{isOwner ? (
				<>
					<Nav />
					<div className="container">
						<div className="d-flex justify-content-between mb-3">
							<div className="d-flex justify-content-between w-100">
								<h1 className="timesNewRoman my-auto" style={{ fontSize: 30 }}>
									{data?.[0]?.collections?.collectionName}
								</h1>
								{data.length !== 0 ? (
									<button
										className={edit ? 'done-btn' : 'edit-btn'}
										onClick={() => setEdit(!edit)}
									>
										{edit ? 'Done' : 'Edit'}
									</button>
								) : (
									<></>
								)}
							</div>
						</div>
						{data?.length !== 0 ? (
							<>
								<div className="items">
									{data?.map((item, i) => (
										<>
											{edit ? (
												<>
													<div className="d-flex flex-column relative opacity">
														<CardPDF key={i} item={item.literatures} />
														<p
															className="pointer avenir delete-btn"
															data-bs-toggle="modal"
															data-bs-target="#exampleModal"
														>
															<i class="fas fa-times fa-2x"></i>
														</p>
													</div>
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
																	<h3
																		className="modal-title fs-3"
																		id="exampleModalLabel"
																	>
																		Delete {item?.literatures?.title} from{' '}
																		{data[0]?.collections.collectionName}?
																	</h3>
																</div>
																<div className="modal-body">
																	<h3 className="fs-5">
																		Remember, this action cannot be undone
																	</h3>
																</div>
																<div className="modal-footer">
																	<button
																		type="button"
																		className="modal-btn"
																		data-bs-dismiss="modal"
																		onClick={() =>
																			handleDelete(item?.literatures.id)
																		}
																	>
																		Delete
																	</button>
																</div>
															</div>
														</div>
													</div>
													{/* modal ends */}
												</>
											) : (
												<CardPDF key={i} item={item.literatures} />
											)}
										</>
									))}
								</div>
							</>
						) : (
							<>
								<div className="w-100 d-flex flex-column justify-content-center">
									<h1 className="mx-auto my-5">No Literature added</h1>
									<h3 className="mx-auto">
										Start adding your favorite literature
									</h3>
								</div>
							</>
						)}
					</div>
				</>
			) : (
				<NotFound />
			)}
		</>
	);
};

export default DetailCollection;
