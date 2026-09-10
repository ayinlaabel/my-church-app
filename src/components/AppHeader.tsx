import {
  Animated,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Bars } from "../svg/bars";
import { BellIcon } from "../svg/bell";
import { ThemedText } from "./ThemedText";
import { XMarkIcon } from "../svg/xmark";
import { Colors } from "@theme/colors";
import { useTheme, useThemeColor } from "@contexts/ThemeContext";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@contexts/AuthContext";
import { menuList } from "@utils/data";
import { AppHeaderProps, RootStackParamList } from "@declared-types/index";
import { DashboardIcon } from "../svg/dashboard";
import { HouseHoldIcon } from "../svg/household";
import { ReceiptIcon } from "../svg/receipt";
import { AppButton } from "./AppButton";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScreenNames } from "@screens/index";

const AppHeader = ({ currentScreen }: AppHeaderProps) => {
  const { colorScheme } = useTheme();
  const { isAuthenticated, profile, logout } = useAuth();
  const color = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const menuBackground = Colors[colorScheme].card;

  const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>();

  //   if (!isAuthenticated) {
  //     navigate(ScreenNames.LOGINSCREEN);
  //   }

  const handleSelectIcon = (item: string, isActive: boolean) => {
    switch (item) {
      case "Dashboard":
        return (
          <DashboardIcon
            height={20}
            width={20}
            color={
              isActive
                ? Colors[colorScheme].primary
                : Colors[colorScheme].deepMuted
            }
          />
        );
      case "Household":
        return (
          <HouseHoldIcon
            height={20}
            width={20}
            color={
              isActive
                ? Colors[colorScheme].primary
                : Colors[colorScheme].deepMuted
            }
          />
        );
      case "Giving & Pledges":
        return (
          <ReceiptIcon
            height={20}
            width={20}
            color={
              isActive
                ? Colors[colorScheme].primary
                : Colors[colorScheme].deepMuted
            }
          />
        );
      case "Dashboard":
        return <DashboardIcon />;

      default:
        break;
    }
  };

  useEffect(() => {
    if (menuVisible) {
      Animated.timing(menuAnimation, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [menuAnimation, menuVisible]);

  const openMenu = () => {
    setMenuVisible(true);
  };

  const closeMenu = () => {
    Animated.timing(menuAnimation, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setMenuVisible(false);
      }
    });
  };
  return (
    <>
      <View style={[styles.headerContainer]}>
        <View style={[styles.leftContainer]}>
          <Pressable
            accessibilityLabel="Open menu"
            accessibilityRole="button"
            hitSlop={12}
            onPress={openMenu}
            style={styles.iconButton}
          >
            <Bars height={25} width={25} color={color} />
          </Pressable>
        </View>
        <View style={[styles.rightContainer]}>
          <BellIcon height={25} width={25} color={color} />
        </View>
      </View>
      <Modal
        animationType="none"
        onRequestClose={closeMenu}
        transparent
        visible={menuVisible}
      >
        <View style={styles.menuOverlay}>
          <Pressable
            accessibilityLabel="Close menu"
            accessibilityRole="button"
            onPress={closeMenu}
            style={styles.menuBackdrop}
          />
          <Animated.View
            style={[
              styles.menu,
              { backgroundColor: menuBackground },
              {
                transform: [
                  {
                    translateX: menuAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-320, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.menuHeader}>
              <View>
                <ThemedText
                  type="title"
                  style={[
                    styles.menuTitle,
                    { color: Colors[colorScheme].primary },
                  ]}
                >
                  Church Portal
                </ThemedText>
                <ThemedText>Member Access</ThemedText>
              </View>
              <Pressable
                accessibilityLabel="Close menu"
                accessibilityRole="button"
                hitSlop={12}
                onPress={closeMenu}
              >
                <XMarkIcon color={Colors[colorScheme].muted} />
              </Pressable>
            </View>
            <View
              style={[
                styles.profileContainer,
                { backgroundColor: Colors[colorScheme].activeNavBg },
              ]}
            >
              <View style={[styles.profileImageContainer]}>
                {profile && profile.profilePicture ? (
                  <Image
                    source={{ uri: profile?.profilePicture }}
                    style={{ height: "100%", width: "100%" }}
                  />
                ) : (
                  <ThemedText>
                    {profile?.firstName.split("")[0] +
                      "" +
                      profile?.lastName.split("")[0]}
                  </ThemedText>
                )}
              </View>
              <View style={[styles.profileDetailsContainer]}>
                <ThemedText type="title" style={[styles.profileName]}>
                  {profile?.firstName + " " + profile?.lastName}
                </ThemedText>
                <ThemedText style={[styles.profileEmail]}>
                  {profile?.email}
                </ThemedText>
              </View>
            </View>
            {menuList.map((m, index) => (
              <View style={[{ paddingHorizontal: 20 }]} key={index}>
                <ThemedText
                  style={[
                    {
                      textTransform: "uppercase",
                      fontFamily: "Montserrat-Bold",
                      fontSize: 12,
                      color: Colors[colorScheme].muted,
                    },
                  ]}
                >
                  {m.name}
                </ThemedText>
                <View style={styles.menuItems}>
                  {m.items.map((item, i) => (
                    <Pressable
                      key={i}
                      onPress={() => {
                        closeMenu();
                        navigate(item.screenName);
                      }}
                      style={({ pressed }) => [
                        styles.menuItem,
                        pressed && {
                          backgroundColor: Colors[colorScheme].surface,
                        },
                        currentScreen === item.screenName && {
                          backgroundColor: Colors[colorScheme].activeNavBg,
                          borderWidth: 1,
                          borderColor: Colors[colorScheme].activeNavBorder,
                        },
                      ]}
                    >
                      <View style={[styles.navItem]}>
                        {handleSelectIcon(
                          item.name,
                          currentScreen === item.screenName,
                        )}
                        <ThemedText
                          type="defaultSemiBold"
                          style={[
                            { color: Colors[colorScheme].deepMuted },
                            currentScreen === item.screenName && {
                              color: Colors[colorScheme].primary,
                            },
                          ]}
                        >
                          {item.name}
                        </ThemedText>
                      </View>
                      {currentScreen === item.screenName && (
                        <View
                          style={[
                            styles.activeNav,
                            { backgroundColor: Colors[colorScheme].primary },
                          ]}
                        />
                      )}
                      {!item.isLive && (
                        <View
                          style={[
                            styles.csContainer,
                            {
                              backgroundColor:
                                Colors[colorScheme].statusPendingBackground,
                            },
                          ]}
                        >
                          <ThemedText
                            style={[
                              styles.csText,
                              { color: Colors[colorScheme].deepWarning },
                            ]}
                          >
                            Coming soon
                          </ThemedText>
                        </View>
                      )}
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}

            <View style={[styles.navFootContainer]}>
              <View style={[styles.footButtonContainer]}>
                <AppButton
                  title="Logout"
                  style={{ backgroundColor: "#900000", borderColor: "#900000" }}
                  onPress={() => {
                    closeMenu();
                    logout();
                    navigate(ScreenNames.LOGINSCREEN);
                  }}
                />
              </View>
              <View>
                <ThemedText>Version 0.0.1</ThemedText>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

export default AppHeader;

export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 50,
  },
  rightContainer: {},
  leftContainer: {},
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  menuOverlay: {
    flex: 1,
    flexDirection: "row",
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  },
  menu: {
    width: "82%",
    maxWidth: 320,
    paddingTop: 35,
    // paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  menuTitle: {
    fontSize: 24,
  },
  closeButton: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
  menuGreeting: {
    marginTop: 8,
    color: Colors.light.muted,
  },
  menuItems: {
    gap: 4,
    marginBottom: 20,
  },
  menuItem: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileContainer: {
    flexDirection: "row",
    paddingVertical: 20,
    gap: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  profileImageContainer: {
    height: 50,
    width: 50,
    borderRadius: 999,
    backgroundColor: "#900000",
    overflow: "hidden",
  },
  profileImage: {},
  profileDetailsContainer: {},
  profileName: {
    fontSize: 20,
  },
  profileEmail: {
    fontSize: 14,
  },
  navItem: {
    flexDirection: "row",
    gap: 5,
  },
  activeNav: {
    height: 8,
    width: 8,
    borderRadius: 100,
  },
  csContainer: {
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  csText: {
    fontSize: 10,
    fontFamily: "Montserrat-Bold",
  },
  navFootContainer: {
    height: 80,
    paddingHorizontal: 40,
    alignItems: "center",
    width: "100%",
    gap: 10,
    position: "absolute",
    bottom: 20,
  },
  footButtonContainer: {
    width: "100%",
  },
});
