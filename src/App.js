import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Loader from 'react-loader-spinner';

// import pages
import Landing from './pages/Landing';
import AddLiterature from './pages/AddLiterature';
import MyCollection from './pages/MyCollection';
import Profile from './pages/Profile';
import BookVerification from './pages/BookVerification';
import DetailLiteratur from './pages/DetailLiteratur';
import SearchLiterature from './pages/SearchLiterature';
import DetailCollection from './pages/DetailCollection';

import { AdminRoute, UserRoute } from './components/Route/PrivateRoute';
import { useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import { API, setAuthToken } from './config/api';

// init token on axios every time the app is refreshed
if (localStorage.token) {
	setAuthToken(localStorage.token);
}

function App() {
	const { state, dispatch } = useContext(AuthContext);
	console.clear();

	useEffect(() => {
		if (localStorage.token) {
			setAuthToken(localStorage.token);
		}
	}, [state]);

	const checkUser = async () => {
		try {
			const response = await API.get('/check-auth');

			// If the token incorrect
			if (response.status === 404) {
				return dispatch({
					type: 'AUTH_ERROR',
				});
			}

			// Get user data
			let payload = response.data.data;
			// Get token from local storage
			payload.token = localStorage.token;

			// Send data to useContext
			dispatch({
				type: 'AUTH_SUCCESS',
				payload,
			});
		} catch (error) {
			console.log(error);
			dispatch({
				type: 'AUTH_ERROR',
			});
		}
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			checkUser();
		}, 500);
		return () => clearTimeout(timer);
	}, []);
	return (
		<Router>
			<Switch>
				{state.isLoading ? (
					<div className="container">
						<div className="d-flex justify-content-center align-items-center fs-4 vh-100">
							<Loader
								type="ThreeDots"
								color="#af2e1c"
								height={100}
								width={100}
							/>
						</div>
					</div>
				) : (
					<>
						<Route exact path="/" component={Landing} />
						<Route exact path="/search" component={SearchLiterature} />
						<UserRoute
							exact
							path="/literatures/:id"
							component={DetailLiteratur}
						/>
						<UserRoute
							exact
							path="/add-literatures"
							component={AddLiterature}
						/>
						<UserRoute exact path="/collection" component={MyCollection} />
						<UserRoute
							exact
							path="/collection/:id"
							component={DetailCollection}
						/>
						<UserRoute exact path="/profile" component={Profile} />
						<AdminRoute
							exact
							path="/verification"
							component={BookVerification}
						/>
					</>
				)}
			</Switch>
		</Router>
	);
}

export default App;
