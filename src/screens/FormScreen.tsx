/**
 * ============================================================
 * PROJECT 01 - SISTEM INFORMASI DATA SISWA
 * File        : FormScreen.tsx
 * Lokasi      : src/screens/FormScreen.tsx
 * Fungsi      : Form Tambah dan Edit data siswa.
 * Dibuat oleh : Amrizal,S.Kom, M.Kom
 * 
 * Fitur utama:
 * 1. Menentukan mode Tambah atau Edit.
 * 2. Mengambil master Kelas dan Jurusan dari SQLite.
 * 3. Menyimpan data form menggunakan useState.
 * 4. Membuat TextInput secara reusable.
 * 5. Membuat pilihan/chip secara reusable.
 * 6. Memvalidasi field wajib.
 * 7. Memvalidasi NIS hanya berupa angka.
 * 8. Menyimpan INSERT atau UPDATE ke SQLite.
 * 9. Menangani kemungkinan NIS duplikat.
 *
 * Konsep penting:
 * - useState
 * - useEffect
 * - route.params
 * - Optional Chaining
 * - Controlled Component
 * - Dynamic Object Property
 * - Spread Operator
 * - Array.map()
 * - Reusable Form Component
 * - Conditional Rendering
 * - Form Validation
 * - Regular Expression
 * - Async/Await
 * - try/catch
 * - SQLite INSERT / UPDATE
 * ============================================================
 */

import React, {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  Button,
  C,
} from '../componets/UI';

import {
  getMasters,
  saveStudent,
} from '../database/db';


/**
 * ============================================================
 * FORM SCREEN
 * ============================================================
 *
 * Screen digunakan untuk dua kebutuhan:
 *
 * 1. Tambah siswa baru.
 * 2. Edit siswa yang sudah tersedia.
 *
 * Penentuan mode dilakukan berdasarkan keberadaan:
 *
 * route.params?.student
 */
