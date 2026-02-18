import React from 'react';
import { useParams } from 'react-router-dom';

function Profile() {
  const { id } = useParams();

  return (
    <div className="profile">
      <h2>Profil Utilisateur #{id}</h2>
      <div className="profile-info">
        <div className="avatar">👤</div>
        <h3>Nom d'utilisateur</h3>
        <p>Bio de l'utilisateur</p>
        <div className="stats">
          <span>100 Posts</span>
          <span>250 Followers</span>
          <span>180 Following</span>
        </div>
      </div>
    </div>
  );
}

export default Profile;
