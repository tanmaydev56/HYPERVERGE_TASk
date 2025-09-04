// components/AIHelpButton.tsx
import { TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { MessageCircle, ShieldAlert, ShieldCheck, FileText } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { convertImageToBase64 } from '@/lib/imageUtils';

const GEMINI_API_KEY = 'AIzaSyAgqiXENXtrQ3CAHvk-zKanmzEIgCmizEw';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const analyzeDocumentWithGemini = async (documentType: string, imageBase64: string) => {
  try {
   const prompt = `
Analyze this ${documentType} document for KYC verification. Be reasonable but thorough.

REALISTIC CHECKS FOR INDIAN DOCUMENTS:
1. Basic format and structure matches genuine documents
2. Presence of key information fields
3. Readability and clarity of text
4. No obvious fake websites or inappropriate content
5. General consistency in the document

For Aadhaar: Look for 12-digit number pattern, Indian name, reasonable details
For PAN: 10-character alphanumeric pattern, Indian name
For Indian documents: Should not contain foreign commercial websites (.com, .cn, etc.)

Be more lenient with:
- Minor blurriness or lighting issues
- Small alignment issues
- Common document variations

Be strict with:
- Obviously fake websites/emails (taobao.com, alibaba.com, etc.)
- Completely wrong number formats
- Inconsistent country references

Return JSON response with:
- verified: boolean (true if it looks like a genuine attempt)
- confidence: number (0-100)
- issues: string[] (specific problems found)
- details: { type: string, number: string, name: string }
`;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid response format from AI');
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('AI verification service temporarily unavailable');
  }
};

interface VerificationResult {
  verified: boolean;
  confidence: number;
  issues: string[];
  details: {
    type: string;
    number?: string;
    name?: string;
    validity?: string;
  };
}

export default function AIHelpButton({ documentUri, onVerificationComplete }: {
  documentUri?: string | null;
  onVerificationComplete?: (result: VerificationResult) => void;
}) {
  const params = useLocalSearchParams();
  const router = useRouter();
  const currentStep = params.id as string || 'general';
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState<{[key: string]: VerificationResult}>({});

  // Auto-verify when document is uploaded
  useEffect(() => {
    if (documentUri && currentStep !== 'selfie' && currentStep !== 'general') {
      verifyDocument();
    }
  }, [documentUri]);

  const verifyDocument = async () => {
    if (!documentUri || !GEMINI_API_KEY) return;

    setIsVerifying(true);
    try {
      const imageBase64 = await convertImageToBase64(documentUri);
      const result = await analyzeDocumentWithGemini(currentStep, imageBase64);
      
      setVerificationResults(prev => ({
        ...prev,
        [currentStep]: result
      }));

      if (onVerificationComplete) {
        onVerificationComplete(result);
      }

      if (result.verified) {
        Alert.alert(
          '✅ Document Verified',
          `AI verification passed with ${result.confidence}% confidence`,
          [{ text: 'Continue' }]
        );
      } else {
        Alert.alert(
          '❌ Verification Issues',
          `Please check your document:\n${result.issues.join('\n• ')}`,
          [{ text: 'Retry' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Verification Error',
        error instanceof Error ? error.message : 'Failed to verify document'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const generateFinalReport = () => {
    const allVerified = Object.values(verificationResults).every(result => result.verified);
    const totalConfidence = Object.values(verificationResults).reduce((sum, result) => sum + result.confidence, 0);
    const averageConfidence = totalConfidence / Object.keys(verificationResults).length;

    if (allVerified && averageConfidence >= 80) {
      Alert.alert(
        '🎉 KYC APPROVED',
        `All documents verified successfully!\n\nAverage confidence: ${Math.round(averageConfidence)}%\n\nYou can now proceed with submission.`,
        [
          {
            text: 'Submit KYC',
            onPress: () => router.push('/success')
          }
        ]
      );
    } else {
      const failedDocs = Object.entries(verificationResults)
        .filter(([_, result]) => !result.verified)
        .map(([doc]) => doc);

      Alert.alert(
        '❌ KYC REJECTED',
        `Verification failed for: ${failedDocs.join(', ')}\n\nPlease re-upload the rejected documents and try again.`,
        [{ text: 'OK' }]
      );
    }
  };

  const showVerificationOptions = () => {
    Alert.alert(
      '🤖 AI Document Verification',
      'I can help verify your documents using advanced AI technology',
      [
        {
          text: 'Verify Current Document',
          onPress: verifyDocument,
          style: 'default'
        },
        {
          text: 'View Final Report',
          onPress: generateFinalReport,
          style: 'default'
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      onPress={showVerificationOptions}
      disabled={isVerifying}
      className="  bg-blue-100 flex    p-3 rounded-full shadow-md z-10"
    >
      
        {isVerifying ? (
        <ActivityIndicator size="small" color="#1D4ED8" />
      ) : (
        <MessageCircle size={24} color="#1D4ED8" />
      )}
      
    </TouchableOpacity>
  );
}