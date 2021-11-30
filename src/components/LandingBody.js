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
		<div className="d-flex flex-row justify-content-around container">
			<div class="landing-body-start">
				<p className="timesNewRoman">
					source <span className="italic">of</span> intelligent
				</p>
				<p className="avenir-thin mx-2" style={{ fontSize: '24px' }}>
					Sign-up and receive unlimited accesss to all of your literatur - share
					your literature.
				</p>
				<div class="d-flex flex-row  w-75 justify-content-between">
					<button className="register-btn" onClick={handleShow1}>
						<p className="avenir-thin">Sign Up</p>
					</button>
					<RegisModals
						handleClose={handleClose1}
						handleShowLogin={handleShow}
						show={show1}
					/>
					{/* LOGIN */}
					<button className="login-btn" onClick={handleShow}>
						<p className="avenir-thin">Sign In</p>
					</button>
					<LoginModals
						handleClose={handleClose}
						show={show}
						show1={show1}
						handleShowRegis={handleShow1}
					/>
				</div>
			</div>
			<img src="/assets/showcase.png" alt="" className="showcaseImg" />
		</div>
	);
};

export default LandingNotLogin;
