import { TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { convertImageToBase64 } from '@/lib/imageUtils';
import { VerificationResult } from '@/constants/types';

const GEMINI_API_KEY = 'AIzaSyBCv18PbsBhvOtK-Z5QYfucUh9Pp0g9zCU'; // ← move to .env
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/* ---------- 1.  SINGLE-DOC ANALYSIS  ---------- */
export const analyzeDocumentWithGemini = async (
  docType: 'aadhaar' | 'pan' | 'dl' | 'selfie',
  imageBase64: string
): Promise<VerificationResult> => {
const prompt = `You are an Indian KYC validator.
Check the ${docType} image:
- Indian document layout (Aadhaar / PAN / DL / selfie)
- Readable name & number / face visible
- No foreign logos, fake URLs, completely wrong format
Allow: minor blur, glare, masked Aadhaar, slight rotation.
Block: obvious fake, foreign site, wrong country flag.

Return **only** JSON:
{"verified":bool,"confidence":0-100,"issues":[],"details":{"type":"${docType}","number":"...","name":"..."}}`;
  const res = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } }] }],
    }),
  });

  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const raw = await res.json();
  const text = raw.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const json = text.match(/\{[\s\S]*\}/); // extract JSON blob
  if (!json) throw new Error('No JSON from Gemini');
  return JSON.parse(json[0]);
};

/* ---------- 2.  MULTI-DOC + SELFIE WRAPPER  ---------- */
export const analyzeKycBundle = async (
  docs: Record<string, string>,
  selfieB64: string | null
) => {
  // 1. analyse every doc
  const docPromises = Object.entries(docs).map(async ([type, b64]) => ({
    type,
    result: await analyzeDocumentWithGemini(type as any, b64),
  }));
  const docResults = await Promise.all(docPromises);

  // 2. analyse selfie
  const selfieResult = selfieB64
    ? await analyzeDocumentWithGemini('selfie', selfieB64)
    : { verified: true, confidence: 100, issues: [], details: { type: 'selfie' } };

  // 3. summary
  const allOk = docResults.every(d => d.result.verified) && selfieResult.verified;
  const avgConf =
    [...docResults.map(d => d.result.confidence), selfieResult.confidence].reduce((a, b) => a + b, 0) /
    (docResults.length + 1);

  return {
    kycStatus: allOk ? 'approved' : 'rejected',
    confidence: Math.round(avgConf),
    faceMatchConfidence: selfieResult.confidence,
    issues: [...docResults, { result: selfieResult }].flatMap(d => d.result.issues),
    // 4. individual results
    docResults: Object.fromEntries(docResults.map(d => [d.type, d.result])),
    selfieResult,
  };
};

/* ---------- 3.  UI BUTTON  ---------- */
export default function AIHelpButton({ documentUri, onVerificationComplete }: {
  documentUri?: string | null;
  onVerificationComplete?: (result: VerificationResult) => void;
}) {
  const params = useLocalSearchParams();
  const router = useRouter();
  const step = (params.id as string) || 'general';
  const [verifying, setVerifying] = useState(false);
  const [results, setResults] = useState<Record<string, VerificationResult>>({});

  useEffect(() => {
    if (documentUri && step !== 'selfie' && step !== 'general') verifyDoc();
  }, [documentUri]);

  const verifyDoc = async () => {
    if (!documentUri) return;
    setVerifying(true);
    try {
      const b64 = await convertImageToBase64(documentUri);
      const res = await analyzeDocumentWithGemini(step as any, b64);
      setResults(prev => ({ ...prev, [step]: res }));
      onVerificationComplete?.(res);
      Alert.alert(res.verified ? '✅ Verified' : '❌ Issues', res.issues.join('\n• ') || 'Looks good!');
    } catch (e: any) {
      Alert.alert('Verification error', e.message);
    } finally {
      setVerifying(false);
    }
  };

  const finalReport = () => {
    const allOk = Object.values(results).every(r => r.verified);
    const avg = Object.values(results).reduce((s, r) => s + r.confidence, 0) / Object.keys(results).length || 0;
    if (allOk && avg >= 80) {
      Alert.alert('🎉 KYC Approved', `Avg confidence ${Math.round(avg)}%`, [{ text: 'Submit', onPress: () => router.push('/success') }]);
    } else {
      const failed = Object.entries(results).filter(([, r]) => !r.verified).map(([k]) => k);
      Alert.alert('❌ KYC Rejected', `Failed for: ${failed.join(', ')}`);
    }
  };

  const showMenu = () =>
    Alert.alert('AI Help', '', [
      { text: 'Verify current', onPress: verifyDoc },
      { text: 'Final report', onPress: finalReport },
      { text: 'Cancel', style: 'cancel' },
    ]);

  return (
    <TouchableOpacity onPress={showMenu} disabled={verifying} className="bg-blue-100 p-3 rounded-full shadow-md z-10">
      {verifying ? <ActivityIndicator size="small" color="#1D4ED8" /> : <MessageCircle size={24} color="#1D4ED8" />}
    </TouchableOpacity>
  );
}