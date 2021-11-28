import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router';
import Nav from '../components/Nav';
import CardPDF from '../components/CardPDF';

import { API } from '../config/api';

const SearchLiterature = () => {
	const history = useHistory();

	// Get Data
	const { search } = useLocation();
	console.log(search);
	const [data, setData] = useState([]);
	const [allData, setAllData] = useState([]);
	const searchAll = search.split('&');
	console.log(data);

	const getData = async () => {
		try {
			const response1 = await API.get(`/literatures${search}`);
			const response2 = await API.get(`/literatures${searchAll[0]}`);
			setData(response1.data.data);
			setAllData(response2.data.data);
		} catch (error) {
			console.log(error);
		}
	};

	// Filterring data
	const dataFilterred = data?.filter(item => item.status === 'Approved');
	const allYear = allData.filter(item => item.status === 'Approved');

	// Get all years
	let years = [];
	allYear.map(item => years.push(item?.public_year));
	years = [...new Set(years)];

	const [input, setInput] = useState({
		title: '',
		year: '',
	});

	const handleOnChange = e => {
		setInput(prevState => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};
	// console.log(input);

	useEffect(() => {
		getData();
	}, []);

	const [yearExist, setYearExist] = useState(false);

	const handleSearch = () => {
		if (search.includes('title')) {
			if (!input.title) {
				if (!search.includes('year')) {
					history.go();
				}
				if (input.year) {
					history.push(`/literatures${searchAll[0]}&public_year=${input.year}`);
					history.go();
				}
			}
		}
		if (search.includes('year')) {
			if (!input.year) {
				history.push(`/literatures${search}`);
				history.go();
			}
			if (!search.includes(input.year)) {
				history.push(`/literatures${searchAll[0]}&public_year=${input.year}`);
				history.go();
			}
		}
	};

	if (yearExist) {
		handleSearch();
		setYearExist(false);
	}

	return (
		<>
			<Nav />
			<div className="container border">
				<div className="w-50 border">
					<div className="input-group mb-3">
						<input
							type="text"
							className="form-control"
							placeholder="Search for literature"
							name="title"
							onChange={handleOnChange}
						/>
						<button
							className="btn btn-outline-secondary"
							type="button"
							id="button-addon2"
							onClick={handleSearch}
						>
							Search
						</button>
					</div>
				</div>
				<div className="d-flex justify-content-between">
					<div className="d-flex flex-column">
						<p>Anytime</p>
						<select
							name="year"
							onChange={e => {
								handleOnChange(e);
								setYearExist(true);
							}}
						>
							<option disabled selected={true}>
								Choose year
							</option>
							{years.map(year => (
								<option value={year}>{year}</option>
							))}
						</select>
					</div>
					<div className="items border">
						{dataFilterred.map(item => (
							<CardPDF item={item} />
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default SearchLiterature;
