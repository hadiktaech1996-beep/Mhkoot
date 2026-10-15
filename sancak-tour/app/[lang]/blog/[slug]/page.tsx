import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isLang, tr, trList, LOCALES, type Lang } from "@/lib/i18n/config";
import { getDict } from "@/lib/dict";
import { getPostBySlug, getPublishedPosts, getPublishedTours } from "@/lib/store";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { TourCard } from "@/components/ui";

export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => getPublishedPosts().map((p) => ({ lang, slug: p.slug })));
}

export function generateMetadata({ params }: { params: { lang: string; slug: string } }): Metadata {
  const lang = params.lang as Lang;
  const post = isLang(lang) ? getPostBySlug(params.slug) : undefined;
  if (!post) return {};
  return pageMeta({ lang, path: `/blog/${post.slug}`, title: tr(post.title, lang), description: tr(post.excerpt, lang), type: "article" });
}

export default function PostPage({ params }: { params: { lang: string; slug: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const post = getPostBySlug(params.slug);
  if (!post) notFound();
  const d = getDict(lang);
  const tours = post.tourIds.map((id) => getPublishedTours().find((t) => t.id === id)).filter(Boolean) as ReturnType<typeof getPublishedTours>;
  const cat = d.blog.cats[post.category as keyof typeof d.blog.cats] || post.category;
  return (
    <article>
      <PageHero eyebrow={`${cat} · ${post.readMin} ${d.blog.min}`} title={tr(post.title, lang)} subtitle={tr(post.excerpt, lang)} scene={post.scene} image={post.imageUrl} />
      <div className="container-x max-w-3xl py-14">
        <Link href={`/${lang}/blog`} className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-forest hover:text-gold-700"><ArrowLeft size={16} className="flip-rtl" aria-hidden />{d.blog.back}</Link>
        <div className="prose-journal">{trList(post.body, lang).map((p, i) => <p key={i}>{p}</p>)}</div>
        <p className="mt-6 rounded-2xl bg-gold/20 p-4 text-sm text-forest">{d.blog.sampleNote}</p>
      </div>
      {tours.length > 0 && (
        <section className="section bg-ivory-200/60"><div className="container-x">
          <h2 className="h-section">{d.blog.related}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{tours.map((t) => <TourCard key={t.id} tour={t} lang={lang} d={d} />)}</div>
        </div></section>
      )}
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: tr(post.title, lang), description: tr(post.excerpt, lang), datePublished: post.date, inLanguage: lang, author: { "@type": "Organization", name: "Sancak Tour" }, publisher: { "@type": "Organization", name: "Sancak Tour" }, mainEntityOfPage: `${SITE_URL}/${lang}/blog/${post.slug}` }} />
    </article>
  );
}
