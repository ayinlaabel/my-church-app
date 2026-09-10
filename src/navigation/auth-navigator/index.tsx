import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors } from "../../theme/colors";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { ScreenNames } from "@screens/index";
import WelcomeScreen from "@screens/welcome";
import DashboardScreen from "@screens/dashboard";
import { HomeFilledIcon, HomeOutlineIcon } from "@components/SVG/home";
import { PersonFilledIcon, PersonOutlineIcon } from "@components/SVG/person";
import BookingScreen from "@screens/booking";
import { OrderFilledIcon, OrderOutlineIcon } from "@components/SVG/order";
import ProfileScreen from "@screens/profile";

const Tab = createBottomTabNavigator();

const AuthNavigator = () => {
  const { colorScheme } = useTheme();
  const tintColors = Colors[colorScheme];
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: tintColors.primary,
        tabBarInactiveTintColor: tintColors.muted,
        tabBarStyle: {
          backgroundColor: tintColors.background,
          borderTopColor: tintColors.border,
        },
      }}
    >
      <Tab.Screen
        name={ScreenNames.DASHBOARDSCREEN}
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            if (focused) {
              return <HomeFilledIcon width={20} height={20} color={color} />;
            }

            return <HomeOutlineIcon width={20} height={20} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name={ScreenNames.BOOKINGSCREEN}
        component={BookingScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            if (focused) {
              return <OrderFilledIcon width={20} height={20} color={color} />;
            }

            return <OrderOutlineIcon width={20} height={20} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name={ScreenNames.PROFILESCREEN}
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            if (focused) {
              return <PersonFilledIcon width={20} height={20} color={color} />;
            }
            return <PersonOutlineIcon width={20} height={20} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default AuthNavigator;
