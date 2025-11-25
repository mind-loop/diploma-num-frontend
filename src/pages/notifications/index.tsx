import { MainLayout } from "@/Layouts/MainLayout";
import { NotificationCard } from "@/components/NotificationCard.tsx";
import {
    getMyNotifications,
    markAllNotificationsAsSeen,
} from "@/services/notification";
import { Notification } from "@/services/notification/type";
import {
    Alert,
    Button,
    Center,
    Container,
    Group,
    Loader,
    Stack,
    Title
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
    IconAlertCircle,
    IconBell,
    IconMailOpened,
    IconRefresh
} from "@tabler/icons-react";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const NotificationsPage: NextPage = () => {
  const [notices, setNotices] = useState<Notification[]>([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // 💡 1. Мэдэгдлүүдийг татаж авах функц
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMyNotifications();
      setNotices(result.data);
      setUnseenCount(result.unseenCount);
    } catch (e: any) {
      setError(e.message || "Мэдэгдлүүдийг татаж чадсангүй.");
      notifications.show({
        title: "Алдаа",
        message: "Мэдэгдлүүд татахад алдаа гарлаа.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  // 💡 2. Бүгдийг Уншсан болгох функц
  const handleMarkAllAsSeen = async () => {
    if (unseenCount === 0) return;

    setIsUpdating(true);
    try {
      await markAllNotificationsAsSeen();

      // UI-ийг шинэчлэх: Бүх статусыг 'seen' болгох
      setNotices((prev) => prev.map((n) => ({ ...n, status: "seen" })));
      setUnseenCount(0);

      notifications.show({
        title: "Амжилттай",
        message: "Бүх мэдэгдлийг уншсан болголоо.",
        color: "green",
      });
    } catch (e) {
      notifications.show({
        title: "Алдаа",
        message: "Төлөвийг шинэчилж чадсангүй.",
        color: "red",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <Center className="min-h-[60vh]">
          <Loader size="xl" color="indigo" />
        </Center>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container size="md" className="py-8">
        {/* Гарчиг, Товчууд */}
        <Group
          justify="space-between"
          align="center"
          className="mb-8 border-b border-indigo-100 pb-4"
        >
          <Title
            c="blue"
            order={1}
            className="text-3xl font-extrabold flex items-center gap-3"
          >
            <IconBell size={32} /> Мэдэгдлүүд
          </Title>
          <Group gap="md">
            {unseenCount > 0 && (
              <Button
                size="md"
                variant="filled"
                color="yellow"
                onClick={handleMarkAllAsSeen}
                disabled={isUpdating}
                loading={isUpdating}
                leftSection={<IconMailOpened size={20} />}
              >
                Бүгдийг Уншсан Болгох ({unseenCount})
              </Button>
            )}
            <Button
              size="md"
              variant="subtle"
              color="indigo"
              onClick={fetchNotifications}
              leftSection={<IconRefresh size={20} />}
            >
              Шинэчлэх
            </Button>
          </Group>
        </Group>

        {/* Алдаа */}
        {error && (
          <Alert
            icon={<IconAlertCircle size={24} />}
            title="Алдаа гарлаа"
            color="red"
            variant="light"
            className="mb-6"
          >
            {error}
          </Alert>
        )}

        {/* Жагсаалт */}
        <Stack gap="lg">
          {notices.length === 0 ? (
            <Alert title="Хоосон" color="gray">
              Та одоогоор ямар ч мэдэгдэлгүй байна.
            </Alert>
          ) : (
            notices.map((n) => <NotificationCard key={n.id} notification={n} />)
          )}
        </Stack>
      </Container>
    </MainLayout>
  );
};

export default NotificationsPage;
