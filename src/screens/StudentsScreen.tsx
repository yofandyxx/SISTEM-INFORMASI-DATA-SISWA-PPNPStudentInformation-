/**
 * ============================================================
 * PROJECT 01 - SISTEM INFORMASI DATA SISWA
 * File        : StudentsScreen.tsx
 * Fungsi      : Menampilkan daftar siswa, pencarian,
 *               filter status, avatar, dan navigasi detail.
 * Dibuat oleh : Amrizal,S.Kom, M.Kom
 * 
 * Fitur utama:
 * 1. Mengambil daftar siswa dari SQLite.
 * 2. Pencarian berdasarkan Nama atau NIS.
 * 3. Filter berdasarkan status siswa.
 * 4. Refresh data ketika screen aktif.
 * 5. Menampilkan data menggunakan FlatList.
 * 6. Menampilkan avatar siswa.
 * 7. Fallback avatar jika gambar online gagal dimuat.
 * 8. Navigasi menuju Detail siswa.
 * 9. Floating Action Button untuk menambah siswa.
 *
 * Konsep penting:
 * - useState
 * - useCallback
 * - useFocusEffect
 * - FlatList
 * - Controlled TextInput
 * - Search dan Filter
 * - Array.map()
 * - Conditional Style
 * - Conditional Rendering
 * - Dynamic Object Property
 * - React Navigation
 * - Image Error Handling
 * - Derived UI
 * - Floating Action Button
 * ============================================================
 */

import React, {
  useCallback,
  useState,
} from 'react';

import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  getStudents,
} from '../database/db';

import {
  C,
  getStudentAvatarUri,
} from '../componets/UI';


/**
 * ============================================================
 * STUDENTS SCREEN
 * ============================================================
 *
 * Screen ini menjadi pusat tampilan daftar data siswa.
 *
 * Data yang ditampilkan berasal dari SQLite melalui:
 *
 * getStudents(query, filter)
 *
 * Screen juga menyediakan:
 *
 * - Search.
 * - Filter.
 * - Detail siswa.
 * - Avatar.
 * - Tambah siswa.
 */
