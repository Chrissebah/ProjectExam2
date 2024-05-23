import React, { useState, useEffect } from 'react';
import profilePicture from '../images/profilepicture.png';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/profiles/${localStorage.getItem('name')}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const profileData = await response.json();
        setProfile(profileData);
        setError(null);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('An error occurred while fetching profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className='profilebox'>
      <h2>Profile</h2>
      {loading && <p>Loading profile...</p>}
      {error && <p>{error}</p>}
      {profile && (
        <div>
           {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" style={{ maxWidth: '200px', maxHeight: '200px' }} />
            ) : (
              <img src={profilePicture} alt="Default Avatar" style={{ maxWidth: '200px', maxHeight: '200px' }} />
            )}
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <p>Venue Manager: {profile.venueManager ? 'Yes' : 'No'}</p>
          <p>Venues Count: {profile._count.venues}</p>
          <p>Bookings Count: {profile._count.bookings}</p>
         
        </div>
      )}
    </div>
  );
}

export default Profile;