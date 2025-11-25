// src/pages/register.tsx
import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
  TextInput, PasswordInput, Button, Paper, Title, Text, Anchor, Stack, Group, Notification
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMail, IconLock, IconUser, IconPhone, IconBuilding, IconAlertCircle } from '@tabler/icons-react';
import Link from 'next/link';

import { useAuth } from '@/context/AuthContext';
import { RegisterPayload } from '@/services/users/type';
const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      phone: '',
      companyName: '',
    },
    validate: {
      username: (val) => (val.length < 3 ? 'Хэрэглэгчийн нэр 3-аас дээш тэмдэгттэй байна' : null),
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Буруу имэйл хаяг'),
      password: (val) => (val.length < 6 ? 'Нууц үг 6-аас дээш тэмдэгттэй байна' : null),
      phone: (val) => (val.length !== 8 ? 'Утасны дугаар 8 оронтой байна' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setErrorMessage(null);
    try {
        const payload: RegisterPayload = {
            username: values.username,
            email: values.email,
            password: values.password,
            phone: values.phone,
            companyName: values.companyName || undefined,
        };
        
        await register(payload);
        // AuthContext нь амжилттай бүртгүүлсний дараа Home руу шилжүүлнэ.

    } catch (error: any) {
        // AuthContext-ээс дамжуулсан алдааг энд барина
        setErrorMessage(error.message || 'Бүртгүүлэх үед гэнэтийн алдаа гарлаа.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Бүртгүүлэх | Өрөө Захиалгын Систем</title>
      </Head>
      
      {/* Tailwind classes: Хуудсыг төвлөрүүлж, background өгнө */}
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <Paper 
          radius="lg" 
          p={{ base: "lg", sm: "xl" }} 
          withBorder 
          className="w-full max-w-lg shadow-2xl"
        >
          <Title order={2} ta="center" mb="md" className="text-blue-600">
            Шинээр Бүртгүүлэх
          </Title>
          <Text c="dimmed" size="sm" ta="center" mb={30}>
            Өрөө захиалах эрх авахын тулд мэдээллээ оруулна уу
          </Text>

          {/* Алдааг харуулах */}
          {errorMessage && (
            <Notification 
              icon={<IconAlertCircle size={20} />} 
              color="red" 
              title="Бүртгэл Амжилтгүй" 
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
                label="Хэрэглэгчийн Нэр"
                placeholder="Ж: Батбилэг"
                leftSection={<IconUser size={18} />}
                {...form.getInputProps('username')}
                radius="md"
              />

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
              
              <TextInput
                required
                label="Утасны Дугаар"
                placeholder="99112233"
                leftSection={<IconPhone size={18} />}
                {...form.getInputProps('phone')}
                radius="md"
                type="number"
              />
              
              <TextInput
                label="Байгууллагын Нэр (Заавал биш)"
                placeholder="Ж: МТ Сургууль"
                leftSection={<IconBuilding size={18} />}
                {...form.getInputProps('companyName')}
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
              Бүртгүүлэх
            </Button>
          </form>

          <Text c="dimmed" size="sm" ta="center" mt="xl">
            Бүртгэлтэй юу?{' '}
            <Link href="/auth/login" passHref legacyBehavior>
              <Anchor size="sm" component="a">
                Нэвтрэх
              </Anchor>
            </Link>
          </Text>
        </Paper>
      </div>
    </>
  );
};

export default RegisterPage;