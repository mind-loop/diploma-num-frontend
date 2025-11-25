// src/components/OrderCard.tsx
import React from 'react';
// Mantine-ийн импортуудыг устгасан
// import { Card, Group, Text, Badge, Button, Stack, Image as MantineImage, Divider } from '@mantine/core';

import { Order } from '@/services/orders/type';
import { Image } from '@mantine/core'; // Next.js Image-ийг ашиглана
import { IconBuilding, IconCalendarEvent, IconCheck, IconClock, IconHash, IconInfoCircle, IconUsers, IconX } from '@tabler/icons-react'; // IconCheck нэмсэн
import dayjs from 'dayjs';
import Link from 'next/link';

interface OrderCardProps {
  order: Order;
  onCancel?: (orderId: number) => void;
onApprove?: (orderId: number) => void;
  showAdminActions?: boolean; 
}

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'approved': return 'bg-green-100 text-green-700 ring-green-500 border-l-green-500'; 
    case 'pending': return 'bg-yellow-100 text-yellow-700 ring-yellow-500 border-l-yellow-500';
    case 'rejected':
    case 'cancelled': return 'bg-red-100 text-red-700 ring-red-500 border-l-red-500'; 
    case 'completed': return 'bg-blue-100 text-blue-700 ring-blue-500 border-l-blue-500';
    default: return 'bg-gray-100 text-gray-700 ring-gray-300 border-l-gray-300';
  }
};

const getStatusText = (status: Order['status']) => {
  switch (status) {
    case 'approved': return 'Баталгаажсан';
    case 'pending': return 'Хүлээгдэж байна';
    case 'rejected': return 'Татгалзсан';
    case 'cancelled': return 'Цуцлагдсан';
    case 'completed': return 'Дууссан';
    default: return 'Тодорхойгүй';
  }
};

export const OrderCard: React.FC<OrderCardProps> = ({ order, onCancel, onApprove, showAdminActions }) => {
  const statusClasses = getStatusColor(order.status);
  const statusText = getStatusText(order.status);
  const borderLeftColorClass = statusClasses.split(' ').find(cls => cls.startsWith('border-l-')) || 'border-l-gray-300';

  const formattedStartTime = dayjs(order.start_time).format('YYYY оны MMM сарын DD-ний HH:mm');
  const formattedEndTime = dayjs(order.end_time).format('HH:mm'); 
  const formattedOrderDate = dayjs(order.orderDate).format('YYYY.MM.DD HH:mm');
  
  const roomImageUrl = order.room.images?.[0]?.image_url || '/images/placeholder-room.png';

  const canCancel = ['pending', 'approved'].includes(order.status);
  const canApprove = order.status === 'pending';

  return (
        <div 
            className={`bg-white shadow-lg rounded-xl border border-gray-200 
                  hover:shadow-xl transition-shadow duration-300 overflow-hidden 
                  ${borderLeftColorClass} border-l-4`} // 💡 Зүүн хил
        >
            
            {/* 1. Зураг (Дээд хэсэг) - 💡 ЭНД ЗАСВАР ОРУУЛСАН */}
            <div className="relative w-full h-48"> {/* 💡 w-full болон ТОГТМОЛ ӨНДӨР h-48 нэмсэн */}
                <Image
                    src={roomImageUrl}
                    alt={`Өрөө № ${order.room.room_number}`}
                    // Mantine Image-ийн хэмжээг агуулж буй div-д тааруулахын тулд
                    className="object-cover w-full h-full" 
                    // ❌ Mantine-ийн height/width props-ийг хэрэглэхгүй, CSS-ээр удирдана
                />
                
                {/* 💡 Төлвийн Badge-ийг зургийн дээд буланд байрлуулах */}
                <span 
                    className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider 
                              ${statusClasses.replace(/border-l-.*/, '')} shadow-md`} // Зүүн хилний классыг хасна
                >
                    {statusText}
                </span>
            </div>
            
            {/* 2. Мэдээлэл (Зургийн доорх агуулга) - Хэвээр үлдэнэ */}
            <div className="p-5 flex flex-col space-y-3">
                
                {/* Өрөөний нэр / Гарчиг */}
                <h3 className="font-extrabold text-2xl text-gray-800 leading-tight">
                    <Link href={`/rooms/${order.room_id}`} passHref legacyBehavior>
                        <a className="hover:text-blue-600 transition-colors">Өрөө № {order.room.room_number}</a>
                    </Link>
                </h3>
                
                {/* Хугацаа (Гол мэдээлэл) */}
                <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <IconClock size={20} className="text-blue-700 flex-shrink-0" />
                    <p className="text-base font-bold text-gray-900">
                        {formattedStartTime} - {formattedEndTime}
                    </p>
                </div>

                {/* Дэлгэрэнгүй Мэдээлэл (2 баганаар хуваах) */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 pt-1">
                    <div className="flex items-center gap-2">
                        <IconBuilding size={16} className="text-gray-500" />
                        <span className="truncate" title={order.room.location}>
                            {order.room.location}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <IconUsers size={16} className="text-gray-500" />
                        <span>{order.room.capacity} хүн</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <IconHash size={16} className="text-gray-500" />
                        <span>ID: #{order.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <IconCalendarEvent size={16} className="text-gray-500" />
                        <span className="text-xs">{dayjs(order.orderDate).format('YYYY.MM.DD')}</span>
                    </div>
                </div>
                
                <div className="border-t border-gray-100 my-2"></div>

                {/* Зорилго */}
                <div className="flex items-start gap-2">
                    <IconInfoCircle size={18} className="text-gray-700 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                        Зорилго: {order.purpose}
                    </p>
                </div>
            </div>

            {/* 3. Үйлдэл хийх товчууд (Доод хэсэг) - Хэвээр үлдэнэ */}
            <div className="flex justify-end gap-3 p-5 pt-0">
                {/* Баталгаажуулах товч (Admin) */}
                {showAdminActions && canApprove && onApprove && (
                    <button 
                        type="button" 
                        onClick={() => onApprove(order.id)}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg 
                                hover:bg-green-700 focus:outline-none transition-colors"
                    >
                        <IconCheck size={16} /> Баталгаажуулах
                    </button>
                )}
                
                {/* Цуцлах товч (User/Admin) */}
                {order.status!="approved" && canCancel && onCancel && (
                    <button 
                        type="button" 
                        onClick={() => onCancel(order.id)}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-red-600 border 
                                    border-red-600 rounded-lg hover:bg-red-50 focus:outline-none transition-colors"
                    >
                        <IconX size={16} /> Цуцлах
                    </button>
                )}
                
                {/* Үйлдэл хийх боломжгүй төлөв */}
                {!canCancel && (
                    <span 
                        className="text-xs font-semibold px-3 py-1 rounded-lg bg-gray-50 text-gray-500 
                                    ring-1 ring-inset ring-gray-300 self-center opacity-80"
                    >
                        Үйлдэл хийх боломжгүй
                    </span>
                )}
            </div>
        </div>
    );
};