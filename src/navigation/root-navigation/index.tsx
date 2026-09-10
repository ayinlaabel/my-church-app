import AppNavigator from "@navigation/app-navigator";
import { NavigationContainer } from "@react-navigation/native";

const RootNavigation = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default RootNavigation;
