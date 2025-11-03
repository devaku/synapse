import { type radioType } from '../../lib/types/custom';

export function SelectionBox({ name, selected = false, onClick }: radioType) {
    return (
        <div className="flex items-center gap-2 w-40">
            <button
                onClick={onClick}
                className={`
                    flex items-center justify-center size-5 rounded-sm border-ttg-black/40
                    hover:cursor-pointer hover:border-6
                    ${selected == true ? 'border-6 border-ttg-dark-blue' : 'border-2'}
                `}
            ></button>
            <p>{name}</p>
        </div>
    );
}
