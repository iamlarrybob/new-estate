import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/BackEnd/utils/Database";
import User from "@/app/BackEnd/models/user";

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req);

    const eventType = evt?.type;
    const { id } = evt?.data;

    await connectDB();

    // CREATE OR UPDATE USER
    if (eventType === "user.created" || eventType === "user.updated") {
      const {
        first_name,
        last_name,
        image_url,
        email_addresses,
      } = evt?.data;

      const email = email_addresses[0]?.email_address;

      await User.findOneAndUpdate(
        { clerkId: id },
        {
          firstName: first_name,
          lastName: last_name,
          email: email,
          image: image_url,
          clerkId: id,
        },
        { upsert: true, new: true }
      );

      console.log("User saved/updated");
    }

    // DELETE USER
    if (eventType === "user.deleted") {
      await User.findOneAndDelete({ clerkId: id });

      console.log("User deleted");
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }
}


// import { headers } from "next/headers";
// import { Webhook } from "svix";
// import { NextResponse } from "next/server";
// // import { clerkClient } from "@clerk/nextjs/server";

// // import { createUser, updateUser, deleteUser } from "@/lib/actions/user";

// export async function POST(req) {
//   const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

//   if (!WEBHOOK_SECRET) {
//     throw new Error("Missing CLERK_WEBHOOK_SECRET");
//   }

//   const headerPayload = await headers();

//   const svix_id = headerPayload.get("svix-id");
//   const svix_timestamp = headerPayload.get("svix-timestamp");
//   const svix_signature = headerPayload.get("svix-signature");

//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     return new Response("Missing svix headers", { status: 400 });
//   }

//   const payload = await req.json();
//   const body = JSON.stringify(payload);

//   const wh = new Webhook(WEBHOOK_SECRET);

//   let evt;

//   try {
//     evt = wh.verify(body, {
//       "svix-id": svix_id,
//       "svix-timestamp": svix_timestamp,
//       "svix-signature": svix_signature,
//     });
//   } catch (err) {
//     console.error("Webhook verification failed", err);
//     return new Response("Invalid signature", { status: 400 });
//   }

//   const { id } = evt.data;
//   const eventType = evt.type;

//   console.log("Webhook event:", eventType);

//   try {

//     // USER CREATED
//     if (eventType === "user.created") {

//       console.log('user.created');
      

//       // const { email_addresses, first_name, last_name, image_url, username } =
//       //   evt.data;

//       // const user = {
//       //   clerkId: id,
//       //   firstName: first_name,
//       //   lastName: last_name,
//       //   username: username,
//       //   email: email_addresses?.[0]?.email_address,
//       //   photo: image_url,
//       // };

//       // const newUser = await createUser(user);

//       // if (newUser) {

//       //   const client = await clerkClient();

//       //   await client.users.updateUserMetadata(id, {
//       //     publicMetadata: {
//       //       userId: newUser._id,
//       //     },
//       //   });

//       // }

//       // return NextResponse.json({
//       //   message: "User created successfully",
//       //   user: newUser,
//       // });
//     }

//     // USER UPDATED
//     if (eventType === "user.updated") {

//       console.log('user.updated');
      

//       // const { email_addresses, first_name, last_name, image_url, username } =
//       //   evt.data;

//       // const updatedUser = {
//       //   firstName: first_name,
//       //   lastName: last_name,
//       //   username: username,
//       //   email: email_addresses?.[0]?.email_address,
//       //   photo: image_url,
//       // };

//       // const user = await updateUser(id, updatedUser);

//       // return NextResponse.json({
//       //   message: "User updated",
//       //   user,
//       // });
//     }

//     // USER DELETED
//     if (eventType === "user.deleted") {

//       console.log('user.deleted');
      
//   //     await deleteUser(id);

//   //     return NextResponse.json({
//   //       message: "User deleted",
//   //     });
//   //   }

//   // } catch (error) {
//   //   console.error("Webhook handler error:", error);
//   //   return new Response("Webhook error", { status: 500 });
//   // }

//   return new Response("Webhook received", { status: 200 });
//     }

  