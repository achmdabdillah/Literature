<div>
	{state.user.id !== data.idUser ? (
		<>
			{myCol.find(item => item.literatures.id === data?.id) ? (
				<>
					<button
						onClick={deleteCollection}
						className="my-collection-btn rounded"
					>
						Remove
						<img
							className="ms-3"
							src="/assets/saved.png"
							height="20px"
							alt=""
						/>
					</button>
				</>
			) : (
				<>
					<button
						onClick={handleAddCollection}
						className="my-collection-btn rounded"
					>
						Add My Collection
						<img className="ms-3" src="/assets/save.png" height="20px" alt="" />
					</button>
				</>
			)}
		</>
	) : (
		<>
			{data?.status === 'Cancelled' ? (
				<>
					<button
						className="my-collection-btn rounded"
						data-bs-toggle="modal"
						data-bs-target="#staticBackdrop"
					>
						Edit
					</button>
					{/* modal start */}
					<div
						className="modal fade"
						id="staticBackdrop"
						data-bs-backdrop="static"
						data-bs-keyboard="false"
						tabindex="-1"
						aria-labelledby="staticBackdropLabel"
						aria-hidden="true"
					>
						<div className="modal-dialog w-110">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title" id="staticBackdropLabel">
										Edit literature
									</h5>
								</div>
								<div className="modal-body">
									<AddLiteratureForm refresh={getData} oldData={data} />
								</div>
							</div>
						</div>
					</div>
					{/* modal ends */}
				</>
			) : (
				<></>
			)}
		</>
	)}
</div>;
