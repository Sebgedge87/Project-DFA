import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ExternalLink, Pencil, Check, X, LogOut } from 'lucide-react';
import { useMyLists, useDeleteList, useProfile, useUpdateProfile, useTemplateLists, useCloneList } from '@dfa/supabase-client';
import { useAuthStore } from '../stores/authStore';
import { useArmyStore } from '../stores/armyStore';

function Avatar({ src, name, size = 16 }: { src?: string | null; name?: string | null; size?: number }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name ?? 'Avatar'}
        className="rounded-full object-cover"
        style={{ width: size * 4, height: size * 4 }}
      />
    );
  }
  const initials = (name ?? '?').slice(0, 2).toUpperCase();
  return (
    <div
      className="rounded-full bg-dfa-red flex items-center justify-center text-white font-display font-bold"
      style={{ width: size * 4, height: size * 4, fontSize: size * 1.4 }}
    >
      {initials}
    </div>
  );
}

export default function ProfilePage() {
  const { user, signOut } = useAuthStore();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id ?? null);
  const updateProfile = useUpdateProfile();
  const { data: lists, isLoading: listsLoading } = useMyLists(user?.id ?? null);
  const deleteList = useDeleteList();
  const { data: templateLists } = useTemplateLists();
  const cloneList = useCloneList();
  const { loadList } = useArmyStore();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);

  const startEdit = () => {
    setDisplayName(profile?.display_name ?? '');
    setUsername(profile?.username ?? '');
    setBio(profile?.bio ?? '');
    setSaveError(null);
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const saveEdit = async () => {
    if (!user) return;
    setSaveError(null);
    try {
      await updateProfile.mutateAsync({
        userId: user.id,
        updates: { display_name: displayName || null, username: username || undefined, bio: bio || null },
      });
      setEditing(false);
    } catch (e: any) {
      setSaveError(e.message ?? 'Failed to save');
    }
  };

  const handleLoad = async (id: string) => {
    await loadList(id);
    navigate(`/list/${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this army list?')) deleteList.mutate(id);
  };

  const displayedName = profile?.display_name || profile?.username || user?.email?.split('@')[0] || 'Commander';
  const avatarUrl = profile?.avatar_url ?? (user?.user_metadata?.avatar_url as string | undefined);
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : null;

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">

      {/* Profile card */}
      <div className="bg-dfa-surface border border-dfa-border rounded-lg p-5">
        <div className="flex items-start gap-4">
          <Avatar src={avatarUrl} name={displayedName} size={14} />

          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-dfa-text-muted mb-1">Display name</label>
                    <input
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-dfa-black border border-dfa-border rounded px-3 py-1.5 text-sm text-dfa-text focus:outline-none focus:border-dfa-red"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-dfa-text-muted mb-1">Username</label>
                    <input
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="username"
                      className="w-full bg-dfa-black border border-dfa-border rounded px-3 py-1.5 text-sm text-dfa-text focus:outline-none focus:border-dfa-red"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-dfa-text-muted mb-1">Bio</label>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Tell us about yourself…"
                    rows={2}
                    className="w-full bg-dfa-black border border-dfa-border rounded px-3 py-1.5 text-sm text-dfa-text focus:outline-none focus:border-dfa-red resize-none"
                  />
                </div>
                {saveError && <p className="text-xs text-red-400">{saveError}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    disabled={updateProfile.isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-dfa-red hover:bg-dfa-red-bright text-white text-xs font-bold rounded transition-colors disabled:opacity-50"
                  >
                    <Check size={12} />
                    {updateProfile.isPending ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-dfa-border text-dfa-text-muted hover:text-dfa-text text-xs rounded transition-colors"
                  >
                    <X size={12} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-display text-dfa-text font-bold text-xl leading-none">
                    {profileLoading ? '…' : displayedName}
                  </h2>
                  {profile?.username && (
                    <span className="text-dfa-text-muted text-sm">@{profile.username}</span>
                  )}
                </div>
                <p className="text-dfa-text-muted text-xs mt-1">{user?.email}</p>
                {profile?.bio && (
                  <p className="text-dfa-text text-sm mt-2 leading-relaxed">{profile.bio}</p>
                )}
                {memberSince && (
                  <p className="text-dfa-text-muted text-xs mt-2">Member since {memberSince}</p>
                )}
              </>
            )}
          </div>

          {!editing && (
            <button
              onClick={startEdit}
              title="Edit profile"
              className="text-dfa-text-muted hover:text-dfa-text transition-colors shrink-0"
            >
              <Pencil size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Army lists */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-dfa-text text-lg font-bold uppercase tracking-wide">
            My Armies
          </h3>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-2 bg-dfa-red hover:bg-dfa-red-bright text-white text-sm font-bold rounded transition-colors"
          >
            <Plus size={15} />
            New Army
          </button>
        </div>

        {listsLoading ? (
          <div className="text-dfa-text-muted text-sm animate-pulse py-8 text-center">
            Loading your armies…
          </div>
        ) : lists?.length === 0 ? (
          <div className="text-center py-12 space-y-3 bg-dfa-surface border border-dfa-border rounded-lg">
            <p className="text-dfa-text-muted text-sm">No saved armies yet.</p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-dfa-red hover:bg-dfa-red-bright text-white text-sm font-bold rounded transition-colors"
            >
              Build your first army
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {lists?.map((list) => (
              <div
                key={list.id}
                className="bg-dfa-surface border border-dfa-border rounded-lg p-4 flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-dfa-text font-medium truncate">{list.name}</p>
                  <p className="text-xs text-dfa-text-muted mt-0.5">
                    <span className="text-dfa-gold font-mono font-bold">{list.points_total}pts</span>
                    {' · '}
                    {list.is_public ? 'Public' : 'Private'}
                    {' · '}
                    {new Date(list.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {list.is_public && (
                    <a
                      href={`/share/${list.share_token}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dfa-text-muted hover:text-dfa-text transition-colors"
                      title="View share link"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  <button
                    onClick={() => handleLoad(list.id)}
                    className="px-3 py-1.5 border border-dfa-border text-dfa-text-muted hover:text-dfa-text text-xs rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(list.id)}
                    className="text-dfa-text-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Starter armies */}
      {templateLists && templateLists.length > 0 && (
        <div>
          <h3 className="font-display text-dfa-text text-lg font-bold uppercase tracking-wide mb-4">
            Starter Armies
          </h3>
          <div className="space-y-3">
            {templateLists.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-dfa-surface border border-dfa-border rounded-lg p-4 flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-dfa-text font-medium truncate">{tmpl.name}</p>
                  <p className="text-xs text-dfa-text-muted mt-0.5">
                    <span className="text-dfa-gold font-mono font-bold">{tmpl.points_total}pts</span>
                    {' · '}Sample list
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`/share/${tmpl.share_token}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 border border-dfa-border text-dfa-text-muted hover:text-dfa-text text-xs rounded transition-colors"
                  >
                    View
                  </a>
                  {user && (
                    <button
                      onClick={async () => {
                        const id = await cloneList.mutateAsync({ templateId: tmpl.id, userId: user.id });
                        navigate(`/list/${id}`);
                      }}
                      disabled={cloneList.isPending}
                      className="px-3 py-1.5 bg-dfa-red hover:bg-dfa-red-bright text-white text-xs font-bold rounded transition-colors disabled:opacity-50"
                    >
                      Use as Template
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sign out */}
      <div className="pt-2 border-t border-dfa-border">
        <button
          onClick={async () => { await signOut(); navigate('/'); }}
          className="flex items-center gap-2 text-dfa-text-muted hover:text-red-400 text-sm transition-colors"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>

    </div>
  );
}
