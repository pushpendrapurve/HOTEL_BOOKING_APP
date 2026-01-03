import express from 'express'
import dotenv from 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js';
import {clerkMiddleware} from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';


const app = express();
const PORT = process.env.PORT || 3000;

//database connection
connectDB();

app.use(express.json())
app.use(cors());
app.use(clerkMiddleware());

// API to listen to clerk Webhook
app.use("/api/clerk", clerkWebhooks);
 

app.get('/',(req,res)=>{
    res.send('API is Working!')
})
 
app.listen(PORT,()=>{
    console.log(`server is listening on port http://localhost:${PORT}`)
});

