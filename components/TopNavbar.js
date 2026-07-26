// components/TopNavbar.js
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  Pressable,
  StatusBar,
  Text,
  View,
  useColorScheme,
} from "react-native";

import { getCurrentUser, logoutUser } from "../services/authApi";
import { styles } from "../styles/HeaderStyle/TopNavbarStyles";
import SidebarInfoNav from "./SidebarInfoNav";

// ✅ Logout modal
import LogoutConfirmModal from "./modal/LogoutConfirmModal";

const NAV_HEIGHT = 56;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function TopNavbar() {
  const router = useRouter();
  const pathname = usePathname?.() || "/";
  const colorScheme = useColorScheme?.() || "light";

  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [elevated, setElevated] = useState(false);
  const [user, setUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // ✅ Logout modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const isWeb = Platform.OS === "web";
  const isDark = colorScheme === "dark";
  const isNarrow = SCREEN_WIDTH < 640;

  const isAdmin = user?.role === "admin";

  // THEME TOKENS
  const tokens = useMemo(() => {
    const glass = isDark ? "rgba(8,16,28,0.55)" : "rgba(11,26,42,0.45)";
    const solid = isDark ? "#0B1A2A" : "#08305F";
    const border = isDark
      ? "rgba(255,255,255,0.12)"
      : "rgba(255,255,255,0.18)";
    const fg = "#fff";
    const subtle = isDark
      ? "rgba(255,255,255,0.75)"
      : "rgba(255,255,255,0.9)";
    const cta = "#FFD166";
    return { glass, solid, border, fg, subtle, cta };
  }, [isDark]);

  // Scroll awareness (web)
  useEffect(() => {
    if (!isWeb) return;
    const onScroll = () => setElevated(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isWeb]);

  // Load user from token
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("koedu_token");
        if (!token) {
          setUser(null);
          return;
        }
        const me = await getCurrentUser();
        setUser(me?.user || me || null);
      } catch (e) {
        console.log("getCurrentUser error", e.message);
        setUser(null);
      }
    })();
  }, [pathname]);

  // Mobile dropdown animation
  const dropAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(dropAnim, {
      toValue: menuOpen ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [menuOpen]);

  /**
   * TOP NAV ITEMS (MINIMAL)
   * - Always: Home, About
   * - Admin only: Admin
   * - Guest only: Apply, Login
   */
  const navItems = useMemo(() => {
    const base = [
      { label: "Home", route: "/" },
      { label: "About", route: "/info/about" },
    ];

    if (user && isAdmin) {
      base.push({ label: "Admin", route: "/admin/dashboard" });
    }

    if (!user) {
      base.push(
        { label: "Apply", route: "/auth/login", cta: true },
        { label: "Login", route: "/auth/login" }
      );
    }

    return base;
  }, [user, isAdmin]);

  const handleNavigate = (route) => {
    setMenuOpen(false);
    setUserMenuOpen(false);
    router.push(route);
  };

  // ✅ Open modal instead of logging out instantly
  const openLogoutModal = () => {
    if (logoutLoading) return;
    setShowLogoutModal(true);
  };

  const cancelLogout = () => {
    if (logoutLoading) return;
    setShowLogoutModal(false);
  };

  const confirmLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);

    try {
      await logoutUser?.();
    } catch (e) {
      console.log("logoutUser error:", e?.message || e);
    }

    await AsyncStorage.removeItem("koedu_token");
    await AsyncStorage.removeItem("koedu_user");

    setUser(null);
    setUserMenuOpen(false);
    setMenuOpen(false);

    setLogoutLoading(false);
    setShowLogoutModal(false);

    router.replace("/");
  };

  const bgStyle = isWeb
    ? [
        {
          backgroundColor: elevated ? tokens.solid : tokens.glass,
          backdropFilter: elevated ? "none" : "saturate(1.2) blur(10px)",
          WebkitBackdropFilter: elevated ? "none" : "saturate(1.2) blur(10px)",
        },
      ]
    : [{ backgroundColor: tokens.solid }];

  // ───────── MOBILE MENU ─────────
  const MobileMenu = (
    <Animated.View
      style={[
        styles.mobileMenu,
        {
          backgroundColor: tokens.glass,
          borderColor: tokens.border,
          transform: [
            {
              translateY: dropAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-8, 0],
              }),
            },
          ],
          opacity: dropAnim,
          ...(isWeb ? { backdropFilter: "saturate(1.2) blur(10px)" } : null),
        },
      ]}
      pointerEvents={menuOpen ? "auto" : "none"}
    >
      {navItems.map((item, idx) => {
        const active = pathname === item.route;
        return (
          <Pressable
            key={idx}
            onPress={() => handleNavigate(item.route)}
            style={({ pressed }) => [
              styles.mobileItem,
              { borderColor: tokens.border },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text
              style={[
                styles.mobileLink,
                { color: tokens.fg },
                item.cta && {
                  backgroundColor: "rgba(255,209,102,0.2)",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                  color: "#0b1a2a",
                },
              ]}
            >
              {item.label}
            </Text>

            {active && (
              <View
                style={[styles.activeDot, { backgroundColor: tokens.cta }]}
              />
            )}
          </Pressable>
        );
      })}

      <View
        style={[styles.mobileDivider, { backgroundColor: tokens.border }]}
      />

      <Pressable
        onPress={() => {
          setMenuOpen(false);
          setSidebarVisible(true);
        }}
        style={styles.mobileItem}
      >
        <Text style={[styles.mobileLink, { color: tokens.subtle }]}>
          Info Menu
        </Text>
      </Pressable>

      {user && (
        <>
          <View
            style={[styles.mobileDivider, { backgroundColor: tokens.border }]}
          />

          <Pressable
            onPress={() =>
              handleNavigate(isAdmin ? "/admin/account/my-info" : "/student/profile")
            }
            style={styles.mobileItem}
          >
            <Text style={[styles.mobileLink, { color: tokens.fg }]}>
              My Account
            </Text>
          </Pressable>

          {isAdmin && (
            <Pressable
              onPress={() => handleNavigate("/admin/account")}
              style={styles.mobileItem}
            >
              <Text style={[styles.mobileLink, { color: tokens.fg }]}>
                Account Settings
              </Text>
            </Pressable>
          )}

          <Pressable onPress={openLogoutModal} style={styles.mobileItem}>
            <Text style={[styles.mobileLink, { color: "#fecaca" }]}>
              Sign out
            </Text>
          </Pressable>
        </>
      )}
    </Animated.View>
  );

  // ───────── USER MENU (desktop) ─────────
  const UserMenu =
    user && (
      <View style={styles.userMenuWrap}>
        <Pressable
          onPress={() => setUserMenuOpen((v) => !v)}
          style={({ pressed }) => [
            styles.userAvatarBtn,
            pressed && { opacity: 0.8 },
          ]}
          hitSlop={8}
        >
          <Ionicons name="person-circle-outline" size={28} color={tokens.fg} />
          <Text style={[styles.userName, { color: tokens.fg }]}>
            {user.username || user.fullName || "User"}
          </Text>
          <Ionicons
            name={userMenuOpen ? "chevron-up" : "chevron-down"}
            size={16}
            color={tokens.subtle}
          />
        </Pressable>

        {userMenuOpen && (
          <View
            style={[
              styles.userMenuCard,
              {
                backgroundColor: tokens.glass,
                borderColor: tokens.border,
              },
            ]}
          >
            <Text style={styles.userMenuSection}>My Account</Text>

            {isAdmin && (
              <UserMenuItem
                label="Admin dashboard"
                icon="speedometer-outline"
                onPress={() => handleNavigate("/admin/dashboard")}
              />
            )}

            <UserMenuItem
              label="My Informations"
              icon="person-outline"
              onPress={() =>
                handleNavigate(
                  isAdmin ? "/admin/account/my-info" : "/student/profile"
                )
              }
            />

            <Text style={styles.userMenuSection}>Account Settings</Text>

            {isAdmin ? (
              <>
                <UserMenuItem
                  label="Security & sign-in"
                  icon="shield-checkmark-outline"
                  onPress={() => handleNavigate("/admin/account/security")}
                />
                <UserMenuItem
                  label="Notifications"
                  icon="notifications-outline"
                  onPress={() => handleNavigate("/admin/account/notifications")}
                />
                <UserMenuItem
                  label="Country/Region & Language"
                  icon="globe-outline"
                  onPress={() => handleNavigate("/admin/account/region-language")}
                />
              </>
            ) : (
              <>
                <UserMenuItem
                  label="Security & sign-in"
                  icon="shield-checkmark-outline"
                  onPress={() => handleNavigate("/settings/security")}
                />
                <UserMenuItem
                  label="Notifications"
                  icon="notifications-outline"
                  onPress={() => handleNavigate("/settings/notifications")}
                />
                <UserMenuItem
                  label="Country/Region & Language"
                  icon="globe-outline"
                  onPress={() => handleNavigate("/settings/language")}
                />
              </>
            )}

            <View style={styles.userMenuDivider} />

            <UserMenuItem
              label="Sign out"
              icon="log-out-outline"
              danger
              onPress={openLogoutModal}
            />
          </View>
        )}
      </View>
    );

  return (
    <View
      style={[
        styles.navWrap,
        isWeb && styles.navWrapWebFixed,
        styles.fullBleed,
        bgStyle,
        { borderBottomColor: tokens.border },
      ]}
    >
      {Platform.OS !== "web" && <StatusBar barStyle="light-content" />}

      <View style={[styles.navbar, { height: NAV_HEIGHT }]}>
        {/* Brand */}
        <Pressable
          onPress={() => handleNavigate("/")}
          style={({ pressed, hovered }) => [
            styles.logoContainer,
            (pressed || hovered) && {
              opacity: 0.9,
              transform: [{ translateY: -0.5 }],
            },
          ]}
        >
          <Image
            source={require("../assets/images/koedu.png")}
            style={styles.logo}
          />
          <Text style={[styles.brand, { color: tokens.fg }]}>KOEDU Bridge</Text>
        </Pressable>

        {/* Desktop links + user */}
        {!isNarrow ? (
          <View style={styles.linksRow}>
            {navItems.map((item, idx) => {
              const active = pathname === item.route;
              return (
                <Pressable
                  key={idx}
                  onPress={() => handleNavigate(item.route)}
                  style={({ hovered, pressed }) => [
                    styles.linkBtn,
                    { borderColor: tokens.border },
                    hovered && styles.linkHover,
                    active && styles.linkActive,
                    item.cta && [
                      {
                        backgroundColor: tokens.cta,
                        borderColor: tokens.cta,
                      },
                    ],
                    pressed && { transform: [{ translateY: 1 }] },
                  ]}
                >
                  <View style={styles.linkPill}>
                    {item.cta && (
                      <Ionicons
                        name="sparkles-outline"
                        size={16}
                        color="#0b1a2a"
                      />
                    )}
                    <Text
                      style={[
                        styles.linkText,
                        { color: tokens.fg },
                        item.cta && {
                          color: "#0b1a2a",
                          fontWeight: "800",
                        },
                      ]}
                    >
                      {item.label}
                    </Text>

                    {active && !item.cta && (
                      <View
                        style={[
                          styles.activeDot,
                          { backgroundColor: tokens.cta, marginLeft: 6 },
                        ]}
                      />
                    )}
                  </View>
                </Pressable>
              );
            })}

            {/* Info */}
            <Pressable
              onPress={() => setSidebarVisible(true)}
              style={({ hovered }) => [
                styles.linkBtn,
                { borderColor: tokens.border },
                hovered && styles.linkHover,
              ]}
            >
              <View style={styles.linkPill}>
                <Ionicons name="grid-outline" size={16} color={tokens.fg} />
                <Text style={[styles.linkText, { color: tokens.fg }]}>Info</Text>
              </View>
            </Pressable>

            {/* Avatar + menu */}
            {UserMenu}

            {/* Logout button (desktop only, when logged in) */}
            {user && (
              <Pressable
                onPress={openLogoutModal}
                style={({ hovered, pressed }) => [
                  styles.linkBtn,
                  {
                    borderColor: "#fecaca",
                    marginLeft: 4,
                    backgroundColor: "rgba(248,113,113,0.15)",
                  },
                  hovered && styles.linkHover,
                  pressed && { transform: [{ translateY: 1 }] },
                ]}
              >
                <View style={styles.linkPill}>
                  <Ionicons name="log-out-outline" size={16} color="#fecaca" />
                  <Text
                    style={[
                      styles.linkText,
                      { color: "#fecaca", fontWeight: "700" },
                    ]}
                  >
                    Logout
                  </Text>
                </View>
              </Pressable>
            )}
          </View>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {user && (
              <Pressable
                onPress={() => setUserMenuOpen((v) => !v)}
                style={{ marginRight: 8 }}
              >
                <Ionicons
                  name="person-circle-outline"
                  size={28}
                  color={tokens.fg}
                />
              </Pressable>
            )}

            <Pressable
              onPress={() => setMenuOpen((v) => !v)}
              hitSlop={12}
              style={({ pressed }) => [
                styles.hamBtn,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Ionicons
                name={menuOpen ? "close" : "menu"}
                size={28}
                color={tokens.fg}
              />
            </Pressable>
          </View>
        )}
      </View>

      {isNarrow && menuOpen && MobileMenu}

      {sidebarVisible && (
        <SidebarInfoNav onClose={() => setSidebarVisible(false)} />
      )}

      {/* Mobile floating user menu */}
      {user && isNarrow && userMenuOpen && (
        <View style={styles.mobileUserMenu}>
          {isAdmin && (
            <UserMenuItem
              label="Admin dashboard"
              icon="speedometer-outline"
              onPress={() => handleNavigate("/admin/dashboard")}
            />
          )}

          <UserMenuItem
            label="My Account"
            icon="person-outline"
            onPress={() =>
              handleNavigate(isAdmin ? "/admin/account/my-info" : "/student/profile")
            }
          />

          <UserMenuItem
            label="Settings"
            icon="settings-outline"
            onPress={() =>
              handleNavigate(isAdmin ? "/admin/account" : "/settings/account")
            }
          />

          <UserMenuItem
            label="Sign out"
            icon="log-out-outline"
            danger
            onPress={openLogoutModal}
          />
        </View>
      )}

      {/* ✅ LOGOUT CONFIRM MODAL */}
      <LogoutConfirmModal
        visible={showLogoutModal}
        loading={logoutLoading}
        onCancel={cancelLogout}
        onConfirm={confirmLogout}
      />
    </View>
  );
}

function UserMenuItem({ label, icon, danger, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.userMenuItem,
        pressed && { backgroundColor: "rgba(255,255,255,0.06)" },
      ]}
    >
      <Ionicons
        name={icon}
        size={18}
        color={danger ? "#fecaca" : "#e5e7eb"}
        style={{ marginRight: 8 }}
      />
      <Text style={[styles.userMenuItemText, danger && { color: "#fecaca" }]}>
        {label}
      </Text>
    </Pressable>
  );
}
