import { NextRequest, NextResponse } from "next/server"
import { SendRawEmailCommand, SESClient } from "@aws-sdk/client-ses"

import { sanitizeInput } from "@/lib/utils/sanitize"

const ENTERPRISE_EMAIL = "enterprise@ethereum.org"
const SES_FROM_EMAIL = "enterprise-contact@ethereum.org"

// Validate environment variables on module load
const validateSESConfig = () => {
  if (!process.env.SES_ACCESS_KEY_ID) {
    throw new Error("SES_ACCESS_KEY_ID environment variable is not set")
  }
  if (!process.env.SES_SECRET_ACCESS_KEY) {
    throw new Error("SES_SECRET_ACCESS_KEY environment variable is not set")
  }
  if (!process.env.SES_REGION) {
    console.warn("SES_REGION not set, defaulting to us-east-2")
  }
  // Validate AWS Access Key format
  if (!/^AKIA[0-9A-Z]{16}$/.test(process.env.SES_ACCESS_KEY_ID)) {
    throw new Error(
      "SES_ACCESS_KEY_ID has invalid format. AWS access keys should start with 'AKIA' followed by 16 alphanumeric characters."
    )
  }
}

// Validate on module load (throws error if misconfigured)
validateSESConfig()

// Configure SES client with validated credentials
const sesClient = new SESClient({
  region: process.env.SES_REGION || "us-east-2",
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY!,
  },
})

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function createRawEmail(
  fromEmail: string,
  toEmail: string,
  replyToEmail: string,
  subject: string,
  textBody: string
): string {
  const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36)}`

  return [
    `From: ${fromEmail}`,
    `To: ${toEmail}`,
    `Reply-To: ${replyToEmail}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    textBody,
    ``,
    `--${boundary}--`,
  ].join("\r\n")
}

async function sendEmail(userEmail: string, message: string): Promise<void> {
  const subject = "Enterprise Inquiry from ethereum.org"
  const textBody = `
New enterprise inquiry received:

From: ${userEmail}
Timestamp: ${new Date().toISOString()}

Message:
${message}

---
This message was sent via the enterprise contact form on ethereum.org/enterprise.
Reply to this email to respond directly to the sender.
  `.trim()

  const rawEmail = createRawEmail(
    SES_FROM_EMAIL,
    ENTERPRISE_EMAIL,
    userEmail,
    subject,
    textBody
  )

  const command = new SendRawEmailCommand({
    RawMessage: {
      Data: new TextEncoder().encode(rawEmail),
    },
  })

  await sesClient.send(command)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, message } = body

    // Validate input
    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required" },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email)
    const sanitizedMessage = sanitizeInput(message)

    // Validate email format
    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Send email via AWS SES
    try {
      await sendEmail(sanitizedEmail, sanitizedMessage)
    } catch (emailError) {
      // Log detailed error server-side only
      console.error("AWS SES email sending failed:", {
        error: emailError instanceof Error ? emailError.message : "Unknown error",
        // Never log the actual credentials or email content
        timestamp: new Date().toISOString(),
      })
      
      // Return generic error to client (don't expose internal details)
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    )
  } catch (error) {
    // Log error details server-side only (never expose to client)
    console.error("Enterprise contact form error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
      // Don't log request body as it may contain sensitive info
    })
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
