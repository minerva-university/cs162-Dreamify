import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import { useApi } from "../contexts/ApiProvider"; 
import './styles/ChildProfileCard.css';
import Spinner from './Spinner';

const ChildProfileCard = ({ childId }) => {
    const [childProfile, setChildProfile] = useState(null);
    const [isLoading, setisLoading] = useState(true);
    const [error, setError] = useState(null);
    const api = useApi(); 

    useEffect(() => {
        const fetchChildProfile = async () => {
            try {
                setisLoading(true);
                const profile = await api.getChild(childId);
                setChildProfile(profile);
            } catch (err) {
                setError(err.message);
            } finally {
                setisLoading(false);
            }
        };

        fetchChildProfile();
    }, [childId, api]);

    if (isLoading) {
        return <Spinner />;
      }
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="child-profile-card">
            {childProfile ? (
                <>
                    <img src={require("../pages/photos/chapter1.jpg")} alt={childProfile.name} />
                    <div className='child-profile-content'>
                        <div className='created-on-button'>
                            <h3>{childProfile.name}</h3>
                            <Link to={`/modify/${childId}`} className="edit-profile-btn">Edit</Link>
                        </div>
                    </div>
                </>
            ) : (
                <div className='no-child-profile'>
                    <img src={require("../pages/photos/chapter1.jpg")} alt="Kid's Name" /> 
                    <div className='child-profile-content'>
                        <h3>Kid's Name</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChildProfileCard;

ChildProfileCard.propTypes = {
    childId: PropTypes.string.isRequired,
};
