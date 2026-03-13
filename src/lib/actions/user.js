"use server";

import User from "../models/user.model";
import { connectDB } from "../connectDB";

// export async function createUser(user) {
//   try {
//     await connect();

//     const newUser = await User.create(user);
//     return JSON.parse(JSON.stringify(newUser));
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }

//Type script

// "use server";

// import User from "../models/user.model";
// import { connect } from "../connectDB";

// export async function createUser(user: any) {
//     try {

//             await connect();
//             const newUser = await User.create(user);
//             return JSON.parse(JSON.stringify(newUser));
//     }catch (err) {
//         console.log(err);
//     }
// }
export const createOrUpdateUser= async(
    id,
    first_name,
    last_name,
    image_url,
    email_addresses
) => {

    try {
        await connectDB();
        const user = await User.findOneAndUpdate(
            {clerkId: id},
            {
                $set: {
                    firstName: first_name,
                    lastName:last_name,
                    profilePicture:image_url,
                    email: email_addresses[0].email_address
                }
            }, {
                upsert: true, new:true
            }
        );
        return user;
        
    } catch (error) {
        console.log('error: could not create or update user:',error)
    }
};


// export const deleteUser = async (id)  =>  {

//     try{
//         await connect();
//         await User.findOneAndDelete({clerkId: id});

//     }catch (error) {
//         console.log('Error: Could not delete user:', error)
//     }
// };

 