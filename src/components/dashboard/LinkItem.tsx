'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Globe,
  MessageCircle,
  Phone,
  Mail,
  Heading,
  Calendar,
  Pencil,
  Trash2,
} from 'lucide-react';
import { BioLink } from './PhonePreview';

interface LinkItemProps {
  link: BioLink;
  onToggleActive: (id: string, active: boolean) => void;
  onEdit: (link: BioLink) => void;
  onDelete: (id: string) => void;
}

export default function LinkItem({
  link,
  onToggleActive,
  onEdit,
  onDelete,
}: LinkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  const getTypeIcon = () => {
    switch (link.type) {
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4 text-emerald-400" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-sky-400" />;
      case 'email':
        return <Mail className="w-4 h-4 text-amber-400" />;
      case 'header':
        return <Heading className="w-4 h-4 text-purple-400" />;
      default:
        return <Globe className="w-4 h-4 text-slate-400" />;
    }
  };

  const isScheduled = link.show_from || link.show_until;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all ${
        !link.is_active ? 'opacity-60 bg-slate-950/40' : ''
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="text-slate-600 hover:text-slate-300 cursor-grab active:cursor-grabbing p-1 -ml-1 transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Type Icon Badge */}
        <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
          {getTypeIcon()}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-white truncate">
              {link.title}
            </h4>
            {isScheduled && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-md shrink-0"
                title={`Scheduled: ${link.show_from || 'Always'} - ${link.show_until || 'Indefinite'}`}
              >
                <Calendar className="w-3 h-3" />
                Scheduled
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 truncate mt-0.5">
            {link.type === 'whatsapp'
              ? `wa.me/${link.whatsapp_number}${link.message ? ` (${link.message})` : ''}`
              : link.type === 'phone'
              ? `tel:${link.url}`
              : link.type === 'email'
              ? `mailto:${link.url}`
              : link.type === 'header'
              ? 'Section Divider Header'
              : link.url}
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3 shrink-0 ml-3">
        {/* Active Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={link.is_active}
            onChange={(e) => onToggleActive(link.id, e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
        </label>

        {/* Edit Button */}
        <button
          type="button"
          onClick={() => onEdit(link)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Edit link"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => onDelete(link.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Delete link"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
