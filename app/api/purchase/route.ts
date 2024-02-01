import { PurchaseBody } from "@/models/purchase";
import { ApiError } from "@/server/error/ApiError";
import * as purchaseService from "@/server/services/purchaseService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const purchaseBody: PurchaseBody = await request.json();

    const purchase = await purchaseService.createPurchase(purchaseBody);

    return NextResponse.json(purchase);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      return ApiError.badRequest("Purchase creation error", error);
    }
  }
}

export async function GET() {
  try {
    const purchases = await purchaseService.getAllUserPurchases();

    return NextResponse.json(purchases);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      return ApiError.badRequest("Getting all user purchases error", error);
    }
  }
}
