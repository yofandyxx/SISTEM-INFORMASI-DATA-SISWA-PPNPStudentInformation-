/**
 * ============================================================
 * PROJECT 01 - SISTEM INFORMASI DATA SISWA
 * File        : UI.tsx
 * Lokasi      : src/components/UI.tsx
 * Fungsi      : Menyediakan komponen UI dan konfigurasi desain
 *                yang digunakan bersama oleh beberapa screen.
 * Dibuat oleh : Amrizal,S.Kom, M.Kom
 * 
 * Isi utama:
 * 1. Palet warna aplikasi.
 * 2. Komponen Stat.
 * 3. Komponen Button.
 * 4. Fungsi getStudentAvatarUri().
 * 5. Style komponen UI.
 *
 * Konsep penting:
 * - Reusable Component
 * - Design System
 * - Props
 * - Default Parameter
 * - Conditional Expression
 * - Nullish Coalescing Operator (??)
 * - Dynamic Style
 * - Template Literal
 * - URL Encoding
 * - Offline Fallback Concept
 * ============================================================
 */

import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';


/**
 * ============================================================
 * PALET WARNA / DESIGN SYSTEM
 * ============================================================
 *
 * Seluruh warna utama aplikasi ditempatkan dalam satu object.
 *
 * Tujuannya:
 * - Menjaga konsistensi warna antar-screen.
 * - Menghindari penulisan kode warna berulang.
 * - Mempermudah perubahan tema aplikasi.
 *
 * Palet warna menggunakan kombinasi:
 * Navy + Biru + Merah + Oranye + Ungu.
 */
export const C = {

  /**
   * Warna utama aplikasi.
   */
  primary: '#0B3B78',

  /**
   * Variasi warna primary.
   */
  primary2: '#1457B8',

  /**
   * Warna primary versi lembut.
   */
  primarySoft: '#EAF2FF',

  /**
   * Background utama aplikasi.
   */
  bg: '#F4F7FC',

  /**
   * Warna putih.
   */
  white: '#FFFFFF',

  /**
   * Warna teks utama.
   */
  text: '#14213D',

  /**
   * Warna teks sekunder.
   */
  muted: '#6B7890',

  /**
   * Warna hijau dan variasinya.
   */
  green: '#168B61',
  greenSoft: '#E8F7F0',

  /**
   * Warna oranye dan variasinya.
   */
  orange: '#FF7A00',
  orangeSoft: '#FFF0E0',

  /**
   * Warna merah dan variasinya.
   */
  red: '#E63956',
  redSoft: '#FDE9ED',

  /**
   * Warna ungu dan variasinya.
   */
  purple: '#7446D7',
  purpleSoft: '#F0EAFE',

  /**
   * Warna biru dan variasinya.
   */
  blue: '#1464F4',
  blueSoft: '#E8F0FF',
};


/**
 * ============================================================
 * KOMPONEN STAT
 * ============================================================
 *
 * Komponen reusable untuk menampilkan sebuah statistik.
 *
 * Contoh informasi yang dapat ditampilkan:
 *
 * - Total Siswa
 * - Siswa Laki-laki
 * - Siswa Perempuan
 * - Kelas Aktif
 *
 * Props:
 *
 * icon
 * -> Nama icon dari Ionicons.
 *
 * label
 * -> Keterangan statistik.
 *
 * value
 * -> Nilai statistik.
 *
 * color
 * -> Warna icon.
 *
 * Jika color tidak diberikan, warna default:
 *
 * C.primary
 */
export function Stat({
  icon,
  label,
  value,
  color = C.primary,
}: any) {

  return (
    <View style={styles.stat}>

      {/* =====================================================
          ICON STATISTIK
          =====================================================

          Warna background dibuat berdasarkan nilai color.

          `${color}18`

          menambahkan nilai transparansi pada warna HEX.
      */}
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor:
              `${color}18`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={21}
          color={color}
        />
      </View>


      {/* =====================================================
          NILAI STATISTIK
          =====================================================

          Operator:

          ??

          disebut Nullish Coalescing Operator.

          Jika value adalah null atau undefined,
          nilai yang ditampilkan adalah 0.
      */}
      <Text style={styles.number}>
        {value ?? 0}
      </Text>


      {/* Label statistik */}
      <Text style={styles.label}>
        {label}
      </Text>

    </View>
  );
}


