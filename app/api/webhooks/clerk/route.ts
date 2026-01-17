import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const isDev = process.env.NODE_ENV !== "production";

    if (isDev) {
      console.log("Webhook received"); // Log that a request was received
    }

    const evt = await verifyWebhook(req);
    if (isDev) {
      console.log("Webhook verified:", evt.type); // Log the event type
      console.log("Event data:", evt.data); // Log full data for debugging
    }

    if (evt.type === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;
      if (isDev) {
        console.log(
          "Creating new user:",
          id,
          email_addresses[0]?.email_address,
        );
      }

      await prisma.user.upsert({
        where: { clerkUserId: id },
        update: {}, // No update on create
        create: {
          clerkUserId: id,
          email: email_addresses[0]?.email_address ?? "",
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
      });
      if (isDev) {
        console.log("User created successfully:", id);
      }
    }

    if (evt.type === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;
      if (isDev) {
        console.log("Updating user:", id);
      }

      await prisma.user.upsert({
        where: { clerkUserId: id },
        update: {
          email: email_addresses[0]?.email_address ?? "",
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
        create: {
          clerkUserId: id,
          email: email_addresses[0]?.email_address ?? "",
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
      });
      if (isDev) {
        console.log("User updated successfully:", id);
      }
    }

    if (evt.type === "user.deleted") {
      const { id } = evt.data;
      if (isDev) {
        console.log("Deleting user:", id);
      }

      if (id) {
        await prisma.user
          .delete({
            where: { clerkUserId: id },
          })
          .catch(() => {
            if (isDev) {
              console.log("User already deleted:", id);
            }
          });
        if (isDev) {
          console.log("User deleted successfully:", id);
        }
      }
    }

    if (isDev) {
      console.log("Webhook processing finished");
    }
    return new Response("Webhook processed", { status: 200 });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Webhook verification failed:", err);
    }
    return new Response("Invalid webhook", { status: 400 });
  }
}
