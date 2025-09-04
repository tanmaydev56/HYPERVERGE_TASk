// constants/documentSteps.ts
export const DOCUMENT_STEPS = [
  { id: "aadhaar", name: "Aadhaar Card", description: "Upload a clear image of your Aadhaar card (front side)" },
  { id: "pan", name: "PAN Card", description: "Upload a clear image of your PAN card" },
  { id: "dl", name: "Driving License", description: "Upload a clear image of your Driving License (front side)" },
  { id: "selfie", name: "Selfie", description: "Upload a clear image of yourself" },
];
export const languageContent = {
  en: {
    title: 'KYC could not be completed ❌',
    subtitle: '(We found some issues with your documents)',
    audioMessage: 'Audio message playing: KYC verification failed',
    audioText: 'Your KYC verification could not be completed. Please check the highlighted issues and upload clearer documents.',
    sectionTitle: 'Why it failed:',
    issuesTitle: 'Common reasons:',
    issues: [
      'Blurry or unclear photo',
      'Document number not visible',
      'Expired or tampered document',
      'Face mismatch in selfie',
      'Unsupported document type'
    ],
    nextStepsTitle: 'What to do next:',
    nextSteps: [
      'Tap “Retry” to upload clearer images',
      'Use original documents under good light',
      'Contact support if needed'
    ],
    retryButton: 'Retry KYC',
    helpText: 'Need help? Call 1947 or email support@bharatkyc.in',
    certificateText: 'You can retry after 30 minutes'
  },
  hi: {
    title: 'KYC पूरी नहीं हो सकी ❌',
    subtitle: '(आपके दस्तावेज़ों में कुछ समस्याएं मिलीं)',
    audioMessage: 'ऑडियो संदेश: KYC सत्यापन विफल रहा',
    audioText: 'आपका KYC सत्यापन पूरा नहीं हो सका। कृपया दी गई समस्याओं को जांचें और स्पष्ट दस्तावेज़ अपलोड करें।',
    sectionTitle: 'विफल होने के कारण:',
    issuesTitle: 'सामान्य कारण:',
    issues: [
      'धुंधली या अस्पष्ट तस्वीर',
      'दस्तावेज़ नंबर स्पष्ट नहीं है',
      'दस्तावेज़ की समय सीमा समाप्त या छेड़छाड़ किया गया',
      'सेल्फी में चेहरा मेल नहीं खाता',
      'असमर्थित दस्तावेज़ प्रकार'
    ],
    nextStepsTitle: 'आगे क्या करें:',
    nextSteps: [
      'स्पष्ट तस्वीरें अपलोड करने के लिए “पुनः प्रयास करें” पर टैप करें',
      'अच्छी रोशनी में मूल दस्तावेज़ों का उपयोग करें',
      'आवश्यक होने पर सहायता से संपर्क करें'
    ],
    retryButton: 'पुनः प्रयास करें',
    helpText: 'मदद चाहिए? 1947 पर कॉल करें या support@bharatkyc.in पर मेल करें',
    certificateText: 'आप 30 मिनट बाद पुनः प्रयास कर सकते हैं'
  }
};

export const languageContentSuccess = {
  en: {
    title: "Yes, your KYC is completed! ✅",
    subtitle: "(Your verification was successful)",
    audioMessage: "Audio message playing: 'KYC verified successfully'",
    audioText: '"Your KYC has been completed successfully. You can now take loans and open bank accounts."',
    sectionTitle: "Now you can: ",
    loanTitle: "Take a loan ",
    loanSubtitle: "(Get financial assistance)",
    loanDetails: "Agriculture loan, business loan, personal loan",
    bankTitle: "Open bank account ",
    bankSubtitle: "(Start banking services)",
    bankDetails: "Zero balance account, savings account, current account",
    schemesTitle: "Get government schemes ",
    schemesSubtitle: "(Access government programs)",
    schemesDetails: "PM-KISAN, Crop Insurance, Mudra Loan, and more",
    nextStepsTitle: "What to do next? ",
    nextSteps: [
      "Visit bank or talk to agent",
      "Apply for loan",
      "Get information about government schemes"
    ],
    helpText: "Need help? Our team will assist you",
    doneButton: "Finish",
    certificateText: "✅ Your KYC certificate will be ready in 2 hours"
  },
  hi: {
    title: "जी, आपकी KYC पूरी हो गई है! ✅",
    subtitle: "(Yes, your KYC is completed!)",
    audioMessage: "Audio message playing: 'KYC verified successfully'",
    audioText: '"आपकी KYC सफलतापूर्वक पूरी हो गई है। अब आप लोन ले सकते हैं और बैंक खाता खोल सकते हैं।"',
    sectionTitle: "अब आप यह कर सकते हैं: ",
    loanTitle: "लोन ले सकते हैं ",
    loanSubtitle: "(You can take a loan)",
    loanDetails: "Agriculture loan, business loan, personal loan",
    bankTitle: "बैंक खाता खोल सकते हैं ",
    bankSubtitle: "(You can open a bank account)",
    bankDetails: "Zero balance account, savings account, current account",
    schemesTitle: "सरकारी योजनाएं पा सकते हैं ",
    schemesSubtitle: "(Get government schemes)",
    schemesDetails: "PM-KISAN, Fasal Bima, Mudra Loan, and more",
    nextStepsTitle: "आगे क्या करें? ",
    nextSteps: [
      "बैंक जाएं या एजेंट से बात करें",
      "लोन के लिए आवेदन करें",
      "सरकारी योजनाओं की जानकारी लें"
    ],
    helpText: "मदद चाहिए? हमारी टीम आपकी मदद करेगी",
    doneButton: "समाप्त करें",
    certificateText: "✅ आपका KYC प्रमाणपत्र 2 घंटे में तैयार हो जाएगा"
  }
};