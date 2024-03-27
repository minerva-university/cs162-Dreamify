import React from 'react';
import { Container, Stack } from 'react-bootstrap';
import { useApi } from '../contexts/ApiProvider';
import { useState } from 'react';

// Flambeau
export default function SelectChildPage() {

  const [children, setChildren] = useState([]);

  const api = useApi();

  const fetchChildren = async(e) => {
    e.preventDefault();
    if (api) {
    try {
      const response = await api.getAllChildren();
      console.log(response);
      //setChildren(response);
      //console.log(children);
    }
    catch (error) {
      setChildren(error.message);
    }
  }
  else {
    setChildren("No API client found");
  }
  }


  const renderChildren = children.map((child) => {
    return (
      {children}
    )
  }
  )


  return (
    <Container fluid>
            <Container className="page-container">
                <h1 className="page-title"> Pick one of your children: </h1> 
                    <Stack className="profile-container" direction="horizontal" gap={3}>
                        <button onClick={fetchChildren}>Click me</button>
                        {renderChildren}
                    </Stack>
                
            </Container>
        </Container>

  );
}
