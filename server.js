import express, { json } from 'express';
import { sync } from './config/db';
import cors from 'cors';
require('dotenv').config();

import schoolRoutes from './routes';

const app = express();
app.use(cors());
app.use(json());

app.use('/api', schoolRoutes);

const PORT = process.env.PORT || 5000;

sync().then(() => {
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log('Error: ' + err));
