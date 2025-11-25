import { IconBuilding, IconCalendarEvent } from "@tabler/icons-react";

export const mainLinks = [
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