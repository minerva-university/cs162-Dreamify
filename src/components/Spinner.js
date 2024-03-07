import React from 'react';

//will be changed later
const Spinner = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner" style={{ border: '4px solid rgba(0, 0, 0, .1)', width: '50px', height: '50px', borderRadius: '50%', borderLeftColor: 'transparent', animation: 'spin 1s linear infinite' }}></div>
    </div>
);

export default Spinner;