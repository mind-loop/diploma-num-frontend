import React, { useState } from 'react';
import { Stack, Grid, Card, Button, Text, Image, Group, Alert, TextInput } from '@mantine/core';
import { IconPhoto, IconTrash, IconPlus, IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { RoomImage } from '@/services/room/type';
import { addRoomImage, deleteRoomImage } from '@/services/room';

interface ImageManagementTabProps {
    roomId: number;
    currentImages: RoomImage[];
    onImageUpdated: () => void; // Эцэг компонент руу шинэчлэгдсэн дохио өгөх
}

export const ImageManagementTab: React.FC<ImageManagementTabProps> = ({ roomId, currentImages, onImageUpdated }) => {
    const [newImageUrl, setNewImageUrl] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    
    // 💡 1. Зураг Нэмэх Үйлдэл
    const handleAddImage = async () => {
        if (!newImageUrl.trim()) {
            notifications.show({ title: 'Анхаар', message: 'Зургийн замыг (URL) оруулна уу.', color: 'yellow' });
            return;
        }

        setIsAdding(true);
        try {
            await addRoomImage({
                room_id: roomId,
                image_url: newImageUrl.trim(),
            });

            notifications.show({ title: 'Амжилттай', message: 'Зураг амжилттай нэмэгдлээ.', color: 'green' });
            setNewImageUrl('');
            onImageUpdated(); // Эцэг компонент руу датаг дахин татах дохио өгөх
        } catch (e: any) {
            notifications.show({ title: 'Алдаа', message: e.message || 'Зураг нэмэх үед алдаа гарлаа.', color: 'red' });
        } finally {
            setIsAdding(false);
        }
    };

    // 💡 2. Зураг Устгах Үйлдэл
    const handleDeleteImage = async (imageId: number) => {
        if (!window.confirm("Энэ зургийг бүрмөсөн устгахдаа итгэлтэй байна уу?")) {
            return;
        }
        
        notifications.show({ id: `delete-${imageId}`, loading: true, title: 'Устгаж байна...', message: 'Зургийг устгаж байна.', autoClose: false });

        try {
            await deleteRoomImage(imageId);

            notifications.update({ id: `delete-${imageId}`, title: 'Устгагдлаа', message: 'Зураг амжилттай устгагдлаа.', color: 'green', autoClose: 3000 });
            onImageUpdated(); // Эцэг компонент руу датаг дахин татах дохио өгөх
        } catch (e: any) {
             notifications.update({ id: `delete-${imageId}`, title: 'Алдаа', message: e.message || 'Зураг устгах үед алдаа гарлаа.', color: 'red', autoClose: 5000 });
        }
    };


    return (
        <Stack gap="xl">
            {/* 1. Зураг Нэмэх Хэсэг */}
            <Card withBorder radius="md" padding="lg">
                <Text fw={600} mb="md">Шинэ Зураг Нэмэх</Text>
                <Group wrap="nowrap" align="flex-end">
                    <TextInput
                        label="Зургийн Зам (Image URL)"
                        placeholder="/uploads/room/12/new_image.jpg"
                        value={newImageUrl}
                        onChange={(event) => setNewImageUrl(event.currentTarget.value)}
                        className="flex-grow"
                        leftSection={<IconPhoto size={16} />}
                        disabled={isAdding}
                    />
                    <Button
                        onClick={handleAddImage}
                        loading={isAdding}
                        leftSection={<IconPlus size={20} />}
                        className="bg-indigo-600 hover:bg-indigo-700"
                    >
                        Нэмэх
                    </Button>
                </Group>
                <Alert color="blue" variant='light' icon={<IconAlertCircle size={16} />} mt="md">
                    Жич: Та зургийг сервер дээр хадгалсны дараа замыг нь (URL/Path) энд оруулна.
                </Alert>
            </Card>

            {/* 2. Одоо байгаа Зургууд */}
            <Text fw={600} mt="lg">Одоо байгаа Зургууд ({currentImages.length})</Text>
            
            {currentImages.length === 0 ? (
                <Alert color="orange" variant='light' title="Зураггүй">
                    Энэ өрөөнд бүртгэгдсэн зураг одоогоор алга байна.
                </Alert>
            ) : (
                <Grid gutter="md">
                    {currentImages.map((img) => (
                        <Grid.Col key={img.id} span={{ base: 6, sm: 4, md: 3 }}>
                            <Card withBorder radius="md" padding="sm">
                                <Image
                                    src={img.image_url}
                                    alt={`Room Image ${img.id}`}
                                    height={150}
                                    fit="cover"
                                    radius="sm"
                                    fallbackSrc="https://via.placeholder.com/150"
                                />
                                <Button
                                    fullWidth
                                    mt="sm"
                                    color="red"
                                    variant="light"
                                    size="xs"
                                    onClick={() => handleDeleteImage(img.id)}
                                    leftSection={<IconTrash size={16} />}
                                >
                                    Устгах
                                </Button>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            )}
        </Stack>
    );
};