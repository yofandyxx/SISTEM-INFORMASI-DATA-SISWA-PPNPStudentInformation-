/**
 
 * 
 * Fitur utama:
 * 1. Menerima data siswa melalui route.params.
 * 2. Menampilkan avatar siswa.
 * 3. Menyediakan fallback avatar berupa inisial nama.
 * 4. Menampilkan identitas dan status siswa.
 * 5. Menampilkan detail siswa.
 * 6. Navigasi ke Form untuk proses Edit.
 * 7. Konfirmasi sebelum menghapus data.
 * 8. Menghapus data siswa dari SQLite.
 *
 * Konsep penting:
 * - React Navigation
 * - route.params
 * - useState
 * - Conditional Rendering
 * - Image Online + Fallback
 * - Reusable Component
 * - Helper Function
 * - Ternary Operator
 * - Alert Confirmation
 * - Async/Await
 * - DELETE SQLite
 * - Callback / Event Handler
 * ============================================================
 */

import React, {
  useState,
} from 'react';

import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Button,
  C,
  getStudentAvatarUri,
} from '../componets/UI';

import {
  deleteStudent,
} from '../database/db';


/**
 * ============================================================
 * DETAIL SCREEN
 * ============================================================
 *
 * Screen menerima dua object penting dari React Navigation:
 *
 * route
 * -> Digunakan untuk menerima parameter/data dari screen
 *    sebelumnya.
 *
 * navigation
 * -> Digunakan untuk berpindah screen atau kembali ke
 *    screen sebelumnya.
 */
