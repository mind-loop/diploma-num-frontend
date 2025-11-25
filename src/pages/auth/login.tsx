// src/pages/login.tsx
import React, { useState } from 'react';
import Head from 'next/head';
import { 
  TextInput, PasswordInput, Button, Paper, Title, Text, Anchor, Stack, Notification
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMail, IconLock, IconAlertCircle } from '@tabler/icons-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LoginPayload } from '@/services/users/type';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Буруу имэйл хаяг'),
      password: (val) => (val.length === 0 ? 'Нууц үгээ оруулна уу' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setErrorMessage(null);
    try {
        const payload: LoginPayload = {
            email: values.email,
            password: values.password,
        };
        
        await login(payload);

    } catch (error: any) {
        setErrorMessage(error.message || 'Нэвтрэх үед гэнэтийн алдаа гарлаа.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Нэвтрэх | Өрөө Захиалгын Систем</title>
      </Head>
      
      {/* Tailwind classes: Хуудсыг төвлөрүүлж, background өгнө */}
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <Paper 
          radius="lg" 
          p={{ base: "lg", sm: "xl" }} 
          withBorder 
          className="w-full max-w-sm shadow-2xl"
        >
          <Title order={2} ta="center" mb="md" className="text-blue-600">
            Өрөө Захиалгын Систем
          </Title>
          <Text c="dimmed" size="sm" ta="center" mb={30}>
            Системд нэвтэрч үйлчилгээ авах боломжтой
          </Text>

          {/* Алдааг харуулах */}
          {errorMessage && (
            <Notification 
              icon={<IconAlertCircle size={20} />} 
              color="red" 
              title="Нэвтрэх Амжилтгүй" 
              withCloseButton
              onClose={() => setErrorMessage(null)}
              className="mb-4"
            >
              {errorMessage}
            </Notification>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                required
                label="Имэйл Хаяг"
                placeholder="email@university.edu"
                leftSection={<IconMail size={18} />}
                {...form.getInputProps('email')}
                radius="md"
              />

              <PasswordInput
                required
                label="Нууц Үг"
                placeholder="Таны нууц үг"
                leftSection={<IconLock size={18} />}
                {...form.getInputProps('password')}
                radius="md"
              />
            </Stack>

            <Button 
              type="submit" 
              radius="md" 
              fullWidth 
              mt="xl"
              loading={loading}
              disabled={loading}
            >
              Нэвтрэх
            </Button>
          </form>

          <Text c="dimmed" size="sm" ta="center" mt="xl">
            Бүртгэлгүй юу?{' '}
            <Link href="/auth/register" passHref legacyBehavior>
              <Anchor size="sm" component="a">
                Шинээр Бүртгүүлэх
              </Anchor>
            </Link>
          </Text>
        </Paper>
      </div>
    </>
  );
};

export default LoginPage;