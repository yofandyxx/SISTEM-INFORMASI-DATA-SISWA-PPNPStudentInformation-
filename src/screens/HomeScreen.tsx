/**
 
 * Fitur utama:
 * 1. Menampilkan identitas aplikasi.
 * 2. Menampilkan menu utama.
 * 3. Navigasi ke Tambah Siswa.
 * 4. Navigasi ke Daftar Siswa.
 * 5. Mengambil statistik siswa dari SQLite.
 * 6. Menampilkan Total, Aktif, Nonaktif, dan Lulus.
 * 7. Memberikan informasi bahwa database bekerja offline.
 *
 * Konsep penting:
 * - useState
 * - useCallback
 * - useFocusEffect
 * - React Navigation
 * - Reusable Component
 * - Props
 * - Callback Function
 * - Async Data
 * - Dashboard Statistics
 * - Aggregate Data
 * - Dynamic Style
 * - Optional Chaining
 * - SQLite Offline
 * ============================================================
 */

import React, {
  useCallback,
  useState,
} from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  getStats,
} from '../database/db';

import {
  C,
  Stat,
} from '../componets/UI';


/**
 * ============================================================
 * HOME SCREEN
 * ============================================================
 *
 * HomeScreen merupakan Dashboard utama aplikasi.
 *
 * Screen menampilkan:
 *
 * - Hero / identitas aplikasi.
 * - Menu utama.
 * - Ringkasan statistik siswa.
 * - Informasi SQLite Offline.
 */
export default function HomeScreen({
  navigation,
}: any) {

  /**
   * ==========================================================
   * STATE STATISTIK
   * ==========================================================
   *
   * State stats menyimpan hasil perhitungan dari SQLite:
   *
   * {
   *   total,
   *   active,
   *   inactive,
   *   graduated
   * }
   *
   * Nilai awal berupa object kosong karena data baru
   * tersedia setelah query SQLite selesai dijalankan.
   */
  const [
    stats,
    setStats,
  ] = useState<any>({});


  /**
   * ==========================================================
   * REFRESH STATISTIK SAAT SCREEN AKTIF
   * ==========================================================
   *
   * useFocusEffect() berasal dari React Navigation.
   *
   * Berbeda dengan useEffect biasa, useFocusEffect akan
   * menjalankan callback ketika screen mendapatkan fokus.
   *
   * Ini penting karena data siswa dapat berubah setelah:
   *
   * - Tambah siswa.
   * - Edit siswa.
   * - Hapus siswa.
   *
   * Ketika user kembali ke Dashboard, statistik akan
   * diambil kembali dari SQLite.
   */
  useFocusEffect(

    useCallback(
      () => {

        /**
         * getStats() melakukan query agregasi pada SQLite.
         *
         * Setelah query selesai:
         *
         * setStats()
         *
         * memperbarui state sehingga Dashboard otomatis
         * melakukan render ulang.
         */
        getStats()
          .then(setStats);

      },
      []
    )
  );


  /**
   * ==========================================================
   * REUSABLE ACTION COMPONENT
   * ==========================================================
   *
   * Komponen lokal Action digunakan untuk membuat
   * menu utama Dashboard.
   *
   * Props:
   *
   * title
   * -> Nama menu.
   *
   * icon
   * -> Icon Ionicons.
   *
   * color
   * -> Warna background menu.
   *
   * onPress
   * -> Fungsi yang dijalankan ketika menu ditekan.
   *
   * Dengan komponen ini, struktur menu tidak perlu
   * ditulis berulang-ulang.
   */
  const Action = ({
    title,
    icon,
    color,
    onPress,
  }: any) => (

    <Pressable
      style={[
        styles.action,
        {
          backgroundColor: color,
        },
      ]}
      onPress={onPress}
    >

      {/* Icon menu */}
      <Ionicons
        name={icon}
        size={31}
        color={C.white}
      />


      {/* Nama menu */}
      <Text style={styles.actionText}>
        {title}
      </Text>

    </Pressable>
  );


  /**
   * ==========================================================
   * TAMPILAN DASHBOARD
   * ==========================================================
   */
  return (

    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
    >

      {/* =====================================================
          HERO / IDENTITAS APLIKASI
          ===================================================== */}
      <View style={styles.hero}>

        {/* Icon utama Dashboard */}
        <View style={styles.heroIcon}>

          <Ionicons
            name="people"
            size={34}
            color={C.white}
          />

        </View>


        {/* Informasi aplikasi */}
        <View
          style={{
            flex: 1,
          }}
        >

          <Text style={styles.eyebrow}>
            SISTEM INFORMASI SEKOLAH
          </Text>


          <Text style={styles.title}>
            Data Siswa
          </Text>


          <Text style={styles.subtitle}>
            Kelola data siswa secara cepat, rapi, dan offline.
          </Text>

        </View>

      </View>


      {/* =====================================================
          MENU UTAMA
          ===================================================== */}
      <Text style={styles.heading}>
        Menu Utama
      </Text>


      <View style={styles.actions}>

        {/* ===================================================
            TAMBAH SISWA
            ===================================================
            
            Navigasi ke Form tanpa membawa student.
            
            Artinya FormScreen akan bekerja dalam
            mode TAMBAH.
        */}
        <Action
          title="Tambah Siswa"
          icon="add"
          color={C.blue}
          onPress={() =>
            navigation.navigate(
              'Form'
            )
          }
        />


        {/* ===================================================
            DAFTAR SISWA
            ===================================================
            
            Navigasi menuju screen Data Siswa.
        */}
        <Action
          title="Daftar Siswa"
          icon="people"
          color={C.red}
          onPress={() =>
            navigation.navigate(
              'Data Siswa'
            )
          }
        />


        {/* ===================================================
            STATISTIK
            ===================================================
            
            Pada Project 01 saat ini tombol dipertahankan
            sebagai elemen Dashboard dan callback masih kosong.
        */}
        <Action
          title="Statistik"
          icon="pie-chart"
          color={C.orange}
          onPress={() => {}}
        />


        {/* ===================================================
            INFO
            ===================================================
            
            Callback juga masih kosong sesuai program asli.
        */}
        <Action
          title="Info"
          icon="list"
          color={C.purple}
          onPress={() => {}}
        />

      </View>


      {/* =====================================================
          RINGKASAN SISWA
          ===================================================== */}
      <Text style={styles.heading}>
        Ringkasan Siswa
      </Text>


      <View style={styles.grid}>

        {/* ===================================================
            TOTAL SISWA
            ===================================================
            
            stats?.total menggunakan Optional Chaining.
            
            Jika stats belum tersedia, aplikasi tidak
            langsung menghasilkan error.
        */}
        <Stat
          icon="people"
          label="Total Siswa"
          value={stats?.total}
          color={C.blue}
        />


        {/* Jumlah siswa berstatus AKTIF */}
        <Stat
          icon="checkmark-circle"
          label="Aktif"
          value={stats?.active}
          color={C.green}
        />


        {/* Jumlah siswa berstatus NONAKTIF */}
        <Stat
          icon="pause-circle"
          label="Nonaktif"
          value={stats?.inactive}
          color={C.red}
        />


        {/* Jumlah siswa berstatus LULUS */}
        <Stat
          icon="school"
          label="Lulus"
          value={stats?.graduated}
          color={C.orange}
        />

      </View>


      {/* =====================================================
          INFORMASI DATABASE OFFLINE
          ===================================================== */}
      <View style={styles.offlineCard}>

        <View style={styles.offlineIcon}>

          <Ionicons
            name="server-outline"
            size={24}
            color={C.green}
          />

        </View>


        <View
          style={{
            flex: 1,
          }}
        >

          <Text style={styles.offlineTitle}>
            SQLite • Offline
          </Text>


          <Text style={styles.paragraph}>
            Data utama tersimpan lokal di perangkat tanpa menggunakan API.
          </Text>

        </View>

      </View>

    </ScrollView>
  );
}


