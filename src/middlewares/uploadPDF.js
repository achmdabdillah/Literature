// import package here
const multer = require('multer');

exports.uploadPDF = (attachment, path) => {
	// define storage destination
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, `uploads/${path}`);
		},
		filename: function (req, file, cb) {
			//second params is the filename
			cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ''));
		},
	});

	// define function for file filtering
	const fileFilter = (req, file, cb) => {
		if (file.fieldname === attachment) {
			if (!file.originalname.match(/\.(PDF|pdf)$/)) {
				req.fileValidationError = {
					message: 'Only pdf file are allowed!',
				};

				return cb(new Error('Only pdf file are allowed'), false);
			}
			cb(null, true);
		}
	};

	// maximum size for file upload
	const sizeInMB = 20;
	const maxSize = sizeInMB * 1024 * 1024;

	const upload = multer({
		storage,
		fileFilter,
		limits: {
			fileSize: maxSize,
		},
	}).single(attachment);

	return (req, res, next) => {
		upload(req, res, function (err) {
			if (req.fileValidationError) {
				return res.status(400).send(req.fileValidationError);
			}

			if (!req.file && !err) {
				return res.status(400).send({
					status: 'failed',
					message: 'please upload file',
				});
			}

			if (err) {
				if (err.code === 'LIMIT_FILE_SIZE') {
					return res.status(400).send({
						message: 'Max file sized is 10MB',
					});
				}
				return res.status(400).send(err);
			}
			return next();
		});
	};
};
