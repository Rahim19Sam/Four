import { useLanguage } from "../context/LanguageContext";

type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

// Translation data
const translations: Translations = {
  en: {
    "Tobacco Drying Room Control System": "Tobacco Drying Room Control System",
    "Drying Room 1": "Drying Room 1",
    "Drying Room 2": "Drying Room 2",
    "Drying Room 3": "Drying Room 3",
    "Control System": "Control System",
    "System Online": "System Online",
    "System Offline": "System Offline",
    "System Warning": "System Warning",
    "Control Panel": "Control Panel",
    "Manual Controls": "Manual Controls",
    Heaters: "Heaters",
    "Air Dryer": "Air Dryer",
    Fans: "Fans",
    ON: "ON",
    OFF: "OFF",
    "Emergency Stop": "Emergency Stop",
    "Target Parameters": "Target Parameters",
    "Target Temperature": "Target Temperature",
    "Target Humidity": "Target Humidity",
    "Drying Time": "Drying Time",
    hours: "hours",
    "Operation Mode": "Operation Mode",
    Manual: "Manual",
    Automatic: "Automatic",
    Active: "Active",
    Inactive: "Inactive",
    Error: "Error",
    "Manual control of all devices": "Manual control of all devices",
    "System maintains target conditions automatically":
      "System maintains target conditions automatically",
    "The system will automatically adjust devices to maintain target conditions":
      "The system will automatically adjust devices to maintain target conditions",
    "You have full control over all devices in the drying room":
      "You have full control over all devices in the drying room",
    "Real-time Monitoring": "Real-time Monitoring",
    "Temperature Monitoring": "Temperature Monitoring",
    "Humidity Monitoring": "Humidity Monitoring",
    Warning: "Warning",
    "Drying Countdown": "Drying Countdown",
    Pause: "Pause",
    Start: "Start",
    Restart: "Restart",
    Reset: "Reset",
    "Emergency Stop Activated": "Emergency Stop Activated",
    "All systems have been shut down. Please check the equipment before restarting.":
      "All systems have been shut down. Please check the equipment before restarting.",
    "Drying Process Complete": "Drying Process Complete",
    "The drying process has completed. Please check the product quality.":
      "The drying process has completed. Please check the product quality.",
    "Room not found": "Room not found",
    "Go back": "Go back",
    "View Details": "View Details",
    Dismiss: "Dismiss",
    "Temperature Alert": "Temperature Alert",
    "Save Data": "Save Data",
    "Load Backup": "Load Backup",
    "Export CSV": "Export CSV",
    "Historical Data": "Historical Data",
    Temperature: "Temperature",
    Humidity: "Humidity",
    "Language Changed": "Language Changed",
    "The interface language has been updated successfully.":
      "The interface language has been updated successfully.",
    "Door Opened": "Door Opened",
    "Door has been opened. All devices have been stopped for safety. Close the door to resume operation.":
      "Door has been opened. All devices have been stopped for safety. Close the door to resume operation.",
    "System Notifications": "System Notifications",
    "Dismiss All": "Dismiss All",
    "No active notifications": "No active notifications",
    "System Overview": "System Overview",
    "Detailed Data Analysis": "Detailed Data Analysis",
    Save: "Save",
    Export: "Export",
    Notifications: "Notifications",
    Autoplay: "Autoplay",
    "Hard Stop": "Hard Stop",
    "Autoplay Activated": "Autoplay Activated",
    "Automatic mode has been activated. The system will maintain target conditions.":
      "Automatic mode has been activated. The system will maintain target conditions.",
    "System Alert": "System Alert",
  },
  fr: {
    "Tobacco Drying Room Control System":
      "Système de Contrôle de Séchage du Tabac",
    "Drying Room 1": "Salle de Séchage 1",
    "Drying Room 2": "Salle de Séchage 2",
    "Drying Room 3": "Salle de Séchage 3",
    "Control System": "Système de Contrôle",
    "System Online": "Système en Ligne",
    "System Offline": "Système Hors Ligne",
    "System Warning": "Avertissement Système",
    "Control Panel": "Panneau de Contrôle",
    "Manual Controls": "Contrôles Manuels",
    Heaters: "Chauffages",
    "Air Dryer": "Séchoir d'Air",
    Fans: "Ventilateurs",
    ON: "MARCHE",
    OFF: "ARRÊT",
    "Emergency Stop": "Arrêt d'Urgence",
    "Target Parameters": "Paramètres Cibles",
    "Target Temperature": "Température Cible",
    "Target Humidity": "Humidité Cible",
    "Drying Time": "Temps de Séchage",
    hours: "heures",
    "Operation Mode": "Mode d'Opération",
    Manual: "Manuel",
    Automatic: "Automatique",
    Active: "Actif",
    Inactive: "Inactif",
    Error: "Erreur",
    "Manual control of all devices": "Contrôle manuel de tous les appareils",
    "System maintains target conditions automatically":
      "Le système maintient automatiquement les conditions cibles",
    "The system will automatically adjust devices to maintain target conditions":
      "Le système ajustera automatiquement les appareils pour maintenir les conditions cibles",
    "You have full control over all devices in the drying room":
      "Vous avez le contrôle total sur tous les appareils de la salle de séchage",
    "Real-time Monitoring": "Surveillance en Temps Réel",
    "Temperature Monitoring": "Surveillance de la Température",
    "Humidity Monitoring": "Surveillance de l'Humidité",
    Warning: "Avertissement",
    "Drying Countdown": "Compte à Rebours de Séchage",
    Pause: "Pause",
    Start: "Démarrer",
    Restart: "Redémarrer",
    Reset: "Réinitialiser",
    "Emergency Stop Activated": "Arrêt d'Urgence Activé",
    "All systems have been shut down. Please check the equipment before restarting.":
      "Tous les systèmes ont été arrêtés. Veuillez vérifier l'équipement avant de redémarrer.",
    "Drying Process Complete": "Processus de Séchage Terminé",
    "The drying process has completed. Please check the product quality.":
      "Le processus de séchage est terminé. Veuillez vérifier la qualité du produit.",
    "Room not found": "Salle non trouvée",
    "Go back": "Retour",
    "View Details": "Voir les Détails",
    Dismiss: "Ignorer",
    "Temperature Alert": "Alerte de Température",
    "Save Data": "Sauvegarder les Données",
    "Load Backup": "Charger la Sauvegarde",
    "Export CSV": "Exporter CSV",
    "Historical Data": "Données Historiques",
    Temperature: "Température",
    Humidity: "Humidité",
    "Language Changed": "Langue Modifiée",
    "The interface language has been updated successfully.":
      "La langue de l'interface a été mise à jour avec succès.",
    "Door Opened": "Porte Ouverte",
    "Door has been opened. All devices have been stopped for safety. Close the door to resume operation.":
      "La porte a été ouverte. Tous les appareils ont été arrêtés par sécurité. Fermez la porte pour reprendre le fonctionnement.",
    "System Notifications": "Notifications Système",
    "Dismiss All": "Tout Ignorer",
    "No active notifications": "Aucune notification active",
    "System Overview": "Aperçu du Système",
    "Detailed Data Analysis": "Analyse Détaillée des Données",
    Save: "Sauvegarder",
    Export: "Exporter",
    Notifications: "Notifications",
    Autoplay: "Lecture automatique",
    "Hard Stop": "Arrêt d'urgence",
    "Autoplay Activated": "Lecture automatique activée",
    "Automatic mode has been activated. The system will maintain target conditions.":
      "Le mode automatique a été activé. Le système maintiendra les conditions cibles.",
    "System Alert": "Alerte Système",
  },
  ar: {
    "Tobacco Drying Room Control System": "نظام التحكم في غرفة تجفيف التبغ",
    "Drying Room 1": "غرفة التجفيف 1",
    "Drying Room 2": "غرفة التجفيف 2",
    "Drying Room 3": "غرفة التجفيف 3",
    "Control System": "نظام التحكم",
    "System Online": "النظام متصل",
    "System Offline": "النظام غير متصل",
    "System Warning": "تحذير النظام",
    "Control Panel": "لوحة التحكم",
    "Manual Controls": "أدوات التحكم اليدوية",
    Heaters: "السخانات",
    "Air Dryer": "مجفف الهواء",
    Fans: "المراوح",
    ON: "تشغيل",
    OFF: "إيقاف",
    "Emergency Stop": "إيقاف الطوارئ",
    "Target Parameters": "المعلمات المستهدفة",
    "Target Temperature": "درجة الحرارة المستهدفة",
    "Target Humidity": "الرطوبة المستهدفة",
    "Drying Time": "وقت التجفيف",
    hours: "ساعات",
    "Operation Mode": "وضع التشغيل",
    Manual: "يدوي",
    Automatic: "تلقائي",
    Active: "نشط",
    Inactive: "غير نشط",
    Error: "خطأ",
    "Manual control of all devices": "تحكم يدوي في جميع الأجهزة",
    "System maintains target conditions automatically":
      "يحافظ النظام على الظروف المستهدفة تلقائيًا",
    "The system will automatically adjust devices to maintain target conditions":
      "سيقوم النظام تلقائيًا بضبط الأجهزة للحفاظ على الظروف المستهدفة",
    "You have full control over all devices in the drying room":
      "لديك تحكم كامل في جميع الأجهزة في غرفة التجفيف",
    "Real-time Monitoring": "المراقبة في الوقت الحقيقي",
    "Temperature Monitoring": "مراقبة درجة الحرارة",
    "Humidity Monitoring": "مراقبة الرطوبة",
    Warning: "تحذير",
    "Drying Countdown": "العد التنازلي للتجفيف",
    Pause: "إيقاف مؤقت",
    Start: "بدء",
    Restart: "إعادة تشغيل",
    Reset: "إعادة ضبط",
    "Emergency Stop Activated": "تم تنشيط إيقاف الطوارئ",
    "All systems have been shut down. Please check the equipment before restarting.":
      "تم إيقاف تشغيل جميع الأنظمة. يرجى التحقق من المعدات قبل إعادة التشغيل.",
    "Drying Process Complete": "اكتملت عملية التجفيف",
    "The drying process has completed. Please check the product quality.":
      "اكتملت عملية التجفيف. يرجى التحقق من جودة المنتج.",
    "Room not found": "الغرفة غير موجودة",
    "Go back": "العودة",
    "View Details": "عرض التفاصيل",
    Dismiss: "تجاهل",
    "Temperature Alert": "تنبيه درجة الحرارة",
    "Save Data": "حفظ البيانات",
    "Load Backup": "تحميل النسخة الاحتياطية",
    "Export CSV": "تصدير CSV",
    "Historical Data": "البيانات التاريخية",
    Temperature: "درجة الحرارة",
    Humidity: "الرطوبة",
    "Language Changed": "تم تغيير اللغة",
    "The interface language has been updated successfully.":
      "تم تحديث لغة الواجهة بنجاح.",
    "Door Opened": "الباب مفتوح",
    "Door has been opened. All devices have been stopped for safety. Close the door to resume operation.":
      "تم فتح الباب. تم إيقاف جميع الأجهزة للسلامة. أغلق الباب لاستئناف التشغيل.",
    "System Notifications": "إشعارات النظام",
    "Dismiss All": "تجاهل الكل",
    "No active notifications": "لا توجد إشعارات نشطة",
    "System Overview": "نظرة عامة على النظام",
    "Detailed Data Analysis": "تحليل مفصل للبيانات",
    Save: "حفظ",
    Export: "تصدير",
    Notifications: "الإشعارات",
    Autoplay: "تشغيل تلقائي",
    "Hard Stop": "إيقاف طارئ",
    "Autoplay Activated": "تم تنشيط التشغيل التلقائي",
    "Automatic mode has been activated. The system will maintain target conditions.":
      "تم تنشيط الوضع التلقائي. سيحافظ النظام على الظروف المستهدفة.",
    "System Alert": "تنبيه النظام",
  },
};

export const useTranslation = () => {
  const { language, setLanguage } = useLanguage();

  const t = (key: string): string => {
    if (!translations[language]) {
      return key; // Fallback to the key if language not found
    }

    return translations[language][key] || translations["en"][key] || key;
  };

  return { t, language, setLanguage };
};
