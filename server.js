import 'dotenv/config';
console.log("Environment variables loaded");

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

import {authMiddleware} from './middleware/authMiddleware.js';
import {pageMiddleware} from './middleware/pageMiddleware.js';
import reportsRoutes from './routes/reportsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import accessRoutes from './routes/accessRoutes.js';
import goalLogRoutes from './routes/goalLogRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(import.meta.dirname,'public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res)=>{
  res.redirect('/login');
} )

app.get('/login',(req,res)=>{
    res.render('validation',{title:"Login"});
});

app.get('/signup',(req,res)=>{
    res.render('validation',{title:"Signup"});
});

app.use('/api/users',userRoutes);

app.get('/home',pageMiddleware,(req,res)=>{
  const email = req.user.email;
  res.render('home.ejs',{email});
})

// Mount API routes
app.use('/api/token', accessRoutes);
app.use('/api/reports',authMiddleware, reportsRoutes);
app.use('/api/goals',authMiddleware, goalRoutes);
app.use('/api/transactions',authMiddleware, transactionRoutes);
app.use('/api/goalLog',authMiddleware, goalLogRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});