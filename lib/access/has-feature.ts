import { auth } from "@clerk/nextjs/server";
import { FeatureKey } from "./features";

export async function hasFeature(feature: FeatureKey) {
  const { has } = await auth();
  return has({ feature });
}
