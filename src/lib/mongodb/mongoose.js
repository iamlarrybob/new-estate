import mongoose from "mongoose";

let initialize = false;

export const connect = async () => {
    mongoose.set('strictQuery', true);

    if (initialize) {
        console.log('mongoDB already connected');
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'Real-estate',
            useNewUrlParser: true,
            useUnifiedTopology:true,
        });

        initialize = true;
        console.log('MongoDB connected successfuly');


    } catch (error) {
        console.log('MongoDB connection error;', error)
    }
}