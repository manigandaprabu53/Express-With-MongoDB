import express from 'express'
import appRoutes from './src/routes/index.js'
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(appRoutes);

app.listen(process.env.PORT, ()=>console.log(`App is listening on ${process.env.PORT}`))