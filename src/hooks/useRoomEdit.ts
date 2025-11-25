import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { getRoomById, updateRoom } from '@/services/room';
import { Room, UpdateRoomPayload } from '@/services/room/type';
import { validationSchema, initialValues } from '@/config/roomFormConfig';
import { notifications } from '@mantine/notifications';

export const useRoomEdit = (roomId: number | null) => {
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1. Өгөгдлийг татаж авах функц
const fetchRoom = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            // API-аас мэдээллийг татаж авах
            const response = await getRoomById(id);
            const data = response; 

            setRoom(data);

            // 💡 Autofill хийх хэсэг: data-ийн утгуудыг Formik-т тааруулж байна.
            formik.setValues({ 
                // data.room_number -> 306
                room_number: data.room_number,
                // data.location -> "B Байр, 3-р давхар"
                location: data.location,
                // data.capacity -> 25
                capacity: data.capacity,
                // data.description -> "Том хэмжээний..."
                description: data.description,
                // data.status -> "ACTIVE"
                status: data.status,
                // data.category -> "Лекцийн танхим"
                category: data.category
            });

        } catch (e: any) {
            // ... алдааг барих ...
        } finally {
            setLoading(false);
        }
    };

    // 2. Formik тохиргоо
    const formik = useFormik<UpdateRoomPayload>({
        // Татсан өгөгдөл ирэхээс өмнө initialValues ашиглана
        initialValues,
        validationSchema,
        enableReinitialize: true, // Room state өөрчлөгдөхөд Formik-ийг дахин эхлүүлэх
        onSubmit: async (values) => {
            if (!roomId) return;
            
            try {
                const updatedRoom = await updateRoom(roomId, values);
                setRoom(updatedRoom); // Шинэчилсэн утгуудыг state-д хадгалах
                
                notifications.show({
                    title: 'Амжилттай Шинэчиллээ',
                    message: `Өрөө №${updatedRoom.room_number} амжилттай шинэчлэгдлээ.`,
                    color: 'green',
                });
            } catch (e: any) {
                notifications.show({
                    title: 'Шинэчлэх үед алдаа гарлаа',
                    message: e.message || 'Сервертэй холбогдоход алдаа гарлаа.',
                    color: 'red',
                });
            }
        },
    });

    // 3. Effect: ID өөрчлөгдөхөд дата татах
    useEffect(() => {
        if (roomId) {
            fetchRoom(roomId);
        }
    }, [roomId]);

    return { 
        room, 
        loading, 
        error, 
        formik, 
        isSubmitting: formik.isSubmitting,
        fetchRoom // Зургийн үйлдэл хийсний дараа датаг дахин татахад зориулав
    };
};