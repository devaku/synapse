import PopupModalContainer from '../components/container/modal_containers/popup_modal_container';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../lib/hooks/auth/useAuth';
import HeaderContainer from '../components/container/header_container';

// DataTableBase Testing Imports
import DataTable from '../components/container/DataTableBase';
import Data from '../../testing_jsons/logs_table_testing_extended_complex.json';

export default function DebugPage() {
	const [showModal, setShowModal] = useState<boolean>(false);

	const { keycloak, isAuthenticated, token } = useAuth();

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

	// DataTableBase testing
	const [data, setData] = useState(Data.data || []);

	const columns = [
		{
			name: 'Log ID',
			selector: (row) => row.logID,
			sortable: true,
			maxwidth: '10px',
			grow: 0,
		},
		{
			name: 'User',
			selector: (row) => row.user,
			sortable: true,
			grow: 1,
		},
		{
			name: 'Created At',
			selector: (row) => row.createdAt,
			sortable: true,
			grow: 1,
		},
	];

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
						keycloak.logout({
							redirectUri: 'http://localhost:3000',
						});
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

			<HeaderContainer pageTitle={'Debug Page'}>
				<div>This is inside the header container</div>
			</HeaderContainer>

			{/* Testing DataTableBase */}
			<div>
				<DataTable
					columns={columns}
					data={data}
					selectableRows
				/>
			</div>


		</div>
	);
}
