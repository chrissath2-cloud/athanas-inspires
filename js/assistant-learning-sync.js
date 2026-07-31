(() => {
  "use strict";
  const content = window.ATHANAS_LEARNING_CONTENT;
  const assistant = window.ATHANAS_ASSISTANT_DATA;
  if (!content || !assistant) return;

  assistant.version = "2.3.0";
  assistant.updated = content.updated;
  assistant.youtubeChannel = content.site.youtubeChannel;
  assistant.whatsappCommunity = content.site.whatsappCommunity;
  assistant.greeting = "Hello 👋 I’m the Athanas Inspires AI Assistant. I can guide you through official pages, articles, ICT lessons, assignments, downloads, tools, education resources, and support options.";

  assistant.lessons = {};
  content.series.forEach((series) => {
    const key = series.theme === "basics" ? "computer" : series.theme;
    assistant.lessons[key] = series.lessons.filter((lesson) => lesson.status === "published").map((lesson) => ({ session: lesson.session, title: lesson.title, url: lesson.videoUrl }));
  });
  assistant.assignments = {
    word: content.assignments.filter((item) => item.series.includes("Word")).map((item) => ({ session: item.title, title: item.title, url: `assignments.html#${item.anchor}`, download: item.downloadUrl })),
    excel: content.assignments.filter((item) => item.series.includes("Excel")).map((item) => ({ session: item.title.match(/Session\s+\d+/i)?.[0] || item.title, title: item.title, url: `assignments.html#${item.anchor}`, download: item.downloadUrl }))
  };
  assistant.tools = content.tools.filter((item) => item.status === "available").map((item) => ({ id: item.id, label: item.title, need: item.purpose, description: item.description, url: item.url, keywords: [item.title, item.purpose, item.level] }));

  const generated = [];
  const add = (item) => generated.push({ aliases: [], details: "", actions: [], related: [], nextStep: "Open the related Athanas Inspires resource and continue with one practical step.", sourceType: "official", sourceLabel: "Official Athanas Inspires Content", ...item });
  (content.pages || []).forEach((page) => add({ id: `page-${page.id}`, topic: "Website Navigation", title: `What can I find on ${page.title}?`, keywords: [page.title, page.description, page.keywords, page.url], answer: page.description, details: `This is a public Athanas Inspires page. Open it for the complete information and current links.`, actions: [{ label: `Open ${page.title}`, url: page.url, kind: "primary" }], related: [{ label: "Explore the Website", url: "/index.html" }], nextStep: `Open ${page.title} and choose the most relevant next action.` }));
  (content.articles || []).forEach((article) => {
    add({ id: `article-${article.id}`, topic: "Articles", title: article.title, keywords: [article.title, article.subtitle, article.keywords, ...(article.keyIdeas || [])], answer: article.assistantSummary || article.description, details: (article.keyIdeas || []).join(" "), actions: [{ label: "Read the Full Article", url: article.url, kind: "primary" }], related: [{ label: "More Inspiration", url: "/faith-inspiration.html" }, { label: "Technology Insights", url: "/technology-insights.html" }], nextStep: "Read the article, identify one useful idea, and apply it in a small practical action." });
    (article.assistantQuestions || []).forEach((item) => add({ ...item, topic: article.title, keywords: [...(item.keywords || []), article.title], actions: [{ label: "Read the Full Article", url: article.url, kind: "primary" }] }));
  });
  content.series.forEach((series) => {
    add({ id: `series-${series.id}`, topic: "ICT Lessons", title: `What is in the ${series.title} series?`, keywords: [series.title, series.description, series.shortDescription], answer: series.description, details: series.lessons.map((lesson) => `${lesson.displayTitle}: ${lesson.description} (${lesson.status === "published" ? "available" : "coming soon"}).`).join(" "), actions: [{ label: `Open ${series.title}`, url: `courses.html#${series.anchor}`, kind: "primary" }], related: [{ label: "Assignments", url: "/assignments.html" }, { label: "YouTube Learning Hub", url: "/youtube.html" }], nextStep: "Continue with the earliest session in this series that you have not yet completed." });
    series.lessons.forEach((lesson) => add({ id: `lesson-${lesson.id}`, topic: series.title, title: lesson.displayTitle, keywords: [series.title, lesson.title, lesson.description, lesson.session], answer: lesson.description, details: lesson.status === "published" ? "This lesson is available now." : "This lesson is being prepared and is marked Coming Soon.", actions: [{ label: lesson.status === "published" ? "Watch Lesson" : "Open Learning Roadmap", url: lesson.status === "published" ? lesson.videoUrl : `courses.html#${series.anchor}`, kind: "primary" }], related: [{ label: `Open ${series.title}`, url: `courses.html#${series.anchor}` }, { label: "Practise with Assignments", url: "/assignments.html" }], nextStep: lesson.status === "published" ? "Watch the lesson and repeat each demonstrated step before moving forward." : "Continue practising the available sessions while this lesson is being prepared." }));
  });
  content.assignments.forEach((item) => add({ id: `assignment-${item.id}`, topic: "Assignments", title: item.title, keywords: [item.title, item.series, item.description, "download submit practice"], answer: item.description, details: "Follow the website journey: watch the lesson, download the file, complete the task, and submit it through the provided WhatsApp link.", actions: [{ label: "Open Assignment", url: `assignments.html#${item.anchor}`, kind: "primary" }, { label: item.downloadLabel, url: item.downloadUrl }], related: [{ label: "Watch Related Lessons", url: "/courses.html" }, { label: "Open Downloads", url: "/downloads.html" }], nextStep: "Watch the related lesson first, download the file, complete the task, and check your work before submitting." }));
  content.downloads.forEach((item) => add({ id: `download-${item.id}`, topic: "Downloads", title: item.title, keywords: [item.title, item.category, item.type, item.description], answer: item.description, details: `File type: ${item.type}.`, actions: [{ label: "Download File", url: item.url, kind: "primary" }, { label: "Open Related Assignment", url: item.relatedUrl }] }));
  content.tools.forEach((item) => add({ id: `tool-${item.id}`, topic: "Digital Tools", title: item.title, keywords: [item.title, item.description, item.level, item.purpose], answer: item.description, details: item.status === "available" ? "This tool is available now." : "This tool is marked Coming Soon.", actions: [{ label: item.status === "available" ? "Open Tool" : "View Tools", url: item.url || "/digital-tools/index.html", kind: "primary" }], related: [{ label: "Explore All Digital Tools", url: "/digital-tools/index.html" }, { label: "ICT Lessons", url: "/courses.html" }], nextStep: item.status === "available" ? "Open the tool and complete one focused practice round." : "Explore the available tools while this one is being prepared." }));
  add({ id: "global-site-search", topic: "Website Help", title: "How can I search the website?", keywords: ["search website", "find lesson", "find tool", "global search"], answer: "Use the Search button in the navigation bar to find pages, articles, lessons, assignments, downloads, tools, FAQs, and support information across the whole website." });
  add({ id: "website-current-update", topic: "Website Updates", title: "What is the newest Athanas Inspires article?", keywords: ["new article", "latest article", "website update", "new content"], answer: "The newest featured article is Build Skills That Make You Difficult to Ignore. It helps readers discover strong potential, build complementary skills, use technology as a multiplier, and turn hidden ability into visible value.", actions: [{ label: "Read the New Article", url: "build-skills-that-make-you-difficult-to-ignore.html", kind: "primary" }] });

  const generatedIds = new Set(generated.map((item) => item.id));
  assistant.knowledge = [...generated, ...(assistant.knowledge || []).filter((item) => !generatedIds.has(item.id))];
  const featured = (content.articles || []).find((item) => item.id === content.featuredArticleId);
  if (featured) assistant.featuredFaith = { quote: featured.quote, title: featured.title, url: featured.url, page: "faith-inspiration.html" };
  assistant.siteMap = { pages: content.pages || [], articles: content.articles || [], updated: content.updated };
})();
