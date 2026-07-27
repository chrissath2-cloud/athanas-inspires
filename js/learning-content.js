/* Central platform content source for pages, articles, lessons, assignments, downloads, tools, search, and the AI Assistant. */
window.ATHANAS_LEARNING_CONTENT = {
  version: "2026.07.26.1",
  updated: "2026-07-26",
  latestUpdates: [
    { type: "article", icon: "✦", title: "Build Skills That Make You Difficult to Ignore", summary: "A bold, practical guide to discovering your strongest potential, building valuable skills, and turning hidden ability into visible value.", url: "build-skills-that-make-you-difficult-to-ignore.html", date: "2026-07-26", dateLabel: "26 July 2026" },
    { type: "lesson", icon: "▶", title: "Word Session 3: Professional Documents with Visuals", summary: "Learn pictures, Wrap Text, shapes, text boxes, WordArt, symbols, and equations step by step.", url: "youtube.html#featured", date: "2026-07-06", dateLabel: "6 July 2026" },
    { type: "assignment", icon: "✓", title: "Word Session 3 Mini Project", summary: "Recreate the Internet Safety Guide and turn the lesson into a complete practical document.", url: "assignments.html#word-session-3-assignment", date: "2026-07-06", dateLabel: "6 July 2026" },
    { type: "tool", icon: "⌨", title: "Typing Speed Trainer", summary: "Build speed, accuracy, focus, and digital confidence through timed beginner-friendly practice.", url: "typing-trainer.html", date: "2026-07-15", dateLabel: "Updated 15 July 2026" }
  ],
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
  featuredArticleId: "build-skills-difficult-ignore",
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
    { id: "qr", title: "Premium QR Code Generator", description: "Create customised QR codes for links, WhatsApp, Wi-Fi, contacts, payments, locations, social media, and more—with live previews and print-ready exports.", icon: "▦", url: "qr-code-generator.html", status: "available", level: "All levels", purpose: "Create and share" },
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
  pages: [
    { id: "home", category: "Page", title: "Home", description: "Explore Athanas Inspires learning, inspiration, tools, and resources.", url: "index.html", keywords: "home platform learn believe grow build" },
    { id: "about", category: "Page", title: "About Athanas Inspires", description: "Learn about the mission, story, and purpose behind Athanas Inspires.", url: "about.html", keywords: "about mission purpose teacher mentor Tanzania" },
    { id: "youtube", category: "Page", title: "YouTube Learning Hub", description: "Watch Computer Basics, Microsoft Word, and Microsoft Excel lessons in one guided flow.", url: "youtube.html", keywords: "youtube videos channel subscribe learning hub" },
    { id: "courses", category: "Page", title: "ICT Lessons", description: "Follow the complete beginner-friendly computer, Word, and Excel learning roadmap.", url: "courses.html", keywords: "courses lessons roadmap computer word excel" },
    { id: "assignments", category: "Page", title: "Assignments", description: "Watch, download, complete, and submit available practice assignments.", url: "assignments.html", keywords: "assignments practice submit whatsapp" },
    { id: "downloads", category: "Page", title: "Downloads", description: "Download lesson files, templates, and practice resources.", url: "downloads.html", keywords: "downloads xlsx zip files resources" },
    { id: "tools", category: "Page", title: "Learning Tools", description: "Open the QR Code Generator, ICT quiz, shortcut trainer, typing trainer, and scientific calculator.", url: "tools.html", keywords: "tools qr code generator quiz shortcut typing calculator" },
    { id: "quiz-page", category: "Learning Tool", title: "General ICT Quiz Game", description: "Test computer basics, Microsoft Word, Excel, internet safety, and general ICT knowledge.", url: "quiz.html", keywords: "quiz ICT game questions test" },
    { id: "shortcuts-page", category: "Learning Tool", title: "Computer Shortcut Keys Trainer", description: "Practise useful Windows, Word, Excel, browser, and general keyboard shortcuts.", url: "shortcut-trainer.html", keywords: "keyboard shortcuts ctrl trainer" },
    { id: "typing-page", category: "Learning Tool", title: "Typing Speed Trainer", description: "Improve typing speed and accuracy through timed beginner-friendly practice.", url: "typing-trainer.html", keywords: "typing speed accuracy keyboard practice" },
    { id: "calculator-page", category: "Learning Tool", title: "Scientific Calculator", description: "Complete everyday and scientific calculations directly in the browser.", url: "calculator.html", keywords: "calculator mathematics science percentages roots" },
    { id: "qr-generator-page", category: "Learning Tool", title: "Premium QR Code Generator", description: "Create, customise, test, save, print, and download QR codes for websites, WhatsApp, Wi-Fi, contacts, payments, and more.", url: "qr-code-generator.html", keywords: "qr code generator website whatsapp wifi contact payment social media png jpg svg pdf bulk" },
    { id: "education", category: "Page", title: "Tanzanian Education Resources", description: "Explore resources supporting the Tanzanian primary education system.", url: "education.html", keywords: "Tanzania primary education exams notes books" },
    { id: "faith", category: "Page", title: "Faith & Personal Growth", description: "Read faith-rooted encouragement, courage-building articles, and personal-growth messages.", url: "faith-inspiration.html", keywords: "faith inspiration courage personal growth encouragement" },
    { id: "technology", category: "Page", title: "Technology & Digital Growth", description: "Read simple technology articles that build digital confidence and help beginners move forward.", url: "technology-insights.html", keywords: "technology articles digital growth confidence beginner future skills" },
    { id: "faq", category: "Page", title: "Frequently Asked Questions", description: "Find answers about lessons, assignments, downloads, tools, and the community.", url: "faq.html", keywords: "faq questions help support" },
    { id: "contact", category: "Page", title: "Contact Athanas Inspires", description: "Reach Athanas Inspires through phone, WhatsApp, or email.", url: "contact.html", keywords: "contact phone whatsapp email" },
    { id: "privacy", category: "Page", title: "Privacy Policy", description: "Learn how website data, analytics, embedded media, and local storage are handled.", url: "privacy-policy.html", keywords: "privacy analytics data cookies" },
    { id: "cookies", category: "Page", title: "Cookie Information", description: "Understand essential storage and optional analytics technologies.", url: "cookie-policy.html", keywords: "cookies consent local storage analytics" },
    { id: "terms", category: "Page", title: "Terms of Use", description: "Read the website, educational-content, and download terms.", url: "terms.html", keywords: "terms disclaimer downloads education" },
    { id: "accessibility", category: "Page", title: "Accessibility Statement", description: "Read the accessibility commitment and how to request assistance.", url: "accessibility.html", keywords: "accessibility keyboard screen reader contrast" }
  ],
  articles: [
    {"id":"build-skills-difficult-ignore","title":"Build Skills That Make You Difficult to Ignore","subtitle":"Turn your hidden potential into visible value","description":"A bold, deeply practical guide to discovering your strongest potential, building complementary skills, using technology wisely, creating visible evidence, and becoming someone people can trust.","url":"build-skills-that-make-you-difficult-to-ignore.html","date":"2026-07-26","dateLabel":"26 July 2026","readingLabel":"Personal Growth · Skills · Technology","categories":["faith","technology"],"primaryCategory":"faith","featured":true,"image":"assets/images/articles/build-skills-difficult-to-ignore-premium.jpg","socialImage":"assets/images/social/social-build-skills.jpg","quote":"Do not aim to impress people once. Become the person who repeatedly brings value, solves problems, and finishes what they start.","keywords":"skills potential strengths skill stacking technology problem solving consistency character visibility career growth personal development 30 day challenge","assistantSummary":"The article teaches that people become difficult to ignore by developing valuable and complementary skills, solving real problems, using technology as a multiplier, building trust through consistency and character, and making their work visible without becoming noisy.","keyIdeas":["Potential is only a starting point; developed skill and results are the evidence.","Discover strengths through repeated interests, feedback, problems you solve well, and areas where you learn quickly.","Build a small stack of complementary skills instead of collecting unrelated abilities.","Use technology to amplify an existing strength, not to replace thinking or character.","Build visible evidence through completed work, solved problems, a portfolio, teaching, and consistent results.","Confidence grows stronger when it is supported by evidence, feedback, and repeated contribution.","Manage weaknesses that restrict progress while mastering strengths that distinguish you.","Use mistakes as feedback and measure progress against your previous level rather than copying another person's path.","Follow a simple four-week challenge: discover, practise, add technology, and create evidence."],"assistantQuestions":[{"id":"article-skills-main","title":"How can I become difficult to ignore?","keywords":["difficult to ignore","stand out","be valuable","build valuable skills"],"answer":"Become useful, skilled, trustworthy, adaptable, and consistent. Discover what you do well, develop one valuable core skill, add complementary skills, use technology to multiply your effectiveness, solve real problems, and create visible evidence of your work.","details":"The goal is not fame or noise. It is dependable value: the kind of contribution that saves time, improves results, explains ideas clearly, or helps people move forward."},{"id":"article-skills-potential","title":"How do I discover my strongest potential?","keywords":["discover potential","find strengths","what am I good at","natural ability"],"answer":"Look for repeated interests, tasks you learn unusually fast, problems people ask you to solve, positive feedback you receive, and work that gives you energy even when it requires effort.","details":"Do not rely on one personality test. Collect evidence from your experiences, results, feedback, and patterns over time, then choose one strength to develop deliberately."},{"id":"article-skills-stack","title":"What is skill stacking?","keywords":["skill stacking","combine skills","complementary skills"],"answer":"Skill stacking means combining a few abilities that strengthen one another. You may not be the world's best at each one, but the combination can make your contribution unusually useful.","details":"For example, teaching knowledge plus communication, presentation design, technology, leadership, and content creation can create far more value than any one skill alone."},{"id":"article-skills-technology","title":"How can technology multiply my strengths?","keywords":["technology multiplier","technology skills","use technology for growth"],"answer":"Choose technology that improves what you already do well. A teacher can use digital presentations and video; a businessperson can use spreadsheets and online communication; a creator can use editing, design, and publishing tools.","details":"Technology should make your work clearer, faster, more organised, or easier to share. It should strengthen thinking and service—not replace them."},{"id":"article-skills-visible","title":"How do I make my skills visible without arrogance?","keywords":["show skills","visibility","portfolio","self promotion arrogance"],"answer":"Let completed work provide the evidence. Build a small portfolio, share useful lessons, document results, solve problems, and communicate your contribution clearly without exaggeration.","details":"Do not become noisy without substance, but do not remain so hidden that nobody knows what you can contribute."},{"id":"article-skills-challenge","title":"What is the article's 30-day challenge?","keywords":["30 day skill challenge","four week challenge","skill building plan"],"answer":"Week 1: identify one strong potential. Week 2: practise one valuable skill. Week 3: add one useful technology skill. Week 4: create one small piece of visible evidence.","details":"Keep it simple. The goal is not perfection in thirty days; it is to replace vague ambition with focused, visible progress."}],"continue":[{"title":"Start a Practical ICT Skill","url":"courses.html"},{"title":"Practise with a Free Tool","url":"tools.html"},{"title":"Read More Personal Growth","url":"faith-inspiration.html"}]},
    {"id":"digital-skills-beginner","title":"Digital Skills Every Beginner Should Learn","subtitle":"Start small and build your future","description":"A simple guide to the practical digital skills every beginner can learn step by step.","url":"digital-skills-every-beginner-should-learn.html","date":"2026-07-15","dateLabel":"15 July 2026","readingLabel":"Digital Skills · Personal Growth","categories":["technology","faith"],"primaryCategory":"technology","featured":false,"image":"assets/images/social/social-digital-skills-beginner.jpg","socialImage":"assets/images/social/social-digital-skills-beginner.jpg","quote":"A confident digital learner is someone who is willing to keep learning.","keywords":"digital skills beginner computer typing folders internet email word excel powerpoint smartphone cloud troubleshooting pdf online learning","assistantSummary":"This article gives beginners a clear map of practical computer, internet, communication, Microsoft Office, smartphone, cloud, PDF, troubleshooting, and online-learning skills.","keyIdeas":["Start with basic computer confidence.","Build typing, file-management, internet, email, Word, Excel, and PowerPoint skills step by step."],"assistantQuestions":[],"continue":[{"title":"Start Computer Basics","url":"courses.html#beginner-installments"},{"title":"Practise Typing","url":"typing-trainer.html"},{"title":"Explore ICT Lessons","url":"courses.html"}]},
    {"id":"why-technology","title":"Why Technology Is Necessary in Today’s World","subtitle":"Learn, adapt, and move forward","description":"An inspiring guide to learning, adapting, and using technology to move forward.","url":"why-technology-is-necessary.html","date":"2026-07-12","dateLabel":"12 July 2026","readingLabel":"Technology · Personal Growth","categories":["technology"],"primaryCategory":"technology","featured":false,"image":"assets/images/social/social-why-technology.jpg","socialImage":"assets/images/social/social-why-technology.jpg","quote":"You do not need to become an expert today. You only need the courage to begin.","keywords":"technology digital skills learning work business beginner future","assistantSummary":"This article explains why technology matters in learning, work, communication, business, problem-solving, and adapting to a changing world.","keyIdeas":["Technology is part of everyday opportunity.","Beginners can start small and learn progressively."],"assistantQuestions":[],"continue":[{"title":"Choose a Digital Skill","url":"digital-skills-every-beginner-should-learn.html"},{"title":"Open Learning Tools","url":"tools.html"},{"title":"Join the ICT Community","url":"https://chat.whatsapp.com/Fd9rDqOyxRrKUctGqfevmt"}]},
    {"id":"small-beginnings","title":"The Power of Small Beginnings","subtitle":"Start where you are and use what you have","description":"An encouragement to begin faithfully, use what you have, and grow one step at a time.","url":"the-power-of-small-beginnings.html","date":"2026-07-10","dateLabel":"10 July 2026","readingLabel":"Faith · Personal Growth","categories":["faith"],"primaryCategory":"faith","featured":false,"image":"assets/images/start-where-you-are.webp","socialImage":"assets/images/social/social-small-beginnings.jpg","quote":"A seed does not need to look like a harvest before it is planted.","keywords":"small beginnings start purpose faith courage Zechariah","assistantSummary":"This article encourages readers not to despise small beginnings, but to start with what they have, remain faithful, and allow steady action to grow into something meaningful.","keyIdeas":["Small beginnings can carry great potential.","Faithful action matters more than waiting for perfect conditions."],"assistantQuestions":[],"continue":[{"title":"Begin Computer Basics","url":"courses.html#beginner-installments"},{"title":"Complete One Assignment","url":"assignments.html"},{"title":"Read More Inspiration","url":"faith-inspiration.html"}]}
  ],
};
