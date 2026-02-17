import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';
import { clerkClient } from '@clerk/nextjs/server';
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { headers } from 'next/headers';
import { Webhook } from 'svix';


export async function POST(req) {

  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('Error: please add SIGNING_SECRETE from clerk Dashboard to .env or .env.local');
  }

//========
  const wh = new Webhook(SIGNING_SECRET);

// LET GETS THE HEADERS

const headerPayload = await headers();
const svix_id = headerPayload.get('svix-id');
const svix_timestamp = headerPayload.get('svix-timestamp');
const svix_signature = headerPayload.get('svix-signature');

if (!svix_id || !svix_timestamp || !svix_signature) {
  return new Response('Error: Missing Svix Headers',{
    status: 400,
  });
}


// to get the body is the next priority
const payload = await req.json();
const body = JSON.stringify(payload)


let evt;

//we need to verify payload with header

try {
  evt = wh.verify(body, {
    'svix-id': svix_id,
    'svix-timestamp': svix_timestamp,
    'svix-signature': svix_signature,
  });
} catch (err) {
  console.error('Error: Could not verify webhooks', err);
  return new Response('Error: Verification error', {
    status: 400
  })
}

// Do something with payload 

   const { id } = evt?.data
    const eventType = evt?.type

  // try {
    // const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
 
if (eventType=== 'user.created' || eventType === 'user.updated') {
    const {id, first_name, last_name, image_url, email_addresses} = evt?.data;
    
    try {
        const user = await createOrUpdateUser(
          id,
          first_name,
          last_name,
          image_url,
          email_addresses

        );
        if (user && eventType ==='user.created') {
          try{
            await clerkClient.user.updateUserMetadata(id, {
              publicMetadata:{
                userMongoId: user._id,
              }, 
            });

          }  catch (err) {
            console.log('Error: Could not update user metadata:',err)
          }
        }
    } catch (error) {
      console.log('Error: could not create or update user', error)
       return new Response('Error: Could not update user', {
      status: 400,
    });
    }
}

//user delete 

if (eventType === 'user.deleted'){
  try{
    await deleteUser(id);

  } catch (error) {
    console.log ('Error: Could not delete user', error);
    
    return new Response('Error: Could not delete user', {
      status: 400,
    });
    
  }
}
return new Response('webhook receive', { status: 200 })
}

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


