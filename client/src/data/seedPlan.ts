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

// ── C# TRACK ──────────────────────────────────────────────

const csharpTrack = item({
  id: 'csharp-track',
  trackId: 'csharp',
  parentId: null,
  type: 'track',
  title: 'C# Language Mastery',
  description: 'Deep dive into modern C# language features, .NET runtime internals, performance patterns, and advanced techniques. Go beyond basics to write expert-level C#.',
  order: 3,
  weekRange: '1-20',
});

// C# Phase 1
const csharpPhase1 = item({
  id: 'cs-p1',
  trackId: 'csharp',
  parentId: 'csharp-track',
  type: 'phase',
  title: 'Modern C# Language Features',
  description: 'Master C# 10-12 features: records, pattern matching, global usings, file-scoped namespaces, raw string literals, and primary constructors.',
  order: 1,
  weekRange: '1-4',
  resources: [
    { title: 'What\'s new in C# 12', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-12', type: 'docs' },
    { title: 'What\'s new in C# 11', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-11', type: 'docs' },
    { title: 'C# in Depth, 4th Ed — Jon Skeet', url: 'https://csharpindepth.com/', type: 'book', notes: 'The definitive guide to understanding C# deeply' },
    { title: 'Nick Chapsas — Modern C#', url: 'https://www.youtube.com/c/Nickchapsas', type: 'video', notes: 'Excellent deep dives on new C# features' },
  ],
});

const csP1Topics = [
  item({
    id: 'cs-p1-t1', trackId: 'csharp', parentId: 'cs-p1', type: 'topic', order: 1,
    title: 'Records, Structs & Value Types', weekRange: '1',
    description: 'Records for immutable data, record structs for value-type records, readonly structs. When to choose each.',
    resources: [
      { title: 'Records overview', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/records', type: 'docs' },
    ],
    architecturalNotes: [
      'record class: reference type with value equality. Use for DTOs, API responses, domain events.',
      'record struct: value type with value equality. Use for small, frequently allocated data (coords, ranges).',
      'readonly struct: prevents mutation after construction. Use for performance-critical value types.',
      'Decision: record class for most data carriers; record struct for hot-path small objects; class for entities with identity.',
    ],
    practiceItems: ['Refactor a DTO class to a record', 'Benchmark record vs class for allocation', 'Use with-expressions for immutable updates'],
  }),
  item({
    id: 'cs-p1-t2', trackId: 'csharp', parentId: 'cs-p1', type: 'topic', order: 2,
    title: 'Pattern Matching (Advanced)', weekRange: '1-2',
    description: 'Switch expressions, property patterns, relational patterns, list patterns, and pattern combinators.',
    resources: [
      { title: 'Pattern matching overview', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/functional/pattern-matching', type: 'docs' },
    ],
    architecturalNotes: [
      'Switch expressions replace verbose switch statements — more readable and exhaustive',
      'Property patterns: match on object properties directly — great for validation and type discrimination',
      'List patterns (C# 11): [first, .., last] — powerful for parsing and collection matching',
      'Decision: use switch expressions for multi-branch logic; property patterns for validation; avoid over-nesting',
    ],
    practiceItems: ['Rewrite an if-else chain using switch expression with property patterns', 'Use list patterns to parse command-line arguments'],
  }),
  item({
    id: 'cs-p1-t3', trackId: 'csharp', parentId: 'cs-p1', type: 'topic', order: 3,
    title: 'Primary Constructors & Required Members', weekRange: '2-3',
    description: 'C# 12 primary constructors for classes/structs, required keyword, init-only setters.',
    resources: [
      { title: 'Primary constructors', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-12#primary-constructors', type: 'docs' },
    ],
    architecturalNotes: [
      'Primary constructors: parameters available throughout class body — reduces boilerplate DI injection',
      'Capture semantics: parameters are captured by the closure, not stored as fields (unless you assign them)',
      'required modifier: forces callers to set a property — enforces contracts at compile time without constructor params',
      'Decision: primary constructors for DI-heavy services; required for configuration DTOs',
    ],
    practiceItems: ['Convert a service class with constructor injection to primary constructor', 'Use required members on a config model'],
  }),
  item({
    id: 'cs-p1-t4', trackId: 'csharp', parentId: 'cs-p1', type: 'topic', order: 4,
    title: 'Raw Strings, Interpolation & String Handling', weekRange: '3',
    description: 'Raw string literals, improved interpolation, UTF-8 string literals, SearchValues<T>.',
    architecturalNotes: [
      'Raw string literals (\"\"\"): no escaping needed for JSON, XML, regex — cleaner embedded content',
      'UTF-8 string literals ("text"u8): avoids encoding overhead for HTTP headers, protocol buffers',
      'SearchValues<T> (.NET 8): optimized character set searching — faster than Contains/IndexOfAny for known sets',
    ],
    practiceItems: ['Use raw string literals for embedded JSON/SQL templates', 'Benchmark SearchValues vs string.Contains'],
  }),
  item({
    id: 'cs-p1-t5', trackId: 'csharp', parentId: 'cs-p1', type: 'topic', order: 5,
    title: 'Collection Expressions & Spread', weekRange: '3-4',
    description: 'C# 12 collection expressions ([]), spread operator (..), and collection builders.',
    architecturalNotes: [
      'Collection expressions: [1, 2, 3] creates arrays, lists, spans — replaces new[] { }, new List<> { }',
      'Spread operator: [..existing, newItem] — combines collections without LINQ Concat',
      'Works with custom types via CollectionBuilder attribute',
      'Decision: use for all new collection initialization; cleaner than constructor syntax',
    ],
    practiceItems: ['Refactor array/list initializations to collection expressions', 'Combine multiple collections using spread'],
  }),
];

// C# Phase 2
const csharpPhase2 = item({
  id: 'cs-p2',
  trackId: 'csharp',
  parentId: 'csharp-track',
  type: 'phase',
  title: 'Async, Concurrency & Threading',
  description: 'Master async/await internals, Task-based programming, channels, parallel processing, and concurrency patterns.',
  order: 2,
  weekRange: '5-8',
  resources: [
    { title: 'Async in Depth', url: 'https://learn.microsoft.com/en-us/dotnet/standard/async-in-depth', type: 'docs' },
    { title: 'Concurrency in C# Cookbook — Stephen Cleary', url: 'https://www.oreilly.com/library/view/concurrency-in-c/9781492054498/', type: 'book', notes: 'The go-to reference for async/parallel patterns' },
    { title: 'Stephen Cleary\'s blog', url: 'https://blog.stephencleary.com/', type: 'blog', notes: 'Definitive async/await guidance' },
  ],
});

const csP2Topics = [
  item({
    id: 'cs-p2-t1', trackId: 'csharp', parentId: 'cs-p2', type: 'topic', order: 1,
    title: 'Async/Await Internals', weekRange: '5',
    description: 'How the state machine works, SynchronizationContext, ConfigureAwait, ValueTask vs Task.',
    architecturalNotes: [
      'async/await compiles to a state machine — each await is a suspension point',
      'ConfigureAwait(false): avoids capturing SynchronizationContext — use in library code, not in UI/controller code',
      'ValueTask: avoids Task allocation when result is often synchronous (cache hits, buffered reads)',
      'Decision: Task for most APIs; ValueTask only when profiling shows allocation pressure from completed tasks',
    ],
    practiceItems: ['Inspect generated state machine with ILSpy/SharpLab', 'Benchmark Task vs ValueTask for a cached operation'],
  }),
  item({
    id: 'cs-p2-t2', trackId: 'csharp', parentId: 'cs-p2', type: 'topic', order: 2,
    title: 'Cancellation, Timeouts & Error Handling', weekRange: '5-6',
    description: 'CancellationToken patterns, timeout handling, exception aggregation in async code.',
    architecturalNotes: [
      'Always accept CancellationToken in public async methods — enables cooperative cancellation',
      'CancellationTokenSource.CreateLinkedTokenSource: compose multiple cancellation signals',
      'Timeout pattern: use CancellationTokenSource with TimeSpan, not Task.Delay + Task.WhenAny',
      'AggregateException: unwrap in catch blocks — Task.Exception wraps inner exceptions',
    ],
    practiceItems: ['Add CancellationToken support to an HTTP client wrapper', 'Implement timeout with linked cancellation tokens'],
  }),
  item({
    id: 'cs-p2-t3', trackId: 'csharp', parentId: 'cs-p2', type: 'topic', order: 3,
    title: 'Channels & Producer-Consumer', weekRange: '6-7',
    description: 'System.Threading.Channels for async producer-consumer patterns. Bounded vs unbounded channels.',
    resources: [
      { title: 'Channels overview', url: 'https://learn.microsoft.com/en-us/dotnet/core/extensions/channels', type: 'docs' },
    ],
    architecturalNotes: [
      'Channel<T>: thread-safe async producer-consumer — replaces BlockingCollection in async code',
      'BoundedChannel: applies backpressure when full — prevents OOM in high-throughput scenarios',
      'UnboundedChannel: no limit — only use when producer rate is guaranteed < consumer rate',
      'Decision: bounded channels for ingestion pipelines; unbounded for internal signaling between components',
    ],
    practiceItems: ['Build a background processing pipeline using channels', 'Compare Channel vs ConcurrentQueue performance'],
  }),
  item({
    id: 'cs-p2-t4', trackId: 'csharp', parentId: 'cs-p2', type: 'topic', order: 4,
    title: 'Parallel & PLINQ', weekRange: '7-8',
    description: 'Parallel.ForEachAsync, PLINQ, Task.WhenAll patterns, SemaphoreSlim for throttling.',
    architecturalNotes: [
      'Parallel.ForEachAsync (.NET 6+): async-native parallel loop with MaxDegreeOfParallelism',
      'PLINQ (.AsParallel()): best for CPU-bound operations on large collections — not for I/O',
      'SemaphoreSlim: throttle concurrent async operations (e.g., limit to 10 HTTP calls at once)',
      'Decision: Parallel.ForEachAsync for I/O-bound parallel work; PLINQ for CPU-bound collection processing',
    ],
    practiceItems: ['Implement throttled parallel HTTP calls with SemaphoreSlim', 'Compare Parallel.ForEachAsync vs manual Task.WhenAll batching'],
  }),
  item({
    id: 'cs-p2-t5', trackId: 'csharp', parentId: 'cs-p2', type: 'topic', order: 5,
    title: 'IAsyncEnumerable & Async Streams', weekRange: '8',
    description: 'Async iteration with IAsyncEnumerable<T>, yield return in async methods, streaming data.',
    architecturalNotes: [
      'IAsyncEnumerable: pull-based async streaming — caller controls pace (vs push-based Channels)',
      'Use for: paginated API results, database cursor reads, Server-Sent Events',
      'await foreach: natural consumption syntax — compiles to async enumerator pattern',
      'Decision: IAsyncEnumerable for lazy async sequences; Channel for producer-consumer with backpressure',
    ],
    practiceItems: ['Stream paginated API results as IAsyncEnumerable', 'Use in ASP.NET Core controller returning streaming JSON'],
  }),
];

// C# Phase 3
const csharpPhase3 = item({
  id: 'cs-p3',
  trackId: 'csharp',
  parentId: 'csharp-track',
  type: 'phase',
  title: 'Performance & Memory',
  description: 'Span<T>, Memory<T>, ArrayPool, object pooling, benchmarking, and allocation-free patterns.',
  order: 3,
  weekRange: '9-13',
  resources: [
    { title: 'Writing High-Performance .NET Code — Ben Watson', url: 'https://www.writinghighperf.net/', type: 'book' },
    { title: 'Pro .NET Memory Management — Konrad Kokosa', url: 'https://prodotnetmemory.com/', type: 'book', notes: 'Deep GC and memory internals' },
    { title: 'Adam Sitnik — performance blog', url: 'https://adamsitnik.com/', type: 'blog' },
    { title: 'BenchmarkDotNet', url: 'https://benchmarkdotnet.org/', type: 'docs' },
  ],
});

const csP3Topics = [
  item({
    id: 'cs-p3-t1', trackId: 'csharp', parentId: 'cs-p3', type: 'topic', order: 1,
    title: 'Span<T> & Memory<T>', weekRange: '9',
    description: 'Stack-allocated slicing with Span<T>, heap-safe Memory<T>, ReadOnlySpan. Zero-allocation parsing.',
    architecturalNotes: [
      'Span<T>: stack-only view over contiguous memory (arrays, strings, native memory). Zero allocation slicing.',
      'Memory<T>: heap-safe wrapper when you need to store a ref to a slice (async methods, fields)',
      'string.AsSpan(): parse without substring allocations — massive win for parsers and formatters',
      'Decision: Span for synchronous hot paths (parsers, formatters); Memory when span needs to escape the stack',
    ],
    practiceItems: ['Parse CSV data using Span<char> without allocations', 'Compare string.Substring vs Span slicing with BenchmarkDotNet'],
  }),
  item({
    id: 'cs-p3-t2', trackId: 'csharp', parentId: 'cs-p3', type: 'topic', order: 2,
    title: 'ArrayPool & Object Pooling', weekRange: '9-10',
    description: 'Rent/return arrays from ArrayPool. ObjectPool for expensive objects. Reduce GC pressure.',
    resources: [
      { title: 'ArrayPool<T> docs', url: 'https://learn.microsoft.com/en-us/dotnet/api/system.buffers.arraypool-1', type: 'docs' },
    ],
    architecturalNotes: [
      'ArrayPool.Shared.Rent(): reuse arrays instead of allocating new ones — crucial for buffer-heavy code',
      'Always return rented arrays in finally blocks — leaking causes pool exhaustion',
      'ObjectPool<T>: reuse expensive objects (StringBuilder, HttpClient handlers, serializers)',
      'Decision: ArrayPool for byte[]/char[] buffers; ObjectPool for complex initialization-heavy objects',
    ],
    practiceItems: ['Use ArrayPool for a file reader buffer', 'Measure GC collections before and after pooling'],
  }),
  item({
    id: 'cs-p3-t3', trackId: 'csharp', parentId: 'cs-p3', type: 'topic', order: 3,
    title: 'Benchmarking with BenchmarkDotNet', weekRange: '10-11',
    description: 'Reliable micro-benchmarks, diagnosers (memory, GC, disassembly), result interpretation.',
    architecturalNotes: [
      'BenchmarkDotNet handles warmup, multiple iterations, and statistical analysis automatically',
      'MemoryDiagnoser: shows allocations per operation — the #1 metric for hot path optimization',
      'DisassemblyDiagnoser: see JIT-generated assembly — verify inlining, devirtualization',
      'Beware: micro-benchmarks don\'t capture real workload characteristics — always profile production too',
    ],
    practiceItems: ['Benchmark three approaches to string concatenation', 'Use MemoryDiagnoser to compare record vs class allocation'],
  }),
  item({
    id: 'cs-p3-t4', trackId: 'csharp', parentId: 'cs-p3', type: 'topic', order: 4,
    title: 'GC Internals & Allocation Patterns', weekRange: '11-12',
    description: 'Generational GC, LOH, POH, GC modes (workstation vs server), reducing allocations.',
    architecturalNotes: [
      'Gen0: short-lived objects. Gen1: survived one collection. Gen2: long-lived. LOH: >85KB objects.',
      'Server GC: one heap per core, higher throughput. Workstation GC: single heap, lower latency.',
      'POH (Pinned Object Heap): .NET 5+ — avoids LOH fragmentation for pinned buffers',
      'Allocation-free patterns: stackalloc, Span, ArrayPool, struct tuples, cached delegates',
    ],
    practiceItems: ['Use dotnet-counters to monitor GC metrics live', 'Identify and eliminate Gen2 collections in a sample app'],
  }),
  item({
    id: 'cs-p3-t5', trackId: 'csharp', parentId: 'cs-p3', type: 'topic', order: 5,
    title: 'Source Generators & Compile-Time Code', weekRange: '12-13',
    description: 'Roslyn source generators for zero-reflection patterns. JSON, logging, and regex source generators.',
    resources: [
      { title: 'Source generators overview', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/source-generators-overview', type: 'docs' },
    ],
    architecturalNotes: [
      'Source generators: emit C# at compile time — replaces runtime reflection for serialization, DI, validation',
      'System.Text.Json source gen: [JsonSerializable] — eliminates startup reflection cost, enables trimming',
      'LoggerMessage source gen: [LoggerMessage] — allocation-free structured logging',
      'GeneratedRegex: [GeneratedRegex] — compile-time regex compilation, much faster than Regex.Compile',
      'Decision: prefer source-generated alternatives wherever available — faster startup, trimming-safe, AOT-compatible',
    ],
    practiceItems: ['Use [JsonSerializable] for a serialization context', 'Benchmark GeneratedRegex vs Regex.Compile'],
  }),
];

// C# Phase 4
const csharpPhase4 = item({
  id: 'cs-p4',
  trackId: 'csharp',
  parentId: 'csharp-track',
  type: 'phase',
  title: 'LINQ, Generics & Type System Deep Dive',
  description: 'Advanced LINQ, generic constraints, covariance/contravariance, expression trees, and reflection alternatives.',
  order: 4,
  weekRange: '14-17',
  resources: [
    { title: 'LINQ docs', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/linq/', type: 'docs' },
    { title: 'CLR via C# — Jeffrey Richter', url: 'https://www.microsoftpressstore.com/store/clr-via-c-sharp-9780735667457', type: 'book', notes: 'Foundational CLR and type system understanding' },
  ],
});

const csP4Topics = [
  item({
    id: 'cs-p4-t1', trackId: 'csharp', parentId: 'cs-p4', type: 'topic', order: 1,
    title: 'LINQ Internals & Performance', weekRange: '14',
    description: 'Deferred execution, expression trees vs delegates, LINQ allocation costs, and optimized alternatives.',
    architecturalNotes: [
      'Deferred execution: LINQ queries don\'t execute until enumerated — beware multiple enumeration',
      'LINQ allocates: each operator creates iterator objects. For hot paths, use manual loops.',
      'IQueryable<T> uses expression trees (compiled at runtime) vs IEnumerable<T> uses delegates (in-memory)',
      'Decision: LINQ for readability in business logic; manual loops in hot paths; IQueryable for database queries',
    ],
    practiceItems: ['Profile LINQ chain allocations vs manual loop', 'Convert an IQueryable query to raw SQL and compare'],
  }),
  item({
    id: 'cs-p4-t2', trackId: 'csharp', parentId: 'cs-p4', type: 'topic', order: 2,
    title: 'Generics Deep Dive', weekRange: '14-15',
    description: 'Generic constraints, static abstract interface members, generic math, type erasure vs reification.',
    resources: [
      { title: 'Generic math', url: 'https://learn.microsoft.com/en-us/dotnet/standard/generics/math', type: 'docs' },
    ],
    architecturalNotes: [
      'C# generics are reified (not erased like Java) — each closed type gets its own code at runtime',
      'Static abstract interface members (.NET 7+): enable generic math — INumber<T>, IAdditionOperators<T,T,T>',
      'where T : allows(IParsable<T>): constraint to parseable types — removes stringly-typed parsing',
      'Decision: prefer generic interfaces over object + casting; use static abstracts for mathematical/parsing abstractions',
    ],
    practiceItems: ['Write a generic Sum<T>() using INumber<T>', 'Create a generic repository with proper constraints'],
  }),
  item({
    id: 'cs-p4-t3', trackId: 'csharp', parentId: 'cs-p4', type: 'topic', order: 3,
    title: 'Covariance, Contravariance & Variance', weekRange: '15-16',
    description: 'Generic variance (in/out), IEnumerable<out T> vs IList<T>, delegate variance.',
    architecturalNotes: [
      'Covariance (out T): IEnumerable<Derived> assignable to IEnumerable<Base> — producer position only',
      'Contravariance (in T): Action<Base> assignable to Action<Derived> — consumer position only',
      'IList<T> is invariant because it both produces and consumes T',
      'Delegate variance: Func<out TResult> is covariant; Action<in T> is contravariant',
    ],
    practiceItems: ['Design a covariant interface for a read-only repository', 'Create examples showing where invariance prevents bugs'],
  }),
  item({
    id: 'cs-p4-t4', trackId: 'csharp', parentId: 'cs-p4', type: 'topic', order: 4,
    title: 'Expression Trees & Reflection Alternatives', weekRange: '16-17',
    description: 'Build lambda expressions at runtime, compiled expression trees, and source-gen reflection.',
    architecturalNotes: [
      'Expression trees: data structures representing code — used by LINQ providers (EF Core, Azure Cosmos)',
      'Expression.Compile(): convert expression tree to executable delegate — cached, fast after first call',
      'Reflection alternatives: source generators, Unsafe.As, compiled expressions — avoid System.Reflection in hot paths',
      'Decision: expression trees for building dynamic queries; source generators for anything known at compile time',
    ],
    practiceItems: ['Build a dynamic filter expression tree for a query builder', 'Benchmark reflection vs compiled expression property access'],
  }),
];

// C# Phase 5
const csharpPhase5 = item({
  id: 'cs-p5',
  trackId: 'csharp',
  parentId: 'csharp-track',
  type: 'phase',
  title: 'DI, Middleware & ASP.NET Core Internals',
  description: 'Dependency injection lifetime management, middleware pipeline, minimal APIs, and ASP.NET Core request processing.',
  order: 5,
  weekRange: '17-20',
  resources: [
    { title: 'Dependency injection in .NET', url: 'https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection', type: 'docs' },
    { title: 'ASP.NET Core fundamentals', url: 'https://learn.microsoft.com/en-us/aspnet/core/fundamentals/', type: 'docs' },
    { title: 'Andrew Lock — .NET Escapades blog', url: 'https://andrewlock.net/', type: 'blog', notes: 'Deep ASP.NET Core internals articles' },
  ],
});

const csP5Topics = [
  item({
    id: 'cs-p5-t1', trackId: 'csharp', parentId: 'cs-p5', type: 'topic', order: 1,
    title: 'DI Lifetimes & Anti-Patterns', weekRange: '17',
    description: 'Transient vs Scoped vs Singleton. Captive dependency problem, service locator anti-pattern.',
    architecturalNotes: [
      'Transient: new instance per request. Scoped: one per HTTP request. Singleton: one for app lifetime.',
      'Captive dependency: Singleton holding a Scoped service — Scoped never gets disposed. .NET validates this in Development.',
      'Service Locator anti-pattern: injecting IServiceProvider and resolving manually — hides dependencies, breaks testability',
      'Decision: stateless services as Transient; DbContext/UoW as Scoped; caches/configuration as Singleton',
    ],
    practiceItems: ['Reproduce and fix a captive dependency bug', 'Refactor a service locator to constructor injection'],
  }),
  item({
    id: 'cs-p5-t2', trackId: 'csharp', parentId: 'cs-p5', type: 'topic', order: 2,
    title: 'Options Pattern & Configuration', weekRange: '17-18',
    description: 'IOptions<T>, IOptionsSnapshot<T>, IOptionsMonitor<T>, validation, and named options.',
    resources: [
      { title: 'Options pattern', url: 'https://learn.microsoft.com/en-us/dotnet/core/extensions/options', type: 'docs' },
    ],
    architecturalNotes: [
      'IOptions<T>: singleton, read once at startup. IOptionsSnapshot<T>: scoped, re-reads per request. IOptionsMonitor<T>: singleton, reacts to changes.',
      'ValidateDataAnnotations / ValidateOnStart: fail fast if config is invalid — prevents runtime surprises',
      'Named options: register multiple configurations of the same type (e.g., multiple HTTP client configs)',
      'Decision: IOptions for static config; IOptionsMonitor for dynamic config (App Configuration, feature flags)',
    ],
    practiceItems: ['Add options validation with ValidateOnStart', 'Use IOptionsMonitor with Azure App Configuration'],
  }),
  item({
    id: 'cs-p5-t3', trackId: 'csharp', parentId: 'cs-p5', type: 'topic', order: 3,
    title: 'Middleware Pipeline & Request Processing', weekRange: '18-19',
    description: 'How the ASP.NET Core middleware pipeline works, order of middleware, custom middleware.',
    architecturalNotes: [
      'Middleware is a pipeline of RequestDelegate — each middleware calls next() or short-circuits',
      'Order matters: authentication before authorization, exception handling at the top, routing before endpoints',
      'Terminal middleware: doesn\'t call next() — acts as the final handler (e.g., Map, Run)',
      'Convention-based vs factory-based middleware: factory (IMiddleware) supports DI injection of scoped services',
    ],
    practiceItems: ['Write custom middleware for request timing/logging', 'Trace the full middleware pipeline for an API request'],
  }),
  item({
    id: 'cs-p5-t4', trackId: 'csharp', parentId: 'cs-p5', type: 'topic', order: 4,
    title: 'Minimal APIs & Endpoint Filters', weekRange: '19-20',
    description: 'Minimal API design, endpoint filters, route groups, and comparison with controller-based APIs.',
    resources: [
      { title: 'Minimal APIs overview', url: 'https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/overview', type: 'docs' },
    ],
    architecturalNotes: [
      'Minimal APIs: less ceremony, no controller classes. Best for microservices and small APIs.',
      'Endpoint filters (IEndpointFilter): AOP for endpoints — validation, logging, auth checks',
      'Route groups: app.MapGroup("/api/v1") — organize endpoints with shared prefix, filters, metadata',
      'Decision: minimal APIs for new microservices; controllers for large APIs with many cross-cutting concerns',
    ],
    practiceItems: ['Build a CRUD API using minimal APIs with endpoint filters for validation'],
  }),
  item({
    id: 'cs-p5-t5', trackId: 'csharp', parentId: 'cs-p5', type: 'topic', order: 5,
    title: 'Testing Patterns in C#', weekRange: '20',
    description: 'xUnit, Moq/NSubstitute, FluentAssertions, integration testing with WebApplicationFactory.',
    resources: [
      { title: 'Integration testing in ASP.NET Core', url: 'https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests', type: 'docs' },
      { title: 'Unit testing best practices', url: 'https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices', type: 'docs' },
    ],
    architecturalNotes: [
      'Arrange-Act-Assert: standard test structure. One assertion per test concept (not per assert call).',
      'WebApplicationFactory: spins up in-memory API for integration tests — no deployment needed',
      'Test doubles: Mock for verifying interactions; Stub for providing data; Fake for lightweight implementations',
      'Decision: unit tests for business logic; integration tests for API endpoints and data access; avoid testing framework internals',
    ],
    practiceItems: ['Write integration tests using WebApplicationFactory', 'Compare Moq vs NSubstitute syntax for DI-heavy services'],
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
  csharpTrack,
  csharpPhase1, ...csP1Topics,
  csharpPhase2, ...csP2Topics,
  csharpPhase3, ...csP3Topics,
  csharpPhase4, ...csP4Topics,
  csharpPhase5, ...csP5Topics,
  cpTrack,
  cpPhase1, ...cpP1Topics,
  cpPhase2, ...cpP2Topics,
  cpPhase3, ...cpP3Topics,
  cpPhase4, ...cpP4Topics,
];
