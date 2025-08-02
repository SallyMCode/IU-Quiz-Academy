import React from 'react';
import './OptionfieldGroup.css';

function OptionfieldGroup({ options, onOptionClick }) {
  return (
    <div className="option-field-group">
      {options.map((option, idx) => (
        <div
          key={option.id || idx}
          className={`option-item${option.optionColor ? ' ' + option.optionColor : ''}`}
          onClick={() => typeof onOptionClick === 'function' && onOptionClick(option, idx)}
        >
          {option.optionText || option.title || option.name}
        </div>
      ))}
    </div>
  );
}

export default OptionfieldGroup;