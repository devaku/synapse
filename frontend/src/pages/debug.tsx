import PopupModalContainer from '../components/container/modal_containers/popup_modal_container';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function DebugPage() {
	const [showModal, setShowModal] = useState<boolean>(false);
	function handleModalDisplay() {
		setShowModal(!showModal);
	}

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

	const onSubmit = (data: any) => console.log(data);

	function handleCustomSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		console.log(e.currentTarget[0]);
		let a = e.currentTarget[0] as HTMLInputElement;
		console.log(a.value);
	}

	return (
		<div className="p-10">
			<div>This is the debug page</div>

			<div className="flex flex-row gap-10">
				<button
					className="bg-gray-100 border-1 border-black p-2 text-black hover:bg-amber-300 active:bg-amber-800"
					onClick={handleModalDisplay}
				>
					Modal
				</button>
				<button
					className="bg-gray-100 border-1 border-black p-2 text-black hover:bg-amber-300 active:bg-amber-800"
					onClick={() => {
						window.location.href = '/';
					}}
				>
					Return Back
				</button>
				<button
					className="bg-gray-100 border-1 border-black p-2 text-black hover:bg-amber-300 active:bg-amber-800"
					onClick={() => {
						window.location.href = '/dashboard';
					}}
				>
					Dashboard
				</button>

				<PopupModalContainer isOpen={showModal}>
					<button
						className="p-4 bg-yellow-400"
						onClick={() => handleModalDisplay()}
					>
						Close Modal
					</button>
				</PopupModalContainer>
			</div>

			{/* FORM TEST */}
			<div className="w-lg">
				<form onSubmit={handleSubmit(onSubmit)}>
					<div>
						<p>This is a form test</p>
					</div>
					{/* register your input into the hook by invoking the "register" function */}
					<div>
						<label htmlFor="example">
							This is the first field:
						</label>
						<input defaultValue="test" {...register('example')} />
					</div>
					<div>
						<label htmlFor="examplRequired">
							This is the 2nd field:
						</label>
						<input
							className=""
							placeholder="Cannot be empty"
							{...register('exampleRequired', {
								validate: {
									myCustomValidation: (exampleRequired) => {
										if (
											exampleRequired.substring(0, 1) ==
											'a'
										) {
											return true;
										} else {
											return false;
										}
									},
								},
							})}
						/>
					</div>

					{/* include validation with required or other standard HTML validation rules */}

					{/* errors will return when field validation fails  */}
					{errors.exampleRequired && (
						<span>Custom validation failed</span>
					)}

					<div>
						<input
							className="bg-gray-100 border-1 border-black p-2 text-black hover:bg-amber-300 active:bg-amber-800"
							type="submit"
						/>
					</div>
				</form>
			</div>

			{/* ANOTHER FORM */}
			<div>
				<form onSubmit={handleCustomSubmit}>
					<label htmlFor="">Description: </label>
					<input type="text" name="description" id="" />
					<button type="submit">Submit</button>
				</form>
			</div>
		</div>
	);
}
