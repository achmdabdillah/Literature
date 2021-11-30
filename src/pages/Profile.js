import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import CardPDF from '../components/CardPDF';
import MyNav from '../components/Nav';
import Swal from 'sweetalert2';
import { Nav } from 'react-bootstrap';

import { API } from '../config/api';

const Profile = () => {
	const history = useHistory();
	const [user, setUser] = useState([]);
	const [preview, setPreview] = useState(null);
	const [form, setForm] = useState('');

	const getUser = async () => {
		try {
			const response = await API.get('/user');
			setUser(response.data.data);
		} catch (error) {
			console.log('Cannot get data');
		}
	};

	const [data, setData] = useState([]);
	const getData = async () => {
		try {
			const response = await API.get(`/users/literature`);
			setData(response.data.literature);
		} catch (error) {
			console.log('Cannot get data');
		}
	};

	const handleOnChange = e => {
		if (e.target.type === 'file') {
			setForm(e.target.files);

			if (e.target.files.length !== 0) {
				let url = URL.createObjectURL(e.target.files[0]);
				setPreview(url);
			}
		}
	};

	const handleUpload = async () => {
		try {
			const config = {
				headers: {
					'Content-type': 'multipart/form-data',
				},
			};
			const data = new FormData();
			data.set('image', form[0], form[0].name);
			const response = await API.patch(`/users`, data, config);
			if (response.status === 200) {
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: 'Profile picture uploaded!',
				});
			}
			getData();
			const timer = setTimeout(() => {
				history.go();
			}, 1000);
			return () => clearTimeout(timer);
		} catch (error) {
			console.log(error);
		}
	};

	const [status, setStatus] = useState('Approved');

	useEffect(() => {
		getUser();
		getData();
	}, []);
	return (
		<>
			<MyNav />
			<div className="container">
				<h1 className="my-5 timesNewRoman" style={{ fontSize: 36 }}>
					Profile
				</h1>
				<div className="profile-card">
					<div className="profile-card-container pt-3 d-flex justify-content-between">
						<div className="personal-info">
							<div className="p-info-card d-flex align-items-center my-4">
								<img src="/icons/email.png" alt="" />
								<div className="p-info-card-text ps-3">
									<h5 className="avenir mb-0">{user?.email}</h5>
									<p>Email</p>
								</div>
							</div>
							<div className="p-info-card d-flex align-items-center my-4">
								<img src="/icons/gender.png" alt="" />
								<div className="p-info-card-text ps-3">
									<h5 className="avenir mb-0">{user?.gender}</h5>
									<p>Gender</p>
								</div>
							</div>
							<div className="p-info-card d-flex align-items-center my-4">
								<img src="/icons/phone.png" alt="" />
								<div className="p-info-card-text ps-3">
									<h5 className="avenir mb-0">{user?.phone}</h5>
									<p>Phone</p>
								</div>
							</div>
							<div className="p-info-card d-flex align-items-center my-4">
								<img className="me-1" src="/icons/location.png" alt="" />
								<div className="p-info-card-text ps-3">
									<h5 className="avenir mb-0">{user?.address}</h5>
									<p>Address</p>
								</div>
							</div>
						</div>
						<div className="profile-image my-auto">
							<label for="image">
								<img
									className="box pointer"
									src={
										preview !== null
											? preview
											: user.profilePicture !== null
											? user?.profilePicture
											: 'images/Avatar.png'
									}
									alt=""
								/>
							</label>
							<div>
								<input
									type="file"
									id="image"
									className="pointer avenir-thin fs-6 pointer a filestyle"
									name="image"
									onChange={handleOnChange}
								></input>
							</div>
							<button
								className="change-profile-btn avenir-thin mt-4"
								onClick={handleUpload}
							>
								Change Photo Profile
							</button>
						</div>
					</div>
				</div>
				<h1 className="my-5 timesNewRoman" style={{ fontSize: 36 }}>
					My Literature
				</h1>

				{data.length !== 0 ? (
					<>
						<Nav
							className="mb-3"
							variant="tabs"
							defaultActiveKey="Approved"
							onSelect={selectedKey => setStatus(selectedKey)}
						>
							<Nav.Item>
								<Nav.Link eventKey="Approved">Approved</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="Waiting Approve">Waiting Approve</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="Cancelled">Cancelled</Nav.Link>
							</Nav.Item>
						</Nav>
						<div className="items">
							{data
								?.filter(item => item.status === status)
								.map(item => (
									<CardPDF item={item} />
								))}
						</div>
					</>
				) : (
					<div className="no-data d-flex flex-column">
						<img src="/assets/no-data.png" height="400" alt="" />

						<h1 className="my-5">No Literature Added</h1>
					</div>
				)}
			</div>
		</>
	);
};

export default Profile;
