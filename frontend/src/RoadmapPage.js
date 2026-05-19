import React from 'react';


const roadmap = [
  {
    week: 1,
    focus: 'Foundations & Resume',
    summary: 'Kick off your journey by setting up your tracking system, clarifying your goals, and building a strong foundation. Polish your resume and online presence, and start reviewing core technical skills.',
    days: [
      { day: 1, title: 'Set up tracker, gather job descriptions, list target companies', details: 'Create your job/interview tracker. Collect 10-20 job descriptions for your target roles. List 20+ companies you’re interested in. Note required skills and keywords.' },
      { day: 2, title: 'Resume draft (ATS, impact, keywords)', details: 'Draft your resume using ATS-friendly formatting. Focus on impact, metrics, and relevant keywords. Tailor for each job family.' },
      { day: 3, title: 'LinkedIn update, portfolio/GitHub polish', details: 'Update your LinkedIn headline, summary, and experience. Pin top projects. Clean up your GitHub—add READMEs, remove old repos, highlight best work.' },
      { day: 4, title: 'Python/SQL review, LeetCode easy', details: 'Review Python basics (data types, functions, OOP). Practice 5-10 easy LeetCode problems. Review SQL SELECT, WHERE, GROUP BY.' },
      { day: 5, title: 'Data structures (arrays, strings, dicts)', details: 'Deep dive into arrays, strings, and dictionaries/maps. Practice common operations and patterns.' },
      { day: 6, title: 'System design basics, read 1-2 case studies', details: 'Read about system design basics (scalability, reliability, latency). Study 1-2 real-world case studies (e.g., URL shortener, news feed).' },
      { day: 7, title: 'Rest, reflect, adjust plan', details: 'Take a break. Review your progress. Adjust your plan for next week based on what worked and what didn’t.' },
    ],
  },
  {
    week: 2,
    focus: 'Core Coding & Projects',
    summary: 'Build on your foundation with more coding practice and project work. Start mock interviews and system design exercises.',
    days: [
      { day: 8, title: 'LeetCode medium, focus on patterns', details: 'Solve 3-5 medium LeetCode problems. Focus on sliding window, two pointers, and recursion.' },
      { day: 9, title: 'SQL joins, window functions', details: 'Practice SQL JOINs (inner, left, right) and window functions (ROW_NUMBER, RANK, etc.).' },
      { day: 10, title: 'Pandas/Numpy, data wrangling', details: 'Review Pandas and Numpy basics. Practice data cleaning, merging, and aggregation.' },
      { day: 11, title: 'Project deep dive (ETL, ML, or agentic AI)', details: 'Pick a key project. Write a STAR story (Situation, Task, Action, Result). Polish code and documentation.' },
      { day: 12, title: 'Mock interview (coding)', details: 'Do a timed coding mock interview (with a friend or online). Review mistakes and solutions.' },
      { day: 13, title: 'System design (scalability, data flow)', details: 'Sketch a system (e.g., chat app, analytics pipeline). Focus on scalability and data flow.' },
      { day: 14, title: 'Rest, review, apply to 2 jobs', details: 'Take a break. Review your tracker. Apply to 2 jobs using your tailored resume.' },
    ],
  },
  {
    week: 3,
    focus: 'Advanced Coding & System Design',
    summary: 'Tackle harder problems and deepen your system design skills. Practice behavioral questions and refine your project stories.',
    days: [
      { day: 15, title: 'LeetCode hard, review mistakes', details: 'Attempt 1-2 hard LeetCode problems. Focus on learning from mistakes.' },
      { day: 16, title: 'Distributed systems basics', details: 'Read about distributed systems (consistency, partitioning, CAP theorem).' },
      { day: 17, title: 'Data modeling, SQL optimization', details: 'Practice designing database schemas. Learn about indexes and query optimization.' },
      { day: 18, title: 'Project storytelling (STAR method)', details: 'Refine your STAR stories for 2-3 projects. Practice telling them out loud.' },
      { day: 19, title: 'Mock interview (system design)', details: 'Do a system design mock interview. Get feedback.' },
      { day: 20, title: 'Behavioral Q&A prep', details: 'List 10 common behavioral questions. Write bullet-point answers.' },
      { day: 21, title: 'Rest, apply to 3 jobs', details: 'Take a break. Apply to 3 jobs. Update your tracker.' },
    ],
  },
  {
    week: 4,
    focus: 'Agentic AI & ML',
    summary: 'Focus on agentic AI, LLMs, and ML pipelines. Practice coding, system design, and mock interviews with an AI/ML focus.',
    days: [
      { day: 22, title: 'LLMs, prompt engineering basics', details: 'Read about LLMs (architecture, use cases). Try prompt engineering exercises.' },
      { day: 23, title: 'ML pipeline review', details: 'Review ML pipeline steps (data, model, deployment). Sketch a pipeline for a past project.' },
      { day: 24, title: 'Agentic AI project/code review', details: 'Review your agentic AI project. Polish code, add comments, and prepare to discuss design choices.' },
      { day: 25, title: 'LeetCode/SQL mixed', details: 'Do a mixed set of LeetCode and SQL problems.' },
      { day: 26, title: 'Mock interview (ML/AI)', details: 'Do a mock interview focused on ML/AI concepts.' },
      { day: 27, title: 'System design (AI focus)', details: 'Design a system with an AI/ML component (e.g., recommendation engine).' },
      { day: 28, title: 'Rest, reflect, apply to 3 jobs', details: 'Take a break. Reflect on your AI/ML learning. Apply to 3 jobs.' },
    ],
  },
  {
    week: 5,
    focus: 'Mock Interviews & Applications',
    summary: 'Ramp up mock interviews and job applications. Practice pitching your projects and behavioral answers.',
    days: [
      { day: 29, title: 'Mock interview (coding)', details: 'Do a timed coding mock interview. Focus on communication and problem-solving.' },
      { day: 30, title: 'Resume/LinkedIn refresh', details: 'Update your resume and LinkedIn with new skills and projects.' },
      { day: 31, title: 'Apply to 5 jobs', details: 'Apply to 5 jobs. Track responses and follow up.' },
      { day: 32, title: 'LeetCode/SQL timed sets', details: 'Do a timed set of LeetCode and SQL questions.' },
      { day: 33, title: 'Project pitch practice', details: 'Practice pitching your main project in 2 minutes.' },
      { day: 34, title: 'Mock interview (behavioral)', details: 'Do a behavioral mock interview. Get feedback.' },
      { day: 35, title: 'Rest, review, adjust', details: 'Take a break. Review your progress and adjust your plan.' },
    ],
  },
  {
    week: 6,
    focus: 'Deep Dives & Networking',
    summary: 'Deepen your knowledge in weak areas and expand your network. Continue applying and practicing interviews.',
    days: [
      { day: 36, title: 'Deep dive (choose weak area)', details: 'Pick a weak area (e.g., system design, ML, SQL) and study it in depth.' },
      { day: 37, title: 'Networking (reach out, referrals)', details: 'Reach out to connections for referrals. Attend a virtual meetup or webinar.' },
      { day: 38, title: 'LeetCode/SQL review', details: 'Review past LeetCode/SQL problems. Focus on mistakes.' },
      { day: 39, title: 'System design (real-world case)', details: 'Design a real-world system (e.g., ride-sharing, e-commerce).' },
      { day: 40, title: 'Mock interview (choose type)', details: 'Do a mock interview in your weakest area.' },
      { day: 41, title: 'Behavioral Q&A', details: 'Practice behavioral questions with a friend or mentor.' },
      { day: 42, title: 'Rest, apply to 3 jobs', details: 'Take a break. Apply to 3 jobs.' },
    ],
  },
  {
    week: 7,
    focus: 'Final Prep & Offers',
    summary: 'Prepare for final interviews and offers. Practice negotiation and polish your stories.',
    days: [
      { day: 43, title: 'LeetCode/SQL timed sets', details: 'Do a final timed set of LeetCode/SQL questions.' },
      { day: 44, title: 'Offer negotiation research', details: 'Read about offer negotiation strategies. List your must-haves.' },
      { day: 45, title: 'Mock interview (panel style)', details: 'Do a panel-style mock interview (multiple interviewers).' },
      { day: 46, title: 'Project/STAR stories polish', details: 'Polish your STAR stories. Practice concise, confident delivery.' },
      { day: 47, title: 'System design (AI/data focus)', details: 'Design a system with a focus on AI/data.' },
      { day: 48, title: 'Apply to 5 jobs', details: 'Apply to 5 jobs. Track responses.' },
      { day: 49, title: 'Rest, reflect', details: 'Take a break. Reflect on your journey so far.' },
    ],
  },
  {
    week: 8,
    focus: 'Interviews & Negotiation',
    summary: 'Focus on interviews, negotiation, and next steps. Celebrate your progress and plan for the future.',
    days: [
      { day: 50, title: 'Final resume/LinkedIn check', details: 'Do a final review of your resume and LinkedIn.' },
      { day: 51, title: 'Interview rounds (schedule, prep)', details: 'Prepare for scheduled interviews. Review company research and questions.' },
      { day: 52, title: 'Mock interview (choose type)', details: 'Do a mock interview in your weakest area.' },
      { day: 53, title: 'Offer negotiation practice', details: 'Practice negotiating an offer with a friend or mentor.' },
      { day: 54, title: 'Thank you notes, follow-ups', details: 'Send thank you notes and follow up with interviewers.' },
      { day: 55, title: 'Rest, celebrate progress!', details: 'Take a break. Celebrate your hard work and progress.' },
      { day: 56, title: 'Plan next steps', details: 'Reflect on your journey. Set new goals for the next phase.' },
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div className="section-card">
      <h2 className="section-title">8-Week Interview Roadmap (Detailed)</h2>
      {roadmap.map(week => (
        <div key={week.week} className="card" style={{marginBottom: '2rem'}}>
          <h3 style={{color:'#4f46e5', marginBottom:'0.5rem'}}>Week {week.week}: {week.focus}</h3>
          <p style={{fontStyle:'italic', color:'#555', marginBottom:'0.7rem'}}>{week.summary}</p>
          <ul style={{marginLeft:'1.2rem'}}>
            {week.days.map((d, i) => (
              <li key={i} style={{marginBottom:'0.7rem'}}>
                <b>Day {d.day}: {d.title}</b><br/>
                <span style={{color:'#444'}}>{d.details}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
