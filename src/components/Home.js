import React, { useState } from 'react';
import { useHistory } from 'react-router';

const LandingLogin = () => {
	const history = useHistory();
	const [input, setInput] = useState('');
	const handleOnChange = e => {
		setInput(e.target.value);
	};
	return (
		<div className="landing-login">
			<img src="/assets/logo.png" alt="" />
			<div className="input-group mb-3">
				<input
					type="text"
					className="form-control"
					placeholder="Search for literature"
					onChange={handleOnChange}
				/>
				<button
					className="btn btn-outline-secondary"
					type="button"
					id="button-addon2"
					onClick={() => history.push(`/literatures?title=${input}`)}
				>
					Search
				</button>
			</div>
		</div>
	);
};

export default LandingLogin;
