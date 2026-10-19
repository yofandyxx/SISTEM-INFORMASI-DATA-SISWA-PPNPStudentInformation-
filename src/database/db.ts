/**
 * ============================================================
 * PROJECT 01 - SISTEM INFORMASI DATA SISWA
 * File        : db.ts
 * Lokasi      : src/database/db.ts  
 * Fungsi      : Lapisan database SQLite aplikasi.
 * Dibuat oleh : Amrizal,S.Kom, M.Kom
 * 
 * Project 01 dibatasi maksimal 3 tabel:
 *
 * 1. classes
 *    -> Master data kelas.
 *
 * 2. majors
 *    -> Master data jurusan.
 *
 * 3. students
 *    -> Data utama/transaksi siswa.
 *
 * Fitur database:
 * - Membuka database SQLite.
 * - Membuat tabel.
 * - Mengaktifkan Foreign Key.
 * - Mengisi seed/sample data.
 * - SELECT data siswa.
 * - Search siswa.
 * - Filter status.
 * - SQL JOIN.
 * - Mengambil master data.
 * - Menghitung statistik.
 * - INSERT siswa.
 * - UPDATE siswa.
 * - DELETE siswa.
 *
 * Konsep penting:
 * - SQLite
 * - Primary Key
 * - AUTOINCREMENT
 * - UNIQUE
 * - Foreign Key
 * - Relasi tabel
 * - SQL JOIN
 * - CRUD
 * - Parameterized Query
 * - Search dengan LIKE
 * - Dynamic SQL
 * - Aggregate Function
 * - Seed Data
 * - Async/Await
 * ============================================================
 */

import * as SQLite from 'expo-sqlite';

import { Student } from '../types';


/**
 * ============================================================
 * DATABASE INSTANCE
 * ============================================================
 *
 * Variabel db menyimpan koneksi/instance database SQLite
 * yang digunakan oleh seluruh fungsi pada file ini.
 */
let db: SQLite.SQLiteDatabase;


/**
 * ============================================================
 * INIT DATABASE
 * ============================================================
 *
 * Fungsi ini bertugas:
 *
 * 1. Membuka database students.db.
 * 2. Mengaktifkan Foreign Key.
 * 3. Membuat tabel classes.
 * 4. Membuat tabel majors.
 * 5. Membuat tabel students.
 * 6. Mengisi sample data jika database masih kosong.
 */
