import React, { useState } from 'react';
import axios from 'axios';

function CreateVenuePage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    media: [],
    price: 0,
    maxGuests: 0,
    rating: 0,
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: '',
      city: '',
      zip: '',
      country: '',
      continent: '',
      lat: 0,
      lng: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          [name]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value,
      }));
    }
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  const handleMediaChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      media: value.split(',').map((url) => url.trim()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      await axios.post(
        'https://api.noroff.dev/api/v1/holidaze/venues',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess('Venue created successfully');
      setFormData({
        name: '',
        description: '',
        media: [],
        price: 0,
        maxGuests: 0,
        rating: 0,
        meta: {
          wifi: false,
          parking: false,
          breakfast: false,
          pets: false,
        },
        location: {
          address: '',
          city: '',
          zip: '',
          country: '',
          continent: '',
          lat: 0,
          lng: 0,
        },
      });
    } catch (error) {
      console.error('Error creating venue:', error);
      setError('An error occurred while creating the venue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App-content">
    <div className="create-venue-form-container">
      <h2>Create Venue</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Media URLs (comma separated):</label>
          <input
            type="text"
            value={formData.media.join(', ')}
            onChange={handleMediaChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Max Guests:</label>
          <input
            type="number"
            name="maxGuests"
            value={formData.maxGuests}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Rating:</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group checkbox-group">
          <label>Wifi:</label>
          <input
            type="checkbox"
            name="wifi"
            checked={formData.meta.wifi}
            onChange={handleChange}
          />
        </div>
        <div className="form-group checkbox-group">
          <label>Parking:</label>
          <input
            type="checkbox"
            name="parking"
            checked={formData.meta.parking}
            onChange={handleChange}
          />
        </div>
        <div className="form-group checkbox-group">
          <label>Breakfast:</label>
          <input
            type="checkbox"
            name="breakfast"
            checked={formData.meta.breakfast}
            onChange={handleChange}
          />
        </div>
        <div className="form-group checkbox-group">
          <label>Pets:</label>
          <input
            type="checkbox"
            name="pets"
            checked={formData.meta.pets}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.location.address}
            onChange={handleLocationChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={formData.location.city}
            onChange={handleLocationChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Zip Code:</label>
          <input
            type="text"
            name="zip"
            value={formData.location.zip}
            onChange={handleLocationChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={formData.location.country}
            onChange={handleLocationChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Continent:</label>
          <input
            type="text"
            name="continent"
            value={formData.location.continent}
            onChange={handleLocationChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Latitude:</label>
          <input
            type="number"
            name="lat"
            value={formData.location.lat}
            onChange={handleLocationChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Longitude:</label>
          <input
            type="number"
            name="lng"
            value={formData.location.lng}
            onChange={handleLocationChange}
            className="form-control"
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <button type="submit" disabled={loading} className="btn btn-success">
            {loading ? 'Creating...' : 'Create Venue'}
        </button>
      </form>
    </div>
    </div>
  );
}

export default CreateVenuePage;