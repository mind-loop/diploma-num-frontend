// src/components/Sidebar.tsx
import { useAuth } from "@/context/AuthContext";
import {
  IconBuilding,
  IconCalendarEvent
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const mainLinks = [
  {
    icon: IconBuilding,
    label: "Өрөөнүүд",
    path: "/rooms",
    roles: ["ADMIN", "MANAGER","CUSTOMER"],
  }, // Өрөө удирдах
  {
    icon: IconCalendarEvent,
    label: "Өрөөний захиалгууд",
    path: "/orders",
    roles: ["ADMIN"],
  },
  {
    icon: IconCalendarEvent,
    label: "Миний Захиалгууд",
    path: "/orders/my",
    roles: ["CUSTOMER"],
  },
];

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const userRole = user?.role;

  const links = mainLinks
    // 💡 Хэрэглэгчийн Role-д тохирсон линкүүдийг шүүх
    .filter(
      (link) => !link.roles || (userRole && link.roles.includes(userRole))
    )
    .map((link) => {
      // Үндсэн замыг check хийх
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
    // Tailwind classes: w-64 (256px), h-full, fixed, pt-16 (Navbar-ын доор)
    <div className="w-64 bg-white p-4 h-full border-r border-gray-200 flex flex-col fixed left-0 top-0 pt-16 z-40">
      <div className="flex flex-col space-y-2">{links}</div>
    </div>
  );
};
