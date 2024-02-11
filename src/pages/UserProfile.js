import React from 'react';
import Sidebar from '../components/Sidebar';
import Body from '../components/Body';
import UserInfo from '../components/UserInfo';

//add dynamic routing for user profile
export default function UserProfile() {
    return (
        <Body sidebar>
            <UserInfo />
        </Body>
    );
};
