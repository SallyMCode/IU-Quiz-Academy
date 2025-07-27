import React from 'react';
import './OptionfieldGroup.css';

const OptionFieldGroup = ({ options, onOptionClick, optionColor }) => (
  <div className={`option-field-group${optionColor ? ' ' + optionColor : ''}`}>
    {options.map((option, idx) => (
      <div
        key={idx}
        className={`option-item${optionColor ? ' ' + optionColor : ''}`}
        onClick={() => onOptionClick(option)}
      >
        {option}
      </div>
    ))}
  </div>
);

export default OptionFieldGroup;