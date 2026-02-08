import express,{Application, urlencoded} from 'express';
import { errorHandler } from './Middlewares/errormiddlewares';
import Auth from './Routes/Auth';
const app:Application = express();

app.use(express.json());
app.use(urlencoded({extended:true}));
app.use('/api/auth',Auth);

app.use(errorHandler);
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});