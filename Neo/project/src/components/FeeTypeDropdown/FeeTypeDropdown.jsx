import React from 'react';
import Select from 'react-select';

const FeeTypeDropdown = ({ feeTypes, FEEValues, handleFeeChange, disableFields }) => {
    const options = feeTypes.map((category) => ({
        value: category.description1,
        label: category.description1,
    }));

    const handleChange = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
        handleFeeChange(values);
    };

    const selectedValues = options.filter(option => FEEValues.includes(option.value));

    const customStyles = {
        container: (provided) => ({
            ...provided,
            width: '250px',
            margin: '10px 0',
            // marginLeft: '20px'
        }),
        control: (provided) => ({
            ...provided,
            minHeight: '30px',
            height: 'auto'
        }),
        valueContainer: (provided) => ({
            ...provided,
            maxHeight: disableFields ? 'auto' : '240px', // Fixed height for disabled fields, auto for enabled fields
            overflowY: 'auto', // Enable vertical scrolling only if disabled
            display: 'flex',
            flexWrap: 'wrap', // Allow wrapping of selected options
            '&::-webkit-scrollbar': {
                width: '8px'
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '10px'
            },
            '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
            },
            '&::-webkit-scrollbar-button': {
                display: 'none' // Hide scrollbar arrows
            }
        }),
        multiValue: (provided) => ({
            ...provided,
            display: 'flex',
            alignItems: 'center'
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            display: disableFields ? 'none' : 'flex',
            alignItems: 'center',
            cursor: 'pointer'
        })
    };

    return (
        <div>
            <label htmlFor="fee-type">Fee Type:</label>
            <Select
                id="fee-type"
                isMulti
                options={options}
                value={selectedValues}
                onChange={handleChange}
                isDisabled={disableFields}
                styles={customStyles}
            />
        </div>
    );
};

export default FeeTypeDropdown;
