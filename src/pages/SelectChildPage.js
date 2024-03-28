import React, { useEffect } from 'react';
import { Container, Stack } from 'react-bootstrap';
import { useApi } from '../contexts/ApiProvider';
import { useAuth } from '../contexts/AuthProvider';
import { useState } from 'react';
import ChildProfileCard from '../components/ChildProfileCard';
import Spinner from '../components/Spinner';
import { useNavigate } from "react-router-dom";
import './styles/UserProfilePage.css';

// Flambeau
export default function SelectChildPage() {

  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [parentId, setParentId] = useState(null); 
  const api = useApi();
  const { getCurrentParent } = useAuth();

  // Get the parent ID
  getCurrentParent()
    .then(parent => {
      setParentId(parent.parent_id);
    })
    .catch(error => {
      console.error('Failed to fetch parent data:', error);
    });

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
    navigate(`/newstory/${childId}`);
  };


  if (loading) {
    return <Spinner/>;
  }
  
  const renderChildren = children.length > 0 ? (
    children.map(child => (
      <div onClick={handleClick(child.child_id)} style={{ cursor: 'pointer' }}>
      <ChildProfileCard key={child.child_id} childId={child.child_id} />
      </div>
    ))
  ) : (
    <div className='child-selection'>
      <h3>No children profiles found</h3>
      <button onClick={() => navigate(`/addachild/${parentId}`)}> Create a New Child Profile</button>
    </div>
  );


  return (
    <Container fluid>
            <Container className="page-container">
                <h1 className="page-title"> Pick a child profile: </h1> 
                    <Stack className="profile-container" direction="horizontal" gap={3}>
                        {renderChildren}
                    </Stack>
                
            </Container>
        </Container>

  );
}
