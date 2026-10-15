import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLang, type Lang } from "@/lib/i18n/config";
import { getDict } from "@/lib/dict";
import { getPublishedPosts } from "@/lib/store";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { PostCard } from "@/components/home/sections";

export const revalidate = 300;

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = params.lang as Lang;
  if (!isLang(lang)) return {};
  const d = getDict(lang);
  return pageMeta({ lang, path: "/blog", title: d.blog.title, description: d.blog.subtitle });
}

export default function BlogPage({ params, searchParams }: { params: { lang: string }; searchParams: { cat?: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const d = getDict(lang);
  const all = getPublishedPosts();
  const posts = searchParams.cat ? all.filter((p) => p.category === searchParams.cat) : all;
  const cats = Object.entries(d.blog.cats);
  const chip = (active: boolean) => `rounded-full border px-4 py-2 text-sm font-medium transition ${active ? "border-forest bg-forest text-ivory" : "border-forest/20 text-forest hover:border-forest"}`;
  return (
    <>
      <PageHero eyebrow={d.nav.blog} title={d.blog.title} subtitle={d.blog.subtitle} scene="una" />
      <section className="section !pt-10">
        <div className="container-x">
          <p className="mb-6 text-xs text-charcoal-400">{d.blog.sampleNote}</p>
          <nav aria-label={d.blog.title} className="flex flex-wrap gap-2">
            <Link href={`/${lang}/blog`} className={chip(!searchParams.cat)}>{d.common.all}</Link>
            {cats.map(([k, label]) => <Link key={k} href={`/${lang}/blog?cat=${k}`} className={chip(searchParams.cat === k)} aria-current={searchParams.cat === k ? "true" : undefined}>{label}</Link>)}
          </nav>
          {posts.length ? <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map((p) => <PostCard key={p.id} post={p} lang={lang} d={d} />)}</div>
            : <p className="mt-10 rounded-3xl border border-dashed border-forest/25 p-12 text-center text-charcoal-500">{d.common.noResults}</p>}
        </div>
      </section>
    </>
  );
}
