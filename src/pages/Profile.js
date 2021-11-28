import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import CardPDF from '../components/CardPDF';
import Nav from '../components/Nav';
import Swal from 'sweetalert2';

import { API } from '../config/api';

const Profile = () => {
	const history = useHistory();
	const [user, setUser] = useState([]);
	const [preview, setPreview] = useState('');
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

			let url = URL.createObjectURL(e.target.files[0]);
			setPreview(url);
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

	useEffect(() => {
		getUser();
		getData();
	}, []);
	return (
		<>
			<Nav />
			<div className="container">
				<div className="d-block">
					<div className="profile-card">
						<div className="profile-card-container pt-3 d-flex justify-content-between">
							<div className="personal-info">
								<h1>Personal Info</h1>
								<div className="p-info-card d-flex align-items-center my-auto">
									<img src="/icons/profilepic.png" alt="" />
									<div className="p-info-card-text ps-3">
										<h5 className="avenir mb-0">{user?.fullName}</h5>
										<p>Full name</p>
									</div>
								</div>
								<div className="p-info-card d-flex align-items-center my-auto">
									<img src="/icons/email.png" alt="" />
									<div className="p-info-card-text ps-3">
										<h5 className="avenir mb-0">{user?.email}</h5>
										<p>Email</p>
									</div>
								</div>
								<div className="p-info-card d-flex align-items-center my-auto">
									<img src="/icons/phone.png" alt="" />
									<div className="p-info-card-text ps-3">
										<h5 className="avenir mb-0">{user?.phone}</h5>
										<p>Phone</p>
									</div>
								</div>
								<div className="p-info-card d-flex align-items-center my-auto">
									<img className="me-1" src="/icons/location.png" alt="" />
									<div className="p-info-card-text ps-3">
										<h5 className="avenir mb-0">{user?.address}</h5>
										<p>Address</p>
									</div>
								</div>
							</div>
							<div className="profile-image">
								<label for="image">
									<img
										className="box pointer"
										src={
											user.profilePicture !== null
												? user?.profilePicture
												: preview
												? preview
												: '/images/Avatar.png'
										}
										alt="avatar"
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
									className="change-profile-btn avenir-thin"
									onClick={handleUpload}
								>
									Upload
								</button>
							</div>
						</div>
					</div>
				</div>
				<h1 className="mt-5">My Literature</h1>
				<div className="items">
					{data
						?.filter(item => item.status === 'Approved')
						.map(item => (
							<CardPDF item={item} />
						))}
				</div>
			</div>
		</>
	);
};

export default Profile;
