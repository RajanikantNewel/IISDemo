import React, { useState } from "react";

const InputField = ({ label, id, value, onChange, onKeyDown }) => {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input
                type="text"
                id={id}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
            />
        </div>
    );
};

export default InputField;
