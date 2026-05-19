import sqlite3
import json

db_path = 'E:/progress_tracker/progress_tracker.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get all current plans
cursor.execute("SELECT id, focus_area, tasks FROM daily_plan")
rows = cursor.fetchall()

expanded_tasks = {
    0: "[x] Update LinkedIn title, About section, and toggle Open to Work status; [x] Verify all portfolio and GitHub URLs on resume are working; [x] Create an Excel/Notion tracker for job applications",
    1: "[ ] Review Spark architecture components: Driver, Executor, Cluster Manager; [ ] Study execution hierarchy: Jobs, Stages, Tasks, and DAGs; [ ] Deep dive into Shuffle mechanics and network I/O; [ ] Compare RDDs vs DataFrames under the hood; [ ] Understand lazy evaluation and transformation vs action; [ ] Read Learning Spark Chapters 1-2",
    2: "[ ] Implement 10 core PySpark snippets on Databricks CE (grouping, windowing, filtering); [ ] Study Narrow vs Wide transformations and their impact on performance; [ ] Understand repartition() vs coalesce() when writing data; [ ] Practice complex aggregations",
    3: "[ ] Master Spark Join strategies: Broadcast, Sort-Merge, and Shuffle Hash joins; [ ] Implement salting techniques to handle data skew; [ ] Study Adaptive Query Execution (AQE) skew join optimizations; [ ] Run explain() plans on Databricks to verify join types",
    4: "[ ] Understand Catalyst Optimizer phases: Analysis, Logical Optimization, Physical Planning; [ ] Study Tungsten execution engine and whole-stage code generation; [ ] Practice reading complex df.explain() outputs; [ ] Review AQE dynamic coalescing of partitions",
    5: "[ ] Master SQL Window functions: ROW_NUMBER(), RANK(), DENSE_RANK(), LEAD(), LAG(); [ ] Solve 10 Medium-level SQL questions on LeetCode; [ ] Solve 5 complex SQL questions on DataLemur focusing on aggregations",
    6: "[ ] Master Common Table Expressions (CTEs) and Recursive CTEs; [ ] Compare subqueries vs joins for performance; [ ] Solve 10 advanced SQL problems; [ ] Write a weekly summary of SQL gotchas and patterns learned",
    7: "[ ] Study Structured Streaming: watermarks, triggers, output modes; [ ] Understand checkpointing and how exactly-once semantics are achieved; [ ] Build a small Kafka to Delta stream; [ ] Apply to 5 Data Engineering roles",
    8: "[ ] Learn Spark memory management: executor memory, memory overhead, off-heap; [ ] Tune spark.sql.shuffle.partitions based on cluster size; [ ] Practice reading the Spark UI to find bottlenecks; [ ] Diagnose a mocked slow job",
    9: "[ ] Study Delta Lake ACID transactions and the transaction log; [ ] Practice Time Travel queries and RESTORE; [ ] Optimize performance with Z-ORDER and OPTIMIZE; [ ] Understand VACUUM retention periods; [ ] Write a complex SCD Type 2 MERGE statement",
    10: "[ ] Review Snowflake Architecture: cloud services, compute, storage; [ ] Understand micro-partitions and how clustering keys work; [ ] Study Virtual Warehouse sizing and scaling policies; [ ] Analyze the Snowflake Query Profile for bottlenecks",
    11: "[ ] Master Snowflake continuous data pipelines: Streams and Tasks; [ ] Setup Snowpipe for auto-ingestion from cloud storage; [ ] Practice Time Travel and Zero-copy cloning; [ ] Apply to 5 Data Engineering roles",
    12: "[ ] Finish the LeetCode SQL 50 study plan; [ ] Solve 5 Hard-level questions on StrataScratch; [ ] Review and document all missed SQL questions",
    13: "[ ] Complete a 45-minute mock SQL interview on Pramp or interviewing.io; [ ] Review peer feedback thoroughly; [ ] Identify and document 3 specific weak areas to focus on",
    14: "[ ] Study Airflow core concepts: DAGs, Operators, Sensors, Hooks, XCom; [ ] Understand the Airflow scheduler and executor architectures; [ ] Build a 5-task DAG with branching and sensors",
    15: "[ ] Master advanced Airflow: Dynamic Task Mapping and TaskGroups; [ ] Study different executors (Celery, Kubernetes); [ ] Implement idempotency and backfilling strategies; [ ] Apply to 5 Data Engineering roles",
    16: "[ ] BigQuery Architecture: Dremel engine, Colossus storage; [ ] Compare Partitioning vs Clustering in BQ; [ ] Study Materialized Views and BI Engine caching; [ ] Practice estimating query costs",
    17: "[ ] Review GCP data services ecosystem; [ ] Compare Dataproc (Spark/Hadoop) vs Dataflow (Beam); [ ] Understand Pub/Sub delivery semantics; [ ] Review Cloud Composer (Airflow) and GCS lifecycle rules",
    18: "[ ] Review Azure data services ecosystem; [ ] Study ADLS Gen2 hierarchical namespaces; [ ] Compare Synapse dedicated vs serverless SQL pools; [ ] Review Azure Data Factory pipelines; [ ] Apply to 5 Data Engineering roles",
    19: "[ ] Setup project repository for Agentic RAG; [ ] Configure FastAPI, LangChain, LangGraph, and pgvector; [ ] Write Dockerfile and docker-compose; [ ] Build initial data ingestion and embedding script; [ ] Push code to GitHub",
    20: "[ ] Build the basic Retrieval + LLM answer chain; [ ] Integrate vector search with pgvector; [ ] Read 'Designing Data-Intensive Applications' Chapter 3 on Storage & Retrieval; [ ] Document the initial architecture",
    21: "[ ] Master the System Design framework: Requirements, Scale, High-level design, Deep dives, Tradeoffs; [ ] Watch 2 mock interview videos on YouTube; [ ] Practice whiteboarding a basic system; [ ] Apply to 5 Data Engineering roles",
    22: "[ ] Practice designing a Real-time analytics pipeline; [ ] Architecture: Kafka -> Spark Streaming -> Delta Lake -> BI Dashboard; [ ] Whiteboard the system and discuss tradeoffs between latency and cost",
    23: "[ ] Practice designing a modern Data Lakehouse; [ ] Detail the Medallion architecture (Bronze/Silver/Gold); [ ] Discuss Unity Catalog, governance, and RBAC; [ ] Design a Change Data Capture (CDC) flow",
    24: "[ ] Study LLM foundations: Transformers intuition and self-attention; [ ] Understand embeddings and vector spaces; [ ] Tune temperature and top-p parameters; [ ] Study Prompt Engineering: CoT and ReAct; [ ] Apply to 5 roles",
    25: "[ ] Deep dive into RAG architectures; [ ] Study advanced chunking strategies (semantic, recursive); [ ] Compare vector databases (Pinecone, Milvus, pgvector); [ ] Implement hybrid retrieval (keyword + vector) and reranking",
    26: "[ ] Build the LangGraph stateful graph for the Agentic RAG project; [ ] Implement router, retriever, grader, and generator nodes; [ ] Add a SQL querying tool to the agent; [ ] Setup LangSmith for tracing",
    27: "[ ] Implement RAGAS evaluation metrics (faithfulness, answer relevance); [ ] Create a comprehensive README with a Mermaid architecture diagram; [ ] Read DDIA Chapter 5 on Replication",
    28: "[ ] Study advanced Agent patterns; [ ] Implement ReAct and Plan-and-Execute agents; [ ] Study Reflexion and Multi-agent architectures; [ ] Read Anthropic's guide on Building Effective Agents; [ ] Apply to 5 roles",
    29: "[ ] Master LLM Tool Calling (function calling); [ ] Compare OpenAI and Anthropic tool use formats; [ ] Build a custom ReAct loop from scratch in Python without LangChain",
    30: "[ ] Study the Model Context Protocol (MCP) specification; [ ] Build a tiny MCP server that exposes a local file-reading tool; [ ] Connect the MCP server to Claude Desktop",
    31: "[ ] Study LLM Guardrails and Ops; [ ] Implement input/output validation to prevent prompt injection and PII leaks; [ ] Review LangSmith/LangFuse traces for performance tuning; [ ] Apply to 5 roles",
    32: "[ ] Start Project 2: Self-Healing Data Pipeline; [ ] Build a LangGraph agent that polls an Airflow REST API; [ ] Mock tools for fetching logs, classifying errors, reading runbooks, and creating Jira tickets",
    33: "[ ] Complete the Self-Healing Pipeline project; [ ] Build an evaluation suite testing 10 different failure scenarios; [ ] Record a 2-minute Loom video demonstrating the agent; [ ] Polish GitHub README",
    34: "[ ] Prepare for Behavioral interviews; [ ] Write out 8 detailed STAR (Situation, Task, Action, Result) stories; [ ] Cover scenarios: cost reduction, MTTR improvement, scaling throughput, conflict resolution, mentoring, critical incident, tight deadline, and learning a new tech",
    35: "[ ] Practice designing a Multi-tenant RAG platform; [ ] Address isolation for 50 tenants; [ ] Design the evaluation loop and cost control/rate limiting mechanisms; [ ] Apply to 5 roles",
    36: "[ ] Practice designing an Agentic L1 support auto-resolution system; [ ] Detail the end-to-end flow, human-in-the-loop escalation, and fallback strategies; [ ] Connect this design back to your personal projects",
    37: "[ ] Practice designing a CDC system at scale; [ ] Architecture: Debezium -> Kafka -> Spark Streaming -> Delta Lake; [ ] Discuss handling schema evolution and guaranteeing exactly-once semantics",
    38: "[ ] Practice detailing a Cost Optimization war story; [ ] Scenario: Reducing a $50K/mo Databricks workload by 40%; [ ] Write down the step-by-step plan (instance types, spot nodes, photon, cluster policies, z-ordering); [ ] Apply to 5 roles",
    39: "[ ] Complete Mock Interview 1: PySpark + SQL; [ ] Conduct on Pramp or with a peer; [ ] Record the session and identify 3 specific weak spots in coding speed or syntax",
    40: "[ ] Complete Mock Interview 2: System Design; [ ] Conduct on interviewing.io or with a peer; [ ] Revisit weak spots from the previous mock and ensure improvement",
    41: "[ ] Complete Mock Interview 3: Agentic AI / GenAI; [ ] Walk through both personal projects in depth, defending architectural choices; [ ] Skim DDIA Chapter 11 on Stream Processing",
    42: "[ ] Complete Behavioral mock interview; [ ] Practice all 8 STAR stories out loud with a peer, focusing on concise delivery and impact metrics; [ ] Apply to 10 roles",
    43: "[ ] Conduct a rapid-fire revision session; [ ] Review 50 flashcards covering Spark, SQL, Snowflake, Airflow, and GenAI concepts; [ ] Target previously identified weak spots; [ ] Apply to 10 roles",
    44: "[ ] Coding rust-off session; [ ] Complete 10 timed SQL questions (max 15 mins each) and 5 PySpark data manipulation tasks; [ ] Apply to 10 roles",
    45: "[ ] Cloud certification knowledge refresh; [ ] Review GCP Professional Data Engineer concepts; [ ] Consider booking the Databricks Data Engineer Professional exam; [ ] Apply to 10 roles",
    46: "[ ] Execute LinkedIn content strategy; [ ] Publish an in-depth write-up on your Agentic RAG architecture; [ ] Showcase the project on r/dataengineering; [ ] Send personalized DMs to 5 technical recruiters",
    47: "[ ] Complete Mock Interview 4: The Full Loop; [ ] Do 4 back-to-back rounds with a peer (SQL, Spark, System Design, Behavioral) to build stamina",
    48: "[ ] Take a half-day off for rest and visualization; [ ] Calmly review STAR stories and technical notes; [ ] Prepare your environment and outfit for tomorrow",
    49: "[ ] Interview Day: Morning quick revision of core topics; [ ] Afternoon: Execute the interview; [ ] Evening: Write down interview questions, notes, and send follow-up thank you emails",
    50: "[ ] Interview Day: Morning quick revision of core topics; [ ] Afternoon: Execute the interview; [ ] Evening: Write down interview questions, notes, and send follow-up thank you emails",
    51: "[ ] Interview Day: Morning quick revision of core topics; [ ] Afternoon: Execute the interview; [ ] Evening: Write down interview questions, notes, and send follow-up thank you emails",
    52: "[ ] Interview Day: Morning quick revision of core topics; [ ] Afternoon: Execute the interview; [ ] Evening: Write down interview questions, notes, and send follow-up thank you emails",
    53: "[ ] Interview Day: Morning quick revision of core topics; [ ] Afternoon: Execute the interview; [ ] Evening: Write down interview questions, notes, and send follow-up thank you emails",
    54: "[ ] Maintain interview pipeline momentum; [ ] Submit 5 new high-quality applications; [ ] Complete 1 SQL and 1 PySpark practice question to stay sharp",
    55: "[ ] Evaluate offers and negotiate; [ ] Compare offers based on total compensation, role scope, exposure to GenAI, and overall learning rate; [ ] Make the final decision"
}

def fallback_expand(tasks_str):
    # If a task ID isn't explicitly in the dictionary, just prepend checkboxes to existing semicolon parts
    if not tasks_str:
        return ""
    parts = [p.strip() for p in tasks_str.split(';') if p.strip()]
    expanded = []
    for p in parts:
        if p.startswith('[') and ']' in p:
            expanded.append(p)
        else:
            expanded.append(f"[ ] {p}")
    return '; '.join(expanded)

for row in rows:
    plan_id = row[0]
    tasks_str = row[2]
    
    if plan_id in expanded_tasks:
        new_tasks = expanded_tasks[plan_id]
    else:
        new_tasks = fallback_expand(tasks_str)
        
    cursor.execute("UPDATE daily_plan SET tasks = ? WHERE id = ?", (new_tasks, plan_id))

conn.commit()
conn.close()
print("Tasks expanded successfully!")
