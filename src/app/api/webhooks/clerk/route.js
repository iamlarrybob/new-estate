import { Webhook } from "svix";
import { headers } from "next/headers";
import User from "@/models/user.model";
import { connect } from "@/mongodb/mongoose";

export async function POST(req) {
  const payload = await req.text();
  const headerList = headers();

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(payload, {
      "svix-id": headerList.get("svix-id"),
      "svix-timestamp": headerList.get("svix-timestamp"),
      "svix-signature": headerList.get("svix-signature"),
    });
  } catch (err) {
    return new Response("Invalid webhook", { status: 400 });
  }

  await connect();

  const { id, first_name, last_name, image_url, email_addresses } = evt.data;

  // CREATE or UPDATE user
  if (evt.type === "user.created" || evt.type === "user.updated") {
    await User.findOneAndUpdate(
      { clerkId: id },
      {
        clerkId: id,
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
        email: email_addresses?.[0]?.email_address,
      },
      { upsert: true, new: true }
    );
  }

  // DELETE user
  if (evt.type === "user.deleted") {
    await User.findOneAndDelete({ clerkId: id });
  }

  return new Response("OK", { status: 200 });
}

//====================================================================



// import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";
// import { clerkClient } from "@clerk/nextjs/server";
// import { headers } from "next/headers";
// import { Webhook } from "svix";

// export async function POST(req) {
//   console.log("🚀 Clerk webhook hit");

//   const SIGNING_SECRET = process.env.SIGNING_SECRET;

//   if (!SIGNING_SECRET) {
//     console.error("❌ Missing SIGNING_SECRET");
//     return new Response("Missing SIGNING_SECRET", { status: 500 });
//   }

//   // ✅ Get headers
//   const headerPayload = await headers();
//   const svix_id = headerPayload.get("svix-id");
//   const svix_timestamp = headerPayload.get("svix-timestamp");
//   const svix_signature = headerPayload.get("svix-signature");

//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     console.error("❌ Missing Svix headers");
//     return new Response("Missing Svix headers", { status: 400 });
//   }

//   // ✅ MUST be raw body
//   const body = await req.text();

//   let evt;

//   try {
//     const wh = new Webhook(SIGNING_SECRET);
//     evt = wh.verify(body, {
//       "svix-id": svix_id,
//       "svix-timestamp": svix_timestamp,
//       "svix-signature": svix_signature,
//     });
//   } catch (err) {
//     console.error("❌ Webhook verification failed", err);
//     return new Response("Webhook verification failed", { status: 400 });
//   }

//   console.log("✅ Webhook verified:", evt.type);

//   const data = evt.data;
//   const eventType = evt.type;

//   // ================= USER CREATE / UPDATE =================
//   if (eventType === "user.created" || eventType === "user.updated") {
//     try {
//       console.log("💾 Syncing user:", data.id);

//       const user = await createOrUpdateUser({
//         id: data.id,
//         first_name: data.first_name,
//         last_name: data.last_name,
//         image_url: data.image_url,
//         email_addresses: data.email_addresses,
//       });

//       console.log("🎉 User saved/updated in MongoDB");

//       // Save MongoDB ID to Clerk (only once)
//       if (eventType === "user.created" && user?._id) {
//         await clerkClient.users.updateUserMetadata(data.id, {
//           publicMetadata: {
//             userMongoId: user._id.toString(),
//           },
//         });

//         console.log("🔗 MongoDB ID saved to Clerk metadata");
//       }
//     } catch (error) {
//       console.error("❌ User sync failed", error);
//       return new Response("User sync failed", { status: 500 });
//     }
//   }

//   // ================= USER DELETE =================
//   if (eventType === "user.deleted") {
//     try {
//       console.log("🗑 Deleting user:", data.id);
//       await deleteUser(data.id);
//       console.log("✅ User deleted from MongoDB");
//     } catch (error) {
//       console.error("❌ User delete failed", error);
//       return new Response("User delete failed", { status: 500 });
//     }
//   }

//   return new Response("Webhook received", { status: 200 });
// }


//=========================================================================

// import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';
// import { clerkClient } from '@clerk/nextjs/server';

// import { headers } from 'next/headers';
// import { Webhook } from 'svix';




// export async function POST(req) {
//   console.log("clerk webhook hit")

//   const SIGNING_SECRET = process.env.SIGNING_SECRET;

