import { useAuth } from "@/context/AuthContext";
import { Drawer, Group, ScrollArea } from "@mantine/core"; // 💡 Drawer-ийг импортлов
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { mainLinks } from "./mainLinks";

// 💡 Шинэ Props: Mobile Drawer-ийн төлөвийг удирдах
interface SidebarProps {
    opened: boolean;
    onClose: () => void;
}

// Sidebar-ын линкүүдийг рендерлэх туслах функц
const SidebarContent: React.FC<{ userRole: string | undefined }> = ({ userRole }) => {
    const router = useRouter();

    const links = mainLinks
        .filter(
            (link) => !link.roles || (userRole && link.roles.includes(userRole))
        )
        .map((link) => {
            const isActive =
                router.pathname === link.path ||
                (link.path !== "/" && router.pathname.startsWith(link.path));

            return (
                <Link href={link.path} key={link.label} passHref legacyBehavior>
                    <a
                        className={`flex items-center p-3 rounded-lg text-sm font-medium transition duration-150 space-x-3 
                        ${
                            isActive
                                ? "bg-blue-100 text-blue-700 font-bold"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        <link.icon size={20} />
                        <span>{link.label}</span>
                    </a>
                </Link>
            );
        });

    return (
        <div className="flex flex-col space-y-2">
            {links}
        </div>
    );
};


export const Sidebar: React.FC<SidebarProps> = ({ opened, onClose }) => {
    const { user } = useAuth();
    const userRole = user?.role;

    const content = <SidebarContent userRole={userRole} />;

    return (
        <>
            {/* 1. Mobile (Drawer) View */}
            <Drawer
                opened={opened}
                onClose={onClose}
                title={
                    <Group justify="space-between" w="100%">
                        <span className="text-lg font-bold text-blue-600">Системийн Цэс</span>
                    </Group>
                }
                padding="md"
                size="xs" // Жижиг дэлгэцэнд тохиромжтой хэмжээ
                // 💡 Mantine v7-д overlayProps-ийг ашиглана
                overlayProps={{ opacity: 0.5, blur: 4 }}
                // Mobile-д л ашиглагдана
                hiddenFrom="sm" 
            >
                {/* Scroll хийх боломжтой болгох */}
                <ScrollArea h="calc(100vh - 80px)" type="auto">
                    {content}
                </ScrollArea>
            </Drawer>

            {/* 2. Desktop (Fixed) View */}
            <div 
                // sm: 640px-аас дээш гарвал харуулна
                className="hidden sm:block w-64 bg-white p-4 h-full border-r border-gray-200 flex flex-col fixed left-0 top-0 pt-16 z-40"
            >
                {content}
            </div>
        </>
    );
};