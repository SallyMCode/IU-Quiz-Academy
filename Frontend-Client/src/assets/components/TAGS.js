import React from 'react';
import './TAGS.css';

const statusClassMap = {
  Neutral: 'tag-neutral',
  Medium: 'tag-prio-medium',
  High: 'tag-prio-high',
  Positive: 'tag-positive',
  Negative: 'tag-negative',
};

function TAGS({ status = 'Neutral', text = '' }) {
  const statusClass = statusClassMap[status] || statusClassMap.Neutral;

  return (
    <span className={`tag-status ${statusClass}`}>
      <span className="tag-status-text">{text}</span>
    </span>
  );
}

export default TAGS;