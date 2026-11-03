import { profile, honors } from '../src/profile.ts'
import { projects } from '../src/projects.ts'
import { publications } from '../src/publications.ts'
import { community } from '../src/community.ts'

export const siteUrl = 'https://sidant-chaturbedi.vercel.app/'
const title = `${profile.name} | AI Researcher & Full-Stack Developer`
const description = 'Explore Sidant Chaturbedi’s portfolio: AI research, satellite imagery, full-stack projects and community work from Kathmandu, Nepal. IOAI bronze medalist.'
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const link = (url, label) => `<a href="${escape(url)}">${escape(label)} ↗</a>`

export function metadata(isProfile = false) {
  const url = isProfile ? `${siteUrl}profile` : siteUrl
  const pageTitle = isProfile ? `${profile.name} — Profile, Research & Projects` : title
  const person = {
    '@type':'Person', '@id':`${siteUrl}#person`, name:profile.name, url:siteUrl,
    image:`${siteUrl}art/sidant-portrait.jpg`, jobTitle:'AI researcher and full-stack developer',
    description, homeLocation:{'@type':'Place',name:'Kathmandu, Nepal'},
    sameAs:[profile.github,profile.linkedin],
    knowsAbout:['Artificial intelligence','Remote sensing','Graph learning','Full-stack development'],
  }
  const schema = {'@context':'https://schema.org','@graph':[
    {'@type':'WebSite','@id':`${siteUrl}#website`,url:siteUrl,name:profile.name,alternateName:'Sidant Chaturbedi Portfolio',publisher:{'@id':person['@id']}},
    person,
    {'@type':'ProfilePage','@id':`${url}#webpage`,url,name:pageTitle,description,inLanguage:'en',isPartOf:{'@id':`${siteUrl}#website`},mainEntity:{'@id':person['@id']}},
  ]}
  return `<title>${escape(pageTitle)}</title>
<meta name="description" content="${escape(description)}">
<meta name="author" content="${escape(profile.name)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">
<link rel="icon" type="image/png" sizes="96x96" href="/brand/favicon-96.png">
<link rel="icon" type="image/png" sizes="32x32" href="/brand/favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/brand/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="stylesheet" href="/profile.css">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${escape(profile.name)}">
<meta property="og:title" content="${escape(pageTitle)}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="en_US">
<meta property="og:image" content="${siteUrl}brand/logo-512.png">
<meta property="og:image:width" content="512">
<meta property="og:image:height" content="512">
<meta property="og:image:alt" content="Sidant Chaturbedi’s botanical S monogram, with a leaf and golden sun">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${escape(pageTitle)}">
<meta name="twitter:description" content="${escape(description)}">
<meta name="twitter:image" content="${siteUrl}brand/logo-512.png">
<meta name="twitter:image:alt" content="Sidant Chaturbedi’s botanical S logo">
<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`
}

