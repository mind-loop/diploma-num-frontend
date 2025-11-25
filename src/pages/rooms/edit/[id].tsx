import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
    Container,
    Title,
    Stack,
    Group,
    Text,
    Loader,
    Center,
    Alert,
    Tabs
} from "@mantine/core";
import { IconBuilding, IconAlertCircle, IconPhoto, IconPencil } from "@tabler/icons-react";
import { MainLayout } from '@/Layouts/MainLayout';
import { RoomForm } from '@/components/RoomForm'; // Өмнө үүсгэсэн RoomForm
import { useRoomEdit } from '@/hooks/useRoomEdit'; // Шинээр үүсгэсэн Hook
import { ImageManagementTab } from '@/components/ImageManagementTab.tsx';

const EditRoomPage: NextPage = () => {
    const router = useRouter();
    // URL-аас ID-г авах (string-ээр ирнэ)
    const roomId = router.query.id ? parseInt(router.query.id as string) : null;

    // Custom Hook-ийг дуудах
    const { room, loading, error, formik, isSubmitting, fetchRoom } = useRoomEdit(roomId);

    // 1. Ачаалах төлөв
    if (loading || !roomId) {
        return (
            <MainLayout>
                <Center className="min-h-[60vh]">
                    <Loader size="xl" color="indigo" />
                </Center>
            </MainLayout>
        );
    }
    
    // 2. Алдааны төлөв
    if (error || !room) {
        return (
            <MainLayout>
                <Container size="md" className="py-8">
                    <Alert icon={<IconAlertCircle size={24} />} title="Алдаа гарлаа" color="red">
                        {error || "Өрөөний мэдээлэл олдсонгүй."}
                    </Alert>
                </Container>
            </MainLayout>
        );
    }

    // 3. Үндсэн контент
    return (
        <MainLayout>
            <Container size="lg" className="py-8">
                <Stack gap="xl">
                    
                    {/* Гарчиг */}
                    <Group
                        justify="space-between"
                        align="center"
                        className="border-b pb-4 border-gray-200"
                    >
                        <Title
                            order={2}
                            className="text-3xl font-extrabold text-indigo-700 flex items-center gap-3"
                        >
                            <IconBuilding size={30} /> Өрөө Засварлах №{room.room_number}
                        </Title>
                        <Text className="text-gray-500">
                            Өрөөний мэдээлэл болон зургийг шинэчлэх.
                        </Text>
                    </Group>

                    {/* Tabs: Мэдээлэл Засварлах ба Зураг Удирдах */}
                    <Tabs defaultValue="details">
                        <Tabs.List>
                            <Tabs.Tab value="details" leftSection={<IconPencil size={20} />}>
                                Үндсэн Мэдээлэл
                            </Tabs.Tab>
                            <Tabs.Tab value="images" leftSection={<IconPhoto size={20} />}>
                                Зураг Удирдах ({room.images?.length || 0})
                            </Tabs.Tab>
                        </Tabs.List>

                        {/* 3.1. Мэдээлэл Засварлах Tab */}
                        <Tabs.Panel value="details" pt="lg">
                            <RoomForm 
                                formik={formik}
                                isSubmitting={isSubmitting}
                                apiError={null} // Алдааг hook дотор notification-оор харуулж байгаа
                            />
                        </Tabs.Panel>

                        {/* 3.2. Зураг Удирдах Tab */}
                        <Tabs.Panel value="images" pt="lg">
                            <ImageManagementTab 
                                roomId={roomId}
                                currentImages={room.images || []}
                                onImageUpdated={fetchRoom} // Зураг нэмэх/устгах үед датаг дахин татах функц
                            />
                        </Tabs.Panel>
                    </Tabs>
                    
                </Stack>
            </Container>
        </MainLayout>
    );
};

export default EditRoomPage;