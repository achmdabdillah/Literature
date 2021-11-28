import { useState } from 'react';
import { useHistory } from 'react-router';
import Swal from 'sweetalert2';
import Nav from '../components//Nav';

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
		thumbnail: '',
	});
	console.log(data);
	const [preview, setPreview] = useState('');

	const handleOnChange = e => {
		setData(prevState => ({
			...prevState,
			[e.target.id]:
				e.target.type === 'file' ? e.target.files[0] : e.target.value,
		}));
		if (e.target.type === 'file') {
			const fileList = e.target.files;
			// console.log(fileList[0].type);
			if (fileList[0].type === 'image/jpeg') {
				console.log(fileList);
				setPreview(URL.createObjectURL(fileList[0]));
			}
		}
	};

	const handleOnSubmit = async e => {
		try {
			e.preventDefault();
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			};
			const formData = new FormData();
			// console.log(data);
			formData.set('title', data.title);
			formData.set('publication_date', data.publication_date);
			formData.set('pages', data.pages);
			formData.set('ISBN', data.isbn);
			formData.set('author', data.author);
			formData.set('attachment', data.attachment);
			formData.set('thumbnail', data.thumbnail);
			// Insert data trip to database here ...
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
			if (error) throw error;
			Swal.fire({
				icon: 'error',
				title: 'Oops..',
				text: 'Something went wrong',
			});
		}
	};
	return (
		<>
			<Nav />
			<div className="container">
				<div className="container my-5">
					<h1>Add Literature</h1>
				</div>
				<form onSubmit={handleOnSubmit}>
					<label htmlFor="title">Title</label>
					<input
						type="text"
						className="input-group"
						id="title"
						onChange={handleOnChange}
						value={data.title}
					/>
					<label htmlFor="publication_date">Publication Date</label>
					<input
						type="date"
						className="input-group"
						id="publication_date"
						onChange={handleOnChange}
						value={data.publication_date}
					/>
					<label htmlFor="pages">Pages</label>
					<input
						type="text"
						className="input-group"
						id="pages"
						onChange={handleOnChange}
						value={data.pages}
					/>
					<label htmlFor="isbn">ISBN</label>
					<input
						type="text"
						className="input-group"
						id="isbn"
						onChange={handleOnChange}
						value={data.isbn}
					/>
					<label htmlFor="author">Author</label>
					<input
						type="text"
						className="input-group"
						id="author"
						onChange={handleOnChange}
						value={data.author}
					/>

					<p>files</p>
					<input
						type="file"
						id="attachment"
						placeholder="Attach file"
						className="filestyle"
						onChange={handleOnChange}
					/>
					<label htmlFor="attachment" className="justify-content-between">
						<div className="btn attach-btn d-flex justify-content-between">
							<p href="" className="avenir status-orange">
								Attach Here
							</p>
							<img src="/assets/paperclip.png" alt="" className="ms-5" />
						</div>
					</label>
					<p>thumbnail</p>
					<input
						type="file"
						id="thumbnail"
						placeholder="Attach file"
						className="filestyle"
						onChange={handleOnChange}
					/>
					<label htmlFor="thumbnail" className="justify-content-between">
						<div className="btn attach-btn d-flex justify-content-between">
							<p href="" className="avenir status-orange">
								Attach Here
							</p>
							<img src="/assets/paperclip.png" alt="" className="ms-5" />
						</div>
					</label>
					<div className="box-lg">
						{preview ? (
							<img src={preview} alt="preview" className="box-lg" />
						) : (
							<p>no image to show</p>
						)}
					</div>
					<button className="form-btn">Add Literature</button>
				</form>
			</div>
		</>
	);
};

export default AddLiterature;
