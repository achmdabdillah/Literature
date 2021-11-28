import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import Swal from 'sweetalert2';
import Nav from '../components/Nav';

import { API } from '../config/api';

const DetailLiteratur = () => {
	const history = useHistory();
	const { id } = useParams();
	const [data, setData] = useState({});
	const getData = async () => {
		try {
			const response = await API.get(`/literatures/${id}`);
			setData(response.data.data);
		} catch (error) {
			alert('Cannot get data');
		}
	};

	useEffect(() => {
		getData();
	}, []);

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

			if (response.status === 200) {
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: 'Literature added',
				});
				history.push('/collection');
			}
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Failed',
				text: 'Literature already added',
			});
		}
	};

	return (
		<>
			<Nav />
			<div className="container d-flex justify-content-between mb-5">
				<div className="preview">
					<img src={data?.thumbnail} height="550" alt="" />
					{/* <embed
						onClickCapture={() => console.log('object')}
						src={data?.attachment}
						width="500px"
						height="600px"
						className="pointer"
						type="application/pdf"
					/> */}
				</div>
				<div className="d-flex flex-column detail-info w-75 border ms-5">
					<div className="mb-5">
						<h1>{data?.title}</h1>
						<h2>{data?.author}</h2>
					</div>
					<div className="mb-5">
						<h1>Publication Date</h1>
						<h2>{data?.publication_date}</h2>
					</div>
					<div className="mb-5">
						<h1>ISBN</h1>
						<h2>{data?.ISBN}</h2>
					</div>
					<div>
						<button>Download</button>
					</div>
				</div>
				<div>
					<button
						onClick={handleAddCollection}
						className="my-collection-btn border"
					>
						Add My Collection
					</button>
				</div>
			</div>
		</>
	);
};

export default DetailLiteratur;
