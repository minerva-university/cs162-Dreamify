import React from 'react';

const PopUpAlert = ({ isVisible, message, onClose }) => {
  if (!isVisible) return null;

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
        zIndex: '999', // Ensure it's below the popup but above other content
      }} onClick={onClose} />  {/* Optional: Close on background click */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        minWidth: '300px',
        backgroundColor: '#ffefef',
        color: 'black',
        border: '1px solid #b71c1c',
        padding: '15px',
        zIndex: '1000',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
      }}>
        <h3>Server Error</h3>
        <p>{message}</p>
        <button onClick={onClose} style={{
          padding: '8px 16px',
          fontSize: '16px',
          backgroundColor: '#b71c1c',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>Close</button>
      </div>
    </>
    
  );
};

export default PopUpAlert;
