import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req) {

  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error("Please add SIGNING_SECRET from Clerk Dashboard");
  }

  const wh = new Webhook(SIGNING_SECRET);

  const headerPayload = headers();

  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });

  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Webhook verification error", { status: 400 });
  }

  const { id } = evt?.data;
  const eventType = evt?.type;

  if (eventType === "user.created" || eventType === "user.updated") {

    const { first_name, last_name, image_url, email_addresses } = evt.data;

    const email = email_addresses[0]?.email_address;

    try {

      const user = await createOrUpdateUser(
        id,
        first_name,
        last_name,
        image_url,
        email
      );

      if (user && eventType === "user.created") {

        const client = await clerkClient();

        await client.users.updateUserMetadata(id, {
          publicMetadata: {
            userMongoId: user._id,
          },
        });

      }

    } catch (err) {
      console.error("Create/update user error:", err);
      return new Response("Could not create or update user", { status: 400 });
    }
  }

  if (eventType === "user.deleted") {
    try {
      await deleteUser(id);
    } catch (err) {
      console.error("Delete user error:", err);
      return new Response("Could not delete user", { status: 400 });
    }
  }

  return new Response("Webhook received", { status: 200 });
}


//================================================================================================================
// import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";
// import { Webhook } from "svix";
// import { headers } from "next/headers";
// import { clerkClient } from "@clerk/nextjs/server";

// export async function POST(req) {
//   const SIGNING_SECRET = process.env.SIGNING_SECRET;
//   if(!SIGNING_SECRET) {
//     throw new Error('Error: please add SIGNING_SECRET from clerk Dashboard to.env');

//   }
//   const wh = new Webhook(SIGNING_SECRET);


//   const headerPayload = await headers();
//   const svix_id = headerPayload.get('svix-id');
//   const svix_timestamp = headerPayload.get('svix-timestamp');
//   const svix_signature = headerPayload.get('svix-signature');


//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     return new Response('Error: Missing Svix header', {
//       status: 400,
//     })
//   }


//   const payload = await req.json();
//   const body = JSON.stringify(payload);

//   let evt;


//   try {
//     evt = wh.verify(body, {
//       'svix-id': svix_id,
//       'svix-timestamp':svix_timestamp,
//       'svix-signature': svix_signature,

//     });

//   } catch (err) {
//     console.error('Error: Could not verify Webhook:', err);
//     return new Response('Error: verifacation error', {
//       status: 400
//     })
//   }

//     const {id} = evt?.data;
//     const eventType = evt?.type;

//     if (eventType === 'user.created' || eventType === 'user.updated') {
//       const { first_name, last_name, image_url, email_addresses } = evt?.data;

//       try{
        
//        const user = await createOrUpdateUser(
//         id, first_name,last_name,image_url,email_addresses
//        );
//        if (user && eventType === 'user.created') {
//         try {
//           await clerkClient.user.updateUserMetadata(id, {
//             publicMetadata: {
//               userMongoId: user._id,
//             },
//           });
//         }catch (err) {
//           console.log('Error: Could not update user metadata', err);
          
//         }
//        }
//       } catch (err) {
//         console.log('Error: Could create or update user', err);
//         return new Response('Error: could not create or update user', {
//           status:400,
//         })
        
//       }
//     }

//     if (eventType === 'user.deleted') {
//       try {
//         await deleteUser(id)
//       }catch (err) {
//         console.log('Error: Could not delete user:', err);
//         return new Response('Error: could not delete user', {
//           status:400,
//         })
        
//       }
//     }

//     return new Response('Webhook received', {status: 200});

// }
 


