import mongoose from "mongoose";


const DB_Connection = async () => {

    const db = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {console.log('DB connect  is  succefuly'); })
        .catch(err => { console.error('DB connect error', err); });
}


export default DB_Connection;