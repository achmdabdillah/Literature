import React, { useState } from 'react';
import LoginModals from './LoginModal';
import RegisModals from './RegisModal';

const LandingNotLogin = () => {
	// Login Modals
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	// Register Modals
	const [show1, setShow1] = useState(false);
	const handleClose1 = () => setShow1(false);
	const handleShow1 = () => setShow1(true);

	return (
		<div className="d-flex flex-row justify-content-around">
			<div class="landing-body-start mt-5">
				<p>source of intelligent</p>
				<p>
					Sign-up and receive unlimited accesss to all of your literatur - share
					your literature.
				</p>
				<div class="d-flex flex-row">
					<button className="login" variant="primary" onClick={handleShow}>
						Login
					</button>
					<LoginModals
						handleClose={handleClose}
						show={show}
						show1={show1}
						handleShowRegis={handleShow1}
					/>
					{/* REGISTER */}
					<button className="register" variant="primary" onClick={handleShow1}>
						Register
					</button>
					<RegisModals handleClose={handleClose1} show={show1} />
				</div>
			</div>
			<img src="/assets/showcase.png" alt="" className="showcaseImg" />
		</div>
	);
};

export default LandingNotLogin;
