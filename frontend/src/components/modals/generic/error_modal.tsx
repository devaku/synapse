import PopupModalContainer from '../../container/modal_containers/popup_modal_container';

type errorModalProps = {
	isOpen: boolean;
	handleModalDisplay: () => void;
	error_title: string;
	error_message: string;
};

export default function ErrorModal({
	isOpen,
	handleModalDisplay,
	error_title,
	error_message,
}: errorModalProps) {
	return <></>;
}
