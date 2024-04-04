import React, { useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
import { useAuth } from '../contexts/AuthProvider';
import { useState } from 'react';
import ChildProfileCard from '../components/ChildProfileCard';
import Spinner from '../components/Spinner';
import { useNavigate } from "react-router-dom";
import './styles/UserProfilePage.css';


// Flambeau
export default function SelectChildPage() {
  
  useEffect(() => {
    document.title = "Dreamify | New Story";
  }, []);
  

  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [parentId, setParentId] = useState(null); 
  const api = useApi();
  const { getCurrentParent } = useAuth();

  // Get the parent id
  useEffect(() => {
    const fetchParentId = async () => {
      try {
        const parent = await getCurrentParent();
        setParentId(parent.parent_id);
      } catch (error) {
        console.error('Failed to fetch parent data:', error);
      }
    };
  
    fetchParentId();
  }, [getCurrentParent]);
  

  // Get the navigate function from the router
  const navigate = useNavigate();

  useEffect(() => {
  const fetchChildren = async() => {
    setLoading(true);
    try {
      const response = await api.getAllChildren();
      setChildren(response.children|| []);
    }
    catch (error) {
      setChildren([]);
    }
    finally {
    setLoading(false);
  }
  }
  fetchChildren();
  }
  , [api]);

  const handleClick = (childId) => {
    return () => {
      navigate(`/newstory/${childId}`);
    }
  }


  if (loading) {
    return <Spinner/>;
  }
  
  const renderChildren = children.length > 0 ? (
    children.map(child => (
      <div key={child.child_id} onClick={handleClick(child.child_id)} style={{ cursor: 'pointer' }}>
      <ChildProfileCard key={child.child_id} childId={child.child_id} />
      </div>
    ))
  ) : (
    <div className='child-selection'>
      <button onClick={() => navigate(`/addachild/${parentId}`)}> Create a new child profile</button>
    </div>
  );

  const pageTitle = children.length > 0 ? 'Who is the new story for' : "You haven't added any children yet";

  return (
            <div className="select-child-page-container">
                <h1 className="page-title"> {pageTitle} </h1>
                    <div className="children-cards-container">
                        {renderChildren}
                    </div>
            </div>
  );
}
