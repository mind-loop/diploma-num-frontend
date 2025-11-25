import React, { useState } from 'react';
import { Container, Title, Paper, TextInput, Button, PasswordInput, Stack, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconLock, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { updatePassword } from '@/services/users';
import { useAuth } from '@/context/AuthContext'; // Токен хадгалахын тулд AuthContext-ийг ашиглана

// 💡 Шинэ нууц үг болон давтан нууц үгийг шалгах logic
interface FormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const SettingsPage: React.FC = () => {
    // AuthContext-ийн login функц эсвэл setToken функцийг ашиглан шинэ токенийг хадгална.
    const { setNewToken } = useAuth(); 
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState<string | null>(null);
    
    // Mantine Form Hook
    const form = useForm<FormValues>({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },

        validate: {
            currentPassword: (value) =>
                value.length < 6 ? 'Одоогийн нууц үг дор хаяж 6 тэмдэгттэй байна.' : null,
            newPassword: (value) =>
                value.length < 6 ? 'Шинэ нууц үг дор хаяж 6 тэмдэгттэй байна.' : null,
            confirmPassword: (value, values) =>
                value !== values.newPassword ? 'Нууц үгнүүд таарахгүй байна.' : null,
        },
    });

    const handleSubmit = async (values: FormValues) => {
        setLoading(true);
        setGeneralError(null);

        // 💡 Mantine loading notification
        notifications.show({
            id: 'password-update-loading',
            loading: true,
            title: 'Нууц үг шинэчилж байна...',
            message: 'Хүсэлтийг сервер рүү илгээж байна.',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            const payload = {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            };

            const response = await updatePassword(payload);
            
            // 💡 200: Амжилттай хариу ирвэл
            if (response.success && response.token) {
                // Шинэ токенийг хадгалах (Жишээ нь, LocalStorage болон Context-д)
                setNewToken(response.token); 
                
                notifications.update({
                    id: 'password-update-loading',
                    color: 'green',
                    title: 'Амжилттай!',
                    message: 'Нууц үг амжилттай солигдлоо. Таны эрх шинэчлэгдсэн.',
                    icon: <IconCheck size={18} />,
                    autoClose: 5000,
                });

                // Формыг цэвэрлэх
                form.reset();
            }
        } catch (error: any) {
            
            // 💡 401: Одоогийн нууц үг буруу эсвэл бусад API алдаа
            const errorMessage = error?.response?.data?.error?.message || 'Сервертэй холбогдоход алдаа гарлаа.';
            
            setGeneralError(errorMessage);
            
            notifications.update({
                id: 'password-update-loading',
                color: 'red',
                title: 'Алдаа гарлаа',
                message: errorMessage,
                icon: <IconAlertCircle size={18} />,
                autoClose: 7000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size={500} my={40}>
            <Title order={2} className='text-3xl font-bold text-gray-800 mb-6'>
                <IconLock size={30} className='inline mr-2' /> Нууц үг солих
            </Title>
            
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        {generalError && (
                            <Alert icon={<IconAlertCircle size={18} />} title="Алдаа" color="red">
                                {generalError}
                            </Alert>
                        )}

                        <PasswordInput
                            required
                            label="Одоогийн нууц үг"
                            placeholder="Одоогийн нууц үгээ оруулна уу"
                            {...form.getInputProps('currentPassword')}
                        />

                        <PasswordInput
                            required
                            label="Шинэ нууц үг"
                            placeholder="Шинэ нууц үг (мин. 6 тэмдэгт)"
                            {...form.getInputProps('newPassword')}
                        />
                        
                        <PasswordInput
                            required
                            label="Шинэ нууц үгийг давтах"
                            placeholder="Шинэ нууц үгийг баталгаажуулна уу"
                            {...form.getInputProps('confirmPassword')}
                        />

                        <Button type="submit" mt="xl" loading={loading} disabled={!form.isValid()}>
                            Нууц үг шинэчлэх
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default SettingsPage;