export default function StudentsScreen({
  navigation,
}: any) {

  /**
   * ==========================================================
   * STATE DAFTAR SISWA
   * ==========================================================
   *
   * students menyimpan hasil query dari SQLite.
   *
   * Nilai awal berupa array kosong karena data baru
   * tersedia setelah getStudents() selesai dijalankan.
   */
  const [
    students,
    setStudents,
  ] = useState<any[]>([]);


  /**
   * ==========================================================
   * STATE SEARCH
   * ==========================================================
   *
   * query menyimpan keyword pencarian.
   *
   * Pencarian pada database dilakukan terhadap:
   *
   * - Nama siswa.
   * - NIS siswa.
   */
  const [
    query,
    setQuery,
  ] = useState('');


  /**
   * ==========================================================
   * STATE FILTER
   * ==========================================================
   *
   * Filter awal:
   *
   * SEMUA
   *
   * Pilihan filter:
   *
   * - SEMUA
   * - AKTIF
   * - NONAKTIF
   * - LULUS
   */
  const [
    filter,
    setFilter,
  ] = useState('SEMUA');


  /**
   * ==========================================================
   * STATE GAMBAR GAGAL
   * ==========================================================
   *
   * failedImages menyimpan informasi avatar siswa
   * yang gagal dimuat dari internet.
   *
   * Struktur contoh:
   *
   * {
   *   1: true,
   *   5: true
   * }
   *
   * Artinya avatar siswa dengan id 1 dan 5 gagal dimuat.
   *
   * Record<number, boolean>:
   *
   * key   -> id siswa.
   * value -> status kegagalan gambar.
   */
  const [
    failedImages,
    setFailedImages,
  ] = useState<
    Record<number, boolean>
  >({});


  /**
   * ==========================================================
   * LOAD STUDENTS
   * ==========================================================
   *
   * Fungsi mengambil data siswa berdasarkan:
   *
   * query
   * -> keyword pencarian.
   *
   * filter
   * -> status siswa.
   *
   * useCallback digunakan agar fungsi dibuat ulang
   * ketika query atau filter berubah.
   */
  const loadStudents =
    useCallback(
      () => {

        getStudents(
          query,
          filter
        ).then(
          setStudents
        );

      },
      [
        query,
        filter,
      ]
    );


  /**
   * ==========================================================
   * REFRESH DATA SAAT SCREEN AKTIF
   * ==========================================================
   *
   * useFocusEffect digunakan agar daftar siswa dimuat
   * ketika screen memperoleh fokus.
   *
   * Ini penting setelah user:
   *
   * - Menambah siswa.
   * - Mengedit siswa.
   * - Menghapus siswa.
   * - Kembali dari screen lain.
   *
   * Dengan demikian daftar dapat mengambil kembali
   * kondisi terbaru dari SQLite.
   */
  useFocusEffect(

    useCallback(
      () => {

        loadStudents();

      },
      [
        loadStudents,
      ]
    )
  );


  /**
   * ==========================================================
   * STATUS COLOR
   * ==========================================================
   *
   * Fungsi menentukan warna teks berdasarkan status siswa.
   *
   * AKTIF
   * -> Hijau.
   *
   * NONAKTIF
   * -> Merah.
   *
   * Status lainnya, dalam data Project 01 yaitu LULUS
   * -> Oranye.
   */
  const statusColor = (
    status: string
  ) => {

    if (
      status === 'AKTIF'
    ) {
      return C.green;
    }


    if (
      status === 'NONAKTIF'
    ) {
      return C.red;
    }


    return C.orange;
  };


  /**
   * ==========================================================
   * TAMPILAN SCREEN
   * ==========================================================
   */
  return (

    <View style={styles.root}>

      {/* =====================================================
          SEARCH BOX
          =====================================================
          
          TextInput dikontrol oleh state query.
          
          Ketika query berubah:
          
          setQuery()
          -> loadStudents berubah
          -> useFocusEffect menjalankan query sesuai
             dependency yang digunakan pada program.
      */}
      <View style={styles.search}>

        <Ionicons
          name="search"
          size={20}
          color={C.muted}
        />


        <TextInput
          placeholder="Cari nama atau NIS..."
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />

      </View>


      {/* =====================================================
          FILTER STATUS
          =====================================================
          
          Array status diubah menjadi beberapa chip
          menggunakan map().
      */}
      <View style={styles.filters}>

        {[
          'SEMUA',
          'AKTIF',
          'NONAKTIF',
          'LULUS',
        ].map(
          (status) => (

            <Pressable

              /**
               * Setiap hasil map membutuhkan key unik.
               */
              key={status}


              /**
               * Ketika chip ditekan,
               * ubah state filter.
               */
              onPress={() =>
                setFilter(status)
              }


              /**
               * Jika filter === status,
               * tambahkan style chipSelected.
               */
              style={[
                styles.chip,

                filter === status
                  && styles.chipSelected,
              ]}
            >

              <Text
                style={[
                  styles.chipText,

                  filter === status
                    && styles.chipTextSelected,
                ]}
              >
                {status}
              </Text>

            </Pressable>
          )
        )}

      </View>


      {/* =====================================================
          HEADER DAFTAR SISWA
          ===================================================== */}
      <View style={styles.sectionHeader}>

        <View>

          <Text style={styles.sectionTitle}>
            Daftar Siswa
          </Text>


          {/* Jumlah hasil query yang sedang ditampilkan */}
          <Text style={styles.sectionSub}>
            {students.length} data ditampilkan
          </Text>

        </View>


        <Ionicons
          name="people-circle-outline"
          size={30}
          color={C.primary2}
        />

      </View>


      {/* =====================================================
          FLATLIST
          =====================================================
          
          FlatList digunakan untuk menampilkan daftar siswa.
          
          Keunggulan FlatList:
          
          - Cocok untuk data berbentuk daftar.
          - Item dirender sesuai kebutuhan.
          - Lebih efisien untuk list dibanding membuat
            seluruh item secara manual.
      */}
      <FlatList

        /**
         * Data berasal dari state students.
         */
        data={students}


        /**
         * Menggunakan id siswa sebagai key.
         *
         * id dikonversi menjadi string.
         */
        keyExtractor={
          (item) =>
            String(item.id)
        }


        /**
         * Memberikan ruang pada bagian bawah list
         * agar item terakhir tidak tertutup FAB.
         */
        contentContainerStyle={
          styles.listContent
        }


        /**
         * Ditampilkan jika hasil pencarian/filter kosong.
         */
        ListEmptyComponent={

          <Text style={styles.empty}>
            Data siswa tidak ditemukan.
          </Text>
        }


        /**
         * ====================================================
         * RENDER ITEM
         * ====================================================
         *
         * Setiap record siswa ditampilkan sebagai card.
         */
        renderItem={({
          item,
        }) => (

          <Pressable

            style={styles.card}

            /**
             * Ketika card siswa ditekan:
             *
             * Navigasi ke Detail.
             *
             * Object student dikirim melalui route params.
             */
            onPress={() =>
              navigation.navigate(
                'Detail',
                {
                  student: item,
                }
              )
            }
          >

            {/* =================================================
                AVATAR SISWA
                ================================================= */}
            <View style={styles.avatar}>

              {/**
               * Jika avatar siswa belum tercatat gagal:
               * -> tampilkan Image online.
               *
               * Jika gagal:
               * -> tampilkan fallback inisial nama.
               */}
              {!failedImages[item.id] ? (

                <Image

                  /**
                   * URL avatar dibuat berdasarkan:
                   *
                   * - NIS.
                   * - Gender.
                   */
                  source={{
                    uri:
                      getStudentAvatarUri(
                        item.nis,
                        item.gender
                      ),
                  }}

                  style={styles.avatarImage}


                  /**
                   * Jika gambar gagal dimuat:
                   *
                   * update failedImages.
                   *
                   * Spread Operator mempertahankan
                   * status error siswa lainnya.
                   */
                  onError={() =>
                    setFailedImages(
                      (prev) => ({
                        ...prev,
                        [item.id]: true,
                      })
                    )
                  }
                />

              ) : (

                /**
                 * FALLBACK AVATAR
                 *
                 * Jika gambar gagal dimuat,
                 * gunakan huruf pertama nama siswa.
                 */
                <Text style={styles.avatarText}>
                  {item.name[0]}
                </Text>

              )}

            </View>


            {/* =================================================
                INFORMASI SISWA
                ================================================= */}
            <View style={styles.studentInfo}>

              {/* Nama siswa */}
              <Text style={styles.name}>
                {item.name}
              </Text>


              {/* NIS */}
              <Text style={styles.meta}>
                NIS : {item.nis}
              </Text>


              {/* Nama kelas hasil SQL JOIN */}
              <Text style={styles.meta}>
                Kelas : {item.class_name}
              </Text>


              {/* Nama jurusan hasil SQL JOIN */}
              <Text
                style={styles.major}
                numberOfLines={1}
              >
                {item.major_name}
              </Text>

            </View>


            {/* =================================================
                STATUS DAN ICON DETAIL
                ================================================= */}
            <View style={styles.rightArea}>

              {/**
               * Warna status ditentukan secara dinamis
               * oleh fungsi statusColor().
               */}
              <Text
                style={[
                  styles.status,
                  {
                    color:
                      statusColor(
                        item.status
                      ),
                  },
                ]}
              >
                {item.status}
              </Text>


              {/* Icon menunjukkan card dapat dibuka */}
              <Ionicons
                name="chevron-forward"
                size={24}
                color={C.primary}
              />

            </View>

          </Pressable>
        )}
      />


      {/* =====================================================
          FLOATING ACTION BUTTON
          =====================================================
          
          Tombol + digunakan sebagai shortcut
          untuk menambah siswa baru.
          
          Navigasi ke Form tanpa mengirim object student,
          sehingga FormScreen bekerja dalam mode TAMBAH.
      */}
      <Pressable
        style={styles.fab}
        onPress={() =>
          navigation.navigate(
            'Form'
          )
        }
      >

        <Ionicons
          name="add"
          size={30}
          color={C.white}
        />

      </Pressable>

    </View>
  );
}


