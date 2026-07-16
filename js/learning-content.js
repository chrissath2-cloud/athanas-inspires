/* Central content source for lessons, assignments, downloads, tools, and search. */
window.ATHANAS_LEARNING_CONTENT = {
  version: "2026.07.16.1",
  updated: "2026-07-16",
  site: {
    name: "Athanas Inspires",
    domain: "https://athanasinspires.com",
    youtubeChannel: "https://www.youtube.com/@Athanas_Inspires",
    youtubeSubscribe: "https://www.youtube.com/@Athanas_Inspires?sub_confirmation=1",
    whatsappCommunity: "https://chat.whatsapp.com/Fd9rDqOyxRrKUctGqfevmt",
    whatsappSupport: "https://wa.me/255695110859",
    email: "chriss.ath2@gmail.com"
  },
  featuredLessonId: "word-3",
  series: [
    {
      id: "computer-basics",
      anchor: "beginner-installments",
      navLabel: "Computer Basics",
      eyebrow: "Start Here",
      title: "Computer Basics",
      shortDescription: "Build confidence from the very beginning.",
      description: "Learn the essential computer skills every absolute beginner needs before moving to Microsoft Office.",
      icon: "💻",
      art: "assets/images/youtube/computer-basics-series.svg",
      theme: "basics",
      lessons: [
        { id: "computer-01", session: "0.1", title: "Introduction to Computers, Mouse, and Keyboard", displayTitle: "Session 0.1: Introduction to Computers, Mouse, and Keyboard", description: "Understand what a computer is and begin using the mouse and keyboard with confidence.", videoId: "i8Qd-g7OWYU", videoUrl: "https://www.youtube.com/watch?v=i8Qd-g7OWYU", status: "published" },
        { id: "computer-02", session: "0.2", title: "Understanding Desktop Icons & Basic Computer Navigation", displayTitle: "Session 0.2: Understanding Desktop Icons & Basic Computer Navigation", description: "Learn desktop icons, windows, and the basic navigation skills used across computers.", videoId: "vYGVk9O0EX4", videoUrl: "https://www.youtube.com/watch?v=vYGVk9O0EX4", status: "published" },
        { id: "computer-03", session: "0.3", title: "File and Folder Management", displayTitle: "Session 0.3: File and Folder Management — Navigate and Organize Like a Pro", description: "Create, rename, move, copy, and organise files and folders clearly.", videoId: "Bha7ozesRts", videoUrl: "https://www.youtube.com/watch?v=Bha7ozesRts", status: "published" },
        { id: "computer-04", session: "0.4", title: "Universal Computer Skills Every User Should Know", displayTitle: "Session 0.4: Computer Skills for Beginners — Universal Concepts Every User Should Know", description: "Practise shutdown, flash drives, window management, and other universal computer skills.", videoId: "8EeUPRaAB2A", videoUrl: "https://www.youtube.com/watch?v=8EeUPRaAB2A", status: "published" }
      ]
    },
    {
      id: "word-series",
      anchor: "word-series",
      navLabel: "Word",
      eyebrow: "Create with Confidence",
      title: "Microsoft Word",
      shortDescription: "Move from basic typing to professional documents.",
      description: "Build clear, well-structured, and visually professional documents step by step.",
      icon: "📄",
      art: "assets/images/youtube/word-series.svg",
      theme: "word",
      lessons: [
        { id: "word-1", session: "1", title: "Microsoft Word for Absolute Beginners", displayTitle: "Word Session 1: Microsoft Word for Absolute Beginners", description: "Open Word, type, format text, save documents, and use undo and redo.", videoId: "vG-tM8XaDjw", videoUrl: "https://www.youtube.com/watch?v=vG-tM8XaDjw", status: "published" },
        { id: "word-2", session: "2", title: "From Typing to a Proper Document", displayTitle: "Word Session 2: From Typing to a Proper Document", description: "Use paragraphs, spacing, alignment, lists, headings, and document structure.", videoId: "mT-q8ZIe_fE", videoUrl: "https://www.youtube.com/watch?v=mT-q8ZIe_fE", status: "published" },
        { id: "word-3", session: "3", title: "Create Professional Documents with Visuals", displayTitle: "Word Session 3: Create Professional Documents with Visuals", description: "Use pictures, Wrap Text, shapes, text boxes, WordArt, symbols, and equations.", videoId: "Fr0np3nukWg", videoUrl: "https://www.youtube.com/watch?v=Fr0np3nukWg", status: "published", featured: true,
          assignmentId: "word-3-assignment",
          resources: [
            { id: "word-3-image-zip", label: "Download Image Resource", type: "ZIP", url: "assets/downloads/word-session-3-mini-project-image.zip", filename: "word-session-3-mini-project-image.zip" }
          ]
        },
        { id: "word-4", session: "4", title: "Word Session 4", displayTitle: "Word Session 4", description: "The next Microsoft Word lesson is being prepared.", status: "coming-soon" }
      ]
    },
    {
      id: "excel-series",
      anchor: "excel-series",
      navLabel: "Excel",
      eyebrow: "Think with Spreadsheets",
      title: "Microsoft Excel",
      shortDescription: "Learn formulas, tables, and smart decision systems.",
      description: "Learn formulas, tables, IF statements, and practical spreadsheet thinking for real work.",
      icon: "📊",
      art: "assets/images/youtube/excel-series.svg",
      theme: "excel",
      lessons: [
        { id: "excel-1", session: "1", title: "Excel for Absolute Beginners — Start Here", displayTitle: "Excel Session 1: Excel for Absolute Beginners — Start Here", description: "Open Excel, enter and organise data, format cells, use SUM, and save your workbook.", videoId: "LQuil7Itb-4", videoUrl: "https://www.youtube.com/watch?v=LQuil7Itb-4", status: "published" },
        { id: "excel-2", session: "2", title: "Start Using Formulas the Right Way", displayTitle: "Excel Session 2: Start Using Formulas the Right Way", description: "Learn formula structure, SUM, AVERAGE, RANK, borders, and organised worksheet design.", videoId: "fDepU9fUpSw", videoUrl: "https://www.youtube.com/watch?v=fDepU9fUpSw", status: "published", assignmentId: "excel-2-assignment" },
        { id: "excel-3", session: "3", title: "Building Real Tables with Formulas", displayTitle: "Excel Session 3: Building Real Tables with Formulas", description: "Build a business table using formulas, percentages, summaries, sorting, MAX, and MIN.", videoId: "jobqJzV9gGk", videoUrl: "https://www.youtube.com/watch?v=jobqJzV9gGk", status: "published" },
        { id: "excel-4", session: "4", title: "IF Statements for Beginners", displayTitle: "Excel Session 4: IF Statements for Beginners", description: "Use IF logic for pass or fail, remarks, profit or loss, and automatic decisions.", videoId: "QqfmHzystTc", videoUrl: "https://www.youtube.com/watch?v=QqfmHzystTc", status: "published", assignmentId: "excel-4-assignment" },
        { id: "excel-5", session: "5", title: "Building Smart Decision Systems with Nested IF", displayTitle: "Excel Session 5: Building Smart Decision Systems with Nested IF", description: "Move beyond a single condition and build smarter automatic decisions with Nested IF.", status: "coming-soon", upcoming: true }
      ]
    }
  ],
  futureSeries: [
    { id: "powerpoint", title: "Microsoft PowerPoint", icon: "📽️", description: "Create powerful presentations for teaching, business, school, and public speaking.", status: "coming-soon" },
    { id: "python", title: "Python for Beginners", icon: "🐍", description: "Learn programming step by step and begin building useful beginner projects.", status: "coming-soon" }
  ],
  assignments: [
    {
      id: "word-3-assignment",
      lessonId: "word-3",
      series: "Microsoft Word",
      title: "Word Session 3 Mini Project",
      description: "Recreate the Internet Safety Guide and practise pictures, Wrap Text, shapes, text boxes, WordArt, symbols, equations, and clean layout.",
      icon: "📄",
      status: "available",
      anchor: "word-session-3-assignment",
      watchUrl: "https://www.youtube.com/watch?v=Fr0np3nukWg",
      downloadUrl: "assets/downloads/word-session-3-mini-project-image.zip",
      downloadLabel: "Download Image Resource",
      preview: "assets/images/word-session-3-mini-project-preview.png",
      submitUrl: "https://wa.me/255695110859?text=Hello%20Athanas%20Inspires%2C%20I%20want%20to%20submit%20my%20Word%20Session%203%20assignment.%20My%20name%20is%20_____.%20I%20recreated%20the%20Internet%20Safety%20Guide%20mini%20project."
    },
    {
      id: "excel-2-assignment",
      lessonId: "excel-2",
      series: "Microsoft Excel",
      title: "Excel Session 2 Assignment",
      description: "Practise formulas, basic calculations, SUM, AVERAGE, RANK, and Excel cell references.",
      icon: "📊",
      status: "available",
      anchor: "excel-session-2",
      watchUrl: "https://www.youtube.com/watch?v=fDepU9fUpSw",
      downloadUrl: "assets/downloads/excel-session-2-assignment.xlsx",
      downloadLabel: "Download Assignment",
      submitUrl: "https://wa.me/255695110859?text=Hello%20Athanas%20Inspires%2C%20I%20want%20to%20submit%20my%20Excel%20Session%202%20assignment.%20My%20name%20is%20_____."
    },
    {
      id: "excel-4-assignment",
      lessonId: "excel-4",
      series: "Microsoft Excel",
      title: "Excel Session 4 Assignment",
      description: "Practise IF logic and simple automatic decision-making in Excel.",
      icon: "📈",
      status: "available",
      anchor: "excel-session-4",
      watchUrl: "https://www.youtube.com/watch?v=QqfmHzystTc",
      downloadUrl: "assets/downloads/excel-session-4-assignment.xlsx",
      downloadLabel: "Download Assignment",
      submitUrl: "https://wa.me/255695110859?text=Hello%20Athanas%20Inspires%2C%20I%20want%20to%20submit%20my%20Excel%20Session%204%20assignment.%20My%20name%20is%20_____."
    }
  ],
  downloads: [
    { id: "word-3-image-zip", category: "Microsoft Word", title: "Word Session 3 Image Resource", description: "The image pack used for the Internet Safety Guide mini project.", icon: "📄", type: "ZIP", url: "assets/downloads/word-session-3-mini-project-image.zip", relatedUrl: "assignments.html#word-session-3-assignment" },
    { id: "excel-2-file", category: "Microsoft Excel", title: "Excel Session 2 Assignment File", description: "Practice formulas, calculations, and cell references from Excel Session 2.", icon: "📊", type: "XLSX", url: "assets/downloads/excel-session-2-assignment.xlsx", relatedUrl: "assignments.html#excel-session-2" },
    { id: "excel-4-file", category: "Microsoft Excel", title: "Excel Session 4 Assignment File", description: "Practice IF logic and automatic decision-making from Excel Session 4.", icon: "📈", type: "XLSX", url: "assets/downloads/excel-session-4-assignment.xlsx", relatedUrl: "assignments.html#excel-session-4" }
  ],
  tools: [
    { id: "quiz", title: "General ICT Quiz Game", description: "Practise computer basics, Word, Excel, internet safety, shortcuts, and beginner ICT skills with instant feedback.", icon: "🎮", url: "quiz.html", status: "available", level: "Beginner", purpose: "Knowledge practice" },
    { id: "shortcuts", title: "Computer Shortcut Keys Trainer", description: "Train Windows, Word, Excel, browser, and common keyboard shortcuts with instant correction.", icon: "⌨️", url: "shortcut-trainer.html", status: "available", level: "Beginner", purpose: "Speed and productivity" },
    { id: "typing", title: "Typing Speed Trainer", description: "Improve typing speed, accuracy, focus, and ICT vocabulary through timed practice.", icon: "⚡", url: "typing-trainer.html", status: "available", level: "All levels", purpose: "Typing confidence" },
    { id: "calculator", title: "Scientific Calculator", description: "Use a practical calculator for school mathematics, science, percentages, powers, roots, and trigonometry.", icon: "🧮", url: "calculator.html", status: "available", level: "All levels", purpose: "Calculations" },
    { id: "results-templates", title: "Results Analysis Templates", description: "Excel templates for marks, totals, averages, ranking, grades, and performance review.", icon: "📊", status: "coming-soon", level: "Teachers", purpose: "School analysis" },
    { id: "school-records", title: "School Record Templates", description: "Templates for attendance, reports, lists, summaries, and school organisation.", icon: "📋", status: "coming-soon", level: "Teachers", purpose: "School records" },
    { id: "simple-bots", title: "Simple Bots", description: "Beginner-friendly bots for learning support, reminders, quizzes, and simple automation.", icon: "🤖", status: "coming-soon", level: "Future", purpose: "Automation" }
  ],
  testimonials: [
    { name: "Daniel", country: "Ghana", lesson: "Microsoft Excel learner", quote: "Through Athanas Inspires, I moved from zero to hero. I was selected as an assistant computer-lab technician at my school and as a printing-press management tutor. God bless you more.", featured: true },
    { name: "Dorcus Frasisca", country: "Uganda", lesson: "Microsoft Excel learner", quote: "I am now confident in learning this skill because your work shows that the skill is for everybody. Thank you very much, Teacher Athanas." },
    { name: "Onyangogo George Indege", country: "Kenya", lesson: "Microsoft Excel learner", quote: "From Nairobi, Kenya: Athanas is the most effective instructor I have ever experienced." },
    { name: "Witness Mtonga", country: "Malawi", lesson: "Computer Basics learner", quote: "I understand well. Please continue the way you teach us." },
    { name: "BeachmasterX", country: "United States", lesson: "Excel Session 1 learner", quote: "Only a few minutes in, and I already appreciate what you are saying. Dayton, Ohio, USA here—thank you." },
    { name: "Humble Jose", country: "Ghana", lesson: "Microsoft Excel learner", quote: "You are an amazing teacher. You make learning easy and understandable—your student from Ghana." },
    { name: "Peter Lusenge", country: "Zambia", lesson: "Computer Basics learner", quote: "What an excellent instructor and teacher. Watching from Zambia." },
    { name: "Beauty", country: "Nigeria", lesson: "Athanas Inspires ICT learner", quote: "Thank you very much for your great support to us. I am Beauty from Nigeria, watching from Dubai. God bless you, sir." }
  ],
  staticSearchEntries: [
    { category: "Page", title: "Home", description: "Explore Athanas Inspires learning, inspiration, tools, and resources.", url: "index.html", keywords: "home platform learn believe grow build" },
    { category: "Page", title: "About Athanas Inspires", description: "Learn about the mission, story, and purpose behind Athanas Inspires.", url: "about.html", keywords: "about Athanas teacher mission Tanzania" },
    { category: "Page", title: "YouTube Learning Hub", description: "Watch Computer Basics, Microsoft Word, and Microsoft Excel lessons in one guided flow.", url: "youtube.html", keywords: "youtube videos channel subscribe learning hub" },
    { category: "Page", title: "ICT Lessons", description: "Follow the complete beginner-friendly computer, Word, and Excel learning roadmap.", url: "courses.html", keywords: "courses lessons roadmap computer word excel" },
    { category: "Page", title: "Assignments", description: "Watch, download, complete, and submit available practice assignments.", url: "assignments.html", keywords: "assignments practice submit whatsapp" },
    { category: "Page", title: "Downloads", description: "Download lesson files, templates, and practice resources.", url: "downloads.html", keywords: "downloads xlsx zip files resources" },
    { category: "Page", title: "Learning Tools", description: "Open the ICT quiz, shortcut trainer, typing trainer, and scientific calculator.", url: "tools.html", keywords: "tools quiz shortcut typing calculator" },
    { category: "Page", title: "Tanzanian Education Resources", description: "Explore resources supporting the Tanzanian primary education system.", url: "education.html", keywords: "Tanzania primary education exams notes books" },
    { category: "Page", title: "Faith & Personal Growth", description: "Read faith-rooted encouragement, courage-building articles, and personal growth messages.", url: "faith-inspiration.html", keywords: "faith inspiration courage personal growth encouragement" },
    { category: "Faith Resource", title: "Biblia Takatifu ya Kiswahili", description: "Soma vitabu vyote 66 vya Biblia, tafuta maandiko, na nakili mistari kwa urahisi.", url: "bible.html", keywords: "biblia kiswahili bible scripture neno la Mungu agano la kale agano jipya zaburi yohana" },
    { category: "Page", title: "Technology & Digital Growth", description: "Read simple technology articles that build digital confidence and help beginners move forward.", url: "technology-insights.html", keywords: "technology articles digital growth confidence beginner future skills" },
    { category: "Article", title: "Digital Skills Every Beginner Should Learn", description: "A simple guide to the practical digital skills every beginner can learn step by step.", url: "digital-skills-every-beginner-should-learn.html", keywords: "digital skills beginner computer typing folders internet email word excel powerpoint smartphone cloud troubleshooting pdf online learning" },
    { category: "Article", title: "Why Technology Is Necessary in Today’s World", description: "An inspiring guide to learning, adapting, and using technology to move forward.", url: "why-technology-is-necessary.html", keywords: "technology digital skills learning work business beginner future" },
    { category: "Article", title: "The Power of Small Beginnings", description: "An encouragement to start where you are and use what you have.", url: "the-power-of-small-beginnings.html", keywords: "small beginnings start purpose Zechariah" },
    { category: "Support", title: "Frequently Asked Questions", description: "Find answers about lessons, assignments, downloads, tools, and the community.", url: "faq.html", keywords: "faq questions help support" },
    { category: "Support", title: "Contact Athanas Inspires", description: "Reach Athanas Inspires through phone, WhatsApp, or email.", url: "contact.html", keywords: "contact phone whatsapp email" },
    { category: "Legal", title: "Privacy Policy", description: "Learn how website data, analytics, embedded media, and local storage are handled.", url: "privacy-policy.html", keywords: "privacy analytics data cookies" },
    { category: "Legal", title: "Cookie Information", description: "Understand essential storage and optional analytics technologies.", url: "cookie-policy.html", keywords: "cookies consent local storage analytics" },
    { category: "Legal", title: "Terms of Use", description: "Read the website, educational-content, and download terms.", url: "terms.html", keywords: "terms disclaimer downloads education" },
    { category: "Legal", title: "Accessibility Statement", description: "Read the accessibility commitment and how to request assistance.", url: "accessibility.html", keywords: "accessibility keyboard screen reader contrast" }
  ]
};
