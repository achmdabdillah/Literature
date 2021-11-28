import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Nav = () => {
	let history = useHistory();
	const { state, dispatch } = useContext(AuthContext);
	return (
		<div className="container">
			{state.isLogin ? (
				state.user.status === 'admin' ? (
					<div className="nav border d-flex justify-content-between">
						<img src="/assets/logo.png" alt="" className="img-fluid logo" />
						{/* Nav start */}
						<nav className="navbar navbar-expand-lg navbar-dark bg-brokenwhite border">
							<div className="container-fluid">
								<button
									className="navbar-toggler"
									type="button"
									data-bs-toggle="collapse"
									data-bs-target="#navbarNavDarkDropdown"
									aria-controls="navbarNavDarkDropdown"
									aria-expanded="false"
									aria-label="Toggle navigation"
								>
									<span className="navbar-toggler-icon"></span>
								</button>
								<div
									className="collapse navbar-collapse"
									id="navbarNavDarkDropdown"
								>
									<ul className="navbar-nav">
										<li className="nav-item dropdown">
											<a
												href
												className="nav-link dropdown-toggle"
												id="navbarDarkDropdownMenuLink"
												role="button"
												data-bs-toggle="dropdown"
												aria-expanded="false"
											>
												<div>
													<img
														className="box-sm circle"
														src="/images/Avatar.png"
														alt=""
													/>
												</div>
											</a>
											<ul
												className="dropdown-menu dropdown-menu-end"
												aria-labelledby="navbarDarkDropdownMenuLink"
											>
												<li
													onClick={() => dispatch({ type: 'LOGOUT' })}
													className="dropdown-item pointer my-2"
												>
													<img
														src="/assets/logout1.png"
														alt=""
														className="me-3"
													/>
													<p className="avenir">Logout</p>
												</li>
											</ul>
										</li>
									</ul>
								</div>
							</div>
						</nav>
					</div>
				) : (
					<div className="nav">
						<div className="d-flex flex-row justify-content-around border w-50">
							<p className="pointer" onClick={() => history.push('/profile')}>
								Profile
							</p>
							<p
								className="pointer"
								onClick={() => history.push('/collection')}
							>
								My Collection
							</p>
							<p
								className="pointer"
								onClick={() => history.push('/add-literatures')}
							>
								Add Literature
							</p>
							<p
								className="pointer"
								onClick={() => dispatch({ type: 'LOGOUT' })}
							>
								Logout
							</p>
						</div>
						<div className="logo w-50 border d-flex justify-content-end">
							<img
								onClick={() => history.push('/')}
								src="/assets/logo.png"
								alt=""
								className="img-fluid pointer"
							/>
						</div>
					</div>
				)
			) : (
				<div className="nav">
					<img src="/assets/logo.png" alt="" className="img-fluid logo" />
				</div>
			)}
		</div>
	);
};

export default Nav;
