import { HfInference } from '@huggingface/inference'

// Initialize Hugging Face client
const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || '')

// Language code mapping for Hugging Face models
const LANGUAGE_MAPPING: Record<string, string> = {
  en: 'en',
  hi: 'hi',
  bn: 'bn',
  te: 'te', 
  mr: 'mr',
  ta: 'ta',
  ur: 'ur',
  gu: 'gu',
  kn: 'kn',
  ml: 'ml',
  pa: 'pa',
  as: 'as',
  or: 'or',
  ne: 'ne',
  sd: 'sd',
  kok: 'kok',
  mni: 'mni',
  mai: 'mai',
  sat: 'sat',
  doi: 'doi',
  ks: 'ks',
  bo: 'bo'
}

// Cache for translations to avoid repeated API calls
const translationCache = new Map<string, string>()

export class TranslationService {
  private static instance: TranslationService
  private fallbackTranslations: Record<string, Record<string, string>> = {}

  private constructor() {
    // Initialize with fallback translations for critical terms
    this.initializeFallbacks()
  }

  static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService()
    }
    return TranslationService.instance
  }

  private initializeFallbacks() {
    // Critical UI terms that should always be available
    this.fallbackTranslations = {
      loading: {
        en: 'Loading...',
        hi: 'लोड हो रहा है...',
        bn: 'লোড হচ্ছে...',
        te: 'లోడ్ అవుతోంది...',
        mr: 'लोड होत आहे...',
        ta: 'ஏற்றுகிறது...',
        ur: 'لوڈ ہو رہا ہے...',
        gu: 'લોડ થઈ રહ્યું છે...',
        kn: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
        ml: 'ലോഡുചെയ്യുന്നു...',
        pa: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
        as: 'লোড হৈ আছে...',
        or: 'ଲୋଡ୍ ହେଉଛି...',
        ne: 'लोड भइरहेको छ...',
        sd: 'لوڊ ٿي رهيو آهي...',
        kok: 'लोड जाता...',
        mni: 'ꯂꯣꯗ ꯇꯧꯔꯤ...',
        mai: 'लोड भऽ रहल अछि...',
        sat: 'ᱞᱳᱰ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ...',
        doi: 'लोड होआ दा...',
        ks: 'लोड गछान...',
        bo: 'འཇུག་པ་བཞིན་དུ་ཡོད།'
      },
      error: {
        en: 'Error',
        hi: 'त्रुटि',
        bn: 'ত্রুটি',
        te: 'లోపం',
        mr: 'त्रुटी',
        ta: 'பிழை',
        ur: 'خرابی',
        gu: 'ભૂલ',
        kn: 'ದೋಷ',
        ml: 'പിശക്',
        pa: 'ਗਲਤੀ',
        as: 'ভুল',
        or: 'ତ୍ରୁଟି',
        ne: 'त्रुटि',
        sd: 'غلطي',
        kok: 'त्रुटी',
        mni: 'ꯑꯁꯣꯏꯕ',
        mai: 'गलती',
        sat: 'ᱵᱷᱩᱞ',
        doi: 'गलती',
        ks: 'गलती',
        bo: 'འཁྲུལ་བ'
      }
    }
  }

  async translateText(text: string, targetLanguage: string, sourceLanguage = 'en'): Promise<string> {
    // Return original text if same language
    if (sourceLanguage === targetLanguage) {
      return text
    }

    // Check cache first
    const cacheKey = `${text}:${sourceLanguage}->${targetLanguage}`
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!
    }

    try {
      // For now, use a mock translation service as Hugging Face requires proper API setup
      // In production, you would use the actual HF translation model
      const translatedText = await this.mockTranslateWithHF(text, targetLanguage, sourceLanguage)
      
      // Cache the result
      translationCache.set(cacheKey, translatedText)
      return translatedText
    } catch (error) {
      console.error('Translation error:', error)
      
      // Fall back to fallback translations if available
      if (this.fallbackTranslations[text]?.[targetLanguage]) {
        return this.fallbackTranslations[text][targetLanguage]
      }
      
      // Return original text as last resort
      return text
    }
  }

  private async mockTranslateWithHF(text: string, targetLang: string, sourceLang: string): Promise<string> {
    // Mock implementation - in production, replace with actual HF API call
    // This simulates translation behavior for demo purposes
    
    const commonTranslations: Record<string, Record<string, string>> = {
      hi: {
        // UI Elements
        'Track': 'ट्रैक',
        'Dashboard': 'डैशबोर्ड',
        'Settings': 'सेटिंग्स',
        'Loading...': 'लोड हो रहा है...',
        'Saving...': 'सेव हो रहा है...',
        'Save Changes': 'परिवर्तन सेव करें',
        'No Changes': 'कोई बदलाव नहीं',
        'Cancel': 'रद्द करें',
        'You have unsaved changes': 'आपके पास असेव किए गए परिवर्तन हैं',
        
        // Platform and System
        'Indian Railways Digital Platform': 'भारतीय रेल डिजिटल प्लेटफॉर्म',
        'Welcome back': 'वापसी पर स्वागत',
        'Manage railway components and quality assurance across all phases': 'सभी चरणों में रेल घटकों और गुणवत्ता आश्वासन का प्रबंधन करें',
        
        // Stats and Metrics
        'Active Components': 'सक्रिय घटक',
        'Pending Inspections': 'लंबित निरीक्षण',
        'System Health': 'सिस्टम स्वास्थ्य',
        'Alerts': 'अलर्ट',
        
        // User Settings
        'User Preferences': 'उपयोगकर्ता प्राथमिकताएं',
        'Enable notifications': 'सूचनाएं सक्षम करें',
        'Auto-sync data': 'डेटा ऑटो-सिंक करें',
        'Dark mode': 'डार्क मोड',
        'Language': 'भाषा',
        'Region Settings': 'क्षेत्रीय सेटिंग्स',
        'Time zone and regional settings': 'समय क्षेत्र और क्षेत्रीय सेटिंग्स',
        'Select your preferred language from available Indian languages': 'उपलब्ध भारतीय भाषाओं में से अपनी पसंदीदा भाषा चुनें',
        
        // Modules
        'Vendor & Manufacturing': 'विक्रेता और विनिर्माण',
        'Data Matrix generation, batch tracking, and quality control for vendors': 'विक्रेताओं के लिए डेटा मैट्रिक्स जेनरेशन, बैच ट्रैकिंग और गुणवत्ता नियंत्रण',
        'Depot Reception & QA': 'डिपो रिसेप्शन और QA',
        'Material receipt scanning, quality assessment, and inventory management': 'मटेरियल रिसीट स्कैनिंग, गुणवत्ता मूल्यांकन और इन्वेंटरी प्रबंधन',
        'Field Installation': 'फील्ड इंस्टॉलेशन',
        'Installation crew dashboard with GPS tracking and verification': 'GPS ट्रैकिंग और सत्यापन के साथ इंस्टॉलेशन क्रू डैशबोर्ड',
        'Inspection & Monitoring': 'निरीक्षण और निगरानी',
        'Mobile inspection interface with Data Matrix scanning and condition rating': 'डेटा मैट्रिक्स स्कैनिंग और स्थिति रेटिंग के साथ मोबाइल निरीक्षण इंटरफेस',
        'Analytics & Reporting': 'एनालिटिक्स और रिपोर्टिंग',
        'Real-time dashboards, KPIs, and predictive maintenance alerts': 'रियल-टाइम डैशबोर्ड, KPI और भविष्यवाणी रखरखाव अलर्ट',
        'End-of-Life & Recycling': 'जीवन समाप्ति और रीसाइक्लिंग',
        'Recycling workflow and environmental impact tracking': 'रीसाइक्लिंग वर्कफ़ लो और पर्यावरणीय प्रभाव ट्रैकिंग',
        
        // User Roles
        'Administrator': 'प्रशासक',
        'Manager': 'प्रबंधक',
        'Inspector': 'निरीक्षक',
        'Technician': 'तकनीशियन',
        'Vendor': 'विक्रेता',
        'Operator': 'संचालक'
      },
      bn: {
        // UI Elements
        'Track': 'ট্র্যাক',
        'Dashboard': 'ড্যাশবোর্ড',
        'Settings': 'সেটিংস',
        'Loading...': 'লোড হচ্ছে...',
        'Saving...': 'সেভ হচ্ছে...',
        'Save Changes': 'পরিবর্তন সেভ করুন',
        'No Changes': 'কোন পরিবর্তন নেই',
        'Cancel': 'বাতিল',
        'You have unsaved changes': 'আপনার সেভ না করা পরিবর্তন রয়েছে',
        
        // Platform and System
        'Indian Railways Digital Platform': 'ভারতীয় রেল ডিজিটাল প্ল্যাটফর্ম',
        'Welcome back': 'ফিরে এসেছেন স্বাগতম',
        'Manage railway components and quality assurance across all phases': 'সমস্ত পর্যায়ে রেল উপাদান এবং মান নিশ্চিতকরণ পরিচালনা করুন',
        
        // Stats and Metrics
        'Active Components': 'সক্রিয় উপাদান',
        'Pending Inspections': 'অপেক্ষমাণ পরিদর্শন',
        'System Health': 'সিস্টেম স্বাস্থ্য',
        'Alerts': 'সতর্কতা',
        
        // User Settings
        'User Preferences': 'ব্যবহারকারীর পছন্দ',
        'Enable notifications': 'বিজ্ঞপ্তি সক্ষম করুন',
        'Auto-sync data': 'ডেটা স্বয়ংক্রিয় সিঙ্ক',
        'Dark mode': 'ডার্ক মোড',
        'Language': 'ভাষা',
        'Region Settings': 'অঞ্চল সেটিংস',
        'Time zone and regional settings': 'সময় অঞ্চল এবং আঞ্চলিক সেটিংস',
        'Select your preferred language from available Indian languages': 'উপলব্ধ ভারতীয় ভাষা থেকে আপনার পছন্দের ভাষা নির্বাচন করুন'
      },
      te: {
        'Track': 'ట్రాక్',
        'Dashboard': 'డాష్‌బోర్డ్',
        'Settings': 'సెట్టింగులు',
        'Loading...': 'లోడ్ అవుతోంది...',
        'Indian Railways Digital Platform': 'ఇండియన్ రైల్వేస్ డిజిటల్ ప్లాట్‌ఫాం',
        'Welcome back': 'తిరిగి స్వాగతం',
        'Active Components': 'క్రియాశీల భాగాలు',
        'System Health': 'సిస్టమ్ ఆరోగ్యం',
        'Alerts': 'హెచ్చరికలు'
      }
    }
    
    const languageTranslations = commonTranslations[targetLang as keyof typeof commonTranslations]
    if (languageTranslations && languageTranslations[text]) {
      return languageTranslations[text]
    }
    
    // Fallback: return original text
    return text
  }

  // Actual Hugging Face implementation (commented out for demo)
  /*
  private async translateWithHF(text: string, targetLang: string, sourceLang: string): Promise<string> {
    try {
      const result = await hf.translation({
        model: `Helsinki-NLP/opus-mt-${LANGUAGE_MAPPING[sourceLang]}-${LANGUAGE_MAPPING[targetLang]}`,
        inputs: text,
      })
      
      return result.translation_text || text
    } catch (error) {
      console.error('HF Translation error:', error)
      throw error
    }
  }
  */

  async translateObject(obj: Record<string, any>, targetLanguage: string): Promise<Record<string, any>> {
    const result: Record<string, any> = {}
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        result[key] = await this.translateText(value, targetLanguage)
      } else if (typeof value === 'object' && value !== null) {
        result[key] = await this.translateObject(value, targetLanguage)
      } else {
        result[key] = value
      }
    }
    
    return result
  }

  clearCache() {
    translationCache.clear()
  }

  getCacheSize(): number {
    return translationCache.size
  }
}

export const translationService = TranslationService.getInstance()