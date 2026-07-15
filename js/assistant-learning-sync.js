(() => {
  "use strict";
  const content = window.ATHANAS_LEARNING_CONTENT;
  const assistant = window.ATHANAS_ASSISTANT_DATA;
  if (!content || !assistant) return;

  assistant.version = "1.6.0";
  assistant.updated = content.updated;
  assistant.youtubeChannel = content.site.youtubeChannel;
  assistant.whatsappCommunity = content.site.whatsappCommunity;
  assistant.greeting = "Hello. I’m the Athanas Inspires Assistant. I can guide you through the YouTube Learning Hub, ICT lessons, assignments, tools, downloads, and support.";

  assistant.lessons = {};
  content.series.forEach((series) => {
    const key = series.theme === "basics" ? "computer" : series.theme;
    assistant.lessons[key] = series.lessons.filter((lesson) => lesson.status === "published").map((lesson) => ({ session: lesson.session, title: lesson.title, url: lesson.videoUrl }));
  });

  assistant.assignments = {
    word: content.assignments.filter((item) => item.series.includes("Word")).map((item) => ({ session: item.title, title: item.title, url: `assignments.html#${item.anchor}`, download: item.downloadUrl })),
    excel: content.assignments.filter((item) => item.series.includes("Excel")).map((item) => ({ session: item.title.match(/Session\s+\d+/i)?.[0] || item.title, title: item.title, url: `assignments.html#${item.anchor}`, download: item.downloadUrl }))
  };

  const newKnowledge = [
    {
      id: "youtube-learning-hub",
      topic: "YouTube Learning Hub",
      title: "What is the YouTube Learning Hub?",
      keywords: ["youtube page", "youtube learning", "videos", "channel", "learning hub", "video lessons"],
      answer: "The YouTube Learning Hub is the premium Athanas Inspires video-learning page. It guides absolute beginners through Computer Basics, Microsoft Word, and Microsoft Excel, features Word Session 3, shows the upcoming Excel Session 5, and includes real learner testimonials.",
      actions: [{ label: "Open YouTube Learning Hub", url: "youtube.html" }, { label: "Subscribe on YouTube", url: content.site.youtubeSubscribe }]
    },
    {
      id: "excel-session-5-upcoming",
      topic: "Microsoft Excel",
      title: "Is Excel Session 5 available?",
      keywords: ["excel session 5", "nested if", "upcoming excel", "next excel lesson"],
      answer: "Excel Session 5, Building Smart Decision Systems with Nested IF, is the upcoming Excel lesson. Subscribe to the Athanas Inspires YouTube Channel or join the WhatsApp ICT Community so you do not miss it.",
      actions: [{ label: "Open Upcoming Lesson Preview", url: "youtube.html#excel-series" }, { label: "Watch Excel Session 4 First", url: "https://www.youtube.com/watch?v=QqfmHzystTc" }]
    },
    {
      id: "featured-word-session-3",
      topic: "Microsoft Word",
      title: "Which lesson is featured on the YouTube page?",
      keywords: ["featured lesson", "word session 3", "visual documents", "pictures wordart"],
      answer: "Word Session 3 is the featured lesson. It teaches pictures, Wrap Text, shapes, text boxes, WordArt, symbols, and equations for professional visual documents.",
      actions: [{ label: "Watch Word Session 3", url: "https://www.youtube.com/watch?v=Fr0np3nukWg" }, { label: "Open Its Assignment", url: "assignments.html#word-session-3-assignment" }]
    },
    {
      id: "global-site-search",
      topic: "Website Help",
      title: "How can I search the website?",
      keywords: ["search website", "find lesson", "find tool", "global search"],
      answer: "Use the Search button in the navigation bar to find lessons, assignments, downloads, tools, articles, FAQs, and support pages across the whole website."
    }
  ];
  assistant.knowledge = [...newKnowledge, ...(assistant.knowledge || []).filter((item) => !newKnowledge.some((entry) => entry.id === item.id))];
})();
