import { adminDb } from "@/lib/firebase-admin";
import { v4 as uuidv4 } from "uuid";

interface AIGeneratedCourse {
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  instructor: string;
  lessons: {
    title: string;
    description: string;
    duration: string;
    youtubeQuery: string;
  }[];
}

interface CourseTopic {
  topic: string;
  category: string;
}

/**
 * ============================================================
 * GROQ MODELS
 * ============================================================
 */

const PREFERRED_MODELS = [
  "openai/gpt-oss-120b",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile",
];

/**
 * ============================================================
 * 100 COURSE TOPICS
 *
 * 15 Web Development
 * 10 Data Science
 * 10 Mobile Development
 * 10 UI/UX Design
 * 10 Cybersecurity
 * 10 Cloud Computing
 * 15 Artificial Intelligence
 * 20 Digital Marketing
 *
 * TOTAL = 100
 * ============================================================
 */

const topicsByCategory: CourseTopic[] = [
  // ==========================================================
  // WEB DEVELOPMENT — 15
  // ==========================================================

  {
    topic: "Complete Web Development with React and Next.js",
    category: "Web Development",
  },
  {
    topic: "Full-Stack JavaScript with Node.js and Express",
    category: "Web Development",
  },
  {
    topic: "HTML and CSS Fundamentals for Beginners",
    category: "Web Development",
  },
  {
    topic: "Modern JavaScript from Beginner to Advanced",
    category: "Web Development",
  },
  {
    topic: "TypeScript for Modern Web Development",
    category: "Web Development",
  },
  {
    topic: "React.js Complete Beginner to Advanced Course",
    category: "Web Development",
  },
  {
    topic: "Next.js Full-Stack Application Development",
    category: "Web Development",
  },
  {
    topic: "Node.js Backend Development",
    category: "Web Development",
  },
  {
    topic: "Express.js REST API Development",
    category: "Web Development",
  },
  {
    topic: "REST API Design and Development",
    category: "Web Development",
  },
  {
    topic: "Git and GitHub for Web Developers",
    category: "Web Development",
  },
  {
    topic: "Database Development for Web Applications",
    category: "Web Development",
  },
  {
    topic: "Authentication and Authorization for Web Apps",
    category: "Web Development",
  },
  {
    topic: "Full-Stack Web Application Development",
    category: "Web Development",
  },
  {
    topic: "Web Performance Optimization and SEO",
    category: "Web Development",
  },

  // ==========================================================
  // DATA SCIENCE — 10
  // ==========================================================

  {
    topic: "Python for Data Science and Machine Learning",
    category: "Data Science",
  },
  {
    topic: "Data Visualization with Python and Tableau",
    category: "Data Science",
  },
  {
    topic: "Statistics for Data Science",
    category: "Data Science",
  },
  {
    topic: "SQL for Data Analysis",
    category: "Data Science",
  },
  {
    topic: "Pandas and NumPy for Data Analysis",
    category: "Data Science",
  },
  {
    topic: "Power BI for Data Analytics",
    category: "Data Science",
  },
  {
    topic: "Excel for Data Analysis",
    category: "Data Science",
  },
  {
    topic: "Exploratory Data Analysis with Python",
    category: "Data Science",
  },
  {
    topic: "Data Cleaning and Preparation with Python",
    category: "Data Science",
  },
  {
    topic: "Business Intelligence and Data Analytics",
    category: "Data Science",
  },

  // ==========================================================
  // MOBILE DEVELOPMENT — 10
  // ==========================================================

  {
    topic: "Flutter Mobile App Development for Beginners",
    category: "Mobile Development",
  },
  {
    topic: "React Native: Build Cross-Platform Mobile Apps",
    category: "Mobile Development",
  },
  {
    topic: "Dart Programming for Flutter Developers",
    category: "Mobile Development",
  },
  {
    topic: "Advanced Flutter Application Development",
    category: "Mobile Development",
  },
  {
    topic: "Advanced React Native Development",
    category: "Mobile Development",
  },
  {
    topic: "Expo React Native Development",
    category: "Mobile Development",
  },
  {
    topic: "Firebase Integration for Mobile Applications",
    category: "Mobile Development",
  },
  {
    topic: "Mobile App UI Development and Navigation",
    category: "Mobile Development",
  },
  {
    topic: "Mobile App Authentication and Security",
    category: "Mobile Development",
  },
  {
    topic: "Publishing and Monetizing Mobile Applications",
    category: "Mobile Development",
  },

  // ==========================================================
  // UI/UX DESIGN — 10
  // ==========================================================

  {
    topic: "UI/UX Design Principles with Figma",
    category: "UI/UX Design",
  },
  {
    topic: "User Research and Design Thinking for Digital Products",
    category: "UI/UX Design",
  },
  {
    topic: "Figma for Beginners",
    category: "UI/UX Design",
  },
  {
    topic: "Advanced Figma and Design Systems",
    category: "UI/UX Design",
  },
  {
    topic: "Mobile App UI Design",
    category: "UI/UX Design",
  },
  {
    topic: "Web Design and User Experience",
    category: "UI/UX Design",
  },
  {
    topic: "UX Research and Usability Testing",
    category: "UI/UX Design",
  },
  {
    topic: "Wireframing and Prototyping",
    category: "UI/UX Design",
  },
  {
    topic: "Design Systems and Component Libraries",
    category: "UI/UX Design",
  },
  {
    topic: "Portfolio Design for UI/UX Designers",
    category: "UI/UX Design",
  },

  // ==========================================================
  // CYBERSECURITY — 10
  // ==========================================================

  {
    topic: "Cybersecurity Fundamentals and Ethical Hacking",
    category: "Cybersecurity",
  },
  {
    topic: "Network Security and Penetration Testing",
    category: "Cybersecurity",
  },
  {
    topic: "Cybersecurity for Beginners",
    category: "Cybersecurity",
  },
  {
    topic: "Ethical Hacking Fundamentals",
    category: "Cybersecurity",
  },
  {
    topic: "Web Application Security",
    category: "Cybersecurity",
  },
  {
    topic: "Network Security Fundamentals",
    category: "Cybersecurity",
  },
  {
    topic: "Cyber Threat Intelligence",
    category: "Cybersecurity",
  },
  {
    topic: "Digital Forensics Fundamentals",
    category: "Cybersecurity",
  },
  {
    topic: "Identity and Access Management",
    category: "Cybersecurity",
  },
  {
    topic: "Security Operations and Incident Response",
    category: "Cybersecurity",
  },

  // ==========================================================
  // CLOUD COMPUTING — 10
  // ==========================================================

  {
    topic: "AWS Cloud Computing and Serverless Architecture",
    category: "Cloud Computing",
  },
  {
    topic: "Microsoft Azure Fundamentals and Cloud Services",
    category: "Cloud Computing",
  },
  {
    topic: "Google Cloud Platform Fundamentals",
    category: "Cloud Computing",
  },
  {
    topic: "AWS Solutions Architecture",
    category: "Cloud Computing",
  },
  {
    topic: "AWS Serverless Application Development",
    category: "Cloud Computing",
  },
  {
    topic: "Microsoft Azure Solutions Architecture",
    category: "Cloud Computing",
  },
  {
    topic: "Cloud Security Fundamentals",
    category: "Cloud Computing",
  },
  {
    topic: "Cloud DevOps and Continuous Deployment",
    category: "Cloud Computing",
  },
  {
    topic: "Docker and Containerization",
    category: "Cloud Computing",
  },
  {
    topic: "Kubernetes and Container Orchestration",
    category: "Cloud Computing",
  },

  // ==========================================================
  // ARTIFICIAL INTELLIGENCE — 15
  // ==========================================================

  {
    topic: "Generative AI and Large Language Models",
    category: "Artificial Intelligence",
  },
  {
    topic: "Prompt Engineering for AI Applications",
    category: "Artificial Intelligence",
  },
  {
    topic: "Retrieval-Augmented Generation with Vector Databases",
    category: "Artificial Intelligence",
  },
  {
    topic: "Building Autonomous AI Agents with LangChain",
    category: "Artificial Intelligence",
  },
  {
    topic: "Computer Vision and Image Recognition with OpenCV",
    category: "Artificial Intelligence",
  },
  {
    topic: "Fine-Tuning Open Source LLMs",
    category: "Artificial Intelligence",
  },
  {
    topic: "MLOps: Deploying and Scaling AI Models in Production",
    category: "Artificial Intelligence",
  },
  {
    topic: "Machine Learning Fundamentals with Python",
    category: "Artificial Intelligence",
  },
  {
    topic: "Deep Learning with TensorFlow",
    category: "Artificial Intelligence",
  },
  {
    topic: "Deep Learning with PyTorch",
    category: "Artificial Intelligence",
  },
  {
    topic: "Natural Language Processing with Python",
    category: "Artificial Intelligence",
  },
  {
    topic: "Building AI Applications with APIs",
    category: "Artificial Intelligence",
  },
  {
    topic: "AI Automation for Business",
    category: "Artificial Intelligence",
  },
  {
    topic: "AI Product Development",
    category: "Artificial Intelligence",
  },
  {
    topic: "Responsible AI and AI Ethics",
    category: "Artificial Intelligence",
  },

  // ==========================================================
  // DIGITAL MARKETING — 20
  // ==========================================================

  {
    topic: "Digital Marketing Fundamentals",
    category: "Digital Marketing",
  },
  {
    topic: "Social Media Marketing from Beginner to Advanced",
    category: "Digital Marketing",
  },
  {
    topic: "Search Engine Optimization SEO",
    category: "Digital Marketing",
  },
  {
    topic: "Google Ads and Paid Search Marketing",
    category: "Digital Marketing",
  },
  {
    topic: "Facebook and Instagram Advertising",
    category: "Digital Marketing",
  },
  {
    topic: "Content Marketing Strategy",
    category: "Digital Marketing",
  },
  {
    topic: "Email Marketing and Marketing Automation",
    category: "Digital Marketing",
  },
  {
    topic: "Affiliate Marketing and Online Income",
    category: "Digital Marketing",
  },
  {
    topic: "Digital Marketing Analytics with Google Analytics",
    category: "Digital Marketing",
  },
  {
    topic: "Building a Complete Digital Marketing Strategy",
    category: "Digital Marketing",
  },
  {
    topic: "TikTok Marketing and Short Form Video Strategy",
    category: "Digital Marketing",
  },
  {
    topic: "YouTube Marketing and Video SEO",
    category: "Digital Marketing",
  },
  {
    topic: "LinkedIn Marketing for Professionals and Businesses",
    category: "Digital Marketing",
  },
  {
    topic: "Influencer Marketing and Creator Partnerships",
    category: "Digital Marketing",
  },
  {
    topic: "Copywriting for Digital Marketing",
    category: "Digital Marketing",
  },
  {
    topic: "Lead Generation and Conversion Optimization",
    category: "Digital Marketing",
  },
  {
    topic: "Ecommerce Marketing and Online Store Growth",
    category: "Digital Marketing",
  },
  {
    topic: "WhatsApp Marketing for Businesses",
    category: "Digital Marketing",
  },
  {
    topic: "Personal Branding and Online Presence",
    category: "Digital Marketing",
  },
  {
    topic: "Digital Marketing Freelancing and Client Acquisition",
    category: "Digital Marketing",
  },
];

