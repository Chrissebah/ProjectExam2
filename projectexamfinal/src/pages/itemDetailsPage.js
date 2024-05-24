import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ItemDetailsPage() {
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
  const [newImage, setNewImage] = useState('');
  const { venueId } = useParams();

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.noroff.dev/api/v1/holidaze/venues/${venueId}`);
        setVenue(response.data);
        setError(null);

        if (response.data.bookings && response.data.bookings.length > 0) {
          const newestBookingId = response.data.bookings[0].id;
          const bookingResponse = await axios.get(`https://api.noroff.dev/api/v1/holidaze/bookings/${newestBookingId}`);
          setBooking(bookingResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchVenueDetails();
  }, [venueId]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const updatedVenue = { ...venue };
      if (newImage) {
        updatedVenue.media.push(newImage);
      }

      const response = await axios.put(`https://api.noroff.dev/api/v1/holidaze/venues/${venueId}`, updatedVenue, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Venue updated successfully:', response.data);
      
      setVenue(response.data);
    } catch (error) {
      console.error('Error updating venue:', error);
      setError('An error occurred while updating venue. Make sure this is your venue!');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setVenue({ ...venue, [name]: value });
  };

  const handleImageChange = (event) => {
    setNewImage(event.target.value);
  };

  const handleDeleteVenue = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      await axios.delete(`https://api.noroff.dev/api/v1/holidaze/venues/${venueId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Redirect to home page after successful deletion
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting venue:', error);
      setError('An error occurred while deleting venue.');
    }
  };

  return (
    <div className="item-details">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h2>{venue.name}</h2>
          <p><strong>Description:</strong> {venue.description}</p>
          {venue.media.length > 0 && (
            <div className="venue-images">
              {venue.media.map((mediaUrl, index) => (
                <img
                  key={index}
                  src={mediaUrl}
                  alt={`Venue media ${index + 1}`}
                  style={{ width: '200px', height: 'auto', marginBottom: '10px', marginRight: '10px' }}
                />
              ))}
            </div>
          )}
          <p><strong>Price:</strong> ${venue.price}</p>
          <p><strong>Max Guests:</strong> {venue.maxGuests}</p>
          <p><strong>Rating:</strong> {venue.rating}</p>
          <p><strong>Created:</strong> {venue.created}</p>
          <p><strong>Updated:</strong> {venue.updated}</p>
          <div><strong>Amenities:</strong></div>
          <ul>
            <li>WiFi: {venue.meta.wifi ? 'Yes' : 'No'}</li>
            <li>Parking: {venue.meta.parking ? 'Yes' : 'No'}</li>
            <li>Breakfast: {venue.meta.breakfast ? 'Yes' : 'No'}</li>
            <li>Pets: {venue.meta.pets ? 'Yes' : 'No'}</li>
          </ul>
          <div><strong>Location:</strong></div>
          <p>{venue.location.address}, {venue.location.city}, {venue.location.zip}, {venue.location.country}</p>
          
          {booking && (
            <div className="booking-details">
              <h3>Newest Booking</h3>
              <p><strong>From:</strong> {booking.dateFrom}</p>
              <p><strong>To:</strong> {booking.dateTo}</p>
              <p><strong>Guests:</strong> {booking.guests}</p>
              <p><strong>Created:</strong> {booking.created}</p>
              <p><strong>Updated:</strong> {booking.updated}</p>
            </div>
          )}

          <form onSubmit={handleFormSubmit}>
            <label>
              Name:
              <input type="text" name="name" value={venue.name} onChange={handleInputChange} />
            </label>
            <label>
              Description:
              <input type="text" name="description" value={venue.description} onChange={handleInputChange} />
            </label>
            <label>
              New Image URL:
              <input type="text" value={newImage} onChange={handleImageChange} />
            </label>
          
            <button type="submit">Update Venue</button>
          </form>

          <button onClick={handleDeleteVenue} className="btn btn-danger" style={{ marginTop: '10px'  }}>Delete Venue</button>
        </div>
      )}
    </div>
  );
}

export default ItemDetailsPage;