export async function POST(req) {
  try {
    const transaction = await req.json();
    console.log(transaction);
    return NextResponse.json(
      { message: "Ticket sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while sending ticket.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
