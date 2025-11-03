import { useState, useRef, useEffect } from 'react';
import { type radioType } from '../../lib/types/custom';
import { SelectionBox } from './selection_box';

export default function SelectGroup({ selectionBoxes }: { selectionBoxes: Array<radioType> }) {
    const alreadySelected = useRef(localStorage.getItem('notificationFilters') || "[]");
    
    const [activeBoxes, setActiveBoxes] = useState<string[]>(JSON.parse(alreadySelected.current));

    useEffect(() => {
        localStorage.setItem('notificationFilters', JSON.stringify(activeBoxes))
    }, [activeBoxes])

    return (
        <div className="flex my-5 ml-5">
            {selectionBoxes.map((box, index) => (
                <SelectionBox
                    key={index}
                    name={box.name}
                    selected={!!activeBoxes.find((name) => name == box.name)}
                    onClick={() => {
                        const result = !!activeBoxes.find((name) => name == box.name)
                        if (result) {
                            const index = activeBoxes.indexOf(box.name)
                            const newArray = [...activeBoxes]
                            newArray.splice(index, 1)

                            setActiveBoxes(newArray)
                        } else {
                            setActiveBoxes([...activeBoxes, ...[box.name]]);
                        }

                        if (box.onClick === undefined) {
							return;
						}
						box.onClick();
                    }}
                />
            ))}
        </div>
    );
}
