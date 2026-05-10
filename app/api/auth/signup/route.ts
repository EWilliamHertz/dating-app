import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Gender } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const prisma = new PrismaClient()

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3).max(20),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  dateOfBirth: z.string(),
  gender: z.enum(['MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY']),
  latitude: z.number().optional().default(0),
  longitude: z.number().optional().default(0),
  country: z.string().default(''),
  city: z.string().default(''),
  timezone: z.string().default('UTC'),
  bio: z.string().optional().default(''),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = SignupSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username: validatedData.username },
    })
    if (existingUsername) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

 const seekingGender: { set: Gender[] } = validatedData.gender === 'MALE' ? { set: ['FEMALE'] } :
                          validatedData.gender === 'FEMALE' ? { set: ['MALE'] } :
                          { set: ['MALE', 'FEMALE', 'NON_BINARY'] }

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        username: validatedData.username,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        gender: validatedData.gender,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        country: validatedData.country,
        city: validatedData.city,
        timezone: validatedData.timezone,
        bio: validatedData.bio,
        seekingGender,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
      },
    })

    return NextResponse.json({ message: 'Account created successfully!', user }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
