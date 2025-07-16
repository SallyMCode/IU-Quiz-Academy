import React from 'react';
import './OptionfieldGroup.css';

const OptionFieldGroup = ({ options, onOptionClick }) => {
  return (
    <div className="option-field-group">
      {options.map((option, index) => (
        <div
          key={index} // Einzigartiger Schlüssel ist wichtig für React-Listen
          className="option-item"
          onClick={() => onOptionClick(option)} // Handler für Klick-Ereignis
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default OptionFieldGroup;