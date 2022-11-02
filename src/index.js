import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser  from 'cookie-parser';
import initWebRoutes from './routes/web';
import connectDB from './config/connectDB';
require('dotenv').config();

const app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});
app.use(cors({ origin: `${process.env.FRONT_END_BASE_URL}`, optionsSuccessStatus: 200, credentials: true }));

initWebRoutes(app);

connectDB();

const port = process.env.PORT || 1111;
app.listen(port, () => console.log(`Backend NodeJS running on port ${port}`));
