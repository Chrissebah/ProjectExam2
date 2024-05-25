import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import profilePicture from '../images/profilepicture.png';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [updateError, setUpdateError] = useState(null);
  const [venueManager, setVenueManager] = useState(false);
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editBooking, setEditBooking] = useState({ dateFrom: '', dateTo: '', guests: '' });

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
        setVenueManager(profileData.venueManager);
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

  useEffect(() => {
    const fetchVenuesByProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/profiles/${localStorage.getItem('name')}/venues`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch venues by profile');
        }

        const venuesData = await response.json();
        setVenues(venuesData);
        setError(null);
      } catch (error) {
        console.error('Error fetching venues by profile:', error);
        setError('An error occurred while fetching venues by profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchVenuesByProfile();
  }, []);

  useEffect(() => {
    const fetchBookingsByProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/profiles/${localStorage.getItem('name')}/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bookings by profile');
        }

        const bookingsData = await response.json();
        setBookings(bookingsData);
        setError(null);
      } catch (error) {
        console.error('Error fetching bookings by profile:', error);
        setError('An error occurred while fetching bookings by profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsByProfile();
  }, []);

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const handleImageUrlSubmit = async () => {
    try {
      setUpdateError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/profiles/${localStorage.getItem('name')}/media`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ avatar: imageUrl })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile picture');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setImageUrl('');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      setUpdateError('An error occurred while updating the profile picture.');
    }
  };

  const handleVenueManagerChange = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/profiles/${localStorage.getItem('name')}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ venueManager: !venueManager })
      });

      if (!response.ok) {
        throw new Error('Failed to update venue manager status');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setVenueManager(updatedProfile.venueManager);
    } catch (error) {
      console.error('Error updating venue manager status:', error);
      setUpdateError('An error occurred while updating the venue manager status.');
    }
  };

  const handleEditBooking = async (bookingId, updatedBooking) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
  
      console.log('PUT request payload:', JSON.stringify(updatedBooking));
  
      const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBooking)
      });
  
      if (!response.ok) {
        const errorMessage = await response.text(); 
        throw new Error(`Failed to update booking: ${errorMessage}`);
      }
  
      const updatedBookingData = await response.json();
      const updatedBookings = bookings.map(booking =>
        booking.id === bookingId ? updatedBookingData : booking
      );
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error updating booking:', error);
      setError('An error occurred while updating booking.');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete booking');
      }

      setBookings(bookings.filter((booking) => booking.id !== bookingId));
    } catch (error) {
      console.error('Error deleting booking:', error);
      setError('An error occurred while deleting booking.');
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditBooking(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditFormSubmit = (bookingId) => async (e) => {
    e.preventDefault(); 
    try {
     
      const originalBooking = bookings.find(booking => booking.id === bookingId);
      if (
        originalBooking.dateFrom === editBooking.dateFrom &&
        originalBooking.dateTo === editBooking.dateTo &&
        originalBooking.guests === editBooking.guests
      ) {
        
        return;
      }
      
    
      const payload = {};
      if (editBooking.dateFrom || editBooking.dateTo) {
       
        payload.dateFrom = editBooking.dateFrom || originalBooking.dateFrom;
        payload.dateTo = editBooking.dateTo || originalBooking.dateTo;
      }
     
      payload.guests = editBooking.guests !== '' ? parseInt(editBooking.guests) : originalBooking.guests;
  

      await handleEditBooking(bookingId, payload);
      setEditBooking({ dateFrom: '', dateTo: '', guests: '' });
    } catch (error) {
      console.error('Error editing booking:', error);
      setError('An error occurred while editing booking.');
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    window.location.href = '/';
  };

  return (
    <div className="profilebox">
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
          <p>Venues Count: {profile._count?.venues ?? 0}</p>
          <p>Bookings Count: {profile._count?.bookings ?? 0}</p>
          <div>
            <input
              type="text"
              value={imageUrl}
              onChange={handleImageUrlChange}
              placeholder="Enter new profile picture URL"
              style={{ width: '80%', margin: '10px 0' }}
            />
            <button onClick={handleImageUrlSubmit} className="btn btn-success">Update Profile Picture</button>
            {updateError && <p>{updateError}</p>}
          </div>
          <div>
            <button onClick={handleVenueManagerChange} className="btn btn-danger" style={{ marginTop: '10px' }}>
              {venueManager ? 'Remove Venue Manager' : 'Make Venue Manager'}
            </button>
          </div>
          <button onClick={handleLogOut} className="btn btn-secondary" style={{ marginTop: '10px' }}>Log Out</button>
        </div>
      )}

      <div className='profileVenues'>
        <h3><b><u>Your Venues</u></b></h3>
        {venues.map((venue) => (
          <div key={venue.id} className="venue-item">
            <h4>{venue.name}</h4>
            <p>Description: {venue.description}</p>
            <p>Price: ${venue.price}</p>
            <p>Max Guests: {venue.maxGuests}</p>
            <Link to={`/item/${venue.id}`} className="btn btn-info" style={{ marginBottom: '10px' }}>View Venue</Link>
          </div>
        ))}
      </div>

      <div className='profileBookings'>
        <h3><b><u>Your Bookings</u></b></h3>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="booking-item">
              <p><b>{booking.id}</b></p>
              <p><strong>From:</strong> {booking.dateFrom}</p>
              <p><strong>To:</strong> {booking.dateTo}</p>
              <p><strong>Guests:</strong> {booking.guests}</p>
              <p><strong>Created:</strong> {booking.created}</p>
              <p><strong>Updated:</strong> {booking.updated}</p>
              <div>
                <input
                style={{ marginLeft: '3px' }}
                  type="date"
                  name="dateFrom"
                  value={editBooking.dateFrom}
                  onChange={handleEditInputChange}
                />
                <input
                style={{ marginLeft: '3px' }}
                  type="date"
                  name="dateTo"
                  value={editBooking.dateTo}
                  onChange={handleEditInputChange}
                />
                <input
                style={{ marginLeft: '3px' }}
                  type="number"
                  name="guests"
                  placeholder="Number of guests"
                  value={editBooking.guests}
                  onChange={handleEditInputChange}
                />
                <button onClick={handleEditFormSubmit(booking.id)} style={{ marginLeft: '10px' }}>Submit</button>
              </div>
              <button onClick={() => handleDeleteBooking(booking.id)} className="btn btn-danger" style={{ marginTop: '10px' }}>Delete</button>
            </div>
          ))
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;

