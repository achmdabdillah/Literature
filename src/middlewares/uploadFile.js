const multer = require('multer');

module.exports = () => {
	// create destination to store file
	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			if (file.fieldname === 'attachment') {
				cb(null, './uploads/file/');
			} else if (file.fieldname === 'thumbnail') {
				cb(null, './uploads/thumbnail/');
			}
		},
		// destination: function (req, file, cb) {
		// 	for (let tst of test) {
		// 		cb(null, `uploads/${tst}`);
		// 	}
		// },
		filename: function (req, file, cb) {
			cb(null, `${Date.now()}-${file.originalname}`);
		},
	});

	// file filter so only music are allowed
	const fileFilter = function (req, file, cb) {
		if (file.fieldname === 'attachment') {
			if (!file.originalname.match(/\.(PDF|pdf)$/)) {
				req.fileValidationError = {
					message: 'Only pdf file are allowed!',
				};

				return cb(new Error('Only pdf file are allowed'), false);
			}
			cb(null, true);
		}
		if (file.fieldname === 'thumbnail') {
			if (!file.originalname.match(/\.(jpg|JPG|JPEG|jpeg|png|PNG|svg)$/)) {
				req.fileValidationError = {
					message: 'Only image file are allowed!',
				};

				return cb(new Error('Only image file are allowed'), false);
			}
			cb(null, true);
		}

		cb(null, true);
	};

	// max file size in MB
	const sizeMB = 20;
	const maxSize = sizeMB * 1024 * 1024;

	//upload function
	const upload = multer({
		storage,
		fileFilter,
		limits: {
			fileSize: maxSize,
		},
	}).fields([
		{
			name: 'image',
			maxCount: 1,
		},
		{
			name: 'attachment',
			maxCount: 1,
		},
		{
			name: 'thumbnail',
			maxCount: 1,
		},
	]);

	return (req, res, next) => {
		// if (!req.files) {
		// 	next();
		// }
		upload(req, res, function (err) {
			console.log(req.files.attachment[0]);
			if (!req.files.attachment[0]) {
				req.files.attachment = null;
			}
			if (err) {
				if (err.code == 'LIMIT_FILE_SIZE') {
					req.session.message = {
						type: 'danger',
						message: 'Error, max file size is 10MB',
					};
					return res.redirect(req.originalUrl);
				}

				req.session.message = {
					type: 'danger',
					message: 'upload file error',
				};
				return res.redirect(req.originalUrl);
			}
			return next();
		});
	};
};
