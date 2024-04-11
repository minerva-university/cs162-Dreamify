import React from "react";

const Spinner = ({ text = '', creatingChild = false, creatingStory = false }) => {
  const spinnerStyle = {
    display: "flex",
    flexDirection: "column",
    marginTop: "5%",
    alignItems: "center",
    height: "100vh",
  };

  const spinnerKeyframes = `
  @keyframes advancedSpin {
    0% { transform: rotate(0deg); }
    50% { transform: rotate(180deg); opacity: 0.5; }
    100% { transform: rotate(360deg); }
  }
  `;

  const defaultSpinnerStyle = {
    border: "4px solid rgba(0, 0, 0, .1)",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    marginTop: "15%",
    borderTopColor: "#3498db",
    animation: "advancedSpin 2s linear infinite",
  };

  const typingTextStyle = {
    width: "60%",
    height: "30px",
    marginBottom: "10px",
    background: "linear-gradient(to right, #eee 8%, #ddd 18%, #dbdbdb 33%, #eee 70%)",
    borderRadius: "5px",
    animation: "slowFade 3s ease-in-out infinite",
  };

  const typingTextStyle2 = {
    width: "60%",
    height: "30px",
    marginBottom: "10px",
    background: "linear-gradient(to right, white 0%, white 15%,  #dbdbdb 33%, #eee 70%)",
    borderRadius: "5px",
    animation: "slowFade 3s ease-in-out infinite",
  };

  const additionalText = {
    fontSize: "15px",
    fontWeight: "bold",
    animation: "slowFade 3s ease-in-out infinite",
  };

  const typingTextStyle3 = {
    width: "60%",
    height: "30px",
    background:  "linear-gradient(to right, #eee 8%, #ddd 18%, #dbdbdb 33%, white 85%, white 100%)",
    borderRadius: "5px",
    animation: "slowFade 3s ease-in-out infinite",
  };

  const typingKeyframes = `
  @keyframes slowFade {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 1; }
  }
  `;

  const childCreationWrapper = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f5096',
    borderRadius: '40%',
    marginTop: '2%',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
  };

  // Determine which spinner to show
  const handleLoading = () => {
    if (creatingChild) {
      return (
        <>
          <style>{typingKeyframes}</style>
          <style>{spinnerKeyframes}</style>
          <span style={childCreationWrapper}>
            <svg width="100" height="100" style={{ overflow: 'visible', animation: "slowFade 2s infinite ease-in-out"}}>
              <circle cx="50" cy="30" r="20" fill="white" />
              <path d="M15,65 Q50,100 85,65 Q70,55 50,55 Q30,55 15,65" fill="white"/>
            </svg>
          </span>
          <div className="spinner" style={defaultSpinnerStyle}></div>
        </>
      );
    } else if (creatingStory) {
      return (
        <>
          <style>{typingKeyframes}</style>
          <div style={typingTextStyle2}></div>
          {Array.from({ length: 8 }, (_, index) => (
            <React.Fragment key={index}>
              <div style={typingTextStyle}></div>
            </React.Fragment>
          ))}
          <div style={typingTextStyle3}></div>
          <style>{spinnerKeyframes}</style>
        <div className="spinner" style={defaultSpinnerStyle}></div>
        </>
      );
    } else {
      return (
        <>
        <style>{spinnerKeyframes}</style>
        <div className="spinner" style={defaultSpinnerStyle}></div>
        </>
      );
    }
  };

  return (
    <div style={spinnerStyle}>
      <style>{typingKeyframes}</style>
      {text && <div style={{...additionalText, marginBottom: "20px" , animation: "slowFade 2s infinite ease-in-out"}} aria-live="polite">{text}</div>}
      {handleLoading()}
    </div>
  );
};

export default Spinner;