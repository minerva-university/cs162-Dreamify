import React from 'react';
import './styles/AboutUsPage.css';
import misha from '../assets/about_us_page/misha.png';
import billy from '../assets/about_us_page/billy.png';
import paul from '../assets/about_us_page/paul.png';
import tamir from '../assets/about_us_page/tamir.png';
import flambeau from '../assets/about_us_page/flambeau.png';


const AboutUs = () => {
  const teamMembers = [
    {
      name: 'Mykhailo Chudyk',
      fairytale: 'Cinderella',
      imageUrl: misha,
      position: 'Product Manager',
    },
    {
      name: 'Paul Franek',
      fairytale: 'Beauty and the Beast',
      imageUrl: paul,
      position: 'Software Engineer',
    },
    {
      name: 'Flambeau Iriho',
      fairytale: 'The Little Mermaid',
      imageUrl: flambeau,
      position: 'Software Engineer',
    },
    {
      name: 'Tamirlan Bektemissov',
      fairytale: 'Sleeping Beauty',
      imageUrl: tamir,
      position: 'Software Engineer',
    },
    {
      name: 'Billy Altangerel',
      fairytale: 'Snow White and the Seven Dwarfs',
      imageUrl: billy,
      position: 'Software Engineer',
    },
  ];

  return (
    <div className="abus-container">
      <h1 className="abus-title">About Us</h1>

      {teamMembers.map((member) => (
        <div className="abus-team-member" key={member.name}>
          <img src={member.imageUrl} alt={`Developer ${member.name}`} />
          <div className="abus-team-member-info">
            <h2 className="abus-team-member-name">{member.name}</h2>
            <p className="abus-team-member-position">{member.position}</p>
            <p className="abus-team-member-fairytale">Favorite Fairy Tale: {member.fairytale}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AboutUs;