// The same public content is available to every visitor, without JavaScript or bot detection.
// The homepage progressively replaces this reading view with the animated journey.
export function profileContent(isProfile = false) {
  return `<main class="profile-page">
<header class="profile-masthead"><a href="/" aria-label="Sidant Chaturbedi home"><img src="/brand/icon-192.png" width="54" height="54" alt=""></a><span>A LITTLE WORLD OF CURIOSITY</span>${link(isProfile ? '/' : '/profile',isProfile ? 'Enter the painted journey' : 'Read the full profile')}</header>
<nav class="profile-section-nav" aria-label="Profile sections"><a href="#research">Research</a><a href="#projects">Projects</a><a href="#honors">Honors</a><a href="#community">Community</a><a href="#contact">Contact</a></nav>
<section class="profile-hero"><div><p class="profile-eyebrow">KATHMANDU, NEPAL</p><h1>Sidant<br><em>Chaturbedi.</em></h1><p class="profile-role">AI researcher. Full-stack developer.</p><p>I explore satellite imagery, graph learning and Nepal’s changing landscapes, and build thoughtful tools for learning and everyday life.</p><p class="profile-proof">Nepal’s first IOAI bronze medal · 2026</p></div><figure><img src="/art/sidant-portrait.jpg" alt="Sidant Chaturbedi" width="1172" height="1342"><figcaption>A face behind the curiosity.</figcaption></figure></section>
<section id="research"><p class="profile-eyebrow">01 / READING THE WORLD</p><h2>Research & publications</h2>${publications.map(p=>`<article><p class="profile-label">${escape(p.status)}</p><h3>${escape(p.title)}</h3><p>${escape(p.summary)}</p><p>${escape(p.venue)} · ${escape(p.authors)}</p><p>${escape(p.detail)}</p><div class="profile-links">${p.links.map(l=>link(l.url,l.label)).join(' ')}</div></article>`).join('')}</section>
<section id="projects"><p class="profile-eyebrow">02 / IDEAS IN FULL BLOOM</p><h2>Selected projects</h2><div class="profile-grid">${projects.map(p=>`<article${p.slug==='solvescript'?' class="profile-featured"':''}><span class="profile-label">${p.slug==='solvescript'?'FEATURED PROJECT · ':''}${escape(p.kind)}</span><h3>${escape(p.name)}</h3><p>${escape(p.description)}</p><p class="profile-stack">${escape(p.stack.join(' · '))}</p><div class="profile-links">${p.demo?link(p.demo,'Visit project'):''} ${p.url?link(p.url,p.linkLabel||'Repository'):''}</div></article>`).join('')}</div></section>
<section id="honors"><p class="profile-eyebrow">03 / MOMENTS I CARRY</p><h2>Honors & education</h2><div class="profile-grid">${honors.map(h=>`<article><span class="profile-label">${escape(h.short)} · ${escape(h.year)}</span><h3>${escape(h.distinction)}</h3><p>${escape(h.detail)}</p></article>`).join('')}</div><div class="profile-education">${profile.education.map(e=>`<article><h3>${escape(e.school)}</h3><p>${escape(e.qualification)}</p><p>${escape(e.result)} · ${escape(e.detail)}</p></article>`).join('')}</div></section>
<section id="community"><p class="profile-eyebrow">04 / GROWING TOGETHER</p><h2>Leadership & community</h2><div class="profile-grid">${community.map(c=>`<article><span class="profile-label">${escape(c.label)}</span><h3>${escape(c.role)}</h3><p>${escape(c.text)}</p><p>${escape(c.note)}</p>${c.link?link(c.link,c.linkLabel):''}</article>`).join('')}</div></section>
<footer id="contact"><img src="/brand/icon-192.png" width="64" height="64" alt="Botanical S monogram"><h2>Let’s make something good happen.</h2><p>Research, collaboration, or a wonderfully unexpected hello.</p><div class="profile-links">${link(`mailto:${profile.email}`,profile.email)} ${link(profile.github,'GitHub')} ${link(profile.linkedin,'LinkedIn')}</div><p>${link('/','Wander through my portfolio')}</p></footer>
</main>`
}

export const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl}</loc></url><url><loc>${siteUrl}profile</loc></url></urlset>\n`
export const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`
const profileHtml = () => `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#243f35">${metadata(true)}</head><body class="profile-document">${profileContent(true)}</body></html>`

export function portfolioSeo() {
  return {
    name:'portfolio-seo',
    transformIndexHtml:{order:'pre',handler:html=>html.replace('<!--seo-head-->',metadata()).replace('<!--seo-content-->',profileContent())},
    generateBundle(){
      for(const [fileName,source] of [['profile.html',profileHtml()],['sitemap.xml',sitemap],['robots.txt',robots]]) this.emitFile({type:'asset',fileName,source})
    },
    configureServer(server){
      server.middlewares.use((req,res,next)=>{
        const path=req.url?.split('?')[0]
        const entries={'/profile':['text/html',profileHtml],'/profile/':['text/html',profileHtml],'/sitemap.xml':['application/xml',()=>sitemap],'/robots.txt':['text/plain',()=>robots]}
        const entry=entries[path]
        if(!entry)return next()
        res.setHeader('Content-Type',`${entry[0]}; charset=utf-8`);res.end(entry[1]())
      })
    },
  }
}
