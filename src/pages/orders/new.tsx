// src/pages/orders/new.tsx
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "@/services/axios"; // axios импортыг зөв зам руу тохируулна уу
import { Button, Card, Text, Loader, Alert, Title, Stack, Textarea } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates"; // 💡 Цаг, өдөр сонгох Mantine компонент
import { useForm } from "@mantine/form"; // 💡 Form-ийн удирдлагыг хялбарчлах
import { notifications } from "@mantine/notifications";
import { MainLayout } from "@/Layouts/MainLayout";
import dayjs from "dayjs";

// API-д илгээх Payload
interface OrderPayload {
  room_id: number;
  start_time: string; // ISO 8601
  end_time: string;   // ISO 8601
  purpose: string;
}

// Form-ийн state-үүд
interface FormValues {
  startDate: Date | null;
  endDate: Date | null;
  purpose: string;
}

export default function NewOrderPage() {
  const router = useRouter();
  const { roomId } = router.query;
  const roomID = roomId ? Number(roomId) : null;

  const [loadingRoom, setLoadingRoom] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [room, setRoom] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // 💡 Mantine Form-ийг ашиглах
  const form = useForm<FormValues>({
    initialValues: {
      startDate: null,
      endDate: null,
      purpose: '',
    },
    validate: {
      startDate: (val) => (val ? null : 'Эхлэх цагийг сонгоно уу'),
      endDate: (val, values) => {
        if (!val) return 'Дуусах цагийг сонгоно уу';
        if (values.startDate && val <= values.startDate) return 'Дуусах цаг эхлэхээс хойш байх ёстой';
        return null;
      },
      purpose: (val) => (val.length < 5 ? 'Захиалгын зорилгыг 5-аас дээш тэмдэгтээр оруулна уу' : null),
    },
  });

  // --- Load room data ---
  useEffect(() => {
    if (!roomID || isNaN(roomID)) {
      setError("Өрөөний ID буруу байна.");
      setLoadingRoom(false);
      return;
    }

    setLoadingRoom(true);
    axios
      .get(`/rooms/${roomID}`)
      .then((res) => {
        setRoom(res.data.data);
      })
      .catch(() => {
        setError("Өрөөний мэдээлэл татахад алдаа гарлаа. ID: " + roomID);
      })
      .finally(() => {
        setLoadingRoom(false);
      });
  }, [roomID]);


  // --- Submit Logic ---
const handleSubmit = async (values: FormValues) => {
    if (!values.startDate || !values.endDate) return;

    setLoadingSubmit(true);
    setError(null);
    try {
      
      // 💡 ШИЙДЭЛ: Dayjs-ийг ашиглан утгыг Date объект болгож, ISO формат руу хөрвүүлэх
      const startTimeISO = dayjs(values.startDate).toISOString();
      const endTimeISO = dayjs(values.endDate).toISOString();

      const payload: OrderPayload = {
        room_id: roomID!,
        start_time: startTimeISO, // 💡 Зөв ISO формат
        end_time: endTimeISO,      // 💡 Зөв ISO формат
        purpose: values.purpose,
      };

      await axios.post("/orders", payload);

      notifications.show({
        title: "Захиалга Амжилттай",
        message: "Таны өрөөний захиалга бүртгэгдлээ. Баталгаажуулалт хүлээгдэж байна.",
        color: "green",
      });
      router.push("/orders/my"); 

    } catch (err: any) {
      const apiError = err.response?.data?.error?.message || "Захиалга үүсгэх үед алдаа гарлаа.";
      setError(apiError);
      notifications.show({ title: "Алдаа", message: apiError, color: "red" });
    } finally {
      setLoadingSubmit(false);
    }
  }

  if (loadingRoom) return <Loader size="xl" className="mx-auto mt-20" />;
  if (error && !room) return (
    <MainLayout>
      <Alert color="red" title="Алдаа">{error}</Alert>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="flex justify-center mt-10">
        <Card shadow="xl" radius="lg" className="w-full max-w-lg p-8 bg-white">
          <Title order={2} className="mb-4 text-blue-600">
            📚 Шинэ Захиалга Үүсгэх
          </Title>

          <Text fw={600} size="lg" className="text-gray-800">
            Өрөө: {room?.category || room?.name} - №{room?.room_number}
          </Text>
          <Text mb="xl" c="dimmed">
            Байршил: {room?.location}
          </Text>

          {error && (
            <Alert color="red" mb="md" title="Алдаа">
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              {/* 💡 DateTimePicker нь цаг, өдөр сонгох боломжийг нэмнэ */}
              <DateTimePicker
                label="Эхлэх Цаг"
                placeholder="Захиалга эхлэх өдөр, цаг"
                valueFormat="YYYY-MM-DD HH:mm"
                minDate={new Date()}
                {...form.getInputProps('startDate')}
                required
              />

              <DateTimePicker
                label="Дуусах Цаг"
                placeholder="Захиалга дуусах өдөр, цаг"
                valueFormat="YYYY-MM-DD HH:mm"
                minDate={form.values.startDate || new Date()}
                {...form.getInputProps('endDate')}
                required
              />

              {/* 💡 Зорилгын талбарыг нэмсэн */}
              <Textarea
                label="Захиалгын Зорилго"
                placeholder="Жишээ: Төслийн багийн уулзалт эсвэл семинар"
                {...form.getInputProps('purpose')}
                minRows={3}
                required
              />
              
              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={loadingSubmit}
                disabled={!roomID}
                className="mt-6"
              >
                Захиалга Баталгаажуулах
              </Button>
            </Stack>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}