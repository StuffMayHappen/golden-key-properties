import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const LANGUAGES = [
  { code: "pt", name: "Português" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "zh", name: "中文" },
  { code: "hi", name: "हिन्दी" },
  { code: "ar", name: "العربية" },
  { code: "bn", name: "বাংলা" },
  { code: "ru", name: "Русский" },
  { code: "ja", name: "日本語" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
  { code: "ko", name: "한국어" },
  { code: "tr", name: "Türkçe" },
  { code: "it", name: "Italiano" },
  { code: "id", name: "Bahasa Indonesia" },
] as const;

const resources = {
  pt: { translation: {
    nav: { home: "Início", dashboard: "Dashboard", generator: "Gerador", pricing: "Preços", signIn: "Entrar", start: "Começar Grátis", signOut: "Sair" },
    footer: { rights: "Todos os direitos reservados." },
    theme: { light: "Modo claro", dark: "Modo escuro" },
    language: "Idioma",
  }},
  en: { translation: {
    nav: { home: "Home", dashboard: "Dashboard", generator: "Generator", pricing: "Pricing", signIn: "Sign in", start: "Start Free", signOut: "Sign out" },
    footer: { rights: "All rights reserved." },
    theme: { light: "Light mode", dark: "Dark mode" },
    language: "Language",
  }},
  es: { translation: {
    nav: { home: "Inicio", dashboard: "Panel", generator: "Generador", pricing: "Precios", signIn: "Entrar", start: "Empezar Gratis", signOut: "Salir" },
    footer: { rights: "Todos los derechos reservados." },
    theme: { light: "Modo claro", dark: "Modo oscuro" },
    language: "Idioma",
  }},
  zh: { translation: {
    nav: { home: "首页", dashboard: "仪表板", generator: "生成器", pricing: "价格", signIn: "登录", start: "免费开始", signOut: "退出" },
    footer: { rights: "版权所有。" },
    theme: { light: "浅色模式", dark: "深色模式" },
    language: "语言",
  }},
  hi: { translation: {
    nav: { home: "मुखपृष्ठ", dashboard: "डैशबोर्ड", generator: "जनरेटर", pricing: "मूल्य", signIn: "साइन इन", start: "मुफ़्त शुरू करें", signOut: "साइन आउट" },
    footer: { rights: "सर्वाधिकार सुरक्षित।" },
    theme: { light: "लाइट मोड", dark: "डार्क मोड" },
    language: "भाषा",
  }},
  ar: { translation: {
    nav: { home: "الرئيسية", dashboard: "لوحة التحكم", generator: "المولد", pricing: "الأسعار", signIn: "تسجيل الدخول", start: "ابدأ مجانًا", signOut: "خروج" },
    footer: { rights: "جميع الحقوق محفوظة." },
    theme: { light: "الوضع الفاتح", dark: "الوضع الداكن" },
    language: "اللغة",
  }},
  bn: { translation: {
    nav: { home: "হোম", dashboard: "ড্যাশবোর্ড", generator: "জেনারেটর", pricing: "মূল্য", signIn: "সাইন ইন", start: "বিনামূল্যে শুরু করুন", signOut: "সাইন আউট" },
    footer: { rights: "সর্বস্বত্ব সংরক্ষিত।" },
    theme: { light: "লাইট মোড", dark: "ডার্ক মোড" },
    language: "ভাষা",
  }},
  ru: { translation: {
    nav: { home: "Главная", dashboard: "Панель", generator: "Генератор", pricing: "Цены", signIn: "Войти", start: "Начать бесплатно", signOut: "Выйти" },
    footer: { rights: "Все права защищены." },
    theme: { light: "Светлая тема", dark: "Тёмная тема" },
    language: "Язык",
  }},
  ja: { translation: {
    nav: { home: "ホーム", dashboard: "ダッシュボード", generator: "ジェネレーター", pricing: "料金", signIn: "ログイン", start: "無料で始める", signOut: "ログアウト" },
    footer: { rights: "全著作権所有。" },
    theme: { light: "ライトモード", dark: "ダークモード" },
    language: "言語",
  }},
  de: { translation: {
    nav: { home: "Start", dashboard: "Dashboard", generator: "Generator", pricing: "Preise", signIn: "Anmelden", start: "Kostenlos starten", signOut: "Abmelden" },
    footer: { rights: "Alle Rechte vorbehalten." },
    theme: { light: "Heller Modus", dark: "Dunkler Modus" },
    language: "Sprache",
  }},
  fr: { translation: {
    nav: { home: "Accueil", dashboard: "Tableau de bord", generator: "Générateur", pricing: "Tarifs", signIn: "Connexion", start: "Commencer gratuitement", signOut: "Déconnexion" },
    footer: { rights: "Tous droits réservés." },
    theme: { light: "Mode clair", dark: "Mode sombre" },
    language: "Langue",
  }},
  ko: { translation: {
    nav: { home: "홈", dashboard: "대시보드", generator: "생성기", pricing: "가격", signIn: "로그인", start: "무료로 시작", signOut: "로그아웃" },
    footer: { rights: "모든 권리 보유." },
    theme: { light: "라이트 모드", dark: "다크 모드" },
    language: "언어",
  }},
  tr: { translation: {
    nav: { home: "Ana Sayfa", dashboard: "Panel", generator: "Oluşturucu", pricing: "Fiyatlar", signIn: "Giriş", start: "Ücretsiz Başla", signOut: "Çıkış" },
    footer: { rights: "Tüm hakları saklıdır." },
    theme: { light: "Açık mod", dark: "Koyu mod" },
    language: "Dil",
  }},
  it: { translation: {
    nav: { home: "Home", dashboard: "Dashboard", generator: "Generatore", pricing: "Prezzi", signIn: "Accedi", start: "Inizia Gratis", signOut: "Esci" },
    footer: { rights: "Tutti i diritti riservati." },
    theme: { light: "Modalità chiara", dark: "Modalità scura" },
    language: "Lingua",
  }},
  id: { translation: {
    nav: { home: "Beranda", dashboard: "Dasbor", generator: "Generator", pricing: "Harga", signIn: "Masuk", start: "Mulai Gratis", signOut: "Keluar" },
    footer: { rights: "Hak cipta dilindungi." },
    theme: { light: "Mode terang", dark: "Mode gelap" },
    language: "Bahasa",
  }},
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "pt",
    supportedLngs: LANGUAGES.map((l) => l.code),
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "app_lang",
    },
    interpolation: { escapeValue: false },
  });

const applyDir = (lng: string) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
};
applyDir(i18n.language || "pt");
i18n.on("languageChanged", applyDir);

export default i18n;
