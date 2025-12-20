import Button from '../../ui/button';
import PopupModalContainer from '../../container/modal_containers/popup_modal_container';

export function ErrorWarningModal({
    isOpen,
    handleModalToggle,
}: {
    isOpen: boolean;
    handleModalToggle: () => void;
}) {
    return (
        <PopupModalContainer isOpen={isOpen}>
            <div className="flex flex-col mx-12 my-5 gap-4">
                <h2 className="text-3xl font-semibold">An error has occured</h2>
                <div className="bg-red-300 border-red-400 border-2 rounded-md p-3">
                    <p className="text-red-950 font-semibold text-lg ml-5">Message</p>
                    <p className="text-red-900">What happened...</p>
                </div>
                <div className="w-20">
                    <Button
                        type="Info"
                        text="Okay"
                        onClick={() => {
                            handleModalToggle()
                        }}
                    ></Button>
                </div>
            </div>
        </PopupModalContainer>
    );
}
