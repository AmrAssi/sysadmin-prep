/* =====================================================================
   SysAdmin Prep — תוכן הלימוד
   מבוסס על חוברת ההכנה "Junior SysAdmin" (Windows / Active Directory)
   כל התוכן בעברית עם מונחים טכניים באנגלית, כפי שמקובל בתחום.
   ===================================================================== */

window.PREP_DATA = {
  meta: {
    title: "SysAdmin Prep",
    subtitle: "הכנה לראיון — Junior System Administrator",
    track: "Windows · Active Directory · Networking · Cloud",
  },

  /* ------------------------------------------------------------------ */
  /* מודולים                                                            */
  /* ------------------------------------------------------------------ */
  modules: [
    /* 01 ---------------------------------------------------------- */
    {
      id: "ad-fsmo",
      num: "01",
      title: "Active Directory + FSMO",
      icon: "🗂️",
      summary: "שירות הספריות של מיקרוסופט: ניהול משתמשים, מחשבים ומשאבים. מבוסס LDAP, Kerberos ו-DNS.",
      sections: [
        {
          heading: "מהו Active Directory?",
          type: "list",
          items: [
            ["הגדרה", "בסיס נתונים + שירותים לניהול זהויות ומשאבים בארגון."],
            ["מבוסס על", "LDAP (שאילתות), Kerberos (אימות), DNS (איתור שירותים)."],
            ["יחידות ניהול", "Forest → Domain → OU (Organizational Unit) → Objects."],
          ],
        },
        {
          heading: "Domain Join — שלבי הצטרפות לדומיין",
          type: "steps",
          items: [
            "ה-DNS של המחשב מצביע על ה-Domain Controller.",
            "המחשב מאתר DC דרך רשומות SRV ב-DNS.",
            "נוצר Computer Object ב-OU בתוך ה-AD.",
            "נבנה Secure Channel (Trust) מול ה-DC.",
            "אימות Kerberos מול ה-DC.",
          ],
        },
        {
          heading: "GPO — Group Policy Object",
          type: "list",
          items: [
            ["סדר חלות (LSDOU)", "Local → Site → Domain → OU."],
            ["Enforced", "כופה מדיניות גם כאשר יש חסימה למטה."],
            ["Block Inheritance", "חוסם ירושת מדיניות מלמעלה (Enforced גובר עליו)."],
            ["פקודות", "gpresult /r · gpupdate /force"],
          ],
        },
        {
          heading: "ADMX — Administrative Templates",
          type: "list",
          items: [
            ["מה זה", "קבצי XML שמגדירים אילו הגדרות זמינות בעורך ה-GPO."],
            ["ADMX מול ADML", "ADMX = הגדרות המדיניות (ניטרלי לשפה) · ADML = מחרוזות התצוגה לפי שפה."],
            ["החליף את", "פורמט ADM הישן (מאז Windows Vista / Server 2008)."],
            ["מיקום מקומי", "C:\\Windows\\PolicyDefinitions — נקרא בנפרד בכל מחשב."],
            ["Central Store ⭐", "תיקייה מרכזית ב-SYSVOL: \\\\domain\\SYSVOL\\domain\\Policies\\PolicyDefinitions — כל האדמינים וה-DCs משתמשים באותם templates."],
            ["הוספת template", "מעתיקים .admx ל-PolicyDefinitions ואת .adml לתת-תיקיית השפה (en-US). למשל עבור Edge/Chrome/Office."],
          ],
        },
        {
          heading: "FSMO — 5 התפקידים",
          type: "table",
          columns: ["Role", "רמה", "אחריות"],
          rows: [
            ["Schema Master", "Forest", "שינויים בסכמת ה-AD."],
            ["Domain Naming", "Forest", "הוספה/הסרה של דומיינים ב-Forest."],
            ["RID Master", "Domain", "הקצאת מאגרי RID ליצירת SID לאובייקטים."],
            ["PDC Emulator", "Domain", "מקור זמן (NTP), Account Lockout, שינויי סיסמה, עריכת GPO."],
            ["Infrastructure", "Domain", "עדכון Cross-domain references."],
          ],
        },
        {
          heading: "Transfer מול Seize",
          type: "list",
          items: [
            ["Transfer (מסודר)", "כאשר מקור התפקיד חי: Move-ADDirectoryServerOperationMasterRole."],
            ["Seize (כפייה)", "כאשר ה-DC מת: ntdsutil → roles → connections → connect to server DC02 → quit → seize <role>."],
            ["⚠ אזהרה", "אחרי Seize — אסור להחזיר את ה-DC הישן לרשת!"],
            ["שאילתה", "netdom query fsmo"],
          ],
        },
      ],
      flashcards: [
        ["על אילו שלושה רכיבים נשען Active Directory?", "LDAP (שאילתות), Kerberos (אימות), DNS (איתור)."],
        ["אילו תפקידי FSMO הם ברמת Forest?", "Schema Master ו-Domain Naming Master."],
        ["איזה תפקיד FSMO אחראי על זמן, Account Lockout ועריכת GPO?", "PDC Emulator."],
        ["מהו סדר חלות ה-GPO?", "Local → Site → Domain → OU (LSDOU)."],
        ["מה ההבדל בין Transfer ל-Seize?", "Transfer = העברה מסודרת כשהמקור חי. Seize = כפייה כשה-DC מת (ואסור להחזירו לרשת)."],
        ["מה ההבדל בין ADMX ל-ADML?", "ADMX = הגדרות המדיניות (ניטרלי לשפה); ADML = מחרוזות התצוגה לפי שפה."],
        ["מהו Central Store ולמה הוא חשוב?", "תיקיית PolicyDefinitions מרכזית ב-SYSVOL — כל האדמינים וה-DCs משתמשים באותם ADMX, אחיד ומסונכרן."],
      ],
      quiz: [
        {
          q: "איזה תפקיד FSMO מקצה מאגרי RID ליצירת SID?",
          options: ["PDC Emulator", "RID Master", "Schema Master", "Infrastructure Master"],
          answer: 1,
          explain: "RID Master מקצה לכל DC מאגר RIDs, מהם נבנים ה-SID של אובייקטים חדשים.",
        },
        {
          q: "מהו השלב הראשון בהצטרפות מחשב לדומיין?",
          options: ["יצירת Computer Object", "אימות Kerberos", "ה-DNS מצביע על ה-DC", "בניית Secure Channel"],
          answer: 2,
          explain: "ללא DNS שמצביע על ה-DC לא ניתן לאתר אותו דרך רשומות SRV.",
        },
        {
          q: "מה גובר במקרה של התנגשות מדיניות?",
          options: ["Block Inheritance", "Enforced", "המדיניות המקומית", "האחרונה שנערכה"],
          answer: 1,
          explain: "Enforced כופה את ה-GPO וגובר על Block Inheritance.",
        },
        {
          q: "היכן מאחסנים קבצי ADMX כדי שכל האדמינים ישתמשו באותם templates?",
          options: ["C:\\Windows\\System32", "Central Store ב-SYSVOL", "ב-Registry המקומי", "ב-Global Catalog"],
          answer: 1,
          explain: "ה-Central Store הוא תיקיית PolicyDefinitions ב-SYSVOL — מקור אחיד שמסונכרן לכל ה-DCs.",
        },
      ],
    },

    /* 02 ---------------------------------------------------------- */
    {
      id: "dns-gc",
      num: "02",
      title: "DNS + Global Catalog",
      icon: "🌐",
      summary: "DNS הוא הלב של AD — בלעדיו אין Login, אין GPO ואין שירות. לעולם אל תפנו לקוחות ל-8.8.8.8, אלא ל-DC.",
      sections: [
        {
          heading: "רשומות DNS עיקריות",
          type: "table",
          columns: ["Record", "תיאור", "דוגמה"],
          rows: [
            ["A", "שם → כתובת IPv4", "server.domain.local → 10.0.0.10"],
            ["AAAA", "שם → כתובת IPv6", "server.domain.local → ::1"],
            ["CNAME", "Alias לשם אחר", "mail → exchange.domain.local"],
            ["MX", "שרת דואר לדומיין", "domain.local → mail.domain.local"],
            ["PTR", "Reverse: IP → שם", "10.0.0.10 → server"],
            ["SRV", "איתור שירותים (AD)", "_ldap._tcp → dc01"],
            ["SOA", "Start of Authority לאזור", "סמכות ראשית של ה-Zone"],
          ],
        },
        {
          heading: "פקודות DNS",
          type: "table",
          columns: ["פקודה", "מטרה"],
          rows: [
            ["nslookup domain.local", "בדיקת Resolution בסיסי"],
            ["nslookup -type=SRV _ldap._tcp.domain.local", "בדיקת רשומות SRV של ה-DC"],
            ["ipconfig /flushdns", "ניקוי DNS Cache"],
            ["ipconfig /displaydns", "הצגת ה-Cache"],
            ["dcdiag /test:dns", "בדיקת DNS על ה-DC"],
          ],
        },
        {
          heading: "Global Catalog (GC)",
          type: "list",
          items: [
            ["מה זה", "עותק חלקי לקריאה-בלבד של כל האובייקטים ב-Forest."],
            ["למה צריך", "התחברות עם UPN, חברות ב-Universal Groups, חיפוש Multi-Domain."],
            ["פורטים", "3268 (GC) · 3269 (GC over SSL)."],
          ],
        },
      ],
      flashcards: [
        ["למה לא מפנים לקוחות בדומיין ל-8.8.8.8?", "כי DNS הוא הלב של AD — בלי DC כ-DNS אין Login, GPO ושירותים. צריך פורוורדר לחיצוני."],
        ["איזו רשומה מאתרת שירותי AD?", "רשומת SRV (למשל _ldap._tcp)."],
        ["מה תפקיד ה-Global Catalog?", "עותק חלקי של כל ה-Forest — נדרש ל-UPN login, Universal Groups וחיפוש Multi-Domain."],
        ["איזו רשומה ממירה IP חזרה לשם?", "PTR (Reverse lookup)."],
      ],
      quiz: [
        {
          q: "באיזה פורט עובד Global Catalog (לא מוצפן)?",
          options: ["389", "636", "3268", "3269"],
          answer: 2,
          explain: "GC עובד על 3268, וב-SSL על 3269. 389/636 הם LDAP/LDAPS.",
        },
        {
          q: "איזו רשומת DNS מאפשרת ללקוח למצוא Domain Controller?",
          options: ["A", "MX", "SRV", "CNAME"],
          answer: 2,
          explain: "רשומות SRV (כמו _ldap._tcp) חושפות את שירותי ה-DC.",
        },
      ],
    },

    /* 03 ---------------------------------------------------------- */
    {
      id: "ad-replication",
      num: "03",
      title: "AD Replication + dcdiag + repadmin",
      icon: "🔁",
      summary: "AD משתמש ב-Multi-Master Replication בין ה-DCs. בתוך Site מהיר, בין Sites דרך Site Links.",
      sections: [
        {
          heading: "מושגי יסוד",
          type: "list",
          items: [
            ["USN", "Update Sequence Number — מספר שעוקב אחר שינויים בכל DC."],
            ["KCC", "Knowledge Consistency Checker — בונה את טופולוגיית ה-Replication."],
            ["Site Link", "מגדיר את ה-Replication בין אתרים."],
          ],
        },
        {
          heading: "dcdiag — בדיקת תקינות DC",
          type: "table",
          columns: ["פקודה", "מטרה"],
          rows: [
            ["dcdiag", "בדיקה כללית"],
            ["dcdiag /test:dns", "DNS, SRV Records, Forwarders"],
            ["dcdiag /test:replications", "Replication בין DCs"],
            ["dcdiag /test:netlogons", "שירות Netlogon"],
            ["dcdiag /test:fsmocheck", "תפקידי FSMO"],
            ["dcdiag /s:DC02", "בדיקה על DC מרוחק"],
            ["dcdiag /v", "פלט Verbose"],
          ],
        },
        {
          heading: "repadmin — ניהול Replication",
          type: "table",
          columns: ["פקודה", "מטרה"],
          rows: [
            ["repadmin /replsummary", "סיכום מהיר של מצב ה-Replication"],
            ["repadmin /showrepl", "פירוט + Error Codes"],
            ["repadmin /showrepl DC02", "מצב על DC מסוים"],
            ["repadmin /syncall /AdeP", "סנכרון מול כל ה-Partners"],
            ["repadmin /showutdvec DC01", "וקטור עדכניות של DC"],
            ["repadmin /queue", "תור ה-Replication"],
          ],
        },
        {
          heading: "שגיאות Replication נפוצות",
          type: "table",
          columns: ["Error", "משמעות", "פתרון"],
          rows: [
            ["1722", "RPC Unavailable / Firewall", "פתיחת Port 135"],
            ["1256", "DC מרוחק לא זמין", "בדיקת DNS / Ping / DC חי?"],
            ["1396", "Kerberos / SPN לא תואם", "setspn לתיקון"],
            ["8606", "Lingering Objects", "repadmin /removelingeringobjects"],
            ["8614", "Replication בהסגר 60+ ימים", "Rebuild ל-DC"],
          ],
        },
      ],
      flashcards: [
        ["מהו USN?", "Update Sequence Number — מונה שעוקב אחר שינויים בכל DC לצורך Replication."],
        ["מי בונה את טופולוגיית ה-Replication?", "KCC — Knowledge Consistency Checker."],
        ["איזו פקודה נותנת סיכום מהיר של מצב ה-Replication?", "repadmin /replsummary."],
        ["מה אומרת שגיאת 1722?", "RPC Unavailable — בעיית Firewall, יש לפתוח Port 135."],
        ["מה עושים עם DC בהסגר Replication מעל 60 יום (8614)?", "מבצעים Rebuild ל-DC."],
      ],
      quiz: [
        {
          q: "שגיאת Replication 1722 מצביעה על:",
          options: ["Lingering Objects", "RPC Unavailable / Firewall", "בעיית Kerberos/SPN", "DC בהסגר"],
          answer: 1,
          explain: "1722 = RPC Unavailable, בדרך כלל Firewall שחוסם את Port 135.",
        },
        {
          q: "איזו פקודת dcdiag בודקת את תפקידי ה-FSMO?",
          options: ["dcdiag /test:dns", "dcdiag /test:netlogons", "dcdiag /test:fsmocheck", "dcdiag /v"],
          answer: 2,
          explain: "‎/test:fsmocheck מאמת את זמינות תפקידי ה-FSMO.",
        },
      ],
    },

    /* 04 ---------------------------------------------------------- */
    {
      id: "dns-flow",
      num: "04",
      title: "DNS Flow",
      icon: "➡️",
      summary: "מה קורה כשמריצים ping www.ynet.co.il? שרשרת Resolution של 8 שלבים — שאלה קלאסית בראיון.",
      sections: [
        {
          heading: "8 שלבי ה-Resolution",
          type: "steps",
          items: [
            "Local DNS Cache (ipconfig /displaydns).",
            "קובץ HOSTS: C:\\Windows\\System32\\drivers\\etc\\hosts.",
            "פנייה ל-DNS Server המוגדר (= ה-AD / DC).",
            "DNS Server Cache — תקף לפי TTL.",
            "Forwarder ב-DC עבור כתובות חיצוניות (ynet.co.il).",
            "DNS Root → TLD‏ (.il) → שרת Authoritative של ynet.co.il.",
            "מתקבל IP, נשמר ב-Cache לפי TTL.",
            "ICMP Ping אל ה-IP.",
          ],
        },
        {
          heading: "השרשרת בקיצור",
          type: "callout",
          items: [
            "Cache → Hosts → DNS Server → Forwarder → Root → TLD → Authoritative → IP → Ping",
          ],
        },
      ],
      flashcards: [
        ["מה השלב הראשון בפתרון שם DNS?", "בדיקת ה-Local DNS Cache."],
        ["מה נבדק לפני פנייה לשרת DNS?", "קובץ ה-HOSTS המקומי."],
        ["מי אחראי לפתור כתובות חיצוניות עבור ה-DC?", "ה-Forwarder."],
        ["מה השרשרת המלאה?", "Cache → Hosts → DNS Server → Forwarder → Root → TLD → Authoritative → IP → Ping."],
      ],
      quiz: [
        {
          q: "אחרי ה-Local Cache, היכן מחפש המחשב את השם?",
          options: ["שרת ה-DNS", "קובץ HOSTS", "ה-Root", "ה-Forwarder"],
          answer: 1,
          explain: "קובץ ה-HOSTS נבדק לפני פנייה לשרת DNS.",
        },
        {
          q: "מי פותר כתובת חיצונית כמו ynet.co.il עבור ה-DC?",
          options: ["KCC", "PTR Record", "Forwarder", "Global Catalog"],
          answer: 2,
          explain: "ה-Forwarder מעביר שאילתות חיצוניות הלאה אל ה-Root/TLD.",
        },
      ],
    },

    /* 05 ---------------------------------------------------------- */
    {
      id: "networking",
      num: "05",
      title: "Networking + VLANs",
      icon: "🔌",
      summary: "יסודות רשת: שכבות, VLANs, TCP מול UDP, Subnetting ו-STP/LACP.",
      sections: [
        {
          heading: "רכיבי רשת",
          type: "list",
          items: [
            ["Switch (L2)", "מתג שמעביר תעבורה לפי כתובות MAC."],
            ["Router (L3)", "מנתב בין רשתות שונות לפי IP."],
            ["VLAN", "הפרדה לוגית של הרשת על אותו מתג פיזי."],
            ["Trunk Port", "נושא מספר VLANs בין מתגים/ראוטר."],
            ["Access Port", "שייך ל-VLAN יחיד, מחובר לתחנת קצה."],
            ["NAT", "המרה בין IP פרטי ל-IP ציבורי."],
            ["ARP", "מציאת MAC לפי IP באמצעות Broadcast."],
          ],
        },
        {
          heading: "TCP מול UDP",
          type: "table",
          columns: ["מאפיין", "TCP", "UDP"],
          rows: [
            ["חיבור", "3-Way Handshake", "ללא Handshake"],
            ["אמינות", "מובטח + סדר", "מהיר, ללא ערבות"],
            ["דוגמאות", "HTTP, SSH, SMB, RDP", "DNS, DHCP, VoIP"],
          ],
        },
        {
          heading: "Subnetting",
          type: "table",
          columns: ["CIDR", "Subnet Mask", "Hosts"],
          rows: [
            ["/24", "255.255.255.0", "254"],
            ["/25", "255.255.255.128", "126"],
            ["/16", "255.255.0.0", "65,534"],
          ],
        },
        {
          heading: "STP + LACP",
          type: "list",
          items: [
            ["STP", "Spanning Tree Protocol — מונע לולאות ו-Broadcast Storms."],
            ["RSTP", "גרסה מהירה של STP (Rapid)."],
            ["LACP", "איגום קישורים — רוחב פס + Redundancy."],
          ],
        },
      ],
      flashcards: [
        ["מה ההבדל בין Switch ל-Router?", "Switch עובד ב-L2 לפי MAC; Router ב-L3 ומנתב בין רשתות לפי IP."],
        ["איזה פרוטוקול משתמש DNS בעיקר?", "UDP (וב-TCP להעברות גדולות/Zone Transfer)."],
        ["מה תפקיד STP?", "מניעת לולאות ו-Broadcast Storms ברשת ה-L2."],
        ["מה ההבדל בין Access ל-Trunk Port?", "Access = VLAN יחיד לתחנה; Trunk = מספר VLANs בין מתגים."],
        ["כמה Hosts ב-/24?", "254."],
      ],
      quiz: [
        {
          q: "איזה פרוטוקול מבצע 3-Way Handshake?",
          options: ["UDP", "TCP", "ARP", "ICMP"],
          answer: 1,
          explain: "TCP אמין ומבצע 3-Way Handshake; UDP מהיר וללא חיבור.",
        },
        {
          q: "כמה כתובות Hosts זמינות ב-/25?",
          options: ["254", "126", "62", "510"],
          answer: 1,
          explain: "/25 = 255.255.255.128 → 126 hosts.",
        },
        {
          q: "מה מונע לולאות ברשת L2?",
          options: ["LACP", "NAT", "STP", "ARP"],
          answer: 2,
          explain: "STP (Spanning Tree) מונע לולאות ו-Broadcast Storms.",
        },
      ],
    },

    /* 06 ---------------------------------------------------------- */
    {
      id: "kerberos",
      num: "06",
      title: "Kerberos + Authentication",
      icon: "🎫",
      summary: "פרוטוקול האימות של AD. דורש סנכרון זמן עד 5 דקות (מקור הזמן = PDC Emulator).",
      sections: [
        {
          heading: "6 שלבי Login ב-Kerberos",
          type: "steps",
          items: [
            "Client שולח AS-REQ אל ה-DC (KDC).",
            "ה-DC מחזיר TGT (תקף ~10 שעות).",
            "ה-Client שומר את ה-TGT.",
            "Client שולח TGS-REQ עם ה-TGT.",
            "ה-DC מנפיק Service Ticket.",
            "ה-Client מציג את ה-Ticket לשירות.",
          ],
        },
        {
          heading: "Kerberos מול NTLM",
          type: "table",
          columns: ["מאפיין", "Kerberos", "NTLM"],
          rows: [
            ["סביבה", "Domain", "Fallback: Workgroup, IP"],
            ["אימות", "Mutual Auth, מבוסס Tickets", "Challenge-Response"],
            ["חולשות", "דורש סנכרון זמן 5 דק'", "Pass-the-Hash"],
          ],
        },
      ],
      flashcards: [
        ["מהו חלון הזמן המותר ב-Kerberos?", "5 דקות — מקור הזמן הוא ה-PDC Emulator."],
        ["מה מקבל ה-Client בשלב הראשון?", "TGT (Ticket Granting Ticket), תקף כ-10 שעות."],
        ["מתי המערכת נופלת ל-NTLM?", "ב-Workgroup, גישה לפי IP או כשאין Kerberos — והוא חשוף ל-Pass-the-Hash."],
        ["מה מנפיק ה-DC מול בקשת TGS-REQ?", "Service Ticket לשירות המבוקש."],
      ],
      quiz: [
        {
          q: "מה ה-Client מקבל ראשון מה-KDC?",
          options: ["Service Ticket", "TGT", "SID", "Session Key בלבד"],
          answer: 1,
          explain: "ראשית מתקבל TGT, ובהמשך מתבקש Service Ticket דרך TGS-REQ.",
        },
        {
          q: "לאיזו התקפה חשוף NTLM?",
          options: ["Pass-the-Hash", "Golden Ticket", "DNS Poisoning", "SYN Flood"],
          answer: 0,
          explain: "NTLM חשוף ל-Pass-the-Hash; Kerberos משתמש ב-Tickets ו-Mutual Auth.",
        },
      ],
    },

    /* 07 ---------------------------------------------------------- */
    {
      id: "permissions",
      num: "07",
      title: "Permissions + NTFS",
      icon: "🔐",
      summary: "Share מול NTFS — ההרשאה האפקטיבית היא המגבילה מבין השתיים.",
      sections: [
        {
          heading: "Share מול NTFS",
          type: "list",
          items: [
            ["Share", "חל רק על גישה דרך הרשת."],
            ["NTFS", "חל תמיד — מקומית וגם דרך הרשת."],
            ["אפקטיבי", "ההרשאה המגבילה ביותר מבין Share ו-NTFS."],
            ["Best Practice", "Share = Full Control, ושליטה בפועל דרך NTFS."],
          ],
        },
        {
          heading: "אבחון: אין גישה ל-Share",
          type: "steps",
          items: [
            "Ping + Test-NetConnection server -Port 445.",
            "Windows Firewall / האם SMB מאופשר?",
            "הרשאות Share.",
            "הרשאות NTFS.",
            "DNS / רזולוציית שם של השרת.",
          ],
        },
      ],
      flashcards: [
        ["מה ההרשאה האפקטיבית בין Share ל-NTFS?", "המגבילה ביותר מבין השתיים."],
        ["מה ה-Best Practice להרשאות?", "Share = Full Control, ושליטה בפועל באמצעות NTFS."],
        ["איזה פורט בודקים כשאין גישה ל-Share?", "Port 445 (SMB) — Test-NetConnection server -Port 445."],
        ["מתי חלות הרשאות NTFS?", "תמיד — גם מקומית וגם דרך הרשת. Share חל רק דרך הרשת."],
      ],
      quiz: [
        {
          q: "ההרשאה האפקטיבית בין Share ל-NTFS היא:",
          options: ["המתירנית ביותר", "המגבילה ביותר", "תמיד NTFS", "תמיד Share"],
          answer: 1,
          explain: "המערכת בוחרת את ההרשאה המגבילה ביותר מבין Share ל-NTFS.",
        },
        {
          q: "איזה פורט בודקים ראשון בבעיית גישה ל-Share?",
          options: ["389", "445", "636", "88"],
          answer: 1,
          explain: "445 = SMB, פרוטוקול שיתוף הקבצים.",
        },
      ],
    },

    /* 08 ---------------------------------------------------------- */
    {
      id: "backup",
      num: "08",
      title: "Backup + Disaster Recovery",
      icon: "💾",
      summary: "מה שחשוב הוא ה-Restore, לא ה-Backup. Snapshot אינו גיבוי!",
      sections: [
        {
          heading: "מושגי יסוד",
          type: "list",
          items: [
            ["RPO", "Recovery Point Objective — כמה דאטה מותר לאבד (נקודת זמן)."],
            ["RTO", "Recovery Time Objective — כמה זמן לוקח לחזור לפעילות."],
            ["3-2-1", "3 עותקים · 2 מדיות · 1 מחוץ לאתר."],
          ],
        },
        {
          heading: "סוגי גיבוי",
          type: "table",
          columns: ["סוג", "מה נשמר"],
          rows: [
            ["Full", "גיבוי מלא של הכול."],
            ["Incremental", "השינויים מאז הגיבוי האחרון (כל סוג)."],
            ["Differential", "השינויים מאז ה-Full האחרון."],
          ],
        },
        {
          heading: "Veeam",
          type: "list",
          items: [
            ["ייעוד", "גיבוי Enterprise ל-VMs‏ (VMware / Hyper-V)."],
            ["Instant VM Recovery", "הרצת VM ישירות מהגיבוי לזמן שחזור מהיר."],
            ["Granular Recovery", "שחזור אובייקטים בודדים — קבצים, AD objects."],
            ["⚠ זכרו", "Snapshot אינו גיבוי — Veeam מבוסס Snapshot אך שומר עותק נפרד."],
          ],
        },
      ],
      flashcards: [
        ["מה ההבדל בין RPO ל-RTO?", "RPO = כמה דאטה מותר לאבד. RTO = כמה זמן לוקח לחזור לפעילות."],
        ["מהו כלל 3-2-1?", "3 עותקים, 2 מדיות שונות, 1 מחוץ לאתר."],
        ["מה ההבדל בין Incremental ל-Differential?", "Incremental = שינויים מאז הגיבוי האחרון; Differential = שינויים מאז ה-Full האחרון."],
        ["האם Snapshot הוא גיבוי?", "לא! Snapshot אינו גיבוי. צריך פתרון כמו Veeam."],
      ],
      quiz: [
        {
          q: "RPO מגדיר:",
          options: ["כמה זמן לוקח לשחזר", "כמה דאטה מותר לאבד", "מספר העותקים", "גודל הגיבוי"],
          answer: 1,
          explain: "RPO = נקודת השחזור, כלומר כמה דאטה (זמן) מותר לאבד. RTO = משך השחזור.",
        },
        {
          q: "Differential שומר את:",
          options: ["השינויים מאז הגיבוי האחרון", "השינויים מאז ה-Full האחרון", "הכול בכל פעם", "רק קבצים שנמחקו"],
          answer: 1,
          explain: "Differential = שינויים מאז ה-Full האחרון; Incremental = מאז הגיבוי האחרון מכל סוג.",
        },
      ],
    },

    /* 09 ---------------------------------------------------------- */
    {
      id: "vmware",
      num: "09",
      title: "VMware + Virtualization",
      icon: "🖥️",
      summary: "וירטואליזציה עם ESXi, vCenter ו-vMotion. Snapshot אינו גיבוי.",
      sections: [
        {
          heading: "מושגי VMware",
          type: "list",
          items: [
            ["ESXi", "Hypervisor מסוג Type-1 (Bare Metal)."],
            ["Snapshot", "תמונת מצב נקודתית — לא גיבוי, לא שומרים לאורך זמן."],
            ["Datastore", "אחסון ל-VMs (.vmdk) — Local, SAN, NAS."],
            ["vSwitch", "מתג וירטואלי שמחבר את ה-VMs."],
            ["vMotion", "העברת VM חיה בין Hosts ללא Downtime."],
            ["vCenter", "ניהול מרכזי של כל שרתי ה-ESXi."],
          ],
        },
      ],
      flashcards: [
        ["מאיזה סוג Hypervisor הוא ESXi?", "Type-1 (Bare Metal)."],
        ["מה מאפשר vMotion?", "העברת VM חיה בין Hosts ללא Downtime."],
        ["מה תפקיד vCenter?", "ניהול מרכזי של כל שרתי ה-ESXi."],
        ["האם Snapshot מתאים לשמירה ארוכת טווח?", "לא — Snapshot אינו גיבוי; לגיבוי משתמשים ב-Veeam."],
      ],
      quiz: [
        {
          q: "מהו ESXi?",
          options: ["Hypervisor Type-2", "Hypervisor Type-1", "כלי גיבוי", "מתג וירטואלי"],
          answer: 1,
          explain: "ESXi הוא Hypervisor מסוג Type-1 הרץ ישירות על החומרה.",
        },
        {
          q: "מה מעביר VM חיה בין Hosts ללא Downtime?",
          options: ["vSwitch", "Datastore", "vMotion", "Snapshot"],
          answer: 2,
          explain: "vMotion מבצע העברה חיה (Live Migration) של VM בין Hosts.",
        },
      ],
    },

    /* 10 ---------------------------------------------------------- */
    {
      id: "azure",
      num: "10",
      title: "Azure + Entra ID + Intune",
      icon: "☁️",
      summary: "הזהות בענן: ההבדל בין AD מסורתי ל-Entra ID, סוגי Join, ו-Intune (MDM/MAM).",
      sections: [
        {
          heading: "AD מול Entra ID",
          type: "table",
          columns: ["מאפיין", "AD", "Entra ID"],
          rows: [
            ["פרוטוקול", "LDAP + Kerberos", "OAuth2 + OIDC"],
            ["Join", "Domain Join", "Azure AD Join"],
            ["מיקום", "On-Premises", "Cloud"],
            ["ניהול", "ADUC, PowerShell", "Entra Portal"],
          ],
        },
        {
          heading: "סוגי Join",
          type: "list",
          items: [
            ["Domain Join", "AD מקומי — GPO ואפליקציות Legacy."],
            ["Azure AD Join", "Cloud-First — מדיניות דרך Intune."],
            ["Hybrid Join", "שילוב מקומי+ענן דרך Azure AD Connect."],
          ],
        },
        {
          heading: "Intune",
          type: "list",
          items: [
            ["MDM", "ניהול המכשיר: Policy, Wipe, Apps."],
            ["MAM", "ניהול דאטה באפליקציות — מתאים ל-BYOD."],
            ["Conditional Access", "גישה מותנית לפי Compliance Policy."],
            ["בדיקה", "dsregcmd /status → AzureAdJoined, DomainJoined, AzureAdPrt."],
          ],
        },
      ],
      flashcards: [
        ["באילו פרוטוקולים משתמש Entra ID?", "OAuth2 + OIDC (לעומת LDAP+Kerberos ב-AD)."],
        ["מה ההבדל בין MDM ל-MAM?", "MDM מנהל את המכשיר; MAM מנהל את הדאטה באפליקציות (BYOD)."],
        ["מה מחבר AD מקומי ל-Azure?", "Azure AD Connect (Hybrid Join)."],
        ["איזו פקודה בודקת מצב Join?", "dsregcmd /status."],
      ],
      quiz: [
        {
          q: "איזה סוג Join מתאים ל-BYOD עם ניהול דאטה בלבד?",
          options: ["Domain Join", "MAM", "MDM", "Hybrid Join"],
          answer: 1,
          explain: "MAM מנהל את הדאטה באפליקציות בלבד — מתאים ל-BYOD.",
        },
        {
          q: "איזה פרוטוקול אימות מזוהה עם Entra ID?",
          options: ["Kerberos", "LDAP", "OAuth2 / OIDC", "NTLM"],
          answer: 2,
          explain: "Entra ID משתמש ב-OAuth2 + OIDC; AD מסורתי ב-LDAP+Kerberos.",
        },
      ],
    },

    /* 11 ---------------------------------------------------------- */
    {
      id: "troubleshooting",
      num: "11",
      title: "Troubleshooting Scenarios",
      icon: "🛠️",
      summary: "תרחישי אבחון קלאסיים מהראיון — תמיד מ-Layer 1 ולמעלה, שלב אחר שלב.",
      sections: [
        {
          heading: "תרחיש 1 — משתמש לא מצליח להתחבר לדומיין",
          type: "steps",
          items: [
            "ping ל-DC — יש קישוריות?",
            "nslookup domain.local — ה-DNS פותר?",
            "w32tm /query /status — סנכרון זמן תקין?",
            "nltest /dclist:domain — אילו DCs זמינים?",
            "Event Viewer → Security → Event 4625.",
            "C:\\Windows\\debug\\netlogon.log.",
          ],
        },
        {
          heading: "תרחיש 2 — אין גישה ל-Share",
          type: "steps",
          items: [
            "Test-NetConnection server -Port 445.",
            "Windows Firewall / SMB מאופשר?",
            "הרשאות Share.",
            "הרשאות NTFS.",
          ],
        },
        {
          heading: "תרחיש 3 — אתר / אפליקציה לא עולים",
          type: "steps",
          items: [
            "ping — קישוריות בסיסית?",
            "nslookup site.domain.local.",
            "Test-NetConnection server -Port 443.",
            "IIS — App Pool של האתר רץ?",
            "Event Viewer → Application.",
          ],
        },
        {
          heading: "תרחיש 4 — GPO לא חל",
          type: "steps",
          items: [
            "gpresult /r — מה חל בפועל?",
            "gpupdate /force.",
            "האם ה-GPO מקושר ל-OU הנכון?",
            "Security Filtering — המשתמש כלול?",
            "repadmin /replsummary — Replication תקין?",
          ],
        },
      ],
      flashcards: [
        ["מה בודקים ראשון כשמשתמש לא מתחבר לדומיין?", "ping ל-DC ואז nslookup domain.local — קישוריות ו-DNS."],
        ["איזה Event ID מעיד על כשל התחברות?", "4625 (Logon Failed)."],
        ["מה בודקים כש-GPO לא חל?", "gpresult /r, קישור ל-OU, Security Filtering ו-Replication."],
        ["איזו פקודה מציגה DCs זמינים בדומיין?", "nltest /dclist:domain."],
      ],
      quiz: [
        {
          q: "משתמש לא מתחבר לדומיין. מה הצעד ההגיוני הראשון?",
          options: ["gpupdate /force", "ping/DNS ל-DC", "להחליף סיסמה", "Rebuild DC"],
          answer: 1,
          explain: "תמיד מתחילים מהבסיס: קישוריות (ping) ורזולוציית שם (nslookup) ל-DC.",
        },
        {
          q: "GPO לא חל למרות עריכה. מה כדאי לבדוק?",
          options: ["Port 445", "Security Filtering וקישור ל-OU", "Snapshot", "vMotion"],
          answer: 1,
          explain: "בודקים שה-GPO מקושר ל-OU הנכון ושה-Security Filtering כולל את המשתמש.",
        },
      ],
    },

    /* 12 ---------------------------------------------------------- */
    {
      id: "event-ids",
      num: "12",
      title: "Event Viewer + Event IDs",
      icon: "📋",
      summary: "ה-Event Viewer הוא הכלי הראשון של ה-SysAdmin. שווה לזכור את ה-IDs המרכזיים.",
      sections: [
        {
          heading: "Event IDs מרכזיים",
          type: "table",
          columns: ["Event ID", "Log", "משמעות"],
          rows: [
            ["4624", "Security", "Login הצליח"],
            ["4625", "Security", "Login נכשל ✗"],
            ["4740", "Security", "Account Lockout"],
            ["4720", "Security", "נוצר משתמש"],
            ["4726", "Security", "נמחק משתמש"],
            ["4728", "Security", "נוסף לקבוצת אבטחה (Global)"],
            ["4648", "Security", "Login עם Credentials מפורשים (Run As)"],
            ["4672", "Security", "Login עם הרשאות Admin"],
            ["4719", "Security", "שינוי Audit Policy"],
            ["7045", "System", "הותקן Service חדש"],
            ["1102", "Security", "⚠ ה-Security Log נוקה!"],
            ["1864", "Directory", "Replication לא בוצע 14+ ימים"],
            ["2042", "Directory", "Replication בהסגר 60+ ימים"],
          ],
        },
        {
          heading: "חקירת Account Lockout",
          type: "steps",
          items: [
            "Event Viewer → Security Log על ה-DC → Event 4740.",
            "לזהות את מקור ה-4740.",
            "לחפש Event 4625 ב-Security Log של המקור.",
            "לבדוק: Mapped Drives? טלפון? Scheduled Task?",
            "Get-ADUser -Identity user -Properties LockedOut,BadLogonCount.",
          ],
        },
      ],
      flashcards: [
        ["מה אומר Event 4625?", "Login נכשל."],
        ["מה אומר Event 4740?", "Account Lockout — נעילת חשבון."],
        ["מה משמעות Event 1102?", "ה-Security Log נוקה — סימן אזהרה אבטחתי!"],
        ["איזה Event ID מעיד על התקנת Service חדש?", "7045 (ב-System Log)."],
        ["מה הצעד הראשון בחקירת נעילת חשבון?", "לאתר Event 4740 ב-Security Log של ה-DC."],
      ],
      quiz: [
        {
          q: "איזה Event ID מעיד על נעילת חשבון?",
          options: ["4625", "4740", "4624", "4672"],
          answer: 1,
          explain: "4740 = Account Lockout. 4625 = Login נכשל.",
        },
        {
          q: "Event 1102 מסמן:",
          options: ["Login מוצלח", "ניקוי ה-Security Log", "התקנת Service", "שינוי סיסמה"],
          answer: 1,
          explain: "1102 = ה-Security Log נוקה — דגל אדום מבחינה אבטחתית.",
        },
      ],
    },

    /* 13 ---------------------------------------------------------- */
    {
      id: "ports",
      num: "13",
      title: "Ports + Commands",
      icon: "🔢",
      summary: "טבלת הפורטים שחובה לדעת בעל-פה לראיון SysAdmin.",
      sections: [
        {
          heading: "פורטים נפוצים",
          type: "table",
          columns: ["Port", "Protocol", "שימוש"],
          rows: [
            ["53", "DNS", "Name Resolution"],
            ["88", "Kerberos", "אימות (AD Login)"],
            ["123", "NTP", "סנכרון זמן — קריטי ל-Kerberos!"],
            ["135", "RPC", "Remote Procedure Call — AD, DCOM"],
            ["389", "LDAP", "AD Queries"],
            ["445", "SMB", "File Sharing"],
            ["636", "LDAPS", "LDAP מוצפן (SSL)"],
            ["3268", "GC", "Global Catalog — Cross-domain"],
            ["3269", "GC SSL", "Global Catalog over SSL"],
            ["80", "HTTP", "Web Traffic"],
            ["443", "HTTPS", "Web מאובטח (TLS/SSL)"],
            ["3389", "RDP", "Remote Desktop"],
            ["5985", "WinRM", "PowerShell Remoting (HTTP)"],
            ["5986", "WinRM", "PowerShell Remoting (HTTPS)"],
            ["22", "SSH", "Secure Shell (Linux)"],
            ["25", "SMTP", "דואר יוצא"],
            ["49152+", "RPC Dyn", "Dynamic RPC — AD Replication!"],
          ],
        },
      ],
      flashcards: [
        ["איזה פורט משמש Kerberos?", "88."],
        ["איזה פורט משמש LDAP, ואיזה LDAPS?", "389 (LDAP), 636 (LDAPS)."],
        ["מה הפורט של SMB?", "445."],
        ["איזה פורט קריטי לסנכרון זמן?", "123 (NTP)."],
        ["מה טווח הפורטים של Dynamic RPC?", "49152 ומעלה — קריטי ל-AD Replication."],
      ],
      quiz: [
        {
          q: "באיזה פורט עובד Kerberos?",
          options: ["53", "88", "389", "445"],
          answer: 1,
          explain: "Kerberos = 88. 53=DNS, 389=LDAP, 445=SMB.",
        },
        {
          q: "פורט 636 משמש ל:",
          options: ["LDAP", "LDAPS", "SMB", "RDP"],
          answer: 1,
          explain: "636 = LDAPS (LDAP מוצפן). 389 = LDAP רגיל.",
        },
        {
          q: "איזה פורט חיוני לסנכרון זמן עבור Kerberos?",
          options: ["123 (NTP)", "135 (RPC)", "88 (Kerberos)", "53 (DNS)"],
          answer: 0,
          explain: "NTP על פורט 123 מסנכרן זמן — קריטי כי Kerberos דורש פער עד 5 דקות.",
        },
      ],
    },

    /* 14 ---------------------------------------------------------- */
    {
      id: "linux-essentials",
      num: "14",
      title: "Linux — יסודות",
      icon: "🐧",
      summary: "יסודות Linux לסיסטם: מבנה הקבצים (FHS), הרשאות, משתמשים ותהליכים.",
      sections: [
        {
          heading: "מבנה מערכת הקבצים (FHS)",
          type: "table",
          columns: ["נתיב", "תפקיד"],
          rows: [
            ["/etc", "קבצי קונפיגורציה של המערכת והשירותים."],
            ["/var/log", "לוגים."],
            ["/home", "תיקיות הבית של המשתמשים."],
            ["/tmp", "קבצים זמניים (נמחקים)."],
            ["/proc", "מידע על תהליכים והקרנל (וירטואלי)."],
            ["/bin, /usr/bin", "תוכניות הרצה (binaries)."],
            ["/opt", "תוכנות צד-שלישי."],
          ],
        },
        {
          heading: "הרשאות קבצים",
          type: "list",
          items: [
            ["rwx", "Read(4) · Write(2) · Execute(1) — לכל אחד מ-User / Group / Other."],
            ["chmod", "שינוי הרשאות: chmod 755 file · chmod u+x file."],
            ["דוגמאות", "644 = rw-r--r-- (קובץ) · 755 = rwxr-xr-x (תיקייה/הרצה)."],
            ["chown / chgrp", "שינוי בעלים / קבוצה: chown user:group file."],
            ["SUID / SGID / Sticky", "הרצה בהרשאת הבעלים / קבוצה / מחיקה רק לבעלים (כמו /tmp)."],
          ],
        },
        {
          heading: "משתמשים וקבוצות",
          type: "table",
          columns: ["פריט", "תיאור"],
          rows: [
            ["/etc/passwd", "רשימת משתמשים (ללא סיסמאות)."],
            ["/etc/shadow", "סיסמאות מוצפנות (hash)."],
            ["useradd / usermod", "יצירה / עריכת משתמש."],
            ["passwd", "שינוי סיסמה."],
            ["sudo / /etc/sudoers", "הרצת פקודה כ-root (visudo לעריכה בטוחה)."],
            ["su -", "מעבר למשתמש אחר / root."],
          ],
        },
        {
          heading: "תהליכים (Processes)",
          type: "list",
          items: [
            ["ps aux", "רשימת כל התהליכים הרצים."],
            ["top / htop", "ניטור חי של CPU/זיכרון ותהליכים."],
            ["kill / kill -9", "סיום תהליך: -15 (SIGTERM, מסודר) · -9 (SIGKILL, כפוי)."],
            ["Signals", "1=SIGHUP (reload) · 15=SIGTERM · 9=SIGKILL."],
            ["&  /  nohup  /  jobs", "הרצה ברקע, ניתוק מהטרמינל, וצפייה ב-jobs."],
          ],
        },
      ],
      flashcards: [
        ["מה ההרשאה 755 במונחי rwx?", "rwxr-xr-x — בעלים מלא, קבוצה ואחרים קריאה+הרצה."],
        ["איפה נשמרות הסיסמאות המוצפנות?", "‎/etc/shadow (ב-/etc/passwd יש רק את המשתמשים)."],
        ["מה ההבדל בין kill -15 ל-kill -9?", "‎-15 (SIGTERM) מבקש סיום מסודר; -9 (SIGKILL) הורג מיד בכפייה."],
        ["איזו תיקייה מכילה קונפיגורציות מערכת?", "‎/etc."],
        ["מה עושה SUID?", "מריץ את הקובץ בהרשאות הבעלים שלו ולא של המריץ."],
      ],
      quiz: [
        {
          q: "איזו פקודה משנה בעלות על קובץ?",
          options: ["chmod", "chown", "chgrp", "passwd"],
          answer: 1,
          explain: "chown משנה בעלים (ואפשר גם קבוצה: chown user:group). chmod משנה הרשאות.",
        },
        {
          q: "הרשאה 644 משמעותה:",
          options: ["rwxr-xr-x", "rw-r--r--", "rwxrwxrwx", "r--r--r--"],
          answer: 1,
          explain: "6=rw לבעלים, 4=r לקבוצה, 4=r לאחרים → rw-r--r--.",
        },
        {
          q: "איזה סיגנל הורג תהליך בכפייה ולא ניתן להתעלם ממנו?",
          options: ["SIGTERM (15)", "SIGHUP (1)", "SIGKILL (9)", "SIGINT (2)"],
          answer: 2,
          explain: "SIGKILL (9) מסיים מיידית ולא ניתן ליירוט; SIGTERM (15) מאפשר סיום מסודר.",
        },
      ],
    },

    /* 15 ---------------------------------------------------------- */
    {
      id: "linux-ops",
      num: "15",
      title: "Linux — תפעול",
      icon: "🧰",
      summary: "ניהול שירותים (systemd), לוגים, Cron, רשת, ניהול חבילות ואחסון ב-Linux.",
      sections: [
        {
          heading: "systemd — ניהול שירותים",
          type: "table",
          columns: ["פקודה", "מטרה"],
          rows: [
            ["systemctl status sshd", "מצב השירות"],
            ["systemctl start/stop/restart sshd", "הפעלה/עצירה/אתחול"],
            ["systemctl enable/disable sshd", "הפעלה אוטומטית בעלייה"],
            ["systemctl daemon-reload", "טעינת unit files מחדש לאחר שינוי"],
            ["journalctl -u sshd", "לוגים של שירות מסוים"],
            ["journalctl -xe", "הלוגים האחרונים + הסברים (לאבחון תקלות)"],
          ],
        },
        {
          heading: "לוגים",
          type: "list",
          items: [
            ["/var/log/syslog · messages", "לוג מערכת כללי (Debian / RHEL)."],
            ["/var/log/auth.log · secure", "אירועי אימות והתחברות."],
            ["journalctl", "לוג מרכזי של systemd (-f למעקב חי)."],
            ["dmesg", "הודעות הקרנל (חומרה, drivers)."],
            ["tail -f / grep", "מעקב חי וסינון בלוגים."],
          ],
        },
        {
          heading: "Cron — משימות מתוזמנות",
          type: "list",
          items: [
            ["crontab -e / -l", "עריכה / הצגה של משימות המשתמש."],
            ["פורמט", "דקה · שעה · יום-בחודש · חודש · יום-בשבוע · פקודה."],
            ["דוגמה", "0 2 * * * /backup.sh = כל יום ב-02:00."],
            ["systemd timers", "חלופה מודרנית ל-cron."],
          ],
        },
        {
          heading: "ניהול חבילות",
          type: "table",
          columns: ["משפחה", "כלים"],
          rows: [
            ["Debian / Ubuntu", "apt, apt-get, dpkg (.deb)"],
            ["RHEL / CentOS / Fedora", "dnf, yum, rpm (.rpm)"],
            ["פעולות", "install · update · remove · search"],
          ],
        },
        {
          heading: "רשת ואחסון",
          type: "table",
          columns: ["פקודה", "מטרה"],
          rows: [
            ["ip a / ip r", "כתובות IP / טבלת ניתוב"],
            ["ss -tulpn", "פורטים פתוחים ושירותים שמאזינים"],
            ["dig / nslookup / curl", "DNS ובדיקות HTTP"],
            ["df -h / du -sh", "שטח דיסק פנוי / גודל תיקייה"],
            ["lsblk / mount / /etc/fstab", "דיסקים, עיגון, עיגון קבוע"],
            ["ufw / firewalld", "חומת אש"],
          ],
        },
      ],
      flashcards: [
        ["איך גורמים לשירות לעלות אוטומטית בכל אתחול?", "systemctl enable <service>."],
        ["איזו פקודה מציגה לוגים של שירות ספציפי?", "journalctl -u <service>."],
        ["מה משמעות '0 2 * * *' ב-cron?", "כל יום בשעה 02:00."],
        ["איזו פקודה מציגה פורטים פתוחים ושירותים מאזינים?", "ss -tulpn."],
        ["מה ההבדל בין apt ל-dnf?", "apt למשפחת Debian/Ubuntu, dnf/yum למשפחת RHEL."],
        ["מתי מריצים systemctl daemon-reload?", "אחרי שינוי קובץ unit, כדי ש-systemd יטען אותו מחדש."],
      ],
      quiz: [
        {
          q: "איזו פקודה תציג את הלוגים האחרונים לאבחון תקלת שירות?",
          options: ["journalctl -xe", "ps aux", "df -h", "ip a"],
          answer: 0,
          explain: "journalctl -xe מציג את הרשומות האחרונות עם הסברים — נקודת פתיחה לאבחון.",
        },
        {
          q: "באיזו משפחת הפצות משתמשים ב-dnf/yum?",
          options: ["Debian/Ubuntu", "RHEL/CentOS/Fedora", "Arch", "Alpine"],
          answer: 1,
          explain: "dnf/yum (וחבילות rpm) שייכים למשפחת RHEL; apt/dpkg למשפחת Debian.",
        },
        {
          q: "מה מציגה הפקודה df -h?",
          options: ["תהליכים", "שטח דיסק פנוי", "פורטים פתוחים", "כתובות IP"],
          answer: 1,
          explain: "df -h = שטח הדיסק הפנוי/בשימוש בפורמט קריא. du -sh = גודל תיקייה.",
        },
      ],
    },

    /* 16 ---------------------------------------------------------- */
    {
      id: "powershell",
      num: "16",
      title: "PowerShell + Automation",
      icon: "⌨️",
      summary: "PowerShell לאוטומציה: cmdlets, pipeline מבוסס אובייקטים, סקריפטים ו-Remoting.",
      sections: [
        {
          heading: "מבנה ועזרה",
          type: "list",
          items: [
            ["Verb-Noun", "כל cmdlet בתבנית פועל-שם: Get-Service, Set-ADUser, New-Item, Remove-Item."],
            ["Get-Help", "עזרה על פקודה: Get-Help Get-Process -Examples."],
            ["Get-Command", "מציאת פקודות: Get-Command *service*."],
            ["Get-Member", "חשיפת המאפיינים והמתודות של אובייקט בצינור."],
          ],
        },
        {
          heading: "Pipeline ואובייקטים",
          type: "table",
          columns: ["Cmdlet", "מטרה"],
          rows: [
            ["Where-Object", "סינון: ‏... | Where-Object {$_.Status -eq 'Running'}"],
            ["Select-Object", "בחירת שדות: Select-Object Name, CPU"],
            ["Sort-Object", "מיון תוצאות"],
            ["ForEach-Object", "פעולה על כל פריט בצינור"],
            ["Export-Csv", "ייצוא תוצאות לקובץ CSV"],
          ],
        },
        {
          heading: "משתנים וזרימת תוכנית",
          type: "list",
          items: [
            ["משתנים", "$name = \"DC01\" · מערכים @(...) · Hashtable @{}"],
            ["תנאים ולולאות", "if / else · foreach · while."],
            ["פונקציות", "function Get-Foo { param($x) ... }"],
            ["טיפול בשגיאות", "try { ... } catch { ... } · -ErrorAction Stop."],
          ],
        },
        {
          heading: "AD ו-Remoting",
          type: "table",
          columns: ["פקודה", "מטרה"],
          rows: [
            ["Get-ADUser -Identity user", "פרטי משתמש ב-AD"],
            ["Search-ADAccount -LockedOut", "חשבונות נעולים"],
            ["Get-ADGroupMember 'IT'", "חברי קבוצה"],
            ["Enter-PSSession DC02", "סשן אינטראקטיבי מרחוק (WinRM)"],
            ["Invoke-Command -ComputerName DC02 {…}", "הרצת פקודה על שרת מרוחק"],
            ["Get-WinEvent / Get-Service", "לוגים ושירותים"],
          ],
        },
      ],
      flashcards: [
        ["מהי תבנית השמות של cmdlet?", "Verb-Noun (פועל-שם), למשל Get-Service."],
        ["איזו cmdlet חושפת את מאפייני האובייקט בצינור?", "Get-Member."],
        ["איך מסננים תוצאות בצינור?", "Where-Object {$_.Property -eq 'value'}."],
        ["מה מאפשר Invoke-Command?", "הרצת פקודה/בלוק על מחשב מרוחק דרך WinRM."],
        ["איזו פקודה מאתרת חשבונות נעולים ב-AD?", "Search-ADAccount -LockedOut."],
      ],
      quiz: [
        {
          q: "איזו cmdlet משמשת לסינון פריטים בצינור?",
          options: ["Select-Object", "Where-Object", "Sort-Object", "Get-Member"],
          answer: 1,
          explain: "Where-Object מסנן לפי תנאי; Select-Object בוחר שדות מתוך אובייקט.",
        },
        {
          q: "PowerShell Remoting מבוסס על:",
          options: ["RDP", "SMB", "WinRM", "LDAP"],
          answer: 2,
          explain: "Remoting עובד מעל WinRM (פורטים 5985/5986).",
        },
      ],
    },

    /* 17 ---------------------------------------------------------- */
    {
      id: "win-infra",
      num: "17",
      title: "Windows Infrastructure מתקדם",
      icon: "🏛️",
      summary: "מעבר ל-AD: DHCP, PKI/Certificates, Patching (WSUS) ויסודות Exchange.",
      sections: [
        {
          heading: "DHCP — תהליך DORA",
          type: "steps",
          items: [
            "Discover — הלקוח משדר בקשה לכתובת (Broadcast).",
            "Offer — שרת ה-DHCP מציע כתובת פנויה.",
            "Request — הלקוח מבקש את ההצעה.",
            "Acknowledge — השרת מאשר ומחכיר (Lease).",
          ],
        },
        {
          heading: "מושגי DHCP",
          type: "list",
          items: [
            ["Scope", "טווח כתובות שהשרת מחלק."],
            ["Reservation", "כתובת קבועה ללקוח לפי MAC."],
            ["Lease", "משך ההשכרה של הכתובת."],
            ["Options", "‏003 = Gateway · 006 = DNS · 015 = Domain."],
            ["DHCP Relay / Helper", "העברת בקשות בין רשתות (כש-DHCP לא באותו Subnet)."],
          ],
        },
        {
          heading: "PKI ו-Certificates",
          type: "list",
          items: [
            ["CA", "Certificate Authority — Root CA + Subordinate/Issuing CA."],
            ["מפתחות", "Public/Private Key — הצפנה אסימטרית וחתימה דיגיטלית."],
            ["CSR", "Certificate Signing Request — בקשה לחתימת תעודה."],
            ["CRL", "Certificate Revocation List — תעודות שבוטלו."],
            ["Autoenrollment", "הנפקת תעודות אוטומטית דרך GPO."],
            ["TLS/SSL", "התעודה מאמתת זהות ומצפינה תעבורה (HTTPS, LDAPS)."],
          ],
        },
        {
          heading: "Patching ו-Exchange",
          type: "list",
          items: [
            ["WSUS", "ניהול עדכוני Windows מרכזי: Approve/Decline, Computer Groups."],
            ["Patch Tuesday", "מיקרוסופט משחררת עדכונים בשלישי השני של החודש."],
            ["SCCM / Intune", "פריסת עדכונים ותוכנה בקנה מידה ארגוני."],
            ["Exchange Roles", "Mailbox · Client Access · Transport (תורי דואר)."],
            ["Exchange חיבוריות", "OWA, Send/Receive Connectors, Hybrid מול Exchange Online."],
          ],
        },
      ],
      flashcards: [
        ["מהם שלבי DHCP?", "DORA: Discover → Offer → Request → Acknowledge."],
        ["מה ההבדל בין Root CA ל-Issuing CA?", "Root CA הוא שורש האמון (אופליין מומלץ); Issuing/Subordinate מנפיק תעודות בפועל."],
        ["מהו CSR?", "Certificate Signing Request — בקשה ל-CA לחתום על תעודה."],
        ["מה תפקיד WSUS?", "ניהול ואישור מרכזי של עדכוני Windows לתחנות ושרתים."],
        ["מה מבטיח TLS/SSL?", "אימות זהות (תעודה) + הצפנת התעבורה."],
      ],
      quiz: [
        {
          q: "מה הסדר הנכון של תהליך DHCP?",
          options: ["Discover, Offer, Request, Ack", "Request, Offer, Ack, Discover", "Offer, Discover, Ack, Request", "Ack, Request, Offer, Discover"],
          answer: 0,
          explain: "DORA: Discover → Offer → Request → Acknowledge.",
        },
        {
          q: "איזה רכיב PKI מפרסם תעודות שבוטלו?",
          options: ["CSR", "CRL", "CA Root", "Autoenrollment"],
          answer: 1,
          explain: "CRL = Certificate Revocation List — רשימת התעודות המבוטלות.",
        },
        {
          q: "DHCP Option 006 מגדיר:",
          options: ["Default Gateway", "DNS Server", "Domain Name", "Lease Time"],
          answer: 1,
          explain: "006 = DNS. 003 = Gateway, 015 = Domain Name.",
        },
      ],
    },

    /* 18 ---------------------------------------------------------- */
    {
      id: "behavioral",
      num: "18",
      title: "ראיון התנהגותי + HR",
      icon: "🤝",
      summary: "החלק הרך של הראיון: שיטת STAR, שאלות נפוצות, ואיך לענות נכון.",
      sections: [
        {
          heading: "שיטת STAR למענה",
          type: "list",
          items: [
            ["S — Situation", "תאר בקצרה את ההקשר/המצב."],
            ["T — Task", "מה הייתה המשימה/האחריות שלך."],
            ["A — Action", "מה בדיוק עשית (גוף ראשון, צעדים קונקרטיים)."],
            ["R — Result", "מה הייתה התוצאה — רצוי עם מספר/השפעה."],
          ],
        },
        {
          heading: "שאלות נפוצות ואיך לגשת",
          type: "list",
          items: [
            ["ספר על עצמך", "30–60 שניות: רקע → ניסיון רלוונטי → למה התפקיד הזה."],
            ["תקלה מורכבת שפתרת", "STAR + הדגש תהליך אבחון מסודר ולמידה."],
            ["קונפליקט עם עמית", "הראה תקשורת ובגרות, לא האשמות."],
            ["טעות שעשית", "בחר טעות אמיתית + מה תיקנת ומה למדת."],
            ["למה לעזוב את התפקיד הקודם", "חיובי וקדימה — צמיחה, לא ביקורת על המעסיק."],
            ["איפה בעוד 5 שנים", "התפתחות מקצועית בכיוון התפקיד (Senior/תשתיות/Cloud)."],
          ],
        },
        {
          heading: "טיפים שמראיינים אוהבים",
          type: "list",
          items: [
            ["תהליך troubleshooting", "הראה גישה שיטתית: שכבה אחר שכבה, לא ניחושים."],
            ["\"אני לא יודע\"", "מודים בכנות — ואז מסבירים איך הייתם מוצאים את התשובה."],
            ["תקשורת עם משתמש", "להסביר בשפה פשוטה, לעדכן, לתעד."],
            ["Under pressure / On-call", "תיעדוף, רוגע, ותקשורת ברורה תחת לחץ."],
          ],
        },
        {
          heading: "שאלות לשאול את המראיין",
          type: "list",
          items: [
            ["על הצוות", "איך בנוי הצוות ומי אני עובד מולו?"],
            ["על התפקיד", "איך נראה יום טיפוסי? מהם האתגרים הגדולים?"],
            ["על צמיחה", "אילו מסלולי התפתחות והכשרה יש?"],
            ["על הסביבה", "אילו טכנולוגיות בשימוש? Cloud, אוטומציה?"],
          ],
        },
      ],
      flashcards: [
        ["מה ראשי התיבות STAR?", "Situation, Task, Action, Result — מבנה לתשובה התנהגותית."],
        ["מה עונים כששואלים משהו שלא יודעים?", "מודים בכנות ומסבירים איך היינו מאתרים את התשובה — לא ממציאים."],
        ["איך עונים על 'ספר על עצמך'?", "30–60 שניות: רקע קצר → ניסיון רלוונטי → למה התפקיד הזה."],
        ["איך מדברים על המעסיק הקודם?", "בחיוב וקדימה (צמיחה), בלי לדבר רע."],
      ],
      quiz: [
        {
          q: "במהלך הראיון נשאלת שאלה טכנית שאינך יודע. מה הכי נכון?",
          options: ["לנחש בביטחון", "להגיד 'אני לא יודע' ולהמשיך", "להודות, ולהסביר איך היית מוצא את התשובה", "לשנות נושא"],
          answer: 2,
          explain: "כנות + גישה לפתרון מרשימה הרבה יותר מניחוש. מראיינים בודקים תהליך חשיבה.",
        },
        {
          q: "מהי מטרת ה-R ב-STAR?",
          options: ["לתאר את המצב", "לתאר את הפעולה", "להציג את התוצאה/ההשפעה", "לשאול שאלה"],
          answer: 2,
          explain: "R = Result — סוגר את הסיפור עם תוצאה מדידה ככל האפשר.",
        },
      ],
    },

    /* 19 ---------------------------------------------------------- */
    {
      id: "summary",
      num: "19",
      title: "סיכום + Home Lab",
      icon: "🎯",
      summary: "המסרים המרכזיים לראיון — ואיך לבנות Home Lab שמרשים מראיינים.",
      sections: [
        {
          heading: "המשפטים שכדאי לזרוק בראיון",
          type: "list",
          items: [
            ["DNS", "DNS הוא הלב של AD — בלעדיו אין Login, GPO ושירות."],
            ["Kerberos", "מבוסס Tickets ודורש סנכרון זמן עד 5 דקות."],
            ["Replication", "מאבחנים עם repadmin /replsummary ו-dcdiag."],
            ["GPO", "סדר LSDOU; Enforced גובר על Block Inheritance."],
            ["Global Catalog", "נדרש ל-UPN login, Universal Groups ו-Cross-Forest."],
            ["Permissions", "האפקטיבי = המגבילה ביותר בין Share ל-NTFS."],
            ["Snapshot", "Snapshot אינו גיבוי — לגיבוי משתמשים ב-Veeam."],
            ["Backup", "מה שחשוב הוא ה-Restore, לא ה-Backup."],
          ],
        },
        {
          heading: "Home Lab — איך להרשים",
          type: "list",
          items: [
            ["תשתית", "ESXi כ-Hypervisor, DC לדומיין, Veeam לגיבוי."],
            ["מתקדם", "PKI, זהות Hybrid (Azure AD Connect)."],
            ["גישה", "להראות שאתם מתנסים בעצמכם — זה מבדיל מועמדים."],
          ],
        },
      ],
      flashcards: [
        ["מה המשפט המרכזי על DNS?", "DNS הוא הלב של AD — בלעדיו אין Login, GPO ושירות."],
        ["מה ההבדל המהותי בין Snapshot לגיבוי?", "Snapshot אינו גיבוי — צריך פתרון כמו Veeam."],
        ["מה מבדיל מועמד טוב בראיון?", "Home Lab משלו (DC, ESXi, Veeam, Hybrid) שמראה התנסות עצמית."],
      ],
      quiz: [
        {
          q: "מה הגישה הנכונה לגבי גיבויים?",
          options: ["Snapshot מספיק", "מה שחשוב הוא ה-Restore", "גיבוי אחד באתר מספיק", "Differential תמיד עדיף"],
          answer: 1,
          explain: "גיבוי שלא נבדק בשחזור הוא חסר ערך — מה שחשוב הוא ה-Restore.",
        },
      ],
    },
  ],
};
