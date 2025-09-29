// Translation Service
// Uses API routes for translation services

interface TranslationCache {
  [key: string]: {
    translation: string
    timestamp: number
    expiresIn: number
  }
}

class TranslateService {
  private cache: TranslationCache = {}
  private readonly cacheExpiration = 24 * 60 * 60 * 1000 // 24 hours
  private readonly maxCacheSize = 1000
  
  // Language mappings
  private readonly languageMap = {
    'en': 'en',
    'hi': 'hi',
    'es': 'es', 
    'fr': 'fr',
    'de': 'de',
    'zh': 'zh',
    'ja': 'ja',
    'ko': 'ko',
    'ar': 'ar',
    'pt': 'pt',
    'ru': 'ru',
    'it': 'it',
    'nl': 'nl',
    'sv': 'sv',
    'da': 'da',
    'no': 'no',
    'fi': 'fi'
  }

  // Fallback translations for common Railway Management terms
  private readonly fallbackTranslations = {
    'en': {
      'Track': 'Track',
      'Railway': 'Railway', 
      'Management': 'Management',
      'System': 'System',
      'Settings': 'Settings',
      'Notifications': 'Notifications',
      'Dashboard': 'Dashboard',
      'QR Code': 'QR Code',
      'Scan': 'Scan',
      'Upload': 'Upload',
      'Download': 'Download',
      'Save': 'Save',
      'Cancel': 'Cancel',
      'Submit': 'Submit',
      'Edit': 'Edit',
      'Delete': 'Delete',
      'Search': 'Search',
      'Filter': 'Filter',
      'Export': 'Export',
      'Import': 'Import',
      'User': 'User',
      'Admin': 'Admin',
      'Inspector': 'Inspector',
      'Vendor': 'Vendor',
      'Depot': 'Depot',
      'Batch': 'Batch',
      'Quality': 'Quality',
      'Report': 'Report',
      'Analysis': 'Analysis',
      'Status': 'Status',
      'Active': 'Active',
      'Inactive': 'Inactive',
      'Pending': 'Pending',
      'Complete': 'Complete',
      'Failed': 'Failed',
      'Success': 'Success',
      'Error': 'Error',
      'Warning': 'Warning',
      'Info': 'Info'
    },
    'hi': {
      'Track': 'ट्रैक',
      'Railway': 'रेलवे',
      'Management': 'प्रबंधन',
      'System': 'सिस्टम',
      'Settings': 'सेटिंग्स',
      'Notifications': 'सूचनाएं',
      'Dashboard': 'डैशबोर्ड',
      'QR Code': 'QR कोड',
      'Scan': 'स्कैन',
      'Upload': 'अपलोड',
      'Download': 'डाउनलोड',
      'Save': 'सेव',
      'Cancel': 'रद्द करें',
      'Submit': 'सबमिट',
      'Edit': 'संपादित करें',
      'Delete': 'हटाएं',
      'Search': 'खोजें',
      'Filter': 'फिल्टर',
      'Export': 'निर्यात',
      'Import': 'आयात',
      'User': 'उपयोगकर्ता',
      'Admin': 'एडमिन',
      'Inspector': 'निरीक्षक',
      'Vendor': 'विक्रेता',
      'Depot': 'डिपो',
      'Batch': 'बैच',
      'Quality': 'गुणवत्ता',
      'Report': 'रिपोर्ट',
      'Analysis': 'विश्लेषण',
      'Status': 'स्थिति',
      'Active': 'सक्रिय',
      'Inactive': 'निष्क्रिय',
      'Pending': 'लंबित',
      'Complete': 'पूर्ण',
      'Failed': 'असफल',
      'Success': 'सफल',
      'Error': 'त्रुटि',
      'Warning': 'चेतावनी',
      'Info': 'जानकारी'
    },
    'es': {
      'Track': 'Pista',
      'Railway': 'Ferrocarril',
      'Management': 'Gestión',
      'System': 'Sistema',
      'Settings': 'Configuración',
      'Notifications': 'Notificaciones',
      'Dashboard': 'Tablero',
      'QR Code': 'Código QR',
      'Scan': 'Escanear',
      'Upload': 'Subir',
      'Download': 'Descargar',
      'Save': 'Guardar',
      'Cancel': 'Cancelar',
      'Submit': 'Enviar',
      'Edit': 'Editar',
      'Delete': 'Eliminar',
      'Search': 'Buscar',
      'Filter': 'Filtrar',
      'Export': 'Exportar',
      'Import': 'Importar',
      'User': 'Usuario',
      'Admin': 'Administrador',
      'Inspector': 'Inspector',
      'Vendor': 'Proveedor',
      'Depot': 'Depósito',
      'Batch': 'Lote',
      'Quality': 'Calidad',
      'Report': 'Informe',
      'Analysis': 'Análisis',
      'Status': 'Estado',
      'Active': 'Activo',
      'Inactive': 'Inactivo',
      'Pending': 'Pendiente',
      'Complete': 'Completo',
      'Failed': 'Fallido',
      'Success': 'Éxito',
      'Error': 'Error',
      'Warning': 'Advertencia',
      'Info': 'Información'
    },
    'fr': {
      'Track': 'Voie',
      'Railway': 'Chemin de fer',
      'Management': 'Gestion',
      'System': 'Système',
      'Settings': 'Paramètres',
      'Notifications': 'Notifications',
      'Dashboard': 'Tableau de bord',
      'QR Code': 'Code QR',
      'Scan': 'Scanner',
      'Upload': 'Télécharger',
      'Download': 'Télécharger',
      'Save': 'Sauvegarder',
      'Cancel': 'Annuler',
      'Submit': 'Soumettre',
      'Edit': 'Modifier',
      'Delete': 'Supprimer',
      'Search': 'Rechercher',
      'Filter': 'Filtrer',
      'Export': 'Exporter',
      'Import': 'Importer',
      'User': 'Utilisateur',
      'Admin': 'Administrateur',
      'Inspector': 'Inspecteur',
      'Vendor': 'Fournisseur',
      'Depot': 'Dépôt',
      'Batch': 'Lot',
      'Quality': 'Qualité',
      'Report': 'Rapport',
      'Analysis': 'Analyse',
      'Status': 'Statut',
      'Active': 'Actif',
      'Inactive': 'Inactif',
      'Pending': 'En attente',
      'Complete': 'Terminé',
      'Failed': 'Échoué',
      'Success': 'Succès',
      'Error': 'Erreur',
      'Warning': 'Avertissement',
      'Info': 'Information'
    }
  }

