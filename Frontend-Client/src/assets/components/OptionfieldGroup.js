import React from 'react';
import './OptionfieldGroup.css';

const OptionfieldGroup = ({ options, onOptionClick, optionColor }) => (
  <div className={`option-field-group${optionColor ? ' ' + optionColor : ''}`}>
    {options.map((option, idx) => (
      <div
        key={option.id || idx}
        className={`option-item${optionColor ? ' ' + optionColor : ''}`}
        onClick={() => onOptionClick(option)}
      >
        {option.optionText || option.title}
      </div>
    ))}
  </div>
);

export default OptionfieldGroup;