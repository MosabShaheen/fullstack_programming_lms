import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema/User";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .then((rows) => rows[0]);

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    
    const hashedPassword = await bcrypt.hash(password, 10); 

    
    await db.insert(users).values({
      email,
      password: hashedPassword,
      role: "user", 
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
