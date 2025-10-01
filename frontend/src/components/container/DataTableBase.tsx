import React from "react";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";

export default function DataTableBase( props: {columns: any[], data: any[], denseTrue: boolean, classes: string} ) {

    const [filterText, setFilterText] = useState('');
    const [filteredItems, setFilteredItems] = useState(props.data);

    useEffect(() => {
        
    })

    return (
        <div>
            <div className="z-0">
                <input
                    type="text"
                    placeholder="Search My Tasks..."
                    className="mb-4 p-2 border rounded border-gray-300 w-50"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
                <button
                    className="py-2 px-3 bg-[#153243] text-white border border-[#153243] rounded ml-1"
                    onClick={() => {
                        setFilterText('');
                    }}
                >
                    X
                </button>
            </div>
            <DataTable
                columns={props.columns}
                data={filteredItems}
                dense={props.denseTrue}
                className={`border border-gray-200 ${props.classes}`}
                fixedHeader={true}
                pointerOnHover={true}
                highlightOnHover={true}
                theme={document.documentElement.getAttribute('class') == 'dark' ? 'dark' : 'default'}
            />
        </div>
    );
}