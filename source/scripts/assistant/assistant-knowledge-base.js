(() => {
  "use strict";
  const assistant = window.ATHANAS_ASSISTANT_DATA;
  if (!assistant) return;

  const official = (id, topic, title, keywords, answer, options = {}) => ({
    id: `official-${id}`,
    topic,
    title,
    keywords,
    answer,
    details: options.details || "",
    actions: options.actions || [],
    related: options.related || [],
    nextStep: options.nextStep || "Open the related Athanas Inspires resource and continue with one practical step.",
    aliases: options.aliases || [],
    sourceType: "official",
    sourceLabel: "Official Athanas Inspires Content"
  });

  const general = (id, topic, title, keywords, answer, options = {}) => ({
    id: `general-${id}`,
    topic,
    title,
    keywords,
    answer,
    details: options.details || "",
    actions: options.actions || [],
    related: options.related || [],
    nextStep: options.nextStep || "Practise the idea in a small example, then repeat it until it feels familiar.",
    aliases: options.aliases || [],
    sourceType: "general",
    sourceLabel: "General Guidance"
  });

  const entries = [
    official(
      "mission",
      "About Athanas Inspires",
      "What is the purpose of Athanas Inspires?",
      ["mission", "purpose", "what is athanas inspires", "platform", "vision"],
      "Athanas Inspires equips people with practical digital skills, encourages personal growth, and helps beginners move forward with confidence and purpose.",
      {
        details: "The platform brings together beginner-friendly ICT lessons, assignments, digital tools, education resources, faith-rooted inspiration, YouTube learning, and community support.",
        actions: [{ label: "Read About Athanas Inspires", url: "/about.html", kind: "primary" }],
        related: [
          { label: "Explore ICT Lessons", url: "/courses.html" },
          { label: "Open Digital Tools", url: "/digital-tools/index.html" },
          { label: "Read Faith & Inspiration", url: "/faith-inspiration.html" }
        ],
        nextStep: "Choose one learning path that matches your current need and begin with its first available lesson."
      }
    ),
    official(
      "start-here",
      "Website Navigation",
      "Where should a complete beginner start?",
      ["start here", "complete beginner", "new to computer", "where do i begin", "first lesson"],
      "A complete beginner should start with Computer Basics Session 0.1, then continue through Sessions 0.2, 0.3, and 0.4 before moving to Microsoft Word or Excel.",
      {
        actions: [{ label: "Start Computer Basics", url: "/courses.html#beginner-installments", kind: "primary" }],
        related: [
          { label: "Computer Basics Lessons", url: "/courses.html#beginner-installments" },
          { label: "General ICT Quiz", url: "/digital-tools/ict-quiz.html" },
          { label: "Typing Speed Trainer", url: "/digital-tools/typing-trainer.html" }
        ],
        nextStep: "Watch Session 0.1 and repeat each demonstrated action on a real computer whenever possible."
      }
    ),
    official(
      "learning-order",
      "ICT Lessons",
      "What is the recommended learning order?",
      ["learning order", "lesson order", "what next", "roadmap", "sequence"],
      "The recommended path is Computer Basics first, Microsoft Word second, and Microsoft Excel third. Practise with assignments and digital tools between lessons instead of only watching videos.",
      {
        actions: [{ label: "View the Learning Roadmap", url: "/courses.html", kind: "primary" }],
        related: [
          { label: "Assignments", url: "/assignments.html" },
          { label: "Downloads", url: "/downloads.html" },
          { label: "YouTube Learning Hub", url: "/youtube.html" }
        ],
        nextStep: "Continue from the most recent session you completed successfully rather than skipping ahead."
      }
    ),
    official(
      "whatsapp-community",
      "Community Support",
      "What is the Athanas Inspires ICT WhatsApp Community?",
      ["whatsapp group", "ict community", "join group", "learning community"],
      "The Athanas Inspires ICT Community is a supportive learning space where members receive lesson updates, assignment reminders, encouragement, and practical ICT guidance.",
      {
        actions: [{ label: "Join WhatsApp ICT Community", url: "https://chat.whatsapp.com/Fd9rDqOyxRrKUctGqfevmt", kind: "primary" }],
        related: [
          { label: "Contact Athanas Inspires", url: "/contact.html" },
          { label: "Frequently Asked Questions", url: "/faq.html" }
        ],
        nextStep: "After joining, introduce yourself with your name, country, and the ICT skill you want to learn."
      }
    ),
    official(
      "support-options",
      "Support",
      "How can I get help from Athanas Inspires?",
      ["get help", "support", "contact", "phone", "email", "whatsapp"],
      "You can ask the AI Assistant, use WhatsApp for quick learning support, call when an issue is easier to explain, or email for detailed and professional enquiries.",
      {
        actions: [{ label: "Open Contact Options", url: "/contact.html", kind: "primary" }],
        related: [
          { label: "Frequently Asked Questions", url: "/faq.html" },
          { label: "Assignments", url: "/assignments.html" }
        ],
        nextStep: "When requesting technical help, mention the lesson, the exact step causing difficulty, and add a screenshot when useful."
      }
    ),
    official(
      "youtube-hub",
      "YouTube Learning",
      "What can I find in the YouTube Learning Hub?",
      ["youtube hub", "youtube lessons", "videos", "subscribe", "athanas channel"],
      "The YouTube Learning Hub organises Computer Basics, Microsoft Word, and Microsoft Excel lessons so beginners can follow a clear sequence without losing their place.",
      {
        actions: [{ label: "Open YouTube Learning Hub", url: "/youtube.html", kind: "primary" }],
        related: [
          { label: "ICT Lessons Roadmap", url: "/courses.html" },
          { label: "Assignments", url: "/assignments.html" }
        ],
        nextStep: "Open the series you are studying, watch the next session, and practise before moving forward."
      }
    ),
    official(
      "digital-tools",
      "Digital Tools",
      "Which digital tools are available?",
      ["digital tools", "typing trainer", "shortcut trainer", "ict quiz", "calculator", "qr code"],
      "Available tools include the Typing Speed Trainer, Computer Shortcut Keys Trainer, General ICT Quiz Game, Scientific Calculator, and QR Code Generator.",
      {
        actions: [{ label: "Explore All Digital Tools", url: "/digital-tools/index.html", kind: "primary" }],
        related: [
          { label: "Typing Speed Trainer", url: "/digital-tools/typing-trainer.html" },
          { label: "Shortcut Keys Trainer", url: "/digital-tools/shortcut-keys-trainer.html" },
          { label: "General ICT Quiz", url: "/digital-tools/ict-quiz.html" }
        ],
        nextStep: "Choose the tool that matches the skill you want to practise today."
      }
    ),
    official(
      "assignment-process",
      "Assignments",
      "How do I complete and submit an assignment?",
      ["submit assignment", "assignment process", "download assignment", "whatsapp submit"],
      "Watch the related lesson first, download the assignment file, complete the work yourself, check it carefully, and use the official WhatsApp submission link shown on the assignment page.",
      {
        actions: [{ label: "Open Assignments", url: "/assignments.html", kind: "primary" }],
        related: [
          { label: "Download Practice Files", url: "/downloads.html" },
          { label: "YouTube Learning Hub", url: "/youtube.html" }
        ],
        nextStep: "Open the assignment that matches the lesson you have already completed."
      }
    ),
    official(
      "featured-article",
      "Articles",
      "What is the featured growth article about?",
      ["featured article", "difficult to ignore", "build skills", "hidden potential", "complementary skills"],
      "Build Skills That Make You Difficult to Ignore explains how complementary skills, consistency, communication, problem-solving, and technology can turn hidden ability into visible value.",
      {
        actions: [{ label: "Read the Featured Article", url: "/build-skills-that-make-you-difficult-to-ignore.html", kind: "primary" }],
        related: [
          { label: "Technology Insights", url: "/technology-insights.html" },
          { label: "Faith & Personal Growth", url: "/faith-inspiration.html" }
        ],
        nextStep: "Choose one valuable skill from the article and practise it consistently for the next seven days."
      }
    ),
    official(
      "qr-generator",
      "Digital Tools",
      "What can the QR Code Generator create?",
      ["qr code generator", "create qr", "wifi qr", "whatsapp qr", "poster qr"],
      "The QR Code Generator can create customised QR codes for websites, text, WhatsApp, Wi-Fi, contacts, email, phone numbers, and other useful information. It also provides a compact preview and an A4 print view.",
      {
        actions: [{ label: "Open QR Code Generator", url: "/digital-tools/qr-code-generator.html", kind: "primary" }],
        related: [{ label: "Explore All Tools", url: "/digital-tools/index.html" }],
        nextStep: "Choose the QR type, enter the correct information, test the code with another phone, and then download it."
      }
    ),

    general(
      "hardware-software",
      "Computer Basics",
      "What is the difference between hardware and software?",
      ["hardware vs software", "hardware", "software", "computer parts", "applications"],
      "Hardware is the physical equipment you can touch, such as the keyboard, monitor, RAM, and storage drive. Software is the set of programs and instructions that run on the hardware, such as Windows, Microsoft Word, and a web browser.",
      {
        details: "Hardware provides the physical resources. Software tells those resources what work to perform.",
        related: [
          { label: "Computer Basics Lessons", url: "/courses.html#beginner-installments" },
          { label: "General ICT Quiz", url: "/digital-tools/ict-quiz.html" }
        ],
        nextStep: "Look at a computer and name five hardware parts, then name five software applications."
      }
    ),
    general(
      "ram-storage",
      "Computer Basics",
      "What is the difference between RAM and storage?",
      ["ram vs storage", "memory", "hard disk", "ssd", "hdd", "500 gb", "running apps"],
      "RAM is temporary working memory used by programs while they are running. Storage, such as an SSD or HDD, keeps files and applications even after the computer is switched off. More storage does not automatically make many programs run smoothly; RAM and the processor are more directly involved in active work.",
      {
        details: "A larger SSD can improve loading speed and provide more file space, but it does not replace sufficient RAM.",
        related: [{ label: "Computer Basics", url: "/courses.html#beginner-installments" }],
        nextStep: "Check your device settings and identify its RAM amount and storage capacity separately."
      }
    ),
    general(
      "program-process-thread",
      "Computer Basics",
      "What are a program, process, and thread?",
      ["program process thread", "process is running program", "threads", "chrome tab", "cpu task"],
      "A program is stored software or instructions. A process is a program that is currently running. A thread is a smaller path of work inside a process, allowing parts of an application to perform tasks independently or concurrently.",
      {
        details: "For example, a browser is a program. When opened it becomes one or more processes, and those processes use threads for tasks such as displaying a page, playing audio, and responding to input.",
        related: [{ label: "Universal Computer Concepts", url: "/courses.html#beginner-installments" }],
        nextStep: "Open Task Manager and observe how one application may use several processes."
      }
    ),
    general(
      "booting",
      "Computer Basics",
      "What is booting?",
      ["booting", "computer startup", "operating system loading", "boot failure"],
      "Booting is the process a computer follows from power-on until the operating system is loaded and ready to use. During booting, the computer checks important hardware, finds the storage device, and loads system files into memory.",
      {
        details: "Boot problems can be caused by missing or disconnected storage, damaged system files, RAM problems, or incorrect boot settings.",
        related: [{ label: "Computer Basics Lessons", url: "/courses.html#beginner-installments" }],
        nextStep: "Notice the sequence of screens shown when your computer starts, but avoid changing BIOS settings unless you understand them."
      }
    ),
    general(
      "drivers",
      "Computer Basics",
      "What is a device driver?",
      ["device driver", "printer driver", "communicate with printer", "reinstall driver"],
      "A device driver is software that helps the operating system communicate correctly with hardware such as a printer, keyboard, graphics device, or network adapter.",
      {
        details: "When a device is not working, updating or reinstalling the correct driver can solve communication problems.",
        related: [{ label: "Computer Basics", url: "/courses.html#beginner-installments" }],
        nextStep: "Use the official manufacturer or operating-system update service when installing drivers."
      }
    ),
    general(
      "files-folders",
      "Computer Basics",
      "How should I organise files and folders?",
      ["organise files", "folders", "file management", "rename files", "documents folder"],
      "Create clear folders by purpose, use descriptive file names, keep related files together, and avoid saving everything on the desktop. A simple structure such as Documents > ICT Learning > Word > Session 3 makes files easier to find.",
      {
        related: [{ label: "File and Folder Management Lesson", url: "https://youtu.be/Bha7ozesRts" }],
        nextStep: "Create one main learning folder today and move your practice files into named subfolders."
      }
    ),
    general(
      "web-desktop-apps",
      "Computer Basics",
      "What is the difference between web-based and desktop applications?",
      ["web based application", "desktop application", "online app", "installed software", "opposite of web app"],
      "A web-based application runs mainly through a browser and usually needs an internet connection. A desktop application is installed on the computer and can often perform many tasks without being online. Some modern applications combine both approaches.",
      {
        details: "Examples of web apps include Google Docs in a browser. Examples of desktop apps include installed versions of Microsoft Word or Excel.",
        related: [{ label: "Technology Insights", url: "/technology-insights.html" }],
        nextStep: "List three applications you use and identify whether each is web-based, desktop-based, or both."
      }
    ),
    general(
      "word-formatting",
      "Microsoft Word",
      "How do I make a Word document look professional?",
      ["professional word document", "format word", "document design", "headings", "spacing"],
      "Use a clear title, consistent headings, readable fonts, balanced spacing, aligned paragraphs, suitable margins, and only a few purposeful colours. Good structure matters more than decorating every line.",
      {
        related: [
          { label: "Microsoft Word Lessons", url: "/courses.html#word-series" },
          { label: "Word Session 3 Assignment", url: "/assignments.html#word-session-3-assignment" }
        ],
        nextStep: "Format one page using one title style, one heading style, and one body-text style."
      }
    ),
    general(
      "word-wrap-text",
      "Microsoft Word",
      "How does Wrap Text work in Microsoft Word?",
      ["wrap text", "square tight through", "behind text", "in front of text", "picture layout"],
      "Wrap Text controls how words flow around a picture or object. In Line with Text treats the picture like a large character. Square, Tight, Through, Top and Bottom, Behind Text, and In Front of Text provide different positioning options.",
      {
        related: [{ label: "Word Session 3", url: "https://youtu.be/Fr0np3nukWg" }],
        nextStep: "Insert one picture and test In Line, Square, and Behind Text so you can see the difference."
      }
    ),
    general(
      "word-mobile",
      "Microsoft Word",
      "Can I practise Microsoft Word and Excel on a phone?",
      ["word on phone", "excel on phone", "microsoft registration not working", "no laptop", "mobile office"],
      "Yes. The Microsoft 365, Word, and Excel mobile apps can be used for basic practice on a phone. Sign in with a Microsoft account, keep the apps updated, and ensure the phone has internet during account setup. Some advanced desktop features may be limited on mobile.",
      {
        details: "If registration fails, check the email address, password, internet connection, date and time settings, app permissions, and whether the account can sign in through a browser.",
        related: [
          { label: "Microsoft Word Lessons", url: "/courses.html#word-series" },
          { label: "Microsoft Excel Lessons", url: "/courses.html#excel-series" },
          { label: "Contact Support", url: "/contact.html" }
        ],
        nextStep: "Try signing in to the Microsoft account in your phone browser first, then return to the app."
      }
    ),
    general(
      "excel-cell-range",
      "Microsoft Excel",
      "What are cells and ranges in Excel?",
      ["excel cell", "cell reference", "range", "c4", "8 cells", "spreadsheet"],
      "A cell is one box where a row and column meet, identified by a reference such as C4. A range is a group of cells, such as B2:B9 or B2:D5.",
      {
        related: [{ label: "Excel Lessons", url: "/courses.html#excel-series" }],
        nextStep: "Open Excel, click different cells, and read their references in the Name Box."
      }
    ),
    general(
      "excel-formulas",
      "Microsoft Excel",
      "How do formulas work in Excel?",
      ["excel formula", "formula begins with equals", "sum", "average", "max", "min"],
      "An Excel formula begins with an equals sign. It can calculate using cell references, numbers, operators, and functions. For example, =B2+C2 adds two cells, while =SUM(B2:B10) adds a range.",
      {
        related: [
          { label: "Excel Session 2", url: "https://youtu.be/fDepU9fUpSw" },
          { label: "Excel Session 2 Assignment", url: "/assignments.html#excel-session-2" }
        ],
        nextStep: "Create a small table and write one addition formula and one SUM formula."
      }
    ),
    general(
      "excel-if",
      "Microsoft Excel",
      "How does the IF function work?",
      ["excel if", "if statement", "logical test", "pass fail", "enough stock low stock"],
      "The IF function checks a condition and returns one result when the condition is true and another result when it is false. Its basic form is =IF(logical_test, value_if_true, value_if_false).",
      {
        details: "Example: =IF(G8>=10,\"Enough Stock\",\"Low Stock\"). Text results must be placed inside quotation marks.",
        related: [
          { label: "Excel Session 4", url: "https://youtu.be/QqfmHzystTc" },
          { label: "Excel Session 4 Assignment", url: "/assignments.html#excel-session-4" }
        ],
        nextStep: "Create one simple IF formula using a condition from a small table."
      }
    ),
    general(
      "excel-nested-if",
      "Microsoft Excel",
      "What is a nested IF formula?",
      ["nested if", "multiple conditions", "excel decision system", "grades formula"],
      "A nested IF places one IF function inside another so Excel can choose between more than two outcomes. It is useful for categories such as grades, performance levels, or profit conditions, but the conditions must be arranged carefully.",
      {
        details: "Start with the most restrictive or highest condition when appropriate, test each boundary value, and keep text results in quotation marks.",
        related: [{ label: "Excel Learning Roadmap", url: "/courses.html#excel-series" }],
        nextStep: "Write the possible outcomes in order before building the formula."
      }
    ),
    general(
      "excel-sort-filter",
      "Microsoft Excel",
      "What is the difference between sorting and filtering?",
      ["sort vs filter", "sorting excel", "filter excel", "arrange data"],
      "Sorting changes the order of rows, such as A to Z or highest to lowest. Filtering temporarily hides rows that do not match selected conditions while keeping the original data available.",
      {
        related: [{ label: "Excel Lessons", url: "/courses.html#excel-series" }],
        nextStep: "Create a small table, sort names A to Z, then filter one category."
      }
    ),
    general(
      "typing-practice",
      "Digital Skills",
      "How can I improve typing speed?",
      ["typing speed", "wpm", "typing accuracy", "keyboard practice", "type faster"],
      "Build accuracy before speed. Keep both hands on the keyboard, look at the screen more than your fingers, practise for short regular sessions, and repeat difficult words until your mistakes decrease.",
      {
        actions: [{ label: "Open Typing Speed Trainer", url: "/digital-tools/typing-trainer.html", kind: "primary" }],
        related: [{ label: "Shortcut Keys Trainer", url: "/digital-tools/shortcut-keys-trainer.html" }],
        nextStep: "Complete one 60-second beginner round and record both WPM and accuracy."
      }
    ),
    general(
      "shortcuts",
      "Digital Skills",
      "Why should I learn keyboard shortcuts?",
      ["keyboard shortcuts", "ctrl c", "ctrl v", "ctrl s", "shortcut keys"],
      "Keyboard shortcuts reduce repeated mouse movement, save time, and help you work more confidently. Start with Copy, Paste, Save, Undo, Find, and Print before learning application-specific shortcuts.",
      {
        actions: [{ label: "Open Shortcut Keys Trainer", url: "/digital-tools/shortcut-keys-trainer.html", kind: "primary" }],
        related: [{ label: "Typing Speed Trainer", url: "/digital-tools/typing-trainer.html" }],
        nextStep: "Practise Ctrl+C, Ctrl+V, Ctrl+S, and Ctrl+Z in a safe practice document."
      }
    ),
    general(
      "browser-search-engine",
      "Internet Basics",
      "What is the difference between a browser and a search engine?",
      ["browser vs search engine", "google chrome", "google search", "internet browser"],
      "A browser is an application used to open websites, such as Chrome, Edge, or Firefox. A search engine is an online service used inside a browser to find information, such as Google or Bing.",
      {
        related: [{ label: "Technology Insights", url: "/technology-insights.html" }],
        nextStep: "Open your browser and identify its name, then visit a search engine inside it."
      }
    ),
    general(
      "passwords",
      "Internet Safety",
      "How do I create a strong password?",
      ["strong password", "password safety", "secure account", "two factor authentication"],
      "Use a long, unique password or passphrase for every important account. Combine unrelated words, numbers, and symbols where allowed, avoid personal information, and enable two-factor authentication.",
      {
        details: "Do not reuse one password across email, banking, social media, and work accounts. A password manager can help store unique passwords safely.",
        related: [{ label: "General ICT Quiz", url: "/digital-tools/ict-quiz.html" }],
        nextStep: "Enable two-factor authentication on your email account first because email can reset many other accounts."
      }
    ),
    general(
      "phishing",
      "Internet Safety",
      "How can I recognise a phishing or scam message?",
      ["phishing", "scam message", "suspicious link", "fake prize", "verify sender"],
      "Be cautious when a message creates urgency, promises an unexpected reward, requests passwords or money, uses a suspicious link, or comes from an unfamiliar sender. Verify through an official channel before clicking or replying.",
      {
        details: "Do not share verification codes, passwords, recovery phrases, or banking PINs. A legitimate support agent should not need them.",
        related: [{ label: "Contact Athanas Inspires", url: "/contact.html" }],
        nextStep: "Pause, inspect the sender and link, and verify independently before taking action."
      }
    ),
    general(
      "email-attachments",
      "Internet Safety",
      "How should I handle email attachments safely?",
      ["email attachment", "download safely", "virus attachment", "suspicious file"],
      "Open attachments only when you recognise the sender and expected the file. Check the file name and extension, scan downloads when possible, and avoid enabling macros in unexpected documents.",
      {
        nextStep: "Confirm an unexpected attachment with the sender through another communication channel."
      }
    ),
    general(
      "cloud-storage",
      "Digital Productivity",
      "What is cloud storage?",
      ["cloud storage", "google drive", "onedrive", "online backup", "sync files"],
      "Cloud storage keeps files on internet-connected servers so they can be accessed and synchronised across devices. Examples include Google Drive, OneDrive, and Dropbox.",
      {
        details: "Cloud storage is useful for access and sharing, but important files should still have an additional backup.",
        nextStep: "Upload one non-sensitive practice file and learn how to download it again."
      }
    ),
    general(
      "backup",
      "Digital Productivity",
      "How should I back up important files?",
      ["backup files", "data loss", "external drive", "cloud backup", "3 2 1 backup"],
      "Keep important files in more than one place. A practical approach is the 3-2-1 idea: three copies, on two different types of storage, with one copy kept away from the main device.",
      {
        nextStep: "Copy your most important documents to a trusted cloud service or external drive today."
      }
    ),
    general(
      "screenshots",
      "Digital Productivity",
      "How can screenshots help when asking for technical support?",
      ["screenshot support", "show error", "capture screen", "technical help"],
      "A screenshot shows the exact message, button, or screen causing difficulty. Capture only the relevant area, hide private information, and explain what you were trying to do when the problem appeared.",
      {
        related: [{ label: "Contact Support", url: "/contact.html" }],
        nextStep: "Take one screenshot of the problem and add one sentence explaining the step that failed."
      }
    ),
    general(
      "powerpoint-basics",
      "Microsoft PowerPoint",
      "How do I create a clear PowerPoint presentation?",
      ["powerpoint", "presentation", "slides", "clear presentation", "slide design"],
      "Use one main idea per slide, short readable text, relevant visuals, strong contrast, consistent alignment, and a simple design. Slides should support the speaker rather than contain the entire speech.",
      {
        related: [{ label: "ICT Lessons", url: "/courses.html" }],
        nextStep: "Create three slides: title, one key idea, and a conclusion."
      }
    ),
    general(
      "qr-safety",
      "Digital Tools",
      "How do I use QR codes safely?",
      ["qr code safety", "scan qr", "test qr", "malicious qr"],
      "Before opening a scanned QR link, check the previewed address when your phone shows it. Create QR codes only from accurate information, test them on another device, and avoid scanning codes from suspicious or altered posters.",
      {
        actions: [{ label: "Create a QR Code", url: "/digital-tools/qr-code-generator.html", kind: "primary" }],
        nextStep: "Test your generated code with a second phone before printing or sharing it."
      }
    ),
    general(
      "learning-routine",
      "Learning Strategy",
      "How often should a beginner practise ICT?",
      ["practice routine", "learn ict", "study schedule", "daily practice", "beginner routine"],
      "Short, consistent practice is usually better than rare long sessions. A beginner can practise for 20 to 30 minutes, focus on one small skill, repeat it, and finish by doing the task without following the demonstration.",
      {
        related: [
          { label: "ICT Lessons", url: "/courses.html" },
          { label: "Assignments", url: "/assignments.html" }
        ],
        nextStep: "Schedule one focused 25-minute practice session and choose the exact task before you begin."
      }
    ),
    general(
      "mistakes-growth",
      "Personal Growth",
      "What should I do when I keep making mistakes while learning?",
      ["making mistakes", "learning fear", "beginner confidence", "keep trying", "practice"],
      "Treat mistakes as information. Slow down, identify the exact step that failed, repeat a smaller example, and compare your result with the correct process. Confidence grows from evidence created through practice, not from waiting to feel ready.",
      {
        related: [{ label: "Faith & Personal Growth", url: "/faith-inspiration.html" }],
        nextStep: "Write down one mistake, its cause, and the corrected step so the lesson becomes reusable."
      }
    ),
    general(
      "skill-stack",
      "Personal Growth",
      "What is a skill stack?",
      ["skill stack", "complementary skills", "difficult to ignore", "valuable skills", "career growth"],
      "A skill stack is a combination of useful abilities that become more valuable together. For example, teaching, communication, Excel, design, and technology can create opportunities that none of the skills would create as strongly alone.",
      {
        related: [{ label: "Build Skills That Make You Difficult to Ignore", url: "/build-skills-that-make-you-difficult-to-ignore.html" }],
        nextStep: "Choose one core skill and one complementary skill that can multiply its usefulness."
      }
    ),
    general(
      "consistency",
      "Personal Growth",
      "How can I become more consistent?",
      ["consistency", "discipline", "keep moving", "small beginnings", "daily action"],
      "Make the action small enough to repeat, attach it to a regular time or cue, track completion, and continue after imperfect days instead of waiting for a perfect restart. Consistency is built by returning.",
      {
        related: [
          { label: "The Power of Small Beginnings", url: "/the-power-of-small-beginnings.html" },
          { label: "Faith & Inspiration", url: "/faith-inspiration.html" }
        ],
        nextStep: "Choose one ten-minute action you can repeat at the same time for the next seven days."
      }
    )
  ];

  const incomingIds = new Set(entries.map((item) => item.id));
  assistant.knowledge = [
    ...entries,
    ...(assistant.knowledge || []).filter((item) => !incomingIds.has(item.id))
  ];

  assistant.version = "2.4.0";
  assistant.updated = "2026-07-29";
  assistant.status = "Official guide + general guidance";
  assistant.greeting = "Hello 👋 I’m the Athanas Inspires AI Assistant. I can guide you through official lessons, assignments, tools, articles, and support options, or give clearly labelled general ICT guidance.";
  assistant.examples = [
    "Where should a complete beginner start?",
    "What is the difference between RAM and storage?",
    "How does the Excel IF function work?",
    "Can I practise Word and Excel on my phone?",
    "Which digital tool should I use today?",
    "How can I improve my typing speed?"
  ];
  assistant.knowledgeBase = {
    version: "2026.07.29-v1",
    officialEntries: entries.filter((item) => item.sourceType === "official").length,
    generalEntries: entries.filter((item) => item.sourceType === "general").length,
    futureApiReady: true
  };
})();
