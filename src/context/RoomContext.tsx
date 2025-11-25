// src/context/RoomContext.tsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { Room ,RoomQuery} from '@/services/room/type';
import { getRooms } from '@/services/room';

interface RoomContextType {
  rooms: Room[];
  loading: boolean;
  error: string | null;
  fetchRooms: (query?: RoomQuery) => Promise<void>; // Өрөөг татаж авах функц
  // Дараа нь search, filter-ийн state-үүдийг нэмж болно
}
interface FetchParams {
    keyword?: string;
}
// 1. Context-ийг үүсгэх
const RoomContext = createContext<RoomContextType | undefined>(undefined);

// 2. Custom Hook
export const useRooms = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    // 💡 Алдааг гаргаж байгаа хэсэг ЭНЭ:
    throw new Error('useRooms must be used within a RoomProvider'); 
  }
  return context;
};

// 3. Provider Component
export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Өрөөнүүдийг API-аас татах функц
  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRooms();
      setRooms(response || []);
      // notifications.show({ message: `Нийт ${response.count} өрөө олдлоо.`, color: 'blue' });
    } catch (err: any) {
      const errorMsg = err.message || 'Өрөөний жагсаалтыг татахад алдаа гарлаа.';
      setError(errorMsg);
      notifications.show({ title: 'Өрөөний алдаа', message: errorMsg, color: 'red' });
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Анхны ачаалалтаар бүх өрөөг татах
  useEffect(() => {
    // AuthContext-ийн isLoading-ийг хүлээх шаардлагагүй тул шууд дуудаж болно
    fetchRooms();
  }, [fetchRooms]);

  const value = {
    rooms,
    loading,
    error,
    fetchRooms,
  };

  return (
    <RoomContext.Provider value={value}>
      {children}
    </RoomContext.Provider>
  );
};