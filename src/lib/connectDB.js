
// import mongoose from "mongoose";

// const MONGO_URI = process.env.MONGO_URL;

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = {
//     conn: null,
//     promise: null,
//   };
// }

// export const connect = async () => {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGO_URI, {
//       dbName: "real_estate", // avoid spaces in db name
//       bufferCommands: false,
//       connectTimeoutMS: 30000,
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// };


import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
    mongoose.set('strictQuery', true)
    if (isConnected) {
        console.log("Mongo is already connected")
        return
    }

    try {
        await mongoose.connect(process.env.MONGO_URL)

        isConnected = true

        console.log("connected to mongodb");
        
    }

    catch (err) {
        console.log("MongoDB connection Error", err );
        
    }
}



console.log("GOOGLE_ID:", process.env.MONGO_URL)




// import mongoose, {Mongoose} from "mongoose";

// const MONGO_URL = process.env.MONGO_URL;

// interface MongooseConn{
//     conn:Mongoose | null;
//     promise:Promise<Mongoose> | null;
// }

// let cached: MongooseConn  = (global as any).mongoose;

// if(!cached) {
//     cached = (global as any).mongoose = {
//         conn: null,
//         promise: null
//     }
// }

// export const connect = async () => {
//     if (cached.conn) return cached.conn;

//     cached.promise = cached .promise || mongoose.connect (MONGO_URL, {
//         dbName: 'real estate',
//         bufferCommands: false,
//         connectTimeoutMS: 30000,
//     });

//     cached.conn = await cached.promise
//     return cached.conn;
// }





