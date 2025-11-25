import { RoomCard } from "@/components/RoomCard.tsx";
import { useAuth } from "@/context/AuthContext";
import { useRooms } from "@/context/RoomContext";
import { MainLayout } from "@/Layouts/MainLayout"; // 💡 MainLayout-ийг нэмсэн
import {
  Alert,
  Center,
  Container,
  Grid,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core"; // Шинэ импортууд
import { IconBuilding, IconSearch } from "@tabler/icons-react"; // Icon-ууд
import { NextPage } from "next";

const Home: NextPage = () => {
  const { rooms, loading } = useRooms();
  const { user } = useAuth();
  // 1. Ачааллах Төлөв
  if (loading) {
    return (
      <MainLayout>
        <Center className="min-h-[60vh]">
          <Loader size="xl" color="blue" />
        </Center>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* 💡 CONTAINER: Агуулгыг төвлөрүүлж, дээд/доор зай үүсгэсэн */}
      <Container size="xl" className="py-12 md:py-16">
        {/* 2. Хуудасны Толгой (Header) */}
        <Stack gap="xs" className="mb-10 border-b border-blue-100 pb-4">
          <Title
            order={1}
            className="text-4xl font-black text-gray-800 flex items-center gap-3"
          >
            <IconBuilding size={38} className="text-blue-600" />
            Боломжит Өрөөнүүд
          </Title>
          <Text className="text-lg text-gray-500">
            Хурлын болон үйл ажиллагааны өрөөнүүдийн дэлгэрэнгүй мэдээлэл.
          </Text>
        </Stack>

        {/* 3. Өрөөний Жагсаалт */}
        {rooms.length === 0 ? (
          // 3.1. Хоосон Төлөв (Empty State)
          <Alert
            icon={<IconSearch size={20} />}
            title="🤔 Өрөө олдсонгүй"
            color="orange"
            variant="light"
            className="mb-8 border-l-4 border-orange-500"
          >
            Идэвхтэй захиалга хийх боломжтой өрөө одоогоор байхгүй байна.
          </Alert>
        ) : (
          // 3.2. Өрөөнүүдийн Grid
          <Grid gutter="xl">
            {" "}
            {/* gutter-ийг "xl" болгож, хоорондын зайг томсгосон */}
            {rooms.map((room) => (
              <Grid.Col key={room.id} span={{ base: 12, sm: 6, md: 4 }}>
                <RoomCard
                  isAdmin={user?.role == "ADMIN" ? true : false}
                  room={room}
                />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Container>
    </MainLayout>
  );
};

export default Home;
