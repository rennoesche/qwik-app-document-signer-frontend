import { $, type QRL } from '@builder.io/qwik';
import { LuHome, LuUpload, LuFileSignature, LuPaperclip, LuUser, LuFingerprint, LuSignal, LuFileKey, LuFileCheck, LuFileArchive, LuUserCog } from '@qwikest/icons/lucide';

export interface NavItem {
    href: string;
    icon: QRL<any>;
    label: string;
}

export const navItems: NavItem[] = [
  {href: '/dashboard', icon: $(LuHome), label: 'Dashboard'},
  {href: '/documents', icon: $(LuPaperclip), label: 'Dokumen'},
];

export const signatureNavItems: NavItem[] = [
  {href: '/certificates', icon: $(LuFingerprint), label: 'Sertifikat Digital'},
  {href: '/signatures', icon: $(LuSignal), label: 'Buat Tanda Tangan'},
];

export const verifyNavItems: NavItem[] = [
  {href: '/verify', icon: $(LuFileKey), label: 'Digital Signature'},
  {href: '/verify-document', icon: $(LuFileCheck), label: 'Informasi Dokumen'},
];

export const adminNavItems: NavItem[] = [
  {href: '/admin/root-ca', icon: $(LuFileArchive), label: 'Root CA'},
  {href: '/admin/user-access', icon: $(LuUserCog), label: 'Akses Pengguna'},
  {href: '/admin/users', icon: $(LuUser), label: 'Manajemen Pengguna'},
];