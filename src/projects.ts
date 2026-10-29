export type Project = { name: string; kind: string; subtitle: string; description: string; stack: string[]; idea: string; slug: string; status: string; url?: string; demo?: string; linkLabel?: string; repo?: string; fork?: boolean }
const featuredProjects: Project[] = [
  { name: 'Sentinel-1 SAR', kind: 'REMOTE SENSING', subtitle: 'Reading the roads from orbit.', description: 'Satellite radar time series for road vulnerability and landslide precursor research in monsoon-affected Nepal.', stack: ['Python', 'Sentinel-1', 'QGIS'], idea: 'Research code and analysis notebooks.', repo: 'Sentinal-1-SAR-framework', slug: 'sentinel-1', status: 'RESEARCH · CODE AVAILABLE', url: 'https://github.com/Gun4shot/Sentinal-1-SAR-framework', linkLabel: 'Research code' },
  { name: 'SolveScript', kind: 'EDUCATION', subtitle: 'Less paper chasing. More practice.', description: 'A Cambridge A-Level practice studio with annotated PDFs, timed exams, marking-scheme feedback, and progress tracking.', stack: ['React', 'Express', 'MongoDB'], idea: 'Built to make past-paper practice easier.', demo: 'https://solvescript.onrender.com/', repo: 'SolveScript', slug: 'solvescript', status: 'OPEN-SOURCE APPLICATION', url: 'https://github.com/Gun4shot/SolveScript', linkLabel: 'View repository' },
  { name: 'Road Graphs', kind: 'GRAPH LEARNING', subtitle: 'Connections reveal the surface.', description: 'Graph-attention road classification using 131,188 satellite samples from Nepal. Manuscript submitted to IEEE JSTARS.', stack: ['PyTorch', 'GAT', 'Feature fusion'], idea: 'Combining visual features with graph structure.', slug: 'road-graphs', status: 'SUBMITTED MANUSCRIPT' },
  { name: 'WhiteBook', kind: 'LEARNING TOOLS', subtitle: 'A little more prepared.', description: 'Digital SAT Reading & Writing practice with timed sessions, annotations, saved progress, and answer explanations.', stack: ['React', 'TypeScript', 'Vite'], idea: 'An independent SAT practice application.', demo: 'https://whitebook.onrender.com/', repo: 'Whitebook', slug: 'whitebook', status: 'OPEN-SOURCE APPLICATION', url: 'https://github.com/Gun4shot/Whitebook', linkLabel: 'View repository' },
  { name: 'Himalayan Waters', kind: 'EARTH OBSERVATION', subtitle: 'Following a changing landscape.', description: 'Collaborative satellite research on Himalayan glacial lakes, outburst floods, and river disturbance. Work in progress.', stack: ['Remote sensing', 'GIS'], idea: 'Investigating environmental hazards from satellite observations.', slug: 'himalayan-waters', status: 'ONGOING RESEARCH' },
  { name: 'Handtracker', kind: 'INTERACTIVE 3D', subtitle: 'A different way to explore.', description: 'An experiment in controlling a 3D model with hand gestures. Pinch to zoom in; make a fist to zoom out.', stack: ['Web', 'Hand tracking', '3D'], idea: 'Gesture-driven interaction with GLB models.', repo: 'handtracker', slug: 'handtracker', status: 'EXPERIMENT', url: 'https://github.com/Gun4shot/handtracker', linkLabel: 'View repository' },
  { name: 'ML Field Notes', kind: 'MACHINE LEARNING', subtitle: 'Learning, one experiment at a time.', description: 'A public collection of machine-learning notebooks and study notes, documenting experiments along the way.', stack: ['Python', 'Jupyter'], idea: 'A learning archive, not a production system.', repo: 'ML_notebooks', slug: 'ml-notes', status: 'LEARNING ARCHIVE', url: 'https://github.com/Gun4shot/ML_notebooks', linkLabel: 'Explore notebooks' },
]

