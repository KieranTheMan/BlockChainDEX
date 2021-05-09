import React, { useState } from 'react';

function Dropdown ({onSelect, activeItem, items}) {
    const [dropDownVisible, setDropdownVisible] = useState(false);

    const selectItem = (e, item) => {
        e.preventDefault();
        setDropdownVisible(!dropDownVisible);
        onSelect(item);
    }
    return (
        <div className='dropdown ml-3'>
            <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    onClick = {() => setDropdownVisible(!dropDownVisible)}
            >
                    {activeItem.label}
            </button>

            <div className={`dropdown-menu ${dropDownVisible ? 'visible' : ''}`}>
                {items && items.map((item, i) => (
                <a
                className={`dropdown-item ${item.value === activeItem.value ? 'active' : null}`}
                href='#'
                key={i}
                onClick={e => selectItem(e, item.value)}
                >
                    {item.label}
                </a>
                ))}

            </div>
        </div>
    );
}

export default Dropdown;