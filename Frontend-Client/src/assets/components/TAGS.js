import React from 'react';
import './TAGS.css';

const statusClassMap = {
  Neutral: 'tag-neutral',
  Medium: 'tag-prio-medium',
  High: 'tag-prio-high',
  Positive: 'tag-positive',
  Negative: 'tag-negative',
};

export default function TAGS({ status = 'Neutral', text = '', style }) {
  const statusClass = statusClassMap[status] || statusClassMap.Neutral;

  return (
    <span className={`tag-status ${statusClass}`} style={style}>
      {text}
    </span>
  );
}