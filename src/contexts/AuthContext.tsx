import {
  createContext,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import * as SecureStore from "expo-secure-store";
import { type User as FirebaseUser } from "firebase/auth";
import { IProfile } from "@declared-types/index";

export type User = {
  canLoginViaKC: boolean;
  createdAt: string;
  email: string;
  firstName: string;
  id: string;
  lastLoggedIn: string;
  lastName: string;
  roles: string;
  status: string;
  updatedAt: string;
};

export type Profile = {
  address: string;
  birthday: string;
  canLoginViaKC: boolean;
  createdAt: string;
  email: string;
  firstName: string;
  gender: string;
  hasFinishedFoundationSchool: boolean;
  id: string;
  isBaptized: boolean;
  isBornAgain: boolean;
  kingschatDetails: any;
  kingschatUsername: string;
  lastName: string;
  maritalStatus: string;
  phoneNumber: string;
  profilePicture: string;
  updatedAt: string;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  profile: IProfile | null;
  isLoading: boolean;
  /**
   * Resolves with the signed-in user, or null if the user cancelled the flow.
   */
  setUser: (u: User) => Promise<void>;
  updateProfile: (u: IProfile) => Promise<void>;
  logout: () => Promise<void>;
  setToken: React.Dispatch<SetStateAction<string | null>>;
  setRefreshToken: React.Dispatch<SetStateAction<string | null>>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const AUTH_STORAGE_KEY = "mychurchapp.auth";

type PersistedAuth = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  profile: IProfile | null;
};

// function toUser(firebaseUser: FirebaseUser): User {
//   return {
//     id: firebaseUser.uid,
//     email: firebaseUser.email ?? "",
//     name: firebaseUser.displayName ?? undefined,
//     photo: firebaseUser.photoURL ?? undefined,
//   };
// }

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<IProfile | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadAuth = async () => {
      try {
        const storedAuth = await SecureStore.getItemAsync(AUTH_STORAGE_KEY);

        if (mounted && storedAuth) {
          const persistedAuth = JSON.parse(storedAuth) as PersistedAuth;
          setUserState(persistedAuth.user ?? null);
          setToken(persistedAuth.token ?? null);
          setRefreshToken(persistedAuth.refreshToken ?? null);
          setProfile(persistedAuth.profile ?? null);
        }
      } catch (error) {
        console.warn("Unable to restore the saved auth session", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadAuth();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const persistAuth = async () => {
      const persistedAuth: PersistedAuth = {
        user,
        token,
        refreshToken,
        profile,
      };

      try {
        if (persistedAuth.token || persistedAuth.profile) {
          await SecureStore.setItemAsync(
            AUTH_STORAGE_KEY,
            JSON.stringify(persistedAuth),
          );
        } else {
          await SecureStore.deleteItemAsync(AUTH_STORAGE_KEY);
        }
      } catch (error) {
        console.warn("Unable to persist the auth session", error);
      }
    };

    void persistAuth();
  }, [isLoading, profile, refreshToken, token, user]);

  const handleUpdateProfile = useCallback(async (u: IProfile) => {
    console.log("profile", u);
    setProfile(u);
  }, []);

  const handleUpdateUser = useCallback(async (u: User) => {
    console.log("User", u);
    setUserState(u);
  }, []);

  const logout = useCallback(async () => {
    setUserState(null);
    setProfile(null);
    setToken(null);
    setRefreshToken(null);

    await SecureStore.deleteItemAsync(AUTH_STORAGE_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      refreshToken,
      profile,
      isAuthenticated: profile !== null && user !== null && token !== null,
      isLoading,
      setUser: handleUpdateUser,
      setToken: setToken,
      setRefreshToken: setRefreshToken,
      updateProfile: handleUpdateProfile,
      logout,
    }),
    [
      user,
      token,
      refreshToken,
      profile,
      isLoading,
      setUserState,
      handleUpdateProfile,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
