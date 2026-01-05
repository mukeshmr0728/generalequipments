import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowRight, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import type { BlogPost } from '../types/database';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .lte('publish_date', new Date().toISOString())
        .order('publish_date', { ascending: false });

      if (data) setPosts(data);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <>
      <section className="bg-charcoal-950 text-white py-16">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Technical Insights & Industry Knowledge
          </h1>
          <p className="text-xl text-charcoal-400 max-w-2xl">
            Expert articles on industrial equipment, maintenance best practices,
            and industry trends from our engineering team.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-steel-600" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-charcoal-600">No blog posts available yet.</p>
            </div>
          ) : (
            <>
              {featuredPost && (
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="group block mb-16"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="aspect-video bg-charcoal-100 overflow-hidden">
                      <img
                        src={
                          featuredPost.featured_image ||
                          'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800'
                        }
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-4 text-sm text-charcoal-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(featuredPost.publish_date), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {featuredPost.author}
                        </span>
                      </div>
                      <h2 className="text-3xl font-bold text-charcoal-900 mb-4 group-hover:text-steel-700 transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-charcoal-600 mb-6 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-2 text-steel-700 font-semibold text-sm uppercase tracking-wider">
                        Read Article
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {remainingPosts.length > 0 && (
                <>
                  <h2 className="text-2xl font-bold text-charcoal-900 mb-8">
                    Recent Articles
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {remainingPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="group border border-charcoal-200 hover:border-steel-400 transition-colors"
                      >
                        <div className="aspect-video bg-charcoal-100 overflow-hidden">
                          <img
                            src={
                              post.featured_image ||
                              'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=600'
                            }
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-4 text-xs text-charcoal-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(post.publish_date), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-charcoal-900 mb-2 group-hover:text-steel-700 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-sm text-charcoal-600 line-clamp-3 mb-4">
                            {post.excerpt}
                          </p>
                          <span className="inline-flex items-center gap-2 text-steel-700 font-semibold text-sm uppercase tracking-wider">
                            Read More
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>

      <section className="section-padding bg-charcoal-50">
        <div className="container-wide text-center">
          <h2 className="text-2xl font-bold text-charcoal-900 mb-4">
            Need Technical Guidance?
          </h2>
          <p className="text-charcoal-600 mb-8 max-w-xl mx-auto">
            Our engineering team is available to discuss your specific equipment
            requirements and provide expert recommendations.
          </p>
          <Link to="/book-a-call" className="btn-primary">
            Schedule a Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
