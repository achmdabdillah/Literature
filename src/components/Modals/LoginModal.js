import { Modal, Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';

import { API } from '../../config/api';

const LoginModals = ({ handleClose, show, handleShowRegis }) => {
	const history = useHistory();

	const { dispatch } = useContext(AuthContext);

	// Store data with useState here ...
	const [form, setForm] = useState({
		email: '',
		password: '',
	});

	const { email, password } = form;

	const handleOnChange = e => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async e => {
		try {
			e.preventDefault();
			// Configuration
			const config = {
				headers: {
					'Content-type': 'application/json',
				},
			};
			// Data body
			const body = JSON.stringify(form);
			// Insert data for login process
			const response = await API.post('/login', body, config);
			// Checking process
			if (response?.status === 200) {
				// Send data to useContext
				dispatch({
					type: 'LOGIN',
					payload: response.data,
				});
				// Status check
				if (response.data.status === 'admin') {
					history.push('/verification');
				}
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: 'Login Success',
				});
			}
		} catch (error) {
			setForm({
				email: '',
				password: '',
			});
			Swal.fire({
				icon: 'error',
				title: 'Failed',
				text: 'Please input correct email or password',
			});
			console.log(error);
		}
	};

	return (
		<>
			<Modal show={show} onHide={handleClose} centered>
				<Modal.Header>
					<Modal.Title>Sign In</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="modal-input mb-3">
						<input
							placeholder="Email"
							onChange={handleOnChange}
							value={email}
							type="email"
							id="email"
							name="email"
						/>
					</div>
					<div className="modal-input">
						<input
							placeholder="Password"
							onChange={handleOnChange}
							value={password}
							type="password"
							id="password"
							name="password"
						/>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button
						className="modal-btn"
						onClick={e => {
							handleSubmit(e);
							handleClose();
						}}
					>
						<p className="avenir-thin mt-1">Sign In</p>
					</Button>
					<div className="modal-input">
						<p className="avenir-thin mb-0 mt-3">
							Don't have an account ? Click{' '}
							<strong
								className="red pointer"
								onClick={() => {
									handleShowRegis();
									handleClose();
								}}
							>
								Here
							</strong>
						</p>
					</div>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default LoginModals;
