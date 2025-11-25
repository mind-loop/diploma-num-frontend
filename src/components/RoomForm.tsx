import React from 'react';
import {
    Button,
    TextInput,
    Textarea,
    NumberInput,
    Select,
    Stack,
    Group,
    Alert
} from "@mantine/core";
import {
    IconBuilding,
    IconListDetails,
    IconUsers,
    IconCheck,
    IconX,
    IconAlertCircle
} from "@tabler/icons-react";
import { FormikProps } from 'formik';
import { CreateRoomPayload } from '@/services/room/type';
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from '@/config/roomFormConfig';

interface RoomFormProps {
    formik: FormikProps<CreateRoomPayload>;
    isSubmitting: boolean;
    apiError: string | null;
}

export const RoomForm: React.FC<RoomFormProps> = ({ formik, isSubmitting, apiError }) => {

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100"
        >
            <Stack gap="lg">
                
                {/* 4.1. Өрөөний дугаар */}
                <NumberInput
                    label="Өрөөний Дугаар (Room Number)"
                    placeholder="Жишээ: 306"
                    required
                    allowDecimal={false}
                    leftSection={<IconBuilding size={16} />}
                    {...formik.getFieldProps("room_number")}
                    // NumberInput-д getFieldProps-ийг ашиглахдаа value нь string-ээр ирдэг тул
                    // Formik-ийн NumberInput-д зориулсан тусгай handler ашиглах нь зөв.
                    // Эсвэл NumberInput-ийн onChange-ийг гараар setFieldValue хийнэ:
                    value={formik.values.room_number || ''}
                    onChange={(value) => formik.setFieldValue('room_number', value)}
                    error={formik.touched.room_number && formik.errors.room_number}
                />

                {/* 4.2. Байршил */}
                <TextInput
                    label="Байршил (Location)"
                    placeholder="Жишээ: B Байр, 3-р давхар"
                    required
                    leftSection={<IconListDetails size={16} />}
                    {...formik.getFieldProps("location")}
                    error={formik.touched.location && formik.errors.location}
                />

                {/* 4.3. Ангилал */}
                <Select
                    label="Ангилал (Category)"
                    placeholder="Ангиллыг сонгох эсвэл оруулах"
                    data={CATEGORY_OPTIONS}
                    required
                    searchable
                    creatable
                    getCreateLabel={(query: string) => `+ Ангилал үүсгэх: ${query}`}
                    onCreate={(query: string) => ({ value: query, label: query })}
                    value={formik.values.category} 
                    onChange={(value) => formik.setFieldValue("category", value)}
                    onBlur={() => formik.setFieldTouched("category", true)}
                    error={formik.touched.category && formik.errors.category}
                />

                {/* 4.4. Багтаамж */}
                <NumberInput
                    label="Багтаамж (Capacity)"
                    placeholder="Хүний тоо"
                    required
                    min={1}
                    max={500}
                    allowDecimal={false}
                    leftSection={<IconUsers size={16} />}
                    value={formik.values.capacity || ''}
                    onChange={(value) => formik.setFieldValue('capacity', value)}
                    error={formik.touched.capacity && formik.errors.capacity}
                />

                {/* 4.5. Тайлбар */}
                <Textarea
                    label="Дэлгэрэнгүй Тайлбар (Description)"
                    placeholder="Том хэмжээний семинар, лекцэнд тохиромжтой танхим..."
                    required
                    minRows={4}
                    {...formik.getFieldProps("description")}
                    error={formik.touched.description && formik.errors.description}
                />

                {/* 4.6. Төлөв (Status) */}
                <Select
                    label="Төлөв (Status)"
                    placeholder="Өрөөний төлөвийг сонгоно уу"
                    data={STATUS_OPTIONS}
                    required
                    value={formik.values.status}
                    onChange={(value) => formik.setFieldValue("status", value)}
                    onBlur={() => formik.setFieldTouched("status", true)}
                    error={formik.touched.status && formik.errors.status}
                />
                
                {/* Алдааны Alert */}
                {apiError && (
                    <Alert
                      icon={<IconAlertCircle size={20} />}
                      title="Алдаа"
                      color="red"
                      variant="light"
                      className='mt-2'
                    >
                      {apiError}
                    </Alert>
                  )}


                {/* 4.7. Товч */}
                <Group justify="flex-end" className="mt-4">
                    <Button
                        type="submit"
                        size="lg"
                        loading={isSubmitting}
                        disabled={isSubmitting || !formik.isValid}
                        leftSection={<IconCheck size={20} />}
                        className="bg-indigo-600 hover:bg-indigo-700 transition duration-150"
                    >
                        Өрөө Үүсгэх
                    </Button>
                </Group>
            </Stack>
        </form>
    );
};