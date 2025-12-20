import Button from '../../ui/button';
import PopupModalContainer from '../../container/modal_containers/popup_modal_container';
import { useError } from '../../../lib/contexts/ErrorContext';
import { useEffect } from 'react';

export function ErrorWarningModal({
    isOpen,
    open,
    close
}: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}) {
    const { error, clearError } = useError();

    useEffect(() => {
        if (error) {
            open()
        }
    }, [error])

    return (
        <PopupModalContainer isOpen={isOpen}>
            <div className="flex flex-col mx-12 my-5 gap-4">
                <h2 className="text-ttg-black text-3xl font-semibold">An error has occured</h2>
                <div className="bg-red-300 border-red-400 border-2 rounded-md p-3">
                    <p className="text-red-950 font-semibold text-lg ml-5">{error?.name}</p>
                    <p className="text-red-900 pb-2">{error?.message}</p>
                    <div className="text-red-950 overflow-y-auto h-100 thin-scrollbar">{error?.stack}</div>
                </div>
                <div className="w-20">
                    <Button
                        type="Info"
                        text="Okay"
                        onClick={() => {
                            close()
                            clearError()
                        }}
                    ></Button>
                </div>
            </div>
        </PopupModalContainer>
    );
}
