import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { create, findAll } from './models/School';

const router = Router();

// Add School API
router.post('/addSchool', [
    body('name').notEmpty().withMessage('Name is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('latitude').isFloat().withMessage('Latitude must be a float'),
    body('longitude').isFloat().withMessage('Longitude must be a float')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { name, address, latitude, longitude } = req.body;
        const newSchool = await create({ name, address, latitude, longitude });
        res.status(201).json({ message: 'School added successfully', school: newSchool });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Calculate Distance (Helper Function)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// List Schools API
router.get('/listSchools', [
    query('latitude').isFloat().withMessage('Latitude is required'),
    query('longitude').isFloat().withMessage('Longitude is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { latitude, longitude } = req.query;
        const schools = await findAll();

        const sortedSchools = schools.map(school => ({
            ...school.dataValues,
            distance: calculateDistance(latitude, longitude, school.latitude, school.longitude)
        })).sort((a, b) => a.distance - b.distance);

        res.json(sortedSchools);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