  constructor() {
    // Load cache from localStorage
    if (typeof window !== 'undefined' && localStorage) {
      try {
        const cached = localStorage.getItem('translation-cache')
        if (cached) {
          this.cache = JSON.parse(cached)
        }
      } catch (error) {
        console.warn('Failed to load translation cache:', error)
      }
    }
  }

  private getCacheKey(text: string, targetLang: string, sourceLang: string): string {
    return `${sourceLang}:${targetLang}:${text.slice(0, 100)}`
  }

  private isValidCache(cached: { translation: string; timestamp: number; expiresIn: number }): boolean {
    return Date.now() - cached.timestamp < cached.expiresIn
  }

  private setCache(key: string, translation: string): void {
    // Clean cache if it's getting too large
    if (Object.keys(this.cache).length >= this.maxCacheSize) {
      const entries = Object.entries(this.cache)
      entries.sort(([,a], [,b]) => a.timestamp - b.timestamp)
      
      // Remove oldest 25% of entries
      const toRemove = Math.floor(entries.length * 0.25)
      for (let i = 0; i < toRemove; i++) {
        delete this.cache[entries[i][0]]
      }
    }

    this.cache[key] = {
      translation,
      timestamp: Date.now(),
      expiresIn: this.cacheExpiration
    }

    // Save to localStorage
    if (typeof window !== 'undefined' && localStorage) {
      try {
        localStorage.setItem('translation-cache', JSON.stringify(this.cache))
      } catch (error) {
        console.warn('Failed to save translation cache:', error)
      }
    }
  }

  private getFallbackTranslation(text: string, targetLang: string): string | null {
    const fallbacks = this.fallbackTranslations[targetLang as keyof typeof this.fallbackTranslations]
    if (fallbacks && fallbacks[text as keyof typeof fallbacks]) {
      return fallbacks[text as keyof typeof fallbacks]
    }
    return null
  }

