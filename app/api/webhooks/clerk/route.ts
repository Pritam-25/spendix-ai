import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    console.log('Webhook received')  // Log that a request was received

    const evt = await verifyWebhook(req)
    console.log('Webhook verified:', evt.type)  // Log the event type
    console.log('Event data:', evt.data)       // Log full data for debugging

    if (evt.type === 'user.created') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data
      console.log('Creating new user:', id, email_addresses[0]?.email_address)

      await prisma.user.upsert({
        where: { clerkUserId: id },
        update: {}, // No update on create
        create: {
          clerkUserId: id,
          email: email_addresses[0]?.email_address ?? '',
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
      })
      console.log('User created successfully:', id)
    }

    if (evt.type === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data
      console.log('Updating user:', id)

      await prisma.user.upsert({
        where: { clerkUserId: id },
        update: {
          email: email_addresses[0]?.email_address ?? '',
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
        create: {
          clerkUserId: id,
          email: email_addresses[0]?.email_address ?? '',
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
      })
      console.log('User updated successfully:', id)
    }

    if (evt.type === 'user.deleted') {
      const { id } = evt.data
      console.log('Deleting user:', id)

      if (id) {
        await prisma.user
          .delete({
            where: { clerkUserId: id },
          })
          .catch(() => {
            console.log('User already deleted:', id)
          })
        console.log('User deleted successfully:', id)
      }
    }

    console.log('Webhook processing finished')
    return new Response('Webhook processed', { status: 200 })
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return new Response('Invalid webhook', { status: 400 })
  }
}
