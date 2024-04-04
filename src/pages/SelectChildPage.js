import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useApi } from "../contexts/ApiProvider";
import ChildProfileCard from "../components/ChildProfileCard";
import Spinner from "../components/Spinner";
import "./styles/SelectChildPage.css";

export default function SelectChildPage() {
  
  useEffect(() => {
    document.title = "Dreamify | New Story";
  }, []);
  

  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const api = useApi();
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChildren = async () => {
      setLoading(true);
      try {
        const response = await api.getAllChildren();
        setChildren(response.children || []);
      } catch (error) {
        setChildren([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, [api]);

  const handleClick = (childId) => {
    return () => {
      navigate(`/newstory/${childId}`);
    };
  };

  if (loading) {
    return <Spinner />;
  }

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
      <h1> {pageTitle} </h1>
      <div className="hr-style"></div>
      <div className="child-cards-container">{renderChildren}</div>
    </div>
  );
}
