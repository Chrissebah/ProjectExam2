import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Content() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('Authentication token not found');
          }
          const response = await axios.get('https://api.noroff.dev/api/v1/holidaze/bookings', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setBookings(response.data);
          setError(null);
        } catch (error) {
          console.error('Error fetching bookings:', error);
          setError('An error occurred while fetching bookings.');
        } finally {
          setLoading(false);
        }
      };

    fetchBookings();
  }, []);

  return (
    <div className="content">
      <h2>Bookings</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id}>
              <div>Venue Name: {booking.venue.name}</div>
              <div>Description: {booking.venue.description}</div>
              <div>
                Media:
                {booking.venue.media.map((media, index) => (
                  <img key={index} src={media.url} alt={media.alt} />
                ))}
              </div>
              <div>Price: {booking.venue.price}</div>
             
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Content;