import express,{Application, urlencoded} from 'express';
import { errorHandler } from './Middlewares/errormiddlewares';
import Auth from './Routes/Auth';
import cors from 'cors';
import connectDB from './db';
const app:Application = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
connectDB()
.then(()=>{
  console.log("Database connected successfully");
})
.catch((error)=>{
  console.error("Database connection failed:",error);
});
app.use(urlencoded({extended:true}));
app.use('/api/auth',Auth);


app.use(errorHandler);
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});