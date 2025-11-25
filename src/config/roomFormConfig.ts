// src/config/roomFormConfig.ts
import * as yup from "yup";
import { CreateRoomPayload } from "@/services/room/type";

export const initialValues: CreateRoomPayload = {
    room_number: 0,
    location: "",
    capacity: 1,
    description: "",
    status: "ACTIVE",
    category: "",
};

export const validationSchema = yup.object().shape({
    room_number: yup
        .number()
        .required("Өрөөний дугаарыг заавал оруулна уу.")
        .positive("Өрөөний дугаар эерэг тоо байх ёстой.")
        .integer("Өрөөний дугаар бүхэл тоо байх ёстой.")
        .typeError("Дугаар буруу байна."), // NumberInput-д зориулж нэмсэн

    location: yup
        .string()
        .required("Байршлыг заавал оруулна уу.")
        .min(5, "Байршил дор хаяж 5 үсэгтэй байх ёстой.")
        .max(100, "Байршил 100 үсгээс хэтрэхгүй."),

    capacity: yup
        .number()
        .required("Багтаамжийг заавал оруулна уу.")
        .min(1, "Багтаамж дор хаяж 1 байх ёстой.")
        .max(500, "Багтаамж 500-аас хэтрэхгүй.")
        .integer("Багтаамж бүхэл тоо байх ёстой.")
        .typeError("Багтаамж тоо байх ёстой."), // NumberInput-д зориулж нэмсэн

    description: yup
        .string()
        .required("Тайлбарыг заавал оруулна уу.")
        .min(10, "Тайлбар дор хаяж 10 үсэгтэй байх ёстой.")
        .max(500, "Тайлбар 500 үсгээс хэтрэхгүй."),

    status: yup
        .string()
        .required("Төлвийг заавал сонгоно уу.")
        .oneOf(
            ["ACTIVE", "INACTIVE"],
            "Зөвхөн ACTIVE эсвэл INACTIVE сонгох боломжтой."
        ),

    category: yup
        .string()
        .required("Ангиллыг заавал сонгоно уу.")
        .min(3, "Ангилал дор хаяж 3 үсэгтэй байх ёстой."),
});

export const CATEGORY_OPTIONS = [
    "Лекцийн танхим",
    "Уулзалтын өрөө",
    "Семинарын танхим",
    "Лаборатори",
];

export const STATUS_OPTIONS = [
    { value: "ACTIVE", label: "Идэвхтэй (Захиалах боломжтой)" },
    { value: "INACTIVE", label: "Идэвхгүй (Захиалах боломжгүй)" },
];