/**
 * ============================================================
 * STYLE
 * ============================================================
 */
const styles = StyleSheet.create({

  /**
   * Background utama Dashboard.
   */
  root: {
    backgroundColor: C.bg,
  },


  /**
   * Container seluruh isi Dashboard.
   */
  content: {
    padding: 18,
    gap: 16,
  },


  /**
   * ==========================================================
   * HERO
   * ==========================================================
   *
   * Bagian identitas aplikasi pada bagian atas Dashboard.
   */
  hero: {
    backgroundColor: C.primary,
    borderRadius: 26,
    padding: 22,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    elevation: 5,
  },


  /**
   * Container icon pada Hero.
   */
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#174F91',
    alignItems: 'center',
    justifyContent: 'center',
  },


  /**
   * Teks kecil di atas judul Dashboard.
   */
  eyebrow: {
    color: '#BFD8FF',
    fontSize: 10,
    fontWeight: '800',
  },


  /**
   * Judul utama Dashboard.
   */
  title: {
    color: C.white,
    fontSize: 29,
    fontWeight: '900',
  },


  /**
   * Deskripsi Dashboard.
   */
  subtitle: {
    color: '#E5EEFF',
    marginTop: 4,
    fontSize: 12,
  },


  /**
   * Heading section.
   */
  heading: {
    fontSize: 19,
    fontWeight: '900',
    color: C.text,
  },


  /**
   * Container menu utama.
   *
   * flexDirection row membuat menu tersusun horizontal.
   */
  actions: {
    flexDirection: 'row',
    gap: 9,
  },


  /**
   * Card menu Action.
   *
   * flex: 1 membuat setiap menu berbagi ruang
   * secara proporsional.
   */
  action: {
    flex: 1,
    minHeight: 105,
    borderRadius: 20,
    padding: 11,
    justifyContent: 'space-between',
    elevation: 3,
  },


  /**
   * Teks menu Action.
   */
  actionText: {
    color: C.white,
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 16,
  },


  /**
   * ==========================================================
   * GRID STATISTIK
   * ==========================================================
   *
   * flexWrap memungkinkan kartu statistik berpindah
   * ke baris berikutnya ketika ruang tidak mencukupi.
   */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },


  /**
   * ==========================================================
   * OFFLINE CARD
   * ==========================================================
   *
   * Menjelaskan bahwa aplikasi menggunakan SQLite
   * sebagai penyimpanan lokal.
   */
  offlineCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
  },


  /**
   * Container icon SQLite Offline.
   */
  offlineIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: C.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },


  /**
   * Judul informasi offline.
   */
  offlineTitle: {
    color: C.text,
    fontWeight: '900',
  },


  /**
   * Deskripsi informasi offline.
   */
  paragraph: {
    color: C.muted,
    fontSize: 12,
    marginTop: 2,
  },
});
