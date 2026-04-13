import type { PlanItem } from '@/types/plan';

const now = new Date().toISOString();

type ItemInput = Omit<PlanItem, 'userId' | 'status' | 'completedAt' | 'updatedAt' | 'createdAt' | 'resources' | 'architecturalNotes' | 'practiceItems'> & {
  status?: PlanItem['status'];
  resources?: PlanItem['resources'];
  architecturalNotes?: PlanItem['architecturalNotes'];
  practiceItems?: PlanItem['practiceItems'];
};

function item(partial: ItemInput): Omit<PlanItem, 'userId'> {
  return {
    ...partial,
    status: partial.status ?? 'not-started',
    completedAt: null,
    updatedAt: now,
    createdAt: now,
    resources: partial.resources ?? [],
    architecturalNotes: partial.architecturalNotes ?? [],
    practiceItems: partial.practiceItems ?? [],
  };
}

// ── AZURE TRACK ──────────────────────────────────────────────

const azureTrack = item({
  id: 'azure-track',
  trackId: 'azure',
  parentId: null,
  type: 'track',
  title: 'C# for Azure & Cloud Architecture',
  description: 'Deepen architectural mastery and production patterns for Azure cloud-native apps with C# and .NET.',
  order: 1,
  weekRange: '1-20',
});

