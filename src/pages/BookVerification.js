import { useState, useEffect } from 'react';
import Nav from '../components/Nav';

import { API } from '../config/api';

const BookVerification = () => {
	// Get Data
	const [data, setData] = useState([]);

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
			<div className="verif-body mt-5 border">
				<div className="container d-flex flex-column">
					<h1 className="list-title">Book verification</h1>
					<table className="transaction-tbl">
						<tr>
							<th>No</th>
							<th>Users or Author</th>
							<th>ISBN</th>
							<th>Literatur</th>
							<th>Status</th>
							<th>Action</th>
						</tr>
						{data
							.filter(item => item.status !== 'Approved')
							.map((item, i) => (
								<tr>
									<td>{i + 1}</td>
									<td>{item?.author}</td>
									<td>{item?.ISBN}</td>
									<td>{item?.attachment}</td>
									<td>{item?.status}</td>
									<td className="buttons border">
										{item?.status === 'Waiting Approve' ? (
											<div className="d-flex justify-content-between">
												<button
													onClick={() => updateData(item?.id, 'Cancelled')}
												>
													Cancel
												</button>
												<button
													onClick={() => updateData(item?.id, 'Approved')}
												>
													Approve
												</button>
											</div>
										) : (
											<p>DONE ICON</p>
										)}
									</td>
								</tr>
							))}
					</table>
				</div>
			</div>
		</>
	);
};

export default BookVerification;
