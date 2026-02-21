import mongoose from "mongoose";

let isConnected = false;

export const connect = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

// import mongoose from "mongoose";

// let initialize = false;

// export const connect = async () => {
//     mongoose.set('strictQuery', true);

//     if (initialize) {
//         console.log('mongoDB already connected');
//         return;
//     }
//     try {
//         await mongoose.connect(process.env.MONGO_URI, {
//             dbName: 'Real-estate',
//             useNewUrlParser: true,
//             useUnifiedTopology:true,
//         });

//         initialize = true;
//         console.log('MongoDB connected successfuly');


//     } catch (error) {
//         console.log('MongoDB connection error;', error)
//     }
// }

//===================================================
// import mongoose from "mongoose";

// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//   throw new Error("Please define the MONGO_URI environment variable");
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// export const connect = async () => {
//   if (cached.conn) {
//     console.log("MongoDB already connected");
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGO_URI, {
//       dbName: "Real-estate",
//       bufferCommands: false,
//     });
//   }

//   try {
//     cached.conn = await cached.promise;
//     console.log("MongoDB connected successfully");
//     return cached.conn;
//   } catch (error) {
//     cached.promise = null;
//     console.error("MongoDB connection error:", error);
//     throw error;
//   }
// };