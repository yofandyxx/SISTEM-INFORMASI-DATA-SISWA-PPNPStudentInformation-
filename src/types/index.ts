/**
 * ============================================================
 * PROJECT 01 - SISTEM INFORMASI DATA SISWA
 * File        : index.ts
 * Lokasi File : src/types/index.ts
 * Fungsi      : Mendefinisikan struktur/type data yang digunakan
 *               oleh database dan screen aplikasi.
 * Dibuat oleh : Amrizal,S.Kom, M.Kom
 * Type utama:
 *
 * 1. Status
 *    -> Membatasi nilai status siswa.
 *
 * 2. Student
 *    -> Mendefinisikan struktur object siswa.
 *
 * Konsep penting:
 * - TypeScript
 * - Custom Type
 * - Union Type
 * - Object Type
 * - Foreign Key
 * - Optional Property
 * - SQL JOIN Result
 * - Type Safety
 * ============================================================
 */


/**
 * ============================================================
 * STATUS SISWA
 * ============================================================
 *
 * Union Type digunakan untuk membatasi nilai status siswa.
 *
 * Artinya variabel bertipe Status hanya diperbolehkan
 * mempunyai salah satu dari tiga nilai:
 *
 * - AKTIF
 * - NONAKTIF
 * - LULUS
 *
 * Contoh valid:
 *
 * const status: Status = 'AKTIF';
 *
 * Contoh tidak valid:
 *
 * const status: Status = 'PINDAH';
 *
 * TypeScript akan memberikan error karena "PINDAH"
 * tidak termasuk dalam pilihan Status.
 */
export type Status =
  | 'AKTIF'
  | 'NONAKTIF'
  | 'LULUS';


/**
 * ============================================================
 * STUDENT
 * ============================================================
 *
 * Type Student mendefinisikan struktur data seorang siswa
 * yang digunakan oleh screen dan database.
 *
 * Struktur ini membantu TypeScript memastikan bahwa
 * object siswa mempunyai property dan tipe data
 * yang sesuai dengan kebutuhan aplikasi.
 */
export type Student = {

  /**
   * Primary Key tabel students.
   *
   * Pada SQLite:
   *
   * id INTEGER PRIMARY KEY AUTOINCREMENT
   */
  id: number;


  /**
   * Nomor Induk Siswa.
   *
   * Pada database, NIS mempunyai constraint UNIQUE
   * sehingga tidak boleh terdapat dua siswa
   * dengan NIS yang sama.
   */
  nis: string;


  /**
   * Nama lengkap siswa.
   */
  name: string;


  /**
   * Jenis kelamin menggunakan Union Type.
   *
   * Nilai yang diperbolehkan:
   *
   * L -> Laki-laki
   * P -> Perempuan
   */
  gender:
    | 'L'
    | 'P';


  /**
   * ==========================================================
   * FOREIGN KEY KELAS
   * ==========================================================
   *
   * class_id menyimpan id kelas siswa.
   *
   * Relasi database:
   *
   * students.class_id
   *        ↓
   * classes.id
   */
  class_id: number;


  /**
   * ==========================================================
   * FOREIGN KEY JURUSAN
   * ==========================================================
   *
   * major_id menyimpan id jurusan siswa.
   *
   * Relasi database:
   *
   * students.major_id
   *        ↓
   * majors.id
   */
  major_id: number;


  /**
   * Alamat siswa.
   */
  address: string;


  /**
   * Status siswa menggunakan custom type:
   *
   * Status
   *
   * sehingga nilainya dibatasi menjadi:
   *
   * AKTIF | NONAKTIF | LULUS
   */
  status: Status;


  /**
   * ==========================================================
   * OPTIONAL PROPERTY - CLASS NAME
   * ==========================================================
   *
   * Tanda:
   *
   * ?
   *
   * berarti property bersifat optional.
   *
   * class_name tidak tersimpan langsung sebagai kolom
   * pada tabel students.
   *
   * Nilai ini diperoleh dari hasil SQL JOIN:
   *
   * students.class_id
   *        ↓
   * classes.id
   *        ↓
   * classes.name
   *
   * Pada db.ts digunakan alias:
   *
   * c.name AS class_name
   */
  class_name?: string;


  /**
   * ==========================================================
   * OPTIONAL PROPERTY - MAJOR NAME
   * ==========================================================
   *
   * major_name juga bukan kolom langsung pada
   * tabel students.
   *
   * Nilai diperoleh dari hasil SQL JOIN:
   *
   * students.major_id
   *        ↓
   * majors.id
   *        ↓
   * majors.name
   *
   * Pada db.ts digunakan alias:
   *
   * m.name AS major_name
   */
  major_name?: string;
};
