import { useAuth } from '@/context/AuthContext';
import { Burger, Group, Text, Title } from '@mantine/core';
import React from 'react';

interface HeaderProps {
    onBurgerClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBurgerClick }) => {
    const { user } = useAuth();
    
    return (
        <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50 px-4 flex items-center justify-between border-b border-gray-200">
            <Group>
                {/* 💡 Burger Icon: Зөвхөн Mobile дээр харуулна */}
                <Burger 
                    opened={false} // Mantine Drawer-т төлөвийг ашиглахгүй тул false
                    onClick={onBurgerClick}
                    size="sm"
                    hiddenFrom="sm" // sm (640px) дээш нуугдана
                    className="text-gray-700"
                />
                
                <Title order={3} className="text-xl font-extrabold text-blue-600">
                    Өрөө Захиалгын Систем
                </Title>
            </Group>

            {/* Баруун талын хэрэглэгчийн мэдээлэл/Icon */}
            {/* ... */}
            <Text>
                {user?.username}
            </Text>
        </div>
    );
};