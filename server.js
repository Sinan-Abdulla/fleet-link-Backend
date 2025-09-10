const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');  
const connectDB = require('./src/config/db');


dotenv.config(); 

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://3.106.114.241"], // allow both local and deployed frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));



app.use(express.json());


const addVehicleRoutes = require("./src/routes/addVehicle");
const searchAvailableVehicle = require("./src/routes/searchAvailableVehicles");
const bookAVehicle = require("./src/routes/bookAVehicle");



app.use("/api", addVehicleRoutes);
app.use("/api", searchAvailableVehicle);
app.use("/api", bookAVehicle);


const PORT = process.env.PORT || 3000;

connectDB();

app.get('/', (req, res) => {
    res.send('Hello FleetLink!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
