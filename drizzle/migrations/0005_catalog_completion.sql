insert into public.roadmaps (slug,title,description,difficulty,icon,is_published) values
('java','Java','Build robust object-oriented applications and backend services.','beginner','JV',true),
('typescript','TypeScript','Write safer frontend and backend applications with types.','intermediate','TS',true),
('nextjs','Next.js','Ship full-stack React products with the App Router.','intermediate','NX',true),
('nodejs','Node.js','Create reliable APIs, services, and real-time backends.','intermediate','ND',true),
('cpp','C++','Learn systems fundamentals and performance-aware programming.','beginner','C++',true),
('dsa','Data Structures & Algorithms','Practice problem solving patterns used in technical interviews.','intermediate','DS',true),
('git','Git & GitHub','Collaborate confidently with version control and pull requests.','beginner','GT',true),
('docker','Docker','Package and run applications consistently anywhere.','intermediate','DK',true),
('ai','AI Foundations','Build practical AI-assisted developer workflows.','beginner','AI',true),
('machine-learning','Machine Learning','Train, evaluate, and ship responsible ML models.','advanced','ML',true),
('cybersecurity','Cybersecurity','Build secure applications and understand defensive engineering.','intermediate','CS',true),
('cloud','Cloud Engineering','Deploy scalable systems with cloud-native foundations.','intermediate','CL',true)
on conflict (slug) do update set title=excluded.title,description=excluded.description,difficulty=excluded.difficulty,icon=excluded.icon,is_published=true;

insert into public.levels (roadmap_id,title,description,xp_reward,position)
select r.id, v.title, v.description, v.xp_reward, v.position from public.roadmaps r cross join (values
 ('Foundations','Learn the core concepts through focused hands-on missions.',100,1),
 ('Applied practice','Use the fundamentals to solve a practical product problem.',160,2),
 ('Ship a project','Deliver a documented, deployable project for your portfolio.',300,3)
) as v(title,description,xp_reward,position)
where r.slug in ('java','typescript','nextjs','nodejs','cpp','dsa','git','docker','ai','machine-learning','cybersecurity','cloud','python','react','sql')
on conflict (roadmap_id,position) do nothing;
