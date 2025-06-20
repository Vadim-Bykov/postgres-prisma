import { ApiError } from "@/server/error/ApiError";
import * as featureFlagService from "@/server/services/featureFlagService";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const featureFlags = await featureFlagService.getAllFeatureFlags();

    return NextResponse.json(featureFlags);
  } catch (error) {
    return ApiError.badRequest("Ошибка при получении данных флагов", error);
  }
}
