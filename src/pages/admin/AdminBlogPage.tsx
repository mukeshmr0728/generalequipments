import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import type { BlogPost } from '../../types/database';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setPosts(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setDeleting(id);
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);

    if (!error) {
      setPosts(posts.filter((p) => p.id !== id));
    }
    setDeleting(null);
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900 mb-2">Blog Posts</h1>
          <p className="text-charcoal-600">Manage your blog content</p>
        </div>
        <Link to="/admin/blog/new" className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          New Post
        </Link>
      </div>

      <div className="bg-white border border-charcoal-200 mb-6">
        <div className="p-4 border-b border-charcoal-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-charcoal-300 focus:border-steel-500 focus:ring-2 focus:ring-steel-500 focus:ring-opacity-20 focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-steel-600 mx-auto" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-charcoal-500">
            {searchTerm ? 'No posts found matching your search' : 'No blog posts yet'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-charcoal-50 border-b border-charcoal-200">
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-500">
                    Title
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-500">
                    Author
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-500">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-500">
                    Date
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-200">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-charcoal-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-charcoal-900">{post.title}</div>
                      <div className="text-sm text-charcoal-500 truncate max-w-xs">
                        {post.excerpt}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal-600">
                      {post.author}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 ${
                          post.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {post.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal-600">
                      {format(new Date(post.publish_date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {post.is_published && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-charcoal-400 hover:text-steel-600"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        )}
                        <Link
                          to={`/admin/blog/${post.id}`}
                          className="p-2 text-charcoal-400 hover:text-steel-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deleting === post.id}
                          className="p-2 text-charcoal-400 hover:text-red-600 disabled:opacity-50"
                        >
                          {deleting === post.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
