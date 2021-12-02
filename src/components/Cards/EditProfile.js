import React, { useState } from 'react';
import { useHistory } from 'react-router';
import Swal from 'sweetalert2';

import { API } from '../../config/api';

const EditProfile = ({ getData, user, setEdit }) => {
	const history = useHistory();
	const [preview, setPreview] = useState(null);
	const [form, setForm] = useState({
		profilePicture: '',
		email: '',
		gender: '',
		phone: '',
		address: '',
	});
	const handleOnChange = e => {
		setForm(prevState => ({
			...prevState,
			[e.target.id]:
				e.target.type === 'file' ? e.target.files[0] : e.target.value,
		}));
		if (e.target.type === 'file') {
			setForm(e.target.files);

			if (e.target.files.length !== 0) {
				let url = URL.createObjectURL(e.target.files[0]);
				setPreview(url);
			}
		}
	};

	const handleUpdate = async () => {
		try {
			console.log(form);
			const config = {
				headers: {
					'Content-type': 'multipart/form-data',
				},
			};
			const data = new FormData();
			data.set('email', form.email);
			data.set('gender', form.gender);
			data.set('phone', form.phone);
			data.set('address', form.address);
			data.set('image', form[0], form[0].name);
			const response = await API.patch(`/users`, data, config);
			if (response.status === 200) {
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: 'Profile updated!',
				});
				getData();
			}
			const timer = setTimeout(() => {
				history.go();
			}, 1000);
			return () => clearTimeout(timer);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<h1 className="my-5 timesNewRoman" style={{ fontSize: 36 }}>
				Edit Profile
			</h1>
			<div className="profile-card">
				<div className="profile-card-container pt-3 d-flex justify-content-between">
					<div className="personal-info">
						<div className="p-info-card d-flex align-items-center my-3">
							<img src="/icons/email.png" alt="" />
							<div className="p-info-card-text ps-3">
								<input
									id="email"
									name="email"
									type="text"
									className="mb-0"
									onChange={handleOnChange}
									defaultValue={user.email}
								/>
								<p>Email</p>
							</div>
						</div>
						<div className="p-info-card d-flex align-items-center my-3">
							<img src="/icons/gender.png" alt="" />
							<div className="p-info-card-text ps-3">
								<input
									id="gender"
									name="gender"
									onChange={handleOnChange}
									className="mb-0"
									value={user.gender}
								/>
								<p>Gender</p>
							</div>
						</div>
						<div className="p-info-card d-flex align-items-center my-3">
							<img src="/icons/phone.png" alt="" />
							<div className="p-info-card-text ps-3">
								<input
									id="phone"
									name="phone"
									onChange={handleOnChange}
									className="mb-0"
									value={user.phone}
								/>
								<p>Phone</p>
							</div>
						</div>
						<div className="p-info-card d-flex align-items-center my-3">
							<img className="me-1" src="/icons/location.png" alt="" />
							<div className="p-info-card-text ps-3">
								<input
									id="address"
									name="address"
									onChange={handleOnChange}
									className="mb-0"
									value={user.address}
								/>
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
							onClick={() => {
								handleUpdate();
								setEdit(false);
							}}
						>
							Save
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default EditProfile;
