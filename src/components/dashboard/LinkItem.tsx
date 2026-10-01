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
        return <MessageCircle className="w-4 h-4 text-[#25D366]" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-sky-500" />;
      case 'email':
        return <Mail className="w-4 h-4 text-amber-500" />;
      case 'header':
        return <Heading className="w-4 h-4 text-purple-600" />;
      default:
        return <Globe className="w-4 h-4 text-[#71716E]" />;
    }
  };

  const isScheduled = link.show_from || link.show_until;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between p-4 rounded-2xl bg-white border border-[#E5E5E3] hover:border-[#D1D1CE] shadow-xs transition-all ${
        !link.is_active ? 'opacity-55 bg-[#FAF9F5]' : ''
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="text-[#B5B5B0] hover:text-[#191919] cursor-grab active:cursor-grabbing p-1 -ml-1 transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Type Icon Badge */}
        <div className="w-8 h-8 rounded-xl bg-[#F3F3F1] border border-[#E5E5E3] flex items-center justify-center shrink-0">
          {getTypeIcon()}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-[#191919] truncate">
              {link.title}
            </h4>
            {isScheduled && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full shrink-0"
                title={`Scheduled: ${link.show_from || 'Always'} - ${link.show_until || 'Indefinite'}`}
              >
                <Calendar className="w-3 h-3 text-amber-600" />
                Scheduled
              </span>
            )}
          </div>

          <p className="text-xs text-[#71716E] truncate mt-0.5">
            {link.type === 'whatsapp'
              ? `wa.me/${link.whatsapp_number}${link.message ? ` ("${link.message}")` : ''}`
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
          <div className="w-9 h-5 bg-[#E5E5E3] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1E392A]"></div>
        </label>

        {/* Edit Button */}
        <button
          type="button"
          onClick={() => onEdit(link)}
          className="p-1.5 rounded-lg text-[#71716E] hover:text-[#191919] hover:bg-[#F3F3F1] transition-colors"
          title="Edit link"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => onDelete(link.id)}
          className="p-1.5 rounded-lg text-[#71716E] hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Delete link"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