  // Client-side translation methods
  private async translateWithLibre(
    text: string, 
    targetLang: string, 
    sourceLang: string = 'auto'
  ): Promise<string> {
    try {
      const response = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang === 'auto' ? 'auto' : this.languageMap[sourceLang as keyof typeof this.languageMap] || sourceLang,
          target: this.languageMap[targetLang as keyof typeof this.languageMap] || targetLang,
          format: 'text'
        })
      })

      if (!response.ok) {
        throw new Error(`LibreTranslate API error: ${response.status}`)
      }

      const data = await response.json()
      return data.translatedText || text
    } catch (error) {
      throw error
    }
  }

  private async translateWithMyMemory(
    text: string, 
    targetLang: string, 
    sourceLang: string = 'auto'
  ): Promise<string> {
    try {
      const sourceLangCode = sourceLang === 'auto' ? 'en' : this.languageMap[sourceLang as keyof typeof this.languageMap] || sourceLang
      const targetLangCode = this.languageMap[targetLang as keyof typeof this.languageMap] || targetLang
      
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLangCode}|${targetLangCode}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`MyMemory API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.responseStatus === 200 || data.responseStatus === '200') {
        return data.responseData.translatedText || text
      } else {
        throw new Error(`MyMemory API error: ${data.responseDetails}`)
      }
    } catch (error) {
      throw error
    }
  }

  // Main translation method using direct service calls
  async translate(
    text: string, 
    targetLang: string, 
    sourceLang: string = 'auto'
  ): Promise<string> {
    // Return original text if same language or empty
    if (!text || !text.trim() || targetLang === 'en' || targetLang === sourceLang) {
      return text
    }

    const cacheKey = this.getCacheKey(text, targetLang, sourceLang)
    
    // Check cache first
    const cached = this.cache[cacheKey]
    if (cached && this.isValidCache(cached)) {
      return cached.translation
    }

    // Try fallback translations first (instant)
    const fallback = this.getFallbackTranslation(text, targetLang)
    if (fallback) {
      this.setCache(cacheKey, fallback)
      return fallback
    }

    // Try translation services in order of preference
    const translationMethods = [
      () => this.translateWithLibre(text, targetLang, sourceLang),
      () => this.translateWithMyMemory(text, targetLang, sourceLang)
    ]

    for (const method of translationMethods) {
      try {
        const translatedText = await method()
        this.setCache(cacheKey, translatedText)
        return translatedText
      } catch (error) {
        // Continue to next method
        continue
      }
    }

    // If all methods fail, return original text
    console.warn('All translation services failed, returning original text')
    return text
  }

  // Batch translation for better performance
  async translateBatch(
    texts: string[], 
    targetLang: string, 
    sourceLang: string = 'auto'
  ): Promise<string[]> {
    const results: string[] = []
    
    // Process in chunks to avoid overwhelming the API
    const chunkSize = 5
    for (let i = 0; i < texts.length; i += chunkSize) {
      const chunk = texts.slice(i, i + chunkSize)
      const chunkPromises = chunk.map(text => this.translate(text, targetLang, sourceLang))
      const chunkResults = await Promise.allSettled(chunkPromises)
      
      chunkResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value)
        } else {
          console.warn(`Translation failed for text: ${chunk[index]}`, result.reason)
          results.push(chunk[index]) // Return original text on failure
        }
      })
      
      // Small delay between chunks to respect rate limits
      if (i + chunkSize < texts.length) {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }
    
    return results
  }

  // Get available languages
  getAvailableLanguages(): string[] {
    return Object.keys(this.languageMap)
  }

  // Clear cache
  clearCache(): void {
    this.cache = {}
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem('translation-cache')
    }
  }

  // Get cache statistics
  getCacheStats(): { size: number; entries: number } {
    const cacheString = JSON.stringify(this.cache)
    return {
      size: new Blob([cacheString]).size,
      entries: Object.keys(this.cache).length
    }
  }
}

// Create singleton instance
export const translateService = new TranslateService()

// React hook for easy translation
export function useTranslateService() {
  return {
    translate: translateService.translate.bind(translateService),
    translateBatch: translateService.translateBatch.bind(translateService),
    getAvailableLanguages: translateService.getAvailableLanguages.bind(translateService),
    clearCache: translateService.clearCache.bind(translateService),
    getCacheStats: translateService.getCacheStats.bind(translateService)
  }
}

// Legacy exports for backward compatibility
export const googleTranslate = translateService
export const useGoogleTranslate = useTranslateService