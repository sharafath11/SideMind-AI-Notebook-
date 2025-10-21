import { NextResponse ,NextRequest} from "next/server";

export async function GET() {
    try {
    const res = await fetch("https://zenquotes.io/api/random");
    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return NextResponse.json(
      [
        {
          q: "The mind is not a vessel to be filled, but a fire to be kindled.",
          a: "Plutarch",
        },
      ],
      { status: 200 }
    );
  }
}
