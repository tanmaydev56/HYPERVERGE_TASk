import { VerificationResult } from "@/constants/types";

// lib/verification.ts
export function isKycApproved(results: VerificationResult[]): boolean {
  const MIN_CONFIDENCE = 60;   // tweak here
  const MAX_ISSUES   = 1;      // allow 1 minor issue

  return results.every(r =>
    r.verified === true &&
    r.confidence >= MIN_CONFIDENCE &&
    r.issues.length <= MAX_ISSUES
  );
}