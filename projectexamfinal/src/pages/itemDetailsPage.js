import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ItemDetailsPage() {
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { venueId } = useParams();

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.noroff.dev/api/v1/holidaze/venues/${venueId}`);
        setVenue(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchVenueDetails();
  }, [venueId]);

  const truncateDescription = (description) => {
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
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
          <p><strong>Description:</strong> {truncateDescription(venue.description)}</p>
          {venue.media.length > 0 && (
            <img src={venue.media[0]} alt={`Venue media`} style={{ width: '100px', height: 'auto', marginBottom: '10px' }} />
          )}
          <p><strong>Price:</strong> ${venue.price}</p>
        </div>
      )}
    </div>
  );
}

export default ItemDetailsPage;