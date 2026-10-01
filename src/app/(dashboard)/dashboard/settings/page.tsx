'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Trash2,
  Check,
  AlertTriangle,
  Loader2,
  Lock,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { usernameSchema } from '@/lib/validation';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState('');
  const [email, setEmail] = useState('');

  // Profile Fields
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [initialUsername, setInitialUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<
    'idle' | 'checking' | 'available' | 'unavailable'
  >('idle');
  const [usernameError, setUsernameError] = useState('');

  // Password Update
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // States
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Account Deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        setProfileId(user.id);
        setEmail(user.email || '');

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          setDisplayName(profile.display_name || '');
          setUsername(profile.username || '');
          setInitialUsername(profile.username || '');
        }
      } catch (err) {
        console.error('Failed to load profile in settings:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [supabase]);

  // Debounced check for changed username
  useEffect(() => {
    if (!username || username === initialUsername) {
      setUsernameStatus('idle');
      setUsernameError('');
      return;
    }

    const timer = setTimeout(async () => {
      setUsernameStatus('checking');
      try {
        const res = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`);
        const json = await res.json();
        if (json.available) {
          setUsernameStatus('available');
          setUsernameError('');
        } else {
          setUsernameStatus('unavailable');
          setUsernameError(json.reason || 'Username is not available');
        }
      } catch {
        setUsernameStatus('idle');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username, initialUsername]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(false);

    // If username changed, validate
    if (username !== initialUsername) {
      const v = usernameSchema.safeParse(username);
      if (!v.success) {
        setUsernameError(v.error.issues[0]?.message || 'Invalid username');
        setProfileSaving(false);
        return;
      }
      if (usernameStatus === 'unavailable') {
        setProfileSaving(false);
        return;
      }
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName.trim(),
          username: username.toLowerCase().trim(),
        })
        .eq('id', profileId);

      if (!error) {
        setInitialUsername(username.toLowerCase().trim());
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update settings profile:', err);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setPasswordSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setPasswordMsg({ type: 'error', text: error.message });
      } else {
        setPasswordMsg({ type: 'success', text: 'Password updated successfully' });
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setPasswordMsg({ type: 'error', text: 'Failed to update password' });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== initialUsername) return;

    setDeleting(true);
    try {
      // 1. Delete links
      await supabase.from('links').delete().eq('profile_id', profileId);
      // 2. Delete social links
      await supabase.from('social_links').delete().eq('profile_id', profileId);
      // 3. Delete events
      await supabase.from('events').delete().eq('profile_id', profileId);
      // 4. Delete profile
      await supabase.from('profiles').delete().eq('id', profileId);

      // Sign out and redirect to home
      await supabase.auth.signOut();
      router.push('/');
    } catch (err) {
      console.error('Account deletion error:', err);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in pb-16">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-6 h-6 text-emerald-400" />
          <span>Account Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your username, personal profile, authentication, and data
        </p>
      </div>

      {/* 1. Profile Information */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <User className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Profile & Username
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Account Email
            </label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-slate-400 text-xs cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              maxLength={50}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 outline-none text-slate-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Public Username URL
            </label>
            <div className="flex rounded-xl bg-slate-950 border border-slate-800 focus-within:border-emerald-500 overflow-hidden">
              <span className="px-3 py-2.5 text-xs text-slate-500 bg-slate-900/80 border-r border-slate-800 flex items-center font-mono">
                bionest.link/
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                placeholder="username"
                className="w-full px-3 py-2.5 bg-transparent text-slate-200 text-xs font-mono outline-none"
              />
              <div className="px-3 flex items-center">
                {usernameStatus === 'checking' && (
                  <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />
                )}
                {usernameStatus === 'available' && (
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    Available
                  </span>
                )}
                {usernameStatus === 'unavailable' && (
                  <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-md">
                    Taken
                  </span>
                )}
              </div>
            </div>
            {usernameError && (
              <p className="text-xs text-rose-400 mt-1">{usernameError}</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            {profileSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <Check className="w-3.5 h-3.5" />
                Profile updated successfully
              </span>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                disabled={profileSaving}
                className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                {profileSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 2. Security & Password */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <Shield className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Password & Security
          </h2>
        </div>

        {passwordMsg && (
          <div
            className={`p-3 rounded-xl text-xs border ${
              passwordMsg.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}
          >
            {passwordMsg.text}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 outline-none text-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 outline-none text-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={passwordSaving}
              className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {passwordSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 3. Danger Zone: Delete Account */}
      <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/20 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <h2 className="text-sm font-bold text-rose-400 uppercase tracking-wider">
            Danger Zone
          </h2>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Permanently delete your BioNest account. This action immediately deletes your public page,
          links, analytics history, and avatar files. This action cannot be undone.
        </p>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="py-2.5 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-2 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete BioNest Account</span>
        </button>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Account</h3>
                <p className="text-xs text-slate-400">Irreversible action</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              To confirm deletion, please type your username{' '}
              <strong className="text-rose-400 font-mono">@{initialUsername}</strong> below:
            </p>

            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder={initialUsername}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-rose-500 outline-none text-slate-200 text-xs font-mono"
            />

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmation !== initialUsername || deleting}
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
