import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { calculateDistance } from './utils/calculateDistance.js'; 
import supabase from './config/Supaconfic.js';

const router = Router();

router.get('/listSchools', [
    query('latitude').isFloat().withMessage('Latitude is required'),
    query('longitude').isFloat().withMessage('Longitude is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { latitude, longitude } = req.query;

        // Fetch all schools from Supabase
        const { data: schools, error } = await supabase.from('schools').select('*');

        if (error) throw error;

        // Calculate distance and sort schools by proximity
        const sortedSchools = schools.map(school => ({
            ...school,
            distance: calculateDistance(latitude, longitude, school.latitude, school.longitude)
        })).sort((a, b) => a.distance - b.distance);

        res.json(sortedSchools);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


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

        // Insert into Supabase
        const { data, error } = await supabase
            .from('schools')
            .insert([{ name, address, latitude, longitude }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ message: 'School added successfully', school: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
