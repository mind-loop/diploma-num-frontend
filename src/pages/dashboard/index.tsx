// src/pages/dashboard/index.tsx (Жишээ)
import React from 'react';
import { MainLayout } from '@/Layouts/MainLayout';
import { RoomProvider, useRooms } from '../../context/RoomContext'; // 💡 RoomProvider-ийг импорт хийнэ
import { DashboardContent } from '@/components/DashboardContent';

const DashboardPage = () => {
    return (
        <MainLayout>
            {/* 💡 Энд RoomProvider-ээр бүх Dashboard-ын контентыг орооно */}
            <RoomProvider>
                <DashboardContent /> 
            </RoomProvider>
        </MainLayout>
    );
};
export default DashboardPage;
