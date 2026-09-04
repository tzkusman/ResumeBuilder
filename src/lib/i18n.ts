export type LanguageCode = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'pt' | 'ar' | 'zh' | 'ja';

export interface Translation {
  nav: {
    home: string;
    builder: string;
    examples: string;
    countries: string;
    pricing: string;
    blog: string;
    signIn: string;
    signOut: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  builder: {
    contact: string;
    summary: string;
    experience: string;
    education: string;
    skills: string;
    extras: string;
    template: string;
    export: string;
    atsScore: string;
  };
  common: {
    download: string;
    share: string;
    save: string;
    cancel: string;
    pro: string;
    free: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, Translation> = {
  en: {
    nav: {
      home: 'Home',
      builder: 'Builder',
      examples: 'Examples',
      countries: 'Countries',
      pricing: 'Pricing',
      blog: 'Blog',
      signIn: 'Sign In',
      signOut: 'Sign Out',
    },
    hero: {
      title: 'Build Your Perfect Resume',
      subtitle: 'ATS-proof templates, live preview, and smart keyword matching',
      cta: 'Start Building Free',
    },
    builder: {
      contact: 'Contact',
      summary: 'Summary',
      experience: 'Experience',
      education: 'Education',
      skills: 'Skills',
      extras: 'Extras',
      template: 'Template',
      export: 'Export',
      atsScore: 'ATS Score',
    },
    common: {
      download: 'Download',
      share: 'Share',
      save: 'Save',
      cancel: 'Cancel',
      pro: 'Pro',
      free: 'Free',
    },
  },
  hi: {
    nav: {
      home: 'होम',
      builder: 'निर्माता',
      examples: 'उदाहरण',
      countries: 'देश',
      pricing: 'मूल्य',
      blog: 'ब्लॉग',
      signIn: 'साइन इन',
      signOut: 'साइन आउट',
    },
    hero: {
      title: 'अपना आदर्श रिज़्यूम बनाएं',
      subtitle: 'ATS-प्रूफ टेम्पलेट्स, लाइव प्रीव्यू, और स्मार्ट कीवर्ड मिलान',
      cta: 'मुफ्त में शुरू करें',
    },
    builder: {
      contact: 'संपर्क',
      summary: 'सारांश',
      experience: 'अनुभव',
      education: 'शिक्षा',
      skills: 'कौशल',
      extras: 'अतिरिक्त',
      template: 'टेम्पलेट',
      export: 'निर्यात',
      atsScore: 'ATS स्कोर',
    },
    common: {
      download: 'डाउनलोड',
      share: 'साझा करें',
      save: 'सहेजें',
      cancel: 'रद्द करें',
      pro: 'प्रो',
      free: 'मुफ्त',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      builder: 'Constructor',
      examples: 'Ejemplos',
      countries: 'Países',
      pricing: 'Precios',
      blog: 'Blog',
      signIn: 'Iniciar Sesión',
      signOut: 'Cerrar Sesión',
    },
    hero: {
      title: 'Crea Tu Currículum Perfecto',
      subtitle: 'Plantillas ATS, vista previa en vivo y coincidencia de palabras clave',
      cta: 'Comienza Gratis',
    },
    builder: {
      contact: 'Contacto',
      summary: 'Resumen',
      experience: 'Experiencia',
      education: 'Educación',
      skills: 'Habilidades',
      extras: 'Extras',
      template: 'Plantilla',
      export: 'Exportar',
      atsScore: 'Puntuación ATS',
    },
    common: {
      download: 'Descargar',
      share: 'Compartir',
      save: 'Guardar',
      cancel: 'Cancelar',
      pro: 'Pro',
      free: 'Gratis',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      builder: 'Constructeur',
      examples: 'Exemples',
      countries: 'Pays',
      pricing: 'Tarifs',
      blog: 'Blog',
      signIn: 'Connexion',
      signOut: 'Déconnexion',
    },
    hero: {
      title: 'Créez Votre CV Parfait',
      subtitle: 'Modèles ATS, aperçu en direct et correspondance de mots-clés',
      cta: 'Commencer Gratuitement',
    },
    builder: {
      contact: 'Contact',
      summary: 'Résumé',
      experience: 'Expérience',
      education: 'Formation',
      skills: 'Compétences',
      extras: 'Extras',
      template: 'Modèle',
      export: 'Exporter',
      atsScore: 'Score ATS',
    },
    common: {
      download: 'Télécharger',
      share: 'Partager',
      save: 'Enregistrer',
      cancel: 'Annuler',
      pro: 'Pro',
      free: 'Gratuit',
    },
  },
  de: {
    nav: {
      home: 'Startseite',
      builder: 'Ersteller',
      examples: 'Beispiele',
      countries: 'Länder',
      pricing: 'Preise',
      blog: 'Blog',
      signIn: 'Anmelden',
      signOut: 'Abmelden',
    },
    hero: {
      title: 'Erstellen Sie Ihren Perfekten Lebenslauf',
      subtitle: 'ATS-Vorlagen, Live-Vorschau und Keyword-Matching',
      cta: 'Kostenlos Starten',
    },
    builder: {
      contact: 'Kontakt',
      summary: 'Zusammenfassung',
      experience: 'Erfahrung',
      education: 'Bildung',
      skills: 'Fähigkeiten',
      extras: 'Extras',
      template: 'Vorlage',
      export: 'Exportieren',
      atsScore: 'ATS-Punktzahl',
    },
    common: {
      download: 'Herunterladen',
      share: 'Teilen',
      save: 'Speichern',
      cancel: 'Abbrechen',
      pro: 'Pro',
      free: 'Kostenlos',
    },
  },
  pt: {
    nav: {
      home: 'Início',
      builder: 'Construtor',
      examples: 'Exemplos',
      countries: 'Países',
      pricing: 'Preços',
      blog: 'Blog',
      signIn: 'Entrar',
      signOut: 'Sair',
    },
    hero: {
      title: 'Crie Seu Currículo Perfeito',
      subtitle: 'Modelos ATS, visualização ao vivo e correspondência de palavras-chave',
      cta: 'Comece Grátis',
    },
    builder: {
      contact: 'Contato',
      summary: 'Resumo',
      experience: 'Experiência',
      education: 'Educação',
      skills: 'Habilidades',
      extras: 'Extras',
      template: 'Modelo',
      export: 'Exportar',
      atsScore: 'Pontuação ATS',
    },
    common: {
      download: 'Baixar',
      share: 'Compartilhar',
      save: 'Salvar',
      cancel: 'Cancelar',
      pro: 'Pro',
      free: 'Grátis',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      builder: 'المنشئ',
      examples: 'أمثلة',
      countries: 'الدول',
      pricing: 'الأسعار',
      blog: 'المدونة',
      signIn: 'تسجيل الدخول',
      signOut: 'تسجيل الخروج',
    },
    hero: {
      title: 'أنشئ سيرتك الذاتية المثالية',
      subtitle: 'قوالب متوافقة مع ATS، معاينة مباشرة، ومطابقة الكلمات الرئيسية',
      cta: 'ابدأ مجاناً',
    },
    builder: {
      contact: 'اتصل',
      summary: 'ملخص',
      experience: 'خبرة',
      education: 'تعليم',
      skills: 'مهارات',
      extras: 'إضافات',
      template: 'قالب',
      export: 'تصدير',
      atsScore: 'نقاط ATS',
    },
    common: {
      download: 'تنزيل',
      share: 'مشاركة',
      save: 'حفظ',
      cancel: 'إلغاء',
      pro: 'محترف',
      free: 'مجاني',
    },
  },
  zh: {
    nav: {
      home: '首页',
      builder: '构建器',
      examples: '示例',
      countries: '国家',
      pricing: '定价',
      blog: '博客',
      signIn: '登录',
      signOut: '登出',
    },
    hero: {
      title: '打造完美简历',
      subtitle: 'ATS 证明模板，实时预览和智能关键词匹配',
      cta: '免费开始',
    },
    builder: {
      contact: '联系方式',
      summary: '摘要',
      experience: '工作经历',
      education: '教育背景',
      skills: '技能',
      extras: '其他',
      template: '模板',
      export: '导出',
      atsScore: 'ATS 分数',
    },
    common: {
      download: '下载',
      share: '分享',
      save: '保存',
      cancel: '取消',
      pro: '专业版',
      free: '免费',
    },
  },
  ja: {
    nav: {
      home: 'ホーム',
      builder: '作成ツール',
      examples: '例',
      countries: '国別ガイド',
      pricing: '料金',
      blog: 'ブログ',
      signIn: 'ログイン',
      signOut: 'ログアウト',
    },
    hero: {
      title: '完璧な履歴書を作成',
      subtitle: 'ATS 対応テンプレート、ライブプレビュー、キーワードマッチング',
      cta: '無料で始める',
    },
    builder: {
      contact: '連絡先',
      summary: '要約',
      experience: '職歴',
      education: '学歴',
      skills: 'スキル',
      extras: 'その他',
      template: 'テンプレート',
      export: 'エクスポート',
      atsScore: 'ATS スコア',
    },
    common: {
      download: 'ダウンロード',
      share: '共有',
      save: '保存',
      cancel: 'キャンセル',
      pro: 'プロ',
      free: '無料',
    },
  },
};

export const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  en: 'English',
  hi: 'हिन्दी (Hindi)',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  ar: 'العربية',
  zh: '中文',
  ja: '日本語',
};

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

export function getTranslation(lang: LanguageCode): Translation {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
