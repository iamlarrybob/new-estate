import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  email: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);


// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
   
//     clerkId: {
//         type:String,
//         required:true,
//         unique:true

//     },

//     email: {
//             type:String,
//             required:true,
//             unique:true,
//     },

//     firstName: {
//         type:String,
//         required:true
//     },

//     lastName:{
//         type:String,
//         required: true,
//     },

//     profilePicture: {
//         type:String,
//         required: true
//     },   
// },
//     {
//         timestamps:true
//     }
// );

// const User = mongoose.models.User || mongoose.model('User', userSchema)

// export default User;