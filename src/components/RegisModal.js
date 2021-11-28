import { Modal } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';

// IMPORT API
import { API } from '../config/api';

const RegisModals = ({ handleClose, show }) => {
	const { dispatch } = useContext(AuthContext);

	const [form, setForm] = useState({
		fullName: '',
		email: '',
		password: '',
		gender: '',
		phone: '',
		address: '',
	});

	const { fullName, email, password, gender, phone, address } = form;

	const handleOnChange = e => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async e => {
		try {
			e.preventDefault();
			// Configuration Content-type
			const config = {
				headers: {
					'Content-type': 'application/json',
				},
			};
			// Data body
			const body = JSON.stringify(form);
			console.log(body);
			// Insert data user to database
			const response = await API.post('/register', body, config);
			// Notification
			if (response.data.status === 'success') {
				setLoggingIn(true);
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: 'Register Success',
				});
			}
		} catch (error) {
			setForm({
				fullName: '',
				email: '',
				password: '',
				phone: '',
				address: '',
			});
			Swal.fire({
				icon: 'error',
				title: 'Failed',
				text: 'Register failed',
			});
			console.log(error);
		}
	};

	const handleLogin = async () => {
		try {
			// Configuration
			const config = {
				headers: {
					'Content-type': 'application/json',
				},
			};
			const login = {
				email: form.email,
				password: form.password,
			};
			// Insert data for login process
			const response2 = await API.post('/login', JSON.stringify(login), config);
			// Checking process
			if (response2?.status === 200) {
				// Send data to useContext
				dispatch({
					type: 'LOGIN',
					payload: response2.data,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	const [loggingIn, setLoggingIn] = useState(false);
	if (loggingIn) {
		handleLogin();
	}

	return (
		<>
			<Modal show={show} onHide={handleClose} centered>
				<Modal.Header>
					<Modal.Title>Register</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="modal-input">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							placeholder="Email"
							value={email}
							name="email"
							onChange={handleOnChange}
						/>
					</div>
					<div className="modal-input">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							placeholder="Password"
							value={password}
							name="password"
							onChange={handleOnChange}
						/>
					</div>
					<div className="modal-input">
						<label htmlFor="fullName">Full Name</label>
						<input
							type="text"
							placeholder="Name"
							value={fullName}
							name="fullName"
							onChange={handleOnChange}
						/>
					</div>
					<div className="modal-input">
						<label htmlFor="gender">Gender</label>
						<select
							name="gender"
							id="gender"
							className="input-group avenir-thin"
							onChange={handleOnChange}
						>
							<option selected disabled value="choose">
								Choose
							</option>
							<option value="Pria">Pria</option>
							<option value="Wanita">Wanita</option>
						</select>
					</div>
					<div className="modal-input">
						<label htmlFor="phone">Phone</label>
						<input
							type="number"
							placeholder="Phone number"
							id="phone"
							name="phone"
							value={phone}
							onChange={handleOnChange}
						/>
					</div>
					<div className="modal-input">
						<label htmlFor="address">Address</label>
						<input
							type="text"
							placeholder="Address"
							id="address"
							name="address"
							value={address}
							onChange={handleOnChange}
						/>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<button
						className="modal-btn"
						onClick={e => {
							handleSubmit(e);
							handleClose();
						}}
					>
						Register
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default RegisModals;
