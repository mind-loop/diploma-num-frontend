import { useRooms } from "@/context/RoomContext";
import {
  Alert,
  Button,
  Center,
  Container,
  Grid,
  Group,
  Loader,
  Title,
} from "@mantine/core";
import { IconAlertCircle, IconRefresh, IconTrash } from "@tabler/icons-react";
import React, { useState, useMemo } from "react"; // 💡 useState, useMemo нэмсэн

import { useAuth } from "@/context/AuthContext";
import { deleteRoom } from "@/services/room";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { RoomCard } from "./RoomCard.tsx";
import SearchBar from "./Searchbar";

/**
 * Dashboard-ийн үндсэн агуулга. RoomProvider-оор ороогдсон байна.
 */
export const DashboardContent: React.FC = () => {
  // 💡 Context-ээс бүх өрөөнүүд татагдаж ирнэ
  const { rooms, loading, error, fetchRooms } = useRooms();
  const { user } = useAuth();
  const router = useRouter();

  // 💡 1. Хайлтын утгыг хадгалах state
  const [searchTerm, setSearchTerm] = useState(""); // 💡 2. Өрөөнүүдийг шүүх логик (useMemo ашиглан гүйцэтгэлийг оновчтой болгоно)

  const filteredRooms = useMemo(() => {
    if (!searchTerm) {
      return rooms;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();

    return rooms.filter((room) => {
      // Өрөөний дугаар, байршил, ангиллаар хайлт хийх
      const roomNumberMatch = room.room_number
        .toString()
        .includes(lowerCaseSearch);
      const locationMatch = room.location
        .toLowerCase()
        .includes(lowerCaseSearch);
      const categoryMatch = room.category
        .toLowerCase()
        .includes(lowerCaseSearch);

      return roomNumberMatch || locationMatch || categoryMatch;
    });
  }, [rooms, searchTerm]); // rooms болон searchTerm өөрчлөгдөхөд дахин тооцоолно. // 💡 3. handleSearch функцийг Local Filtering хийхээр өөрчилсөн

  const handleSearch = (term: string) => {
    console.log("Хайлт хийх утга (Local):", term);
    setSearchTerm(term); // State-д хадгална, useMemo автоматаар шүүнэ
  };

  // ... handleDeleteRoom хэсэг өөрчлөгдөөгүй ...
  const handleDeleteRoom = async (roomId: number) => {
    if (
      !window.confirm(
        "Та энэ өрөөг бүрмөсөн устгахдаа итгэлтэй байна уу? Үйлдэл буцаагдахгүй."
      )
    ) {
      return;
    }
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
    }
  };
  // ... handleBookClick хэсэг хэвээр үлдэнэ ...
  const handleBookClick = (roomId: number) => {
    router.push(`/orders/new?roomId=${roomId}`);
  };

  return (
    <Container size="xl" className="py-2">
      <Title order={1} className="text-3xl font-bold text-gray-800 mb-6">
        👋 Сайн байна уу, {user?.username?.toUpperCase() || "Хэрэглэгч"}
      </Title>
      <hr className="my-8" />
      <Group justify="space-between" align="center" mb="lg">
        <Title order={2} className="text-2xl font-semibold text-gray-700">
          Захиалгад Нээлттэй Өрөөнүүд
        </Title>
        <SearchBar
          onSearch={handleSearch} // 💡 Шинэ Local Filter функцийг дуудна
          placeholder="Өрөөний дугаар, байршил, ангиллаар хайх..."
        />
      </Group>
      {loading && (
        <Center className="h-40">
          {" "}
          <Loader size="lg" />
        </Center>
      )}
      {error && (
        <Alert
          icon={<IconAlertCircle size={20} />}
          title="Өрөөнүүдийг татаж чадсангүй"
          color="red"
          className="mb-6"
        >
          {error}
          <Button
            onClick={() => {
              fetchRooms({});
              setSearchTerm("");
            }} // 💡 Дахин ачаалахдаа хайлтыг цэвэрлэх
            variant="light"
            color="red"
            mt="md"
            leftSection={<IconRefresh size={18} />}
          >
            Дахин ачаалах
          </Button>
        </Alert>
      )}
      {!loading &&
        filteredRooms.length === 0 &&
        !error && ( // 💡 filteredRooms-ийг шалгаж байна
          <Alert title="Мэдээлэл олдсонгүй" color="orange">
            Таны хайлтаар өрөө олдсонгүй. Шүүлтүүрүүдийг шалгана уу.
          </Alert>
        )}
      {!loading &&
        filteredRooms.length > 0 && ( // 💡 filteredRooms-ийг рендерлэж байна
          <Grid gutter="xl">
            {filteredRooms.map((room) => (
              <Grid.Col key={room.id} span={{ base: 12, sm: 6, lg: 4 }}>
                <RoomCard
                  room={room}
                  onBookClick={handleBookClick}
                  onDeleteClick={handleDeleteRoom}
                  isAdmin={user?.role === "ADMIN"}
                />
              </Grid.Col>
            ))}
          </Grid>
        )}
    </Container>
  );
};
