import AuthNavigator from "@navigation/auth-navigator";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardScreen from "@screens/dashboard";
import { ScreenNames } from "@screens/index";
import LoginScreen from "@screens/login";
import { useAuth } from "@contexts/AuthContext";
import SubmitReportScreen from "@screens/submit-report";
import MinistryReportScreen from "@screens/ministry-report";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ScreenNames.LOGINSCREEN} component={LoginScreen} />
      <Stack.Screen
        name={ScreenNames.DASHBOARDSCREEN}
        component={DashboardScreen}
      />
      <Stack.Screen
        name={ScreenNames.MINISTRYREPORTSSCREEN}
        component={MinistryReportScreen}
      />
      <Stack.Screen
        name={ScreenNames.SUBMITREPORTSCREEN}
        component={SubmitReportScreen}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
