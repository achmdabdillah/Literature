import React from 'react';
import { useHistory } from 'react-router';

const NotFound = () => {
	const history = useHistory();
	return (
		<div className="d-flex flex-column mx-auto justify-content-center align-items-center">
			<h1 className="mt-5 red avenir">Oops..</h1>
			<h1 className="my-3">Sorry... that page seems to be missing</h1>
			<div className="d-flex flex-column">
				<img src="/assets/no-data.png" height="300" alt="" />
			</div>
			<p
				className="pointer btn btn-red avenir my-3"
				onClick={() => history.goBack()}
			>
				Go Back
			</p>
		</div>
	);
};

export default NotFound;
