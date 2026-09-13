import {
  HeartHandshake, Sun, ShieldAlert, Heart, Sunrise, Sparkles, Users, Flame,
  BookOpen, MessageSquare, Music2, Church, MapPin, Calendar, Building2,
  ArrowRight, CheckCircle, CheckCircle2, Clock, Mail, HandHeart, Coins,
  ShieldCheck, Send, TreePine, Bus, HelpCircle, Lock, UserCheck, Quote,
  Youtube, Instagram, Facebook, Download, Play, Lightbulb, type LucideIcon,
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  HeartHandshake, Sun, ShieldAlert, Heart, Sunrise, Sparkles, Users, Flame,
  BookOpen, MessageSquare, Music2, Church, MapPin, Calendar, Building2,
  ArrowRight, CheckCircle, CheckCircle2, Clock, Mail, HandHeart, Coins,
  ShieldCheck, Send, TreePine, Bus, HelpCircle, Lock, UserCheck, Quote,
  Youtube, Instagram, Facebook, Download, Play, Lightbulb,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

export function getIcon(name?: string): LucideIcon | null {
  if (!name) return null;
  return ICON_MAP[name] ?? null;
}
