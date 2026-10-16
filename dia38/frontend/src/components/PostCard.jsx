import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PostForm from './PostForm';
import CommentSection from './CommentSection';

const PostCard = ({ post, onUpdatePost, onDeletePost, onCreateComment, onUpdateComment, onDeleteComment }) => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  const isOwner = user?.id === post.author?._id || user?.id === post.author?.id;

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <img src={post.image} alt={post.title} className="h-72 w-full object-cover" />

      <div className="space-y-5 p-5">
        {editing ? (
          <PostForm
            initialValues={post}
            onSubmit={async (values) => {
              const ok = await onUpdatePost(post._id, values);
              if (ok) setEditing(false);
              return ok;
            }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{post.title}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Por <span className="font-medium">{post.author?.name || 'Usuario'}</span> ·{' '}
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>

              {isOwner && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(true)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDeletePost(post._id)}
                    className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>

            <p className="whitespace-pre-line text-slate-700">{post.content}</p>
          </>
        )}

        <CommentSection
          postId={post._id}
          comments={post.comments}
          onCreate={onCreateComment}
          onUpdate={onUpdateComment}
          onDelete={onDeleteComment}
        />
      </div>
    </article>
  );
};

export default PostCard;
