import { useState } from 'react';
import { useHistory } from 'react-router';
import Swal from 'sweetalert2';
import Nav from '../components/Structure/Nav';
import AddLiteratureModal from '../components/Modals/AddLiteratureModal';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

import { API } from '../config/api';

const AddLiterature = () => {
	const history = useHistory();
	const [data, setData] = useState({
		title: '',
		publication_date: '',
		pages: '',
		isbn: '',
		author: '',
		attachment: '',
	});

	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [preview, setPreview] = useState('');
	const [PDFName, setPDFName] = useState(null);

	const handleOnChange = e => {
		setData(prevState => ({
			...prevState,
			[e.target.id]:
				e.target.type === 'file' ? e.target.files[0] : e.target.value,
		}));
		if (e.target.type === 'file') {
			const fileList = e.target.files;
			if (fileList[0].type === 'application/pdf') {
				setPDFName(fileList[0].name);
			}
			setPreview(URL.createObjectURL(fileList[0]));
		}
	};

	const handleSubmit = async () => {
		try {
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			};
			const formData = new FormData();
			formData.set('title', data.title);
			formData.set('publication_date', data.publication_date);
			formData.set('pages', data.pages);
			formData.set('ISBN', data.isbn);
			formData.set('author', data.author);
			formData.set('attachment', data.attachment);
			// Insert data to database here ...
			const response = await API.post('/literatures', formData, config);
			if (response?.status === 200) {
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: 'Literature added',
				});
				history.push('/profile');
			}
		} catch (error) {
			const msg =
				error.response.data.message || error.response.data.error.message;
			Swal.fire({
				icon: 'error',
				title: 'Oops..',
				text: msg,
			});
		}
	};

	const onFocus = e => {
		e.target.type = 'date';
	};
	const hideLabel = e => {
		let label = e.target.previousSibling;
		label.classList.add('filestyle');
	};
	const showLabel = e => {
		if (!data.author) {
			let label = e.target.previousSibling;
			label.classList.remove('filestyle');
		}
	};
	return (
		<>
			<Nav />
			<div className="container">
				<div className="my-4">
					<h1 className="timesNewRoman" style={{ fontSize: 36 }}>
						Add Literature
					</h1>
				</div>
				<div className="add-literature avenir-thin">
					<input
						type="text"
						className="input-group"
						id="title"
						onChange={handleOnChange}
						value={data.title}
						placeholder="Title"
					/>
					<input
						onFocus={onFocus}
						type="text"
						className="input-group"
						id="publication_date"
						onChange={handleOnChange}
						placeholder="Publication Date"
						value={data.publication_date}
					/>
					<input
						type="text"
						className="input-group"
						id="pages"
						onChange={handleOnChange}
						value={data.pages}
						placeholder="Pages"
					/>
					<input
						type="text"
						className="input-group"
						id="isbn"
						onChange={handleOnChange}
						value={data.isbn}
						placeholder="ISBN"
					/>
					<div className="relative">
						<label className="author-label" htmlFor="author">
							Author,{' '}
							<span style={{ color: '#929292' }}>
								Ex : E E Rizky, Astina Haris
							</span>
						</label>
						<input
							onFocus={hideLabel}
							onBlur={showLabel}
							type="text"
							className="input-group tst"
							id="author"
							onChange={handleOnChange}
							value={data.author}
						/>
					</div>

					<div className="d-flex flex-column">
						<div className="mb-4">
							<input
								type="file"
								id="attachment"
								placeholder="Attach file"
								className="filestyle"
								onChange={handleOnChange}
							/>
							<label htmlFor="attachment">
								<div className="attach-btn d-flex justify-content-around pointer">
									<p href="" className="avenir pt-2 w-50 pdf-name">
										{PDFName !== null ? PDFName : 'Attach Book File'}
									</p>
									<img
										src="/assets/paperclip.png"
										alt=""
										height="30"
										className="ms-5 mt-2"
									/>
								</div>
							</label>
						</div>
					</div>
					{preview ? (
						<div className="ms-5 mt-3 d-flex">
							<Document file={preview}>
								<Page pageNumber={1} />
							</Document>
						</div>
					) : (
						<></>
					)}
					<div className="d-flex justify-content-end">
						<button className="form-btn pointer" onClick={handleShow}>
							Add Literature
						</button>
					</div>
					<AddLiteratureModal
						handleSubmit={handleSubmit}
						handleClose={handleClose}
						show={show}
					/>
				</div>
			</div>
		</>
	);
};

export default AddLiterature;
