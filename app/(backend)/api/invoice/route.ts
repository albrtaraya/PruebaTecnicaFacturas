import { type NextRequest, NextResponse } from "next/server";
import { mockInvoices } from "../../mocks/MockInvoices";

export async function GET(request: NextRequest) {
  try {
    const customerId = request.nextUrl.searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json(
        { error: "BAD_REQUEST", msg: "customerId is required" },
        { status: 400 },
      );
    }

    const dataset = mockInvoices.filter((inv) => inv.customerId === customerId);

    return NextResponse.json({ dataset });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "ERROR_500", msg: error },
      { status: 500 },
    );
  }
}
