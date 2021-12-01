import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Nav from '../components/Structure/Nav';
import Home from '../components/Structure/Home';
import LandingBody from '../components/Structure/LandingBody';

const Landing = () => {
	const { state } = useContext(AuthContext);
	return (
		<>
			<Nav />
			{state.isLogin ? <Home /> : <LandingBody />}
		</>
	);
};

export default Landing;
