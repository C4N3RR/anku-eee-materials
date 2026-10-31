const CONFIG = {
      FOLDER: 'https://drive.google.com/drive/folders/1n9cyf8eSj3OremDKF5BdQIBayaryPofN?usp=sharing'
    };

    const COURSE_THEMES = {
      'PHY0107': { // Koyu Mor
        accent: '#c084fc',
        border: 'rgba(168, 85, 247, 0.48)',
        glow: 'rgba(147, 51, 234, 0.32)',
        tint: 'rgba(126, 34, 206, 0.36)',
        badgeBg: 'rgba(147, 51, 234, 0.22)',
        badgeBorder: 'rgba(168, 85, 247, 0.42)',
        badgeText: '#f3e8ff'
      },
      'MTH0101': { // Koyu Mavi
        accent: '#60a5fa',
        border: 'rgba(59, 130, 246, 0.48)',
        glow: 'rgba(29, 78, 216, 0.32)',
        tint: 'rgba(30, 64, 175, 0.34)',
        badgeBg: 'rgba(37, 99, 235, 0.22)',
        badgeBorder: 'rgba(59, 130, 246, 0.42)',
        badgeText: '#dbeafe'
      },
      'MTH103': { // Koyu Turkuaz
        accent: '#2dd4bf',
        border: 'rgba(20, 184, 166, 0.48)',
        glow: 'rgba(13, 148, 136, 0.32)',
        tint: 'rgba(15, 118, 110, 0.34)',
        badgeBg: 'rgba(13, 148, 136, 0.22)',
        badgeBorder: 'rgba(20, 184, 166, 0.42)',
        badgeText: '#ccfbf1'
      },
      'CHM109': { // Koyu Zümrüt Yeşili
        accent: '#34d399',
        border: 'rgba(16, 185, 129, 0.48)',
        glow: 'rgba(5, 150, 105, 0.32)',
        tint: 'rgba(4, 120, 87, 0.34)',
        badgeBg: 'rgba(5, 150, 105, 0.22)',
        badgeBorder: 'rgba(16, 185, 129, 0.42)',
        badgeText: '#d1fae5'
      },
      'EEE1001': { // Koyu Kehribar/Altın
        accent: '#fbbf24',
        border: 'rgba(245, 158, 11, 0.48)',
        glow: 'rgba(217, 119, 6, 0.32)',
        tint: 'rgba(180, 83, 9, 0.34)',
        badgeBg: 'rgba(217, 119, 6, 0.22)',
        badgeBorder: 'rgba(245, 158, 11, 0.42)',
        badgeText: '#fef3c7'
      },
      'TUR171': { // Koyu Bordo
        accent: '#fb7185',
        border: 'rgba(225, 29, 72, 0.50)',
        glow: 'rgba(159, 18, 57, 0.35)',
        tint: 'rgba(136, 19, 55, 0.38)',
        badgeBg: 'rgba(159, 18, 57, 0.26)',
        badgeBorder: 'rgba(225, 29, 72, 0.45)',
        badgeText: '#ffe4e6'
      },
      'GENEL': { // Turuncu / Akademik
        accent: '#f97316',
        border: 'rgba(249, 115, 22, 0.48)',
        glow: 'rgba(234, 88, 12, 0.32)',
        tint: 'rgba(194, 65, 12, 0.34)',
        badgeBg: 'rgba(234, 88, 12, 0.22)',
        badgeBorder: 'rgba(249, 115, 22, 0.42)',
        badgeText: '#ffedd5'
      }
    };

    function getCourseTheme(code) {
      return COURSE_THEMES[code] || {
        accent: '#ffffff',
        border: 'rgba(255, 255, 255, 0.15)',
        glow: 'rgba(0, 0, 0, 0.35)',
        tint: 'rgba(15, 23, 42, 0.18)',
        badgeBg: 'rgba(255, 255, 255, 0.1)',
        badgeBorder: 'rgba(255, 255, 255, 0.15)',
        badgeText: '#ffffff'
      };
    }

    const KNOWN_LINK_FAVICONS = {
      'wolframalpha.com': 'assets/link-icons/wolframalpha.png',
      'youtube.com': 'assets/link-icons/youtube.png',
      'youtu.be': 'assets/link-icons/youtube.png',
      'ptable.com': 'assets/link-icons/ptable.png',
      'eee.ankara.edu.tr': 'assets/link-icons/eee-ankara.png',
      'phet.colorado.edu': 'assets/link-icons/phet.png',
      'sozluk.gov.tr': 'assets/link-icons/tdk.png',
      'tdk.gov.tr': 'assets/link-icons/tdk.png',
      'tutorial.math.lamar.edu': 'assets/link-icons/lamar.png',
      'lamar.edu': 'assets/link-icons/lamar.png',
      'terim.tuba.gov.tr': 'assets/link-icons/tuba.png',
      'tuba.gov.tr': 'assets/link-icons/tuba.png',
      'dildernegi.org.tr': 'assets/link-icons/dildernegi.png',
      'millikutuphane.gov.tr': 'assets/link-icons/millikutuphane.png',
      'millikutuphane.org.tr': 'assets/link-icons/millikutuphane.png',
      'turkoloji.cu.edu.tr': 'assets/link-icons/turkoloji.png',
      'cu.edu.tr': 'assets/link-icons/turkoloji.png'
    };

    function getLinkFavicon(link) {
      if (link && link.icon && (link.icon.startsWith('assets/') || link.icon.startsWith('/') || link.icon.startsWith('data:') || link.icon.startsWith('http'))) {
        return safeImage(link.icon);
      }
      try {
        const host = new URL(link.url).hostname.toLowerCase().replace(/^www\./, '');
        for (const [domain, iconPath] of Object.entries(KNOWN_LINK_FAVICONS)) {
          if (host === domain || host.endsWith('.' + domain)) {
            return iconPath;
          }
        }
      } catch (e) {}
      return `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(link.url)}&sz=32`;
    }

    // ================= SINGLE SOURCE OF TRUTH: ACADEMIC STAFF & 4-YEAR CURRICULUM =================
    const STAFF_DATA = [
      // --- 1. BÖLÜM BAŞKANI & YARDIMCILARI + KADROLU ÖĞRETİM ÜYELERİ ---
      {
        id: 'asim-egemen-yilmaz',
        title: 'Prof. Dr.',
        name: 'Asım Egemen Yılmaz',
        role: 'Bölüm Başkanı',
        category: 'faculty',
        email: 'aeyilmaz@eng.ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1775',
        photo: 'assets/staff/asim-egemen-yilmaz.jpg',
        avesisUrl: 'https://avesis.ankara.edu.tr/aeyilmaz',
        personalUrl: 'https://eee.ankara.edu.tr/doc-dr-a-egemen-yilmaz/',
        courses: ['EEE1001', 'EEE1002']
      },
      {
        id: 'sultan-can',
        title: 'Doç. Dr.',
        name: 'Sultan Can',
        role: 'Bölüm Başkan Yardımcısı',
        category: 'faculty',
        email: 'sultancan@ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1777',
        photo: 'assets/staff/sultan-can.jpeg',
        avesisUrl: 'https://avesis.ankara.edu.tr/sultancan',
        personalUrl: 'https://eee.ankara.edu.tr/tr/dr-sultan-can/',
        courses: ['EEE2006', 'EEE3005']
      },
      {
        id: 'gokhan-soysal',
        title: 'Doç. Dr.',
        name: 'Gökhan Soysal',
        role: 'Bölüm Başkan Yardımcısı',
        category: 'faculty',
        email: 'soysal@eng.ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1807',
        photo: 'assets/staff/gokhan-soysal.jpg',
        avesisUrl: 'https://avesis.ankara.edu.tr/100905',
        personalUrl: 'https://eee.ankara.edu.tr/yrd-doc-dr-gokhan-soysal/',
        courses: ['EEE2008']
      },
      {
        id: 'murat-efe',
        title: 'Prof. Dr.',
        name: 'Murat Efe',
        role: '',
        category: 'faculty',
        email: 'efe@eng.ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1778',
        photo: 'assets/staff/murat-efe.jpeg',
        avesisUrl: 'https://avesis.ankara.edu.tr/efe',
        personalUrl: 'https://eee.ankara.edu.tr/doc-dr-murat-efe/',
        courses: ['EEE4001']
      },
      {
        id: 'murat-husnu-sazli',
        title: 'Prof. Dr.',
        name: 'Murat Hüsnü Sazlı',
        role: '',
        category: 'faculty',
        email: 'sazli@eng.ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1801',
        photo: 'assets/staff/murat-husnu-sazli.jpg',
        avesisUrl: 'https://avesis.ankara.edu.tr/sazli',
        personalUrl: 'https://eee.ankara.edu.tr/prof-dr-murat-husnu-sazli/',
        courses: ['EEE3342']
      },
      {
        id: 'isa-navruz',
        title: 'Prof. Dr.',
        name: 'İsa Navruz',
        role: '',
        category: 'faculty',
        email: 'inavruz@ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1779',
        photo: 'assets/staff/isa-navruz.jpg',
        avesisUrl: 'https://avesis.ankara.edu.tr/inavruz',
        personalUrl: 'https://eee.ankara.edu.tr/doc-dr-isa-navruz/',
        courses: ['EEE2003', 'EEE2005', 'EEE4099']
      },
      {
        id: 'fikret-ari',
        title: 'Prof. Dr.',
        name: 'Fikret Arı',
        role: '',
        category: 'faculty',
        email: 'fari@eng.ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1803',
        photo: 'assets/staff/fikret-ari.jpg',
        avesisUrl: 'https://avesis.ankara.edu.tr/fari',
        personalUrl: 'https://eee.ankara.edu.tr/yrd-doc-dr-fikret-ari/',
        courses: ['EEE1004', 'EEE1006']
      },
      {
        id: 'hakki-alparslan-ilgin',
        title: 'Doç. Dr.',
        name: 'Hakkı Alparslan Ilgın',
        role: '',
        category: 'faculty',
        email: 'ilgin@eng.ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1802',
        photo: 'assets/staff/hakki-alparslan-ilgin.jpg',
        avesisUrl: 'https://avesis.ankara.edu.tr/ilgin',
        personalUrl: 'https://eee.ankara.edu.tr/yrd-doc-dr-h-alparslan-ilgin/',
        courses: ['EEE2002', 'EEE3009']
      },
      {
        id: 'okkes-tolga-altinoz',
        title: 'Doç. Dr.',
        name: 'Ö. Tolga Altınöz',
        role: '',
        category: 'faculty',
        email: 'taltinoz@ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1805',
        photo: 'assets/staff/okkes-tolga-altinoz.jpg',
        avesisUrl: 'https://avesis.ankara.edu.tr/taltinoz',
        personalUrl: 'https://eee.ankara.edu.tr/yrd-doc-dr-okkes-tolga-altinoz/',
        courses: ['EEE3007', 'EEE3344']
      },
      {
        id: 'burak-ozbey',
        title: 'Doç. Dr.',
        name: 'Burak Özbey',
        role: '',
        category: 'faculty',
        email: 'ozbey@ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1721',
        photo: 'assets/staff/burak-ozbey.png',
        avesisUrl: 'https://avesis.ankara.edu.tr/ozbey',
        personalUrl: '',
        courses: ['EEE2001', 'EEE2004']
      },
      {
        id: 'ahmet-akbulut',
        title: 'Doç. Dr.',
        name: 'Ahmet Akbulut',
        role: '',
        category: 'faculty',
        email: 'aakbulut@ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1811',
        photo: 'assets/staff/ahmet-akbulut.jpg',
        avesisUrl: 'https://avesis.ankara.edu.tr/aakbulut',
        personalUrl: 'https://eee.ankara.edu.tr/yrd-doc-dr-ahmet-akbulut/',
        courses: ['EEE4002']
      },
      {
        id: 'aykut-kalaycioglu',
        title: 'Doç. Dr.',
        name: 'Aykut Kalaycıoğlu',
        role: '',
        category: 'faculty',
        email: 'kalaycioglu@ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1806',
        photo: 'assets/staff/aykut-kalaycioglu.jpg',
        avesisUrl: 'https://avesis.ankara.edu.tr/kalaycioglu',
        personalUrl: 'https://eee.ankara.edu.tr/kalaycioglu/',
        courses: ['EEE3342']
      },
      {
        id: 'selcuk-tascioglu',
        title: 'Doç. Dr.',
        name: 'Selçuk Taşcıoğlu',
        role: '',
        category: 'faculty',
        email: 'stasci@eng.ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1808',
        photo: 'assets/staff/selcuk-tascioglu.jpg',
        avesisUrl: 'https://avesis.ankara.edu.tr/stasci',
        personalUrl: 'https://eee.ankara.edu.tr/yrd-doc-dr-selcuk-tascioglu/',
        courses: ['OUL101', 'OUL102', 'EEE2008']
      },
      {
        id: 'ilyas-evrim-colak',
        title: 'Doç. Dr.',
        name: 'İlyas Evrim Çolak',
        role: '',
        category: 'faculty',
        email: 'ecolak@ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1809',
        photo: 'assets/staff/ilyas-evrim-colak.jpg',
        avesisUrl: 'https://avesis.ankara.edu.tr/ecolak',
        personalUrl: 'https://eee.ankara.edu.tr/yrd-doc-dr-evrim-colak/',
        courses: ['EEE2007', 'SCS301', 'PPL302']
      },
      {
        id: 'cansel-ficici',
        title: 'Dr. Öğr. Üyesi',
        name: 'Cansel Fıçıcı',
        role: '',
        category: 'faculty',
        email: 'ogretmenoglu@ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1726',
        photo: 'assets/staff/cansel-ficici.jpg',
        avesisUrl: 'https://avesis.ankara.edu.tr/ogretmenoglu',
        personalUrl: 'https://eee.ankara.edu.tr/tr/arastirma-gorevlisi-cansel-ficici/',
        courses: ['EEE3001', 'EEE3002', 'EEE3003', 'EEE3004']
      },
      {
        id: 'omer-aydin',
        title: 'Dr. Öğr. Üyesi',
        name: 'Ömer Aydın',
        role: '',
        category: 'faculty',
        email: 'omera@ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1812',
        photo: 'assets/staff/omer-aydin.jpeg',
        avesisUrl: 'https://avesis.ankara.edu.tr/omera',
        personalUrl: 'https://eee.ankara.edu.tr/tr/dr-ogretim-uyesi-omer-aydin/',
        courses: ['EEE3007']
      },

      // --- 2. ARAŞTIRMA GÖREVLİLERİ ---
      {
        id: 'hacer-guler',
        title: 'Arş. Gör.',
        name: 'Hacer Güler',
        role: 'Araştırma Görevlisi',
        category: 'assistant',
        email: 'gulerh@ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1723',
        photo: 'assets/staff/hacer-guler.jpg',
        avesisUrl: 'https://avesis.ankara.edu.tr/gulerh',
        personalUrl: 'https://eee.ankara.edu.tr/tr/arastirma-gorevlisi-hacer-guler/',
        courses: ['EEE2004', 'EEE3003', 'EEE3004']
      },
      {
        id: 'gizem-eda-capkinoglu',
        title: 'Arş. Gör.',
        name: 'Gizem Eda Çapkınoğlu',
        role: 'Araştırma Görevlisi',
        category: 'assistant',
        email: 'gecapkinoglu@ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1725',
        photo: 'assets/staff/gizem-eda-capkinoglu.png',
        avesisUrl: 'https://avesis.ankara.edu.tr/gecapkinoglu',
        personalUrl: 'https://eee.ankara.edu.tr/tr/arastirma-gorevlisi-gizem-eda-capkinoglu/',
        courses: ['EEE2003', 'EEE2005']
      },
      {
        id: 'muhammed-mert-ulupinar',
        title: 'Arş. Gör.',
        name: 'Muhammed Mert Ulupınar',
        role: 'Araştırma Görevlisi',
        category: 'assistant',
        email: 'mmulupinar@ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1729',
        photo: 'assets/staff/muhammed-mert-ulupinar.png',
        avesisUrl: 'https://avesis.ankara.edu.tr/mmulupinar',
        personalUrl: 'https://eee.ankara.edu.tr/tr/arastirma-gorevlisi-muhammed-mert-ulupinar/',
        courses: ['EEE1006', 'EEE3004']
      },
      {
        id: 'yigit-parlak',
        title: 'Arş. Gör.',
        name: 'Yiğit Parlak',
        role: 'Araştırma Görevlisi',
        category: 'assistant',
        email: 'ygtparlak@ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1727',
        photo: 'assets/staff/yigit-parlak.jpg',
        avesisUrl: 'https://avesis.ankara.edu.tr/ygtparlak',
        personalUrl: 'https://eee.ankara.edu.tr/tr/arastirma-gorevlisi-yigit-parlak/',
        courses: ['EEE2006', 'EEE3005']
      },
      {
        id: 'tolga-karagoz',
        title: 'Arş. Gör.',
        name: 'Tolga Karagöz',
        role: 'Araştırma Görevlisi',
        category: 'assistant',
        email: 'tolgakaragoz@ankara.edu.tr',
        phone: '+90 312 600 01 00 / 1724',
        photo: 'assets/staff/tolga-karagoz.png',
        avesisUrl: 'https://avesis.ankara.edu.tr/tolgakaragoz',
        personalUrl: 'https://eee.ankara.edu.tr/tr/arastirma-gorevlisi-tolga-karagoz/',
        courses: ['EEE2001', 'EEE2004']
      },
      {
        id: 'alperen-senay',
        title: 'Arş. Gör.',
        name: 'Alperen Şenay',
        role: 'Araştırma Görevlisi',
        category: 'assistant',
        email: 'alperensenay@ankara.edu.tr',
        phone: '+90 312 600 01 00',
        photo: 'assets/staff/alperen-senay.jpeg',
        avesisUrl: 'https://avesis.ankara.edu.tr/alperensenay',
        personalUrl: 'https://eee.ankara.edu.tr/tr/arastirma-gorevlisi-alperen-senay/',
        courses: ['EEE1004', 'EEE1006']
      },

      // --- 3. YARI ZAMANLI / GÖREVLİ ÖĞRETİM ELEMANLARI & SERVİS DERSİ HOCALARI ---
      {
        id: 'osman-erogul',
        title: 'Prof. Dr.',
        name: 'Osman Eroğul',
        role: 'Yarı Zamanlı Öğretim Üyesi',
        category: 'parttime',
        email: 'osmanerogul1960@hotmail.com',
        phone: '',
        photo: 'assets/staff/osman-erogul.jpg',
        avesisUrl: '',
        personalUrl: '',
        courses: []
      },
      {
        id: 'sedat-sunter',
        title: 'Prof. Dr.',
        name: 'Sedat Sünter',
        role: 'Yarı Zamanlı Öğretim Üyesi',
        category: 'parttime',
        email: 'sedat.sunter@atilim.edu.tr',
        phone: '',
        photo: 'assets/staff/sedat-sunter.jpg',
        avesisUrl: '',
        personalUrl: '',
        courses: []
      },
      {
        id: 'ahmet-gungor-pakfiliz',
        title: 'Prof. Dr.',
        name: 'Ahmet Güngör Pakfiliz',
        role: 'Yarı Zamanlı Öğretim Üyesi',
        category: 'parttime',
        email: 'agpakfiliz@thk.edu.tr',
        phone: '',
        photo: 'assets/staff/ahmet-gungor-pakfiliz.jpg',
        avesisUrl: '',
        personalUrl: '',
        courses: []
      },
      {
        id: 'halit-ergezer',
        title: 'Doç. Dr.',
        name: 'Halit Ergezer',
        role: 'Yarı Zamanlı Öğretim Üyesi',
        category: 'parttime',
        email: 'halitergezer@gmail.com',
        phone: '',
        photo: 'assets/staff/halit-ergezer.jpg',
        avesisUrl: 'https://eee.ankara.edu.tr/wp-content/uploads/sites/223/2016/10/resume_halitergezer.pdf',
        personalUrl: '',
        courses: []
      },
      {
        id: 'orkun-zorba',
        title: 'Dr.',
        name: 'H. Orkun Zorba',
        role: 'Yarı Zamanlı Öğretim Elemanı',
        category: 'parttime',
        email: 'orkunzorba@gmail.com',
        phone: '',
        photo: 'assets/staff/orkun-zorba.jpg',
        avesisUrl: '',
        personalUrl: '',
        courses: []
      },
      {
        id: 'tugrul-adiguzel',
        title: 'Dr.',
        name: 'Tuğrul Adıgüzel',
        role: 'Yarı Zamanlı Öğretim Elemanı',
        category: 'parttime',
        email: 'adiguzel@ankara.edu.tr',
        phone: '',
        photo: 'assets/staff/tugrul-adiguzel.jpg',
        avesisUrl: '',
        personalUrl: '',
        courses: []
      },
      {
        id: 'selda-taskin-serkan',
        title: 'Dr.',
        name: 'Selda Taşkın Serkan',
        role: 'Yarı Zamanlı Öğretim Elemanı',
        category: 'parttime',
        email: '',
        phone: '',
        photo: 'assets/staff/selda-taskin-serkan.jpg',
        avesisUrl: '',
        personalUrl: '',
        courses: []
      },
      {
        id: 'haluk-goksen',
        title: 'Dr.',
        name: 'Haluk Gökşen',
        role: 'Yarı Zamanlı Öğretim Elemanı',
        category: 'parttime',
        email: 'goksenhaluk@gmail.com',
        phone: '',
        photo: 'assets/staff/haluk-goksen.jpg',
        avesisUrl: '',
        personalUrl: '',
        courses: []
      },
      {
        id: 'melike-palsu-kurt',
        title: 'Dr.',
        name: 'Melike Palsü Kurt',
        role: 'Yarı Zamanlı Öğretim Elemanı',
        category: 'parttime',
        email: 'melike.palsu@cbddo.gov.tr',
        phone: '',
        photo: 'assets/staff/melike-palsu-kurt.jpg',
        avesisUrl: '',
        personalUrl: '',
        courses: []
      },
      {
        id: 'metehan-guzel',
        title: 'Dr.',
        name: 'Metehan Güzel',
        role: 'Yarı Zamanlı Öğretim Elemanı',
        category: 'parttime',
        email: 'metehan.guzel@cbddo.gov.tr',
        phone: '',
        photo: 'assets/staff/metehan-guzel.jpg',
        avesisUrl: '',
        personalUrl: '',
        courses: []
      },
      {
        id: 'kaya-yazgan',
        title: 'Y.L.',
        name: 'Kaya Yazgan',
        role: 'Yarı Zamanlı Öğretim Elemanı',
        category: 'parttime',
        email: 'kayayazgan@hotmail.com',
        phone: '',
        photo: 'assets/staff/kaya-yazgan.jpg',
        avesisUrl: '',
        personalUrl: '',
        courses: []
      },
      {
        id: 'alparslan-kuloglu',
        title: 'Y.L.',
        name: 'Alparslan Kuloğlu',
        role: 'Yarı Zamanlı Öğretim Elemanı',
        category: 'parttime',
        email: 'alparslankuloglu@gmail.com',
        phone: '',
        photo: 'assets/staff/alparslan-kuloglu.jpg',
        avesisUrl: 'https://eee.ankara.edu.tr/wp-content/uploads/sites/223/2016/10/Alparslan-Kulo%C4%9Flu_CV_English.pdf',
        personalUrl: '',
        courses: []
      },
      {
        id: 'mumtaz-koray-bozkurt',
        title: 'Y.L.',
        name: 'Mümtaz Koray Bozkurt',
        role: 'Yarı Zamanlı Öğretim Elemanı',
        category: 'parttime',
        email: '',
        phone: '',
        photo: 'assets/staff/foto-yok.jpg',
        avesisUrl: '',
        personalUrl: '',
        courses: []
      },
      {
        id: 'utku-yargicoglu',
        title: 'Öğr. Gör.',
        name: 'Utku Yargıçoğlu',
        role: 'Yarı Zamanlı Öğretim Elemanı',
        category: 'parttime',
        email: '',
        phone: '',
        photo: 'assets/staff/foto-yok.jpg',
        avesisUrl: '',
        personalUrl: '',
        courses: []
      },
      {
        id: 'kaan-can-yilmaz',
        title: 'Öğr. Gör.',
        name: 'Kaan Can Yılmaz',
        role: 'Yarı Zamanlı Öğretim Elemanı',
        category: 'parttime',
        email: '',
        phone: '',
        photo: 'assets/staff/foto-yok.jpg',
        avesisUrl: '',
        personalUrl: '',
        courses: []
      },
      {
        id: 'abdulkadir-can',
        title: 'Öğr. Gör.',
        name: 'Abdülkadir Can',
        role: 'Yarı Zamanlı Öğretim Elemanı',
        category: 'parttime',
        email: '',
        phone: '',
        photo: 'assets/staff/foto-yok.jpg',
        avesisUrl: '',
        personalUrl: '',
        courses: []
      },
      {
        id: 'atilla-yenidogan',
        title: 'Öğr. Gör.',
        name: 'Atilla Yenidoğan',
        role: 'Yarı Zamanlı Öğretim Elemanı',
        category: 'parttime',
        email: '',
        phone: '',
        photo: 'assets/staff/foto-yok.jpg',
        avesisUrl: '',
        personalUrl: '',
        courses: []
      },
      {
        id: 'emre-bicer',
        title: 'Prof. Dr.',
        name: 'Emre Biçer',
        role: 'Servis Dersi Öğretim Üyesi (Kimya)',
        category: 'service',
        email: 'ebicer@ankara.edu.tr',
        phone: '',
        photo: '',
        avesisUrl: 'https://avesis.ankara.edu.tr/emreb',
        personalUrl: '',
        courses: ['CHM109']
      },
      {
        id: 'serhan-varma',
        title: 'Prof. Dr.',
        name: 'Serhan Varma',
        role: 'Servis Dersi Öğretim Üyesi (Matematik)',
        category: 'service',
        email: 'svarma@science.ankara.edu.tr',
        phone: '',
        photo: '',
        avesisUrl: 'https://avesis.ankara.edu.tr/svarma',
        personalUrl: '',
        courses: ['MTH0101', 'MTH0102']
      },
      {
        id: 'derya-kahveci',
        title: 'Dr. Öğr. Üyesi',
        name: 'Derya Kahveci',
        role: 'Servis Dersi Öğretim Üyesi (Matematik)',
        category: 'service',
        email: 'dkahveci@ankara.edu.tr',
        phone: '',
        photo: '',
        avesisUrl: 'https://avesis.ankara.edu.tr/dkahveci',
        personalUrl: '',
        courses: ['MTH103', 'MTH201']
      },
      {
        id: 'ahmet-karatay',
        title: 'Doç. Dr.',
        name: 'Ahmet Karatay',
        role: 'Servis Dersi Öğretim Üyesi (Fizik Müh.)',
        category: 'service',
        email: 'akaratay@eng.ankara.edu.tr',
        phone: '',
        photo: 'assets/staff/ahmet-karatay.jpg',
        avesisUrl: 'https://avesis.ankara.edu.tr/akaratay',
        personalUrl: '',
        courses: ['PHY0107', 'PHY0108']
      },
      {
        id: 'meltem-ayabakan-ipek',
        title: 'Öğr. Gör. Dr.',
        name: 'Meltem Ayabakan İpek',
        role: 'Servis Dersi Öğretim Elemanı (Türk Dili)',
        category: 'service',
        email: 'mayabakan88@gmail.com',
        phone: '',
        photo: '',
        avesisUrl: 'https://avesis.ankara.edu.tr/ayabakan',
        personalUrl: '',
        courses: ['TUR171', 'TUR174']
      },
      {
        id: ' sinan-kivanc-kaya',
        title: 'Dr. Öğr. Üyesi',
        name: 'Sinan Kıvanç Kaya',
        role: 'Servis Dersi Öğretim Üyesi (İş Sağlığı ve Güvenliği)',
        category: 'service',
        email: 'skkaya@ankara.edu.tr',
        phone: '',
        photo: '',
        avesisUrl: 'https://avesis.ankara.edu.tr/skkaya',
        personalUrl: '',
        courses: ['EEE4091']
      },
      {
        id: 'emine-elmas',
        title: 'Öğr. Gör.',
        name: 'Emine Elmas',
        role: 'Servis Dersi Öğretim Elemanı (İSG)',
        category: 'service',
        email: 'eelmas@ankara.edu.tr',
        phone: '',
        photo: '',
        avesisUrl: '',
        personalUrl: '',
        courses: ['EEE4092']
      }
    ].map(s => ({ ...s, id: s.id.trim() }));

    const STAFF_MAP = new Map(STAFF_DATA.map(s => [s.id, s]));

    // 4-Year Compulsory Curriculum (2025-2026 Müfredatı - Ana/Zorunlu Dersler)
    const CURRICULUM_COURSES = [
      // ==================== 1. SINIF GÜZ (1. YARIYIL) ====================
      {
        code: 'EEE1001',
        year: 1,
        semester: 'guz',
        name: 'Introduction to Electrical & Electronics Engineering (Elektrik-Elektronik Mühendisliğine Giriş)',
        credits: '2 Kredi • 3 AKTS',
        icon: 'cpu',
        instructorIds: ['asim-egemen-yilmaz'],
        assistantIds: [],
        banner: 'bannerlar/elektrik%20elektronik.png',
        bannerPos: 'center 50%',
        bannerRatio: 832 / 1104,
        links: [
          { title: 'Bölüm Sayfası', url: 'https://eee.ankara.edu.tr', icon: 'assets/link-icons/eee-ankara.png' }
        ]
      },
      {
        code: 'CHM109',
        year: 1,
        semester: 'guz',
        name: 'General Chemistry (Genel Kimya)',
        credits: '3 Kredi • 6 AKTS',
        icon: 'flask-conical',
        instructorIds: ['emre-bicer'],
        assistantIds: [],
        banner: 'bannerlar/kimya.jpg',
        bannerPos: 'center center',
        bannerRatio: 246 / 138,
        links: [
          { title: 'Periodic Table', url: 'https://ptable.com', icon: 'assets/link-icons/ptable.png' }
        ]
      },
      {
        code: 'MTH0101',
        year: 1,
        semester: 'guz',
        name: 'Calculus I (Matematik I)',
        credits: '4 Kredi • 7 AKTS',
        icon: 'sigma',
        instructorIds: ['serhan-varma'],
        assistantIds: [],
        banner: 'bannerlar/calculus.png',
        bannerPos: 'center 44%',
        bannerRatio: 1,
        links: [
          { title: 'WolframAlpha', url: 'https://www.wolframalpha.com', icon: 'assets/link-icons/wolframalpha.png' },
          { title: "Paul's Math Notes", url: 'https://tutorial.math.lamar.edu', icon: 'assets/link-icons/lamar.png' },
          { title: '3Blue1Brown Calculus', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr', icon: 'assets/link-icons/youtube.png' }
        ]
      },
      {
        code: 'MTH103',
        year: 1,
        semester: 'guz',
        name: 'Linear Algebra (Lineer Cebir)',
        credits: '3 Kredi • 6 AKTS',
        icon: 'grid-3x3',
        instructorIds: ['derya-kahveci'],
        assistantIds: [],
        banner: 'bannerlar/lineer.jpg',
        bannerPos: 'center 35%',
        bannerRatio: 800 / 450,
        links: [
          { title: 'WolframAlpha', url: 'https://www.wolframalpha.com', icon: 'assets/link-icons/wolframalpha.png' },
          { title: '3Blue1Brown Linear Algebra', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', icon: 'assets/link-icons/youtube.png' }
        ]
      },
      {
        code: 'PHY0107',
        year: 1,
        semester: 'guz',
        name: 'Physics I (Genel Fizik I)',
        credits: '3 Kredi • 6 AKTS',
        icon: 'atom',
        instructorIds: ['ahmet-karatay'],
        assistantIds: [],
        banner: 'bannerlar/fizik.jpg',
        bannerPos: 'center 25%',
        bannerRatio: 1150 / 646,
        links: [
          { title: 'Phet Simülasyonları', url: 'https://phet.colorado.edu/tr/', icon: 'assets/link-icons/phet.png' }
        ]
      },
      {
        code: 'TUR171',
        year: 1,
        semester: 'guz',
        name: 'Turkish Language I (Türk Dili I)',
        credits: '2 Kredi • 2 AKTS',
        icon: 'book-type',
        instructorIds: ['meltem-ayabakan-ipek'],
        assistantIds: [],
        banner: 'bannerlar/tu%CC%88rkc%CC%A7e.jpg',
        bannerPos: 'center 22%',
        bannerRatio: 706 / 371,
        links: [
          { title: 'TDK Sözlük', url: 'https://sozluk.gov.tr', icon: 'assets/link-icons/tdk.png' },
          { title: 'TÜBA Terim', url: 'https://terim.tuba.gov.tr', icon: 'assets/link-icons/tuba.png' },
          { title: 'Dil Derneği', url: 'https://www.dildernegi.org.tr', icon: 'assets/link-icons/dildernegi.png' },
          { title: 'Milli Kütüphane', url: 'https://www.millikutuphane.gov.tr', icon: 'assets/link-icons/millikutuphane.png' },
          { title: 'ÇÜ Türkoloji', url: 'http://turkoloji.cu.edu.tr/', icon: 'assets/link-icons/turkoloji.png' }
        ]
      },
      {
        code: 'OUL101',
        year: 1,
        semester: 'guz',
        name: 'Üniversite Hayatına Giriş',
        credits: '0 Kredi • 0 AKTS',
        icon: 'graduation-cap',
        instructorIds: ['selcuk-tascioglu'],
        assistantIds: [],
        links: []
      },

      // ==================== 1. SINIF BAHAR (2. YARIYIL) ====================
      {
        code: 'EEE1002',
        year: 1,
        semester: 'bahar',
        name: 'Algorithms & Programming for Engineers (Algoritmalar ve Programlama)',
        credits: '3 Kredi • 5 AKTS',
        icon: 'code-2',
        instructorIds: ['asim-egemen-yilmaz'],
        assistantIds: [],
        links: []
      },
      {
        code: 'EEE1004',
        year: 1,
        semester: 'bahar',
        name: 'Digital Logic Design (Sayısal Mantık Tasarımı)',
        credits: '3 Kredi • 4 AKTS',
        icon: 'binary',
        instructorIds: ['fikret-ari'],
        assistantIds: ['alperen-senay'],
        links: []
      },
      {
        code: 'EEE1006',
        year: 1,
        semester: 'bahar',
        name: 'Digital Logic Design Lab. (Sayısal Mantık Tasarımı Lab.)',
        credits: '1 Kredi • 2 AKTS',
        icon: 'microchip',
        instructorIds: ['fikret-ari'],
        assistantIds: ['alperen-senay', 'muhammed-mert-ulupinar'],
        links: []
      },
      {
        code: 'MTH0102',
        year: 1,
        semester: 'bahar',
        name: 'Calculus II (Matematik II)',
        credits: '4 Kredi • 7 AKTS',
        icon: 'sigma',
        instructorIds: ['serhan-varma'],
        assistantIds: [],
        links: []
      },
      {
        code: 'PHY0108',
        year: 1,
        semester: 'bahar',
        name: 'Physics II (Genel Fizik II)',
        credits: '3 Kredi • 6 AKTS',
        icon: 'zap',
        instructorIds: ['ahmet-karatay'],
        assistantIds: [],
        links: []
      },
      {
        code: 'TUR174',
        year: 1,
        semester: 'bahar',
        name: 'Turkish Language II (Türk Dili II)',
        credits: '2 Kredi • 2 AKTS',
        icon: 'book-type',
        instructorIds: ['meltem-ayabakan-ipek'],
        assistantIds: [],
        links: []
      },
      {
        code: 'OUL102',
        year: 1,
        semester: 'bahar',
        name: 'Mühendisler İçin Kariyer Planlama',
        credits: '1 Kredi • 2 AKTS',
        icon: 'compass',
        instructorIds: ['selcuk-tascioglu'],
        assistantIds: [],
        links: []
      },

      // ==================== 2. SINIF GÜZ (3. YARIYIL) ====================
      {
        code: 'EEE2001',
        year: 2,
        semester: 'guz',
        name: 'Circuit Theory I (Devre Teorisi I)',
        credits: '4 Kredi • 6 AKTS',
        icon: 'circuit-board',
        instructorIds: ['burak-ozbey'],
        assistantIds: ['tolga-karagoz'],
        links: []
      },
      {
        code: 'EEE2003',
        year: 2,
        semester: 'guz',
        name: 'Introduction to Semiconductor Devices (Yarıiletken Aygıtlara Giriş)',
        credits: '3 Kredi • 5 AKTS',
        icon: 'cpu',
        instructorIds: ['isa-navruz'],
        assistantIds: ['gizem-eda-capkinoglu'],
        links: []
      },
      {
        code: 'EEE2005',
        year: 2,
        semester: 'guz',
        name: 'Electrical Circuits & Semiconductor Devices Lab. (Elektrik Devreleri ve Yarıiletken Aygıtlar Lab.)',
        credits: '1 Kredi • 2 AKTS',
        icon: 'activity',
        instructorIds: ['isa-navruz'],
        assistantIds: ['gizem-eda-capkinoglu'],
        links: []
      },
      {
        code: 'EEE2007',
        year: 2,
        semester: 'guz',
        name: 'Probability Theory & Random Processes (Olasılık Teorisi ve Rastgele Süreçler)',
        credits: '3 Kredi • 6 AKTS',
        icon: 'bar-chart-3',
        instructorIds: ['ilyas-evrim-colak'],
        assistantIds: [],
        links: []
      },
      {
        code: 'MTH201',
        year: 2,
        semester: 'guz',
        name: 'Differential Equations (Diferansiyel Denklemler)',
        credits: '3 Kredi • 6 AKTS',
        icon: 'function-square',
        instructorIds: ['derya-kahveci'],
        assistantIds: [],
        links: []
      },
      {
        code: 'HIS103',
        year: 2,
        semester: 'guz',
        name: 'Atatürk İlkeleri ve İnkılap Tarihi I',
        credits: '2 Kredi • 2 AKTS',
        icon: 'landmark',
        instructorIds: [],
        assistantIds: [],
        links: []
      },

      // ==================== 2. SINIF BAHAR (4. YARIYIL) ====================
      {
        code: 'EEE2002',
        year: 2,
        semester: 'bahar',
        name: 'Circuit Theory II (Devre Teorisi II)',
        credits: '4 Kredi • 6 AKTS',
        icon: 'circuit-board',
        instructorIds: ['hakki-alparslan-ilgin'],
        assistantIds: [],
        links: []
      },
      {
        code: 'EEE2004',
        year: 2,
        semester: 'bahar',
        name: 'Electrical Circuits Lab. (Elektrik Devreleri Lab.)',
        credits: '1 Kredi • 2 AKTS',
        icon: 'gauge',
        instructorIds: ['burak-ozbey'],
        assistantIds: ['hacer-guler', 'tolga-karagoz'],
        links: []
      },
      {
        code: 'EEE2006',
        year: 2,
        semester: 'bahar',
        name: 'Electromagnetic Fields & Waves (Elektromanyetik Alanlar ve Dalgalar)',
        credits: '4 Kredi • 6 AKTS',
        icon: 'radio-tower',
        instructorIds: ['sultan-can'],
        assistantIds: ['yigit-parlak'],
        links: []
      },
      {
        code: 'EEE2008',
        year: 2,
        semester: 'bahar',
        name: 'Signals & Systems (Sinyaller ve Sistemler)',
        credits: '3 Kredi • 6 AKTS',
        icon: 'audio-waveform',
        instructorIds: ['gokhan-soysal', 'selcuk-tascioglu'],
        assistantIds: [],
        links: []
      },
      {
        code: 'HIS104',
        year: 2,
        semester: 'bahar',
        name: 'Atatürk İlkeleri ve İnkılap Tarihi II',
        credits: '2 Kredi • 2 AKTS',
        icon: 'landmark',
        instructorIds: [],
        assistantIds: [],
        links: []
      },

      // ==================== 3. SINIF GÜZ (5. YARIYIL) ====================
      {
        code: 'EEE3001',
        year: 3,
        semester: 'guz',
        name: 'Electronic Circuits I (Elektronik Devreler I)',
        credits: '3 Kredi • 5 AKTS',
        icon: 'cpu',
        instructorIds: ['cansel-ficici'],
        assistantIds: [],
        links: []
      },
      {
        code: 'EEE3003',
        year: 3,
        semester: 'guz',
        name: 'Electronic Circuits I Lab. (Elektronik Devreler I Lab.)',
        credits: '1 Kredi • 2 AKTS',
        icon: 'activity',
        instructorIds: ['cansel-ficici'],
        assistantIds: ['hacer-guler'],
        links: []
      },
      {
        code: 'EEE3005',
        year: 3,
        semester: 'guz',
        name: 'Electromagnetic Wave Theory (Elektromanyetik Dalga Teorisi)',
        credits: '4 Kredi • 6 AKTS',
        icon: 'waves',
        instructorIds: ['sultan-can'],
        assistantIds: ['yigit-parlak'],
        links: []
      },
      {
        code: 'EEE3007',
        year: 3,
        semester: 'guz',
        name: 'Electromechanical Energy Conversion (Elektromekanik Enerji Dönüşümü)',
        credits: '3 Kredi • 5 AKTS',
        icon: 'zap',
        instructorIds: ['okkes-tolga-altinoz', 'omer-aydin'],
        assistantIds: [],
        links: []
      },
      {
        code: 'EEE3009',
        year: 3,
        semester: 'guz',
        name: 'Digital Signal Processing (Sayısal Sinyal İşleme)',
        credits: '3 Kredi • 6 AKTS',
        icon: 'audio-waveform',
        instructorIds: ['hakki-alparslan-ilgin'],
        assistantIds: [],
        links: []
      },
      {
        code: 'SCS301',
        year: 3,
        semester: 'guz',
        name: 'Scientific Integrity & Ethics (Bilimsel Dürüstlük ve Etik)',
        credits: '0 Kredi • 3 AKTS',
        icon: 'scale',
        instructorIds: ['ilyas-evrim-colak'],
        assistantIds: [],
        links: []
      },

      // ==================== 3. SINIF BAHAR (6. YARIYIL) ====================
      {
        code: 'EEE3002',
        year: 3,
        semester: 'bahar',
        name: 'Electronic Circuits II (Elektronik Devreler II)',
        credits: '3 Kredi • 5 AKTS',
        icon: 'cpu',
        instructorIds: ['cansel-ficici'],
        assistantIds: [],
        links: []
      },
      {
        code: 'EEE3004',
        year: 3,
        semester: 'bahar',
        name: 'Electronic Circuits II Lab. (Elektronik Devreler II Lab.)',
        credits: '1 Kredi • 2 AKTS',
        icon: 'activity',
        instructorIds: ['cansel-ficici'],
        assistantIds: ['hacer-guler', 'muhammed-mert-ulupinar'],
        links: []
      },
      {
        code: 'EEE3342',
        year: 3,
        semester: 'bahar',
        name: 'Communication Systems (Haberleşme Sistemleri)',
        credits: '3 Kredi • 5 AKTS',
        icon: 'radio',
        instructorIds: ['murat-husnu-sazli', 'aykut-kalaycioglu'],
        assistantIds: [],
        links: []
      },
      {
        code: 'EEE3344',
        year: 3,
        semester: 'bahar',
        name: 'Linear Control Systems (Lineer Kontrol Sistemleri)',
        credits: '3 Kredi • 5 AKTS',
        icon: 'sliders-horizontal',
        instructorIds: ['okkes-tolga-altinoz'],
        assistantIds: [],
        links: []
      },
      {
        code: 'PPL302',
        year: 3,
        semester: 'bahar',
        name: 'Professional Responsibility & Ethics (Mesleki Sorumluluk ve Etik)',
        credits: '1 Kredi • 2 AKTS',
        icon: 'shield-check',
        instructorIds: ['ilyas-evrim-colak'],
        assistantIds: [],
        links: []
      },

      // ==================== 4. SINIF GÜZ (7. YARIYIL) ====================
      {
        code: 'EEE4001',
        year: 4,
        semester: 'guz',
        name: 'Capstone Design I (Bitirme Tasarım Projesi I)',
        credits: '3 Kredi • 4 AKTS',
        icon: 'FolderGit2',
        instructorIds: ['murat-efe'],
        assistantIds: [],
        links: []
      },
      {
        code: 'EEE4091',
        year: 4,
        semester: 'guz',
        name: 'Occupational Health & Safety I (İş Sağlığı ve Güvenliği I)',
        credits: '1 Kredi • 1 AKTS',
        icon: 'hard-hat',
        instructorIds: ['sinan-kivanc-kaya'],
        assistantIds: [],
        links: []
      },
      {
        code: 'EEE4099',
        year: 4,
        semester: 'guz',
        name: 'Summer Practice (Yaz Stajı)',
        credits: '0 Kredi • 5 AKTS',
        icon: 'briefcase',
        instructorIds: ['isa-navruz'],
        assistantIds: [],
        links: []
      },

      // ==================== 4. SINIF BAHAR (8. YARIYIL) ====================
      {
        code: 'EEE4002',
        year: 4,
        semester: 'bahar',
        name: 'Capstone Design II (Bitirme Tasarım Projesi II)',
        credits: '3 Kredi • 4 AKTS',
        icon: 'rocket',
        instructorIds: ['ahmet-akbulut'],
        assistantIds: [],
        links: []
      },
      {
        code: 'EEE4092',
        year: 4,
        semester: 'bahar',
        name: 'Occupational Health & Safety II (İş Sağlığı ve Güvenliği II)',
        credits: '1 Kredi • 1 AKTS',
        icon: 'hard-hat',
        instructorIds: ['emine-elmas'],
        assistantIds: [],
        links: []
      }
    ];

    const CURRICULUM_MAP = new Map(CURRICULUM_COURSES.map(c => [c.code, c]));

    // Build DEFAULT_COURSE_METADATA dynamically from single source of truth (CURRICULUM_COURSES + STAFF_DATA)
    const DEFAULT_COURSE_METADATA = {};
    CURRICULUM_COURSES.forEach(c => {
      const instructors = (c.instructorIds || []).map(id => STAFF_MAP.get(id)).filter(Boolean);
      const assistants = (c.assistantIds || []).map(id => STAFF_MAP.get(id)).filter(Boolean);
      const primaryInst = instructors[0] || null;
      DEFAULT_COURSE_METADATA[c.code] = {
        name: c.name,
        year: c.year,
        semester: c.semester,
        instructorIds: c.instructorIds || [],
        assistantIds: c.assistantIds || [],
        instructor: instructors.map(s => `${s.title} ${s.name}`).join(', '),
        assistantsText: assistants.map(s => `${s.title} ${s.name}`).join(', '),
        email: primaryInst?.email || '',
        avesisUrl: primaryInst?.avesisUrl || '',
        credits: c.credits,
        icon: (c.icon === 'FolderGit2' ? 'folder-kanban' : c.icon) || 'book-open',
        banner: c.banner || '',
        bannerPos: c.bannerPos || 'center center',
        bannerRatio: c.bannerRatio || (16 / 9),
        links: c.links ? [...c.links] : []
      };
    });

    const $ = (id) => document.getElementById(id);
    const DRIVE_PROXY = window.PORTAL_BACKEND.url + '/functions/v1/drive-proxy';
    const DRIVE_HEADERS = { apikey: window.PORTAL_BACKEND.key };
    const FOLDER_MIME = 'application/vnd.google-apps.folder';
    const SHORTCUT_MIME = 'application/vnd.google-apps.shortcut';
    const YT_REGEX = /(?:youtube\.com\/(?:watch\?(?:[^\s]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/;

    let settings = {
      folder: CONFIG.FOLDER
    };

    let courseMetadata = {};
    Object.keys(DEFAULT_COURSE_METADATA).forEach(code => {
      const def = DEFAULT_COURSE_METADATA[code];
      if (!courseMetadata[code]) {
        courseMetadata[code] = { ...def, links: [...(def.links || [])] };
      } else {
        courseMetadata[code].name = courseMetadata[code].name || def.name;
        courseMetadata[code].year = def.year;
        courseMetadata[code].semester = def.semester;
        courseMetadata[code].instructorIds = def.instructorIds;
        courseMetadata[code].assistantIds = def.assistantIds;
        courseMetadata[code].instructor = def.instructor;
        courseMetadata[code].assistantsText = def.assistantsText;
        courseMetadata[code].email = def.email;
        courseMetadata[code].avesisUrl = def.avesisUrl;
        courseMetadata[code].credits = def.credits;
        courseMetadata[code].icon = def.icon;
        if (def.banner) {
          courseMetadata[code].banner = def.banner;
          courseMetadata[code].bannerPos = def.bannerPos;
          courseMetadata[code].bannerRatio = def.bannerRatio;
        }
        const existingLinksByUrl = new Map((courseMetadata[code].links || []).map(l => [(l.url || '').toLowerCase(), l]));
        (def.links || []).forEach(defLink => {
          const u = (defLink.url || '').toLowerCase();
          if (!existingLinksByUrl.has(u)) {
            if (!courseMetadata[code].links) courseMetadata[code].links = [];
            courseMetadata[code].links.push(defLink);
          } else {
            const existing = existingLinksByUrl.get(u);
            existing.title = defLink.title;
            existing.icon = defLink.icon;
          }
        });
      }
    });
    localStorage.setItem('anku_course_meta_v12', JSON.stringify(courseMetadata));

    let driveTree = null;
    let activeCourseId = null;
    let activeView = 'home'; // 'home' | 'course' | 'staff'
    let highlightedStaffId = null;
    let staffCategoryFilter = 'ALL'; // 'ALL' | 'faculty' | 'assistant' | 'parttime'
    let staffSearchQuery = '';
    let currentEditingCourseCode = null;

    // Sidebar 4-year & semester accordion state
    let expandedSidebarYears = new Set([1]);
    let expandedSidebarSemesters = new Set(['1-guz']);

    let tablePageIndex = 0;
    const tablePageSize = 10;
    let tableSearchQuery = '';
    let tableCourseFilter = 'ALL';
    let courseLocalSearch = '';

    // Calculus I (MTH0101) Interactive Study Mode State
    let activeCourseTab = 'materials'; // 'materials' | 'study'
    let activeStudyTopicId = 'tangents-rates';
    let openStudyExamples = new Set();
    let openStudyHints = new Set();
    let studyQuizAnswers = {};
    let completedStudyTopics = new Set();
    try {
      const savedCompleted = localStorage.getItem('anku_mth0101_completed_topics_v1');
      if (savedCompleted) completedStudyTopics = new Set(JSON.parse(savedCompleted));
    } catch {}

    function triggerMathRendering(container) {
      if (typeof window !== 'undefined' && typeof window.renderMathInElement === 'function') {
        const target = container || $('courseMaterialsContainer') || document.body;
        try {
          window.renderMathInElement(target, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        } catch (e) {
          console.warn('Math rendering error:', e);
        }
      }
    }

    function saveCompletedStudyTopics() {
      try {
        localStorage.setItem('anku_mth0101_completed_topics_v1', JSON.stringify(Array.from(completedStudyTopics)));
      } catch {}
    }

    const jsArg = PortalSecurity.argument;
    const safeLink = PortalSecurity.url;
    const safeImage = PortalSecurity.image;
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    function parseFolderId(input) {
      if (!input) return '';
      const m = input.match(/folders\/([\w-]+)/) || input.match(/[?&]id=([\w-]+)/);
      return m ? m[1] : input.trim();
    }

    function realMime(node) {
      return node.mimeType === SHORTCUT_MIME ? (node.shortcutDetails?.targetMimeType || '') : node.mimeType;
    }
    function realId(node) {
      return node.mimeType === SHORTCUT_MIME ? (node.shortcutDetails?.targetId || node.id) : node.id;
    }

    function extractYouTubeId(text) {
      const m = String(text || '').match(YT_REGEX);
      return m ? m[1] : null;
    }

    function getFileKind(node) {
      const mime = realMime(node);
      const name = node.name.toLowerCase();
      if (extractYouTubeId(node.name) || extractYouTubeId(node.description)) return 'youtube';
      if (mime === FOLDER_MIME) return 'folder';
      if (mime === 'application/pdf' || name.endsWith('.pdf')) return 'pdf';
      if (mime.includes('presentation') || /\.(pptx?|odp)$/.test(name)) return 'slide';
      if (mime.includes('document') || mime.includes('msword') || /\.(docx?|odt|rtf)$/.test(name)) return 'word';
      if (mime.includes('spreadsheet') || /\.(xlsx?|csv)$/.test(name)) return 'sheet';
      if (mime.startsWith('video/')) return 'video';
      if (mime.startsWith('image/')) return 'image';
      if (/\.(url|webloc|txt)$/.test(name) || mime === 'text/plain') return 'link';
      return 'file';
    }

    const KIND_CONFIG = {
      pdf: { icon: 'file-text', badge: 'PDF' },
      slide: { icon: 'presentation', badge: 'Slayt' },
      word: { icon: 'file-type', badge: 'Word' },
      sheet: { icon: 'table', badge: 'Tablo' },
      youtube: { icon: 'youtube', badge: 'YouTube' },
      video: { icon: 'film', badge: 'Video' },
      image: { icon: 'image', badge: 'Görsel' },
      link: { icon: 'link', badge: 'Link' },
      file: { icon: 'file', badge: 'Dosya' }
    };

    function formatFileSize(bytes) {
      if (!bytes || isNaN(bytes)) return '—';
      const b = Number(bytes);
      if (b <= 0) return '—';
      if (b < 1024) return b + ' B';
      if (b < 1024 * 1024) return (b / 1024).toFixed(0) + ' KB';
      return (b / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function getPreviewUrl(node) {
      const id = realId(node);
      const mime = realMime(node);
      if (mime === 'application/vnd.google-apps.document') return `https://docs.google.com/document/d/${id}/preview`;
      if (mime === 'application/vnd.google-apps.presentation') return `https://docs.google.com/presentation/d/${id}/embed?start=false&loop=false`;
      if (mime === 'application/vnd.google-apps.spreadsheet') return `https://docs.google.com/spreadsheets/d/${id}/preview`;
      return `https://drive.google.com/file/d/${id}/preview`;
    }

    function countFilesInFolder(nodes) {
      return (nodes || []).reduce((n, x) => {
        if (x.name.toLowerCase().startsWith('info.') || x.name.toLowerCase().startsWith('bilgi.')) return n;
        return n + (x.children ? countFilesInFolder(x.children) : (realMime(x) === FOLDER_MIME ? 0 : 1));
      }, 0);
    }

    function collectAllFiles(nodes, courseCode = '', folderPath = '') {
      let list = [];
      (nodes || []).forEach(node => {
        if (/^(info|bilgi)\.(txt|json)$/i.test(node.name)) return;
        if (realMime(node) === FOLDER_MIME) {
          const nextCourse = courseCode || node.name.toUpperCase().trim();
          const nextPath = courseCode ? (folderPath ? `${folderPath} / ${node.name}` : node.name) : '—';
          if (node.children) {
            list = list.concat(collectAllFiles(node.children, nextCourse, nextPath));
          }
        } else {
          list.push({
            node,
            courseCode: courseCode || 'GENEL',
            folderPath: folderPath || '—'
          });
        }
      });
      return list;
    }

    // ================= DRIVE API CALLS =================
    async function buildDriveTree() {
      const response = await fetch(DRIVE_PROXY + '?mode=tree', { headers: DRIVE_HEADERS });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.tree)) {
        throw new Error(data.error || 'Drive materyalleri yüklenemedi.');
      }
      return PortalSecurity.tree(data.tree);
    }

    // ================= LOADING STATE & DYNAMIC META =================
    function renderLoadingSkeleton() {
      const container = $('courseHubView');
      if (!container) return;
      $('mainContainer')?.setAttribute('aria-busy', 'true');
      $('mainLoader')?.classList.remove('hidden');
      container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60 pointer-events-none">
          ${Array.from({ length: 6 }).map(() => `
            <div class="admincn-card p-5 space-y-4 animate-pulse">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="size-9 rounded-sm bg-muted"></div>
                  <div class="space-y-1.5">
                    <div class="h-3.5 w-16 rounded bg-muted"></div>
                    <div class="h-2.5 w-20 rounded bg-muted"></div>
                  </div>
                </div>
                <div class="h-5 w-14 rounded-sm bg-muted"></div>
              </div>
              <div class="space-y-1.5">
                <div class="h-4 w-3/4 rounded bg-muted"></div>
                <div class="h-3 w-1/2 rounded bg-muted"></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    function updatePageMeta(courseCode = null, meta = null) {
      const defaultTitle = 'ANKU EEE — Elektrik-Elektronik Mühendisliği Ders Portalı';
      const defaultDesc = 'Ankara Üniversitesi Elektrik-Elektronik Mühendisliği (ANKU EEE) ders materyalleri, ders notları, slaytlar ve kaynak arşivi.';

      const title = courseCode && meta
        ? `${courseCode} • ${meta.name} — ANKU EEE Ders Portalı`
        : defaultTitle;
      const desc = courseCode && meta
        ? `${courseCode} ${meta.name}${meta.instructor ? ' (' + meta.instructor + ')' : ''} ders materyalleri ve kaynak arşivi.`
        : defaultDesc;

      document.title = title;
      if ($('metaDescription')) $('metaDescription').setAttribute('content', desc);
      if ($('ogTitle')) $('ogTitle').setAttribute('content', title);
      if ($('ogDescription')) $('ogDescription').setAttribute('content', desc);
      if ($('twitterTitle')) $('twitterTitle').setAttribute('content', title);
      if ($('twitterDescription')) $('twitterDescription').setAttribute('content', desc);

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', {
          page_title: title,
          page_path: courseCode ? `${location.pathname}#${courseCode}` : location.pathname
        });
      }
    }

    // ================= LOAD DRIVE & INITIALIZE =================
    async function loadDriveData() {
      const folderId = parseFolderId(settings.folder);
      const driveUrl = folderId ? `https://drive.google.com/drive/folders/${folderId}` : 'https://drive.google.com';
      const hDrive = $('headerDriveBtn');
      if (hDrive) hDrive.href = driveUrl;
      const sDrive = $('sidebarDriveLink');
      if (sDrive) sDrive.href = driveUrl;

      if (!folderId) {
        $('statusText').textContent = 'Hata';
        $('statusDot').className = 'size-2 shrink-0 rounded-full bg-rose-500';
        return;
      }

      const cache = PortalSecurity.stored('anku_tree_cache_v3');
      if (cache && cache.folderId === folderId && !driveTree) {
        driveTree = PortalSecurity.tree(cache.tree);
        onTreeReady();
      } else if (!driveTree) {
        renderLoadingSkeleton();
      }

      $('statusText').textContent = 'Yükleniyor';
      $('statusDot').className = 'size-2 shrink-0 rounded-full bg-amber-500 animate-pulse';
      $('refreshBtn').querySelector('svg')?.classList.add('animate-spin');

      try {
        driveTree = await buildDriveTree(folderId);
        localStorage.setItem('anku_tree_cache_v3', JSON.stringify({ folderId, tree: driveTree, time: Date.now() }));
        onTreeReady();

        const totalFiles = countFilesInFolder(driveTree);
        $('statusText').textContent = 'Drive';
        $('statusDot').className = 'size-2 shrink-0 rounded-full bg-emerald-500';
        $('totalFilesBadge').textContent = `${totalFiles} dosya`;
      } catch (err) {
        $('statusText').textContent = 'Hata';
        $('statusDot').className = 'size-2 shrink-0 rounded-full bg-rose-500';
        $('mainLoader')?.classList.add('hidden');
        $('mainContainer')?.setAttribute('aria-busy', 'false');
      } finally {
        $('refreshBtn').querySelector('svg')?.classList.remove('animate-spin');
      }
    }

    function getCourseNodeByCode(code) {
      if (!code) return null;
      const upper = code.toUpperCase().trim();
      const realNode = (driveTree || []).find(n => realMime(n) === FOLDER_MIME && n.name.toUpperCase().trim() === upper);
      if (realNode) return realNode;
      if (CURRICULUM_MAP.has(upper) || courseMetadata[upper]) {
        return {
          id: `virtual-${upper}`,
          name: upper,
          mimeType: FOLDER_MIME,
          children: [],
          isVirtual: true
        };
      }
      return null;
    }

    function getCourseNodeById(courseId) {
      if (!courseId) return null;
      const realNode = (driveTree || []).find(n => n.id === courseId);
      if (realNode) return realNode;
      if (String(courseId).startsWith('virtual-')) {
        const code = String(courseId).replace(/^virtual-/, '').toUpperCase().trim();
        return getCourseNodeByCode(code);
      }
      return null;
    }

    function getAllCourseNodes() {
      const seen = new Set();
      const list = [];
      CURRICULUM_COURSES.forEach(c => {
        const node = getCourseNodeByCode(c.code);
        if (node) {
          seen.add(c.code);
          list.push(node);
        }
      });
      (driveTree || []).forEach(n => {
        if (realMime(n) === FOLDER_MIME) {
          const code = n.name.toUpperCase().trim();
          if (!seen.has(code)) {
            seen.add(code);
            list.push(n);
          }
        }
      });
      return list;
    }

    function onTreeReady() {
      window.portalApplyDrive?.();
      $('mainLoader')?.classList.add('hidden');
      $('mainContainer')?.setAttribute('aria-busy', 'false');
      syncCourseFromHash();
      renderSidebarCourses();

      const totalFiles = countFilesInFolder(driveTree);
      $('totalFilesBadge').textContent = `${totalFiles} dosya`;

      if (activeView === 'staff') {
        renderStaffHub(highlightedStaffId);
      } else if (activeCourseId) {
        renderCourseHub(activeCourseId);
      } else {
        renderWelcomeHub();
      }
    }

    function updateHeaderBreadcrumb(courseCode = null, courseTitle = null) {
      const bc = $('headerBreadcrumb');
      if (!bc) return;

      if (activeView === 'staff') {
        bc.innerHTML = `
          <li class="inline-flex items-center gap-1.5">
            <button data-portal-click="goHome" data-portal-click-args="[]" class="hover:text-foreground transition">Ana Sayfa</button>
          </li>
          <li><i data-lucide="chevron-right" class="size-3.5"></i></li>
          <li class="text-foreground font-medium truncate">Öğretim Görevlileri</li>
        `;
      } else if (!courseCode) {
        bc.innerHTML = `<li class="text-foreground font-medium truncate">Tüm Dersler</li>`;
      } else {
        const curr = CURRICULUM_MAP.get(courseCode);
        const yearSemBadge = curr ? `${curr.year}. Sınıf ${curr.semester === 'guz' ? 'Güz' : 'Bahar'}` : '';
        bc.innerHTML = `
          <li class="inline-flex items-center gap-1.5">
            <button data-portal-click="goHome" data-portal-click-args="[]" class="hover:text-foreground transition">Dersler</button>
          </li>
          ${yearSemBadge ? `
            <li><i data-lucide="chevron-right" class="size-3.5"></i></li>
            <li class="text-muted-foreground hidden xl:inline">${esc(yearSemBadge)}</li>
          ` : ''}
          <li><i data-lucide="chevron-right" class="size-3.5"></i></li>
          <li class="text-foreground font-medium truncate">${esc(courseCode)}${courseTitle ? ' • ' + esc(courseTitle.split('(')[0].trim()) : ''}</li>
        `;
      }
      lucide.createIcons();
    }

    // ================= RENDER LEFT SIDEBAR (STAFF + ALL COURSES + 4-YEAR / SEMESTER TREE) =================
    window.toggleSidebarYear = function(year) {
      const wrapper = $('sidebarWrapper');
      if (wrapper && wrapper.getAttribute('data-state') === 'collapsed' && window.innerWidth >= 768) {
        wrapper.setAttribute('data-state', 'expanded');
      }
      if (expandedSidebarYears.has(year)) {
        expandedSidebarYears.delete(year);
      } else {
        expandedSidebarYears.add(year);
      }
      renderSidebarCourses();
    };

    window.toggleSidebarSemester = function(year, sem) {
      const key = `${year}-${sem}`;
      if (expandedSidebarSemesters.has(key)) {
        expandedSidebarSemesters.delete(key);
      } else {
        expandedSidebarSemesters.add(key);
      }
      renderSidebarCourses();
    };

    const SHORT_SIDEBAR_COURSE_LABELS = {
      // 1. Sınıf Güz
      'EEE1001': "EEM'e Giriş",
      'CHM109': 'Genel Kimya',
      'MTH0101': 'Matematik I',
      'MTH103': 'Lineer Cebir',
      'PHY0107': 'Fizik I',
      'TUR171': 'Türk Dili I',
      'OUL101': 'Üniv. Giriş',
      // 1. Sınıf Bahar
      'EEE1002': 'Programlama',
      'EEE1004': 'Sayısal Mantık',
      'EEE1006': 'Sayısal Lab.',
      'MTH0102': 'Matematik II',
      'PHY0108': 'Fizik II',
      'TUR174': 'Türk Dili II',
      'OUL102': 'Kariyer Plan.',
      // 2. Sınıf Güz
      'EEE2001': 'Devre Teorisi I',
      'EEE2003': 'Yarıiletkenler',
      'EEE2005': 'Devre Lab. I',
      'EEE2007': 'Olasılık',
      'MTH201': 'Dif. Denklemler',
      'HIS103': 'İnkılap I',
      // 2. Sınıf Bahar
      'EEE2002': 'Devre Teorisi II',
      'EEE2004': 'Devre Lab. II',
      'EEE2006': 'Elektromanyetik',
      'EEE2008': 'Sinyaller',
      'HIS104': 'İnkılap II',
      // 3. Sınıf Güz
      'EEE3001': 'Elektronik I',
      'EEE3003': 'Elektronik Lab. I',
      'EEE3005': 'Dalga Teorisi',
      'EEE3007': 'Enerji Dönüşümü',
      'EEE3009': 'Sayısal Sinyal',
      'SCS301': 'Bilimsel Etik',
      // 3. Sınıf Bahar
      'EEE3002': 'Elektronik II',
      'EEE3004': 'Elektronik Lab. II',
      'EEE3342': 'Haberleşme',
      'EEE3344': 'Kontrol Sis.',
      'PPL302': 'Mesleki Etik',
      // 4. Sınıf Güz
      'EEE4001': 'Bitirme Proj. I',
      'EEE4091': 'İSG I',
      'EEE4099': 'Yaz Stajı',
      // 4. Sınıf Bahar
      'EEE4002': 'Bitirme Proj. II',
      'EEE4092': 'İSG II'
    };

    function renderSidebarCourses() {
      const dashContainer = $('sidebarDashboardNav');
      const container = $('courseListNav');
      if (!dashContainer || !container) return;

      const isStaffActive = (activeView === 'staff');

      dashContainer.innerHTML = `
        <li>
          <button
            data-portal-click="goToStaffPage" data-portal-click-args="[]"
            title="Öğretim Görevlileri"
            class="sidebar-nav-btn flex h-8 w-full items-center justify-between gap-2 rounded-md px-2 text-sm transition ${
              isStaffActive
                ? 'bg-primary-soft text-foreground font-medium'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            }"
          >
            <div class="flex items-center gap-2 min-w-0">
              <i data-lucide="users" class="size-4 shrink-0 ${isStaffActive ? 'text-foreground' : 'text-muted-foreground'}"></i>
              <span class="sidebar-hide-collapsed truncate">Öğretim Görevlileri</span>
            </div>
            <span class="sidebar-hide-collapsed rounded-full bg-primary-soft px-1.5 text-[10px] font-medium tabular-nums text-muted-foreground shrink-0">
              ${STAFF_DATA.length}
            </span>
          </button>
        </li>
      `;

      const activeCode = activeCourseId ? getCourseCodeById(activeCourseId) : null;

      const years = [1, 2, 3, 4];
      container.innerHTML = years.map(yr => {
        const isYearExpanded = expandedSidebarYears.has(yr);
        const yearCourses = CURRICULUM_COURSES.filter(c => c.year === yr);
        const hasActiveInYear = yearCourses.some(c => c.code === activeCode);

        const semesters = [
          { key: 'guz', label: 'Güz Dönemi', semNum: (yr - 1) * 2 + 1, icon: 'leaf' },
          { key: 'bahar', label: 'Bahar Dönemi', semNum: (yr - 1) * 2 + 2, icon: 'sun' }
        ];

        const semestersHtml = semesters.map(sem => {
          const semKey = `${yr}-${sem.key}`;
          const isSemExpanded = expandedSidebarSemesters.has(semKey);
          const semCourses = yearCourses.filter(c => c.semester === sem.key);
          const hasActiveInSem = semCourses.some(c => c.code === activeCode);

          const coursesListHtml = semCourses.map(c => {
            const isSelected = (activeView === 'course' && activeCode === c.code);
            const meta = courseMetadata[c.code] || { name: c.name, icon: c.icon || 'book-open' };
            const iconName = meta.icon || 'book-open';
            const shortLabel = meta.shortName || SHORT_SIDEBAR_COURSE_LABELS[c.code] || c.code;

            return `
              <li>
                <button
                  data-portal-click="selectCourseByCode" data-portal-click-args="[${jsArg(c.code)}]"
                  title="${esc(c.code)} — ${esc(meta.name)}"
                  class="sidebar-course-btn ${isSelected ? 'is-active' : ''} flex h-7 w-full items-center gap-1.5 rounded-md px-1.5 text-xs transition ${
                    isSelected
                      ? 'bg-primary-soft text-foreground font-semibold'
                      : 'text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-foreground'
                  }"
                >
                  <i data-lucide="${esc(PortalSecurity.icon(iconName))}" class="size-3.5 shrink-0 ${isSelected ? 'text-foreground' : 'text-muted-foreground'}"></i>
                  <span class="font-mono text-xs font-medium shrink-0">${esc(c.code)}</span>
                  <span class="sidebar-course-label text-[11px] font-normal whitespace-nowrap">${esc(shortLabel)}</span>
                </button>
              </li>
            `;
          }).join('');

          return `
            <li class="space-y-0.5">
              <button
                type="button"
                data-portal-click="toggleSidebarSemester" data-portal-click-args="[${yr}, ${jsArg(sem.key)}]"
                class="flex h-7 w-full items-center justify-between gap-2 rounded-md px-1.5 text-xs font-medium transition ${
                  hasActiveInSem
                    ? 'text-foreground bg-sidebar-accent/60'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }"
              >
                <div class="flex items-center gap-1.5 min-w-0">
                  <i data-lucide="chevron-right" class="size-3.5 shrink-0 text-muted-foreground transition-transform duration-150 ${isSemExpanded ? 'rotate-90 text-foreground' : ''}"></i>
                  <span class="truncate">${sem.label}</span>
                </div>
                <span class="text-[10px] text-muted-foreground font-mono shrink-0">${semCourses.length} ders</span>
              </button>
              ${isSemExpanded ? `
                <ul class="ml-2 pl-2 sidebar-tree-line space-y-0.5 py-0.5">
                  ${coursesListHtml}
                </ul>
              ` : ''}
            </li>
          `;
        }).join('');

        return `
          <li class="space-y-0.5">
            <button
              type="button"
              data-portal-click="toggleSidebarYear" data-portal-click-args="[${yr}]"
              title="${yr}. Sınıf Dersleri"
              class="sidebar-nav-btn flex h-8 w-full items-center justify-between gap-2 rounded-md px-2 text-sm font-medium transition ${
                hasActiveInYear && !isYearExpanded
                  ? 'bg-primary-soft text-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }"
            >
              <span class="truncate font-semibold">${yr}.<span class="sidebar-hide-collapsed"> Sınıf</span></span>
              <i data-lucide="chevron-down" class="sidebar-hide-collapsed size-3.5 shrink-0 text-muted-foreground transition-transform duration-150 ${isYearExpanded ? 'rotate-180 text-foreground' : ''}"></i>
            </button>
            ${isYearExpanded ? `
              <ul class="sidebar-hide-collapsed ml-2 pl-2 sidebar-tree-line space-y-1 py-0.5">
                ${semestersHtml}
              </ul>
            ` : ''}
          </li>
        `;
      }).join('');

      lucide.createIcons();
    }

    // ================= ROUTING (URL hash + history) =================
    function getCourseCodeById(courseId) {
      const node = getCourseNodeById(courseId);
      return node ? node.name.toUpperCase().trim() : null;
    }

    function expandSidebarForCourse(code) {
      const curr = CURRICULUM_MAP.get(code);
      if (curr) {
        expandedSidebarYears.add(curr.year);
        expandedSidebarSemesters.add(`${curr.year}-${curr.semester}`);
      }
    }

    function syncCourseFromHash() {
      if (!location.hash) {
        activeView = 'home';
        activeCourseId = null;
        return;
      }
      let rawHash = '';
      try { rawHash = decodeURIComponent(location.hash.slice(1)).trim(); } catch (e) { rawHash = location.hash.slice(1).trim(); }
      if (!rawHash) return;

      const lowerHash = rawHash.toLowerCase();
      if (lowerHash === 'ogretim-gorevlileri' || lowerHash.startsWith('ogretim-gorevlileri:') || lowerHash.startsWith('hoca:')) {
        activeView = 'staff';
        activeCourseId = null;
        const parts = rawHash.split(':');
        highlightedStaffId = parts[1] ? parts[1].trim() : null;
        updateHeaderBreadcrumb(null, null);
        document.title = 'Öğretim Görevlileri — ANKU EEE Portal';
        return;
      }

      const code = rawHash.toUpperCase();
      const node = getCourseNodeByCode(code);
      if (!node) {
        history.replaceState(null, '', location.pathname + location.search);
        activeView = 'home';
        activeCourseId = null;
        return;
      }
      activeView = 'course';
      activeCourseId = node.id;
      courseLocalSearch = '';
      if (code !== 'MTH0101') {
        activeCourseTab = 'materials';
      }
      expandSidebarForCourse(code);
      const meta = courseMetadata[code] || { name: code };
      updateHeaderBreadcrumb(code, meta.name);
      updatePageMeta(code, meta);
    }

    // A page reload keeps history.state; a stale viewer marker must not linger.
    if (history.state && history.state.viewer) {
      history.replaceState(null, '', location.href);
    }

    window.addEventListener('popstate', () => {
      if (skipNextViewerPop) {
        skipNextViewerPop = false;
        return;
      }
      if ($('viewerModal')?.open) {
        closeViewerModal();
        return;
      }
      syncCourseFromHash();
      renderSidebarCourses();
      if (activeView === 'staff') {
        renderStaffHub(highlightedStaffId);
      } else if (activeCourseId) {
        renderCourseHub(activeCourseId);
      } else {
        renderWelcomeHub();
      }
    });

    window.goHome = function(opts = {}) {
      if (!opts.fromHistory && location.hash) {
        history.pushState(null, '', location.pathname + location.search);
      }
      activeView = 'home';
      activeCourseId = null;
      highlightedStaffId = null;
      courseLocalSearch = '';
      if (code !== 'MTH0101') {
        activeCourseTab = 'materials';
      }
      updateHeaderBreadcrumb(null);
      updatePageMeta(null, null);
      renderSidebarCourses();
      renderWelcomeHub();
      if (window.innerWidth < 768) {
        toggleMobileSidebar(false);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.goToStaffPage = function(staffId = null, opts = {}) {
      const targetHash = staffId ? `#ogretim-gorevlileri:${encodeURIComponent(staffId)}` : '#ogretim-gorevlileri';
      if (!opts.fromHistory && location.hash !== targetHash) {
        history.pushState(null, '', targetHash);
      }
      activeView = 'staff';
      activeCourseId = null;
      highlightedStaffId = staffId || null;
      if (staffId) {
        // Ensure filter doesn't hide the target staff member
        staffCategoryFilter = 'ALL';
        staffSearchQuery = '';
      }
      updateHeaderBreadcrumb(null, null);
      document.title = 'Öğretim Görevlileri — ANKU EEE Portal';
      renderSidebarCourses();
      renderStaffHub(highlightedStaffId);
      if (window.innerWidth < 768) {
        toggleMobileSidebar(false);
      }
      if (!staffId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.selectCourseByCode = function(courseCode, opts = {}) {
      const node = getCourseNodeByCode(courseCode);
      if (!node) return;
      selectCourse(node.id, opts);
    };

    window.selectCourse = function(courseId, opts = {}) {
      const courseNode = getCourseNodeById(courseId);
      const code = courseNode ? courseNode.name.toUpperCase().trim() : null;
      if (!opts.fromHistory && code) {
        if (location.hash !== '#' + encodeURIComponent(code)) {
          history.pushState(null, '', '#' + encodeURIComponent(code));
        }
      }
      activeView = 'course';
      activeCourseId = courseNode ? courseNode.id : courseId;
      highlightedStaffId = null;
      courseLocalSearch = '';
      if (code !== 'MTH0101') {
        activeCourseTab = 'materials';
      }
      if (code) {
        expandSidebarForCourse(code);
        const meta = courseMetadata[code] || { name: courseNode.name };
        updateHeaderBreadcrumb(code, meta.name);
        updatePageMeta(code, meta);
      } else {
        updatePageMeta(null, null);
      }
      renderSidebarCourses();
      if (activeCourseId) {
        renderCourseHub(activeCourseId);
      } else {
        renderWelcomeHub();
      }
      if (window.innerWidth < 768) {
        toggleMobileSidebar(false);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ================= ACADEMIC CALENDAR & AGENDA =================
    const MONTH_NAMES_TR = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const MONTH_NAMES_TR_SHORT = [
      'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
      'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'
    ];
    const DAY_NAMES_TR = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

    const COURSE_SOLID_COLORS = {
      'PHY0107': { bg: '#a855f7', text: '#ffffff' }, // Mor
      'MTH0101': { bg: '#3b82f6', text: '#ffffff' }, // Mavi
      'MTH103':  { bg: '#0d9488', text: '#ffffff' }, // Turkuaz
      'CHM109':  { bg: '#10b981', text: '#ffffff' }, // Zümrüt Yeşili
      'EEE1001': { bg: '#f59e0b', text: '#000000' }, // Kehribar (siyah kontrast yazı)
      'TUR171':  { bg: '#f43f5e', text: '#ffffff' }, // Pembe / Gül
      'GENEL':   { bg: '#ff453a', text: '#ffffff' }  // Apple Kırmızı
    };

    function getCourseSolidColor(code) {
      return COURSE_SOLID_COLORS[code] || { bg: '#ff453a', text: '#ffffff' };
    }

    function getTodayDateStr() {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }

    let calendarViewDate = new Date();
    calendarViewDate.setDate(1); // 1st of month
    let calendarActiveDateStr = null;
    let calendarPopoverHideTimer = null;

    const CALENDAR_CLASS_STORAGE_KEY = 'anku_calendar_class_v1';
    let calendarClassYear = 1;
    try {
      const savedYear = Number(localStorage.getItem(CALENDAR_CLASS_STORAGE_KEY));
      if ([1, 2, 3, 4].includes(savedYear)) calendarClassYear = savedYear;
    } catch (_) { /* The calendar still works when storage is unavailable. */ }

    function getCurrentAcademicSemester(now = new Date()) {
      // Spring teaching starts in mid-February; keep spring through summer exams.
      const month = now.getMonth();
      return (month === 1 && now.getDate() >= 15) || (month >= 2 && month <= 7) ? 'bahar' : 'guz';
    }

    function syncSidebarToCalendarClass(animate = false) {
      expandedSidebarYears = new Set([calendarClassYear]);
      expandedSidebarSemesters = new Set([`${calendarClassYear}-${getCurrentAcademicSemester()}`]);
      if (!animate) return;
      renderSidebarCourses();
      if (window.innerWidth >= 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.getElementById('courseListNav')?.animate?.([
          { opacity: .5, transform: 'translateY(5px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 220, easing: 'ease-out' });
      }
    }

    syncSidebarToCalendarClass();

    function cycleCalendarClass() {
      calendarClassYear = calendarClassYear % 4 + 1;
      try { localStorage.setItem(CALENDAR_CLASS_STORAGE_KEY, String(calendarClassYear)); } catch (_) {}
      calendarActiveDateStr = null;
      clearTimeout(calendarPopoverHideTimer);
      hideCalendarDayPopover();
      refreshCalendarWidget();
      syncSidebarToCalendarClass(true);
      const button = document.getElementById('calendarClassButton');
      button?.classList.add('is-bouncing');
      button?.focus({ preventScroll: true });
    }

    function getCalendarEvents() {
      return getAcademicEvents().filter(event => {
        if (event.courseCode === 'GENEL') {
          return !event.year || Number(event.year) === calendarClassYear;
        }
        return Number(CURRICULUM_COURSES.find(course => course.code === event.courseCode)?.year) === calendarClassYear;
      });
    }

    function getAcademicEvents() {
      if (window.portalEvents) return window.portalEvents();
      const raw = localStorage.getItem('anku_academic_events_v4');
      if (!raw) return [];

      try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        // Remove the old seeded demo dates while preserving other saved events.
        const demoEventId = /^(?:eee-\d{4}-(?:10-15|11-30|12-25)|phy-\d{4}-(?:10-23|11-22|12-05)|mth1-\d{4}-(?:10-28|11-15)|chm-\d{4}-(?:11-16|12-11)|mth2-\d{4}-(?:11-26|12-16)|tur-\d{4}-11-29)$/;
        const events = parsed.filter(event => !demoEventId.test(event.id));
        if (events.length !== parsed.length) {
          localStorage.setItem('anku_academic_events_v4', JSON.stringify(events));
        }
        return events;
      } catch (e) {
        return [];
      }
    }

    function navigateCalendarMonth(delta) {
      calendarViewDate.setMonth(calendarViewDate.getMonth() + delta);
      refreshCalendarWidget();
    }

    function resetCalendarToToday() {
      calendarViewDate = new Date();
      calendarViewDate.setDate(1);
      calendarActiveDateStr = null;
      refreshCalendarWidget();
    }

    function refreshCalendarWidget() {
      const container = document.getElementById('academicCalendarContainer');
      if (container) {
        container.outerHTML = renderCalendarAndAgendaWidget();
        lucide.createIcons();
      }
    }

    function renderCalendarAndAgendaWidget() {
      const allEvents = getCalendarEvents();

      const m1Date = new Date(calendarViewDate);
      const m1Year = m1Date.getFullYear();
      const m1Month = m1Date.getMonth();

      const m2Date = new Date(m1Year, m1Month + 1, 1);
      const m2Year = m2Date.getFullYear();
      const m2Month = m2Date.getMonth();

      const m1Str = `${m1Year}-${String(m1Month + 1).padStart(2, '0')}`;
      const m2Str = `${m2Year}-${String(m2Month + 1).padStart(2, '0')}`;

      const todayDateStr = getTodayDateStr();
      const visibleEvents = allEvents.filter(e => {
        if (!e.date) return false;
        const inVisibleMonths = e.date.startsWith(m1Str) || e.date.startsWith(m2Str);
        const isUpcomingOrToday = e.date >= todayDateStr;
        return inVisibleMonths && isUpcomingOrToday;
      }).sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''));

      return `
        <div id="academicCalendarContainer" class="admincn-card p-4 sm:p-5 select-none overflow-hidden">
          <div class="flex items-center flex-wrap mb-3 gap-3">
            <button id="calendarClassButton" type="button" data-portal-click="cycleCalendarClass" data-portal-click-args="[]" class="portal-btn calendar-class-button" title="Sonraki sınıfa geç" aria-label="${calendarClassYear}. sınıf takvimi. ${calendarClassYear % 4 + 1}. sınıfa geç">
              <i data-lucide="repeat" class="size-3.5"></i><span aria-live="polite">${calendarClassYear}. Sınıf</span>
            </button>
            <button type="button" class="portal-btn" data-portal-click="openAcademicTimetable" data-portal-click-args="[]"><i data-lucide="calendar-days" class="size-3.5"></i> Akademik Takvim</button>
            ${window.portalCanEdit?.() ? '<button type="button" data-portal-click="portalOpenCalendar" data-portal-click-args="[]" class="portal-btn"><i data-lucide="calendar-plus" class="size-3.5"></i> Tarih ekle</button>' : ''}
          </div>
          <div class="flex flex-col lg:flex-row items-stretch gap-5 lg:gap-7">
            
            <!-- LEFT: 2 MONTHS (or 1 on mobile) - No top border line -->
            <div class="flex-1 flex flex-col justify-between">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
                
                <!-- Month 1 -->
                ${renderMonthCalendarApple(m1Year, m1Month, false, allEvents)}

                <!-- Month 2 (hidden on mobile) -->
                <div class="hidden lg:block">
                  ${renderMonthCalendarApple(m2Year, m2Month, true, allEvents)}
                </div>

              </div>
            </div>

            <!-- DIVIDER: Soft, slightly darker separator bar (~3px thick, not too thin) -->
            <div class="hidden lg:block w-[3px] bg-black/15 dark:bg-white/10 rounded-full self-stretch my-1 shrink-0"></div>
            <div class="lg:hidden h-[3px] w-full bg-black/15 dark:bg-white/10 rounded-full my-2 shrink-0"></div>

            <!-- RIGHT: CLEAN MINIMAL EVENT ROWS (fixed box height matching 6-week calendar + scroll slider) -->
            <div class="lg:w-72 xl:w-80 shrink-0 flex flex-col relative self-stretch">
              <div class="lg:absolute lg:inset-0 flex flex-col overflow-y-auto max-h-[170px] sm:max-h-[200px] lg:max-h-none agenda-scroll-container pr-1">
                ${renderMinimalAgendaList(visibleEvents)}
              </div>
            </div>

          </div>
        </div>
      `;
    }

    function renderMonthCalendarApple(year, month, isMonthTwo, allEvents) {
      const todayDateStr = getTodayDateStr();
      const [todayY, todayM, todayD] = todayDateStr.split('-').map(Number);

      const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // 0 = Pzt, 6 = Paz
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const prevMonthDays = new Date(year, month, 0).getDate();

      const monthEvents = allEvents.filter(e => e.date && e.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`));

      // Month Header: Month Name aligned with the first day column
      let headerHtml = '';
      if (!isMonthTwo) {
        headerHtml = `
          <div class="flex items-center justify-between mb-2.5 calendar-month-header select-none">
            <div class="flex items-baseline gap-2">
              <h3 class="text-xl sm:text-2xl font-bold tracking-tight text-[#ff453a] dark:text-[#ff453a]">
                ${MONTH_NAMES_TR[month]}
              </h3>
              <span class="text-xs font-semibold text-muted-foreground/60 font-mono">
                ${year}
              </span>
            </div>

            <div class="flex items-center gap-0.5">
              <button
                type="button"
                data-portal-click="navigateCalendarMonth" data-portal-click-args="[-1]"
                title="Önceki Ay"
                class="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                <i data-lucide="chevron-left" class="size-4"></i>
              </button>
              <button
                type="button"
                data-portal-click="navigateCalendarMonth" data-portal-click-args="[1]"
                title="Sonraki Ay"
                class="lg:hidden size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                <i data-lucide="chevron-right" class="size-4"></i>
              </button>
              <button
                type="button"
                data-portal-click="resetCalendarToToday" data-portal-click-args="[]"
                title="Bugüne Dön"
                class="text-[11px] font-medium px-2 py-0.5 rounded bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition ml-0.5"
              >
                Bugün
              </button>
            </div>
          </div>
        `;
      } else {
        headerHtml = `
          <div class="flex items-center justify-between mb-2.5 calendar-month-header select-none">
            <div class="flex items-baseline gap-2">
              <h3 class="text-xl sm:text-2xl font-bold tracking-tight text-[#ff453a] dark:text-[#ff453a]">
                ${MONTH_NAMES_TR[month]}
              </h3>
              <span class="text-xs font-semibold text-muted-foreground/60 font-mono">
                ${year}
              </span>
            </div>

            <div class="flex items-center gap-0.5">
              <button
                type="button"
                data-portal-click="navigateCalendarMonth" data-portal-click-args="[1]"
                title="Sonraki Ay"
                class="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                <i data-lucide="chevron-right" class="size-4"></i>
              </button>
            </div>
          </div>
        `;
      }

      // Weekdays: M T W T F S S in photo -> P S Ç P C C P (aligned with calendar-month-header)
      const weekdayLetters = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];
      const weekdaysHtml = `
        <div class="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground/60 mb-2 select-none">
          ${weekdayLetters.map((l, idx) => {
            const isWknd = (idx === 5 || idx === 6);
            return `<div class="${isWknd ? 'calendar-weekend-day font-medium' : ''}">${l}</div>`;
          }).join('')}
        </div>
      `;

      // Days Grid
      let daysHtml = '<div class="grid grid-cols-7 gap-y-1 gap-x-1 sm:gap-x-1.5 text-center content-start select-none">';

      // Pad previous month days (Soluk / Faded)
      for (let i = firstDayIndex - 1; i >= 0; i--) {
        const d = prevMonthDays - i;
        daysHtml += `<div class="aspect-square flex items-center justify-center text-xs sm:text-sm font-medium calendar-other-month">${d}</div>`;
      }

      // Current month days
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayEvs = monthEvents.filter(e => e.date === dateStr);
        const isToday = (dateStr === todayDateStr);
        const isPast = (dateStr < todayDateStr);

        if (isToday) {
          // USER REQUEST: "bugünü gösteren günü ayların yazıldığı renkte önemli günlerdeki gibi işaretle"
          const isSelected = (calendarActiveDateStr === dateStr);
          if (dayEvs.length > 0) {
            daysHtml += `
              <div class="aspect-square flex items-center justify-center">
                <button
                  type="button"
                  class="calendar-day-cell size-7 sm:size-7.5 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm transition-transform hover:scale-110 active:scale-95 cursor-pointer ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}"
                  style="background-color: #ff453a; color: #ffffff;"
                  data-date="${dateStr}"
                  data-portal-mouseenter="handleCalendarDayHover" data-portal-mouseenter-args="[{&quot;$context&quot;:&quot;event&quot;}, ${jsArg(dateStr)}]"
                  data-portal-mouseleave="handleCalendarDayLeave" data-portal-mouseleave-args="[]"
                  data-portal-click="handleCalendarDayClick" data-portal-click-args="[{&quot;$context&quot;:&quot;event&quot;}, ${jsArg(dateStr)}]"
                  aria-label="${d} ${MONTH_NAMES_TR[month]} (Bugün), ${dayEvs.map(e => e.title).join(', ')}"
                  title="Bugün: ${dayEvs.map(e => e.title).join(', ')}"
                >
                  ${d}
                </button>
              </div>
            `;
          } else {
            daysHtml += `
              <div class="aspect-square flex items-center justify-center">
                <span
                  class="size-7 sm:size-7.5 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm select-none"
                  style="background-color: #ff453a; color: #ffffff;"
                  title="Bugün (${d} ${MONTH_NAMES_TR[month]})"
                >
                  ${d}
                </span>
              </div>
            `;
          }
        } else if (dayEvs.length > 0) {
          // Event day (not today)
          const firstEv = dayEvs[0];
          const solid = getCourseSolidColor(firstEv.courseCode);
          const isSelected = (calendarActiveDateStr === dateStr);

          // USER REQUEST: "bugünden önceki geçmiş önemli günlerin hepsinin rengi gri bir şekilde soluk gözüksün."
          const badgeClass = isPast ? 'calendar-past-event' : '';
          const badgeStyle = isPast ? '' : `background-color: ${solid.bg}; color: ${solid.text};`;

          daysHtml += `
            <div class="aspect-square flex items-center justify-center">
              <button
                type="button"
                class="calendar-day-cell size-7 sm:size-7.5 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-transform hover:scale-110 active:scale-95 cursor-pointer ${badgeClass} ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}"
                style="${badgeStyle}"
                data-date="${dateStr}"
                data-portal-mouseenter="handleCalendarDayHover" data-portal-mouseenter-args="[{&quot;$context&quot;:&quot;event&quot;}, ${jsArg(dateStr)}]"
                data-portal-mouseleave="handleCalendarDayLeave" data-portal-mouseleave-args="[]"
                data-portal-click="handleCalendarDayClick" data-portal-click-args="[{&quot;$context&quot;:&quot;event&quot;}, ${jsArg(dateStr)}]"
                aria-label="${d} ${MONTH_NAMES_TR[month]}${isPast ? ' (Geçmiş)' : ''}, ${dayEvs.map(e => e.title).join(', ')}"
                title="${d} ${MONTH_NAMES_TR[month]}${isPast ? ' (Geçmiş)' : ''}: ${dayEvs.map(e => e.title).join(', ')}"
              >
                ${d}
              </button>
            </div>
          `;
        } else {
          // Regular day (weekdays bright, weekends softer for instant visual distribution)
          const colIndex = (firstDayIndex + d - 1) % 7;
          const isWeekend = (colIndex === 5 || colIndex === 6);
          const dayTextClass = isWeekend
            ? 'calendar-weekend-day font-medium'
            : 'text-foreground/90 font-semibold';

          daysHtml += `
            <div class="aspect-square flex items-center justify-center">
              <span class="size-7 sm:size-7.5 rounded-full flex items-center justify-center text-xs sm:text-sm ${dayTextClass}">
                ${d}
              </span>
            </div>
          `;
        }
      }

      // Pad next month days to complete 6 weeks (exactly 42 cells = 6 rows)
      const totalRendered = firstDayIndex + daysInMonth;
      const remaining = 42 - totalRendered;
      for (let d = 1; d <= remaining; d++) {
        daysHtml += `<div class="aspect-square flex items-center justify-center text-xs sm:text-sm font-medium calendar-other-month">${d}</div>`;
      }

      daysHtml += '</div>';

      return `
        <div class="flex flex-col">
          ${headerHtml}
          ${weekdaysHtml}
          ${daysHtml}
        </div>
      `;
    }

    function renderMinimalAgendaList(visibleEvents) {
      if (visibleEvents.length === 0) {
        return `
          <div class="py-8 text-center text-xs text-muted-foreground flex-1 flex items-center justify-center">
            Planlanmış sınav veya etkinlik bulunmuyor.
          </div>
        `;
      }

      return `
        <div class="space-y-1.5 flex flex-col justify-start">
          ${visibleEvents.map(ev => {
            const solid = getCourseSolidColor(ev.courseCode);
            const [y, m, d] = ev.date.split('-').map(Number);
            const isHighlighted = (calendarActiveDateStr === ev.date);

            return `
              <div
                id="agenda-item-${esc(ev.id)}"
                data-date="${esc(ev.date)}"
                title="${esc(ev.location || ev.title)}"
                data-portal-click="handleAgendaItemClick" data-portal-click-args="[${jsArg(ev.date)}]"
                class="event-agenda-item flex items-center gap-2.5 py-1.5 px-2.5 rounded-md hover:bg-muted/50 transition cursor-pointer outline-none select-none ${isHighlighted ? 'bg-muted/80 dark:bg-white/10' : ''}"
              >
                <!-- Date solid badge matching calendar circle -->
                <span
                  class="inline-flex items-center justify-center px-2 py-0.5 sm:py-1 rounded-md font-bold text-[11px] shrink-0 leading-snug"
                  style="background-color: ${solid.bg}; color: ${solid.text};"
                >
                  ${d} ${MONTH_NAMES_TR_SHORT[m - 1]}
                </span>

                <!-- Event Title -->
                <span class="font-medium text-foreground truncate flex-1 text-xs sm:text-[13px] leading-snug">
                  ${esc(ev.title)}
                </span>

                <!-- Time (if present) -->
                ${ev.time ? `
                  <span class="text-xs text-muted-foreground font-mono shrink-0">
                    ${esc(ev.time)}
                  </span>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    function handleAgendaItemClick(dateStr) {
      calendarActiveDateStr = (calendarActiveDateStr === dateStr) ? null : dateStr;
      refreshCalendarWidget();
      if (calendarActiveDateStr) {
        setTimeout(() => {
          const targetCell = document.querySelector(`.calendar-day-cell[data-date="${dateStr}"]`);
          if (targetCell) {
            showCalendarDayPopover(targetCell, dateStr, true);
          }
        }, 50);
      } else {
        hideCalendarDayPopover();
      }
    }

    function handleCalendarDayHover(event, dateStr) {
      clearTimeout(calendarPopoverHideTimer);
      showCalendarDayPopover(event.currentTarget, dateStr, false);
    }

    function handleCalendarDayLeave() {
      clearTimeout(calendarPopoverHideTimer);
      if (!calendarActiveDateStr) {
        hideCalendarDayPopover();
      }
    }

    function handleCalendarDayClick(event, dateStr) {
      event.stopPropagation();
      clearTimeout(calendarPopoverHideTimer);
      calendarActiveDateStr = (calendarActiveDateStr === dateStr) ? null : dateStr;
      refreshCalendarWidget();
      if (calendarActiveDateStr) {
        setTimeout(() => {
          const targetCell = document.querySelector(`.calendar-day-cell[data-date="${dateStr}"]`);
          if (targetCell) {
            showCalendarDayPopover(targetCell, dateStr, true);
          }
        }, 50);
      } else {
        hideCalendarDayPopover();
      }
    }

    function showCalendarDayPopover(targetEl, dateStr, isPinned) {
      const popover = document.getElementById('calendarDayPopover');
      if (!popover || !targetEl) return;

      const events = getCalendarEvents().filter(e => e.date === dateStr);
      if (events.length === 0) return;

      const todayDateStr = getTodayDateStr();
      const isPast = (dateStr < todayDateStr);
      const isToday = (dateStr === todayDateStr);

      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      const dayOfWeekIndex = (dateObj.getDay() + 6) % 7;
      const dayOfWeek = DAY_NAMES_TR[dayOfWeekIndex];
      const monthName = MONTH_NAMES_TR[m - 1];

      popover.innerHTML = `
        <div class="p-2.5 space-y-1.5 text-xs">
          <div class="flex items-center justify-between border-b border-border/60 pb-1.5 text-[11px] font-semibold text-muted-foreground">
            <span>${d} ${monthName}, ${dayOfWeek} ${isToday ? '<span class="text-[10px] text-[#ff453a] font-bold ml-1">(Bugün)</span>' : (isPast ? '<span class="text-[10px] text-muted-foreground/75 font-normal ml-1">(Geçmiş)</span>' : '')}</span>
            <button type="button" data-portal-click="hideCalendarDayPopover" data-portal-click-args="[]" class="size-4 flex items-center justify-center text-muted-foreground hover:text-foreground">
              <i data-lucide="x" class="size-3"></i>
            </button>
          </div>
          <div class="space-y-1">
            ${events.map(ev => {
              const solid = isPast ? { bg: '#71717a' } : getCourseSolidColor(ev.courseCode);
              return `
                <div class="flex items-center justify-between gap-2 py-0.5">
                  <span class="font-medium text-foreground truncate flex items-center gap-1.5">
                    <span class="size-2 rounded-full shrink-0" style="background-color: ${solid.bg}"></span>
                    ${esc(ev.title)}
                  </span>
                  ${ev.time ? `<span class="text-[11px] text-muted-foreground font-mono shrink-0">${esc(ev.time)}</span>` : ''}
                </div>
                ${ev.location ? `<p class="text-[11px] text-muted-foreground pl-3.5 pb-1">${esc(ev.location)}</p>` : ''}
              `;
            }).join('')}
          </div>
        </div>
      `;

      popover.classList.add('is-open');
      lucide.createIcons({ root: popover });

      const rect = targetEl.getBoundingClientRect();
      const popoverWidth = Math.min(240, window.innerWidth - 24);
      let left = rect.left + rect.width / 2 - popoverWidth / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - popoverWidth - 12));

      const popoverHeight = popover.offsetHeight || 90;
      let top = rect.top - popoverHeight - 8;
      if (top < 12) {
        top = rect.bottom + 8;
      }

      popover.style.left = `${left}px`;
      popover.style.top = `${top}px`;
    }

    function hideCalendarDayPopover() {
      const popover = document.getElementById('calendarDayPopover');
      if (popover) {
        popover.classList.remove('is-open');
      }
    }

    // Dismiss popover when clicking anywhere outside
    document.addEventListener('click', (e) => {
      const popover = document.getElementById('calendarDayPopover');
      if (popover && popover.classList.contains('is-open')) {
        if (!popover.contains(e.target) && !e.target.closest('.calendar-day-cell')) {
          hideCalendarDayPopover();
        }
      }
    });

    // Automatic live date & time reading and auto-refresh across midnight / tab focus
    let calendarLastKnownDateStr = getTodayDateStr();

    function checkCalendarDateAutoRefresh() {
      const currentDateStr = getTodayDateStr();
      if (currentDateStr !== calendarLastKnownDateStr) {
        calendarLastKnownDateStr = currentDateStr;
        refreshCalendarWidget();
      }
    }

    // Check every 30 seconds for date roll-over (midnight)
    setInterval(checkCalendarDateAutoRefresh, 30000);

    // Also check immediately when tab gains focus or visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkCalendarDateAutoRefresh();
      }
    });
    window.addEventListener('focus', checkCalendarDateAutoRefresh);

    // ================= RENDER HOME VIEW =================
    function renderWelcomeHub() {
      const container = $('courseHubView');
      const courses = (driveTree || []).filter(n => realMime(n) === FOLDER_MIME);
      const allFilesFlat = collectAllFiles(driveTree);

      container.innerHTML = `
        <!-- COMPACT ORANGE HERO BANNER -->
        <div class="portal-hero px-4 py-3 sm:px-5 sm:py-3.5 flex items-center gap-3 sm:gap-4">
          <a
            href="https://www.ankara.edu.tr"
            target="_blank"
            rel="noopener noreferrer"
            title="Ankara Üniversitesi"
            class="portal-hero-logo"
          >
            <img
              src="assets/ankara-uni-logo.png"
              alt="Ankara Üniversitesi Logosu"
              width="44"
              height="44"
              class="size-full object-contain rounded-full"
              data-portal-error="hideImageParent" data-portal-error-args="[{&quot;$context&quot;:&quot;element&quot;}]"
            />
          </a>
          <div class="min-w-0 flex-1">
            <h1 class="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight leading-tight text-white">
              ANKU EEE Portal
            </h1>
            <p class="portal-hero-sub text-xs sm:text-sm mt-0.5 leading-snug">
              Ders materyalleri, sınav tarihleri ve bölüm bilgileri tek yerde.
            </p>
          </div>
        </div>

        <nav aria-label="Hızlı erişim" class="grid grid-cols-2 gap-3 md:hidden">
          <button type="button" data-portal-click="openCourseNavigation" data-portal-click-args="[]" aria-controls="sidebar"
            class="inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-xl border border-border bg-card px-2 py-3 text-xs font-semibold text-foreground shadow-sm hover:bg-muted active:bg-muted transition">
            <i data-lucide="book-open" class="size-4 shrink-0 text-muted-foreground"></i>
            <span class="min-w-0 leading-tight">Dersler</span>
          </button>
          <button type="button" data-portal-click="goToStaffPage" data-portal-click-args="[]"
            class="inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-xl border border-border bg-card px-2 py-3 text-xs font-semibold text-foreground shadow-sm hover:bg-muted active:bg-muted transition">
            <i data-lucide="users" class="size-4 shrink-0 text-muted-foreground"></i>
            <span class="min-w-0 leading-tight">Öğretim Görevlileri</span>
          </button>
        </nav>

        <!-- ACADEMIC CALENDAR & AGENDA WIDGET -->
        ${renderCalendarAndAgendaWidget()}

        <!-- ALL MATERIALS TABLE -->
        <div id="allMaterialsSection" class="admincn-card overflow-hidden">
          <div class="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 class="text-sm font-semibold">Tüm Materyaller</h2>
            <div class="flex flex-wrap items-center gap-2">
              <div class="relative">
                <i data-lucide="search" class="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none"></i>
                <input
                  id="datatableSearchInput"
                  type="text"
                  value="${esc(tableSearchQuery)}"
                  data-portal-input="handleTableSearch" data-portal-input-args="[{&quot;$context&quot;:&quot;value&quot;}]"
                  placeholder="Dosya ara..."
                  class="h-8 w-44 sm:w-56 rounded-md bg-background border border-input pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/40"
                >
              </div>
              <select
                id="datatableCourseSelect"
                data-portal-change="handleTableCourseFilter" data-portal-change-args="[{&quot;$context&quot;:&quot;value&quot;}]"
                class="h-8 rounded-md bg-background border border-input px-2.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring/40"
              >
                <option value="ALL" ${tableCourseFilter === 'ALL' ? 'selected' : ''}>Tüm Dersler</option>
                ${courses.map(c => {
                  const code = c.name.toUpperCase().trim();
                  return `<option value="${esc(code)}" ${tableCourseFilter === code ? 'selected' : ''}>${esc(code)}</option>`;
                }).join('')}
              </select>
            </div>
          </div>

          <div id="admincnDataTableBody">
            ${renderDataTableContent(allFilesFlat)}
          </div>
        </div>
      `;

      lucide.createIcons();
    }

    // ================= RENDER ACADEMIC STAFF HUB (ÖĞRETİM GÖREVLİLERİ) =================
    function getStaffInitials(name) {
      return String(name || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() || '')
        .join('');
    }

    function renderStaffCard(staff, isHighlighted = false) {
      const fullNameWithTitle = `${staff.title} ${staff.name}`.trim();
      const initials = getStaffInitials(staff.name);
      const roleBadge = staff.role ? `
        <span class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${
          staff.role.includes('Bölüm Başkanı')
            ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30'
            : staff.role.includes('Başkan Yardımcısı')
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              : staff.category === 'assistant'
                ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30'
                : 'bg-muted text-muted-foreground border border-border'
        }">
          ${esc(staff.role)}
        </span>
      ` : '';

      const coursesHtml = (staff.courses && staff.courses.length > 0)
        ? staff.courses.map(code => {
            const cMeta = courseMetadata[code] || CURRICULUM_MAP.get(code) || { name: code };
            const theme = getCourseTheme(code);
            return `
              <button
                type="button"
                data-portal-click="selectCourseByCode" data-portal-click-args="[${jsArg(code)}]"
                title="${esc(code)} — ${esc(cMeta.name)} ders sayfasına git"
                class="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/70 hover:bg-primary hover:text-primary-foreground hover:border-primary px-2 py-1 font-mono text-xs font-semibold text-foreground transition cursor-pointer shadow-2xs"
              >
                <i data-lucide="book-open" class="size-3 shrink-0 opacity-75"></i>
                <span>${esc(code)}</span>
              </button>
            `;
          }).join('')
        : `<span class="text-[11px] text-muted-foreground italic">Teknik Seçmeli / Lisansüstü Dersler</span>`;

      return `
        <div
          id="staff-card-${esc(staff.id)}"
          class="admincn-card p-4 sm:p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:border-foreground/20 ${isHighlighted ? 'staff-card-highlighted' : ''}"
        >
          <div class="space-y-3.5">
            <!-- Header: Photo + Title & Name + Role Badge -->
            <div class="flex items-start gap-3.5">
              <div class="relative size-16 sm:size-[68px] rounded-xl overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center shadow-xs">
                ${staff.photo ? `
                  <img
                    src="${esc(safeImage(staff.photo))}"
                    alt="${esc(fullNameWithTitle)}"
                    loading="lazy"
                    class="size-full object-cover object-top"
                    data-portal-error="imageFallback" data-portal-error-args="[{&quot;$context&quot;:&quot;element&quot;}]"
                  />
                  <span class="hidden text-sm font-bold text-muted-foreground select-none">${esc(initials)}</span>
                ` : `
                  <span class="text-sm font-bold text-muted-foreground select-none">${esc(initials)}</span>
                `}
              </div>

              <div class="min-w-0 flex-1 space-y-1">
                <div class="flex flex-wrap items-center gap-1.5">
                  <span class="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">${esc(staff.title)}</span>
                  ${roleBadge}
                </div>
                <h3 class="text-sm sm:text-base font-bold text-foreground leading-snug break-words">
                  ${esc(staff.name)}
                </h3>

                <!-- External Profile Links (AVESİS / Kişisel Sayfa) -->
                <div class="flex flex-wrap items-center gap-2 pt-0.5">
                  ${staff.avesisUrl ? `
                    <a
                      href="${esc(safeLink(staff.avesisUrl))}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition"
                    >
                      <i data-lucide="graduation-cap" class="size-3"></i>
                      <span>AVESİS</span>
                      <i data-lucide="external-link" class="size-2.5"></i>
                    </a>
                  ` : ''}
                  ${staff.personalUrl ? `
                    <a
                      href="${esc(safeLink(staff.personalUrl))}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition"
                    >
                      <i data-lucide="globe" class="size-3"></i>
                      <span>Bölüm Profili</span>
                      <i data-lucide="external-link" class="size-2.5"></i>
                    </a>
                  ` : ''}
                </div>
              </div>
            </div>

            <!-- Contact Info (Email & Phone) -->
            <div class="space-y-1.5 pt-2 border-t border-border text-xs">
              ${staff.email ? `
                <div class="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    data-portal-click="copyInstructorEmail" data-portal-click-args="[${jsArg(staff.email)}, {&quot;$context&quot;:&quot;element&quot;}]"
                    title="E-posta adresini kopyala"
                    class="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-mono text-xs truncate transition group/mail"
                  >
                    <i data-lucide="mail" class="size-3.5 shrink-0 text-muted-foreground group-hover/mail:text-foreground"></i>
                    <span class="email-text truncate">${esc(staff.email)}</span>
                    <i data-lucide="copy" class="size-3 shrink-0 opacity-0 group-hover/mail:opacity-100 transition"></i>
                  </button>
                  <a
                    href="mailto:${esc(staff.email)}"
                    title="E-posta Gönder"
                    class="size-6 inline-flex items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground transition shrink-0"
                  >
                    <i data-lucide="send" class="size-3"></i>
                  </a>
                </div>
              ` : `
                <div class="flex items-center gap-1.5 text-muted-foreground/60 text-xs">
                  <i data-lucide="mail" class="size-3.5 shrink-0"></i>
                  <span>E-posta belirtilmemiş</span>
                </div>
              `}

              ${staff.phone ? `
                <div class="flex items-center gap-1.5 text-muted-foreground font-mono text-[11px]">
                  <i data-lucide="phone" class="size-3.5 shrink-0"></i>
                  <span>${esc(staff.phone)}</span>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Courses Taught / Assisted (Clickable Course Code Badges -> Course Page) -->
          <div class="pt-2.5 border-t border-border space-y-1.5">
            <div class="text-[11px] font-medium text-muted-foreground flex items-center justify-between">
              <span>${staff.category === 'assistant' ? 'Desteklediği Lab / Dersler' : 'Verdiği Dersler'}</span>
              ${staff.courses && staff.courses.length > 0 ? `<span class="font-mono text-[10px]">${staff.courses.length} ders</span>` : ''}
            </div>
            <div class="flex flex-wrap items-center gap-1.5">
              ${coursesHtml}
            </div>
          </div>
        </div>
      `;
    }

    window.setStaffCategoryFilter = function(cat) {
      staffCategoryFilter = cat;
      renderStaffHub(null);
    };

    window.handleStaffSearch = function(val) {
      staffSearchQuery = val;
      const gridContainer = $('staffCardsSectionsContainer');
      if (gridContainer) {
        gridContainer.innerHTML = renderStaffSectionsContent(highlightedStaffId);
        lucide.createIcons();
      }
    };

    function renderStaffSectionsContent(highlightId = null) {
      const q = staffSearchQuery.trim().toLowerCase();

      const filteredStaff = STAFF_DATA.filter(s => {
        if (staffCategoryFilter === 'faculty' && s.category !== 'faculty') return false;
        if (staffCategoryFilter === 'assistant' && s.category !== 'assistant') return false;
        if (staffCategoryFilter === 'parttime' && s.category !== 'parttime' && s.category !== 'service') return false;

        if (!q) return true;
        const full = `${s.title} ${s.name} ${s.role} ${s.email} ${(s.courses || []).join(' ')}`.toLowerCase();
        return full.includes(q);
      });

      if (filteredStaff.length === 0) {
        return `
          <div class="admincn-card p-10 text-center text-xs text-muted-foreground">
            Arama kriterlerine uygun öğretim görevlisi bulunamadı.
          </div>
        `;
      }

      const groups = [
        {
          key: 'faculty',
          title: 'Bölüm Öğretim Üyeleri',
          subtitle: 'Bölüm Başkanı, Bölüm Başkan Yardımcıları ve Kadrolu Öğretim Üyeleri',
          icon: 'award',
          items: filteredStaff.filter(s => s.category === 'faculty')
        },
        {
          key: 'assistant',
          title: 'Araştırma Görevlileri',
          subtitle: 'Laboratuvar, uygulama ve araştırma görevlileri',
          icon: 'microscope',
          items: filteredStaff.filter(s => s.category === 'assistant')
        },
        {
          key: 'parttime',
          title: 'Yarı Zamanlı & Servis Dersleri Öğretim Elemanları',
          subtitle: 'Görevli öğretim üyeleri, yarı zamanlı akademisyenler ve fakülte servis dersi hocaları',
          icon: 'briefcase',
          items: filteredStaff.filter(s => s.category === 'parttime' || s.category === 'service')
        }
      ].filter(g => g.items.length > 0);

      return groups.map(group => `
        <section class="space-y-3">
          <div class="flex items-center justify-between border-b border-border pb-2">
            <div>
              <h2 class="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                <i data-lucide="${group.icon}" class="size-4 text-muted-foreground"></i>
                <span>${esc(group.title)}</span>
                <span class="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-mono font-medium text-muted-foreground">${group.items.length}</span>
              </h2>
              <p class="text-xs text-muted-foreground mt-0.5">${esc(group.subtitle)}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            ${group.items.map(s => renderStaffCard(s, s.id === highlightId)).join('')}
          </div>
        </section>
      `).join('');
    }

    function renderStaffHub(highlightId = null) {
      const container = $('courseHubView');
      if (!container) return;

      const counts = {
        ALL: STAFF_DATA.length,
        faculty: STAFF_DATA.filter(s => s.category === 'faculty').length,
        assistant: STAFF_DATA.filter(s => s.category === 'assistant').length,
        parttime: STAFF_DATA.filter(s => s.category === 'parttime' || s.category === 'service').length
      };

      const filterTabs = [
        { id: 'ALL', label: 'Tümü', count: counts.ALL },
        { id: 'faculty', label: 'Öğretim Üyeleri', count: counts.faculty },
        { id: 'assistant', label: 'Araştırma Görevlileri', count: counts.assistant },
        { id: 'parttime', label: 'Yarı Zamanlı & Servis', count: counts.parttime }
      ];

      container.innerHTML = `
        <div class="admincn-card p-3.5 sm:p-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <h1 class="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
              Öğretim Görevlileri ve Akademik Kadro
            </h1>

            <div class="flex items-center gap-2 shrink-0">
              <div class="relative flex-1 sm:flex-initial">
                <i data-lucide="search" class="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                <input
                  id="staffSearchInput"
                  type="text"
                  value="${esc(staffSearchQuery)}"
                  data-portal-input="handleStaffSearch" data-portal-input-args="[{&quot;$context&quot;:&quot;value&quot;}]"
                  placeholder="İsim, ünvan, ders kodu ara..."
                  class="h-8 w-full sm:w-56 rounded-md bg-background border border-input pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/40"
                />
              </div>
              <a
                href="https://eee.ankara.edu.tr/tr/akademik-personel/"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex h-8 items-center justify-center gap-1.5 px-3 rounded-md border border-border bg-secondary/60 hover:bg-muted text-xs font-medium text-foreground transition shrink-0"
              >
                <i data-lucide="external-link" class="size-3.5"></i>
                <span>Resmi Sayfa</span>
              </a>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-border">
            ${filterTabs.map(tab => `
              <button
                type="button"
                data-portal-click="setStaffCategoryFilter" data-portal-click-args="[${jsArg(tab.id)}]"
                class="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition ${
                  staffCategoryFilter === tab.id
                    ? 'bg-primary text-primary-foreground shadow-2xs'
                    : 'bg-secondary/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }"
              >
                <span>${esc(tab.label)}</span>
                <span class="rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                  staffCategoryFilter === tab.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-background/80 text-muted-foreground'
                }">${tab.count}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div id="staffCardsSectionsContainer" class="space-y-6">
          ${renderStaffSectionsContent(highlightId)}
        </div>
      `;

      lucide.createIcons();

      if (highlightId) {
        setTimeout(() => {
          const cardEl = document.getElementById(`staff-card-${highlightId}`);
          if (cardEl) {
            cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            cardEl.classList.remove('staff-card-highlighted');
            void cardEl.offsetWidth;
            cardEl.classList.add('staff-card-highlighted');
          }
        }, 80);
      }
    }

    function renderDataTableContent(allFilesFlat) {
      const q = tableSearchQuery.trim().toLowerCase();
      const filtered = allFilesFlat.filter(item => {
        if (tableCourseFilter !== 'ALL' && item.courseCode !== tableCourseFilter) return false;
        if (q && !item.node.name.toLowerCase().includes(q) && !item.courseCode.toLowerCase().includes(q) && !item.folderPath.toLowerCase().includes(q)) {
          return false;
        }
        return true;
      });

      const totalCount = filtered.length;
      const totalPages = Math.max(1, Math.ceil(totalCount / tablePageSize));
      if (tablePageIndex >= totalPages) tablePageIndex = Math.max(0, totalPages - 1);

      const startIdx = tablePageIndex * tablePageSize;
      const pageItems = filtered.slice(startIdx, startIdx + tablePageSize);

      return `
        <div class="w-full overflow-x-auto border-b border-border">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-border text-muted-foreground text-xs">
                <th class="h-10 px-4 font-medium">Dosya</th>
                <th class="h-10 px-4 font-medium">Ders</th>
                <th class="h-10 px-4 font-medium hidden md:table-cell">Klasör</th>
                <th class="h-10 px-4 font-medium">Tür</th>
                <th class="h-10 px-4 font-medium hidden sm:table-cell">Boyut</th>
                <th class="h-10 px-4 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              ${pageItems.length > 0 ? pageItems.map(({ node, courseCode, folderPath }) => {
                const kind = getFileKind(node);
                const conf = KIND_CONFIG[kind] || KIND_CONFIG.file;
                return `
                  <tr class="hover:bg-muted/40 transition">
                    <td class="px-4 py-3">
                      <div data-portal-click="openViewerModal" data-portal-click-args="[${jsArg(node.id)}, ${jsArg(courseCode)}]" class="flex items-center gap-2.5 cursor-pointer group">
                        <div class="size-8 rounded-sm bg-primary-soft text-primary flex items-center justify-center shrink-0">
                          <i data-lucide="${conf.icon}" class="size-4"></i>
                        </div>
                        <span class="text-card-foreground text-xs sm:text-sm font-medium truncate max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-2xl 2xl:max-w-4xl group-hover:underline" title="${esc(node.name)}">${esc(node.name)}</span>
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <span class="rounded-sm bg-primary-soft text-primary px-2 py-0.5 text-xs font-mono font-medium">${esc(courseCode)}</span>
                    </td>
                    <td class="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">
                      <span class="truncate block max-w-[200px] lg:max-w-[320px] xl:max-w-[480px]">${esc(folderPath)}</span>
                    </td>
                    <td class="px-4 py-3">
                      <span class="rounded-sm bg-secondary text-secondary-foreground px-2 py-0.5 text-xs font-medium">${conf.badge}</span>
                    </td>
                    <td class="px-4 py-3 hidden sm:table-cell font-mono text-xs text-muted-foreground">
                      ${formatFileSize(node.size)}
                    </td>
                    <td class="px-4 py-3 text-right">
                      <div class="inline-flex items-center justify-end gap-1">
                        <button
                          data-portal-click="openViewerModal" data-portal-click-args="[${jsArg(node.id)}, ${jsArg(courseCode)}]"
                          class="h-7 px-2.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition"
                        >
                          Aç
                        </button>
                        ${kind !== 'youtube' ? `
                          <a
                            href="https://drive.google.com/uc?export=download&id=${realId(node)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="İndir"
                            class="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition"
                          >
                            <i data-lucide="download" class="size-3.5"></i>
                          </a>
                        ` : ''}
                        <a
                          href="${esc(safeLink(node.webViewLink || `https://drive.google.com/file/d/${encodeURIComponent(realId(node))}/view`))}"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Drive"
                          class="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition"
                        >
                          <i data-lucide="external-link" class="size-3.5"></i>
                        </a>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('') : `
                <tr>
                  <td colspan="6" class="h-20 text-center text-muted-foreground text-xs">
                    Sonuç bulunamadı.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between gap-3 px-5 py-3">
          <span class="text-muted-foreground text-xs font-mono">
            ${totalCount === 0 ? '0' : `${startIdx + 1}-${Math.min(startIdx + tablePageSize, totalCount)} / ${totalCount}`}
          </span>
          <div class="flex items-center gap-1">
            <button
              type="button"
              data-portal-click="changeTablePage" data-portal-click-args="[${tablePageIndex - 1}]"
              ${tablePageIndex <= 0 ? 'disabled' : ''}
              class="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-foreground hover:bg-muted disabled:pointer-events-none disabled:opacity-40 transition"
            >
              <i data-lucide="chevron-left" class="size-3.5"></i>
              <span>Önceki</span>
            </button>
            <span class="px-2 text-xs font-mono text-muted-foreground">
              ${tablePageIndex + 1} / ${totalPages}
            </span>
            <button
              type="button"
              data-portal-click="changeTablePage" data-portal-click-args="[${tablePageIndex + 1}]"
              ${tablePageIndex >= totalPages - 1 ? 'disabled' : ''}
              class="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-foreground hover:bg-muted disabled:pointer-events-none disabled:opacity-40 transition"
            >
              <span>Sonraki</span>
              <i data-lucide="chevron-right" class="size-3.5"></i>
            </button>
          </div>
        </div>
      `;
    }

    window.handleTableSearch = function(val) {
      tableSearchQuery = val;
      tablePageIndex = 0;
      const body = $('admincnDataTableBody');
      if (body && driveTree) {
        body.innerHTML = renderDataTableContent(collectAllFiles(driveTree));
        lucide.createIcons();
      }
    };

    window.handleTableCourseFilter = function(val) {
      tableCourseFilter = val;
      tablePageIndex = 0;
      const body = $('admincnDataTableBody');
      if (body && driveTree) {
        body.innerHTML = renderDataTableContent(collectAllFiles(driveTree));
        lucide.createIcons();
      }
    };

    window.changeTablePage = function(newIndex) {
      tablePageIndex = Math.max(0, newIndex);
      const body = $('admincnDataTableBody');
      if (body && driveTree) {
        body.innerHTML = renderDataTableContent(collectAllFiles(driveTree));
        lucide.createIcons();
      }
    };

    // ================= RENDER COURSE HUB =================
    function renderCourseHub(courseId) {
      const container = $('courseHubView');
      const courseNode = getCourseNodeById(courseId);
      if (!courseNode) return;

      const code = courseNode.name.toUpperCase().trim();
      const curr = CURRICULUM_MAP.get(code);
      const hasStudyMode = (code === 'MTH0101' && typeof window !== 'undefined' && Boolean(window.CALCULUS_STUDY_DATA));
      const meta = courseMetadata[code] || {
        name: curr?.name || courseNode.name,
        instructorIds: curr?.instructorIds || [],
        assistantIds: curr?.assistantIds || [],
        instructor: '',
        email: '',
        credits: curr?.credits || '',
        icon: curr?.icon || 'book-open',
        links: []
      };

      const totalFiles = countFilesInFolder(courseNode.children);
      const folderId = parseFolderId(settings.folder);
      const driveFolderUrl = courseNode.isVirtual
        ? (folderId ? `https://drive.google.com/drive/folders/${folderId}` : 'https://drive.google.com')
        : `https://drive.google.com/drive/folders/${realId(courseNode)}`;

      const subfolders = (courseNode.children || []).filter(n => realMime(n) === FOLDER_MIME);
      const rootFiles = (courseNode.children || []).filter(n => realMime(n) !== FOLDER_MIME && !/^(info|bilgi)\.(txt|json)$/i.test(n.name));

      const weekFolders = [];
      const catFolders = [];

      subfolders.forEach(sub => {
        const nameLower = sub.name.toLowerCase();
        if (/(hafta|week)\s*0?(\d+)/i.test(nameLower)) {
          const match = nameLower.match(/(hafta|week)\s*0?(\d+)/i);
          weekFolders.push({ ...sub, weekNum: parseInt(match[2], 10) });
        } else {
          catFolders.push(sub);
        }
      });

      weekFolders.sort((a, b) => a.weekNum - b.weekNum);

      // Course-related links shown as a card grid under the banner
      const courseLinkCardsHtml = (meta.links || []).map(link => {
        let iconName = link.icon || 'external-link';
        if (link.url.includes('youtube.com') || link.url.includes('youtu.be') || iconName === 'youtube') iconName = 'play';
        const faviconUrl = getLinkFavicon(link);

        return `
          <a
            href="${esc(safeLink(link.url))}"
            target="_blank"
            rel="noopener noreferrer"
            title="${esc(link.title)}"
            class="group flex h-10 min-w-0 items-center gap-2 rounded-lg border border-border bg-card px-2.5 sm:px-3 text-xs font-medium text-foreground shadow-sm hover:bg-muted transition"
          >
            <img
              src="${esc(safeImage(faviconUrl))}"
              alt=""
              width="16"
              height="16"
              class="size-4 shrink-0 rounded-sm object-contain"
              loading="eager"
              data-portal-error="imageFallback" data-portal-error-args="[{&quot;$context&quot;:&quot;element&quot;}]"
            />
            <i data-lucide="${esc(PortalSecurity.icon(iconName))}" class="size-4 shrink-0 text-muted-foreground group-hover:text-foreground transition hidden"></i>
            <span class="flex-1 truncate">${esc(link.title)}</span>
          </a>
        `;
      }).join('');
      const courseLinksSectionHtml = courseLinkCardsHtml ? `
        <nav aria-label="Ders bağlantıları" class="!mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          ${courseLinkCardsHtml}
        </nav>
      ` : '';

      const bannerUrl = Number(curr?.year || meta.year) === 1 ? '' : (meta.banner || DEFAULT_COURSE_METADATA[code]?.banner || '');
      const bannerPos = meta.bannerPos || DEFAULT_COURSE_METADATA[code]?.bannerPos || 'center center';
      const bannerRatioRaw = Number(meta.bannerRatio || DEFAULT_COURSE_METADATA[code]?.bannerRatio) || (16 / 9);
      const bannerRatio = Math.max(bannerRatioRaw, 0.8);
      const theme = getCourseTheme(code);

      // Build clickable instructor & assistant pills from STAFF_DATA (single source of truth)
      const instructorStaffList = (meta.instructorIds || curr?.instructorIds || [])
        .map(id => STAFF_MAP.get(id))
        .filter(Boolean);
      const assistantStaffList = (meta.assistantIds || curr?.assistantIds || [])
        .map(id => STAFF_MAP.get(id))
        .filter(Boolean);

      const yearSemLabel = curr ? `${curr.year}. Sınıf • ${curr.semester === 'guz' ? 'Güz Dönemi' : 'Bahar Dönemi'}` : '';

      const renderStaffLinkPill = (staff, isAssistant = false) => {
        const fullName = `${staff.title} ${staff.name}`.trim();
        const initials = getStaffInitials(staff.name);
        return `
          <div class="inline-flex items-center gap-1 rounded-md border border-zinc-900/10 dark:border-white/15 bg-white/85 dark:bg-white/10 p-0.5 pr-2 text-xs text-zinc-800 dark:text-zinc-100 shadow-2xs">
            <button
              type="button"
              data-portal-click="goToStaffPage" data-portal-click-args="[${jsArg(staff.id)}]"
              title="${esc(fullName)} — Öğretim Görevlileri sayfasında kartına git"
              class="inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 font-medium hover:bg-zinc-900/5 dark:hover:bg-white/10 hover:text-orange-600 dark:hover:text-orange-400 transition cursor-pointer"
            >
              <span class="size-5 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-700 inline-flex items-center justify-center shrink-0">
                ${staff.photo ? `
                  <img src="${esc(safeImage(staff.photo))}" alt="" class="size-full object-cover object-top" data-portal-error="hideImage" data-portal-error-args="[{&quot;$context&quot;:&quot;element&quot;}]" />
                ` : `<span class="text-[9px] font-bold">${esc(initials)}</span>`}
              </span>
              ${isAssistant ? `<span class="text-[10px] font-semibold text-sky-600 dark:text-sky-400">Asistan:</span>` : ''}
              <span class="underline decoration-zinc-400/60 underline-offset-2">${esc(fullName)}</span>
              <i data-lucide="arrow-up-right" class="size-3 opacity-70"></i>
            </button>
            ${staff.email ? `
              <button
                type="button"
                data-portal-click="copyInstructorEmail" data-portal-click-args="[${jsArg(staff.email)}, {&quot;$context&quot;:&quot;element&quot;}]"
                title="E-postayı Kopyala: ${esc(staff.email)}"
                class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-300 hover:bg-zinc-900/5 dark:hover:bg-white/10 hover:text-zinc-950 dark:hover:text-white transition border-l border-zinc-900/10 dark:border-white/10"
              >
                <i data-lucide="mail" class="size-3"></i>
                <span class="email-text hidden sm:inline">${esc(staff.email)}</span>
              </button>
            ` : ''}
          </div>
        `;
      };

      let staffPillsHtml = '';
      if (instructorStaffList.length > 0 || assistantStaffList.length > 0) {
        staffPillsHtml = `
          <div class="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
            ${instructorStaffList.map(s => renderStaffLinkPill(s, false)).join('')}
            ${assistantStaffList.map(s => renderStaffLinkPill(s, true)).join('')}
          </div>
        `;
      } else if (meta.instructor || meta.email) {
        staffPillsHtml = `
          <div class="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
            ${meta.instructor ? `
              <div class="inline-flex items-center gap-1.5 rounded-md border border-zinc-900/10 dark:border-white/15 bg-white/80 dark:bg-white/10 px-2.5 py-1 font-medium text-zinc-800 dark:text-zinc-100">
                <i data-lucide="user" class="size-3.5 text-zinc-600 dark:text-zinc-300"></i>
                <span>${esc(meta.instructor)}</span>
              </div>
            ` : ''}
            ${meta.email ? `
              <button
                data-portal-click="copyInstructorEmail" data-portal-click-args="[${jsArg(meta.email)}, {&quot;$context&quot;:&quot;element&quot;}]"
                title="Kopyala"
                class="inline-flex items-center gap-1.5 rounded-md border border-zinc-900/10 dark:border-white/15 bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 px-2.5 py-1 font-mono text-xs text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition"
              >
                <i data-lucide="mail" class="size-3.5"></i>
                <span class="email-text">${esc(meta.email)}</span>
              </button>
            ` : ''}
          </div>
        `;
      }

      container.innerHTML = `
        <div
          class="course-hero-banner p-5 sm:p-6"
          style="--course-border: ${theme.border}; --course-glow: ${theme.glow}; --course-tint: ${theme.tint};"
        >
          ${bannerUrl ? `
            <div class="course-hero-banner-media" style="--banner-ratio: ${bannerRatio};" aria-hidden="true">
              <img
                src="${esc(safeImage(bannerUrl))}"
                alt="${esc(meta.name)} Banner"
                fetchpriority="high"
                class="course-hero-banner-img"
                style="object-position: ${esc(bannerPos)};"
                data-portal-load="fitBanner" data-portal-load-args="[{&quot;$context&quot;:&quot;element&quot;}]"
              />
              <div class="course-hero-banner-vignette"></div>
            </div>
          ` : ''}

          <div class="relative z-10 flex flex-col gap-4 max-w-full ${bannerUrl ? 'sm:max-w-[68%] xl:max-w-[72%]' : ''}">
            <div class="flex items-start gap-3.5">
              <div
                class="course-hero-icon size-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                style="background-color: ${theme.badgeBg}; color: ${theme.accent}; border: 1px solid ${theme.badgeBorder};"
              >
                <i data-lucide="${esc(PortalSecurity.icon(meta.icon || 'book-open'))}" class="size-5"></i>
              </div>
              <div class="space-y-3 min-w-0 flex-1">
                <div class="space-y-1.5 min-w-0">
                  <div class="flex flex-wrap items-center gap-1.5">
                    <span
                      class="rounded-sm px-2 py-0.5 font-mono text-xs font-semibold"
                      style="background-color: ${theme.accent}; color: #09090b;"
                    >${esc(code)}</span>
                    ${yearSemLabel ? `<span class="rounded-sm bg-zinc-900/5 dark:bg-white/10 text-zinc-700 dark:text-zinc-200 border border-zinc-900/10 dark:border-white/10 px-2 py-0.5 text-xs font-medium">${esc(yearSemLabel)}</span>` : ''}
                    ${meta.credits ? `<span class="rounded-sm bg-zinc-900/5 dark:bg-white/10 text-zinc-700 dark:text-zinc-200 border border-zinc-900/10 dark:border-white/10 px-2 py-0.5 text-xs font-medium">${esc(meta.credits)}</span>` : ''}
                    <span class="rounded-sm bg-zinc-900/5 dark:bg-white/10 text-zinc-700 dark:text-zinc-200 border border-zinc-900/10 dark:border-white/10 px-2 py-0.5 text-xs font-medium">${totalFiles} dosya</span>
                  </div>
                  <h1 class="text-lg sm:text-xl font-semibold tracking-tight text-zinc-950 dark:text-white drop-shadow-sm">${esc(meta.name)}</h1>

                  ${staffPillsHtml}
                </div>

                <div class="flex flex-wrap items-center gap-2 pt-0.5">
                  <div class="relative w-44 sm:w-52">
                    <i data-lucide="search" class="size-3.5 text-zinc-500 dark:text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none"></i>
                    <input
                      type="text"
                      value="${esc(courseLocalSearch)}"
                      data-portal-input="filterCourseMaterials" data-portal-input-args="[{&quot;$context&quot;:&quot;value&quot;}]"
                      placeholder="Ders içinde ara..."
                      class="h-8 w-full rounded-md bg-white/85 dark:bg-white/10 border border-zinc-900/15 dark:border-white/15 pl-8 pr-3 text-xs text-zinc-950 dark:text-white placeholder:text-zinc-400 outline-none focus:ring-2 transition"
                      style="--tw-ring-color: ${theme.border};"
                    >
                  </div>
                  <a
                    href="${driveFolderUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex h-8 items-center gap-1.5 px-2.5 text-xs font-medium rounded-md bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 text-zinc-800 dark:text-zinc-100 border border-zinc-900/10 dark:border-white/15 transition"
                  >
                    <i data-lucide="folder-symlink" class="size-3.5"></i>
                    <span>Drive</span>
                  </a>
                  <button
                    data-portal-click="openEditCourseModal" data-portal-click-args="[${jsArg(code)}]"
                    title="Düzenle"
                    class="${window.portalCanEdit?.() ? '' : 'hidden'} inline-flex size-8 items-center justify-center rounded-md border border-zinc-900/10 dark:border-white/15 bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition"
                  >
                    <i data-lucide="edit-3" class="size-3.5"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        ${courseLinksSectionHtml}

        ${hasStudyMode ? `
          <div class="flex items-center justify-between flex-wrap gap-3 pt-1 border-b border-border pb-3">
            <div class="inline-flex p-1 rounded-xl bg-muted/60 border border-border text-xs font-medium">
              <button
                type="button"
                data-portal-click="setCourseActiveTab" data-portal-click-args="[&quot;materials&quot;]"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${activeCourseTab === 'materials' ? 'bg-background text-foreground shadow-2xs font-semibold' : 'text-muted-foreground hover:text-foreground'}"
              >
                <i data-lucide="folder" class="size-3.5"></i>
                <span>Ders Materyalleri</span>
              </button>
              <button
                type="button"
                data-portal-click="setCourseActiveTab" data-portal-click-args="[&quot;study&quot;]"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${activeCourseTab === 'study' ? 'bg-primary text-primary-foreground shadow-2xs font-semibold' : 'text-muted-foreground hover:text-foreground'}"
              >
                <i data-lucide="graduation-cap" class="size-3.5"></i>
                <span>Adım Adım Öğren</span>
                <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${activeCourseTab === 'study' ? 'bg-white/20 text-white' : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'}">Beta</span>
              </button>
            </div>
            ${activeCourseTab === 'study' ? `
              <div class="flex items-center gap-2 text-xs text-muted-foreground">
                <span class="inline-flex items-center gap-1.5 font-medium">
                  <i data-lucide="book-open-check" class="size-3.5 text-blue-500"></i>
                  <span>Kaynak: Paul's Online Math Notes</span>
                </span>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <div id="courseMaterialsContainer" class="space-y-6">
          ${(hasStudyMode && activeCourseTab === 'study')
            ? renderCalculusStudyHub(code)
            : renderCourseMaterialsSections(code, meta, weekFolders, catFolders, rootFiles, totalFiles, driveFolderUrl)}
        </div>
      `;

      lucide.createIcons();
      if (hasStudyMode && activeCourseTab === 'study') {
        triggerMathRendering(container);
      }
    }

    // ================= CALCULUS STUDY HUB (PAUL'S NOTES) =================
    function renderCalculusStudyHub(code) {
      const data = typeof window !== 'undefined' ? window.CALCULUS_STUDY_DATA : null;
      if (!data) {
        return `
          <div class="p-8 text-center rounded-xl border border-dashed border-border bg-card">
            <p class="text-sm text-muted-foreground">Calculus öğrenme verisi yüklenemedi.</p>
          </div>
        `;
      }

      const allTopics = data.weeks.flatMap(w => w.topics);
      const currentTopic = allTopics.find(t => t.id === activeStudyTopicId) || allTopics[0];
      const currentTopicIndex = allTopics.findIndex(t => t.id === currentTopic.id);
      const prevTopic = currentTopicIndex > 0 ? allTopics[currentTopicIndex - 1] : null;
      const nextTopic = currentTopicIndex < allTopics.length - 1 ? allTopics[currentTopicIndex + 1] : null;

      const totalTopics = allTopics.length;
      const completedCount = allTopics.filter(t => completedStudyTopics.has(t.id)).length;
      const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
      const isTopicDone = completedStudyTopics.has(currentTopic.id);

      const userQuizChoice = studyQuizAnswers[currentTopic.id];
      const hasAnsweredQuiz = (typeof userQuizChoice === 'number');
      const isQuizCorrect = hasAnsweredQuiz && userQuizChoice === currentTopic.quiz.correctIndex;

      // Weeks & Topics Navigator List
      const weeksNavHtml = data.weeks.map(week => {
        const weekCompletedCount = week.topics.filter(t => completedStudyTopics.has(t.id)).length;
        const weekTotal = week.topics.length;
        return `
          <div class="space-y-1.5 pt-3 first:pt-1">
            <div class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 flex items-center justify-between">
              <span class="truncate">${esc(week.title.split(':')[0])}</span>
              <span class="text-[10px] font-mono shrink-0 font-semibold">${weekCompletedCount}/${weekTotal}</span>
            </div>
            <div class="space-y-1">
              ${week.topics.map(topic => {
                const isSelected = topic.id === currentTopic.id;
                const isDone = completedStudyTopics.has(topic.id);
                return `
                  <button
                    type="button"
                    data-portal-click="selectStudyTopic" data-portal-click-args="[${jsArg(topic.id)}]"
                    class="w-full text-left flex items-start gap-2.5 p-2 rounded-lg text-xs transition group cursor-pointer ${
                      isSelected
                        ? 'bg-blue-500/15 dark:bg-blue-500/25 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/30 shadow-2xs'
                        : 'hover:bg-muted text-foreground/80 hover:text-foreground border border-transparent'
                    }"
                  >
                    <div class="mt-0.5 shrink-0">
                      <div class="size-4 rounded-full flex items-center justify-center text-[9px] ${
                        isDone
                          ? 'bg-emerald-500 text-white'
                          : isSelected
                            ? 'border-2 border-blue-500 text-blue-500'
                            : 'border border-muted-foreground/40 text-muted-foreground'
                      }">
                        ${isDone ? '<i data-lucide="check" class="size-3 stroke-[3]"></i>' : ''}
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="truncate font-medium leading-tight">${esc(topic.title)}</div>
                      <div class="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <span>${esc(topic.readTime)}</span>
                        <span>•</span>
                        <span class="truncate opacity-80">${esc(topic.subTitle)}</span>
                      </div>
                    </div>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('');

      // Key Formulas
      const formulasHtml = (currentTopic.keyFormulas || []).map(f => `
        <div class="p-3.5 sm:p-4 rounded-xl border border-border bg-card/70 space-y-2">
          <div class="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
            <i data-lucide="sigma" class="size-3.5"></i>
            <span>${esc(f.label)}</span>
          </div>
          <div class="math-content overflow-x-auto py-1 text-center font-mono text-sm sm:text-base text-foreground">
            $$${f.latex}$$
          </div>
          ${f.desc ? `<p class="text-xs text-muted-foreground leading-relaxed">${esc(f.desc)}</p>` : ''}
        </div>
      `).join('');

      // Critical Notes / Pitfalls
      const notesHtml = (currentTopic.notes || []).map(note => `
        <div class="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-foreground/90">
          <i data-lucide="alert-circle" class="size-4 text-amber-500 shrink-0 mt-0.5"></i>
          <span class="leading-relaxed math-content">${esc(note)}</span>
        </div>
      `).join('');

      // Worked Examples (Paul Dawkins' Style: click to expand step-by-step solution)
      const examplesHtml = (currentTopic.examples || []).map(ex => {
        const isSolOpen = openStudyExamples.has(ex.id);
        const isHintOpen = openStudyHints.has(ex.id);
        return `
          <div class="border border-border rounded-xl bg-card overflow-hidden shadow-2xs transition">
            <div class="p-4 sm:p-5 space-y-3">
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono">
                  ${esc(ex.title)}
                </span>
                ${ex.hint ? `
                  <button
                    type="button"
                    data-portal-click="toggleStudyHint" data-portal-click-args="[${jsArg(ex.id)}]"
                    class="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 transition cursor-pointer"
                  >
                    <i data-lucide="lightbulb" class="size-3.5"></i>
                    <span>${isHintOpen ? 'İpucunu Kapat' : 'İpucu Al'}</span>
                  </button>
                ` : ''}
              </div>

              <!-- Question statement (LaTeX) -->
              <div class="text-sm sm:text-base font-medium text-foreground leading-relaxed math-content pt-1">
                ${esc(ex.question)}
              </div>

              <!-- Hint box -->
              ${isHintOpen ? `
                <div class="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 math-content">
                  <i data-lucide="lightbulb" class="size-4 text-amber-500 shrink-0 mt-0.5"></i>
                  <div class="space-y-1">
                    <span class="font-semibold">İpucu / Strateji:</span>
                    <div class="leading-relaxed">${esc(ex.hint)}</div>
                  </div>
                </div>
              ` : ''}

              <!-- Expand/Collapse Button (Paul's style) -->
              <div class="pt-2">
                <button
                  type="button"
                  data-portal-click="toggleStudyExample" data-portal-click-args="[${jsArg(ex.id)}]"
                  class="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isSolOpen
                      ? 'bg-muted text-foreground hover:bg-muted/80'
                      : 'bg-primary text-primary-foreground hover:opacity-90 shadow-2xs'
                  }"
                >
                  <i data-lucide="${isSolOpen ? 'chevron-up' : 'chevron-down'}" class="size-4"></i>
                  <span>${isSolOpen ? 'Çözümü Gizle' : 'Çözümü Göster (Adım Adım)'}</span>
                </button>
              </div>
            </div>

            <!-- Solution Steps (Expanded) -->
            ${isSolOpen ? `
              <div class="border-t border-border bg-muted/20 p-4 sm:p-5 space-y-4">
                <div class="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <i data-lucide="check-circle-2" class="size-3.5 text-emerald-500"></i>
                  <span>Adım Adım Çözüm</span>
                </div>

                <div class="space-y-4 pl-1 sm:pl-2">
                  ${ex.steps.map((step, sIdx) => `
                    <div class="relative pl-6 pb-2 border-l-2 border-blue-500/40 last:border-transparent last:pb-0">
                      <div class="absolute -left-[9px] top-0 size-4 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                        ${sIdx + 1}
                      </div>
                      <div class="space-y-1">
                        <h4 class="text-xs sm:text-sm font-semibold text-foreground">${esc(step.title)}</h4>
                        <div class="text-xs sm:text-sm text-foreground/90 whitespace-pre-line leading-relaxed math-content">
                          ${esc(step.content)}
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>

                <!-- Final Answer Callout -->
                <div class="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-3 flex-wrap">
                  <div class="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    Nihai Sonuç:
                  </div>
                  <div class="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-300 math-content">
                    ${esc(ex.answer)}
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');

      // Quiz Checkpoint
      const quiz = currentTopic.quiz;
      const quizHtml = quiz ? `
        <div class="border border-border rounded-xl bg-card p-4 sm:p-5 space-y-4 shadow-2xs">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div class="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <i data-lucide="help-circle" class="size-4 text-primary"></i>
              <span>Kendini Sına (Kavrama Sorusu)</span>
            </div>
            ${hasAnsweredQuiz ? `
              <span class="text-xs font-semibold px-2 py-0.5 rounded ${isQuizCorrect ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'}">
                ${isQuizCorrect ? 'Tebrikler! Doğru Cevap' : 'Tekrar İnceleyin'}
              </span>
            ` : ''}
          </div>

          <div class="text-sm sm:text-base font-medium text-foreground math-content">
            ${esc(quiz.question)}
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            ${quiz.options.map((opt, oIdx) => {
              const isSelected = hasAnsweredQuiz && userQuizChoice === oIdx;
              const isCorrectOpt = oIdx === quiz.correctIndex;
              let btnClass = 'border-border bg-card hover:bg-muted text-foreground';
              if (hasAnsweredQuiz) {
                if (isCorrectOpt) {
                  btnClass = 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold';
                } else if (isSelected) {
                  btnClass = 'border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300 font-semibold';
                } else {
                  btnClass = 'border-border bg-muted/40 text-muted-foreground opacity-60';
                }
              }

              return `
                <button
                  type="button"
                  data-portal-click="selectStudyQuizOption" data-portal-click-args="[${jsArg(currentTopic.id)}, ${oIdx}]"
                  class="p-3 text-left rounded-lg border text-xs sm:text-sm font-medium transition cursor-pointer flex items-center gap-2.5 ${btnClass}"
                >
                  <span class="size-5 rounded-full border border-current flex items-center justify-center shrink-0 text-[10px] font-bold">
                    ${['A', 'B', 'C', 'D'][oIdx] || oIdx + 1}
                  </span>
                  <span class="math-content flex-1">${esc(opt)}</span>
                </button>
              `;
            }).join('')}
          </div>

          ${hasAnsweredQuiz ? `
            <div class="p-3 rounded-lg ${isQuizCorrect ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200' : 'bg-muted border border-border text-foreground/90'} text-xs leading-relaxed math-content">
              <strong>Açıklama:</strong> ${esc(quiz.explanation)}
            </div>
          ` : ''}
        </div>
      ` : '';

      return `
        <div class="calculus-study-view space-y-6">
          <!-- Overview Card -->
          <div class="rounded-2xl border border-blue-500/25 bg-blue-500/5 dark:bg-blue-500/10 p-4 sm:p-6 space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white font-mono tracking-wide">BETA MODU</span>
                  <h2 class="text-base sm:text-lg font-bold text-foreground">Calculus I: Adım Adım Öğrenme</h2>
                </div>
                <p class="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  Lamar University <strong>Prof. Paul Dawkins</strong>'in açık ders notları temelinde hazırlanmıştır. Konuları sırayla inceleyin, çözümlü örnekleri adım adım açarak mantığını kavrayın.
                </p>
              </div>

              <div class="flex items-center gap-3 shrink-0 bg-background/90 dark:bg-zinc-900/90 px-3.5 py-2 rounded-xl border border-border shadow-xs">
                <div class="text-right">
                  <div class="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">İlerleme</div>
                  <div class="text-xs font-bold text-foreground font-mono">${completedCount} / ${totalTopics} Konu</div>
                </div>
                <div class="size-9 rounded-full border-2 border-blue-500 flex items-center justify-center font-bold text-xs text-blue-500 font-mono">
                  %${progressPercent}
                </div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div class="bg-blue-500 h-1.5 rounded-full transition-all duration-300" style="width: ${progressPercent}%;"></div>
            </div>
          </div>

          <!-- Main Layout Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <!-- Left Navigation (4 cols on lg) -->
            <div class="lg:col-span-4 space-y-4">
              <div class="rounded-2xl border border-border bg-card p-3.5 shadow-2xs space-y-2">
                <div class="flex items-center justify-between px-2 pb-1 border-b border-border/60">
                  <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <i data-lucide="layers" class="size-3.5"></i>
                    <span>Ders Müfredatı</span>
                  </span>
                  <span class="text-[11px] font-mono text-muted-foreground font-medium">${completedCount}/${totalTopics} Tamamlandı</span>
                </div>

                ${weeksNavHtml}

                ${completedCount > 0 ? `
                  <div class="pt-2 px-1 border-t border-border/60">
                    <button
                      type="button"
                      data-portal-click="resetStudyProgress" data-portal-click-args="[]"
                      class="text-[11px] text-muted-foreground hover:text-rose-500 transition cursor-pointer flex items-center gap-1"
                    >
                      <i data-lucide="rotate-ccw" class="size-3"></i>
                      <span>İlerlemeyi Sıfırla</span>
                    </button>
                  </div>
                ` : ''}
              </div>

              <!-- Paul's Math Notes Source Attribution Card -->
              <div class="rounded-2xl border border-border bg-muted/30 p-3.5 text-xs text-muted-foreground space-y-2">
                <div class="flex items-center gap-1.5 font-semibold text-foreground">
                  <i data-lucide="book-open" class="size-3.5 text-blue-500"></i>
                  <span>Paul's Math Notes Referansı</span>
                </div>
                <p class="text-[11px] leading-relaxed">
                  Bu modüldeki konu anlatımları ve çözümlü adımlar Lamar University Matematik Bölümü'nden <strong>Prof. Paul Dawkins</strong>'in Paul's Online Math Notes ders kaynağına dayanmaktadır.
                </p>
                <a
                  href="${esc(safeLink(currentTopic.sourceUrl))}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:underline font-medium"
                >
                  <span>Bu Konunun Orijinal Sayfası</span>
                  <i data-lucide="arrow-up-right" class="size-3"></i>
                </a>
              </div>
            </div>

            <!-- Right Main Topic Content (8 cols on lg) -->
            <div class="lg:col-span-8 space-y-6">
              <!-- Topic Header Card -->
              <div class="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-2xs">
                <div class="flex items-center justify-between gap-3 flex-wrap">
                  <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    Calculus I • Hafta ${data.weeks.find(w => w.id === currentTopic.weekId)?.number || 1}
                  </span>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-muted-foreground flex items-center gap-1">
                      <i data-lucide="clock" class="size-3"></i>
                      <span>${esc(currentTopic.readTime)}</span>
                    </span>
                    <button
                      type="button"
                      data-portal-click="toggleStudyTopicDone" data-portal-click-args="[${jsArg(currentTopic.id)}]"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        isTopicDone
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-2xs'
                          : 'bg-muted hover:bg-muted/80 text-foreground border border-border'
                      }"
                    >
                      <i data-lucide="${isTopicDone ? 'check-circle' : 'circle'}" class="size-3.5"></i>
                      <span>${isTopicDone ? 'Tamamlandı' : 'Tamamlandı Olarak İşaretle'}</span>
                    </button>
                  </div>
                </div>

                <div class="space-y-1">
                  <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    ${esc(currentTopic.title)}
                  </h1>
                  <p class="text-xs sm:text-sm font-medium text-muted-foreground">
                    ${esc(currentTopic.subTitle)}
                  </p>
                </div>

                <!-- Topic Overview / Intuition -->
                <div class="p-4 rounded-xl bg-muted/40 border border-border/80 text-xs sm:text-sm leading-relaxed text-foreground/90 space-y-2">
                  <div class="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <i data-lucide="compass" class="size-3.5 text-blue-500"></i>
                    <span>Kavramsal Yaklaşım & Sezgisel Giriş</span>
                  </div>
                  <p class="math-content leading-relaxed">${esc(currentTopic.overview)}</p>
                </div>
              </div>

              <!-- Key Formulas & Theorems -->
              ${formulasHtml ? `
                <div class="space-y-3">
                  <div class="flex items-center gap-2 px-1">
                    <i data-lucide="sigma" class="size-4 text-blue-500"></i>
                    <h3 class="text-sm font-bold uppercase tracking-wider text-muted-foreground">Temel Formüller ve Tanımlar</h3>
                  </div>
                  <div class="grid grid-cols-1 gap-3">
                    ${formulasHtml}
                  </div>
                </div>
              ` : ''}

              <!-- Critical Notes / Pitfalls -->
              ${notesHtml ? `
                <div class="space-y-2.5">
                  <div class="flex items-center gap-2 px-1">
                    <i data-lucide="alert-triangle" class="size-4 text-amber-500"></i>
                    <h3 class="text-sm font-bold uppercase tracking-wider text-muted-foreground">Dikkat Edilmesi Gereken Noktalar</h3>
                  </div>
                  <div class="space-y-2">
                    ${notesHtml}
                  </div>
                </div>
              ` : ''}

              <!-- Worked Examples Section (Paul's Style) -->
              <div class="space-y-3 pt-2">
                <div class="flex items-center justify-between gap-2 px-1 flex-wrap">
                  <div class="flex items-center gap-2">
                    <i data-lucide="check-square" class="size-4 text-blue-500"></i>
                    <h3 class="text-sm font-bold uppercase tracking-wider text-muted-foreground">Paul's Notes Çözümlü Örnekleri</h3>
                  </div>
                  <span class="text-xs text-muted-foreground">Çözümleri adım adım açarak inceleyin</span>
                </div>

                <div class="space-y-4">
                  ${examplesHtml}
                </div>
              </div>

              <!-- Checkpoint Quiz -->
              ${quizHtml ? `
                <div class="space-y-3 pt-2">
                  <div class="flex items-center gap-2 px-1">
                    <i data-lucide="sparkles" class="size-4 text-purple-500"></i>
                    <h3 class="text-sm font-bold uppercase tracking-wider text-muted-foreground">Kavrama Testi</h3>
                  </div>
                  ${quizHtml}
                </div>
              ` : ''}

              <!-- Navigation Footer (Previous / Next Topic) -->
              <div class="pt-4 border-t border-border flex items-center justify-between gap-3 flex-wrap">
                <div>
                  ${prevTopic ? `
                    <button
                      type="button"
                      data-portal-click="navigateStudyTopic" data-portal-click-args="[-1]"
                      class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition cursor-pointer shadow-2xs"
                    >
                      <i data-lucide="arrow-left" class="size-3.5"></i>
                      <span>Önceki: ${esc(prevTopic.title.split('(')[0].trim())}</span>
                    </button>
                  ` : '<div></div>'}
                </div>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    data-portal-click="toggleStudyTopicDone" data-portal-click-args="[${jsArg(currentTopic.id)}]"
                    class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isTopicDone
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-2xs'
                        : 'bg-primary text-primary-foreground hover:opacity-90 shadow-2xs'
                    }"
                  >
                    <i data-lucide="${isTopicDone ? 'check' : 'circle-check'}" class="size-3.5"></i>
                    <span>${isTopicDone ? 'Konu Tamamlandı ✓' : 'Konuyu Tamamla'}</span>
                  </button>

                  ${nextTopic ? `
                    <button
                      type="button"
                      data-portal-click="navigateStudyTopic" data-portal-click-args="[1]"
                      class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition cursor-pointer shadow-2xs"
                    >
                      <span>Sonraki Konu</span>
                      <i data-lucide="arrow-right" class="size-3.5"></i>
                    </button>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    window.setCourseActiveTab = function(tabName) {
      activeCourseTab = tabName;
      if (activeCourseId) renderCourseHub(activeCourseId);
    };

    window.selectStudyTopic = function(topicId) {
      activeStudyTopicId = topicId;
      if (activeCourseId) renderCourseHub(activeCourseId);
      $('courseMaterialsContainer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    window.toggleStudyExample = function(exampleId) {
      if (openStudyExamples.has(exampleId)) {
        openStudyExamples.delete(exampleId);
      } else {
        openStudyExamples.add(exampleId);
      }
      if (activeCourseId) renderCourseHub(activeCourseId);
    };

    window.toggleStudyHint = function(exampleId) {
      if (openStudyHints.has(exampleId)) {
        openStudyHints.delete(exampleId);
      } else {
        openStudyHints.add(exampleId);
      }
      if (activeCourseId) renderCourseHub(activeCourseId);
    };

    window.toggleStudyTopicDone = function(topicId) {
      if (completedStudyTopics.has(topicId)) {
        completedStudyTopics.delete(topicId);
      } else {
        completedStudyTopics.add(topicId);
      }
      saveCompletedStudyTopics();
      if (activeCourseId) renderCourseHub(activeCourseId);
    };

    window.selectStudyQuizOption = function(topicId, optionIndex) {
      studyQuizAnswers[topicId] = Number(optionIndex);
      if (activeCourseId) renderCourseHub(activeCourseId);
    };

    window.navigateStudyTopic = function(direction) {
      const data = typeof window !== 'undefined' ? window.CALCULUS_STUDY_DATA : null;
      if (!data) return;
      const allTopics = data.weeks.flatMap(w => w.topics);
      const idx = allTopics.findIndex(t => t.id === activeStudyTopicId);
      const nextIdx = idx + direction;
      if (nextIdx >= 0 && nextIdx < allTopics.length) {
        activeStudyTopicId = allTopics[nextIdx].id;
        if (activeCourseId) renderCourseHub(activeCourseId);
        $('courseMaterialsContainer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    window.resetStudyProgress = function() {
      if (!confirm('Tüm konu tamamlama ilerlemenizi sıfırlamak istediğinize emin misiniz?')) return;
      completedStudyTopics.clear();
      saveCompletedStudyTopics();
      studyQuizAnswers = {};
      if (activeCourseId) renderCourseHub(activeCourseId);
    };

    function renderCourseMaterialsSections(code, meta, weekFolders, catFolders, rootFiles, totalFiles, driveFolderUrl) {
      const q = courseLocalSearch.trim().toLowerCase();

      const filterItems = (items) => {
        if (!q) return items;
        return items.filter(f => f.name.toLowerCase().includes(q));
      };

      const filteredWeeks = weekFolders.map(w => ({
        ...w,
        filteredChildren: filterItems((w.children || []).filter(f => !/^(info|bilgi)\.(txt|json)$/i.test(f.name)))
      })).filter(w => !q || w.filteredChildren.length > 0 || w.name.toLowerCase().includes(q));

      const filteredCats = catFolders.map(c => ({
        ...c,
        filteredChildren: filterItems((c.children || []).filter(f => !/^(info|bilgi)\.(txt|json)$/i.test(f.name)))
      })).filter(c => !q || c.filteredChildren.length > 0 || c.name.toLowerCase().includes(q));

      const filteredRoots = filterItems(rootFiles);

      const weekGridCols = filteredWeeks.length === 1
        ? 'grid-cols-1'
        : filteredWeeks.length === 2
          ? 'grid-cols-1 md:grid-cols-2'
          : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4';

      const catGridCols = filteredCats.length === 1
        ? 'grid-cols-1'
        : filteredCats.length === 2
          ? 'grid-cols-1 md:grid-cols-2'
          : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4';

      return `
        ${filteredWeeks.length > 0 ? `
          <div class="grid ${weekGridCols} gap-4">
            ${filteredWeeks.map(w => renderFolderCard(w, code, true, w.filteredChildren)).join('')}
          </div>
        ` : ''}

        ${filteredCats.length > 0 ? `
          <div class="grid ${catGridCols} gap-4">
            ${filteredCats.map(c => renderFolderCard(c, code, false, c.filteredChildren)).join('')}
          </div>
        ` : ''}

        ${filteredRoots.length > 0 ? `
          <div class="admincn-card overflow-hidden">
            <div class="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <h3 class="text-sm font-semibold">Dosyalar (${filteredRoots.length})</h3>
            </div>
            <div class="divide-y divide-border px-3 py-1.5">
              ${filteredRoots.map(f => renderFileRow(f, code)).join('')}
            </div>
          </div>
        ` : ''}

        ${totalFiles === 0 ? `
          <div class="admincn-card text-center py-12 px-4">
            <p class="text-xs text-muted-foreground mb-3">Bu ders için henüz Google Drive arşivine materyal yüklenmemiş.</p>
            <a
              href="${driveFolderUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex h-8 items-center gap-1.5 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition"
            >
              <i data-lucide="external-link" class="size-3.5"></i>
              <span>Drive Arşivini Aç</span>
            </a>
          </div>
        ` : ''}
      `;
    }

    window.filterCourseMaterials = function(val) {
      courseLocalSearch = val;
      if (!activeCourseId) return;
      const courseNode = getCourseNodeById(activeCourseId);
      if (!courseNode) return;
      const code = courseNode.name.toUpperCase().trim();
      const meta = courseMetadata[code] || { name: courseNode.name };
      const totalFiles = countFilesInFolder(courseNode.children);
      const folderId = parseFolderId(settings.folder);
      const driveFolderUrl = courseNode.isVirtual
        ? (folderId ? `https://drive.google.com/drive/folders/${folderId}` : 'https://drive.google.com')
        : `https://drive.google.com/drive/folders/${realId(courseNode)}`;
      const subfolders = (courseNode.children || []).filter(n => realMime(n) === FOLDER_MIME);
      const rootFiles = (courseNode.children || []).filter(n => realMime(n) !== FOLDER_MIME && !/^(info|bilgi)\.(txt|json)$/i.test(n.name));

      const weekFolders = [];
      const catFolders = [];
      subfolders.forEach(sub => {
        const nameLower = sub.name.toLowerCase();
        if (/(hafta|week)\s*0?(\d+)/i.test(nameLower)) {
          const match = nameLower.match(/(hafta|week)\s*0?(\d+)/i);
          weekFolders.push({ ...sub, weekNum: parseInt(match[2], 10) });
        } else {
          catFolders.push(sub);
        }
      });
      weekFolders.sort((a, b) => a.weekNum - b.weekNum);

      const box = $('courseMaterialsContainer');
      if (box) {
        box.innerHTML = renderCourseMaterialsSections(code, meta, weekFolders, catFolders, rootFiles, totalFiles, driveFolderUrl);
        lucide.createIcons();
      }
    };

    function renderFolderCard(folder, courseCode, isWeekly, overrideItems = null) {
      const items = overrideItems || (folder.children || []).filter(f => !/^(info|bilgi)\.(txt|json)$/i.test(f.name));
      const count = items.length;
      const headerIcon = isWeekly ? 'calendar' : 'folder';
      const stripped = folder.name.replace(/(hafta|week)\s*0?\d+[:\s-]*/i, '').trim();
      const title = isWeekly
        ? (stripped ? `${folder.weekNum}. Hafta — ${stripped}` : `${folder.weekNum}. Hafta`)
        : folder.name;

      return `
        <div id="folder-${folder.id}" class="admincn-card flex flex-col overflow-hidden">
          <div class="px-4 py-3 border-b border-border flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <div class="size-7 rounded-sm bg-primary-soft text-primary flex items-center justify-center shrink-0">
                <i data-lucide="${headerIcon}" class="size-3.5"></i>
              </div>
              <h4 class="font-semibold text-sm text-foreground truncate" title="${esc(folder.name)}">${esc(title)}</h4>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <span class="rounded-sm bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary tabular-nums">
                ${count}
              </span>
              <a
                href="https://drive.google.com/drive/folders/${realId(folder)}"
                target="_blank"
                rel="noopener noreferrer"
                title="Drive'da Aç"
                class="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                <i data-lucide="external-link" class="size-3.5"></i>
              </a>
            </div>
          </div>

          <div class="p-3 space-y-1.5">
            ${items.length > 0 ? items.map(item => renderFileItem(item, courseCode)).join('') : `
              <div class="text-xs text-muted-foreground py-3 text-center">Boş</div>
            `}
          </div>
        </div>
      `;
    }

    function renderFileItem(item, courseCode) {
      const kind = getFileKind(item);
      const conf = KIND_CONFIG[kind] || KIND_CONFIG.file;
      const yt = extractYouTubeId(item.name) || extractYouTubeId(item.description);
      const sizeStr = formatFileSize(item.size);

      return `
        <div class="flex items-center justify-between gap-2 p-2 rounded-lg border border-border bg-background hover:bg-muted/50 transition group">
          <div class="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer" data-portal-click="openViewerModal" data-portal-click-args="[${jsArg(item.id)}, ${jsArg(courseCode)}]">
            <div class="size-7 rounded-sm bg-primary-soft text-primary flex items-center justify-center shrink-0">
              <i data-lucide="${conf.icon}" class="size-3.5"></i>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-xs sm:text-sm font-medium text-foreground truncate group-hover:underline" title="${esc(item.name)}">
                ${esc(item.name)}
              </div>
              <div class="text-[11px] text-muted-foreground">
                ${conf.badge}${sizeStr !== '—' ? ' • ' + sizeStr : ''}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-1 shrink-0">
            <button
              data-portal-click="openViewerModal" data-portal-click-args="[${jsArg(item.id)}, ${jsArg(courseCode)}]"
              class="h-7 px-2.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              ${kind === 'youtube' || yt ? 'İzle' : 'Aç'}
            </button>
            ${kind !== 'youtube' ? `
              <a
                href="https://drive.google.com/uc?export=download&id=${realId(item)}"
                target="_blank"
                rel="noopener noreferrer"
                title="İndir"
                class="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                <i data-lucide="download" class="size-3.5"></i>
              </a>
            ` : ''}
            <a
              href="${esc(safeLink(item.webViewLink || `https://drive.google.com/file/d/${encodeURIComponent(realId(item))}/view`))}"
              target="_blank"
              rel="noopener noreferrer"
              title="Drive"
              class="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              <i data-lucide="external-link" class="size-3.5"></i>
            </a>
          </div>
        </div>
      `;
    }

    function renderFileRow(item, courseCode) {
      const kind = getFileKind(item);
      const conf = KIND_CONFIG[kind] || KIND_CONFIG.file;
      const sizeStr = formatFileSize(item.size);

      return `
        <div class="flex items-center justify-between gap-3 py-2 px-2 hover:bg-muted/30 rounded-md transition">
          <div class="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer" data-portal-click="openViewerModal" data-portal-click-args="[${jsArg(item.id)}, ${jsArg(courseCode)}]">
            <div class="size-7 rounded-sm bg-primary-soft text-primary flex items-center justify-center shrink-0">
              <i data-lucide="${conf.icon}" class="size-3.5"></i>
            </div>
            <span class="text-xs sm:text-sm font-medium text-foreground truncate hover:underline" title="${esc(item.name)}">
              ${esc(item.name)}
            </span>
            ${sizeStr !== '—' ? `<span class="text-xs text-muted-foreground shrink-0 font-mono">${sizeStr}</span>` : ''}
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button
              data-portal-click="openViewerModal" data-portal-click-args="[${jsArg(item.id)}, ${jsArg(courseCode)}]"
              class="h-7 px-2.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Aç
            </button>
            ${kind !== 'youtube' ? `
              <a
                href="https://drive.google.com/uc?export=download&id=${realId(item)}"
                target="_blank"
                rel="noopener noreferrer"
                title="İndir"
                class="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                <i data-lucide="download" class="size-3.5"></i>
              </a>
            ` : ''}
            <a
              href="${esc(safeLink(item.webViewLink || `https://drive.google.com/file/d/${encodeURIComponent(realId(item))}/view`))}"
              target="_blank"
              rel="noopener noreferrer"
              class="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              <i data-lucide="external-link" class="size-3.5"></i>
            </a>
          </div>
        </div>
      `;
    }

    // ================= IN-PAGE UNIVERSAL VIEWER MODAL =================
    function findNodeRecursively(nodes, targetId) {
      for (const node of nodes) {
        if (node.id === targetId) return node;
        if (node.children) {
          const found = findNodeRecursively(node.children, targetId);
          if (found) return found;
        }
      }
      return null;
    }

    // ================= INDEXEDDB PERSISTENT PDF CACHE =================
    const PDF_CACHE_DB = 'AnkuPdfCacheDB';
    const PDF_CACHE_STORE = 'pdfs';

    function openPdfCacheDB() {
      return new Promise((resolve) => {
        if (!window.indexedDB) {
          resolve(null);
          return;
        }
        try {
          const request = indexedDB.open(PDF_CACHE_DB, 1);
          request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(PDF_CACHE_STORE)) {
              db.createObjectStore(PDF_CACHE_STORE, { keyPath: 'id' });
            }
          };
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    }

    async function getCachedPdfBlob(id) {
      try {
        const db = await openPdfCacheDB();
        if (!db) return null;
        return new Promise((resolve) => {
          try {
            const tx = db.transaction(PDF_CACHE_STORE, 'readonly');
            const store = tx.objectStore(PDF_CACHE_STORE);
            const req = store.get(id);
            req.onsuccess = () => resolve(req.result ? req.result.blob : null);
            req.onerror = () => resolve(null);
          } catch (e) {
            resolve(null);
          }
        });
      } catch (e) {
        return null;
      }
    }

    async function saveCachedPdfBlob(id, blob, name) {
      try {
        const db = await openPdfCacheDB();
        if (!db) return;
        const tx = db.transaction(PDF_CACHE_STORE, 'readwrite');
        const store = tx.objectStore(PDF_CACHE_STORE);
        store.put({ id, blob, name, time: Date.now() });
      } catch (e) {
        console.warn('IndexedDB save failed:', e);
      }
    }

    async function clearPdfCache() {
      try {
        sessionBlobCache.clear();
        const db = await openPdfCacheDB();
        if (!db) return;
        const tx = db.transaction(PDF_CACHE_STORE, 'readwrite');
        tx.objectStore(PDF_CACHE_STORE).clear();
      } catch (e) {}
    }
    window.clearPdfCache = clearPdfCache;

    let currentViewingNode = null;
    let currentViewerMode = 0;
    let activeStreamAbort = null;
    const sessionBlobCache = new Map();

    async function validPdfBlob(blob) {
      return blob?.type === 'application/pdf' && (await blob.slice(0,5).text()) === '%PDF-';
    }
    async function loadDirectStream(node) {
      if (!node) return;
      const id = realId(node);
      // Only render verified PDFs as same-origin blobs; other formats stay in Google's isolated viewer.
      if (node.mimeType !== 'application/pdf') {
        currentViewerMode=1;$('viewerServerBadge').textContent='Drive';
        setViewerFrameSrc(getPreviewUrl(node));return;
      }
      const frame = $('viewerFrame');
      const loader = $('viewerLoader');
      const streamBox = $('viewerStreamProgress');
      const bar = $('viewerProgressBar');
      const percentEl = $('viewerProgressPercent');
      const mbEl = $('viewerProgressMb');
      const statusEl = $('viewerStreamStatus');
      const serverBadge = $('viewerServerBadge');

      if (activeStreamAbort) {
        activeStreamAbort.abort();
        activeStreamAbort = null;
      }

      loader.classList.add('hidden');

      // 1. Instant RAM cache check
      if (sessionBlobCache.has(id)) {
        streamBox.classList.add('hidden');
        setViewerFrameSrc(sessionBlobCache.get(id));
        serverBadge.textContent = 'Önbellek';
        return;
      }

      // 2. Persistent IndexedDB cache check
      const cachedBlob = await getCachedPdfBlob(id);
      if (cachedBlob && await validPdfBlob(cachedBlob)) {
        const blobUrl = URL.createObjectURL(cachedBlob);
        sessionBlobCache.set(id, blobUrl);
        streamBox.classList.add('hidden');
        setViewerFrameSrc(blobUrl);
        serverBadge.textContent = 'Önbellek';
        return;
      }

      // 3. Initiate active stream
      streamBox.classList.remove('hidden');
      $('viewerStreamTitle').textContent = node.name;
      if (statusEl) statusEl.textContent = 'Sunucuya bağlanılıyor...';
      bar.style.width = '3%';
      percentEl.textContent = '0%';
      const totalBytes = (node.size && !isNaN(node.size)) ? Number(node.size) : 0;
      const totalMbStr = totalBytes > 0 ? (totalBytes / (1024 * 1024)).toFixed(1) + ' MB' : '...';
      mbEl.textContent = `0.0 MB / ${totalMbStr}`;
      serverBadge.textContent = 'Aktarılıyor...';
      lucide.createIcons();

      const controller = new AbortController();
      activeStreamAbort = controller;

      const timeoutId = setTimeout(() => {
        if (activeStreamAbort === controller) {
          console.warn('Bağlantı zaman aşımına uğradı, Drive önizlemeye geçiliyor');
          controller.abort('timeout');
        }
      }, 25000);

      try {
        const streamUrl = DRIVE_PROXY + '?mode=media&file=' + encodeURIComponent(id);
        const response = await fetch(streamUrl, {
          headers: DRIVE_HEADERS,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/html')) {
          throw new Error('Geçersiz yanıt tipi (HTML)');
        }

        const headerLen = response.headers.get('content-length');
        const expectedTotal = (headerLen && !isNaN(headerLen) && Number(headerLen) > 0)
          ? Number(headerLen)
          : totalBytes;

        if (statusEl) statusEl.textContent = 'Tarayıcıya aktarılıyor...';

        const reader = response.body.getReader();
        const chunks = [];
        let loaded = 0;
        let lastUiUpdate = 0;
        const startTime = Date.now();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          loaded += value.length;

          const now = Date.now();
          if (now - lastUiUpdate > 30 || (expectedTotal > 0 && loaded >= expectedTotal)) {
            lastUiUpdate = now;
            const loadedMb = (loaded / (1024 * 1024)).toFixed(1);
            if (expectedTotal > 0) {
              const percent = Math.min(99, Math.round((loaded / expectedTotal) * 100));
              const tMb = (expectedTotal / (1024 * 1024)).toFixed(1);
              bar.style.width = Math.max(3, percent) + '%';
              percentEl.textContent = percent + '%';

              const elapsedSec = (now - startTime) / 1000;
              const speedMb = elapsedSec > 0.4 ? (loaded / (1024 * 1024) / elapsedSec).toFixed(1) : null;
              mbEl.textContent = speedMb
                ? `${loadedMb} / ${tMb} MB • ${speedMb} MB/s`
                : `${loadedMb} / ${tMb} MB`;
            } else {
              bar.style.width = '60%';
              mbEl.textContent = `${loadedMb} MB aktarıldı`;
            }
          }
        }

        bar.style.width = '100%';
        percentEl.textContent = '100%';
        if (statusEl) statusEl.textContent = 'Açılıyor...';

        const blob = new Blob(chunks, { type: 'application/pdf' });
        if (!await validPdfBlob(blob)) throw new Error('Geçersiz PDF dosyası');
        const blobUrl = URL.createObjectURL(blob);

        sessionBlobCache.set(id, blobUrl);
        saveCachedPdfBlob(id, blob, node.name);

        activeStreamAbort = null;
        streamBox.classList.add('hidden');
        setViewerFrameSrc(blobUrl);
        serverBadge.textContent = 'Doğrudan';

      } catch (err) {
        clearTimeout(timeoutId);
        if (controller.signal.aborted && controller.signal.reason !== 'timeout') {
          return;
        }
        console.warn('Doğrudan aktarım sağlanamadı, Drive moduna geçiliyor:', err);
        activeStreamAbort = null;
        streamBox.classList.add('hidden');
        loader.classList.remove('hidden');
        currentViewerMode = 1;
        setViewerFrameSrc(`https://drive.google.com/file/d/${id}/preview`);
        serverBadge.textContent = 'Drive';
      }
    }

    window.openViewerModal = function(fileId, courseCode) {
      if (!driveTree) return;
      const fileNode = findNodeRecursively(driveTree, fileId);
      if (!fileNode) return;

      currentViewingNode = fileNode;

      const modal = $('viewerModal');
      const frame = $('viewerFrame');
      const loader = $('viewerLoader');
      const streamBox = $('viewerStreamProgress');
      const title = $('viewerFileTitle');
      const breadcrumb = $('viewerFileBreadcrumb');
      const extBtn = $('viewerExternalBtn');
      const downloadBtn = $('viewerDownloadBtn');
      const serverBadge = $('viewerServerBadge');

      const sizeStr = formatFileSize(fileNode.size);
      title.textContent = fileNode.name;
      breadcrumb.textContent = `${courseCode}${sizeStr && sizeStr !== '—' ? ' • ' + sizeStr : ''}`;
      extBtn.href = safeLink(fileNode.webViewLink || `https://drive.google.com/file/d/${encodeURIComponent(realId(fileNode))}/view`);

      const id = realId(fileNode);
      downloadBtn.href = `https://drive.google.com/uc?export=download&id=${id}`;

      const kind = getFileKind(fileNode);

      streamBox.classList.add('hidden');
      loader.classList.remove('hidden');
      frame.onload = () => loader.classList.add('hidden');

      const yt = extractYouTubeId(fileNode.name) || extractYouTubeId(fileNode.description);
      if (yt) {
        extBtn.href = `https://www.youtube.com/watch?v=${yt}`;
        downloadBtn.classList.add('hidden');
        $('viewerSwitchServerBtn').classList.add('hidden');
        const origin = encodeURIComponent(location.origin);
        setViewerFrameSrc(`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1&origin=${origin}`);
      } else {
        downloadBtn.classList.remove('hidden');
        $('viewerSwitchServerBtn').classList.remove('hidden');

        const isPdf = kind === 'pdf' || (fileNode.mimeType && fileNode.mimeType.includes('pdf')) || fileNode.name.toLowerCase().endsWith('.pdf');
        const isLarge = fileNode.size && Number(fileNode.size) > 20 * 1024 * 1024;

        if (isPdf && isLarge) {
          currentViewerMode = 0;
          loadDirectStream(fileNode);
        } else {
          currentViewerMode = 1;
          serverBadge.textContent = 'Drive';
          setViewerFrameSrc(getPreviewUrl(fileNode));
        }
      }

      if (!modal.open && !(history.state && history.state.viewer)) {
        history.pushState({ viewer: true }, '', location.href);
      }
      modal.showModal();
      if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur();
      }
      lucide.createIcons();
    };

    $('viewerSwitchServerBtn').onclick = () => {
      if (!currentViewingNode) return;
      currentViewerMode = (currentViewerMode + 1) % 3;
      const frame = $('viewerFrame');
      const loader = $('viewerLoader');
      const id = realId(currentViewingNode);
      const serverBadge = $('viewerServerBadge');

      if (currentViewerMode === 0) {
        loadDirectStream(currentViewingNode);
      } else if (currentViewerMode === 1) {
        if (activeStreamAbort) { activeStreamAbort.abort(); activeStreamAbort = null; }
        $('viewerStreamProgress').classList.add('hidden');
        loader.classList.remove('hidden');
        setViewerFrameSrc(`https://drive.google.com/file/d/${id}/preview`);
        serverBadge.textContent = 'Drive';
      } else {
        if (activeStreamAbort) { activeStreamAbort.abort(); activeStreamAbort = null; }
        $('viewerStreamProgress').classList.add('hidden');
        loader.classList.remove('hidden');
        setViewerFrameSrc(`https://docs.google.com/viewer?srcid=${id}&pid=explorer&efh=false&a=v&chrome=false&embedded=true`);
        serverBadge.textContent = 'Docs';
      }
    };

    $('cancelStreamBtn').onclick = () => {
      if (activeStreamAbort) {
        activeStreamAbort.abort();
        activeStreamAbort = null;
      }
      $('viewerStreamProgress').classList.add('hidden');
      if (currentViewingNode) {
        const id = realId(currentViewingNode);
        currentViewerMode = 1;
        $('viewerLoader').classList.remove('hidden');
        setViewerFrameSrc(`https://drive.google.com/file/d/${id}/preview`);
        $('viewerServerBadge').textContent = 'Drive';
      }
    };

    // A fresh frame avoids cross-origin navigation restrictions and stale viewer history.
    function setViewerFrameSrc(url) {
      const previous = $('viewerFrame');
      const frame = previous.cloneNode(false);
      frame.onload = () => $('viewerLoader').classList.add('hidden');
      frame.src = PortalSecurity.frameUrl(url);
      previous.replaceWith(frame);
    }

    let skipNextViewerPop = false;

    function cleanupViewerState() {
      if (!skipNextViewerPop && history.state && history.state.viewer) {
        skipNextViewerPop = true;
        history.back();
      }
      if (activeStreamAbort) {
        activeStreamAbort.abort();
        activeStreamAbort = null;
      }
      hideFullscreenToast();
      if (isViewerFullscreen()) {
        exitViewerFullscreen();
      }
      $('viewerStreamProgress').classList.add('hidden');
      setViewerFrameSrc('about:blank');
    }

    function closeViewerModal() {
      cleanupViewerState();
      $('viewerModal').close();
    }

    $('viewerModal').addEventListener('close', cleanupViewerState);
    $('viewerCloseBtn').onclick = closeViewerModal;
    $('viewerBackBtn').onclick = closeViewerModal;

    if (!('closedBy' in HTMLDialogElement.prototype)) {
      document.querySelectorAll('dialog[closedby="any"]').forEach((dialog) => {
        dialog.addEventListener('click', (event) => {
          if (event.target !== dialog) return;
          const rect = dialog.getBoundingClientRect();
          const isDialogContent = (
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width
          );
          if (isDialogContent) return;
          dialog.close();
        });
      });
    }

    let fullscreenToastTimer = null;
    let fullscreenExitHideTimer = null;

    function isViewerFullscreen() {
      const stage = $('viewerStage');
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      return fsEl === stage || stage.classList.contains('is-fullscreen');
    }

    function showFullscreenToast() {
      const toast = $('viewerFullscreenToast');
      if (!toast) return;
      if (fullscreenToastTimer) clearTimeout(fullscreenToastTimer);
      toast.classList.add('show-toast');
      fullscreenToastTimer = setTimeout(() => {
        toast.classList.remove('show-toast');
      }, 3200);
    }

    function hideFullscreenToast() {
      const toast = $('viewerFullscreenToast');
      if (!toast) return;
      if (fullscreenToastTimer) {
        clearTimeout(fullscreenToastTimer);
        fullscreenToastTimer = null;
      }
      toast.classList.remove('show-toast');
    }

    function enterViewerFullscreen() {
      const stage = $('viewerStage');
      const req = stage.requestFullscreen || stage.webkitRequestFullscreen;
      if (req) {
        req.call(stage).catch(() => {
          stage.classList.add('is-fullscreen');
          onViewerFullscreenChange();
        });
      } else {
        stage.classList.add('is-fullscreen');
        onViewerFullscreenChange();
      }
    }

    function exitViewerFullscreen() {
      const stage = $('viewerStage');
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      if (fsEl) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (exit) exit.call(document).catch(() => {});
      }
      if (stage.classList.contains('is-fullscreen')) {
        stage.classList.remove('is-fullscreen');
        onViewerFullscreenChange();
      }
    }

    function onViewerFullscreenChange() {
      const topZone = $('viewerFullscreenTopZone');
      if (isViewerFullscreen()) {
        showFullscreenToast();
      } else {
        hideFullscreenToast();
        topZone?.classList.remove('show-exit-btn');
      }
    }

    document.addEventListener('fullscreenchange', onViewerFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onViewerFullscreenChange);

    $('viewerFullscreenBtn').onclick = () => {
      if (!isViewerFullscreen()) {
        enterViewerFullscreen();
      } else {
        exitViewerFullscreen();
      }
    };

    $('viewerFullscreenExitBtn').onclick = () => {
      exitViewerFullscreen();
    };

    const fsTopZone = $('viewerFullscreenTopZone');
    if (fsTopZone) {
      fsTopZone.addEventListener('mouseenter', () => {
        if (!isViewerFullscreen()) return;
        if (fullscreenExitHideTimer) clearTimeout(fullscreenExitHideTimer);
        fsTopZone.classList.add('show-exit-btn');
      });

      fsTopZone.addEventListener('mouseleave', () => {
        if (fullscreenExitHideTimer) clearTimeout(fullscreenExitHideTimer);
        fullscreenExitHideTimer = setTimeout(() => {
          fsTopZone.classList.remove('show-exit-btn');
        }, 350);
      });
    }

    document.addEventListener('mousemove', (e) => {
      if (!isViewerFullscreen() || !fsTopZone) return;
      if (e.clientY <= 28) {
        if (fullscreenExitHideTimer) clearTimeout(fullscreenExitHideTimer);
        fsTopZone.classList.add('show-exit-btn');
      } else if (e.clientY > 72 && !fsTopZone.matches(':hover')) {
        fsTopZone.classList.remove('show-exit-btn');
      }
    });

    window.copyInstructorEmail = function(email, btnEl) {
      if (!email) return;
      navigator.clipboard.writeText(email).then(() => {
        const textSpan = btnEl.querySelector('.email-text');
        const originalText = textSpan.textContent;

        textSpan.textContent = 'Kopyalandı ✓';
        btnEl.classList.add('text-emerald-600', 'dark:text-emerald-400');

        setTimeout(() => {
          textSpan.textContent = originalText;
          btnEl.classList.remove('text-emerald-600', 'dark:text-emerald-400');
        }, 1500);
      }).catch(() => {
        prompt('E-posta:', email);
      });
    };

    // ================= EDIT COURSE METADATA =================
    window.openEditCourseModal = function(courseCode) {
      if (window.portalEditCourse) return window.portalEditCourse(courseCode);
      return;
      currentEditingCourseCode = courseCode;
      const meta = courseMetadata[courseCode] || { name: courseCode, instructor: '', email: '', credits: '', links: [] };

      $('editModalCourseCode').textContent = `${courseCode} Düzenle`;
      $('editCourseName').value = meta.name || '';
      $('editCourseInstructor').value = meta.instructor || '';
      $('editCourseEmail').value = meta.email || '';
      $('editCourseCredits').value = meta.credits || '';

      renderEditLinksRows(meta.links || []);
      $('editCourseModal').showModal();
      lucide.createIcons();
    };

    function renderEditLinksRows(links) {
      const container = $('editLinksContainer');
      container.innerHTML = links.map((link) => `
        <div class="flex items-center gap-2 link-row">
          <input type="text" placeholder="Başlık" value="${esc(link.title)}" class="h-8 w-1/3 px-2.5 bg-background border border-input rounded-md text-xs text-foreground">
          <input type="url" placeholder="https://..." value="${esc(link.url)}" class="h-8 flex-1 px-2.5 bg-background border border-input rounded-md text-xs text-foreground">
          <button type="button" data-portal-click="removeParent" data-portal-click-args="[{&quot;$context&quot;:&quot;element&quot;}]" class="size-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive">
            <i data-lucide="trash-2" class="size-4"></i>
          </button>
        </div>
      `).join('');
      lucide.createIcons();
    }

    $('addNewLinkRowBtn').onclick = () => {
      const container = $('editLinksContainer');
      const div = document.createElement('div');
      div.className = 'flex items-center gap-2 link-row';
      div.innerHTML = `
        <input type="text" placeholder="Başlık" value="" class="h-8 w-1/3 px-2.5 bg-background border border-input rounded-md text-xs text-foreground">
        <input type="url" placeholder="https://..." value="" class="h-8 flex-1 px-2.5 bg-background border border-input rounded-md text-xs text-foreground">
        <button type="button" data-portal-click="removeParent" data-portal-click-args="[{&quot;$context&quot;:&quot;element&quot;}]" class="size-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive">
          <i data-lucide="trash-2" class="size-4"></i>
        </button>
      `;
      container.appendChild(div);
      lucide.createIcons();
    };

    $('closeEditCourseBtn').onclick = () => $('editCourseModal').close();
    $('cancelEditCourseBtn').onclick = () => $('editCourseModal').close();

    $('editCourseForm').onsubmit = (e) => {
      e.preventDefault();
      if (!currentEditingCourseCode) return;

      const code = currentEditingCourseCode;
      const meta = courseMetadata[code] || {};

      meta.name = $('editCourseName').value.trim() || code;
      meta.instructor = $('editCourseInstructor').value.trim();
      meta.email = $('editCourseEmail').value.trim();
      meta.credits = $('editCourseCredits').value.trim();

      const linkRows = document.querySelectorAll('.link-row');
      meta.links = [];
      linkRows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const title = inputs[0].value.trim();
        const url = inputs[1].value.trim();
        if (title && url) {
          meta.links.push({ title, url, icon: 'external-link' });
        }
      });

      courseMetadata[code] = meta;
      localStorage.setItem('anku_course_meta_v11', JSON.stringify(courseMetadata));

      $('editCourseModal').close();
      renderSidebarCourses();
      if (activeCourseId) {
        renderCourseHub(activeCourseId);
      } else {
        renderWelcomeHub();
      }
    };

    $('copyInfoTxtBtn').onclick = () => {
      if (!currentEditingCourseCode) return;
      const code = currentEditingCourseCode;

      let sample = `# ${code}\n`;
      sample += `Hoca: ${$('editCourseInstructor').value.trim()}\n`;
      sample += `Email: ${$('editCourseEmail').value.trim()}\n`;
      sample += `Kredi: ${$('editCourseCredits').value.trim()}\n`;

      const linkRows = document.querySelectorAll('.link-row');
      linkRows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const title = inputs[0].value.trim();
        const url = inputs[1].value.trim();
        if (title && url) {
          sample += `Link: ${title} | ${url}\n`;
        }
      });

      navigator.clipboard.writeText(sample);
    };


    // ================= THEME TOGGLE =================
    function applyResolvedTheme(storedVal) {
      const meta = document.querySelector('meta[name="color-scheme"]');
      if (meta) meta.content = storedVal ?? 'light dark';
      const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = storedVal ? storedVal === 'dark' : sysDark;
      document.documentElement.classList.toggle('dark', isDark);
    }

    function switchTheme() {
      const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const sysScheme = sysDark ? 'dark' : 'light';
      const currentlyDark = document.documentElement.classList.contains('dark');
      const targetScheme = currentlyDark ? 'light' : 'dark';

      try {
        if (targetScheme === sysScheme) {
          localStorage.removeItem('color-scheme');
          applyResolvedTheme(null);
        } else {
          localStorage.setItem('color-scheme', targetScheme);
          applyResolvedTheme(targetScheme);
        }
      } catch (e) {
        applyResolvedTheme(targetScheme);
      }
    }

    // ---------- Seamless Circular Theme Transition ----------
    let isThemeSwitching = false;

    $('themeToggleBtn').onclick = async (event) => {
      if (isThemeSwitching) return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!document.startViewTransition || reduceMotion) {
        switchTheme();
        return;
      }

      isThemeSwitching = true;
      const rect = $('themeToggleBtn').getBoundingClientRect();
      const x = event && typeof event.clientX === 'number' && event.clientX > 0 ? event.clientX : rect.left + rect.width / 2;
      const y = event && typeof event.clientY === 'number' && event.clientY > 0 ? event.clientY : rect.top + rect.height / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      try {
        const transition = document.startViewTransition(() => {
          document.documentElement.classList.add('theme-transitioning');
          switchTheme();
          void document.documentElement.offsetHeight;
        });

        await transition.ready;
        document.documentElement.classList.remove('theme-transitioning');

        const anim = document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`
            ]
          },
          {
            duration: 480,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        );

        await anim.finished;
      } catch (e) {
        // Graceful handling of transition cancellation
      } finally {
        document.documentElement.classList.remove('theme-transitioning');
        isThemeSwitching = false;
      }
    };

    window.addEventListener('storage', (e) => {
      if (e.key === 'color-scheme') {
        applyResolvedTheme(e.newValue);
      }
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      try {
        const stored = localStorage.getItem('color-scheme');
        if (!stored) applyResolvedTheme(null);
      } catch (e) {}
    });

    // ================= TOP GLOBAL SEARCH BAR (COURSES, STAFF, IMPORTANT DATES, FILES) =================
    function normalizeTr(str) {
      return String(str || '')
        .toLocaleLowerCase('tr-TR')
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/â/g, 'a');
    }

    window.closeGlobalSearchDropdown = function() {
      const dd = $('globalSearchDropdown');
      if (dd) dd.classList.add('hidden');
    };

    window.clearGlobalSearch = function() {
      const inp = $('globalSearchInput');
      if (inp) {
        inp.value = '';
        inp.focus();
      }
      $('globalSearchClearBtn')?.classList.add('hidden');
      $('globalSearchKbdHint')?.classList.remove('hidden');
      closeGlobalSearchDropdown();
    };

    window.selectGlobalSearchCourse = function(code) {
      closeGlobalSearchDropdown();
      selectCourseByCode(code);
    };

    window.selectGlobalSearchStaff = function(staffId) {
      closeGlobalSearchDropdown();
      goToStaffPage(staffId);
    };

    window.selectGlobalSearchFile = function(fileId, courseCode) {
      closeGlobalSearchDropdown();
      openViewerModal(fileId, courseCode);
    };

    window.navigateToEventFromSearch = function(dateStr) {
      closeGlobalSearchDropdown();
      if (!dateStr) return;
      const [y, m] = dateStr.split('-').map(Number);
      calendarViewDate = new Date(y, m - 1, 1);
      calendarActiveDateStr = dateStr;
      if (activeView !== 'home') {
        goHome();
      } else {
        refreshCalendarWidget();
      }
      setTimeout(() => {
        const calEl = document.getElementById('academicCalendarContainer');
        if (calEl) {
          calEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        const targetCell = document.querySelector(`.calendar-day-cell[data-date="${dateStr}"]`);
        if (targetCell) {
          showCalendarDayPopover(targetCell, dateStr, true);
        }
      }, 120);
    };

    window.handleGlobalSearchFocus = function() {
      const inp = $('globalSearchInput');
      if (inp && inp.value.trim().length > 0) {
        handleGlobalSearchInput(inp.value);
      }
    };

    window.handleGlobalSearchInput = function(rawVal) {
      const dd = $('globalSearchDropdown');
      const clearBtn = $('globalSearchClearBtn');
      const kbdHint = $('globalSearchKbdHint');
      if (!dd) return;

      const val = String(rawVal || '').trim();
      if (val.length > 0) {
        clearBtn?.classList.remove('hidden');
        kbdHint?.classList.add('hidden');
      } else {
        clearBtn?.classList.add('hidden');
        kbdHint?.classList.remove('hidden');
        dd.classList.add('hidden');
        return;
      }

      const qNorm = normalizeTr(val);
      const qLower = val.toLocaleLowerCase('tr-TR');

      // 1. Search Courses (CURRICULUM_COURSES + courseMetadata)
      const matchedCourses = CURRICULUM_COURSES.filter(c => {
        const meta = courseMetadata[c.code] || c;
        const semStr = c.semester === 'guz' ? 'güz dönemi' : 'bahar dönemi';
        const hay = `${c.code} ${meta.name} ${meta.instructor || ''} ${meta.assistantsText || ''} ${c.year}. sınıf ${semStr}`;
        return normalizeTr(hay).includes(qNorm) || hay.toLocaleLowerCase('tr-TR').includes(qLower);
      }).slice(0, 6);

      // 2. Search Academic Staff (STAFF_DATA)
      const matchedStaff = STAFF_DATA.filter(s => {
        const hay = `${s.title} ${s.name} ${s.role || ''} ${s.email || ''} ${(s.courses || []).join(' ')}`;
        return normalizeTr(hay).includes(qNorm) || hay.toLocaleLowerCase('tr-TR').includes(qLower);
      }).slice(0, 6);

      // 3. Search Important Dates & Exams (getAcademicEvents)
      const curYear = new Date().getFullYear();
      const allEvents = getCalendarEvents().filter(e => e.date && e.date.startsWith(String(curYear)));
      const matchedEvents = allEvents.filter(ev => {
        const [, m, d] = ev.date.split('-').map(Number);
        const monthName = MONTH_NAMES_TR[m - 1] || '';
        const hay = `${ev.title} ${ev.courseCode} ${d} ${monthName} ${ev.date} sınav vize quiz proje`;
        return normalizeTr(hay).includes(qNorm) || hay.toLocaleLowerCase('tr-TR').includes(qLower);
      }).slice(0, 5);

      // 4. Search Drive Files & Materials
      const allFiles = driveTree ? collectAllFiles(driveTree) : [];
      const matchedFiles = allFiles.filter(item => {
        const hay = `${item.node.name} ${item.courseCode} ${item.folderPath}`;
        return normalizeTr(hay).includes(qNorm) || hay.toLocaleLowerCase('tr-TR').includes(qLower);
      }).slice(0, 8);

      const totalResults = matchedCourses.length + matchedStaff.length + matchedEvents.length + matchedFiles.length;

      if (totalResults === 0) {
        dd.innerHTML = `
          <div class="p-6 text-center text-xs text-muted-foreground">
            "<span class="font-medium text-foreground">${esc(val)}</span>" için ders, öğretim görevlisi, tarih veya dosya bulunamadı.
          </div>
        `;
        dd.classList.remove('hidden');
        return;
      }

      let html = `<div class="p-2 space-y-3">`;

      // Section: Courses
      if (matchedCourses.length > 0) {
        html += `
          <div>
            <div class="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span class="inline-flex items-center gap-1.5"><i data-lucide="book-open" class="size-3"></i> Dersler</span>
              <span class="font-mono text-[10px]">${matchedCourses.length}</span>
            </div>
            <div class="space-y-0.5 mt-0.5">
              ${matchedCourses.map(c => {
                const meta = courseMetadata[c.code] || c;
                const semLabel = `${c.year}. Sınıf • ${c.semester === 'guz' ? 'Güz' : 'Bahar'}`;
                return `
                  <button
                    type="button"
                    data-portal-click="selectGlobalSearchCourse" data-portal-click-args="[${jsArg(c.code)}]"
                    class="w-full flex items-center justify-between gap-3 px-2.5 py-2 rounded-lg hover:bg-muted text-left transition group"
                  >
                    <div class="flex items-center gap-2.5 min-w-0">
                      <span class="rounded bg-primary-soft px-2 py-0.5 font-mono text-xs font-bold text-foreground shrink-0">${esc(c.code)}</span>
                      <div class="min-w-0">
                        <div class="text-xs font-semibold text-foreground truncate group-hover:underline">${esc(meta.name)}</div>
                        <div class="text-[11px] text-muted-foreground truncate">${esc(semLabel)}${meta.instructor ? ' • ' + esc(meta.instructor) : ''}</div>
                      </div>
                    </div>
                    <i data-lucide="arrow-right" class="size-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition"></i>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }

      // Section: Academic Staff
      if (matchedStaff.length > 0) {
        html += `
          <div>
            <div class="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span class="inline-flex items-center gap-1.5"><i data-lucide="users" class="size-3"></i> Öğretim Görevlileri & Asistanlar</span>
              <span class="font-mono text-[10px]">${matchedStaff.length}</span>
            </div>
            <div class="space-y-0.5 mt-0.5">
              ${matchedStaff.map(s => {
                const fullName = `${s.title} ${s.name}`.trim();
                const initials = getStaffInitials(s.name);
                return `
                  <button
                    type="button"
                    data-portal-click="selectGlobalSearchStaff" data-portal-click-args="[${jsArg(s.id)}]"
                    class="w-full flex items-center justify-between gap-3 px-2.5 py-2 rounded-lg hover:bg-muted text-left transition group"
                  >
                    <div class="flex items-center gap-2.5 min-w-0">
                      <div class="size-8 rounded-full overflow-hidden bg-muted border border-border flex items-center justify-center shrink-0">
                        ${s.photo ? `<img src="${esc(safeImage(s.photo))}" alt="" class="size-full object-cover object-top" data-portal-error="hideImage" data-portal-error-args="[{&quot;$context&quot;:&quot;element&quot;}]" />` : `<span class="text-[10px] font-bold text-muted-foreground">${esc(initials)}</span>`}
                      </div>
                      <div class="min-w-0">
                        <div class="text-xs font-semibold text-foreground truncate group-hover:underline">${esc(fullName)}</div>
                        <div class="text-[11px] text-muted-foreground truncate">
                          ${s.role ? esc(s.role) + (s.email ? ' • ' : '') : ''}${s.email ? esc(s.email) : ''}
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-1 shrink-0">
                      ${(s.courses || []).slice(0, 2).map(code => `<span class="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] font-medium text-foreground">${esc(code)}</span>`).join('')}
                    </div>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }

      // Section: Important Dates & Exams
      if (matchedEvents.length > 0) {
        html += `
          <div>
            <div class="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span class="inline-flex items-center gap-1.5"><i data-lucide="calendar" class="size-3"></i> Önemli Tarihler & Sınavlar</span>
              <span class="font-mono text-[10px]">${matchedEvents.length}</span>
            </div>
            <div class="space-y-0.5 mt-0.5">
              ${matchedEvents.map(ev => {
                const solid = getCourseSolidColor(ev.courseCode);
                const [, m, d] = ev.date.split('-').map(Number);
                return `
                  <button
                    type="button"
                    data-portal-click="navigateToEventFromSearch" data-portal-click-args="[${jsArg(ev.date)}]"
                    class="w-full flex items-center justify-between gap-3 px-2.5 py-2 rounded-lg hover:bg-muted text-left transition group"
                  >
                    <div class="flex items-center gap-2.5 min-w-0">
                      <span
                        class="inline-flex items-center justify-center px-2 py-0.5 rounded font-bold text-[11px] shrink-0"
                        style="background-color: ${solid.bg}; color: ${solid.text};"
                      >
                        ${d} ${MONTH_NAMES_TR_SHORT[m - 1]}
                      </span>
                      <div class="min-w-0">
                        <div class="text-xs font-semibold text-foreground truncate group-hover:underline">${esc(ev.title)}</div>
                        <div class="text-[11px] text-muted-foreground truncate">${esc(ev.courseCode)}${ev.time ? ' • Saat ' + esc(ev.time) : ''}</div>
                      </div>
                    </div>
                    <span class="text-[11px] text-muted-foreground font-mono shrink-0">Takvimde Gör</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }

      // Section: Files & Materials
      if (matchedFiles.length > 0) {
        html += `
          <div>
            <div class="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span class="inline-flex items-center gap-1.5"><i data-lucide="file-text" class="size-3"></i> Dosyalar & Materyaller</span>
              <span class="font-mono text-[10px]">${matchedFiles.length}</span>
            </div>
            <div class="space-y-0.5 mt-0.5">
              ${matchedFiles.map(({ node, courseCode, folderPath }) => {
                const kind = getFileKind(node);
                const conf = KIND_CONFIG[kind] || KIND_CONFIG.file;
                return `
                  <button
                    type="button"
                    data-portal-click="selectGlobalSearchFile" data-portal-click-args="[${jsArg(node.id)}, ${jsArg(courseCode)}]"
                    class="w-full flex items-center justify-between gap-3 px-2.5 py-2 rounded-lg hover:bg-muted text-left transition group"
                  >
                    <div class="flex items-center gap-2.5 min-w-0">
                      <div class="size-7 rounded bg-primary-soft text-primary flex items-center justify-center shrink-0">
                        <i data-lucide="${conf.icon}" class="size-3.5"></i>
                      </div>
                      <div class="min-w-0">
                        <div class="text-xs font-medium text-foreground truncate group-hover:underline">${esc(node.name)}</div>
                        <div class="text-[11px] text-muted-foreground truncate">${esc(courseCode)} • ${esc(folderPath)}</div>
                      </div>
                    </div>
                    <span class="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground shrink-0">${conf.badge}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }

      html += `</div>`;
      dd.innerHTML = html;
      dd.classList.remove('hidden');
      lucide.createIcons({ root: dd });
    };

    // Close global search dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const wrapper = $('globalSearchWrapper');
      if (wrapper && !wrapper.contains(e.target)) {
        closeGlobalSearchDropdown();
      }
    });

    // ================= SIDEBAR & SHORTCUTS =================
    $('refreshBtn').onclick = () => {
      localStorage.removeItem('anku_tree_cache_v3');
      loadDriveData();
    };

    function toggleMobileSidebar(show) {
      $('sidebar').classList.toggle('-translate-x-full', !show);
      $('sidebarBackdrop').classList.toggle('hidden', !show);
      document.documentElement.classList.toggle('mobile-sidebar-open', !!show);
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) document.documentElement.classList.remove('mobile-sidebar-open');
    });

    function openCourseNavigation() {
      if (window.innerWidth < 768) {
        toggleMobileSidebar(true);
      } else {
        $('sidebarWrapper').setAttribute('data-state', 'expanded');
      }
      $('courseListNav').querySelector('button')?.focus({ preventScroll: true });
    }

    function toggleSidebarAction() {
      if (window.innerWidth < 768) {
        const isHidden = $('sidebar').classList.contains('-translate-x-full');
        toggleMobileSidebar(isHidden);
      } else {
        const wrapper = $('sidebarWrapper');
        const nextState = wrapper.getAttribute('data-state') === 'collapsed' ? 'expanded' : 'collapsed';
        wrapper.setAttribute('data-state', nextState);
      }
    }

    $('sidebarTriggerBtn').onclick = toggleSidebarAction;
    $('mobileCloseSidebarBtn').onclick = () => toggleMobileSidebar(false);
    $('sidebarBackdrop').onclick = () => toggleMobileSidebar(false);

    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebarAction();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        $('globalSearchInput')?.focus();
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        $('globalSearchInput')?.focus();
      } else if (e.key === 'Escape') {
        closeGlobalSearchDropdown();
      }
    });


    // Data attributes select a fixed handler; no dynamic code evaluation is used.
    const portalEventHandlers = Object.freeze({
      changeTablePage: (...args) => { if (typeof changeTablePage === 'function') return changeTablePage(...args); },
      clearGlobalSearch: (...args) => { if (typeof clearGlobalSearch === 'function') return clearGlobalSearch(...args); },
      copyInstructorEmail: (...args) => { if (typeof copyInstructorEmail === 'function') return copyInstructorEmail(...args); },
      filterCourseMaterials: (...args) => { if (typeof filterCourseMaterials === 'function') return filterCourseMaterials(...args); },
      goHome: (...args) => { if (typeof goHome === 'function') return goHome(...args); },
      goToStaffPage: (...args) => { if (typeof goToStaffPage === 'function') return goToStaffPage(...args); },
      handleAgendaItemClick: (...args) => { if (typeof handleAgendaItemClick === 'function') return handleAgendaItemClick(...args); },
      handleCalendarDayClick: (...args) => { if (typeof handleCalendarDayClick === 'function') return handleCalendarDayClick(...args); },
      handleCalendarDayHover: (...args) => { if (typeof handleCalendarDayHover === 'function') return handleCalendarDayHover(...args); },
      handleCalendarDayLeave: (...args) => { if (typeof handleCalendarDayLeave === 'function') return handleCalendarDayLeave(...args); },
      handleGlobalSearchFocus: (...args) => { if (typeof handleGlobalSearchFocus === 'function') return handleGlobalSearchFocus(...args); },
      handleGlobalSearchInput: (...args) => { if (typeof handleGlobalSearchInput === 'function') return handleGlobalSearchInput(...args); },
      handleResetAcademicEvents: (...args) => { if (typeof handleResetAcademicEvents === 'function') return handleResetAcademicEvents(...args); },
      handleSaveAcademicEvent: (...args) => { if (typeof handleSaveAcademicEvent === 'function') return handleSaveAcademicEvent(...args); },
      handleStaffSearch: (...args) => { if (typeof handleStaffSearch === 'function') return handleStaffSearch(...args); },
      handleTableCourseFilter: (...args) => { if (typeof handleTableCourseFilter === 'function') return handleTableCourseFilter(...args); },
      handleTableSearch: (...args) => { if (typeof handleTableSearch === 'function') return handleTableSearch(...args); },
      hideCalendarDayPopover: (...args) => { if (typeof hideCalendarDayPopover === 'function') return hideCalendarDayPopover(...args); },
      openAcademicTimetable: () => window.openAcademicTimetable?.(),
      cycleCalendarClass: () => cycleCalendarClass(),
      navigateCalendarMonth: (...args) => { if (typeof navigateCalendarMonth === 'function') return navigateCalendarMonth(...args); },
      navigateToEventFromSearch: (...args) => { if (typeof navigateToEventFromSearch === 'function') return navigateToEventFromSearch(...args); },
      openCourseNavigation: (...args) => { if (typeof openCourseNavigation === 'function') return openCourseNavigation(...args); },
      openEditCourseModal: (...args) => { if (typeof openEditCourseModal === 'function') return openEditCourseModal(...args); },
      openViewerModal: (...args) => { if (typeof openViewerModal === 'function') return openViewerModal(...args); },
      portalOpenCalendar: (...args) => { if (typeof portalOpenCalendar === 'function') return portalOpenCalendar(...args); },
      resetCalendarToToday: (...args) => { if (typeof resetCalendarToToday === 'function') return resetCalendarToToday(...args); },
      selectCourseByCode: (...args) => { if (typeof selectCourseByCode === 'function') return selectCourseByCode(...args); },
      selectGlobalSearchCourse: (...args) => { if (typeof selectGlobalSearchCourse === 'function') return selectGlobalSearchCourse(...args); },
      selectGlobalSearchFile: (...args) => { if (typeof selectGlobalSearchFile === 'function') return selectGlobalSearchFile(...args); },
      selectGlobalSearchStaff: (...args) => { if (typeof selectGlobalSearchStaff === 'function') return selectGlobalSearchStaff(...args); },
      setStaffCategoryFilter: (...args) => { if (typeof setStaffCategoryFilter === 'function') return setStaffCategoryFilter(...args); },
      setCourseActiveTab: (...args) => { if (typeof setCourseActiveTab === 'function') return setCourseActiveTab(...args); },
      selectStudyTopic: (...args) => { if (typeof selectStudyTopic === 'function') return selectStudyTopic(...args); },
      toggleStudyExample: (...args) => { if (typeof toggleStudyExample === 'function') return toggleStudyExample(...args); },
      toggleStudyHint: (...args) => { if (typeof toggleStudyHint === 'function') return toggleStudyHint(...args); },
      toggleStudyTopicDone: (...args) => { if (typeof toggleStudyTopicDone === 'function') return toggleStudyTopicDone(...args); },
      selectStudyQuizOption: (...args) => { if (typeof selectStudyQuizOption === 'function') return selectStudyQuizOption(...args); },
      navigateStudyTopic: (...args) => { if (typeof navigateStudyTopic === 'function') return navigateStudyTopic(...args); },
      resetStudyProgress: (...args) => { if (typeof resetStudyProgress === 'function') return resetStudyProgress(...args); },
      toggleSidebarSemester: (...args) => { if (typeof toggleSidebarSemester === 'function') return toggleSidebarSemester(...args); },
      toggleSidebarYear: (...args) => { if (typeof toggleSidebarYear === 'function') return toggleSidebarYear(...args); },

      closeEventDialog: () => $('addAcademicEventModal').close(),
      removeParent: element => element.parentElement.remove(),
      hideImage: image => { image.style.display='none'; },
      hideImageParent: image => { image.parentElement.style.display='none'; },
      imageFallback: image => { image.style.display='none'; image.nextElementSibling?.classList.remove('hidden'); },
      fitBanner: image => { if(image.naturalWidth&&image.naturalHeight)image.parentElement.style.setProperty('--banner-ratio',Math.max(image.naturalWidth/image.naturalHeight,.8)); },
      pauseCalendarPopup: () => clearTimeout(calendarPopoverHideTimer)
    });
    for(const type of ['click','input','change','focus','submit','mouseenter','mouseleave','load','error']) {
      document.addEventListener(type,event=>{
        const target=event.target;
        if(!(target instanceof Element))return;
        const element=['load','error','mouseenter','mouseleave'].includes(type)?target:target.closest('[data-portal-'+type+']');
        const name=element?.getAttribute('data-portal-'+type);
        if(!name||!Object.hasOwn(portalEventHandlers,name))return;
        let args;
        try{args=JSON.parse(element.getAttribute('data-portal-'+type+'-args')||'[]');if(!Array.isArray(args))return;}catch{return;}
        args=args.map(value=>value&&typeof value==='object'&&value.$context==='element'?element:value&&typeof value==='object'&&value.$context==='value'?element.value:value&&typeof value==='object'&&value.$context==='event'?event:value);
        if(type==='submit')event.preventDefault();
        portalEventHandlers[name](...args);
      },true);
    }

    syncCourseFromHash();
    renderSidebarCourses();
    if (activeView === 'staff') {
      renderStaffHub(highlightedStaffId);
    }
    lucide.createIcons();
    loadDriveData();

    // ================= SERVICE WORKER =================
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then((reg) => {
          reg.update().catch(() => {});
        }).catch(() => {});
      });
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
