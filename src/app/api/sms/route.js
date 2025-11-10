import { NextResponse } from "next/server";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK only if not already initialized
if (!admin.apps.length) {
  try {
    const serviceAccount = require("@/app/lib/firebase-service.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://pankajnew1-3aa10-default-rtdb.firebaseio.com",
    });
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

const db = admin.database();

// To handle a GET request to /api/sms
export async function GET(req, res) {
  try {
    if (!admin.apps.length) {
      return NextResponse.json(
        { data: "Firebase not initialized" },
        { status: 500 }
      );
    }
    
    const snapshot = await db.ref("users").once("value");
    const users = snapshot.val();

    // Return the response with cache headers
    return NextResponse.json(
      { data: users }, 
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
      }
    );
  } catch (error) {
    console.error("Error fetching users data:", error);
    return NextResponse.json(
      { data: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// To handle a POST request to /api/sms
export async function POST(req, res) {
  try {
    if (!admin.apps.length) {
      return NextResponse.json(
        { data: "Firebase not initialized" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { title, sender, content } = body;

    // Validate required fields
    if (!sender || !content || !title) {
      return NextResponse.json(
        { data: "Bad Request: Missing title or sender or content" },
        { status: 400 }
      );
    }

    // Get the current timestamp
    const time = new Date().toISOString();

    // Add SMS data to Firebase Realtime Database
    const newSmsRef = db.ref("sms").push();
    await newSmsRef.set({ title, sender, content, time });

    // Return the response
    return NextResponse.json(
      { data: "SMS data added successfully" },
      { 
        status: 201,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
      }
    );
  } catch (error) {
    console.error("Error adding SMS data:", error);
    return NextResponse.json(
      { data: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// To handle a POST request to /api/data
// export async function POST(req, res) {
//   try {
//     const body = await req.json(); // Parse the request body

//     const { title, sender, content } = body;

//     // Validate required fields
//     if (!sender || !content || !title) {
//       return NextResponse.json(
//         { data: "Bad Request: Missing title or sender or content" },
//         { status: 400 }
//       );
//     }

//     // Get the current timestamp
//     const time = new Date().toISOString();

//     // Generate custom ID (serial number)
//     const snapshot = await db.ref("sms").once("value");
//     const currentCount = snapshot.numChildren(); // Get current number of children
//     const customId = currentCount + 1; // Increment to generate the next ID

//     // Add SMS data to Firebase Realtime Database with custom ID
//     const newSmsRef = db.ref("sms").child(customId.toString()); // Use custom ID as key
//     await newSmsRef.set({ id: customId, title, sender, content, time }); // Include custom ID in data

//     // Return the response
//     return NextResponse.json(
//       { data: "SMS data added successfully", id: customId },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error adding SMS data:", error);
//     return NextResponse.json(
//       { data: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