/**
 * ============================================================
 * STYLE
 * ============================================================
 */
const styles = StyleSheet.create({

  /**
   * Container utama screen.
   */
  root: {
    flex: 1,
    backgroundColor: C.bg,
    padding: 16,
  },


  /**
   * ==========================================================
   * SEARCH BOX
   * ==========================================================
   */
  search: {
    backgroundColor: C.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 1,
  },


  /**
   * TextInput pencarian.
   */
  searchInput: {
    flex: 1,
    minHeight: 46,
  },


  /**
   * ==========================================================
   * FILTER
   * ==========================================================
   */
  filters: {
    flexDirection: 'row',
    gap: 7,
    marginVertical: 13,
    flexWrap: 'wrap',
  },


  /**
   * Chip filter normal.
   */
  chip: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E8EDF5',
  },


  /**
   * Chip filter yang sedang aktif.
   */
  chipSelected: {
    backgroundColor: C.primary2,
  },


  /**
   * Teks chip normal.
   */
  chipText: {
    color: C.text,
    fontSize: 11,
    fontWeight: '700',
  },


  /**
   * Teks chip ketika aktif.
   */
  chipTextSelected: {
    color: C.white,
  },


  /**
   * ==========================================================
   * SECTION HEADER
   * ==========================================================
   */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },


  /**
   * Judul daftar.
   */
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: C.text,
  },


  /**
   * Informasi jumlah data.
   */
  sectionSub: {
    fontSize: 11,
    color: C.muted,
    marginTop: 2,
  },


  /**
   * Memberikan ruang di bawah FlatList
   * untuk Floating Action Button.
   */
  listContent: {
    paddingBottom: 86,
  },


  /**
   * ==========================================================
   * STUDENT CARD
   * ==========================================================
   */
  card: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 12,
    marginBottom: 11,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    elevation: 2,
  },


  /**
   * Container avatar siswa.
   */
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: C.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },


  /**
   * Avatar online memenuhi container.
   */
  avatarImage: {
    width: '100%',
    height: '100%',
  },


  /**
   * Fallback avatar berupa inisial.
   */
  avatarText: {
    fontSize: 24,
    fontWeight: '900',
    color: C.primary,
  },


  /**
   * Informasi utama siswa menggunakan sisa ruang card.
   */
  studentInfo: {
    flex: 1,
  },


  /**
   * Nama siswa.
   */
  name: {
    fontSize: 16,
    fontWeight: '900',
    color: C.text,
    marginBottom: 2,
  },


  /**
   * Informasi NIS dan kelas.
   */
  meta: {
    fontSize: 12,
    color: C.muted,
    lineHeight: 17,
  },


  /**
   * Nama jurusan.
   */
  major: {
    fontSize: 11,
    color: C.primary2,
    marginTop: 2,
  },


  /**
   * Area kanan card:
   *
   * - Status.
   * - Chevron.
   */
  rightArea: {
    alignItems: 'flex-end',
    gap: 12,
  },


  /**
   * Teks status.
   *
   * Warna tidak ditentukan di sini karena diberikan
   * secara dinamis melalui statusColor().
   */
  status: {
    fontSize: 9,
    fontWeight: '900',
  },


  /**
   * Tampilan jika data tidak ditemukan.
   */
  empty: {
    textAlign: 'center',
    color: C.muted,
    marginTop: 40,
  },


  /**
   * ==========================================================
   * FLOATING ACTION BUTTON
   * ==========================================================
   *
   * position absolute membuat tombol mengambang
   * pada kanan bawah screen.
   */
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: C.red,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});
