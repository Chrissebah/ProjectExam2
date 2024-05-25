import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ItemDetailsPage() {
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [newImage, setNewImage] = useState('');
  const [newBooking, setNewBooking] = useState({
    dateFrom: '',
    dateTo: '',
    guests: 1,
  });
  const { venueId } = useParams();

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const venueResponse = await axios.get(`https://api.noroff.dev/api/v1/holidaze/venues/${venueId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVenue(venueResponse.data);
        setError(null);

        const bookingsResponse = await axios.get(`https://api.noroff.dev/api/v1/holidaze/bookings`, {
          params: { _venue: true, venueId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(bookingsResponse.data);
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

  const handleNewBookingChange = (event) => {
    const { name, value } = event.target;
    setNewBooking({ ...newBooking, [name]: value });
  };

  const handleAddBooking = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const bookingData = {
        ...newBooking,
        venueId: venueId,
      };

      const response = await axios.post('https://api.noroff.dev/api/v1/holidaze/bookings', bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Booking created successfully:', response.data);
      setBookings([...bookings, response.data]);
      setNewBooking({
        dateFrom: '',
        dateTo: '',
        guests: 1,
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      setError('An error occurred while creating booking.');
    }
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
          

          <form onSubmit={handleAddBooking}>
            <h3>Add New Booking</h3>
            <label>
              From:
              <input type="date" name="dateFrom" value={newBooking.dateFrom} onChange={handleNewBookingChange} required />
            </label>
            <label>
              To:
              <input type="date" name="dateTo" value={newBooking.dateTo} onChange={handleNewBookingChange} required />
            </label>
            <label>
              Guests:
              <input type="number" name="guests" value={newBooking.guests} onChange={handleNewBookingChange} required min="1" />
            </label>
            <button type="submit">Add Booking</button>
          </form>

          {bookings.length > 0 && (
            <div className="booking-list">
              <h3>Bookings</h3>
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-item">
                  <p><strong>From:</strong> {booking.dateFrom}</p>
                  <p><strong>To:</strong> {booking.dateTo}</p>
                  <p><strong>Guests:</strong> {booking.guests}</p>
                  <p><strong>Created:</strong> {booking.created}</p>
                  <p><strong>Updated:</strong> {booking.updated}</p>
                </div>
              ))}
            </div>
          )}

          

          <form onSubmit={handleFormSubmit}>
            <label>
              Name:
              <input type="text" name="name" value={venue.name} onChange={handleInputChange} />
            </label>
            <label>
              Description:
              <input type="text" name= "description" value={venue.description} onChange={handleInputChange} />
            </label>
            <label>
              New Image URL:
              <input type="text" value={newImage} onChange={handleImageChange} />
            </label>
          
            <button type="submit">Update Venue</button>
          </form>

          <button onClick={handleDeleteVenue} className="btn btn-danger" style={{ marginTop: '10px' }}>Delete Venue</button>
        </div>
      )}
    </div>
  );
}

export default ItemDetailsPage;
