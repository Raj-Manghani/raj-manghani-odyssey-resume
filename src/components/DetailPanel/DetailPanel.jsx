// /home/tao/projects/online-resume/raj-manghani-odyssey/src/components/DetailPanel/DetailPanel.jsx
import React from 'react';
import './DetailPanel.css';

const DetailPanel = ({ data, onClose }) => {
  // --- ADD LOGGING HERE ---
  console.log("[DetailPanel] Received data:", data);
  // --- END LOGGING ---

  if (!data) {
    console.log("[DetailPanel] Rendering null (no data)");
    return null;
  }

  const { name, vitals, description, funFact } = data;
  console.log(`[DetailPanel] Rendering panel for: ${name}`);

  return (
    <div className="detailPanel">
      <button className="closeButton" onClick={onClose}>×</button>
      {name && <h3>{name}</h3>}
      {vitals && <p><strong>Vitals:</strong> {vitals}</p>}
      {description && <p>{description}</p>}
      {funFact && <p><em>Fun Fact:</em> {funFact}</p>}
    </div>
  );
};

export default DetailPanel;