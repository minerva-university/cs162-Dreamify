import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useApi } from "../contexts/ApiProvider";
import ChildProfileCard from "../components/ChildProfileCard";
import Spinner from "../components/Spinner";
import "./styles/SelectChildPage.css";
import PopUpAlert from "../components/PopUpAlert";

export default function SelectChildPage() {
  // This function is used to create the page for selecting a child to create a new story for
  
  // Set the title of the page
  useEffect(() => {
    document.title = "Dreamify | New Story";
  }, []);
  
  // Set the state for the children, loading, and alert
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const api = useApi();
  const [alertVisible, setAlertVisible] = useState(false);

  const showAlert = () => {
    // This function is used to show an alert for server errors
    setAlertVisible(true);
  };

  const closeAlert = () => {
    // This function is used to close the alert for server errors
    setAlertVisible(false);
  };

  const popAnAlert = () => {
    // This function is used to create an alert for server errors
    const message = "We are having trouble accessing your children profiles, please try reloading or contacting us.";
    return(
      <PopUpAlert isVisible={alertVisible} message={message} onClose={closeAlert} />
    );
  };
  
  // Get the navigate function from the router
  const navigate = useNavigate();

  useEffect(() => {
    // This function is used to fetch the children profiles
    const fetchChildren = async () => {
      setLoading(true);
      try {
        const response = await api.getAllChildren();
        setChildren(response.children || []);
      } catch (error) {
        setChildren([]);
        showAlert();
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, [api]);

  const handleClick = (childId) => {
    // This function is used to handle the click event for selecting a child
    return () => {
      navigate(`/newstory/${childId}`);
    };
  };

  // If the page is loading, display a spinner
  if (loading) {
    return <Spinner />;
  }

  // If there are children, display the child profile cards using the ChildProfileCard component
  const renderChildren =
    children.length > 0 ? (
      children.map((child) => (
        <div
          key={child.child_id}
          onClick={handleClick(child.child_id)}
          style={{ cursor: "pointer" }}
        >
          <ChildProfileCard
            key={child.child_id}
            childId={child.child_id}
            disableEdit
          />
        </div>
      ))
    ) : (
      <div className="child-selection">
        <button onClick={() => navigate(`/addachild`)}>
          {" "}
          Create a new child profile
        </button>
      </div>
    );

  const pageTitle =
    children.length > 0
      ? "Select a child to create a new story for"
      : "You haven't added any children yet";

  return (
    <div className="select-child-page">
      {popAnAlert()}
      <h1> {pageTitle} </h1>
      <div className="hr-style"></div>
      <div className="child-cards-container">{renderChildren}</div>
    </div>
  );
}
