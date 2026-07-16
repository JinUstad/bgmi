import { generatePageMetadata } from "@/lib/seo/metadata";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Clock, Tag } from "lucide-react";

export const metadata = generatePageMetadata({
  title: "Blogs",
  description: "Read the latest BGMI tournament strategies, esports news, and gaming tips on the XYLO Esports blog.",
  path: "/blogs",
});

export const revalidate = 3600; // Revalidate every hour

export default async function BlogsIndexPage() {
  // Fetch up to 9 published blogs from Supabase
  const { data: blogs, error } = await supabase
    .from("ai_blogs")
    .select("id, title, slug, excerpt, category, reading_time, created_at, tags")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(9); // Exact requirement: show 9 blogs on the page

  return (
    <div className="relative min-h-screen">
      {/* Custom Winner Winner Chicken Dinner Background */}
      <div 
        className="absolute inset-0 z-0 bg-[url('/images/chicken-dinner-bg.png')] bg-cover bg-center bg-no-repeat opacity-40 bg-fixed"
      />
      {/* Custom Golden Mist Animation overlay */}
      <div className="absolute inset-0 z-0 bg-pubg-yellow/10 animate-golden-mist mix-blend-overlay pointer-events-none" />
      {/* Dark gradient overlay to improve text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-tactical-black/70 to-tactical-black/95" />

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-7xl relative z-10">
        <div className="text-center mb-16 relative">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pubg-yellow to-yellow-600 uppercase italic tracking-widest mb-4 drop-shadow-lg">
            XYLO Esports Blogs
          </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          Master the battlegrounds with expert guides, stay updated on the latest esports news, and discover winning strategies.
        </p>
      </div>

      {error ? (
        <div className="text-center py-20 text-red-500 bg-red-500/10 rounded-lg border border-red-500/20">
          Failed to load blogs. Please try again later.
        </div>
      ) : !blogs || blogs.length === 0 ? (
        <div className="text-center py-20 bg-tactical-black/50 rounded-lg border border-white/10">
          <p className="text-gray-400 text-lg">No articles published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link href={`/blogs/${blog.slug}`} key={blog.id} className="group flex flex-col h-full">
              <article className="h-full glassmorphism rounded-xl overflow-hidden hover:border-pubg-yellow/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(240,165,0,0.15)] flex flex-col">
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-pubg-yellow font-semibold uppercase tracking-wider bg-pubg-yellow/10 px-3 py-1 rounded-full border border-pubg-yellow/20">
                      {blog.category}
                    </span>
                    {blog.tags && blog.tags.length > 0 && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {blog.tags[0]}
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-pubg-yellow transition-colors line-clamp-2 leading-tight">
                    {blog.title}
                  </h2>
                  
                  <p className="text-gray-400 mb-6 line-clamp-3 flex-grow text-sm leading-relaxed">
                    {blog.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/10 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-pubg-yellow/70" />
                      <span>{format(new Date(blog.created_at), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-pubg-yellow/70" />
                      <span>{blog.reading_time} min read</span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