// Complete public GitHub inventory, checked 23 October 2026; forks are labeled.
const githubArchive: Project[] = [
  {
    "name": "Fraud Detection",
    "kind": "MACHINE LEARNING",
    "subtitle": "Credit-card fraud experiments with a Python application, notebook, and saved model.",
    "description": "Credit-card fraud experiments with a Python application, notebook, and saved model.",
    "stack": [
      "Python",
      "Jupyter"
    ],
    "idea": "Credit-card fraud experiments with a Python application, notebook, and saved model.",
    "slug": "creditcardfraudml",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/CreditcardfraudML",
    "linkLabel": "View repository",
    "repo": "CreditcardfraudML",
    "fork": false
  },
  {
    "name": "ALCC Website",
    "kind": "COMMUNITY",
    "subtitle": "A React frontend for the A-Level Computer Club, with projects, challenges, membership, and team pages.",
    "description": "A React frontend for the A-Level Computer Club, with projects, challenges, membership, and team pages.",
    "stack": [
      "React",
      "Vite"
    ],
    "idea": "A React frontend for the A-Level Computer Club, with projects, challenges, membership, and team pages.",
    "slug": "frontnendalcctest",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/frontnendalcctest",
    "linkLabel": "View repository",
    "repo": "frontnendalcctest",
    "fork": false
  },
  {
    "name": "FutureSelf.ID",
    "kind": "FORK",
    "subtitle": "A fork of CodeYatraNP’s early-stage community project for identity, habits, and long-term goals.",
    "description": "A fork of CodeYatraNP’s early-stage community project for identity, habits, and long-term goals.",
    "stack": [
      "Community project"
    ],
    "idea": "A fork of CodeYatraNP’s early-stage community project for identity, habits, and long-term goals.",
    "slug": "futureself.id",
    "status": "FORK · UPSTREAM CREDITED",
    "url": "https://github.com/Gun4shot/FutureSelf.ID",
    "linkLabel": "View fork",
    "repo": "FutureSelf.ID",
    "fork": true
  },
  {
    "name": "GitHub Profile",
    "kind": "PROFILE",
    "subtitle": "The source of my GitHub profile: a short introduction, interests, and developer links.",
    "description": "The source of my GitHub profile: a short introduction, interests, and developer links.",
    "stack": [
      "Markdown"
    ],
    "idea": "The source of my GitHub profile: a short introduction, interests, and developer links.",
    "slug": "gun4shot",
    "status": "PROFILE REPOSITORY",
    "url": "https://github.com/Gun4shot/Gun4shot",
    "linkLabel": "View repository",
    "repo": "Gun4shot",
    "fork": false
  },
  {
    "name": "Stories & Poems",
    "kind": "CREATIVE WEB",
    "subtitle": "A reading website with story chapters, poems, and author pages.",
    "description": "A reading website with story chapters, poems, and author pages.",
    "stack": [
      "HTML",
      "CSS"
    ],
    "idea": "A reading website with story chapters, poems, and author pages.",
    "slug": "gun4shot.github.io",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/Gun4shot.github.io",
    "linkLabel": "View repository",
    "repo": "Gun4shot.github.io",
    "fork": false
  },
  {
    "name": "Khulla Malpot",
    "kind": "WEB APPLICATION",
    "subtitle": "A React frontend with land-transfer, application tracking, and public-portal screens.",
    "description": "A React frontend with land-transfer, application tracking, and public-portal screens.",
    "stack": [
      "React",
      "JavaScript"
    ],
    "idea": "A React frontend with land-transfer, application tracking, and public-portal screens.",
    "slug": "khullamalpot",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/khullamalpot",
    "linkLabel": "View repository",
    "demo": "https://khullamalpot.vercel.app",
    "repo": "khullamalpot",
    "fork": false
  },
  {
    "name": "Meteor Madness",
    "kind": "SPACE EXPLORATION",
    "subtitle": "A React globe experiment with meteor artwork and interactive globe components.",
    "description": "A React globe experiment with meteor artwork and interactive globe components.",
    "stack": [
      "React",
      "JavaScript"
    ],
    "idea": "A React globe experiment with meteor artwork and interactive globe components.",
    "slug": "meteormadness",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/Meteormadness",
    "linkLabel": "View repository",
    "repo": "Meteormadness",
    "fork": false
  },
  {
    "name": "Movie App",
    "kind": "WEB APPLICATION",
    "subtitle": "A React movie browser with movie cards and a favorites collection.",
    "description": "A React movie browser with movie cards and a favorites collection.",
    "stack": [
      "React",
      "JavaScript"
    ],
    "idea": "A React movie browser with movie cards and a favorites collection.",
    "slug": "movieapp",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/MovieApp",
    "linkLabel": "View repository",
    "repo": "MovieApp",
    "fork": false
  },
  {
    "name": "Nidaan",
    "kind": "APPLIED AI",
    "subtitle": "An experimental medical AI interface combining chat, image analysis, and blood-data visualizations.",
    "description": "An experimental medical AI interface combining chat, image analysis, and blood-data visualizations.",
    "stack": [
      "Next.js",
      "Python",
      "React"
    ],
    "idea": "An experimental medical AI interface combining chat, image analysis, and blood-data visualizations.",
    "slug": "nidaan",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/Nidaan",
    "linkLabel": "View repository",
    "repo": "Nidaan",
    "fork": false
  },
  {
    "name": "Nidaan Lite",
    "kind": "APPLIED AI",
    "subtitle": "A companion medical AI codebase with chat, image classification, and blood analytics.",
    "description": "A companion medical AI codebase with chat, image classification, and blood analytics.",
    "stack": [
      "TypeScript",
      "Python"
    ],
    "idea": "A companion medical AI codebase with chat, image classification, and blood analytics.",
    "slug": "nidaan_lite",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/Nidaan_lite",
    "linkLabel": "View repository",
    "repo": "Nidaan_lite",
    "fork": false
  },
  {
    "name": "People Recognizer",
    "kind": "COMPUTER VISION",
    "subtitle": "Python experiments in object detection, video counting, and gesture controls.",
    "description": "Python experiments in object detection, video counting, and gesture controls.",
    "stack": [
      "Python",
      "YOLO",
      "OpenCV"
    ],
    "idea": "Python experiments in object detection, video counting, and gesture controls.",
    "slug": "people_recognizer",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/people_recognizer",
    "linkLabel": "View repository",
    "repo": "people_recognizer",
    "fork": false
  },
  {
    "name": "Portfolio Archive",
    "kind": "CREATIVE WEB",
    "subtitle": "An earlier personal website collecting my projects, education, and experiments.",
    "description": "An earlier personal website collecting my projects, education, and experiments.",
    "stack": [
      "HTML",
      "CSS",
      "JavaScript"
    ],
    "idea": "An earlier personal website collecting my projects, education, and experiments.",
    "slug": "portfolio",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/portfolio",
    "linkLabel": "View repository",
    "repo": "portfolio",
    "fork": false
  },
  {
    "name": "README Generator",
    "kind": "FORK",
    "subtitle": "A fork of the open-source GitHub profile README generator by maurodesouza.",
    "description": "A fork of the open-source GitHub profile README generator by maurodesouza.",
    "stack": [
      "Open source"
    ],
    "idea": "A fork of the open-source GitHub profile README generator by maurodesouza.",
    "slug": "profile-readme-generator",
    "status": "FORK · UPSTREAM CREDITED",
    "url": "https://github.com/Gun4shot/profile-readme-generator",
    "linkLabel": "View fork",
    "repo": "profile-readme-generator",
    "fork": true
  },
  {
    "name": "Python Calculator",
    "kind": "EXPERIMENT",
    "subtitle": "A small Python calculator experiment. Source is available in calcu.py.",
    "description": "A small Python calculator experiment. Source is available in calcu.py.",
    "stack": [
      "Python"
    ],
    "idea": "A small Python calculator experiment. Source is available in calcu.py.",
    "slug": "pythonaicalculator",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/pythonAICalculator",
    "linkLabel": "View repository",
    "repo": "pythonAICalculator",
    "fork": false
  },
  {
    "name": "School Katha",
    "kind": "CREATIVE WEB",
    "subtitle": "A lightweight story-reading website with chapter pages and reading styles.",
    "description": "A lightweight story-reading website with chapter pages and reading styles.",
    "stack": [
      "HTML",
      "CSS"
    ],
    "idea": "A lightweight story-reading website with chapter pages and reading styles.",
    "slug": "schoolkatha.github.io",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/schoolkatha.github.io",
    "linkLabel": "View repository",
    "repo": "schoolkatha.github.io",
    "fork": false
  },
  {
    "name": "Schwarzschild",
    "kind": "REPOSITORY",
    "subtitle": "An empty public repository reserved for an experiment; no implementation is published here.",
    "description": "An empty public repository reserved for an experiment; no implementation is published here.",
    "stack": [
      "Repository"
    ],
    "idea": "An empty public repository reserved for an experiment; no implementation is published here.",
    "slug": "schwarzschild",
    "status": "EMPTY REPOSITORY",
    "url": "https://github.com/Gun4shot/schwarzschild",
    "linkLabel": "View repository",
    "repo": "schwarzschild",
    "fork": false
  },
  {
    "name": "Schwarzschild Final",
    "kind": "SPACE EXPLORATION",
    "subtitle": "An asteroid exploration application with orbit views, impact-analysis screens, and a backend.",
    "description": "An asteroid exploration application with orbit views, impact-analysis screens, and a backend.",
    "stack": [
      "React",
      "JavaScript",
      "Node.js"
    ],
    "idea": "An asteroid exploration application with orbit views, impact-analysis screens, and a backend.",
    "slug": "schwarzschildfinal",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/schwarzschildfinal",
    "linkLabel": "View repository",
    "demo": "https://schwarzschildfinal.vercel.app",
    "repo": "schwarzschildfinal",
    "fork": false
  },
  {
    "name": "Sidant — Early Site",
    "kind": "CREATIVE WEB",
    "subtitle": "An early personal website with custom page styles and JavaScript interactions.",
    "description": "An early personal website with custom page styles and JavaScript interactions.",
    "stack": [
      "HTML",
      "CSS",
      "JavaScript"
    ],
    "idea": "An early personal website with custom page styles and JavaScript interactions.",
    "slug": "sidant",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/Sidant",
    "linkLabel": "View repository",
    "repo": "Sidant",
    "fork": false
  },
  {
    "name": "Sidant Pages",
    "kind": "CREATIVE WEB",
    "subtitle": "A GitHub Pages codebase from an earlier version of my personal website.",
    "description": "A GitHub Pages codebase from an earlier version of my personal website.",
    "stack": [
      "HTML",
      "CSS"
    ],
    "idea": "A GitHub Pages codebase from an earlier version of my personal website.",
    "slug": "sidant.github.io",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/Sidant.github.io",
    "linkLabel": "View repository",
    "repo": "Sidant.github.io",
    "fork": false
  },
  {
    "name": "Snake Game",
    "kind": "BROWSER GAME",
    "subtitle": "A browser-based Snake game built with HTML, CSS, and JavaScript.",
    "description": "A browser-based Snake game built with HTML, CSS, and JavaScript.",
    "stack": [
      "JavaScript",
      "HTML",
      "CSS"
    ],
    "idea": "A browser-based Snake game built with HTML, CSS, and JavaScript.",
    "slug": "snakegame",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/snakeGame",
    "linkLabel": "View repository",
    "repo": "snakeGame",
    "fork": false
  },
  {
    "name": "TapTapbird",
    "kind": "BROWSER GAME",
    "subtitle": "A bird-and-pipes browser game with illustrated scenery and JavaScript controls.",
    "description": "A bird-and-pipes browser game with illustrated scenery and JavaScript controls.",
    "stack": [
      "JavaScript",
      "HTML",
      "CSS"
    ],
    "idea": "A bird-and-pipes browser game with illustrated scenery and JavaScript controls.",
    "slug": "taptapbird",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/TapTapbird",
    "linkLabel": "View repository",
    "repo": "TapTapbird",
    "fork": false
  },
  {
    "name": "Tic Tac Toe",
    "kind": "BROWSER GAME",
    "subtitle": "A browser implementation of the classic noughts-and-crosses game.",
    "description": "A browser implementation of the classic noughts-and-crosses game.",
    "stack": [
      "JavaScript",
      "HTML",
      "CSS"
    ],
    "idea": "A browser implementation of the classic noughts-and-crosses game.",
    "slug": "tictactoe",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/TicTacToe",
    "linkLabel": "View repository",
    "repo": "TicTacToe",
    "fork": false
  },
  {
    "name": "To-Do List",
    "kind": "WEB APPLICATION",
    "subtitle": "A small task-list application built with HTML, CSS, and JavaScript.",
    "description": "A small task-list application built with HTML, CSS, and JavaScript.",
    "stack": [
      "JavaScript",
      "HTML",
      "CSS"
    ],
    "idea": "A small task-list application built with HTML, CSS, and JavaScript.",
    "slug": "todolist",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/todolist",
    "linkLabel": "View repository",
    "repo": "todolist",
    "fork": false
  },
  {
    "name": "Valentine",
    "kind": "CREATIVE WEB",
    "subtitle": "A playful illustrated website with branching response pages.",
    "description": "A playful illustrated website with branching response pages.",
    "stack": [
      "HTML",
      "CSS",
      "JavaScript"
    ],
    "idea": "A playful illustrated website with branching response pages.",
    "slug": "valentine",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/Valentine",
    "linkLabel": "View repository",
    "repo": "Valentine",
    "fork": false
  },
  {
    "name": "Weather App",
    "kind": "PYTHON APPLICATION",
    "subtitle": "A Python weather application with its source and a packaged executable.",
    "description": "A Python weather application with its source and a packaged executable.",
    "stack": [
      "Python"
    ],
    "idea": "A Python weather application with its source and a packaged executable.",
    "slug": "weatherapp",
    "status": "PUBLIC REPOSITORY",
    "url": "https://github.com/Gun4shot/Weatherapp",
    "linkLabel": "View repository",
    "repo": "Weatherapp",
    "fork": false
  }
]

// Keep the verified inventory as source material; the journal is intentionally curated.
const catalog = [...featuredProjects, ...githubArchive]
const journalOrder = ['solvescript', 'whitebook', 'ml-notes', 'khullamalpot', 'nidaan', 'meteormadness', 'schwarzschildfinal', 'handtracker', 'people_recognizer', 'frontnendalcctest', 'creditcardfraudml', 'taptapbird', 'snakegame', 'tictactoe']
export const projects: Project[] = journalOrder.map(slug => {
  const project = catalog.find(p => p.slug === slug)
  if (!project) throw new Error(`Missing curated project: ${slug}`)
  return project
})
export const projectArtwork = projects.map(p => `projects/${p.slug}.jpg`)
