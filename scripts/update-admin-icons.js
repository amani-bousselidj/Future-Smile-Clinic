// Script to replace emojis with icons in admin pages
// Run with: node scripts/update-admin-icons.js

const fs = require('fs');
const path = require('path');

const replacements = [
  { emoji: '🦷', icon: 'Activity' },
  { emoji: '👨‍⚕️', icon: 'Users' },
  { emoji: '📅', icon: 'Calendar' },
  { emoji: '💬', icon: 'MessageSquare' },
  { emoji: '⚙️', icon: 'Settings' },
  { emoji: '📊', icon: 'BarChart3' },
  { emoji: '📱', icon: 'Phone' },
  { emoji: '📧', icon: 'Mail' },
  { emoji: '🗓️', icon: 'CalendarDays' },
  { emoji: '🕐', icon: 'Clock' },
  { emoji: '🔄', icon: 'RefreshCw' },
  { emoji: '✏️', icon: 'Edit' },
  { emoji: '🗑️', icon: 'Trash2' },
  { emoji: '✓', icon: 'Check' },
  { emoji: '✔️', icon: 'CheckCheck' },
  { emoji: '✕', icon: 'X' },
  { emoji: '⏳', icon: 'Timer' },
  { emoji: '💾', icon: 'Save' },
  { emoji: '➕', icon: 'Plus' },
  { emoji: '🆕', icon: 'Sparkles' },
  { emoji: '📬', icon: 'Inbox' },
  { emoji: '📭', icon: 'MailOpen' },
  { emoji: '📨', icon: 'Send' },
  { emoji: '🆔', icon: 'Badge' },
  { emoji: '↶', icon: 'Undo' },
];

console.log('Emoji to Icon replacements:', replacements);
