import { VerificationResult } from "@/constants/types";

// lib/verification.ts
export function isKycApproved(results: VerificationResult[]): boolean {
  const minimumConfidence = 60;   
  const maxIssues  = 1;      

  return results.every(r =>
    r.verified === true &&
    r.confidence >= minimumConfidence &&
    r.issues.length <= maxIssues
  );
}