export default function FormScreen({
  route,
  navigation,
}: any) {

  /**
   * ==========================================================
   * DATA SISWA LAMA
   * ==========================================================
   *
   * Optional Chaining:
   *
   * route.params?.student
   *
   * berarti:
   *
   * Jika params tersedia, ambil student.
   * Jika tidak tersedia, hasilnya undefined.
   *
   * oldStudent tersedia
   * -> Mode EDIT.
   *
   * oldStudent tidak tersedia
   * -> Mode TAMBAH.
   */
  const oldStudent =
    route.params?.student;


  /**
   * ==========================================================
   * STATE MASTER DATA
   * ==========================================================
   *
   * Menyimpan data master:
   *
   * - classes
   * - majors
   *
   * Data tersebut berasal dari SQLite dan digunakan untuk
   * membuat pilihan Kelas dan Jurusan pada form.
   */
  const [
    masters,
    setMasters,
  ] = useState<any>({
    classes: [],
    majors: [],
  });


  /**
   * ==========================================================
   * STATE FORM
   * ==========================================================
   *
   * Jika mode EDIT:
   * -> form langsung menggunakan data oldStudent.
   *
   * Jika mode TAMBAH:
   * -> form menggunakan nilai awal/default.
   */
  const [
    form,
    setForm,
  ] = useState<any>(

    oldStudent || {

      /**
       * NIS awal dikosongkan.
       */
      nis: '',

      /**
       * Nama awal dikosongkan.
       */
      name: '',

      /**
       * Default jenis kelamin:
       * L = Laki-laki.
       */
      gender: 'L',

      /**
       * Default class_id = 1.
       */
      class_id: 1,

      /**
       * Default major_id = 1.
       */
      major_id: 1,

      /**
       * Alamat awal dikosongkan.
       */
      address: '',

      /**
       * Default status siswa:
       * AKTIF.
       */
      status: 'AKTIF',
    },
  );


  /**
   * ==========================================================
   * LOAD MASTER DATA
   * ==========================================================
   *
   * useEffect dengan dependency array kosong [] dijalankan
   * ketika komponen pertama kali dibuka.
   *
   * getMasters() mengambil:
   *
   * - classes
   * - majors
   *
   * dari database SQLite.
   *
   * Setelah data diperoleh:
   *
   * setMasters()
   *
   * memperbarui state sehingga pilihan Kelas dan Jurusan
   * dapat ditampilkan.
   */
  useEffect(() => {

    getMasters()
      .then(setMasters);

  }, []);


  /**
   * ==========================================================
   * RENDER FIELD
   * ==========================================================
   *
   * Helper function untuk membuat TextInput.
   *
   * Tujuan:
   * Menghindari penulisan struktur input yang sama
   * secara berulang.
   *
   * Parameter:
   *
   * label
   * -> Judul field.
   *
   * key
   * -> Property pada object form.
   *
   * placeholder
   * -> Teks petunjuk pada TextInput.
   */
  const renderField = (
    label: string,
    key: string,
    placeholder: string
  ) => {

    /**
     * Mengecek apakah field saat ini adalah NIS.
     *
     * Field NIS mendapat perlakuan khusus:
     * - hanya angka;
     * - keyboard number-pad.
     */
    const isNis =
      key === 'nis';


    return (

      <View>

        {/* Label input */}
        <Text style={styles.label}>
          {label}
        </Text>


        {/* ===================================================
            CONTROLLED TEXT INPUT
            ===================================================
            
            Nilai TextInput berasal dari state form.
            Setiap perubahan input juga memperbarui state form.
        */}
        <TextInput

          /**
           * Mengambil nilai berdasarkan key secara dinamis.
           *
           * Contoh:
           *
           * key = "name"
           *
           * maka:
           *
           * form[key]
           *
           * sama dengan:
           *
           * form.name
           *
           * ?? '' memastikan null/undefined menjadi string kosong.
           */
          value={
            String(
              form[key] ?? ''
            )
          }


          /**
           * =================================================
           * UPDATE FORM
           * =================================================
           */
          onChangeText={(value) => {

            /**
             * Khusus NIS:
             *
             * value.replace(/\D/g, '')
             *
             * menghapus seluruh karakter yang bukan angka.
             *
             * \D
             * -> karakter selain digit.
             *
             * g
             * -> diterapkan secara global pada seluruh string.
             */
            const cleanValue =
              isNis
                ? value.replace(/\D/g, '')
                : value;


            /**
             * Spread Operator:
             *
             * ...form
             *
             * mempertahankan seluruh nilai field lama.
             *
             * [key]: cleanValue
             *
             * hanya memperbarui field yang sedang diedit.
             */
            setForm({
              ...form,
              [key]: cleanValue,
            });
          }}


          placeholder={placeholder}


          /**
           * NIS menggunakan keyboard angka.
           * Field lain menggunakan keyboard default.
           */
          keyboardType={
            isNis
              ? 'number-pad'
              : 'default'
          }


          /**
           * NIS tidak memerlukan kapitalisasi.
           *
           * Field teks menggunakan kapitalisasi sentence.
           */
          autoCapitalize={
            isNis
              ? 'none'
              : 'sentences'
          }


          style={styles.input}
        />

      </View>
    );
  };


  /**
   * ==========================================================
   * RENDER CHOICES
   * ==========================================================
   *
   * Helper function untuk membuat pilihan berbentuk chip.
   *
   * Digunakan untuk:
   *
   * - Jenis Kelamin.
   * - Kelas.
   * - Jurusan.
   * - Status.
   *
   * Dengan demikian kita tidak perlu membuat komponen
   * pilihan secara berulang untuk setiap field.
   */
  const renderChoices = (
    label: string,
    key: string,
    options: any[]
  ) => (

    <View>

      {/* Label pilihan */}
      <Text style={styles.label}>
        {label}
      </Text>


      <View style={styles.choiceWrap}>

        {/**
         * map() mengubah setiap object option
         * menjadi sebuah Pressable/chip.
         */}
        {options.map((option) => {

          /**
           * Menentukan apakah option sedang dipilih.
           *
           * Contoh:
           *
           * form.gender === 'L'
           *
           * maka chip Laki-laki akan memiliki
           * style selected.
           */
          const selected =
            form[key] === option.value;


          return (

            <Pressable

              /**
               * React membutuhkan key unik pada hasil map().
               */
              key={
                String(option.value)
              }


              /**
               * Ketika chip ditekan,
               * update property form berdasarkan key.
               */
              onPress={() =>
                setForm({
                  ...form,
                  [key]: option.value,
                })
              }


              /**
               * Jika selected = true,
               * tambahkan styles.chipSelected.
               */
              style={[
                styles.chip,
                selected &&
                  styles.chipSelected,
              ]}
            >

              <Text
                style={[
                  styles.chipText,
                  selected &&
                    styles.chipTextSelected,
                ]}
              >
                {option.label}
              </Text>

            </Pressable>
          );
        })}

      </View>

    </View>
  );


  /**
   * ==========================================================
   * HANDLE SAVE
   * ==========================================================
   *
   * Tahapan:
   *
   * 1. Validasi field wajib.
   * 2. Validasi format NIS.
   * 3. Panggil saveStudent().
   * 4. SQLite melakukan INSERT atau UPDATE.
   * 5. Tampilkan pesan berhasil.
   * 6. Kembali ke screen sebelumnya.
   *
   * Jika terjadi error:
   * -> tampilkan Alert gagal.
   */
  const handleSave = async () => {

    /**
     * ========================================================
     * VALIDASI FIELD WAJIB
     * ========================================================
     *
     * NIS, nama, dan alamat tidak boleh kosong.
     *
     * trim() digunakan agar string yang hanya berisi
     * spasi juga dianggap kosong.
     */
    if (
      !form.nis.trim()
      || !form.name.trim()
      || !form.address.trim()
    ) {

      Alert.alert(
        'Validasi',
        'NIS, nama, dan alamat wajib diisi.'
      );

      /**
       * return menghentikan proses agar data
       * tidak diteruskan ke database.
       */
      return;
    }


    /**
     * ========================================================
     * VALIDASI NIS
     * ========================================================
     *
     * Regular Expression:
     *
     * /^\d+$/
     *
     * berarti seluruh isi NIS harus berupa angka.
     *
     * ^
     * -> awal string.
     *
     * \d+
     * -> satu atau lebih digit.
     *
     * $
     * -> akhir string.
     */
    if (
      !/^\d+$/.test(
        String(form.nis).trim()
      )
    ) {

      Alert.alert(
        'Validasi',
        'NIS hanya boleh berisi angka.'
      );

      return;
    }


    /**
     * ========================================================
     * PROSES SIMPAN
     * ========================================================
     *
     * try/catch digunakan karena operasi database
     * dapat menghasilkan error.
     */
    try {

      /**
       * Jika oldStudent?.id tersedia:
       * -> saveStudent() melakukan UPDATE.
       *
       * Jika tidak tersedia:
       * -> saveStudent() melakukan INSERT.
       */
      await saveStudent(
        form,
        oldStudent?.id
      );


      /**
       * ======================================================
       * PESAN BERHASIL
       * ======================================================
       *
       * Pesan disesuaikan dengan mode form.
       */
      Alert.alert(
        'Berhasil',

        oldStudent
          ? 'Data siswa berhasil diperbarui.'
          : 'Siswa berhasil ditambahkan.',

        [
          {
            text: 'OK',

            /**
             * Setelah user menekan OK,
             * kembali ke screen sebelumnya.
             */
            onPress: () =>
              navigation.goBack(),
          },
        ],
      );

    } catch {

      /**
       * ======================================================
       * ERROR HANDLING
       * ======================================================
       *
       * Salah satu penyebab error adalah NIS duplikat
       * karena kolom nis pada SQLite memiliki constraint:
       *
       * UNIQUE
       */
      Alert.alert(
        'Gagal',
        'Periksa data. NIS tidak boleh sama.'
      );
    }
  };


  /**
   * ==========================================================
   * TAMPILAN FORM
   * ==========================================================
   */
  return (

    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
    >

      {/* =====================================================
          INFORMASI MODE FORM
          ===================================================== */}
      <View style={styles.infoBox}>

        <Text style={styles.infoTitle}>

          {/**
           * Jika oldStudent tersedia:
           * -> Edit Data Siswa.
           *
           * Jika tidak:
           * -> Siswa Baru.
           */}
          {oldStudent
            ? 'Edit Data Siswa'
            : 'Siswa Baru'}

        </Text>


        <Text style={styles.infoText}>
          Lengkapi data berikut, kemudian simpan ke SQLite lokal.
        </Text>

      </View>


      {/* =====================================================
          NIS
          ===================================================== */}
      {renderField(
        'NIS',
        'nis',
        'Contoh: 26009'
      )}


      {/* =====================================================
          NAMA
          ===================================================== */}
      {renderField(
        'Nama Lengkap',
        'name',
        'Nama siswa'
      )}


      {/* =====================================================
          JENIS KELAMIN
          ===================================================== */}
      {renderChoices(
        'Jenis Kelamin',
        'gender',
        [
          {
            label: 'Laki-laki',
            value: 'L',
          },
          {
            label: 'Perempuan',
            value: 'P',
          },
        ]
      )}


      {/* =====================================================
          KELAS
          =====================================================
          
          Master kelas berasal dari SQLite.
          
          Data diubah dari:
          
          {
            id,
            code,
            name
          }
          
          menjadi:
          
          {
            label,
            value
          }
      */}
      {renderChoices(
        'Kelas',
        'class_id',

        masters.classes.map(
          (item: any) => ({
            label: item.name,
            value: item.id,
          })
        ),
      )}


      {/* =====================================================
          JURUSAN
          =====================================================
          
          Master jurusan juga berasal dari SQLite.
          
          Label yang ditampilkan menggunakan code,
          sedangkan nilai yang disimpan adalah id.
      */}
      {renderChoices(
        'Jurusan',
        'major_id',

        masters.majors.map(
          (item: any) => ({
            label: item.code,
            value: item.id,
          })
        ),
      )}


      {/* =====================================================
          ALAMAT
          ===================================================== */}
      {renderField(
        'Alamat',
        'address',
        'Alamat lengkap'
      )}


      {/* =====================================================
          STATUS
          =====================================================
          
          Array status:
          
          AKTIF
          NONAKTIF
          LULUS
          
          diubah menggunakan map() menjadi object:
          
          {
            label,
            value
          }
      */}
      {renderChoices(
        'Status',
        'status',

        [
          'AKTIF',
          'NONAKTIF',
          'LULUS',
        ].map(
          (status) => ({
            label: status,
            value: status,
          })
        ),
      )}


      {/* =====================================================
          TOMBOL SIMPAN
          =====================================================
          
          Label tombol berubah sesuai mode:
          
          TAMBAH -> Simpan Siswa
          EDIT   -> Simpan Perubahan
      */}
      <Button

        title={
          oldStudent
            ? 'Simpan Perubahan'
            : 'Simpan Siswa'
        }

        icon="save-outline"

        onPress={handleSave}
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
   * Container isi form.
   */
  content: {
    padding: 18,
    gap: 16,
  },


  /**
   * Kotak informasi di bagian atas form.
   */
  infoBox: {
    backgroundColor: C.primarySoft,
    borderRadius: 16,
    padding: 14,
  },


  /**
   * Judul kotak informasi.
   */
  infoTitle: {
    color: C.primary,
    fontSize: 16,
    fontWeight: '800',
  },


  /**
   * Deskripsi singkat form.
   */
  infoText: {
    color: C.muted,
    fontSize: 12,
    marginTop: 3,
  },


  /**
   * Label field.
   */
  label: {
    fontWeight: '700',
    fontSize: 12,
    color: C.text,
    marginBottom: 7,
  },


  /**
   * TextInput.
   */
  input: {
    backgroundColor: C.white,
    borderRadius: 13,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E4E9EE',
  },


  /**
   * Container pilihan chip.
   *
   * flexWrap memungkinkan pilihan berpindah ke baris
   * berikutnya jika lebar layar tidak mencukupi.
   */
  choiceWrap: {
    flexDirection: 'row',
    gap: 7,
    flexWrap: 'wrap',
  },


  /**
   * Tampilan chip yang belum dipilih.
   */
  chip: {
    backgroundColor: '#E6EBF0',
    padding: 10,
    borderRadius: 12,
  },


  /**
   * Tampilan chip yang sedang dipilih.
   */
  chipSelected: {
    backgroundColor: C.primary,
  },


  /**
   * Teks chip normal.
   */
  chipText: {
    color: C.text,
    fontWeight: '700',
    fontSize: 12,
  },


  /**
   * Teks chip ketika selected.
   */
  chipTextSelected: {
    color: C.white,
  },
});
