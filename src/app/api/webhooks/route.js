import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';
import { clerkClient } from '@clerk/nextjs/server';
import { verifyWebhook } from '@clerk/nextjs/webhooks'


export async function POST(req) {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt?.data
    const eventType = evt?.type
if (eventType=== 'user.created' || eventType === 'user.updated') {
    const {
        id,
    first_name,
    last_name,
    image_url,
    email_addresses
    } = evt?.data;
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
              }

            }
          );

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
// if (evt.type === 'user.updated') {
//   console.log('user.updated')
// }

// if (evt.type === 'user.deleted') {
//   console.log('user.deleted')
// }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}