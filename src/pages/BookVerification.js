import React, { useState, useEffect } from 'react';
import Nav from '../components/Structure/Nav';

import { API } from '../config/api';

const BookVerification = () => {
	// Get Data
	const [data, setData] = useState([]);
	const [status, setStatus] = useState('Waiting Approve');

	const getData = async () => {
		try {
			const response = await API.get('/literatures?title');
			setData(response.data.data);
		} catch (error) {
			console.log('Cannot get data');
		}
	};

	useEffect(() => {
		getData();
	}, []);

	// Update Verification
	const updateData = async (id, status) => {
		try {
			// Configuration
			const config = {
				headers: {
					'Content-type': 'application/json',
				},
			};
			const statusUpdate = JSON.stringify({ status });
			await API.patch(`/literatures/${id}`, statusUpdate, config);
			getData();
		} catch (error) {
			alert('Cannot get data');
		}
	};
	return (
		<>
			<Nav />
			<div className="verif-body">
				<div className="container d-flex flex-column">
					<div className="d-flex justify-content-between align-items-center">
						<h1 className="list-title my-4">Book verification</h1>
						<div>
							<select
								className="status"
								name="year"
								onChange={e => setStatus(e.target.value)}
							>
								<option defaultValue={true} value="Waiting Approve">
									Waiting Approve
								</option>
								<option value="Approved">Approved</option>
								<option value="Cancelled">Cancelled</option>
							</select>
						</div>
					</div>
					<table className="verification-tbl roboto">
						<tbody>
							<tr className="roboto-bold">
								<th className="w-10">No</th>
								<th className="w-18">Users or Author</th>
								<th className="w-18">ISBN</th>
								<th className="w-18">Literatur</th>
								<th className="w-20">Status</th>
								<th className="center d-flex">
									<p>Action</p>
								</th>
							</tr>
							{data
								.filter(item => item.status === status)
								.map((item, i) => (
									<tr key={i}>
										<td>{i + 1}</td>
										<td>{item?.author}</td>
										<td>{item?.ISBN}</td>
										<td
											className="w-20"
											style={{ color: '#0058DD', textDecoration: 'none' }}
										>
											<a
												href={item?.attachment}
												target="_blank"
												rel="noreferrer"
											>
												{item?.title}.pdf
											</a>
										</td>
										<td
											className={
												item?.status === 'Approved'
													? 'roboto-bold status-green w-15'
													: item?.status === 'Cancelled'
													? 'roboto-bold status-red w-15'
													: 'roboto-bold status-orange w-15'
											}
										>
											{item?.status}
										</td>
										<td className="buttons">
											{item?.status === 'Waiting Approve' ? (
												<>
													<div className="d-flex justify-content-around">
														<button
															style={{ backgroundColor: '#FF0742' }}
															className="verif-button avenir rounded"
															onClick={() => updateData(item?.id, 'Cancelled')}
														>
															Cancel
														</button>
														<button
															style={{ backgroundColor: '#0ACF83' }}
															className="verif-button avenir rounded"
															onClick={() => updateData(item?.id, 'Approved')}
														>
															Approve
														</button>
													</div>
												</>
											) : (
												<>
													<div className="center d-flex">
														<img src="/assets/done.png" height="40" alt="" />
													</div>
												</>
											)}
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};

export default BookVerification;
