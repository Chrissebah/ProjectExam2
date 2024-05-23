import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import placeholderImage from '../images/noimagefound.jpg';


function Content() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        const response = await axios.get('https://api.noroff.dev/api/v1/holidaze/venues', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (Array.isArray(response.data)) {
          setVenues(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setError('Unexpected response format.');
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching venues:', error);
        setError('An error occurred while fetching venues.');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const truncateDescription = (description) => {
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
  };

  return (
    <div className="content">
      <h2>Venues</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : venues.length === 0 ? (
        <p>No venues available.</p>
      ) : (
        <ul>
          {venues.map((venue) => (
            <li key={venue.id}>
              <Link to={`/item/${venue.id}`}>
                <div><h4>{venue.name}</h4> </div>
                <div><strong>Description:</strong> {truncateDescription(venue.description)}</div>
                <div>
                  {venue.media.length > 0 ? (
                    <img
                      src={venue.media[0]}
                      alt={`Venue media`}
                      style={{ width: '150px', height: 'auto', marginRight: '10px' }}
                    />
                  ) : (
                    <img
                    src={placeholderImage}
                    alt="Placeholder"
                    style={{ width: '150px', height: 'auto', marginRight: '10px' }}
                  />
                  )}
                </div>
                <div><strong>Price:</strong> ${venue.price}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      
    </div>
  );
}

export default Content;