/**
 * ============================================================
 * COURSE COUNT VALIDATION
 * ============================================================
 */

const EXPECTED_TOTAL_COURSES = 100;
const EXPECTED_DIGITAL_MARKETING_COURSES = 20;

if (topicsByCategory.length !== EXPECTED_TOTAL_COURSES) {
  throw new Error(
    `Expected exactly ${EXPECTED_TOTAL_COURSES} course topics, but found ${topicsByCategory.length}`
  );
}

const digitalMarketingTopics = topicsByCategory.filter(
  (course) => course.category === "Digital Marketing"
);

if (
  digitalMarketingTopics.length !==
  EXPECTED_DIGITAL_MARKETING_COURSES
) {
  throw new Error(
    `Expected exactly ${EXPECTED_DIGITAL_MARKETING_COURSES} Digital Marketing courses, but found ${digitalMarketingTopics.length}`
  );
}

/**
 * ============================================================
 * CATEGORY VALIDATION
 * ============================================================
 */

const expectedCategoryCounts: Record<string, number> = {
  "Web Development": 15,
  "Data Science": 10,
  "Mobile Development": 10,
  "UI/UX Design": 10,
  Cybersecurity: 10,
  "Cloud Computing": 10,
  "Artificial Intelligence": 15,
  "Digital Marketing": 20,
};

