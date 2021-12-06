import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router';
import Nav from '../components/Structure/Nav';
import { API } from '../config/api';
import CardPDF from '../components/Cards/CardPDF';

const SearchLiterature = () => {
	const history = useHistory();

	// Get Data
	const { search } = useLocation();
	const [data, setData] = useState([]);
	const [allData, setAllData] = useState([]);
	const searchAll = search.split('&');
	const noDataTitle = searchAll[0].split('=')[1];

	const [input, setInput] = useState({
		title: '',
		year: '',
	});

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

	const handleOnChange = e => {
		setInput(prevState => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const [yearExist, setYearExist] = useState(false);

	const handleSearch = () => {
		if (!search.includes('year') || search.includes('year')) {
			if (input.title) {
				history.push(`/search?title=${input.title}`);
			}
			if (input.year) {
				history.push(`/search${searchAll[0]}&public_year=${input.year}`);
			}
			if (!input.title && !input.year) {
				history.push(`/search?title=`);
			}
		}
	};
	if (yearExist) {
		handleSearch();
		setYearExist(false);
	}

	useEffect(() => {
		getData();
		setInput({ title: '', year: '' });
	}, [search]);
	return (
		<>
			<Nav />
			<div className="container mt-2">
				<div className="w-50">
					<div className="input-group mb-3">
						<input
							type="text"
							className="form-control search-box"
							placeholder="Search for literature"
							name="title"
							onChange={handleOnChange}
						/>
						<button
							className="ms-2 search-btn rounded"
							type="button"
							id="button-addon2"
							onClick={handleSearch}
						>
							<img src="/assets/lup.png" height="30px" alt="" />
						</button>
					</div>
				</div>
				<div className="d-flex justify-content-between">
					<div className="d-flex flex-column">
						<p className="red">Anytime</p>
						<select
							className="search-box"
							name="year"
							onChange={e => {
								handleOnChange(e);
								setYearExist(true);
							}}
						>
							<option value=" ">All year</option>
							{years
								.sort()
								.reverse()
								.map(year => (
									<option key={year} value={year}>
										{year}
									</option>
								))}
						</select>
					</div>
					{dataFilterred.length !== 0 ? (
						<>
							<div className="items">
								{dataFilterred.map(item => (
									<CardPDF key={item?.id} item={item} />
								))}
							</div>
						</>
					) : (
						<div className="w-100 no-data d-flex flex-column">
							<img src="/assets/no-data.png" height="400" alt="" />

							<h1 className="my-5">
								Sorry, No results found for "{noDataTitle}"
							</h1>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default SearchLiterature;
