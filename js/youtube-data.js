/* YouTube page adapter. All lesson details come from learning-content.js. */
(() => {
  const source = window.ATHANAS_LEARNING_CONTENT;
  if (!source) return;
  const findLesson = (id) => source.series.flatMap((series) => series.lessons).find((lesson) => lesson.id === id);
  const featuredLesson = findLesson(source.featuredLessonId);
  const assignment = source.assignments.find((item) => item.lessonId === featuredLesson?.id);
  window.ATHANAS_YOUTUBE_DATA = {
    channelUrl: source.site.youtubeChannel,
    subscribeUrl: source.site.youtubeSubscribe,
    whatsappUrl: source.site.whatsappCommunity,
    featured: {
      id: featuredLesson.videoId,
      title: featuredLesson.displayTitle,
      url: featuredLesson.videoUrl,
      assignmentUrl: assignment ? `assignments.html#${assignment.anchor}` : "assignments.html"
    },
    series: source.series.map((series) => ({
      id: series.id,
      navLabel: series.navLabel,
      eyebrow: series.eyebrow,
      title: series.title,
      description: series.shortDescription,
      art: series.art,
      theme: series.theme,
      lessons: series.lessons.filter((lesson) => lesson.status === "published").map((lesson) => {
        const lessonAssignment = source.assignments.find((item) => item.lessonId === lesson.id);
        const actions = [];
        if (lessonAssignment) actions.push({ label: "Assignment", url: `assignments.html#${lessonAssignment.anchor}`, kind: "practice" });
        (lesson.resources || []).forEach((resource) => actions.push({ label: resource.label, url: resource.url, kind: "download" }));
        return { title: lesson.displayTitle, id: lesson.videoId, url: lesson.videoUrl, actions };
      })
    })),
    upcoming: (() => {
      const lesson = findLesson("excel-5");
      return {
        status: "Coming Soon",
        title: "Excel Session 5",
        subtitle: lesson.title,
        preview: lesson.description,
        previousUrl: findLesson("excel-4").videoUrl
      };
    })(),
    testimonials: source.testimonials
  };
})();