export default function DetailScreen({
  route,
  navigation,
}: any) {

  /**
   * ==========================================================
   * MENGAMBIL DATA SISWA DARI ROUTE
   * ==========================================================
   *
   * Data siswa dikirim dari screen sebelumnya melalui:
   *
   * navigation.navigate(...)
   *
   * kemudian diterima melalui:
   *
   * route.params.student
   */
  const student =
    route.params.student;


  /**
   * ==========================================================
   * STATE AVATAR
   * ==========================================================
   *
   * imageFailed digunakan untuk mengetahui apakah gambar
   * avatar online berhasil dimuat.
   *
   * false
   * -> gambar belum mengalami error.
   *
   * true
   * -> gambar gagal dimuat sehingga aplikasi menggunakan
   *    fallback berupa huruf pertama nama siswa.
   */
  const [
    imageFailed,
    setImageFailed,
  ] = useState(false);


  /**
   * ==========================================================
   * HELPER RENDER ROW
   * ==========================================================
   *
   * Fungsi reusable untuk membuat satu baris informasi.
   *
   * Contoh:
   *
   * Jenis Kelamin
   * Laki-laki
   *
   * Kelas
   * Kelas X
   *
   * Jurusan
   * Rekayasa Perangkat Lunak
   *
   * Dengan helper ini kita tidak perlu menulis struktur
   * View + Text yang sama secara berulang.
   */
  const renderRow = (
    label: string,
    value: string
  ) => (

    <View style={styles.row}>

      {/* Judul/keterangan data */}
      <Text style={styles.label}>
        {label}
      </Text>


      {/* Nilai data */}
      <Text style={styles.value}>
        {value}
      </Text>

    </View>
  );


  /**
   * ==========================================================
   * HANDLE DELETE
   * ==========================================================
   *
   * Fungsi dijalankan ketika user menekan tombol:
   *
   * "Hapus Data"
   *
   * Data tidak langsung dihapus.
   *
   * Aplikasi terlebih dahulu menampilkan Alert konfirmasi
   * untuk mengurangi risiko data terhapus secara tidak sengaja.
   */
  const handleDelete = () => {

    Alert.alert(
      'Hapus Siswa',
      'Yakin menghapus data ini?',
      [

        /**
         * Tombol Batal.
         *
         * Tidak mempunyai onPress sehingga tidak melakukan
         * proses penghapusan.
         */
        {
          text: 'Batal',
        },


        /**
         * Tombol Hapus.
         *
         * style destructive memberi penanda bahwa aksi ini
         * merupakan aksi yang berisiko/menghapus data.
         */
        {
          text: 'Hapus',
          style: 'destructive',

          /**
           * Karena proses DELETE menuju SQLite bersifat
           * asynchronous, callback menggunakan async/await.
           */
          onPress: async () => {

            /**
             * Menghapus siswa berdasarkan Primary Key id.
             */
            await deleteStudent(
              student.id
            );


            /**
             * Setelah penghapusan berhasil,
             * kembali ke screen sebelumnya.
             */
            navigation.goBack();
          },
        },
      ]
    );
  };


  /**
   * ==========================================================
   * TAMPILAN DETAIL SISWA
   * ==========================================================
   */
  return (

    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
    >

      {/* =====================================================
          HEADER / IDENTITAS SISWA
          ===================================================== */}
      <View style={styles.header}>


        {/* ===================================================
            AVATAR SISWA
            =================================================== */}
        <View style={styles.avatar}>

          {/**
           * Conditional Rendering:
           *
           * Jika imageFailed = false:
           * -> tampilkan avatar online.
           *
           * Jika imageFailed = true:
           * -> tampilkan huruf pertama nama siswa.
           */}
          {!imageFailed ? (

            <Image
              source={{
                uri: getStudentAvatarUri(
                  student.nis,
                  student.gender
                ),
              }}
              style={styles.avatarImage}

              /**
               * Jika avatar gagal dimuat,
               * ubah imageFailed menjadi true.
               */
              onError={() =>
                setImageFailed(true)
              }
            />

          ) : (

            /**
             * =================================================
             * FALLBACK AVATAR
             * =================================================
             *
             * student.name[0]
             *
             * mengambil karakter pertama nama siswa.
             *
             * Contoh:
             *
             * Ahmad Fauzan
             *
             * menjadi:
             *
             * A
             */
            <Text style={styles.avatarText}>
              {student.name[0]}
            </Text>

          )}

        </View>


        {/* Nama siswa */}
        <Text style={styles.name}>
          {student.name}
        </Text>


        {/* ===================================================
            STATUS BADGE
            ===================================================
            
            Menampilkan NIS dan status siswa.
        */}
        <View style={styles.statusBadge}>

          <Text style={styles.statusText}>
            NIS {student.nis} • {student.status}
          </Text>

        </View>

      </View>


      {/* =====================================================
          CARD DETAIL DATA SISWA
          ===================================================== */}
      <View style={styles.card}>

        {/**
         * Ternary Operator digunakan untuk mengubah kode
         * gender menjadi teks yang lebih mudah dibaca.
         *
         * L -> Laki-laki
         * selain L -> Perempuan
         */}
        {renderRow(
          'Jenis Kelamin',
          student.gender === 'L'
            ? 'Laki-laki'
            : 'Perempuan'
        )}


        {/**
         * class_name berasal dari hasil SQL JOIN
         * antara students dan classes.
         */}
        {renderRow(
          'Kelas',
          student.class_name
        )}


        {/**
         * major_name berasal dari hasil SQL JOIN
         * antara students dan majors.
         */}
        {renderRow(
          'Jurusan',
          student.major_name
        )}


        {/* Alamat siswa */}
        {renderRow(
          'Alamat',
          student.address
        )}


        {/* Status siswa */}
        {renderRow(
          'Status',
          student.status
        )}

      </View>


      {/* =====================================================
          TOMBOL EDIT
          =====================================================
          
          Data student dikirim ke Form melalui route params.
          Form kemudian dapat menggunakan data tersebut
          sebagai nilai awal proses Edit.
      */}
      <Button
        title="Edit Data Siswa"
        icon="create-outline"
        onPress={() =>
          navigation.navigate(
            'Form',
            {
              student,
            }
          )
        }
      />


      {/* =====================================================
          TOMBOL DELETE
          =====================================================
          
          variant="danger" membuat tombol menggunakan
          tampilan khusus untuk aksi berbahaya/hapus.
      */}
      <Button
        title="Hapus Data"
        icon="trash-outline"
        variant="danger"
        onPress={handleDelete}
      />

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
   * Background utama screen.
   */
  root: {
    backgroundColor: C.bg,
  },


  /**
   * Container seluruh isi ScrollView.
   */
  content: {
    padding: 18,
    gap: 13,
  },


  /**
   * Card bagian identitas siswa.
   */
  header: {
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 24,
    padding: 20,
    elevation: 2,
  },


  /**
   * Container avatar.
   *
   * overflow: hidden memastikan gambar tidak keluar
   * dari bentuk container.
   */
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 28,
    backgroundColor: C.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },


  /**
   * Gambar avatar memenuhi container.
   */
  avatarImage: {
    width: '100%',
    height: '100%',
  },


  /**
   * Style fallback avatar berupa inisial.
   */
  avatarText: {
    fontSize: 34,
    fontWeight: '900',
    color: C.primary,
  },


  /**
   * Nama siswa.
   */
  name: {
    fontSize: 22,
    fontWeight: '900',
    color: C.text,
    marginTop: 10,
  },


  /**
   * Badge NIS dan status siswa.
   */
  statusBadge: {
    backgroundColor: C.greenSoft,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 5,
  },


  /**
   * Teks di dalam status badge.
   */
  statusText: {
    color: C.green,
    fontSize: 12,
    fontWeight: '700',
  },


  /**
   * Card informasi detail siswa.
   */
  card: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 18,
    elevation: 2,
  },


  /**
   * Setiap baris informasi siswa.
   */
  row: {
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1F4',
  },


  /**
   * Label informasi.
   */
  label: {
    fontSize: 11,
    color: C.muted,
  },


  /**
   * Nilai informasi.
   */
  value: {
    fontSize: 15,
    fontWeight: '700',
    color: C.text,
    marginTop: 3,
  },
});
