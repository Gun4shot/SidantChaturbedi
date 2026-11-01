import assert from 'node:assert/strict'
import {readFile,access} from 'node:fs/promises'

const origin='https://sidant-chaturbedi.vercel.app/'
for(const [file,canonical] of [['index.html',origin],['profile.html',`${origin}profile`]]) {
  const html=await readFile(`dist/${file}`,'utf8')
  assert.match(html,/<title>Sidant Chaturbedi/)
  assert.ok(html.includes(`<link rel="canonical" href="${canonical}">`))
  assert.equal((html.match(/<h1>/g)||[]).length,1)
  for(const text of ['Sidant','Chaturbedi','SolveScript','WhiteBook','Submitted manuscript','Ongoing research','doi.org/10.1080/19475705.2026.2719295']) assert.ok(html.includes(text),`${file}: public content present without JS: ${text}`)
  assert.ok(!html.includes('<!--seo-'))
  assert.ok(!html.includes('content="noindex'))
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
  const person=schema['@graph'].find(n=>n['@type']==='Person')
  assert.equal(person.name,'Sidant Chaturbedi')
  assert.deepEqual(person.sameAs,['https://github.com/gun4shot','https://www.linkedin.com/in/sidant-chaturbedi-9a7181321/'])
  assert.equal(schema['@graph'].find(n=>n['@type']==='ProfilePage').mainEntity['@id'],person['@id'])
  for(const [,ref] of html.matchAll(/(?:src|href)="(\/(?!\/)[^"#?]+)"/g)) {
    if(ref==='/')continue
    await access(`dist${ref==='/profile'?'/profile.html':ref}`)
  }
  if(file==='profile.html') assert.ok(!html.includes('type="module"'),'Reading page is fully usable without JavaScript')
}
const sitemap=await readFile('dist/sitemap.xml','utf8')
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]),[origin,`${origin}profile`])
const robots=await readFile('dist/robots.txt','utf8')
assert.ok(robots.includes(`Sitemap: ${origin}sitemap.xml`))
assert.ok(!robots.includes('Disallow: /'))
assert.match(await readFile('dist/404.html','utf8'),/name="robots" content="noindex"/)
console.log('SEO verified: public HTML, canonical URLs, identity schema, linked assets, sitemap, robots, and 404.');
