// src/hooks/useRoomCreation.ts
import React from 'react';
import { useFormik } from 'formik';
import { initialValues, validationSchema } from '@/config/roomFormConfig';
import { createRoom } from '@/services/room';
import { CreateRoomPayload } from '@/services/room/type';
import { notifications } from '@mantine/notifications'; // Mantine notifications ашиглаж болно

export const useRoomCreation = () => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [apiError, setApiError] = React.useState<string | null>(null);

    const formik = useFormik<CreateRoomPayload>({
        initialValues,
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setIsSubmitting(true);
            setApiError(null);

            try {
                const newRoom = await createRoom(values);

                notifications.show({
                    title: 'Амжилттай үүслээ',
                    message: `Өрөө №${newRoom.room_number} (ID: ${newRoom.id}) амжилттай үүслээ.`,
                    color: 'green',
                });
                resetForm(); // Формыг цэвэрлэх

            } catch (error) {
                const errorMsg =
                    (error as any).response?.data?.message ||
                    (error as Error).message ||
                    "Тодорхойгүй алдаа.";
                
                setApiError(`Өрөө үүсгэх үед алдаа гарлаа: ${errorMsg}`);
                
                notifications.show({
                    title: 'Алдаа гарлаа',
                    message: errorMsg,
                    color: 'red',
                });
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return { formik, isSubmitting, apiError };
};