// /home/tao/projects/online-resume/raj-manghani-odyssey/src/components/DetailPanel/DetailPanel.jsx
// Removed React import
// import './DetailPanel.css'; // To be replaced
import styles from './DetailPanel.module.scss'; // Use SCSS module

const DetailPanel = ({ data, onClose }) => {
  // Removed console logs

  if (!data) {
    return null;
  }

  const { name, vitals, description, funFact } = data;

  return (
    // Use styles object
    <div className={styles.detailPanel}>
      <button className={styles.closeButton} onClick={onClose}>×</button>
      {name && <h3>{name}</h3>}
      {vitals && <p><strong>Vitals:</strong> {vitals}</p>}
      {description && <p>{description}</p>}
      {funFact && <p><em>Fun Fact:</em> {funFact}</p>}
    </div>
  );
};

export default DetailPanel;
