/**

 * 
 * Tanggung jawab utama:
 * 1. Menyiapkan database SQLite.
 * 2. Menunggu database siap sebelum aplikasi ditampilkan.
 * 3. Menyiapkan Bottom Tab Navigation.
 * 4. Menyiapkan Stack Navigation.
 * 5. Menghubungkan seluruh screen aplikasi.
 * 6. Menyediakan SafeAreaProvider.
 * 7. Mengatur StatusBar.
 *
 * Struktur navigasi:
 *
 * App
 *  |
 *  +-- NavigationContainer
 *       |
 *       +-- Stack Navigator
 *            |
 *            +-- Main
 *            |    |
 *            |    +-- Bottom Tab Navigator
 *            |         |
 *            |         +-- Beranda
 *            |         |
 *            |         +-- Data Siswa
 *            |
 *            +-- Detail
 *            |
 *            +-- Form
 *
 * Konsep penting:
 * - React Native
 * - useState
 * - useEffect
 * - SQLite Initialization
 * - Async Process
 * - Loading State
 * - React Navigation
 * - Bottom Tab Navigator
 * - Native Stack Navigator
 * - Nested Navigation
 * - Dynamic Icon
 * - Safe Area
 * - Status Bar
 * ============================================================
 */

import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

import {
  StatusBar,
} from 'expo-status-bar';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import {
  initDB,
} from './src/database/db';

import {
  C,
} from './src/componets/UI';

import HomeScreen
  from './src/screens/HomeScreen';

import StudentsScreen
  from './src/screens/StudentsScreen';

import DetailScreen
  from './src/screens/DetailScreen';

import FormScreen
  from './src/screens/FormScreen';


/**
 * ============================================================
 * NAVIGATOR INSTANCE
 * ============================================================
 *
 * Aplikasi menggunakan dua jenis navigator:
 *
 * 1. Bottom Tab Navigator
 *    -> Navigasi utama.
 *
 * 2. Native Stack Navigator
 *    -> Navigasi menuju screen Detail dan Form.
 */
const Tab =
  createBottomTabNavigator();

const Stack =
  createNativeStackNavigator();


/**
 * ============================================================
 * MAIN TABS
 * ============================================================
 *
 * Navigasi utama menggunakan Bottom Tab.
 *
 * Terdapat dua menu:
 *
 * - Beranda
 * - Data Siswa
 *
 * MainTabs nantinya dimasukkan sebagai salah satu screen
 * di dalam Stack Navigator.
 *
 * Konsep ini disebut:
 *
 * Nested Navigation
 *
 * karena satu navigator berada di dalam navigator lainnya.
 */
function MainTabs() {

  return (

    <Tab.Navigator

      /**
       * ======================================================
       * SCREEN OPTIONS
       * ======================================================
       *
       * screenOptions digunakan untuk memberikan konfigurasi
       * umum kepada screen yang berada di Bottom Tab.
       *
       * route digunakan untuk mengetahui nama screen aktif.
       */
      screenOptions={({
        route,
      }) => ({

        /**
         * Warna background header.
         */
        headerStyle: {
          backgroundColor: C.primary,
        },


        /**
         * Warna teks dan icon pada header.
         */
        headerTintColor:
          C.white,


        /**
         * Warna icon/text tab yang sedang aktif.
         */
        tabBarActiveTintColor:
          C.red,


        /**
         * Warna icon/text tab yang tidak aktif.
         */
        tabBarInactiveTintColor:
          C.muted,


        /**
         * Style Bottom Tab.
         */
        tabBarStyle:
          styles.tabBar,


        /**
         * ====================================================
         * ICON BOTTOM TAB
         * ====================================================
         *
         * Icon ditentukan secara dinamis berdasarkan
         * nama route.
         *
         * Jika:
         *
         * route.name === 'Beranda'
         *
         * icon:
         *
         * home
         *
         * Selain itu:
         *
         * people
         */
        tabBarIcon: ({
          color,
          size,
        }) => (

          <Ionicons
            name={
              route.name === 'Beranda'
                ? 'home'
                : 'people'
            }
            size={size}
            color={color}
          />

        ),
      })}
    >

      {/* =====================================================
          TAB BERANDA
          =====================================================
          
          Menampilkan HomeScreen sebagai Dashboard utama.
      */}
      <Tab.Screen
        name="Beranda"
        component={HomeScreen}
      />


      {/* =====================================================
          TAB DATA SISWA
          =====================================================
          
          Menampilkan StudentsScreen yang berisi:
          
          - Daftar siswa.
          - Search.
          - Filter.
          - Avatar.
      */}
      <Tab.Screen
        name="Data Siswa"
        component={StudentsScreen}
      />

    </Tab.Navigator>
  );
}


/**
 * ============================================================
 * APP
 * ============================================================
 *
 * Root component dari aplikasi.
 *
 * Sebelum navigasi dan screen ditampilkan,
 * aplikasi memastikan database SQLite sudah siap.
 */