// Phase 1
const azurePhase1 = item({
  id: 'azure-p1',
  trackId: 'azure',
  parentId: 'azure-track',
  type: 'phase',
  title: 'Cloud-Native Design Patterns',
  description: 'Internalize cloud-native design principles and distributed systems fundamentals.',
  order: 1,
  weekRange: '1-4',
  resources: [
    { title: 'Designing Distributed Systems — Brendan Burns', url: 'https://azure.microsoft.com/en-us/resources/designing-distributed-systems/', type: 'book', notes: 'Free PDF from Microsoft. Patterns for containers, microservices, batch.' },
    { title: 'Cloud Design Patterns — Azure Architecture Center', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/', type: 'docs', notes: 'Study 5 patterns/week: Circuit Breaker, Retry, CQRS, Event Sourcing, Saga, Bulkhead, Sidecar, Gateway Aggregation, Strangler Fig, Competing Consumers.' },
    { title: 'Build distributed apps with .NET Aspire', url: 'https://learn.microsoft.com/en-us/training/paths/dotnet-aspire/', type: 'docs', notes: 'Microsoft Learn Path' },
    { title: 'Azure Well-Architected Framework — Azure Friday', url: 'https://www.youtube.com/results?search_query=azure+well+architected+framework+azure+friday', type: 'video' },
  ],
  practiceItems: [
    'For each pattern, write: (1) what problem it solves, (2) when to use, (3) when NOT to use',
    'Identify 2-3 patterns already used in CommonLibrary (Retry via Polly, Response Wrapper, etc.)',
  ],
});

const azureP1Topics = [
  item({
    id: 'azure-p1-t1', trackId: 'azure', parentId: 'azure-p1', type: 'topic', order: 1,
    title: 'Circuit Breaker & Retry Patterns', weekRange: '1',
    description: 'Understand fault tolerance patterns that prevent cascading failures in distributed systems.',
    resources: [
      { title: 'Circuit Breaker pattern', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker', type: 'docs' },
      { title: 'Retry pattern', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/retry', type: 'docs' },
      { title: 'Polly resilience library', url: 'https://github.com/App-vNext/Polly', type: 'github' },
    ],
    architecturalNotes: [
      'Circuit breaker vs retry: retry handles transient faults, circuit breaker prevents overloading a failing service',
      'Exponential backoff with jitter prevents thundering herd',
      'Choose circuit breaker trip threshold based on SLA requirements',
    ],
    practiceItems: ['Implement a Polly circuit breaker policy in a sample app', 'Compare retry-only vs retry+circuit-breaker under load'],
  }),
  item({
    id: 'azure-p1-t2', trackId: 'azure', parentId: 'azure-p1', type: 'topic', order: 2,
    title: 'CQRS & Event Sourcing', weekRange: '1-2',
    description: 'Separate read and write models for scalability. Store state changes as immutable events.',
    resources: [
      { title: 'CQRS pattern', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs', type: 'docs' },
      { title: 'Event Sourcing pattern', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing', type: 'docs' },
    ],
    architecturalNotes: [
      'CQRS adds complexity — only use when read/write scaling requirements differ significantly',
      'Event sourcing provides full audit trail but makes querying harder without projections',
      'Combine with Cosmos DB change feed for materialized views',
    ],
    practiceItems: ['Design a CQRS model for a shopping cart service', 'Map event sourcing to Cosmos DB change feed'],
  }),
  item({
    id: 'azure-p1-t3', trackId: 'azure', parentId: 'azure-p1', type: 'topic', order: 3,
    title: 'Saga & Bulkhead Patterns', weekRange: '2-3',
    description: 'Manage distributed transactions (Saga) and isolate failures (Bulkhead).',
    resources: [
      { title: 'Saga pattern', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/saga', type: 'docs' },
      { title: 'Bulkhead pattern', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead', type: 'docs' },
    ],
    architecturalNotes: [
      'Saga: choreography (events) vs orchestration (central coordinator) — trade-offs in complexity vs visibility',
      'Bulkhead isolates critical resources — e.g., separate thread pools for critical vs non-critical requests',
      'Compensating transactions must be idempotent',
    ],
    practiceItems: ['Design a saga for multi-service order fulfillment', 'Identify bulkhead boundaries in a microservice system'],
  }),
  item({
    id: 'azure-p1-t4', trackId: 'azure', parentId: 'azure-p1', type: 'topic', order: 4,
    title: 'Gateway, Sidecar & Strangler Fig', weekRange: '3-4',
    description: 'API Gateway aggregation, sidecar for cross-cutting concerns, and incremental migration with Strangler Fig.',
    resources: [
      { title: 'Gateway Aggregation', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/gateway-aggregation', type: 'docs' },
      { title: 'Sidecar pattern', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/sidecar', type: 'docs' },
      { title: 'Strangler Fig pattern', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig', type: 'docs' },
    ],
    architecturalNotes: [
      'Gateway aggregation reduces client chattiness but introduces a single point of failure',
      'Sidecar is the foundation of service mesh (Dapr, Envoy)',
      'Strangler Fig: safest migration pattern — gradually replace vs big-bang rewrite',
    ],
    practiceItems: ['Map Strangler Fig stages for migrating a monolith to microservices'],
  }),
  item({
    id: 'azure-p1-t5', trackId: 'azure', parentId: 'azure-p1', type: 'topic', order: 5,
    title: '.NET Aspire & Distributed App Development', weekRange: '4',
    description: 'Modern .NET stack for building cloud-native distributed applications with built-in observability.',
    resources: [
      { title: '.NET Aspire overview', url: 'https://learn.microsoft.com/en-us/dotnet/aspire/get-started/aspire-overview', type: 'docs' },
      { title: '.NET Aspire samples', url: 'https://github.com/dotnet/aspire-samples', type: 'github' },
    ],
    architecturalNotes: [
      'Aspire provides opinionated defaults for service discovery, health checks, telemetry',
      'Decision: Aspire vs manual configuration — Aspire is best for greenfield, manual for existing systems',
    ],
    practiceItems: ['Create a simple Aspire app with 2 services and Redis', 'Compare Aspire service defaults vs manual DI setup'],
  }),
];

// Phase 2
const azurePhase2 = item({
  id: 'azure-p2',
  trackId: 'azure',
  parentId: 'azure-track',
  type: 'phase',
  title: 'Microservices & API Architecture',
  description: 'Master production-grade API design, resilience, and observability in .NET.',
  order: 2,
  weekRange: '5-8',
  resources: [
    { title: 'Microservices in .NET, 2nd Ed — Christian Horsdal', url: 'https://www.manning.com/books/microservices-in-net-second-edition', type: 'book', notes: 'End-to-end .NET microservices with real patterns' },
    { title: 'eShop reference application', url: 'https://github.com/dotnet/eShop', type: 'github', notes: 'Microsoft canonical .NET microservices reference' },
    { title: 'Implement resilient applications', url: 'https://learn.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/', type: 'docs' },
    { title: 'ardalis.com — Clean Architecture', url: 'https://ardalis.com/', type: 'blog' },
  ],
});

const azureP2Topics = [
  item({
    id: 'azure-p2-t1', trackId: 'azure', parentId: 'azure-p2', type: 'topic', order: 1,
    title: 'API Versioning & Design', weekRange: '5',
    description: 'Strategies for evolving APIs without breaking consumers.',
    resources: [
      { title: 'API versioning best practices', url: 'https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design', type: 'docs' },
    ],
    architecturalNotes: [
      'URL path versioning (/v1/users) — most explicit, easy to route, but clutters URLs',
      'Header versioning — cleaner URLs but harder to test in browser',
      'Query string (?version=1) — easy to default but easy to forget',
      'Decision: URL path is safest for public APIs; header for internal services',
    ],
    practiceItems: ['Implement URL and header-based versioning in an ASP.NET Core API'],
  }),
  item({
    id: 'azure-p2-t2', trackId: 'azure', parentId: 'azure-p2', type: 'topic', order: 2,
    title: 'Sync vs Async Communication', weekRange: '5-6',
    description: 'Choose between HTTP/gRPC sync calls and message-based async communication between services.',
    architecturalNotes: [
      'Sync (HTTP/gRPC): simpler, real-time response, but creates coupling and cascading failure risk',
      'Async (message queue): decoupled, resilient, but eventual consistency and harder to debug',
      'Decision: sync for queries and real-time reads; async for commands and fire-and-forget',
    ],
    practiceItems: ['Design a system using both sync (API gateway) and async (Service Bus) communication'],
  }),
  item({
    id: 'azure-p2-t3', trackId: 'azure', parentId: 'azure-p2', type: 'topic', order: 3,
    title: 'Health Checks, Rate Limiting & Caching', weekRange: '6-7',
    description: 'Production readiness patterns: health probes, rate limiting, output and distributed caching.',
    resources: [
      { title: '.NET rate limiting middleware', url: 'https://learn.microsoft.com/en-us/aspnet/core/performance/rate-limiting', type: 'docs' },
      { title: 'Health checks in ASP.NET Core', url: 'https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks', type: 'docs' },
    ],
    architecturalNotes: [
      'Liveness probe: "is the process alive?" vs Readiness probe: "can it serve traffic?"',
      'Output caching: per-endpoint, great for GET endpoints that rarely change',
      'Distributed caching (Redis): cross-instance state, session data, computed results',
      'Decision: output cache for public content APIs; Redis for user-specific state',
    ],
    practiceItems: ['Add health checks and rate limiting to a sample API', 'Compare output cache vs Redis cache hit rates'],
  }),
  item({
    id: 'azure-p2-t4', trackId: 'azure', parentId: 'azure-p2', type: 'topic', order: 4,
    title: 'Clean Architecture & eShop Study', weekRange: '7-8',
    description: 'Study Microsoft eShop reference architecture. Apply clean architecture layers.',
    resources: [
      { title: 'eShop on GitHub', url: 'https://github.com/dotnet/eShop', type: 'github' },
      { title: 'Nick Chapsas — Clean Architecture', url: 'https://www.youtube.com/c/Nickchapsas', type: 'video' },
      { title: 'Milan Jovanović — .NET deep dives', url: 'https://www.youtube.com/c/MilanJovanovic', type: 'video' },
    ],
    architecturalNotes: [
      'Clean Architecture: dependencies point inward (Domain → Application → Infrastructure → Presentation)',
      'eShop demonstrates: API gateways, service-to-service gRPC, event bus, Blazor frontend',
    ],
    practiceItems: ['Clone eShop and trace a complete order flow', 'Identify which patterns map to CommonLibrary code'],
  }),
];

// Phase 3
const azurePhase3 = item({
  id: 'azure-p3',
  trackId: 'azure',
  parentId: 'azure-track',
  type: 'phase',
  title: 'Serverless & Event-Driven Architecture',
  description: 'Design event-driven systems with Azure Functions, Service Bus, and Event Hubs.',
  order: 3,
  weekRange: '9-12',
  resources: [
    { title: 'Create serverless applications', url: 'https://learn.microsoft.com/en-us/training/paths/create-serverless-applications/', type: 'docs' },
    { title: 'Enterprise Integration Patterns', url: 'https://www.enterpriseintegrationpatterns.com/', type: 'book', notes: 'Classic reference — skim the online catalog' },
    { title: 'Azure Functions .NET isolated worker model', url: 'https://learn.microsoft.com/en-us/azure/azure-functions/dotnet-isolated-process-guide', type: 'docs' },
  ],
});

const azureP3Topics = [
  item({
    id: 'azure-p3-t1', trackId: 'azure', parentId: 'azure-p3', type: 'topic', order: 1,
    title: 'Azure Functions Plans & Scaling', weekRange: '9',
    description: 'Understand hosting plan trade-offs: Consumption vs Flex Consumption vs Premium.',
    architecturalNotes: [
      'Consumption: pay-per-execution, cold starts (1-3s), auto-scale to 200 instances, cheapest for sporadic workloads',
      'Flex Consumption: configurable warm instances, VNET support, faster scale. New middle ground.',
      'Premium: always-warm, VNET, unlimited duration. Best for latency-sensitive or high-throughput.',
      'Decision: Consumption for event handlers and cron jobs; Premium for user-facing APIs; Flex for cost-conscious VNET needs',
    ],
    practiceItems: ['Deploy same function to Consumption and Premium, measure cold start difference'],
  }),
  item({
    id: 'azure-p3-t2', trackId: 'azure', parentId: 'azure-p3', type: 'topic', order: 2,
    title: 'Durable Functions & Orchestration', weekRange: '9-10',
    description: 'Long-running workflows, fan-out/fan-in, human interaction patterns.',
    resources: [
      { title: 'Durable Functions overview', url: 'https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview', type: 'docs' },
    ],
    architecturalNotes: [
      'Durable Functions: stateful orchestration built on event sourcing internally',
      'vs Saga with Service Bus: Durable is simpler for straight workflows; Service Bus better for loosely coupled services',
      'Fan-out/fan-in: parallel execution with await Task.WhenAll — great for batch processing',
    ],
    practiceItems: ['Build a durable function chain: validate → process → notify'],
  }),
  item({
    id: 'azure-p3-t3', trackId: 'azure', parentId: 'azure-p3', type: 'topic', order: 3,
    title: 'Service Bus vs Event Hubs', weekRange: '10-11',
    description: 'Choose the right messaging service: queue semantics vs partitioned event log.',
    resources: [
      { title: 'Service Bus messaging', url: 'https://learn.microsoft.com/en-us/azure/service-bus-messaging/', type: 'docs' },
      { title: 'Event Hubs overview', url: 'https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-about', type: 'docs' },
    ],
    architecturalNotes: [
      'Service Bus: message queue/topic, at-most-once or at-least-once, sessions, dead-lettering, duplicate detection. Best for commands.',
      'Event Hubs: partitioned append-only log, millions of events/sec, consumer groups. Best for telemetry/streaming.',
      'Decision: Service Bus for transactional workflows; Event Hubs for high-volume event streaming',
      'Idempotency is required for at-least-once delivery in both systems',
    ],
    practiceItems: ['Design dead-letter queue handling strategy', 'Compare partition key selection in Event Hubs vs Cosmos DB'],
  }),
  item({
    id: 'azure-p3-t4', trackId: 'azure', parentId: 'azure-p3', type: 'topic', order: 4,
    title: 'Poison Messages & Idempotency', weekRange: '11-12',
    description: 'Handle unprocessable messages and ensure operations can be safely retried.',
    architecturalNotes: [
      'Poison message: message that repeatedly fails processing. Move to dead-letter queue after N retries.',
      'Idempotency key: use message ID or deduplication ID to prevent duplicate processing',
      'Exactly-once is a myth in distributed systems — design for at-least-once + idempotent handlers',
    ],
    practiceItems: ['Implement idempotent message handler with deduplication table', 'Set up dead-letter queue monitoring alerts'],
  }),
];

// Phase 4
const azurePhase4 = item({
  id: 'azure-p4',
  trackId: 'azure',
  parentId: 'azure-track',
  type: 'phase',
  title: 'Data Architecture — Cosmos DB, SQL & Storage',
  description: 'Architect data layers for scale, consistency, and cost efficiency.',
  order: 4,
  weekRange: '13-16',
  resources: [
    { title: 'Work with Azure Cosmos DB', url: 'https://learn.microsoft.com/en-us/training/paths/work-with-nosql-data-in-azure-cosmos-db/', type: 'docs' },
    { title: 'Cosmos DB partitioning deep dive', url: 'https://learn.microsoft.com/en-us/azure/cosmos-db/partitioning-overview', type: 'docs' },
    { title: 'Cosmos DB consistency levels', url: 'https://learn.microsoft.com/en-us/azure/cosmos-db/consistency-levels', type: 'docs' },
    { title: 'Fundamentals of Data Engineering — Reis & Housley', url: 'https://www.oreilly.com/library/view/fundamentals-of-data/9781098108298/', type: 'book' },
  ],
});

const azureP4Topics = [
  item({
    id: 'azure-p4-t1', trackId: 'azure', parentId: 'azure-p4', type: 'topic', order: 1,
    title: 'Partition Key Design', weekRange: '13',
    description: 'Select partition keys based on access patterns. Avoid hot partitions and cross-partition queries.',
    architecturalNotes: [
      'Good partition key: high cardinality, even distribution, matches query WHERE clause',
      'Hot partition: one partition gets disproportionate traffic — monitor with Cosmos metrics',
      'Cross-partition queries: fan-out to all partitions — expensive. Design to avoid.',
      'Hierarchical partition keys: new Cosmos feature to further split large partitions',
    ],
    practiceItems: ['Analyze CommonLibrary CosmosRepository queries — verify partition key alignment'],
  }),
  item({
    id: 'azure-p4-t2', trackId: 'azure', parentId: 'azure-p4', type: 'topic', order: 2,
    title: 'Consistency Levels & Trade-offs', weekRange: '13-14',
    description: 'Map Cosmos DB consistency levels (Strong → Eventual) to real-world scenarios.',
    architecturalNotes: [
      'Strong: linearizable reads. Use for financial data. Highest latency, limited to single region writes.',
      'Bounded Staleness: guaranteed lag bound. Good for multi-region with staleness tolerance.',
      'Session: reads your own writes. Default for most apps. Best balance of cost and consistency.',
      'Eventual: lowest latency and cost. Good for analytics, logs, non-critical reads.',
      'Decision: Session for user-facing apps; Strong for financial; Eventual for analytics pipelines',
    ],
    practiceItems: ['Test Session vs Eventual consistency with concurrent read/write scenarios'],
  }),
  item({
    id: 'azure-p4-t3', trackId: 'azure', parentId: 'azure-p4', type: 'topic', order: 3,
    title: 'Change Feed & Materialized Views', weekRange: '14-15',
    description: 'Use Cosmos DB change feed for event-driven data synchronization and materialized views.',
    resources: [
      { title: 'Change feed overview', url: 'https://learn.microsoft.com/en-us/azure/cosmos-db/change-feed', type: 'docs' },
    ],
    architecturalNotes: [
      'Change feed: ordered stream of changes per partition key. Push-based with change feed processor.',
      'Use for: materialized views, cross-service sync, real-time analytics, event sourcing projections',
      'Change feed does NOT capture deletes (use soft-delete with TTL instead)',
    ],
    practiceItems: ['Build a change feed processor that creates a read-optimized materialized view'],
  }),
  item({
    id: 'azure-p4-t4', trackId: 'azure', parentId: 'azure-p4', type: 'topic', order: 4,
    title: 'SQL vs NoSQL Decision Framework', weekRange: '15-16',
    description: 'When to choose relational SQL vs document NoSQL for new services.',
    architecturalNotes: [
      'SQL: ACID transactions, joins, complex queries, fixed schema. Best for relational data with integrity constraints.',
      'NoSQL (Cosmos): flexible schema, horizontal scale, low-latency point reads. Best for high-throughput, denormalized data.',
      'Decision: SQL for transactional systems (orders, financials); Cosmos for user profiles, catalogs, session data, event stores',
      'Polyglot persistence: use both in the same system for different bounded contexts',
    ],
    practiceItems: ['Design data model for an e-commerce system using both SQL and Cosmos DB'],
  }),
];

// Phase 5
const azurePhase5 = item({
  id: 'azure-p5',
  trackId: 'azure',
  parentId: 'azure-track',
  type: 'phase',
  title: 'AI Integration & Azure OpenAI',
  description: 'Integrate AI capabilities into .NET applications responsibly and at scale.',
  order: 5,
  weekRange: '17-20',
  resources: [
    { title: 'Develop AI solutions with Azure OpenAI', url: 'https://learn.microsoft.com/en-us/training/paths/develop-ai-solutions-azure-openai/', type: 'docs' },
    { title: 'Semantic Kernel SDK', url: 'https://learn.microsoft.com/en-us/semantic-kernel/overview/', type: 'docs' },
    { title: 'Semantic Kernel samples', url: 'https://github.com/microsoft/semantic-kernel', type: 'github' },
    { title: 'RAG with Azure AI Search', url: 'https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview', type: 'docs' },
  ],
});

const azureP5Topics = [
  item({
    id: 'azure-p5-t1', trackId: 'azure', parentId: 'azure-p5', type: 'topic', order: 1,
    title: 'RAG Architecture', weekRange: '17-18',
    description: 'Retrieval Augmented Generation: chunking, embedding, vector search to ground LLM responses.',
    architecturalNotes: [
      'RAG pipeline: Document → Chunk → Embed → Index (AI Search) → Query → Retrieve → Augment prompt → Generate',
      'Chunking strategy: fixed-size vs semantic vs sentence-based. Overlap helps context continuity.',
      'Vector search finds semantically similar content even without exact keyword match',
      'Decision: RAG for enterprise knowledge Q&A; fine-tuning for domain-specific language/style changes',
    ],
    practiceItems: ['Build a RAG pipeline with Azure AI Search and OpenAI'],
  }),
  item({
    id: 'azure-p5-t2', trackId: 'azure', parentId: 'azure-p5', type: 'topic', order: 2,
    title: 'Semantic Kernel & Agents', weekRange: '18-19',
    description: 'Use Semantic Kernel to build AI plugins and orchestrate multi-step AI workflows.',
    resources: [
      { title: 'Semantic Kernel quickstart', url: 'https://learn.microsoft.com/en-us/semantic-kernel/get-started/quick-start-guide', type: 'docs' },
    ],
    architecturalNotes: [
      'Semantic Kernel: SDK for orchestrating AI models + plugins (tools). Similar to LangChain for .NET.',
      'Plugins: native C# functions exposed as tools for the AI to call (function calling)',
      'Decision: Use SK for multi-step AI workflows; use raw API for simple single-call completions',
    ],
    practiceItems: ['Create a Semantic Kernel plugin that queries Cosmos DB and summarizes results'],
  }),
  item({
    id: 'azure-p5-t3', trackId: 'azure', parentId: 'azure-p5', type: 'topic', order: 3,
    title: 'Token Management & Cost Control', weekRange: '19-20',
    description: 'Manage token budgets, rate limiting, and caching strategies for AI APIs.',
    architecturalNotes: [
      'Token estimation: ~4 chars ≈ 1 token for English. Use tiktoken library for precise counts.',
      'Rate limiting: use Azure API Management as AI gateway for per-user/per-app throttling',
      'Caching: deterministic queries (same input/prompt) can be cached; creative outputs should not',
      'Cost: GPT-4o ~$5/M input tokens. Monitor with Azure Monitor cost alerts.',
    ],
    practiceItems: ['Implement a caching layer for repeated AI queries', 'Set up a cost alert for OpenAI usage'],
  }),
  item({
    id: 'azure-p5-t4', trackId: 'azure', parentId: 'azure-p5', type: 'topic', order: 4,
    title: 'Responsible AI & Content Safety', weekRange: '20',
    description: 'Content filtering, PII handling, grounding, and responsible AI practices.',
    resources: [
      { title: 'Azure AI Content Safety', url: 'https://learn.microsoft.com/en-us/azure/ai-services/content-safety/', type: 'docs' },
    ],
    architecturalNotes: [
      'Azure OpenAI includes built-in content filters (hate, violence, self-harm, sexual)',
      'PII: use Azure AI Language PII detection before storing AI responses',
      'Grounding: always provide context/sources to reduce hallucination',
      'Decision: enable content safety by default; add PII detection for user-facing AI features',
    ],
    practiceItems: ['Configure content safety filters on an Azure OpenAI deployment'],
  }),
];

// ── CP TRACK (C#) ──────────────────────────────────────────────

const cpTrack = item({
  id: 'cp-track',
  trackId: 'cp',
  parentId: null,
  type: 'track',
  title: 'Competitive Programming (C#)',
  description: 'Build problem-solving skills through competitive programming using C#. From foundations through intermediate algorithms.',
  order: 2,
  weekRange: '1-19+',
});

// CP Phase 1
const cpPhase1 = item({
  id: 'cp-p1',
  trackId: 'cp',
  parentId: 'cp-track',
  type: 'phase',
  title: 'Foundations & C# for CP',
  description: 'Get comfortable with C# for competitive programming. Review core data structures and I/O patterns.',
  order: 1,
  weekRange: '1-4',
  resources: [
    { title: 'Competitive Programmer\'s Handbook — Antti Laaksonen', url: 'https://cses.fi/book/book.pdf', type: 'book', notes: 'Free PDF. THE starting resource. Adapt examples from C++ to C#.' },
    { title: 'CSES Problem Set', url: 'https://cses.fi/problemset/', type: 'platform', notes: '300 curated problems ordered by topic' },
    { title: 'C# competitive programming template', url: 'https://github.com/AbiRaja-tech/Competitive-Programming-in-CSharp', type: 'github', notes: 'Fast I/O templates and common patterns in C#' },
  ],
  practiceItems: [
    'Set up a C# CP template with fast I/O (StreamReader/StreamWriter)',
    'CSES Introductory Problems (all 19)',
    'CSES Sorting and Searching (first 15)',
    'Daily: 1 easy problem (20-30 min), check editorial if stuck >15 min',
  ],
});

const cpP1Topics = [
  item({
    id: 'cp-p1-t1', trackId: 'cp', parentId: 'cp-p1', type: 'topic', order: 1,
    title: 'C# I/O & CP Setup', weekRange: '1',
    description: 'Set up fast I/O, parsing, and a reusable template for contests.',
    resources: [
      { title: 'Fast I/O in C# for competitive programming', url: 'https://codeforces.com/blog/entry/85745', type: 'blog' },
    ],
    architecturalNotes: [
      'Console.ReadLine() is too slow for large input. Use StreamReader/StreamWriter for 10x speedup.',
      'C# is viable on Codeforces/LeetCode but occasionally TLEs on time-critical problems — optimize I/O first.',
      'Use int.Parse() directly, avoid string interpolation in hot loops.',
    ],
    practiceItems: ['Create CP template with StreamReader', 'Solve CSES "Weird Algorithm" and "Missing Number"'],
  }),
  item({
    id: 'cp-p1-t2', trackId: 'cp', parentId: 'cp-p1', type: 'topic', order: 2,
    title: 'Arrays, Sorting & Searching', weekRange: '1-2',
    description: 'C# arrays, List<T>, Array.Sort, BinarySearch, and STL-equivalent data structures.',
    resources: [
      { title: 'CSES Sorting and Searching', url: 'https://cses.fi/problemset/', type: 'platform' },
    ],
    practiceItems: ['CSES: Distinct Numbers, Apartments, Ferris Wheel, Concert Tickets', 'Implement Binary Search from scratch in C#'],
  }),
  item({
    id: 'cp-p1-t3', trackId: 'cp', parentId: 'cp-p1', type: 'topic', order: 3,
    title: 'C# Collections for CP', weekRange: '2-3',
    description: 'Master SortedSet, Dictionary, PriorityQueue, Stack, Queue for competitive programming.',
    architecturalNotes: [
      'SortedSet<T>: C# equivalent of C++ std::set — O(log n) insert/delete/search',
      'PriorityQueue<T,T>: added in .NET 6 — use for Dijkstra, greedy algorithms',
      'Dictionary<K,V>: O(1) lookup — use for frequency counting, memoization',
    ],
    practiceItems: ['Solve problems using SortedSet for ordered operations', 'Implement a problem requiring PriorityQueue'],
  }),
  item({
    id: 'cp-p1-t4', trackId: 'cp', parentId: 'cp-p1', type: 'topic', order: 4,
    title: 'Brute Force & Complete Search', weekRange: '3-4',
    description: 'Enumerate all possibilities. Backtracking and recursion patterns.',
    practiceItems: ['CSES: Creating Strings, Apple Division, Chessboard and Queens', 'Practice backtracking with pruning'],
  }),
];

// CP Phase 2
const cpPhase2 = item({
  id: 'cp-p2',
  trackId: 'cp',
  parentId: 'cp-track',
  type: 'phase',
  title: 'Core Algorithms',
  description: 'Master essential algorithms: binary search, greedy, DP, and graph basics.',
  order: 2,
  weekRange: '5-10',
  resources: [
    { title: 'Competitive Programmer\'s Handbook chapters 3-12', url: 'https://cses.fi/book/book.pdf', type: 'book' },
    { title: 'LeetCode', url: 'https://leetcode.com', type: 'platform', notes: 'Filter by topic, do Medium difficulty' },
    { title: 'Codeforces', url: 'https://codeforces.com', type: 'platform', notes: 'Div 2 A+B problems from recent contests' },
    { title: 'William Lin — YouTube', url: 'https://www.youtube.com/c/WilliamLin168', type: 'video' },
    { title: 'Errichto — YouTube', url: 'https://www.youtube.com/c/Errichto', type: 'video' },
  ],
  practiceItems: [
    '2-3 focused problems per week matching current topic',
    '1 virtual Codeforces contest every 2 weeks (Div 2, attempt A+B+C)',
    'After each contest: upsolve problems you couldn\'t solve',
  ],
});

const cpP2Topics = [
  item({
    id: 'cp-p2-t1', trackId: 'cp', parentId: 'cp-p2', type: 'topic', order: 1,
    title: 'Binary Search', weekRange: '5',
    description: 'Binary search on answer, on monotonic functions, and parametric search.',
    practiceItems: ['CSES: Factory Machines, Array Division', 'LeetCode: Binary Search tag Medium problems'],
  }),
  item({
    id: 'cp-p2-t2', trackId: 'cp', parentId: 'cp-p2', type: 'topic', order: 2,
    title: 'Two Pointers & Sliding Window', weekRange: '5-6',
    description: 'Efficiently process subarrays and pairs with O(n) time using two pointers.',
    practiceItems: ['CSES: Sum of Two Values, Subarray Sums I & II', 'LeetCode: Sliding Window Maximum'],
  }),
  item({
    id: 'cp-p2-t3', trackId: 'cp', parentId: 'cp-p2', type: 'topic', order: 3,
    title: 'Greedy Algorithms', weekRange: '6-7',
    description: 'Make locally optimal choices. Prove correctness with exchange arguments.',
    practiceItems: ['CSES: Movie Festival, Tasks and Deadlines', 'Practice proving greedy correctness'],
  }),
  item({
    id: 'cp-p2-t4', trackId: 'cp', parentId: 'cp-p2', type: 'topic', order: 4,
    title: 'Dynamic Programming (1D & 2D)', weekRange: '7-8',
    description: 'Solve optimization problems by breaking into overlapping subproblems. Knapsack, coin change, LIS.',
    resources: [
      { title: 'CSES DP section', url: 'https://cses.fi/problemset/', type: 'platform' },
      { title: 'AtCoder Educational DP Contest', url: 'https://atcoder.jp/contests/dp', type: 'platform', notes: '26 classic DP problems, A through Z' },
    ],
    practiceItems: ['CSES: Dice Combinations, Minimizing Coins, Coin Combinations I & II', 'AtCoder DP: problems A through F'],
  }),
  item({
    id: 'cp-p2-t5', trackId: 'cp', parentId: 'cp-p2', type: 'topic', order: 5,
    title: 'Graph Basics — BFS & DFS', weekRange: '9',
    description: 'Graph traversal algorithms. Connected components, cycle detection, bipartiteness.',
    resources: [
      { title: 'CSES Graph section', url: 'https://cses.fi/problemset/', type: 'platform' },
    ],
    practiceItems: ['CSES: Counting Rooms, Labyrinth, Building Roads', 'Implement BFS and DFS from scratch in C#'],
  }),
  item({
    id: 'cp-p2-t6', trackId: 'cp', parentId: 'cp-p2', type: 'topic', order: 6,
    title: 'Shortest Paths — Dijkstra & BFS', weekRange: '9-10',
    description: 'Find shortest paths: BFS for unweighted, Dijkstra for weighted graphs.',
    practiceItems: ['CSES: Shortest Routes I, Shortest Routes II', 'Implement Dijkstra with PriorityQueue in C#'],
  }),
];

// CP Phase 3
const cpPhase3 = item({
  id: 'cp-p3',
  trackId: 'cp',
  parentId: 'cp-track',
  type: 'phase',
  title: 'Intermediate Techniques',
  description: 'Build fluency in intermediate patterns: advanced DP, union-find, segment trees, number theory.',
  order: 3,
  weekRange: '11-18',
  resources: [
    { title: 'Competitive Programmer\'s Handbook chapters 13-26', url: 'https://cses.fi/book/book.pdf', type: 'book' },
    { title: 'cp-algorithms.com', url: 'https://cp-algorithms.com', type: 'docs', notes: 'Reference for every algorithm with code' },
    { title: 'Codeforces EDU', url: 'https://codeforces.com/edu/courses', type: 'platform', notes: 'Interactive courses on segment trees, DSU' },
  ],
  practiceItems: [
    '3-4 problems per week matching topics',
    '1 virtual Codeforces contest per week',
    'Target: consistently solve Div 2 A+B, attempt C',
  ],
});

const cpP3Topics = [
  item({
    id: 'cp-p3-t1', trackId: 'cp', parentId: 'cp-p3', type: 'topic', order: 1,
    title: 'Advanced DP (Bitmask, Interval)', weekRange: '11-12',
    description: 'Bitmask DP for subset problems. Interval DP for ranges.',
    practiceItems: ['CSES: Elevator Rides (bitmask DP)', 'AtCoder DP: problems L through N'],
  }),
  item({
    id: 'cp-p3-t2', trackId: 'cp', parentId: 'cp-p3', type: 'topic', order: 2,
    title: 'Union-Find (DSU) & MST', weekRange: '12-13',
    description: 'Disjoint Set Union with path compression and union by rank. Kruskal MST.',
    resources: [
      { title: 'DSU on cp-algorithms', url: 'https://cp-algorithms.com/data_structures/disjoint_set_union.html', type: 'docs' },
    ],
    practiceItems: ['CSES: Road Reparation, Road Construction', 'Implement DSU from scratch in C#'],
  }),
  item({
    id: 'cp-p3-t3', trackId: 'cp', parentId: 'cp-p3', type: 'topic', order: 3,
    title: 'Number Theory', weekRange: '13-14',
    description: 'Modular arithmetic, sieve of Eratosthenes, GCD/LCM, modular inverse, fast exponentiation.',
    resources: [
      { title: 'Number theory on cp-algorithms', url: 'https://cp-algorithms.com/algebra/', type: 'docs' },
    ],
    practiceItems: ['CSES: Exponentiation, Counting Divisors, Common Divisors', 'Implement modpow and modinv in C#'],
  }),
  item({
    id: 'cp-p3-t4', trackId: 'cp', parentId: 'cp-p3', type: 'topic', order: 4,
    title: 'Prefix Sums & Difference Arrays', weekRange: '15',
    description: 'Efficient range queries and range updates in O(1) after O(n) preprocessing.',
    practiceItems: ['CSES: Static Range Sum Queries, Forest Queries (2D prefix sums)', 'LeetCode: Range Sum Query 2D'],
  }),
  item({
    id: 'cp-p3-t5', trackId: 'cp', parentId: 'cp-p3', type: 'topic', order: 5,
    title: 'Segment Trees', weekRange: '15-17',
    description: 'Point update + range query in O(log n). Lazy propagation for range updates.',
    resources: [
      { title: 'Segment tree on cp-algorithms', url: 'https://cp-algorithms.com/data_structures/segment_tree.html', type: 'docs' },
      { title: 'Codeforces EDU: Segment Trees', url: 'https://codeforces.com/edu/course/2', type: 'platform' },
    ],
    practiceItems: ['CSES: Dynamic Range Sum Queries, Range Minimum Queries', 'Implement segment tree with lazy propagation in C#'],
  }),
  item({
    id: 'cp-p3-t6', trackId: 'cp', parentId: 'cp-p3', type: 'topic', order: 6,
    title: 'String Algorithms', weekRange: '17-18',
    description: 'String hashing for pattern matching. KMP algorithm overview.',
    resources: [
      { title: 'String hashing on cp-algorithms', url: 'https://cp-algorithms.com/string/string-hashing.html', type: 'docs' },
    ],
    practiceItems: ['CSES: String Matching, Finding Borders', 'Implement rolling hash in C#'],
  }),
];

// CP Phase 4
const cpPhase4 = item({
  id: 'cp-p4',
  trackId: 'cp',
  parentId: 'cp-track',
  type: 'phase',
  title: 'Contest Routine & Growth',
  description: 'Build contest stamina and systematically improve. Ongoing practice.',
  order: 4,
  weekRange: '19+',
  resources: [
    { title: 'Codeforces', url: 'https://codeforces.com', type: 'platform', notes: 'Primary contest platform' },
    { title: 'AtCoder', url: 'https://atcoder.jp', type: 'platform', notes: 'Clean problems, great for DP/math' },
    { title: 'LeetCode Weekly Contest', url: 'https://leetcode.com/contest/', type: 'platform' },
  ],
  practiceItems: [
    '1-2 live contests per week (Codeforces, AtCoder, LeetCode)',
    'Upsolve 1-2 problems after each contest',
    'Track weak topics → targeted practice on CSES/LeetCode',
    'Review Codeforces rating monthly — identify patterns',
  ],
});

const cpP4Topics = [
  item({
    id: 'cp-p4-t1', trackId: 'cp', parentId: 'cp-p4', type: 'topic', order: 1,
    title: 'Live Contest Participation', weekRange: '19+',
    description: 'Participate regularly in live contests to build speed and pressure management.',
    practiceItems: ['Register for Codeforces Div 2 rounds', 'Try AtCoder Beginner Contest (ABC)'],
  }),
  item({
    id: 'cp-p4-t2', trackId: 'cp', parentId: 'cp-p4', type: 'topic', order: 2,
    title: 'Upsolving & Review', weekRange: '19+',
    description: 'After each contest, solve problems you missed using editorials. Track weak areas.',
    practiceItems: ['Maintain an upsolve log', 'Review editorial for every unsolved problem'],
  }),
];

// ── ASSEMBLE ALL ITEMS ──────────────────────────────────────

export const seedPlanData: Omit<PlanItem, 'userId'>[] = [
  azureTrack,
  azurePhase1, ...azureP1Topics,
  azurePhase2, ...azureP2Topics,
  azurePhase3, ...azureP3Topics,
  azurePhase4, ...azureP4Topics,
  azurePhase5, ...azureP5Topics,
  cpTrack,
  cpPhase1, ...cpP1Topics,
  cpPhase2, ...cpP2Topics,
  cpPhase3, ...cpP3Topics,
  cpPhase4, ...cpP4Topics,
];
