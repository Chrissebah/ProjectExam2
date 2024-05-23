import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ItemDetailsPage() {
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
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
                  style={{ width: '100px', height: 'auto', marginBottom: '10px', marginRight: '10px' }}
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
        </div>
      )}
    </div>
  );
}

export default ItemDetailsPage;