export default function App() {

  /**
   * ==========================================================
   * READY STATE
   * ==========================================================
   *
   * ready digunakan untuk mengetahui apakah proses
   * inisialisasi database sudah selesai.
   *
   * false
   * -> database belum siap.
   *
   * true
   * -> database sudah siap.
   */
  const [
    ready,
    setReady,
  ] = useState(false);


  /**
   * ==========================================================
   * INISIALISASI DATABASE
   * ==========================================================
   *
   * useEffect dengan dependency [] dijalankan
   * ketika App pertama kali dibuat.
   *
   * initDB() akan:
   *
   * 1. Membuka students.db.
   * 2. Mengaktifkan Foreign Key.
   * 3. Membuat tabel classes.
   * 4. Membuat tabel majors.
   * 5. Membuat tabel students.
   * 6. Mengisi seed data jika database masih kosong.
   *
   * Setelah selesai:
   *
   * setReady(true)
   *
   * sehingga aplikasi dapat menampilkan navigasi.
   */
  useEffect(
    () => {

      initDB()
        .then(
          () =>
            setReady(true)
        );

    },
    []
  );


  /**
   * ==========================================================
   * LOADING STATE
   * ==========================================================
   *
   * Jika database belum siap:
   *
   * ready === false
   *
   * aplikasi belum menampilkan screen utama.
   *
   * Sebagai gantinya ditampilkan ActivityIndicator.
   *
   * Ini mencegah screen mencoba membaca database
   * sebelum proses initDB() selesai.
   */
  if (!ready) {

    return (

      <View style={styles.loading}>

        <ActivityIndicator
          size="large"
          color={C.primary}
        />

      </View>
    );
  }


  /**
   * ==========================================================
   * ROOT APPLICATION
   * ==========================================================
   *
   * Bagian ini baru ditampilkan setelah:
   *
   * ready === true
   */
  return (

    /**
     * ========================================================
     * SAFE AREA PROVIDER
     * ========================================================
     *
     * SafeAreaProvider membantu aplikasi menyesuaikan
     * area aman perangkat.
     *
     * Contohnya:
     *
     * - Notch.
     * - Status bar.
     * - Area sistem perangkat.
     */
    <SafeAreaProvider>


      {/* =====================================================
          STATUS BAR
          =====================================================
          
          style="light" membuat konten StatusBar menggunakan
          tampilan terang agar sesuai dengan header gelap.
      */}
      <StatusBar
        style="light"
      />


      {/* =====================================================
          NAVIGATION CONTAINER
          =====================================================
          
          NavigationContainer merupakan container utama
          React Navigation.
          
          Seluruh navigator ditempatkan di dalamnya.
      */}
      <NavigationContainer>


        {/* ===================================================
            STACK NAVIGATOR
            ===================================================
            
            Stack digunakan untuk mengatur perpindahan:
            
            Main
              ↓
            Detail
            
            atau
            
            Main
              ↓
            Form
        */}
        <Stack.Navigator

          /**
           * Konfigurasi umum header Stack.
           */
          screenOptions={{

            headerStyle: {
              backgroundColor:
                C.primary,
            },

            headerTintColor:
              C.white,
          }}
        >


          {/* =================================================
              MAIN
              =================================================
              
              Main berisi Bottom Tab Navigator.
              
              Header Stack disembunyikan karena masing-masing
              Tab sudah mempunyai header sendiri.
          */}
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{
              headerShown: false,
            }}
          />


          {/* =================================================
              DETAIL SISWA
              =================================================
              
              Dibuka ketika user memilih salah satu siswa
              pada StudentsScreen.
          */}
          <Stack.Screen
            name="Detail"
            component={DetailScreen}
            options={{
              title: 'Detail Siswa',
            }}
          />


          {/* =================================================
              FORM DATA SISWA
              =================================================
              
              Screen yang sama digunakan untuk:
              
              - Tambah siswa.
              - Edit siswa.
              
              Perbedaannya ditentukan oleh keberadaan
              parameter student.
          */}
          <Stack.Screen
            name="Form"
            component={FormScreen}
            options={{
              title: 'Form Data Siswa',
            }}
          />

        </Stack.Navigator>

      </NavigationContainer>

    </SafeAreaProvider>
  );
}


/**
 * ============================================================
 * STYLE
 * ============================================================
 */
const styles = StyleSheet.create({

  /**
   * ==========================================================
   * LOADING
   * ==========================================================
   *
   * ActivityIndicator ditempatkan tepat di tengah layar
   * menggunakan kombinasi:
   *
   * flex: 1
   * justifyContent: center
   * alignItems: center
   */
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },


  /**
   * ==========================================================
   * BOTTOM TAB BAR
   * ==========================================================
   */
  tabBar: {
    height: 65,
    paddingBottom: 8,
  },
});
