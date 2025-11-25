import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Container,
  Grid,
  Loader,
  Title,
  Text,
  Alert,
  Center,
  Stack,
  Button, // 💡 Button-ийг нэмсэн
  Group, // 💡 Group-ийг нэмсэн
} from "@mantine/core";
import {
  IconBuilding,
  IconAlertCircle,
  IconTrash,
  IconPlus,
} from "@tabler/icons-react"; // 💡 IconPlus-ийг нэмсэн
import { MainLayout } from "@/Layouts/MainLayout";
import { useRooms } from "@/context/RoomContext";
import { useAuth } from "@/context/AuthContext"; // 💡 useAuth-ийг нэмсэн
import { RoomCard } from "@/components/RoomCard.tsx";
import { notifications } from "@mantine/notifications";
import { deleteRoom } from "@/services/room";

const RoomsPage: NextPage = () => {
  const { rooms, loading, error, fetchRooms } = useRooms();
  const { user } = useAuth(); // 💡 Хэрэглэгчийн Role-ийг татаж авсан
  const router = useRouter();

  // Role-ийг RoomCard-д тааруулах
  const currentRole: "ADMIN" | "CUSTOMER" =
    user?.role === "ADMIN" ? "ADMIN" : "CUSTOMER";

  useEffect(() => {
    if (!rooms) {
      fetchRooms();
    }
  }, [fetchRooms, rooms]);

  // 💡 Шинэ өрөө бүртгэх зам руу шилжих функц
  const handleCreateNewRoom = () => {
    router.push("/rooms/new");
  };

  // 💡 Өрөөний карт дээр дарахад ажиллах функц (Захиалагчийн үйлдэл)
  // Үүнийг RoomCard доторх товч руу шилжүүлсэн тул энэ функц одоо ашиглагдахгүй байж болно.
  // Гэхдээ Card-ын click-ийг хэвээр үлдээе.
  const handleRoomClick = (roomId: number) => {
    // Хэрэв админ бол дэлгэрэнгүйг харах, Хэрэв хэрэглэгч бол захиалах хуудас руу шилжиж болно.
    router.push(`orders/new?roomId=${roomId}`);
  };

  const [isDeleting, setIsDeleting] = useState(false);

  // ... (handleDeleteRoom функц хэвээр үлдэнэ) ...
  const handleDeleteRoom = async (roomId: number) => {
    if (
      !window.confirm(
        "Та энэ өрөөг бүрмөсөн устгахдаа итгэлтэй байна уу? Үйлдэл буцаагдахгүй."
      )
    ) {
      return;
    }

    // 💡 Устгах үйлдэл эхлэх үед Card компонент өөрөө loading-ийг удирдана.
    // setIsDeleting(true); // 👈 Энэ мөрийг хасна!

    notifications.show({
      id: "delete-loading",
      loading: true,
      title: "Устгаж байна...",
      message: `Өрөө ID: ${roomId}-ийг системээс устгаж байна.`,
      autoClose: false,
      withCloseButton: false,
    });

    try {
      await deleteRoom(roomId);

      // 💡 Устгасны дараа жагсаалтыг шинэчлэхдээ fetchRooms()-д параметр дамжуулна
      await fetchRooms({});

      notifications.update({
        id: "delete-loading",
        color: "green",
        title: "Амжилттай устгалаа",
        message: `Өрөө ID: ${roomId} амжилттай устгагдлаа.`,
        icon: <IconTrash size={18} />,
        autoClose: 3000,
      });
    } catch (err: any) {
      notifications.update({
        id: "delete-loading",
        color: "red",
        title: "Устгах үед алдаа гарлаа",
        message: err.message || "Сервертэй холбогдоход алдаа гарлаа.",
        icon: <IconTrash size={18} />,
        autoClose: 5000,
      });
    } finally {
    }
  };

  // 1. Ачааллах төлөв
  if (loading || isDeleting) {
    // Устгах үед ч Loader харуулах
    return (
      <MainLayout>
        <Center className="min-h-[60vh]">
          <Loader size="xl" color="indigo" />
        </Center>
      </MainLayout>
    );
  }

  // 2. Алдааны төлөв
  if (error) {
    return (
      <MainLayout>
        <Container size="xl" className="py-12">
          <Alert
            icon={<IconAlertCircle size={24} />}
            title="Алдаа гарлаа"
            color="red"
            variant="light"
          >
            Өрөөний жагсаалтыг татаж чадсангүй: {error}
          </Alert>
        </Container>
      </MainLayout>
    );
  }

  // 3. Үндсэн контент
  return (
    <MainLayout>
      <Container size="xl" className="py-8">
        {/* 💡 Хуудасны Гарчиг болон Товч */}
        <Group
          justify="space-between"
          className="mb-8 border-b border-indigo-100 pb-4"
        >
          <Stack gap="xs">
            <Title
              order={1}
              className="text-3xl font-extrabold text-indigo-700 flex items-center gap-3"
            >
              <IconBuilding size={32} /> Бүх Өрөөний Жагсаалт
            </Title>
            <Text className="text-gray-500">
              Захиалга хийх боломжтой болон бусад өрөөнүүдийн дэлгэрэнгүй
              мэдээлэл.
            </Text>
          </Stack>

          {/* 💡 Шинэ Өрөө Бүртгэх Товч (Зөвхөн Админд) */}
          {currentRole === "ADMIN" && (
            <Button
              leftSection={<IconPlus size={18} />}
              size="md"
              onClick={handleCreateNewRoom}
              className="bg-indigo-600 hover:bg-indigo-700 transition duration-150"
            >
              Шинэ Өрөө Бүртгэх
            </Button>
          )}
        </Group>

        {/* Өрөөний жагсаалт */}
        {rooms.length === 0 ? (
          // 3.1. Хоосон төлөв
          <Alert
            icon={<IconAlertCircle size={20} />}
            title="Өрөө олдсонгүй"
            color="orange"
            variant="light"
          >
            Системд бүртгэлтэй өрөө одоогоор байхгүй байна.
          </Alert>
        ) : (
          // 3.2. Өрөөнүүдийн Grid
          <Grid gutter="xl">
            {rooms.map((room) => (
              <Grid.Col key={room.id} span={{ base: 12, sm: 6, md: 4 }}>
                <div
                  // Card-ын click үйлдэл (Card доторх товч нь үйлдлийг удирдана)
                  className="h-full" // cursor-pointer-ийг Card доторх товч руу шилжүүлсэн нь дээр
                >
                  <RoomCard
                    isAdmin={currentRole === "ADMIN"}
                    onDeleteClick={handleDeleteRoom}
                    onBookClick={handleRoomClick}
                    room={room}
                  />
                </div>
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Container>
    </MainLayout>
  );
};

export default RoomsPage;