for (const [category, expectedCount] of Object.entries(
  expectedCategoryCounts
)) {
  const actualCount = topicsByCategory.filter(
    (course) => course.category === category
  ).length;

  if (actualCount !== expectedCount) {
    throw new Error(
      `Category "${category}" expected ${expectedCount} courses but found ${actualCount}`
    );
  }
}

/**
 * ============================================================
 * GROQ HELPERS
 * ============================================================
 */

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGroq(
  apiKey: string,
  model: string,
  prompt: string
): Promise<string> {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model,

        temperature: 0.7,

        max_tokens: 7000,

        response_format: {
          type: "json_object",
        },

        messages: [
          {
            role: "system",
            content:
              "You are an expert online course curriculum designer. Return valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    }
  );

  if (response.status === 404) {
    throw new Error(`MODEL_NOT_FOUND:${model}`);
  }

  if (response.status === 429) {
    throw new Error("RATE_LIMITED");
  }

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Groq API error ${response.status}: ${errorText}`
    );
  }

  const data = await response.json();

  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq returned an empty response.");
  }

  return content;
}

/**
 * ============================================================
 * GENERATE COURSE
 * ============================================================
 */

async function generateCourseWithGroq(
  topic: string,
  category: string
): Promise<AIGeneratedCourse> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const isDigitalMarketing =
    category === "Digital Marketing";

  const prompt = `
Create a complete professional online course for the Academiq learning platform.

COURSE TOPIC:
${topic}

COURSE CATEGORY:
${category}

${
  isDigitalMarketing
    ? `
IMPORTANT DIGITAL MARKETING REQUIREMENTS:

This is a Digital Marketing course.

The curriculum must contain practical and current digital marketing skills.

Cover relevant concepts such as:
- audience research
- customer personas
- content strategy
- social media
- search engine optimization
- paid advertising
- analytics
- conversion
- lead generation
- customer journeys
- online branding
- marketing tools
- campaign planning
- measuring marketing performance

Only include concepts that are relevant to the specific course topic.

Make the lessons practical and suitable for someone who wants to apply the skill to a real business, brand, personal project, freelance service, or online business.
`
    : ""
}

Return JSON with exactly this structure:

{
  "title": "Professional course title",
  "description": "Detailed but concise course description",
  "category": "${category}",
  "level": "Beginner",
  "duration": "6 hours",
  "instructor": "Academiq Instructor",
  "lessons": [
    {
      "title": "Lesson title",
      "description": "Lesson description",
      "duration": "15 minutes",
      "youtubeQuery": "Specific YouTube educational search query"
    }
  ]
}

REQUIREMENTS:

1. Create between 8 and 12 lessons.

2. Lessons must follow a logical learning progression.

3. Start with fundamentals and progress toward practical skills.

4. Make the course suitable for real students.

5. Keep the course specifically focused on:
"${topic}"

6. Keep the category exactly:
"${category}"

7. Do not create unrelated lessons.

8. Every lesson must have:
- title
- description
- duration
- youtubeQuery

9. Every YouTube query must be specific enough to find useful educational videos.

10. Do not include fake claims about certificates.

11. Do not include fake employment guarantees.

12. Do not include markdown.

13. Do not include explanations outside the JSON.

14. Return valid JSON only.

15. Use professional educational language.

16. Make lesson titles clear and easy for students to understand.

17. Avoid unnecessary symbols in lesson titles.

18. The course should feel like a complete professional course rather than a list of random topics.

19. Make the lesson progression useful for someone learning from beginner level toward practical application.

20. Return exactly one course object.
`;

  let lastError: unknown = null;

  for (const model of PREFERRED_MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(
          `🤖 Generating "${topic}" using ${model} (attempt ${attempt}/3)`
        );

        const raw = await callGroq(
          apiKey,
          model,
          prompt
        );

        const parsed = JSON.parse(
          raw
        ) as AIGeneratedCourse;

        if (!parsed.title) {
          throw new Error(
            "Generated course has no title."
          );
        }

        if (!parsed.description) {
          throw new Error(
            "Generated course has no description."
          );
        }

        if (!Array.isArray(parsed.lessons)) {
          throw new Error(
            "Generated course has invalid lessons."
          );
        }

        if (parsed.lessons.length < 8) {
          throw new Error(
            `Generated course has only ${parsed.lessons.length} lessons. Minimum is 8.`
          );
        }

        if (parsed.lessons.length > 12) {
          parsed.lessons = parsed.lessons.slice(
            0,
            12
          );
        }

        /**
         * Never allow the AI to change the category.
         */
        parsed.category = category;

        /**
         * Ensure required lesson values exist.
         */
        parsed.lessons = parsed.lessons.map(
          (lesson, index) => ({
            title:
              lesson.title?.trim() ||
              `Lesson ${index + 1}`,

            description:
              lesson.description?.trim() ||
              "Learn the key concepts covered in this lesson.",

            duration:
              lesson.duration?.trim() ||
              "15 minutes",

            youtubeQuery:
              lesson.youtubeQuery?.trim() ||
              `${topic} lesson ${index + 1}`,
          })
        );

        return parsed;
      } catch (error) {
        lastError = error;

        const message =
          error instanceof Error
            ? error.message
            : String(error);

        console.warn(
          `⚠️ Generation failed for "${topic}" with ${model}: ${message}`
        );

        if (message.includes("MODEL_NOT_FOUND")) {
          break;
        }

        if (message === "RATE_LIMITED") {
          await sleep(5000 * attempt);
          continue;
        }

        if (attempt < 3) {
          await sleep(2000 * attempt);
        }
      }
    }
  }

  throw new Error(
    `Unable to generate course "${topic}". Last error: ${
      lastError instanceof Error
        ? lastError.message
        : String(lastError)
    }`
  );
}

/**
 * ============================================================
 * THUMBNAILS
 * ============================================================
 */

function getThumbnailForCategory(
  category: string
): string {
  const thumbnails: Record<string, string> = {
    "Web Development":
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085",

    "Data Science":
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71",

    "Mobile Development":
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",

    "UI/UX Design":
      "https://images.unsplash.com/photo-1561070791-2526d30994b5",

    Cybersecurity:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3",

    "Cloud Computing":
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa",

    "Artificial Intelligence":
      "https://images.unsplash.com/photo-1677442136019-21780ecad995",

    "Digital Marketing":
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
  };

  return (
    thumbnails[category] ??
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
  );
}

/**
 * ============================================================
 * CREATE SLUG
 * ============================================================
 */

function createSlug(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * ============================================================
 * NORMALIZE TEXT
 *
 * Used to compare old Firebase records with the new topic list.
 * ============================================================
 */

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * ============================================================
 * MAIN SEED FUNCTION
 * ============================================================
 */

export async function seedInitialCourses(): Promise<void> {
  console.log("");
  console.log(
    "=================================================="
  );
  console.log("📚 ACADEMIQ COURSE SEEDER");
  console.log(
    "=================================================="
  );

  console.log(
    `🎯 Target course topics: ${topicsByCategory.length}`
  );

  console.log(
    `📣 Target Digital Marketing courses: ${digitalMarketingTopics.length}`
  );

  /**
   * ----------------------------------------------------------
   * READ EXISTING COURSES
   * ----------------------------------------------------------
   */

  const coursesRef = adminDb.ref("courses");

  const snapshot = await coursesRef.get();

  const existingCourses = snapshot.exists()
    ? snapshot.val()
    : {};

  const existingCourseEntries =
    Object.entries(existingCourses);

  console.log(
    `📚 Existing courses in Firebase: ${existingCourseEntries.length}`
  );

  /**
   * ----------------------------------------------------------
   * INDEX EXISTING COURSES
   * ----------------------------------------------------------
   *
   * We check:
   *
   * 1. sourceTopic
   * 2. title
   *
   * This prevents duplicate courses while still allowing
   * old courses created before sourceTopic was introduced
   * to be detected.
   */

  const existingSourceTopics = new Set<string>();

  const existingTitles = new Set<string>();

  let existingDigitalMarketingCount = 0;

  for (const [, courseValue] of existingCourseEntries) {
    const course = courseValue as {
      title?: string;
      sourceTopic?: string;
      category?: string;
    };

    if (course.sourceTopic) {
      existingSourceTopics.add(
        normalizeText(course.sourceTopic)
      );
    }

    if (course.title) {
      existingTitles.add(
        normalizeText(course.title)
      );
    }

    if (
      course.category ===
      "Digital Marketing"
    ) {
      existingDigitalMarketingCount++;
    }
  }

  console.log(
    `📣 Existing Digital Marketing courses: ${existingDigitalMarketingCount}`
  );

  /**
   * ----------------------------------------------------------
   * FIND MISSING TOPICS
   * ----------------------------------------------------------
   */

  const missingTopics = topicsByCategory.filter(
    (courseTopic) => {
      const normalizedTopic = normalizeText(
        courseTopic.topic
      );

      /**
       * First check sourceTopic.
       */
      if (
        existingSourceTopics.has(
          normalizedTopic
        )
      ) {
        return false;
      }

      /**
       * Then check title.
       *
       * This is useful for older courses that were created
       * before sourceTopic was added.
       */
      if (
        existingTitles.has(
          normalizedTopic
        )
      ) {
        return false;
      }

      return true;
    }
  );

  console.log(
    `➕ Total missing courses: ${missingTopics.length}`
  );

  /**
   * ----------------------------------------------------------
   * FIND MISSING DIGITAL MARKETING COURSES
   * ----------------------------------------------------------
   */

  const missingDigitalMarketing =
    missingTopics.filter(
      (course) =>
        course.category ===
        "Digital Marketing"
    );

  console.log(
    `📣 Missing Digital Marketing courses: ${missingDigitalMarketing.length}`
  );

  /**
   * ----------------------------------------------------------
   * PRINT DIGITAL MARKETING TOPICS
   * ----------------------------------------------------------
   */

  if (missingDigitalMarketing.length > 0) {
    console.log("");
    console.log(
      "📣 DIGITAL MARKETING COURSES TO BE GENERATED:"
    );

    missingDigitalMarketing.forEach(
      (course, index) => {
        console.log(
          `   ${index + 1}. ${course.topic}`
        );
      }
    );
  }

  /**
   * ----------------------------------------------------------
   * NOTHING TO GENERATE
   * ----------------------------------------------------------
   */

  if (missingTopics.length === 0) {
    console.log("");
    console.log(
      "✅ All 100 course topics already exist."
    );

    if (
      existingDigitalMarketingCount <
      EXPECTED_DIGITAL_MARKETING_COURSES
    ) {
      console.warn("");
      console.warn(
        `⚠️ Firebase currently reports only ${existingDigitalMarketingCount} Digital Marketing courses.`
      );

      console.warn(
        "⚠️ If this happens, inspect the course records because some records may have an incorrect category."
      );
    } else {
      console.log("");
      console.log(
        "✅ All 20 Digital Marketing courses already exist."
      );
    }

    console.log("");
    console.log(
      "=================================================="
    );

    return;
  }

  /**
   * ----------------------------------------------------------
   * GENERATE AND SAVE COURSES
   * ----------------------------------------------------------
   */

  let generatedCount = 0;

  let generatedDigitalMarketingCount = 0;

  for (const courseTopic of missingTopics) {
    console.log("");
    console.log(
      "--------------------------------------------------"
    );

    console.log(
      `🔄 Generating: ${courseTopic.topic}`
    );

    console.log(
      `📂 Category: ${courseTopic.category}`
    );

    console.log(
      "--------------------------------------------------"
    );

    try {
      /**
       * Generate curriculum with Groq.
       */
      const generatedCourse =
        await generateCourseWithGroq(
          courseTopic.topic,
          courseTopic.category
        );

      /**
       * Generate Firebase course ID.
       */
      const courseId = uuidv4();

      /**
       * Current timestamp.
       */
      const now = Date.now();

      /**
       * Stable slug based on source topic.
       */
      const slug = createSlug(
        courseTopic.topic
      );

      /**
       * Build lesson records.
       */
      const lessons =
        generatedCourse.lessons.map(
          (lesson, index) => ({
            id: uuidv4(),

            order: index + 1,

            title: lesson.title,

            description:
              lesson.description,

            duration:
              lesson.duration,

            youtubeQuery:
              lesson.youtubeQuery,
          })
        );

      /**
       * Build complete Firebase record.
       */
      const courseRecord = {
        id: courseId,

        /**
         * IMPORTANT:
         * Store the original topic.
         *
         * This makes future seeding reliable.
         */
        sourceTopic:
          courseTopic.topic,

        /**
         * AI generated title.
         */
        title:
          generatedCourse.title,

        /**
         * AI generated description.
         */
        description:
          generatedCourse.description,

        /**
         * ALWAYS use the category from our
         * trusted topic list.
         */
        category:
          courseTopic.category,

        level:
          generatedCourse.level ||
          "Beginner",

        duration:
          generatedCourse.duration ||
          "6 hours",

        instructor:
          generatedCourse.instructor ||
          "Academiq Instructor",

        lessons,

        slug,

        price: 1000,

        currency: "NGN",

        thumbnail:
          getThumbnailForCategory(
            courseTopic.category
          ),

        enrolledStudents: 0,

        rating: 0,

        ratingCount: 0,

        published: true,

        createdAt: now,

        updatedAt: now,
      };

      /**
       * Save to Firebase Realtime Database.
       */
      await coursesRef
        .child(courseId)
        .set(courseRecord);

      generatedCount++;

      if (
        courseTopic.category ===
        "Digital Marketing"
      ) {
        generatedDigitalMarketingCount++;
      }

      console.log("");
      console.log(
        `✅ SAVED: ${courseTopic.topic}`
      );

      console.log(
        `📂 CATEGORY: ${courseTopic.category}`
      );

      console.log(
        `🆔 COURSE ID: ${courseId}`
      );

      console.log(
        `📖 LESSONS: ${lessons.length}`
      );

      if (
        courseTopic.category ===
        "Digital Marketing"
      ) {
        console.log(
          "📣 DIGITAL MARKETING COURSE SAVED"
        );
      }
    } catch (error) {
      console.error("");
      console.error(
        `❌ Failed to create: ${courseTopic.topic}`
      );

      console.error(error);

      /**
       * Continue with the remaining courses.
       */
      continue;
    }
  }

  /**
   * ----------------------------------------------------------
   * FINAL FIREBASE VERIFICATION
   * ----------------------------------------------------------
   */

  console.log("");
  console.log(
    "=================================================="
  );

  console.log(
    "🎉 SEEDING RUN COMPLETE"
  );

  console.log(
    "=================================================="
  );

  console.log(
    `🆕 Courses generated this run: ${generatedCount}`
  );

  console.log(
    `📣 Digital Marketing generated this run: ${generatedDigitalMarketingCount}`
  );

  /**
   * ----------------------------------------------------------
   * READ FIREBASE AGAIN
   * ----------------------------------------------------------
   */

  const finalSnapshot =
    await coursesRef.get();

  const finalCourses =
    finalSnapshot.exists()
      ? finalSnapshot.val()
      : {};

  const finalEntries =
    Object.entries(finalCourses);

  /**
   * ----------------------------------------------------------
   * FINAL CATEGORY COUNTS
   * ----------------------------------------------------------
   */

  const categoryCounts: Record<
    string,
    number
  > = {};

  for (const [, value] of finalEntries) {
    const course = value as {
      category?: string;
    };

    const category =
      course.category ||
      "Unknown";

    categoryCounts[category] =
      (categoryCounts[category] || 0) +
      1;
  }

  /**
   * ----------------------------------------------------------
   * FINAL DIGITAL MARKETING COUNT
   * ----------------------------------------------------------
   */

  const finalDigitalMarketingCourses =
    finalEntries.filter(
      ([, value]) => {
        const course = value as {
          category?: string;
        };

        return (
          course.category ===
          "Digital Marketing"
        );
      }
    );

  /**
   * ----------------------------------------------------------
   * DISPLAY FINAL RESULTS
   * ----------------------------------------------------------
   */

  console.log("");
  console.log(
    "📊 FINAL COURSE DATABASE"
  );

  console.log("");

  console.log(
    `📚 Total courses in Firebase: ${finalEntries.length}`
  );

  console.log(
    `📣 Digital Marketing courses: ${finalDigitalMarketingCourses.length}`
  );

  console.log("");

  console.log(
    "📊 COURSE CATEGORY COUNTS:"
  );

  console.log("");

  for (const [
    category,
    expectedCount,
  ] of Object.entries(
    expectedCategoryCounts
  )) {
    const actualCount =
      categoryCounts[category] || 0;

    const status =
      actualCount >= expectedCount
        ? "✅"
        : "⚠️";

    console.log(
      `   ${status} ${category}: ${actualCount}/${expectedCount}`
    );
  }

  /**
   * ----------------------------------------------------------
   * DIGITAL MARKETING VERIFICATION
   * ----------------------------------------------------------
   */

  console.log("");

  if (
    finalDigitalMarketingCourses.length >=
    EXPECTED_DIGITAL_MARKETING_COURSES
  ) {
    console.log(
      "✅ ALL 20 DIGITAL MARKETING COURSES ARE IN FIREBASE."
    );
  } else {
    console.warn(
      `⚠️ Digital Marketing is incomplete: ${finalDigitalMarketingCourses.length}/${EXPECTED_DIGITAL_MARKETING_COURSES}`
    );

    console.warn(
      "⚠️ Review the generation errors above."
    );
  }

  /**
   * ----------------------------------------------------------
   * TOTAL COURSE VERIFICATION
   * ----------------------------------------------------------
   */

  console.log("");

  if (
    finalEntries.length >=
    EXPECTED_TOTAL_COURSES
  ) {
    console.log(
      `✅ Firebase contains ${finalEntries.length} courses.`
    );
  } else {
    console.warn(
      `⚠️ Firebase contains only ${finalEntries.length}/${EXPECTED_TOTAL_COURSES} expected courses.`
    );
  }

  /**
   * ----------------------------------------------------------
   * CATEGORY MISMATCH CHECK
   * ----------------------------------------------------------
   */

  console.log("");

  let categoryMismatch = false;

  for (const [
    category,
    expectedCount,
  ] of Object.entries(
    expectedCategoryCounts
  )) {
    const actualCount =
      categoryCounts[category] || 0;

    if (actualCount < expectedCount) {
      categoryMismatch = true;

      console.warn(
        `⚠️ ${category}: expected at least ${expectedCount}, found ${actualCount}`
      );
    }
  }

  if (!categoryMismatch) {
    console.log(
      "✅ All expected course categories are present."
    );
  }

  /**
   * ----------------------------------------------------------
   * DIGITAL MARKETING TOPIC VERIFICATION
   * ----------------------------------------------------------
   */

  console.log("");
  console.log(
    "📣 DIGITAL MARKETING TOPIC VERIFICATION"
  );

  console.log("");

  const finalSourceTopics =
    new Set<string>();

  for (const [, value] of finalEntries) {
    const course = value as {
      sourceTopic?: string;
      title?: string;
      category?: string;
    };

    if (
      course.category ===
      "Digital Marketing"
    ) {
      if (course.sourceTopic) {
        finalSourceTopics.add(
          normalizeText(
            course.sourceTopic
          )
        );
      } else if (course.title) {
        finalSourceTopics.add(
          normalizeText(
            course.title
          )
        );
      }
    }
  }

  let missingDigitalMarketingTopics = 0;

  for (const topic of digitalMarketingTopics) {
    const exists =
      finalSourceTopics.has(
        normalizeText(topic.topic)
      );

    if (exists) {
      console.log(
        `   ✅ ${topic.topic}`
      );
    } else {
      console.warn(
        `   ❌ ${topic.topic}`
      );

      missingDigitalMarketingTopics++;
    }
  }

  /**
   * ----------------------------------------------------------
   * FINAL STATUS
   * ----------------------------------------------------------
   */

  console.log("");
  console.log(
    "=================================================="
  );

  if (
    finalDigitalMarketingCourses.length >=
      EXPECTED_DIGITAL_MARKETING_COURSES &&
    missingDigitalMarketingTopics === 0
  ) {
    console.log(
      "🎉 DIGITAL MARKETING IS FULLY INSTALLED."
    );

    console.log(
      "🎉 ALL 20 DIGITAL MARKETING COURSES ARE AVAILABLE."
    );
  } else {
    console.warn(
      "⚠️ DIGITAL MARKETING IS NOT YET COMPLETE."
    );

    console.warn(
      `⚠️ Missing Digital Marketing topics: ${missingDigitalMarketingTopics}`
    );
  }

  console.log(
    "=================================================="
  );

  console.log(
    "🏁 COURSE SEEDER FINISHED"
  );

  console.log(
    "=================================================="
  );

  console.log("");
}

/**
 * ============================================================
 * EXPORT COURSE TOPICS
 * ============================================================
 */

export {
  topicsByCategory,
  digitalMarketingTopics,
};
