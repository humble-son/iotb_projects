'use client'

import { ArrowUpRight, GitBranch, Link, Mail, Menu, X } from 'lucide-react'
import { useState } from 'react'

const projects = [
  { number: '01', title: 'Northstar', type: 'Product design · 2024', description: 'A calmer command center for teams doing their best work.', tone: 'bg-[#d8e7e2]', accent: 'bg-[#a7c8bd]' },
  { number: '02', title: 'Morrow Studio', type: 'Brand identity · 2023', description: 'A flexible identity for a new kind of creative practice.', tone: 'bg-[#eee4d2]', accent: 'bg-[#d9bd8c]' },
  { number: '03', title: 'Field Notes', type: 'Editorial system · 2023', description: 'Making complex ideas feel simple, useful, and human.', tone: 'bg-[#e0e1ed]', accent: 'bg-[#b8bad6]' },
]

const skills = ['Product strategy', 'Art direction', 'Interaction design', 'Prototyping', 'Design systems', 'Creative development']

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a href="#top" className="font-mono text-sm font-semibold tracking-[-0.04em]">ALEX / MORGAN</a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex" aria-label="Main navigation">
          <a className="transition-colors hover:text-foreground" href="#work">Work</a>
          <a className="transition-colors hover:text-foreground" href="#about">About</a>
          <a className="transition-colors hover:text-foreground" href="#contact">Contact</a>
        </nav>
        <button className="rounded-full p-2 md:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>
      {menuOpen && <nav className="flex flex-col gap-4 border-y border-border px-6 py-5 text-sm md:hidden" aria-label="Mobile navigation"><a href="#work" onClick={() => setMenuOpen(false)}>Work</a><a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></nav>}

      <section id="top" className="mx-auto max-w-7xl px-6 pb-28 pt-24 lg:px-10 lg:pb-40 lg:pt-36">
        <p className="mb-8 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Independent designer & developer · New York / Remote</p>
        <h1 className="max-w-5xl text-balance text-[clamp(3.5rem,9vw,8.5rem)] font-medium leading-[0.9] tracking-[-0.08em]">I make useful things <span className="text-muted-foreground">feel inevitable.</span></h1>
        <div className="mt-14 flex max-w-2xl flex-col justify-between gap-8 border-t border-border pt-6 sm:flex-row sm:items-end">
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground">I&apos;m Alex, a multidisciplinary designer focused on thoughtful digital products, identities, and the spaces between them.</p>
          <a href="#work" className="group flex shrink-0 items-center gap-2 text-sm font-medium">See selected work <ArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" /></a>
        </div>
      </section>

      <section id="work" className="mx-auto max-w-7xl scroll-mt-8 px-6 lg:px-10">
        <div className="mb-10 flex items-end justify-between border-b border-border pb-4"><p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Selected work</p><p className="font-mono text-xs text-muted-foreground">(03)</p></div>
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-6">
          {projects.map((project) => <article key={project.number} className="group"><div className={`relative mb-5 aspect-[1.18] overflow-hidden rounded-sm ${project.tone}`}><div className={`absolute left-[12%] top-[15%] h-[70%] w-[76%] rounded-sm shadow-[0_18px_45px_rgba(30,35,30,0.12)] ${project.accent} transition-transform duration-500 group-hover:scale-[1.03]`}><div className="absolute inset-[8%] border border-black/10"><div className="absolute left-[12%] top-[18%] h-2 w-2/3 bg-black/20" /><div className="absolute left-[12%] top-[30%] h-1 w-1/2 bg-black/10" /><div className="absolute bottom-[15%] left-[12%] h-1 w-1/3 bg-black/10" /></div></div></div><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-medium tracking-[-0.04em]">{project.title}</h2><p className="mt-1 text-sm text-muted-foreground">{project.description}</p></div><span className="font-mono text-xs text-muted-foreground">{project.number}</span></div><p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{project.type}</p></article>)}
        </div>
      </section>

      <section id="about" className="mx-auto grid max-w-7xl scroll-mt-8 gap-12 px-6 py-32 lg:grid-cols-[1fr_2fr] lg:px-10 lg:py-44"><p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">About / 01</p><div><p className="max-w-3xl text-3xl leading-tight tracking-[-0.05em] sm:text-5xl">Good work is a conversation between clarity and character. I help ambitious teams find the right words, shapes, and systems to move forward.</p><div className="mt-16 grid gap-10 border-t border-border pt-6 sm:grid-cols-2"><div><p className="mb-5 text-sm text-muted-foreground">What I do</p><ul className="flex flex-col gap-2 text-sm">{skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></div><div><p className="mb-5 text-sm text-muted-foreground">Currently</p><p className="max-w-xs text-sm leading-relaxed text-muted-foreground">Available for select freelance projects and collaborations with teams building a more considered future.</p></div></div></div></section>

      <section id="contact" className="mx-auto max-w-7xl scroll-mt-8 border-t border-border px-6 py-24 lg:px-10 lg:py-32"><div className="grid gap-10 lg:grid-cols-[1fr_2fr]"><p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Contact / 02</p><div><h2 className="max-w-3xl text-5xl leading-[0.95] tracking-[-0.07em] sm:text-7xl">Have a good problem? <span className="text-muted-foreground">Let&apos;s talk.</span></h2><a href="mailto:hello@example.com" className="group mt-10 inline-flex items-center gap-2 border-b border-foreground pb-2 text-sm font-medium">hello@example.com <ArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" /></a></div></div></section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-5 border-t border-border px-6 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10"><p>© 2025 Alex Morgan. Placeholder portfolio.</p><div className="flex items-center gap-5"><a href="#top" className="hover:text-foreground">Back to top</a><a href="https://github.com" aria-label="GitHub"><GitBranch aria-hidden="true" /></a><a href="https://linkedin.com" aria-label="LinkedIn"><Link aria-hidden="true" /></a><a href="mailto:hello@example.com" aria-label="Email"><Mail aria-hidden="true" /></a></div></footer>
    </main>
  )
}
