import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema } from "@/lib/seo/schemas";
import { format } from "date-fns";
import { Calendar, Clock, ChevronRight, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  
  const { data: blog } = await supabase
    .from("ai_blogs")
    .select("meta_title, meta_description, focus_keyword, tags")
    .eq("slug", slug)
    .single();

  if (!blog) return generatePageMetadata({ title: "Not Found" });

  return generatePageMetadata({
    title: blog.meta_title,
    description: blog.meta_description,
    path: `/blogs/${slug}`,
    keywords: [blog.focus_keyword, ...(blog.tags || [])],
  });
}

export async function generateStaticParams() {
  const { data: blogs } = await supabase.from("ai_blogs").select("slug").eq("status", "published");
  return (blogs || []).map((blog) => ({ slug: blog.slug }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  
  const { data: blog } = await supabase
    .from("ai_blogs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!blog) {
    notFound();
  }

  // Use the existing schema generator for Article
  const schema = articleSchema({
    title: blog.title,
    description: blog.meta_description || blog.excerpt,
    slug: blog.slug,
    publishedAt: blog.created_at,
    modifiedAt: blog.updated_at,
    authorName: "XYLO Esports",
    authorUrl: "https://xyloesports.in",
    category: blog.category,
    tags: blog.tags,
    readingTime: blog.reading_time,
  });

  return (
    <article className="min-h-screen bg-[#0A0A0A] relative">
      <JsonLd schema={schema} id={`blog-${blog.id}`} />

      {/* Hero Header */}
      <header className="relative py-20 lg:py-32 border-b border-white/10 overflow-hidden">
        {/* Custom Winner Winner Chicken Dinner Background */}
        <div 
          className="absolute inset-0 z-0 bg-[url('/images/chicken-dinner-bg.png')] bg-cover bg-center bg-no-repeat opacity-40 bg-fixed"
        />
        {/* Custom Golden Mist Animation overlay */}
        <div className="absolute inset-0 z-0 bg-[var(--theme-primary)]/10 animate-golden-mist mix-blend-overlay pointer-events-none" />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-tactical-black/80 to-[#0A0A0A]/95" />

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 uppercase tracking-wider font-semibold">
            <Link href="/" className="hover:text-[var(--theme-primary)] transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blogs" className="hover:text-[var(--theme-primary)] transition-colors">Blogs</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[var(--theme-primary)]">{blog.category}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight uppercase italic tracking-wide">
            {blog.title}
          </h1>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl">
            {blog.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--theme-primary)]" />
              <span>{format(new Date(blog.created_at), "MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--theme-primary)]" />
              <span>{blog.reading_time} min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div 
          className="prose prose-invert prose-lg max-w-none 
          prose-h2:text-3xl prose-h2:font-bold prose-h2:text-[var(--theme-primary)] prose-h2:mt-12 prose-h2:mb-6 prose-h2:uppercase prose-h2:tracking-wide
          prose-h3:text-2xl prose-h3:text-white prose-h3:mt-8 prose-h3:mb-4
          prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
          prose-ul:text-gray-300 prose-ul:mb-6 prose-li:mb-2
          prose-ol:text-gray-300 prose-ol:mb-6 prose-li:mb-2
          prose-strong:text-white prose-strong:font-bold"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* FAQs */}
        {blog.faq && blog.faq.length > 0 && (
          <div className="mt-16 pt-12 border-t border-white/10">
            <h2 className="text-3xl font-bold text-white mb-8 uppercase tracking-wide">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {blog.faq.map((item: any, i: number) => (
                <div key={i} className="bg-[var(--theme-bg)]/50 p-6 rounded-lg border border-white/5">
                  <h3 className="text-xl font-bold text-[var(--theme-primary)] mb-3">{item.question}</h3>
                  <p className="text-gray-300">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conclusion & CTA */}
        <div className="mt-16 bg-gradient-to-r from-tactical-black to-[#1a1a1a] p-8 rounded-2xl border border-[var(--theme-primary)]/20">
          <h2 className="text-2xl font-bold text-white mb-4">Conclusion</h2>
          <p className="text-gray-300 mb-8">{blog.conclusion || "Thanks for reading! Stay tuned for more updates."}</p>

          <div className="text-center">
            <p className="text-xl font-bold text-[var(--theme-primary)] mb-6">
              {blog.cta || "Think you have what it takes to be a BGMI champion? Register your squad today on XYLO Esports!"}
            </p>
            <Link href="/tournaments">
              <Button size="lg" className="bg-[var(--theme-primary)] text-black hover:brightness-110 font-bold px-8 py-6 text-lg uppercase tracking-wider">
                Start Playing Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-3">
            {blog.tags.map((tag: string) => (
              <span key={tag} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 text-gray-400 text-sm border border-white/10">
                <Tag className="w-3.5 h-3.5" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
