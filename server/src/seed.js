import bcrypt from 'bcryptjs';
import prisma from './prisma.js';

async function main() {
  console.log('--- Clearing Blog Platform Database ---');
  await prisma.postLike.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('--- Seeding Authors & Readers ---');
  const salt = await bcrypt.genSalt(10);
  const authorPassword = await bcrypt.hash('Author@123', salt);
  const readerPassword = await bcrypt.hash('Reader@123', salt);

  const author1 = await prisma.user.create({
    data: {
      name: 'Alex Morgan',
      email: 'alex@blog.com',
      password: authorPassword,
      role: 'AUTHOR',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Full-stack software architect, open-source enthusiast, and cloud infrastructure writer.'
    }
  });

  const author2 = await prisma.user.create({
    data: {
      name: 'Sarah Chen',
      email: 'sarah@blog.com',
      password: authorPassword,
      role: 'AUTHOR',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      bio: 'Staff AI Engineer sharing real-world lessons on autonomous agents and modern web frameworks.'
    }
  });

  const reader = await prisma.user.create({
    data: {
      name: 'David Miller',
      email: 'david@blog.com',
      password: readerPassword,
      role: 'USER',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      bio: 'Avid tech reader, junior developer, and tech enthusiast.'
    }
  });

  console.log(`Created Author 1: ${author1.email}`);
  console.log(`Created Author 2: ${author2.email}`);
  console.log(`Created Reader: ${reader.email}`);

  console.log('--- Seeding Blog Posts ---');
  const post1 = await prisma.post.create({
    data: {
      title: 'Building Scalable Full-Stack Web Applications in 2026',
      slug: 'building-scalable-full-stack-web-applications-2026',
      excerpt: 'Modern web architecture has evolved dramatically. Explore the key patterns for database persistence, reactive UI states, and micro-service boundaries.',
      content: `The landscape of modern web development continues to move at an exhilarating pace. As applications grow in both user traffic and business complexity, architectural choices made early in the development lifecycle carry immense weight.

### The Shift Toward Modular Architecture
Monoliths versus microservices is no longer a binary choice. Modern teams leverage modular monoliths where domain boundaries are strictly guarded while avoiding the operational friction of distributed deployment models.

1. **Transactional Data Integrity**: Rely on relational ORMs like Prisma to strictly enforce foreign keys and schema contracts.
2. **Unified Component Primitives**: Component-driven design using React and Tailwind CSS enables composable UI atoms that remain consistent across client applications.
3. **Stateless Authentication**: Leveraging JSON Web Tokens (JWT) allows APIs to scale horizontally without sticky sessions.

### Conclusion
Focusing on clean abstractions, typed contracts, and reproducible environment configurations sets your application up for long-term velocity and resilience.`,
      coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
      category: 'Web Development',
      tags: 'Architecture,FullStack,React,NodeJS',
      readTime: 5,
      views: 342,
      authorId: author1.id
    }
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'The Rise of Agentic AI: Beyond Simple Prompts',
      slug: 'rise-of-agentic-ai-beyond-simple-prompts',
      excerpt: 'Autonomous coding agents are reshaping how software engineering pairs operate. Here is how tool use, background loops, and self-correction work.',
      content: `Over the past two years, conversational AI has transitioned from answering single-turn questions into multi-step agentic systems capable of autonomous pair programming and codebase exploration.

### What Makes an Agent "Agentic"?
Unlike a conventional language model that produces a single block of text and halts, an agent possesses:
- **Environment Grounding**: The ability to inspect files, execute compiler builds, and run unit tests.
- **Dynamic Tool Dispatch**: Calling specialized tools with structured JSON schemas and reacting to system stdout/stderr.
- **Proactive Verification**: Validating that changes compile and deliver expected outputs before closing out a user request.

As we look toward the future, human developers and AI assistants will collaborate as peers on shared workspaces.`,
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80',
      category: 'AI & Machine Learning',
      tags: 'AI,Agents,FutureOfTech,SoftwareEngineering',
      readTime: 4,
      views: 520,
      authorId: author2.id
    }
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'Designing Intuitive User Interfaces: A Pragmatic Guide',
      slug: 'designing-intuitive-user-interfaces-pragmatic-guide',
      excerpt: 'Great UI is invisible. Discover the design heuristics, typography choices, and micro-interactions that elevate user trust and satisfaction.',
      content: `Design is not just what it looks like and feels like — design is how it works. In modern digital products, the margin between user delight and frustration lies in micro-interactions.

### Three Pillars of Frictionless UI
- **Visual Hierarchy**: Guide the reader's eye using font weight variations, comfortable line heights, and deliberate whitespace rather than visual clutter.
- **Immediate State Feedback**: Never leave a user wondering whether their click registered. Provide instant button spinners, optimistic updates, and contextual toast alerts.
- **Accessibility by Default**: High contrast ratios and clear focus states are essential for high-converting interfaces.`,
      coverImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&auto=format&fit=crop&q=80',
      category: 'UI/UX Design',
      tags: 'Design,UX,Tailwind,ProductDesign',
      readTime: 3,
      views: 215,
      authorId: author1.id
    }
  });

  const post4 = await prisma.post.create({
    data: {
      title: 'Mastering REST APIs: Best Practices for Endpoints & Error Handling',
      slug: 'mastering-rest-apis-best-practices-endpoints-error-handling',
      excerpt: 'Building robust, predictable APIs is a cornerstone of software engineering. Learn how to structure status codes, pagination, and data schemas.',
      content: `A well-designed REST API is intuitive to consume and predictable under failure scenarios. 

### Key Principles for Production APIs
1. **Consistent Response Formats**: Always return standard JSON envelopes with descriptive error messages.
2. **Proper HTTP Status Semantics**: Distinguish between 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), and 404 (Not Found).
3. **Database Pagination**: Never return boundless collections. Use limit and offset or cursor pagination to keep queries performant.`,
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
      category: 'Web Development',
      tags: 'Backend,NodeJS,APIs,Database',
      readTime: 4,
      views: 180,
      authorId: author2.id
    }
  });

  console.log('--- Seeding Comments ---');
  await prisma.comment.create({
    data: {
      content: 'Brilliant breakdown on modular architecture! We recently adopted this pattern in our team and development velocity improved significantly.',
      postId: post1.id,
      authorId: author2.id,
      likesCount: 5
    }
  });

  await prisma.comment.create({
    data: {
      content: 'Could you share more about handling database migrations in multi-tenant environments? Great article!',
      postId: post1.id,
      authorId: reader.id,
      likesCount: 2
    }
  });

  await prisma.comment.create({
    data: {
      content: 'The section on proactive verification is spot on. An agent that cannot run commands or verify its output is merely generating text.',
      postId: post2.id,
      authorId: author1.id,
      likesCount: 8
    }
  });

  await prisma.comment.create({
    data: {
      content: 'Loved the pragmatic UI heuristics! Immediate state feedback makes a massive difference in perceived performance.',
      postId: post3.id,
      authorId: reader.id,
      likesCount: 3
    }
  });

  console.log('--- Seeding Likes ---');
  await prisma.postLike.create({
    data: { postId: post1.id, userId: reader.id }
  });
  await prisma.postLike.create({
    data: { postId: post1.id, userId: author2.id }
  });
  await prisma.postLike.create({
    data: { postId: post2.id, userId: author1.id }
  });
  await prisma.postLike.create({
    data: { postId: post2.id, userId: reader.id }
  });

  console.log('Database seeded successfully with users, posts, comments, and likes!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
