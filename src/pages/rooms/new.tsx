import { MainLayout } from "@/Layouts/MainLayout";
import { RoomForm } from "@/components/RoomForm"; // 💡 Тусгаарласан Form компонент
import { useRoomCreation } from "@/hooks/useRoomCreation"; // 💡 Custom Hook
import {
    Container,
    Group,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { IconBuilding } from "@tabler/icons-react";
import { NextPage } from "next";

const NewRoomPage: NextPage = () => {
    // 💡 Бүх логикийг Custom Hook-оос авсан
    const { formik, isSubmitting, apiError } = useRoomCreation();

    return (
        <MainLayout>
            <Container size="md" className="py-8">
                <Stack gap="xl">
                    
                    {/* 1. Гарчиг */}
                    <Group
                        justify="space-between"
                        align="center"
                        className="border-b pb-4 border-gray-200"
                    >
                        <Title
                            order={2}
                            className="text-3xl font-extrabold text-indigo-700 flex items-center gap-3"
                        >
                            <IconBuilding size={30} /> Шинэ Өрөө Үүсгэх
                        </Title>
                        <Text className="text-gray-500">
                            Өрөөний үндсэн мэдээллийг оруулна уу.
                        </Text>
                    </Group>

                    {/* 2. Үндсэн Форм (RoomForm компонентоор сольсон) */}
                    <RoomForm 
                        formik={formik}
                        isSubmitting={isSubmitting}
                        apiError={apiError}
                    />
                    
                </Stack>
            </Container>
        </MainLayout>
    );
};

export default NewRoomPage;