export async function initDB() {

  /**
   * Membuka atau membuat database.
   *
   * Jika students.db belum tersedia,
   * SQLite akan membuatnya.
   */
  db =
    await SQLite.openDatabaseAsync(
      'students.db'
    );


  /**
   * ==========================================================
   * MEMBUAT STRUKTUR DATABASE
   * ==========================================================
   */
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY,
      code TEXT UNIQUE,
      name TEXT
    );

    CREATE TABLE IF NOT EXISTS majors (
      id INTEGER PRIMARY KEY,
      code TEXT UNIQUE,
      name TEXT
    );

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nis TEXT UNIQUE,
      name TEXT,
      gender TEXT,
      class_id INTEGER,
      major_id INTEGER,
      address TEXT,
      status TEXT,
      FOREIGN KEY(class_id) REFERENCES classes(id),
      FOREIGN KEY(major_id) REFERENCES majors(id)
    );
  `);


  /**
   * ==========================================================
   * RELASI DATABASE
   * ==========================================================
   *
   * classes
   *    1
   *    |
   *    | class_id
   *    |
   *    N
   * students
   *
   *
   * majors
   *    1
   *    |
   *    | major_id
   *    |
   *    N
   * students
   *
   *
   * Artinya:
   *
   * Satu kelas dapat digunakan oleh banyak siswa.
   * Satu jurusan dapat digunakan oleh banyak siswa.
   */


  /**
   * ==========================================================
   * CEK DATA MASTER
   * ==========================================================
   *
   * Seed hanya dijalankan ketika tabel classes
   * belum mempunyai data.
   *
   * Query:
   *
   * SELECT COUNT(*) n FROM classes
   *
   * menghitung jumlah record pada tabel classes.
   */
  const result =
    await db.getFirstAsync<{
      n: number;
    }>(
      'SELECT COUNT(*) n FROM classes'
    );


  /**
   * ==========================================================
   * SEED DATA
   * ==========================================================
   *
   * Jika jumlah data classes adalah 0,
   * masukkan data awal:
   *
   * - Classes.
   * - Majors.
   * - Students.
   */
  if (!result?.n) {

    await db.execAsync(`
      INSERT INTO classes VALUES
        (1, 'X', 'Kelas X'),
        (2, 'XI', 'Kelas XI'),
        (3, 'XII', 'Kelas XII');

      INSERT INTO majors VALUES
        (1, 'RPL', 'Rekayasa Perangkat Lunak'),
        (2, 'TKJ', 'Teknik Komputer dan Jaringan'),
        (3, 'ATPH', 'Agribisnis Tanaman Pangan dan Hortikultura');

      INSERT INTO students
        (nis, name, gender, class_id, major_id, address, status)
      VALUES
        ('26001', 'Ahmad Fauzan', 'L', 1, 1, 'Payakumbuh, Sumatera Barat', 'AKTIF'),
        ('26002', 'Putri Andriani', 'P', 1, 1, 'Lima Puluh Kota, Sumatera Barat', 'AKTIF'),
        ('26003', 'Rizky Ramadhan', 'L', 2, 2, 'Bukittinggi, Sumatera Barat', 'AKTIF'),
        ('26004', 'Siti Rahma', 'P', 2, 3, 'Batusangkar, Sumatera Barat', 'AKTIF'),
        ('26005', 'Fajar Maulana', 'L', 3, 2, 'Padang Panjang, Sumatera Barat', 'LULUS'),
        ('26006', 'Nadia Safitri', 'P', 1, 3, 'Payakumbuh, Sumatera Barat', 'AKTIF'),
        ('26007', 'Dimas Saputra', 'L', 2, 1, 'Solok, Sumatera Barat', 'NONAKTIF'),
        ('26008', 'Aulia Rahmi', 'P', 3, 3, 'Lima Puluh Kota, Sumatera Barat', 'LULUS');
    `);
  }
}


/**
 * ============================================================
 * GET STUDENTS
 * ============================================================
 *
 * Mengambil daftar siswa dari SQLite.
 *
 * Fungsi sekaligus menyediakan:
 *
 * - SQL JOIN.
 * - Search berdasarkan nama.
 * - Search berdasarkan NIS.
 * - Filter berdasarkan status.
 * - Sorting berdasarkan nama.
 *
 * Parameter:
 *
 * query
 * -> keyword pencarian.
 *
 * status
 * -> filter status siswa.
 *
 * Nilai default:
 *
 * query  = ''
 * status = 'SEMUA'
 */
export async function getStudents(
  query = '',
  status = 'SEMUA'
) {

  /**
   * ==========================================================
   * SQL JOIN
   * ==========================================================
   *
   * Data siswa mempunyai:
   *
   * class_id
   * major_id
   *
   * Tetapi untuk tampilan aplikasi kita membutuhkan:
   *
   * class_name
   * major_name
   *
   * Oleh karena itu tabel students digabung dengan:
   *
   * classes
   * majors
   */
  let sql = `
    SELECT
      s.*,
      c.name AS class_name,
      m.name AS major_name
    FROM students s
    JOIN classes c
      ON c.id = s.class_id
    JOIN majors m
      ON m.id = s.major_id
    WHERE (
      s.name LIKE ?
      OR s.nis LIKE ?
    )
  `;


  /**
   * ==========================================================
   * PARAMETER SEARCH
   * ==========================================================
   *
   * Jika query:
   *
   * Ahmad
   *
   * maka parameter menjadi:
   *
   * %Ahmad%
   *
   * Tanda % merupakan wildcard pada SQL LIKE.
   */
  const params: any[] = [
    `%${query}%`,
    `%${query}%`,
  ];


  /**
   * ==========================================================
   * FILTER STATUS
   * ==========================================================
   *
   * Jika status masih SEMUA:
   * -> tidak menambahkan filter.
   *
   * Jika misalnya status = AKTIF:
   *
   * SQL ditambah:
   *
   * AND s.status = ?
   */
  if (status !== 'SEMUA') {

    sql +=
      ' AND s.status = ?';

    params.push(status);
  }


  /**
   * ==========================================================
   * EKSEKUSI SELECT
   * ==========================================================
   *
   * ORDER BY s.name
   * digunakan untuk mengurutkan siswa berdasarkan nama.
   *
   * Generic <Student> membantu TypeScript mengetahui
   * bentuk data hasil query.
   */
  return db.getAllAsync<Student>(
    sql + ' ORDER BY s.name',
    params
  );
}


/**
 * ============================================================
 * GET MASTERS
 * ============================================================
 *
 * Mengambil master data yang digunakan pada form siswa:
 *
 * - classes
 * - majors
 *
 * Data ini dapat digunakan sebagai pilihan/dropdown
 * ketika user menambah atau mengedit siswa.
 */
export async function getMasters() {

  return {

    /**
     * Mengambil seluruh data kelas.
     */
    classes:
      await db.getAllAsync<any>(
        'SELECT * FROM classes'
      ),


    /**
     * Mengambil seluruh data jurusan.
     */
    majors:
      await db.getAllAsync<any>(
        'SELECT * FROM majors'
      ),
  };
}


/**
 * ============================================================
 * GET STATS
 * ============================================================
 *
 * Menghasilkan data ringkasan siswa untuk Dashboard.
 *
 * Statistik:
 *
 * total
 * -> Seluruh siswa.
 *
 * active
 * -> Siswa berstatus AKTIF.
 *
 * inactive
 * -> Siswa berstatus NONAKTIF.
 *
 * graduated
 * -> Siswa berstatus LULUS.
 */
export function getStats() {

  return db.getFirstAsync<any>(`
    SELECT
      COUNT(*) AS total,
      SUM(status = 'AKTIF') AS active,
      SUM(status = 'NONAKTIF') AS inactive,
      SUM(status = 'LULUS') AS graduated
    FROM students
  `);
}


/**
 * ============================================================
 * SAVE STUDENT
 * ============================================================
 *
 * Satu fungsi digunakan untuk dua operasi:
 *
 * 1. INSERT siswa baru.
 * 2. UPDATE siswa lama.
 *
 * Parameter:
 *
 * student
 * -> Data siswa yang akan disimpan.
 *
 * id
 * -> Optional.
 *
 * Jika id tersedia:
 * -> UPDATE.
 *
 * Jika id tidak tersedia:
 * -> INSERT.
 */
export async function saveStudent(
  student: any,
  id?: number
) {

  /**
   * ==========================================================
   * PARAMETER DATA SISWA
   * ==========================================================
   *
   * Urutan parameter harus sesuai dengan urutan placeholder
   * tanda ? pada SQL INSERT maupun UPDATE.
   */
  const params = [
    student.nis,
    student.name,
    student.gender,
    student.class_id,
    student.major_id,
    student.address,
    student.status,
  ];


  /**
   * ==========================================================
   * UPDATE
   * ==========================================================
   *
   * Jika id tersedia, record siswa yang sudah ada
   * akan diperbarui.
   */
  if (id) {

    return db.runAsync(
      `
        UPDATE students
        SET
          nis=?,
          name=?,
          gender=?,
          class_id=?,
          major_id=?,
          address=?,
          status=?
        WHERE id=?
      `,
      [
        ...params,
        id,
      ],
    );
  }


  /**
   * ==========================================================
   * INSERT
   * ==========================================================
   *
   * Jika id tidak tersedia, data dianggap sebagai
   * siswa baru.
   */
  return db.runAsync(
    `
      INSERT INTO students
        (
          nis,
          name,
          gender,
          class_id,
          major_id,
          address,
          status
        )
      VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )
    `,
    params,
  );
}


/**
 * ============================================================
 * DELETE STUDENT
 * ============================================================
 *
 * Menghapus satu siswa berdasarkan Primary Key:
 *
 * id
 *
 * Parameterized Query digunakan dengan:
 *
 * WHERE id=?
 */
export function deleteStudent(
  id: number
) {

  return db.runAsync(
    'DELETE FROM students WHERE id=?',
    id
  );
}
