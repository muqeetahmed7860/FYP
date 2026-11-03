const fs=require('fs');
function edit(file,from,to){const s=fs.readFileSync(file,'utf8');if(!s.includes(from))throw new Error('Patch target missing: '+file);fs.writeFileSync(file,s.replace(from,to));}
edit('src/IntegratedApp.tsx','catch{/* Optional storage. */}}/>','catch{/* Optional storage. */}}}/>');
edit('src/main.tsx',"import './experience.css';\nimport './experience.css';","import './experience.css';");
edit('eslint.config.mjs',"ignores:['dist/**'","ignores:['.work/**','public/appearance.js','dist/**'");
