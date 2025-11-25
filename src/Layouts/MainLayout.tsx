import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/SideBar";
import {
  Center,
  Container,
  Image,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core"; // Image, Title, Container нэмсэн
import { IconHome } from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Header } from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Үндсэн Layout Component (Navbar, Sidebar, Content)
 * МУИС-ийн Уур Амьсгалтай User-Friendly Загвар
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const isPublicPage = router.pathname === "/home";
  const isAuthPage =
    router.pathname === "/auth/login" || router.pathname === "/auth/register"; // 💡 МУИС-ийн төвийн зураг гэж үзэн, та өөрийн зургаар солино уу.
  const NUM_BANNER_IMAGE =
    "https://news.num.edu.mn/wp-content/uploads/2015/01/muis2.png"; // Та өөрийн зургаа public/images дотор байрлуулна. // 1. Ачааллах төлөв
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const toggleSidebar = () => setSidebarOpened((o) => !o);
  if (isLoading) {
    return (
      <Center className="min-h-screen bg-indigo-50">
        <Stack align="center" gap="lg">
          <Loader size="xl" color="indigo" />
          <Title order={3} className="text-indigo-700 font-extrabold">
            Өгөгдөл Ачаалж байна...
          </Title>
        </Stack>
      </Center>
    );
  } // 2. Нэвтрэлтийн хамгаалалт (Private Page-уудад)

  if (!isAuthenticated && !isAuthPage && !isPublicPage) {
    router.replace("/auth/login");
    return null;
  } // 3. Auth Page-д зөвхөн children-ийг харуулна

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        {children}
      </div>
    );
  } // 4. Үндсэн Layout

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>МУИС | Өрөө Захиалгын Систем</title>
      </Head>
      <Navbar
        opened={isAuthenticated ? sidebarOpened : false}
        onBurgerClick={isAuthenticated ? toggleSidebar : undefined}
      />
      <div className="flex pt-16">
        {isAuthenticated && (
          <Sidebar
            opened={sidebarOpened}
            onClose={() => setSidebarOpened(false)}
          />
        )}
         {" "}
        <main
          className={`flex-grow w-full transition-all duration-300 ${
            isAuthenticated ? "md:ml-64" : "mx-auto"
          }`}
        >
          {/* 💡 БАННЕР ХЭСЭГ (Зөвхөн Home page-д харуулах) */}
          {isPublicPage && (
            <div className="relative h-100 md:h-140 overflow-hidden shadow-xl">
              {/* 💡 Зураг: Cover Image */}
              <Image
                src={NUM_BANNER_IMAGE}
                alt="МУИС-ийн кампус"
                className="object-cover w-full h-full"
                style={{ filter: "brightness(70%)" }} // Зурагны тодотгоог багасгаж текстийг тодосгох
              />

              {/* 💡 Текст: Зургийн дээр давхарласан */}
              <Container
                size="xl"
                className="absolute inset-0 flex flex-col justify-center items-center text-center p-4"
              >
                <Stack gap="sm" align="center">
                  <IconHome size={45} className="text-white drop-shadow-md" />
                  <Title
                    order={1}
                    className="text-white text-3xl md:text-5xl font-extrabold drop-shadow-lg"
                  >
                    МУИС-ийн Өрөө Захиалгын Систем
                  </Title>
                  <Text
                    c={"white"}
                    fw={700}
                    className="text-indigo-200 text-base md:text-xl drop-shadow-md max-w-2xl"
                  >
                    Хурал, уулзалт, семинарын өрөөнүүдийг хурдан, хялбар
                    захиалаарай.
                  </Text>
                </Stack>
              </Container>
            </div>
          )}

          {/* 💡 Контент - Баннерийн доор */}
          <div
            className={`
                bg-white shadow-lg rounded-xl min-h-screen
                ${
                  isPublicPage
                    ? "p-6 md:p-10 mx-4 md:mx-8 -mt-10 relative z-10"
                    : "p-6 md:p-10 m-4 md:m-8"
                }
            `}
          >
            {children}
          </div>
        </main>
      </div>
      {/* 4.4. Footer (МУИС-ийн өнгөөр) */}
      <footer className="w-full p-4 bg-indigo-700 text-center text-sm mt-0">
        <Text c={"white"}>
          NATIONAL UNIVERSITY OF MONGOLIA | © {new Date().getFullYear()} Өрөө
          Захиалгын Систем.
        </Text>
      </footer>
    </div>
  );
};
