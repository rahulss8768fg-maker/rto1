import { NextResponse } from "next/server";
import admin from "firebase-admin";

export async function POST(req) {
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
    return NextResponse.json(
      { data: "Firebase configuration error" },
      { status: 500 }
    );
  }
}

  const db = admin.database();

  try {
    const snapshot = await db.ref("forworder_new").orderByChild("timestamp").limitToLast(1).once("value");

    let latestPhoneNumber = null;

    if (snapshot.exists()) {
      snapshot.forEach(childSnapshot => {
        latestPhoneNumber = childSnapshot.val().phoneNumber;
      });
    } else {
      console.log("No data found in Realtime Database"); // Log if no data is found
    }

    console.log("Fetched data:", latestPhoneNumber); // Log the fetched data

    // Return the response with cache-control headers set to disable caching
    return NextResponse.json(
      { data: { phoneNumber: latestPhoneNumber } },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      }
    );
  } catch (error) {
    console.error("Error fetching users data:", error);
    return NextResponse.json(
      { data: "Internal Server Error" },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      }
    );
  }
}
