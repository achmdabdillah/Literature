import React, { useState } from 'react';
import { useHistory } from 'react-router';

const LandingLogin = () => {
	const history = useHistory();
	const [input, setInput] = useState('');
	const handleOnChange = e => {
		setInput(e.target.value);
	};
	return (
		<div className="user-home container">
			<img src="/assets/logo.png" alt="" />
			<div className="input-group mb-3">
				<input
					type="text"
					className="form-control search-box"
					placeholder="Search for literature"
					onChange={handleOnChange}
				/>
				<button
					className="ms-2 search-btn rounded"
					type="button"
					id="button-addon2"
					onClick={() => history.push(`/search?title=${input}`)}
				>
					<img src="/assets/lup.png" height="30px" alt="" />
				</button>
			</div>
		</div>
	);
};

export default LandingLogin;
