import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import placeholderImage from '../images/noimagefound.jpg';

function Content() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 100; 
  const [sort, setSort] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const offset = (page - 1) * limit;

        const queryString = `?limit=${limit}&offset=${offset}&sort=${sort}&sortOrder=${sortOrder}`;

        const response = await axios.get(
          `https://api.noroff.dev/api/v1/holidaze/venues${queryString}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setVenues(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching venues:', error);
        setError('An error occurred while fetching venues.');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [page, limit, sort, sortOrder]); 

  const nextPage = () => {
    setPage(page + 1);
  };

  const previousPage = () => {
    setPage(page - 1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <div className="content">
      <h2>Venues</h2>
      <div>
        Sort by:{' '}
        <select value={sort} onChange={handleSortChange}>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>{' '}
        <select value={sortOrder} onChange={handleSortOrderChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : venues.length === 0 ? (
        <p>No venues available.</p>
      ) : (
        <React.Fragment>
          <ul>
            {venues.map((venue) => (
              <li key={venue.id}>
                <Link to={`/item/${venue.id}`}>
                  <div>
                    <h4>{venue.name}</h4>{' '}
                  </div>
                  <div>
                    <strong>Description:</strong> {venue.description}
                  </div>
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
                  <div>
                    <strong>Price:</strong> ${venue.price}
                  </div>
                  <div>
                    <strong>Country:</strong> {venue.location.country}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '10px' }}>
            <button onClick={previousPage} className="btn btn-info" disabled={page === 1} style={{ marginRight: '5px' }}>
              Previous Page
            </button>
            <button onClick={nextPage} className="btn btn-info" style={{ marginLeft: '5px' }}>
              Next Page
            </button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default Content;