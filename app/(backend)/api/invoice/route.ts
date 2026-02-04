import { type NextRequest, NextResponse } from "next/server";
import { mockInvoices } from "../../mocks/MockInvoices";
import { MockCustomers } from "../../mocks/MockCustomers";

export async function GET(request: NextRequest) {
  try {
    const customerId = request.nextUrl.searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json(
        { error: "BAD_REQUEST", msg: "customerId is required" },
        { status: 400 },
      );
    }

    const customer = MockCustomers.find((c) => c.customerId === customerId);
    const dataset = mockInvoices
      .filter((inv) => inv.customerId === customerId)
      .map((inv) => ({
        ...inv,
        customerName: customer?.name ?? "Desconocido",
      }));

    return NextResponse.json({ dataset });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "ERROR_500", msg: error },
      { status: 500 },
    );
  }
}
