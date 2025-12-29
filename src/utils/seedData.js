import { addDocument } from '../hooks/useFirestore';

// Demo data for GĐPT Vĩnh An
export const DEMO_MEMBERS = [
  // Ngành Oanh
  {
    hoTen: 'Nguyễn Văn An',
    phapDanh: 'Tâm An',
    birthYear: 2015,
    nganhChinh: 'nganh_oanh',
    nganh: 'oanh_nam',
    chucVu: 'doan_sinh',
    phone: '0901234567',
    address: 'Quận 1, TP.HCM',
    capBac: '',
    quaTrinhSinhHoat: 'Gia nhập GĐPT năm 2022'
  },
  {
    hoTen: 'Trần Thị Bình',
    phapDanh: 'Tâm Bình',
    birthYear: 2016,
    nganhChinh: 'nganh_oanh',
    nganh: 'oanh_nu',
    chucVu: 'doan_sinh',
    phone: '0901234568',
    address: 'Quận 3, TP.HCM',
    capBac: '',
    quaTrinhSinhHoat: 'Gia nhập GĐPT năm 2023'
  },
  {
    hoTen: 'Lê Minh Châu',
    phapDanh: 'Tâm Châu',
    birthYear: 2014,
    nganhChinh: 'nganh_oanh',
    nganh: 'oanh_nam',
    chucVu: 'doan_sinh',
    phone: '0901234569',
    address: 'Quận 5, TP.HCM',
    capBac: '',
    quaTrinhSinhHoat: 'Gia nhập GĐPT năm 2021'
  },
  // Ngành Thiếu
  {
    hoTen: 'Phạm Văn Dũng',
    phapDanh: 'Tâm Dũng',
    birthYear: 2010,
    nganhChinh: 'nganh_thieu',
    nganh: 'thieu_nam',
    chucVu: 'doan_sinh',
    phone: '0901234570',
    address: 'Quận 7, TP.HCM',
    capBac: 'Hướng Thiện',
    quaTrinhSinhHoat: 'Gia nhập GĐPT năm 2018\nChuyển ngành Thiếu năm 2023'
  },
  {
    hoTen: 'Hoàng Thị Em',
    phapDanh: 'Tâm Em',
    birthYear: 2009,
    nganhChinh: 'nganh_thieu',
    nganh: 'thieu_nu',
    chucVu: 'doan_sinh',
    phone: '0901234571',
    address: 'Quận 10, TP.HCM',
    capBac: 'Sơ Thiện',
    quaTrinhSinhHoat: 'Gia nhập GĐPT năm 2017'
  },
  {
    hoTen: 'Võ Minh Phát',
    phapDanh: 'Tâm Phát',
    birthYear: 2011,
    nganhChinh: 'nganh_thieu',
    nganh: 'thieu_nam',
    chucVu: 'doan_sinh',
    phone: '0901234572',
    address: 'Quận Bình Thạnh, TP.HCM',
    capBac: 'Trung Thiện',
    quaTrinhSinhHoat: 'Gia nhập GĐPT năm 2019'
  },
  // Ngành Thanh
  {
    hoTen: 'Đặng Văn Giang',
    phapDanh: 'Tâm Giang',
    birthYear: 2004,
    nganhChinh: 'nganh_thanh',
    nganh: 'thanh_nam',
    chucVu: 'doan_truong',
    phone: '0901234573',
    address: 'Quận Tân Bình, TP.HCM',
    capBac: 'Kiên Trì',
    quaTrinhSinhHoat: 'Gia nhập GĐPT năm 2012\nĐoàn Trưởng Thanh Nam từ 2023'
  },
  {
    hoTen: 'Ngô Thị Hồng',
    phapDanh: 'Tâm Hồng',
    birthYear: 2003,
    nganhChinh: 'nganh_thanh',
    nganh: 'thanh_nu',
    chucVu: 'doan_truong',
    phone: '0901234574',
    address: 'Quận Phú Nhuận, TP.HCM',
    capBac: 'Kiên Trì',
    quaTrinhSinhHoat: 'Gia nhập GĐPT năm 2011\nĐoàn Trưởng Thanh Nữ từ 2022'
  },
  {
    hoTen: 'Bùi Văn Khoa',
    phapDanh: 'Tâm Khoa',
    birthYear: 2005,
    nganhChinh: 'nganh_thanh',
    nganh: 'thanh_nam',
    chucVu: 'doan_pho',
    phone: '0901234575',
    address: 'Quận Gò Vấp, TP.HCM',
    capBac: 'Dũng Tiến',
    quaTrinhSinhHoat: 'Gia nhập GĐPT năm 2013\nĐoàn Phó Thanh Nam từ 2024'
  },
  // Ban Huynh Trưởng
  {
    hoTen: 'Trương Văn Lâm',
    phapDanh: 'Tâm Lâm',
    birthYear: 1985,
    nganhChinh: 'ban_huynh_truong',
    nganh: 'thanh_nam',
    chucVu: 'lien_doan_truong',
    phone: '0901234576',
    address: 'Quận 1, TP.HCM',
    capBac: 'Cấp Tín',
    quaTrinhSinhHoat: 'Gia nhập GĐPT năm 1995\nLiên Đoàn Trưởng từ 2020'
  },
  {
    hoTen: 'Lý Thị Mai',
    phapDanh: 'Tâm Mai',
    birthYear: 1988,
    nganhChinh: 'ban_huynh_truong',
    nganh: 'thanh_nu',
    chucVu: 'lien_doan_pho',
    phone: '0901234577',
    address: 'Quận 3, TP.HCM',
    capBac: 'Cấp Tấn',
    quaTrinhSinhHoat: 'Gia nhập GĐPT năm 1998\nLiên Đoàn Phó từ 2021'
  },
  {
    hoTen: 'Đinh Văn Nam',
    phapDanh: 'Tâm Nam',
    birthYear: 1980,
    nganhChinh: 'ban_huynh_truong',
    nganh: 'thanh_nam',
    chucVu: 'gia_truong',
    phone: '0901234578',
    address: 'Quận 5, TP.HCM',
    capBac: 'Cấp Dũng',
    quaTrinhSinhHoat: 'Gia nhập GĐPT năm 1990\nGia Trưởng từ 2018'
  },
];

export async function seedDemoData() {
  const results = [];

  for (const member of DEMO_MEMBERS) {
    try {
      const id = await addDocument('members', member);
      results.push({ success: true, name: member.hoTen, id });
    } catch (error) {
      results.push({ success: false, name: member.hoTen, error: error.message });
    }
  }

  return results;
}
