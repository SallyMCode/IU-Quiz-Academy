import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:5173', // dein Frontend-Port
  credentials: true
}));