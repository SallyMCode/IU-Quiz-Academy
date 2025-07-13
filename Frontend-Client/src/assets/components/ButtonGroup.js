import React from 'react';
import './ButtonGroup.css';

const ButtonGroup = ({ buttons }) => {
  return (
    <div className="button-group">
      {buttons.map((button, index) => (
        <button
          key={index} // Einzigartiger Schlüssel für React-Listen
          className={`button-${button.type}`} // Z.B. "button-primary" oder "button-secondary"
          onClick={button.onClick} // Klick-Handler
          disabled={button.disabled} // Optional: Button deaktivieren
        >
          {button.label} {/* Dynamische Beschriftung */}
        </button>
      ))}
    </div>
  );
};

export default ButtonGroup;