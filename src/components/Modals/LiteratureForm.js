import { useState } from 'react';
import Swal from 'sweetalert2';
import AddLiteratureModal from './AddLiteratureModal';

import { API } from '../../config/api';
const LiteratureForm = ({ oldData, refresh }) => {
	const [data, setData] = useState(oldData);
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
			if (
				fileList[0].type === 'image/jpeg' ||
				fileList[0].type === 'image/png'
			) {
				setPreview(URL.createObjectURL(fileList[0]));
			}
		}
	};

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			};
			console.log(data);
			const formData = new FormData();
			formData.set('title', data.title);
			formData.set('publication_date', data.publication_date);
			formData.set('pages', data.pages);
			formData.set('ISBN', data.isbn);
			formData.set('author', data.author);
			formData.set('attachment', data.attachment, data?.attachment.name);
			formData.set('thumbnail', data.thumbnail);
			// Insert data to database here ...
			const response = await API.patch(
				`/literatures/${oldData?.id}`,
				formData,
				config
			);
			console.log(response);
			if (response?.status === 200) {
				refresh();
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: 'Literature updated',
				});
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

	return (
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
				<input
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
				<div className="mt-2 mb-4">
					<input
						type="file"
						id="thumbnail"
						placeholder="Attach file"
						className="filestyle"
						onChange={handleOnChange}
					/>
					<label htmlFor="thumbnail">
						<div className="attach-btn d-flex justify-content-around pointer">
							<p className="avenir pt-2 w-50">Attach Thumbnail</p>
							<img
								src="/assets/paperclip.png"
								height="30"
								alt=""
								className="ms-5 mt-2"
							/>
						</div>
					</label>
				</div>
			</div>
			{preview ? (
				<div className="box-lg">
					<img src={preview} alt="preview" className="box-lg" />
				</div>
			) : (
				<></>
			)}
			<div className="d-flex justify-content-end">
				<button
					className="form-btn pointer"
					data-bs-dismiss="modal"
					onClick={e => {
						handleShow();
						handleSubmit(e);
					}}
				>
					Update
				</button>
			</div>
			{/* <AddLiteratureModal handleClose={handleClose} show={show} /> */}
		</div>
	);
};

export default LiteratureForm;
