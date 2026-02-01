import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connStr = "mongodb://localhost:27017/hostel_fix";
console.log("Connecting to:", connStr);

mongoose.connect(connStr, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
})
    .then(() => {
        console.log("MongoDB Connected");
        process.exit(0);
    })
    .catch(err => {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    });
