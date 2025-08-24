import { LucideFile, LucideFileBadge2, LucideFileScan, LucideFileSearch2, LucideHome, LucideSignature } from "lucide-react"

export interface menuItems {
    label: string,
    href: string,
    icon: keyof typeof iconMap
}

export const iconMap = {
    home: LucideHome,
    file: LucideFile,
    fileBadge2: LucideFileBadge2,
    signature: LucideSignature,
    fileScan: LucideFileScan,
    fileSearch2: LucideFileSearch2
}

export const homeMenu: menuItems[] = [
    {
        label: 'Dashboard',
        href: '/dashboard/',
        icon: 'home'
    },
    {
        label: 'Dokumen',
        href: '/documents/',
        icon: 'file'
    },
]

export const certMenu: menuItems[] = [
    {
        label: 'Sertifikat Digital',
        href: '/certificates/',
        icon: 'fileBadge2'
    },
    {
        label: 'Tanda Tangan',
        href: '/signatures/',
        icon: 'signature'
    },
]

export const verifyMenu: menuItems[] = [
    {
        label: 'Tanda Tangan Digital',
        href: '/verifyPDF/',
        icon: 'fileScan'
    },
    {
        label: 'Informasi Dokumen',
        href: '/verify/',
        icon: 'fileSearch2'
    },
]
