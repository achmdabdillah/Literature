import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Nav from '../components/Nav';
import Home from '../components/Home';
import LandingBody from '../components/LandingBody';

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
