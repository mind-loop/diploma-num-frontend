// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";
import { getMe, loginUser, registerUser } from "../services/users";
import { LoginPayload, RegisterPayload, User } from "../services/users/type";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  setNewToken: (token: string) => Promise<void>;
}

// 1. Context-ийг үүсгэх
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Token-ийг хадгалаад, хэрэглэгчийн мэдээллийг татаж, state-д оруулах функц
const useAuthLogic = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUserAndLogin = useCallback(
    async (token: string) => {
      localStorage.setItem("authToken", token);
      try {
        const userData = await getMe();
        setUser(userData);
        notifications.show({
          color: "green",
          title: "Амжилттай",
          message: `Тавтай морилно уу, ${userData.username}!`,
        });

        const { redirect } = router.query;

        if (redirect && typeof redirect === "string") {
          // 1. Redirect URL байгаа бол тухайн зам руу шилжүүлнэ
          router.replace(redirect);
        } else {
          // 2. Redirect URL байхгүй бол Dashboard руу шилжүүлнэ
          router.replace("/dashboard");
        }
      } catch (err) {
        notifications.show({
          color: "red",
          title: "Алдаа",
          message: "Нэвтрэх үед хэрэглэгчийн мэдээлэл татаж чадсангүй.",
        });
        localStorage.removeItem("authToken");
        router.push("/home");
      }
    },
    [router]
  );

  // 3. Бүртгүүлэх функц (POST /users/register)
  const register = useCallback(
    async (payload: RegisterPayload) => {
      try {
        const response = await registerUser(payload);
        await fetchUserAndLogin(response.token);
      } catch (err: any) {
        // Service layer-ээс ирсэн алдааг дамжуулна
        const errorMsg = err.message || "Бүртгүүлэх үед гэнэтийн алдаа гарлаа.";
        notifications.show({
          color: "red",
          title: "Бүртгэл амжилтгүй",
          message: errorMsg,
        });
        throw new Error(errorMsg);
      }
    },
    [fetchUserAndLogin]
  );

  // 4. Гарах функц
  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setUser(null);
    notifications.show({
      message: "Системээс амжилттай гарлаа.",
      color: "gray",
    });
    router.push("/auth/login");
  }, [router]);

  // 5. Нэвтрэх функц (POST /users/login)
  // 💡 Одоогоор loginUser service-ийг бид үүсгээгүй тул token-ийг шууд ашиглаж байна.
  const login = useCallback(
    async (payload: LoginPayload) => {
      try {
        const response = await loginUser(payload);
        await fetchUserAndLogin(response.token);
      } catch (err: any) {
        const errorMsg = err.message || "Нэвтрэх үед гэнэтийн алдаа гарлаа.";
        notifications.show({
          color: "red",
          title: "Нэвтрэх Амжилтгүй",
          message: errorMsg,
        });
        throw new Error(errorMsg);
      }
    },
    [fetchUserAndLogin]
  );
  const setNewToken = useCallback(async (token: string) => {
    localStorage.setItem("authToken", token);
    try {
      const userData = await getMe();
      setUser(userData);
    } catch (err) {
      localStorage.removeItem("authToken");
      // Алдаа гарвал юу ч хийхгүй (notification-ийг Settings хуудас өөрөө хариуцна)
    }
  }, []);

  // 6. Эхний ачаалалтын үед хэрэглэгчийг шалгах (GET /users/me)
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const userData = await getMe();
          setUser(userData);
        } catch (error) {
          // Token хуучирсан бол устгана
          localStorage.removeItem("authToken");
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  return {
    user,
    isLoading,
    fetchUserAndLogin,
    register,
    login,
    logout,
    setNewToken,
  };
};

// 7. AuthProvider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading, register, login, logout, setNewToken } =
    useAuthLogic();

  if (isLoading) {
    // Context ачаалж дуустал бүх хуудсыг Block хийх
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        Loading Authentication...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading,
        setNewToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 8. Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth hook-ийг AuthProvider дотор ашиглах ёстой.");
  }
  return context;
};