/**
 * ============================================================
 * KOMPONEN BUTTON
 * ============================================================
 *
 * Komponen tombol reusable.
 *
 * Props:
 *
 * title
 * -> Teks tombol.
 *
 * onPress
 * -> Fungsi yang dijalankan ketika tombol ditekan.
 *
 * icon
 * -> Icon Ionicons.
 *
 * variant
 * -> Menentukan variasi tombol.
 *
 * Nilai default:
 *
 * icon    = add-circle-outline
 * variant = primary
 */
export function Button({
  title,
  onPress,
  icon = 'add-circle-outline',
  variant = 'primary',
}: any) {

  /**
   * ==========================================================
   * WARNA BUTTON
   * ==========================================================
   *
   * Menggunakan ternary operator.
   *
   * Jika:
   *
   * variant === 'danger'
   *
   * maka:
   *
   * backgroundColor = C.red
   *
   * selain itu:
   *
   * backgroundColor = C.primary
   */
  const backgroundColor =
    variant === 'danger'
      ? C.red
      : C.primary;


  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor,
        },
      ]}
    >

      {/* Icon tombol */}
      <Ionicons
        name={icon}
        size={19}
        color={C.white}
      />


      {/* Teks tombol */}
      <Text style={styles.buttonText}>
        {title}
      </Text>

    </Pressable>
  );
}


/**
 * ============================================================
 * GET STUDENT AVATAR URI
 * ============================================================
 *
 * Fungsi menghasilkan URL avatar online untuk setiap siswa.
 *
 * Avatar dibuat secara deterministik berdasarkan NIS.
 *
 * Artinya:
 *
 * Siswa dengan NIS yang sama akan memperoleh avatar
 * yang sama setiap kali aplikasi dijalankan.
 *
 * Parameter:
 *
 * nis
 * -> Nomor Induk Siswa.
 *
 * gender
 * -> Jenis kelamin siswa.
 *
 * Jika gender === 'P':
 * style avatar menggunakan "lorelei".
 *
 * Selain itu:
 * style avatar menggunakan "adventurer".
 *
 * Jika internet tidak tersedia, screen yang menggunakan
 * avatar dapat menampilkan fallback berupa inisial nama.
 *
 * Dengan demikian fungsi utama aplikasi tetap dapat
 * digunakan secara offline.
 */
export function getStudentAvatarUri(
  nis: string,
  gender?: string
) {

  /**
   * ==========================================================
   * MEMBUAT SEED AVATAR
   * ==========================================================
   *
   * NIS digunakan sebagai bagian dari seed.
   *
   * Contoh:
   *
   * NIS = 2401001
   *
   * menjadi:
   *
   * siswa-2401001
   *
   * encodeURIComponent() memastikan nilai aman digunakan
   * sebagai bagian dari URL.
   */
  const seed =
    encodeURIComponent(
      `siswa-${nis}`
    );


  /**
   * ==========================================================
   * MENENTUKAN STYLE AVATAR
   * ==========================================================
   *
   * Menggunakan ternary operator.
   */
  const style =
    gender === 'P'
      ? 'lorelei'
      : 'adventurer';


  /**
   * ==========================================================
   * MEMBENTUK URL AVATAR
   * ==========================================================
   *
   * Template Literal digunakan untuk memasukkan:
   *
   * - style
   * - seed
   *
   * ke dalam URL DiceBear.
   */
  return `https://api.dicebear.com/9.x/${style}/png?seed=${seed}&backgroundColor=dbeafe,fce7f3,e0e7ff&size=160`;
}


/**
 * ============================================================
 * STYLE
 * ============================================================
 *
 * StyleSheet digunakan untuk menyimpan style reusable
 * dari komponen-komponen UI pada file ini.
 */
const styles = StyleSheet.create({

  /**
   * ==========================================================
   * STAT CARD
   * ==========================================================
   */
  stat: {
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 14,
    flex: 1,
    minWidth: '45%',
    elevation: 2,
  },


  /**
   * Container icon pada Stat.
   */
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },


  /**
   * Nilai statistik.
   */
  number: {
    fontSize: 24,
    fontWeight: '800',
    color: C.text,
    marginTop: 7,
  },


  /**
   * Label statistik.
   */
  label: {
    color: C.muted,
    fontSize: 12,
  },


  /**
   * ==========================================================
   * BUTTON
   * ==========================================================
   */
  button: {
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },


  /**
   * Teks Button.
   */
  buttonText: {
    color: C.white,
    fontWeight: '700',
  },
});
