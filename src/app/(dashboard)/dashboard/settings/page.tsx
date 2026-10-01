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

      if (error) {
        setUsernameError(error.message);
      } else {
        setInitialUsername(username.toLowerCase().trim());
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      }
    } catch {
      setUsernameError('Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
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
        setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setPasswordMsg({ type: 'error', text: 'Failed to update password.' });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== username) return;

    setDeleting(true);
    try {
      // Cascaded deletion
      await supabase.from('links').delete().eq('profile_id', profileId);
      await supabase.from('social_links').delete().eq('profile_id', profileId);
      await supabase.from('events').delete().eq('profile_id', profileId);
      await supabase.from('profiles').delete().eq('id', profileId);

      await supabase.auth.signOut();
      router.push('/');
    } catch (err) {
      console.error('Account deletion error:', err);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-[#71716E]">
        <Loader2 className="w-7 h-7 animate-spin text-[#1E392A]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-[#191919] tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs text-[#71716E] mt-1">
          Manage your username, display name, password security, and account data
        </p>
      </div>

      {/* 1. Profile Information */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#E5E5E3] shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-[#E5E5E3] pb-4">
          <User className="w-4 h-4 text-[#1E392A]" />
          <h2 className="text-xs font-bold text-[#191919] uppercase tracking-wider">
            Profile & Username
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#191919] mb-1.5">
              Account Email
            </label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5E5E3] text-[#71716E] text-xs cursor-not-allowed font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#191919] mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              maxLength={50}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] focus:border-[#1E392A] outline-none text-[#191919] text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#191919] mb-1.5">
              Public Bio Link URL
            </label>
            <div className="flex rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] focus-within:border-[#1E392A] overflow-hidden">
              <span className="px-3.5 py-2.5 text-xs text-[#71716E] bg-[#F3F3F1] border-r border-[#E5E5E3] flex items-center font-mono">
                bionest.link/
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                placeholder="username"
                className="w-full px-3.5 py-2.5 bg-transparent text-[#191919] text-xs font-mono font-medium outline-none"
              />
              <div className="px-3 flex items-center">
                {usernameStatus === 'checking' && (
                  <Loader2 className="w-3.5 h-3.5 text-[#71716E] animate-spin" />
                )}
                {usernameStatus === 'available' && (
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                    Available
                  </span>
                )}
                {usernameStatus === 'unavailable' && (
                  <span className="text-[10px] text-rose-800 font-bold bg-rose-100 px-2 py-0.5 rounded-full">
                    Taken
                  </span>
                )}
              </div>
            </div>
            {usernameError && (
              <p className="text-xs text-rose-600 mt-1">{usernameError}</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            {profileSuccess && (
              <span className="text-xs text-emerald-700 flex items-center gap-1 font-semibold">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                Profile updated successfully
              </span>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                disabled={profileSaving}
                className="py-2.5 px-6 rounded-full bg-[#1E392A] hover:bg-[#14261C] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 disabled:opacity-50"
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
      <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#E5E5E3] shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-[#E5E5E3] pb-4">
          <Shield className="w-4 h-4 text-[#1E392A]" />
          <h2 className="text-xs font-bold text-[#191919] uppercase tracking-wider">
            Password & Security
          </h2>
        </div>

        {passwordMsg && (
          <div
            className={`p-3 rounded-xl text-xs border ${
              passwordMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {passwordMsg.text}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#191919] mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] focus:border-[#1E392A] outline-none text-[#191919] text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#191919] mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] focus:border-[#1E392A] outline-none text-[#191919] text-xs font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={passwordSaving}
              className="py-2.5 px-6 rounded-full bg-white border border-[#D8D8D5] hover:bg-[#FAF9F5] text-[#191919] font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
            >
              {passwordSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Danger Zone */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-rose-50/40 border border-rose-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <h2 className="text-xs font-bold text-rose-800 uppercase tracking-wider">
            Danger Zone
          </h2>
        </div>
        <p className="text-xs text-rose-700 leading-relaxed">
          Permanently delete your account, your links, analytics records, and release your username. This action cannot be undone.
        </p>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="py-2.5 px-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Account</span>
        </button>
      </div>

      {/* Account Deletion Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-[#E5E5E3] rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-rose-600">
              Are you absolutely sure?
            </h3>
            <p className="text-xs text-[#575753] leading-relaxed">
              This will permanently delete your profile, remove all public links, and purge your analytics logs. Type your username{' '}
              <strong className="text-[#191919] font-mono">{username}</strong> to confirm.
            </p>

            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder={username}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] text-[#191919] text-xs font-mono outline-none"
            />

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                className="flex-1 py-2.5 rounded-full bg-[#F3F3F1] hover:bg-[#EAEAE8] text-[#71716E] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmation !== username || deleting}
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold disabled:opacity-40 transition-all flex items-center justify-center gap-1.5"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Permanently Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
