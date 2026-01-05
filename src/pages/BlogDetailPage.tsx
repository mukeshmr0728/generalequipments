import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Loader2, ChevronRight, ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import type { BlogPost } from '../types/database';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);

      const { data: postData, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error || !postData) {
        navigate('/blog');
        return;
      }

      setPost(postData);

      const { data: relatedData } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .neq('id', postData.id)
        .lte('publish_date', new Date().toISOString())
        .order('publish_date', { ascending: false })
        .limit(3);

      if (relatedData) setRelatedPosts(relatedData);

      setLoading(false);
    }
    fetchPost();
  }, [slug, navigate]);

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || '',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-steel-600" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <>
      <section className="bg-charcoal-950 text-white py-8">
        <div className="container-wide">
          <div className="flex items-center gap-2 text-sm text-charcoal-400">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/blog" className="hover:text-white">Blog</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white truncate max-w-xs">{post.title}</span>
          </div>
        </div>
      </section>

      <article className="section-padding bg-white">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-steel-700 font-medium mb-8 hover:text-steel-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            <header className="mb-12">
              <div className="flex items-center gap-4 text-sm text-charcoal-500 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(post.publish_date), 'MMMM d, yyyy')}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-charcoal-900 mb-6">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-xl text-charcoal-600 leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </header>

            {post.featured_image && (
              <div className="aspect-video bg-charcoal-100 mb-12">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {post.content && (
              <div
                className="prose-industrial max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}

            <footer className="mt-12 pt-8 border-t border-charcoal-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-charcoal-500">Share this article:</span>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 text-steel-700 hover:text-steel-800"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </article>

      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            <div className="bg-steel-700 text-white p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Have Questions About Industrial Equipment?
              </h2>
              <p className="text-steel-200 mb-6">
                Our engineering team is ready to help you find the right solution
                for your application.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/book-a-call" className="btn bg-white text-steel-700 hover:bg-charcoal-100">
                  Schedule a Consultation
                </Link>
                <Link to="/contact" className="btn-outline-white">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-wide">
            <h2 className="text-2xl font-bold text-charcoal-900 mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group border border-charcoal-200 hover:border-steel-400 transition-colors"
                >
                  <div className="aspect-video bg-charcoal-100 overflow-hidden">
                    <img
                      src={
                        relatedPost.featured_image ||
                        'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=600'
                      }
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-charcoal-500 mb-2">
                      {format(new Date(relatedPost.publish_date), 'MMM d, yyyy')}
                    </div>
                    <h3 className="text-lg font-bold text-charcoal-900 group-hover:text-steel-700 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
