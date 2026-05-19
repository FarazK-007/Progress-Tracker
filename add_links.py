import sqlite3
import json

db_path = 'E:/progress_tracker/progress_tracker.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get all current plans
cursor.execute("SELECT id, tasks FROM daily_plan")
rows = cursor.fetchall()

linked_tasks = {
    1: "[ ] Review Spark architecture components: Driver, Executor, Cluster Manager. See [Spark Docs](https://spark.apache.org/docs/latest/cluster-overview.html); [ ] Study execution hierarchy: Jobs, Stages, Tasks, and DAGs; [ ] Deep dive into Shuffle mechanics and network I/O; [ ] Compare RDDs vs DataFrames under the hood; [ ] Understand lazy evaluation and transformation vs action; [ ] Read [Learning Spark](https://pages.databricks.com/rs/094-YMS-629/images/LearningSpark2.0.pdf) Chapters 1-2",
    2: "[ ] Implement 10 core PySpark snippets on Databricks CE. Try [Databricks Community](https://community.cloud.databricks.com/); [ ] Study Narrow vs Wide transformations; [ ] Understand repartition() vs coalesce(); [ ] Practice complex aggregations",
    5: "[ ] Master SQL Window functions: ROW_NUMBER(), RANK(), DENSE_RANK(), LEAD(), LAG(); [ ] Solve 10 Medium-level SQL questions on [LeetCode SQL](https://leetcode.com/studyplan/top-sql-50/); [ ] Solve 5 complex SQL questions on [DataLemur](https://datalemur.com/)",
    7: "[ ] Study Structured Streaming: watermarks, triggers, output modes. Reference [Structured Streaming Guide](https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html); [ ] Understand checkpointing; [ ] Build a small Kafka to Delta stream",
    9: "[ ] Study Delta Lake ACID transactions. Read [Delta Lake Docs](https://docs.delta.io/latest/delta-intro.html); [ ] Practice Time Travel queries and RESTORE; [ ] Optimize performance with Z-ORDER and OPTIMIZE; [ ] Understand VACUUM retention periods; [ ] Write a complex SCD Type 2 MERGE statement",
    12: "[ ] Finish the [LeetCode SQL 50](https://leetcode.com/studyplan/top-sql-50/) study plan; [ ] Solve 5 Hard-level questions on [StrataScratch](https://www.stratascratch.com/); [ ] Review and document all missed SQL questions",
    19: "[ ] Setup project repository for Agentic RAG; [ ] Configure FastAPI, [LangChain](https://python.langchain.com/docs/get_started/introduction), [LangGraph](https://python.langchain.com/docs/langgraph), and pgvector; [ ] Write Dockerfile and docker-compose; [ ] Build initial data ingestion and embedding script; [ ] Push code to GitHub",
    21: "[ ] Master the System Design framework. Read [ByteByteGo Newsletter](https://blog.bytebytego.com/); [ ] Watch 2 mock interview videos on YouTube; [ ] Practice whiteboarding a basic system; [ ] Apply to 5 Data Engineering roles",
    24: "[ ] Study LLM foundations: Transformers intuition and self-attention. Read [Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/); [ ] Understand embeddings and vector spaces; [ ] Tune temperature and top-p parameters; [ ] Study Prompt Engineering: CoT and ReAct; [ ] Apply to 5 roles",
    28: "[ ] Study advanced Agent patterns; [ ] Implement ReAct and Plan-and-Execute agents; [ ] Study Reflexion and Multi-agent architectures; [ ] Read [Anthropic's guide on Building Effective Agents](https://www.anthropic.com/research/building-effective-agents); [ ] Apply to 5 roles"
}

for row in rows:
    plan_id = row[0]
    tasks_str = row[1]
    
    if plan_id in linked_tasks:
        new_tasks = linked_tasks[plan_id]
        cursor.execute("UPDATE daily_plan SET tasks = ? WHERE id = ?", (new_tasks, plan_id))

conn.commit()
conn.close()
print("Links injected successfully!")
