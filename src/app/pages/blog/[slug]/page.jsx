"use client";

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function BlogPostPage() {
  const params = useParams();
  const { slug } = params;
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      if (slug) {
        setLoading(true);
        setPost(null);
        window.scrollTo(0, 0);

        try {
          const postRes = await fetch(`/api/posts?slug=${slug}`);
          const postResult = await postRes.json();

          if (postResult.success && postResult.data.length > 0) {
            const currentPost = postResult.data[0];
            setPost(currentPost);

            const relatedRes = await fetch(`/api/posts?status=published&limit=4`);
            const relatedResult = await relatedRes.json();
            if (relatedResult.success) {
              setRelatedPosts(relatedResult.data.filter(p => p.slug !== slug).slice(0, 3));
            }
          } else {
            console.error("Post topilmadi");
          }
        } catch (error) {
          console.error("Ma'lumotlarni yuklashda xatolik:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPostData();
  }, [slug]);

  if (loading || !post) {
    return (
      <>
        <Navigation />
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
          {loading ? (
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          ) : (
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-slate-100">Maqola Topilmadi</h1>
              <p className="text-gray-600 dark:text-slate-400 mt-4">Siz qidirayotgan maqola mavjud emas.</p>
              <Link href="/pages/blog" className="mt-8 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                Blogga Qaytish
              </Link>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="bg-white dark:bg-slate-900 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/pages/blog" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
              <ArrowLeft size={18} />
              Barcha maqolalarga qaytish
            </Link>
          </div>

          <article>
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Tag size={16} />
                  <span>{post.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(post.created_at).toLocaleDateString('uz-UZ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{post.author}</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-slate-100 leading-tight">
                {post.title}
              </h1>
            </header>

            {post.image && (
              <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-8 shadow-lg">
                <Image
                  src={post.image}
                  alt={post.title}
                  layout="fill"
                  objectFit="cover"
                  priority
                />
              </div>
            )}

            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-200 dark:border-slate-700">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-8 text-center">
                Boshqa Maqolalar
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/pages/blog/${relatedPost.slug}`} passHref>
                    <div className="group cursor-pointer">
                      {relatedPost.image && (
                        <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4">
                          <Image
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            layout="fill"
                            objectFit="cover"
                            className="group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                        {new Date(relatedPost.created_at).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
 