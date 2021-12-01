import { Modal, Button } from 'react-bootstrap';

const AddLiteratureModal = ({ handleSubmit, handleClose, show }) => {
	return (
		<Modal show={show} onHide={handleClose} centered>
			<Modal.Header className="d-flex justify-content-center">
				<Modal.Title>Add literature ?</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="avenir-thin">
					<p className="mx-auto my-0 fs-5 w-75">
						If the literature is approved, You can't delete or make changes
						later
					</p>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<div>
					<Button
						onClick={() => {
							handleClose();
							handleSubmit();
						}}
						className="form-btn m-0"
					>
						Add
					</Button>
				</div>
			</Modal.Footer>
		</Modal>
	);
};

export default AddLiteratureModal;
