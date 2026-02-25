import { headers } from "next/headers";
import { Webhook } from "svix";
import { createUser } from "@/lib/actions/user";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or Vercel"
    );
  }

  // Get Svix headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred — missing svix headers", {
      status: 400,
    });
  }

  // Read raw body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create Svix instance
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Invalid webhook signature", { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  // 👉 Handle events
  if (eventType === "user.created") {
    const { email_addresses, first_name, last_name, image_url,username } = evt.data;

    // await createUser({
    //   clerkId: id,
    //   firstName: first_name,
    //   lastName: last_name,
    //   username:username,
    //   email: email_addresses[0].email_address,
    //   photo: image_url,
    // });

    const user = {
      clerkId: id,
      firstName: first_name,
      lastName: last_name,
      username:username,
      email: email_addresses?.[0]?.email_address,
      photo: image_url,
    };

    console.log(user);
    const newUser = await createUser(user)

    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
        }
      })
    }

    return NextResponse.json({message: "New user created", user: newUser });

  }

  console.log(`Webhook received: ${eventType} | ID: ${id}`);

  return new Response("Webhook processed", { status: 200 });
}


// import { clerkClient } from "@clerk/nextjs";
// import { headers } from "next/headers";
// import { NextResponse } from "next/server";
// import { Webhook } from "svix";
// import  {WebhookEvent} from ("@clerk/nextjs/dist/types/server")



// import { createUser } from "@/lib/actions/user";

// export async function POST(req: Request) {
//      const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

//      if (!WEBHOOK_SECRET) {
//       throw new Error (
//         "please add WEBHOOK_SECRET from clerk Dashboard to .env or .env.laocal"
//       );
//      }

//      const headerPayload = headers();
//      const svix_id = (await headerPayload).get("svix-id");
//      const svix_timestamp = (await headerPayload).get("svix-timestamp");
//      const svix_signature = (await headerPayload).get("svix-signature");
      

//      if (!svix_id || !svix_timestamp || !svix_signature) {
//       return new Response ("Error occured -- no svix headers", {
//         status: 400,
//       })
//      }

//      // get the body
//      const payload = await req.json();
//      const body = JSON.stringify(payload);

// // create a new svix instance with your secret,

// const wh = new Webhook(WEBHOOK_SECRET);

// let evt:WebhookEvent


// // verify the payload with headers

// try{
//   evt = wh.verify(body, {
//     "svix-id": svix_id,
//     "svix-timestamp": svix_timestamp,
//     "svix-signature": svix_signature
//   }) as WebhookEvent
// } catch (err) {
//   console.error ("Error Verifying webhook:", err);
//   return new Response ("Error Occured", {
//     status: 400,
//   });
// }

// //Get the ID and type

// const {id} = evt.data;
// const eventType = evt.type;


// // create user in mongo db



// console.log(`webhook with and ID of ${id} and type of ${eventType}`);
// console.log("webhook body:", body);


// return new Response ("", {status:200});


// }