//   // if (!SIGNING_SECRET) {
//   //   throw new Error('Error: please add SIGNING_SECRETE from clerk Dashboard to .env or .env.local');
//   // }
//   if (!SIGNING_SECRET) {
//     console.error("❌ Missing SIGNING_SECRET");
//     return new Response("Missing SIGNING_SECRET", { status: 500 });
//   }
  
// //========

// // LET GETS THE HEADERS

// const headerPayload = await headers();
// const svix_id = headerPayload.get('svix-id');
// const svix_timestamp = headerPayload.get('svix-timestamp');
// const svix_signature = headerPayload.get('svix-signature');

// if (!svix_id || !svix_timestamp || !svix_signature) {

//   console.error("❌ Missing Svix headers")
//   return new Response('Error: Missing Svix Headers',{
//     status: 400,
//   });
// }


// // to get the body is the next priority
// const payload = await req.json();
// const body = JSON.stringify(payload)


// let evt;

// //we need to verify payload with header

// try {
//   const wh = new Webhook(SIGNING_SECRET);
//   evt = wh.verify(body, {
//     'svix-id': svix_id,
//     'svix-timestamp': svix_timestamp,
//     'svix-signature': svix_signature,
//   });
// } catch (err) {
//   console.error('Error: Could not verify webhooks', err);
//   return new Response('Error: Verification error', {
//     status: 400
//   })
// }

// console.log("✅ Webhook verified:", evt.type)

// // Do something with payload 

//    const data = evt.data
//     const eventType = evt.type

//   // try {
//     // const evt = await verifyWebhook(req)

//     // Do something with payload
//     // For this guide, log payload to console
 
// if (eventType=== 'user.created' || eventType === 'user.updated') {
//     const {id, first_name, last_name, image_url, email_addresses} = data;
    
//     try {
      
//         const user = await createOrUpdateUser(
//           id,
//           first_name,
//           last_name,
//           image_url,
//           email_addresses

//         );
//         console.log("🎉 User saved/updated in MongoDB");

//         if (user && eventType ==='user.created') {
//             await clerkClient.user.updateUserMetadata(id, {
//               publicMetadata:{
//                 userMongoId: user._id.toString(),
//               }, 
//             });

//           console.log("🔗 MongoDB ID saved to Clerk metadata");
//         }
//     } catch (error) {
//       console.error('Error: could not create or update user', error)
//        return new Response('Error: Could not update user', {
//       status: 500,
//     });
//     }
// }



// //user delete 

// if (eventType === 'user.deleted'){
//   try{
//     console.log("🗑 Deleting user from MongoDB:", data.id);
    
//     await deleteUser(data.id);

//     console.log("✅ User deleted from MongoDB");

//   } catch (error) {
//     console.error ('Error: Could not delete user', error);
    
//     return new Response('Error: Could not delete user', {
//       status: 500,
//     });
    
//   }
// }
// return new Response('webhook receive', { status: 200 })
// }

//=====================
// if (evt.type === 'user.updated') {
//   console.log('user.updated')
// }

// if (evt.type === 'user.deleted') {
//   console.log('user.deleted')
// }
//===========================

    
// }
// import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';
// import { clerkClient } from '@clerk/nextjs/server';
// import { verifyWebhook } from '@clerk/nextjs/webhooks';

// export async function POST(req) {
//   try {
//     const evt = await verifyWebhook(req);
//     const eventType = evt.type;

//     if (eventType === 'user.created' || eventType === 'user.updated') {
//       const {
//         id: clerkUserId,
//         first_name,
//         last_name,
//         image_url,
//         email_addresses,
//       } = evt.data;

//       const email = email_addresses?.[0]?.email_address;

//       const user = await createOrUpdateUser({
//         clerkId: clerkUserId,
//         firstName: first_name,
//         lastName: last_name,
//         email,
//         image: image_url,
//       });

//       if (user && eventType === 'user.created') {
//         await clerkClient.users.updateUserMetadata(clerkUserId, {
//           publicMetadata: {
//             userMongoId: user._id.toString(),
//           },
//         });
//       }
//     }

//     if (eventType === 'user.deleted') {
//       const { id: clerkUserId } = evt.data;
//       await deleteUser(clerkUserId);
//     }

//     return new Response('Webhook received', { status: 200 });
//   } catch (err) {
//     console.error('Webhook error:', err);
//     return new Response('Webhook error', { status: 200 }); // still 200
//   }
// }


