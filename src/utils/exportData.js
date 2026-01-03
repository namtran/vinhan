import { BRANCH_NAMES } from './ageUtils';

const NGANH_CHINH_NAMES = {
  'ban_huynh_truong': 'Ban Huynh Trưởng',
  'nganh_thanh': 'Ngành Thanh',
  'nganh_thieu': 'Ngành Thiếu',
  'nganh_oanh': 'Ngành Oanh',
};

// Helper to resolve member ID to member data
function getMemberById(members, id) {
  if (!id || !members) return null;
  const member = members.find(m => m.id === id);
  if (!member) return null;
  return {
    id: member.id,
    name: member.hoTen,
    hoTen: member.hoTen,
    phapDanh: member.phapDanh,
    phone: member.phone,
    address: member.address,
    birthYear: member.birthYear,
    capBac: member.capBac,
    chucVu: member.chucVu,
    nganh: member.nganh,
  };
}

// Build resolved organization structure from IDs
function buildOrgStructure(orgData, members) {
  if (!orgData) return null;

  return {
    giaTruong: getMemberById(members, orgData.giaTruongId),
    lienDoanTruong: getMemberById(members, orgData.lienDoanTruongId),
    lienDoanPho: getMemberById(members, orgData.lienDoanPhoId),
    thuKy: getMemberById(members, orgData.thuKyId),
    thuQuy: getMemberById(members, orgData.thuQuyId),
    branches: {
      thanh_nam: {
        doanTruong: getMemberById(members, orgData.doanTruongThanhNamId),
        doanPho1: getMemberById(members, orgData.doanPho1ThanhNamId),
        doanPho2: getMemberById(members, orgData.doanPho2ThanhNamId),
      },
      thanh_nu: {
        doanTruong: getMemberById(members, orgData.doanTruongThanhNuId),
        doanPho1: getMemberById(members, orgData.doanPho1ThanhNuId),
        doanPho2: getMemberById(members, orgData.doanPho2ThanhNuId),
      },
      thieu_nam: {
        doanTruong: getMemberById(members, orgData.doanTruongThieuNamId),
        doanPho1: getMemberById(members, orgData.doanPho1ThieuNamId),
        doanPho2: getMemberById(members, orgData.doanPho2ThieuNamId),
      },
      thieu_nu: {
        doanTruong: getMemberById(members, orgData.doanTruongThieuNuId),
        doanPho1: getMemberById(members, orgData.doanPho1ThieuNuId),
        doanPho2: getMemberById(members, orgData.doanPho2ThieuNuId),
      },
      oanh_nam: {
        doanTruong: getMemberById(members, orgData.doanTruongOanhNamId),
        doanPho1: getMemberById(members, orgData.doanPho1OanhNamId),
        doanPho2: getMemberById(members, orgData.doanPho2OanhNamId),
      },
      oanh_nu: {
        doanTruong: getMemberById(members, orgData.doanTruongOanhNuId),
        doanPho1: getMemberById(members, orgData.doanPho1OanhNuId),
        doanPho2: getMemberById(members, orgData.doanPho2OanhNuId),
      },
    }
  };
}

// Export members to CSV
export function exportToCSV(members, orgData) {
  const headers = [
    'Họ Tên',
    'Pháp Danh',
    'Năm Sinh',
    'Ngành',
    'Đơn Vị',
    'Chức Vụ',
    'Cấp Bậc',
    'SĐT',
    'Địa Chỉ',
    'Quá Trình Sinh Hoạt'
  ];

  const rows = members.map(m => [
    m.hoTen || '',
    m.phapDanh || '',
    m.birthYear || '',
    NGANH_CHINH_NAMES[m.nganhChinh] || m.nganhChinh || '',
    BRANCH_NAMES[m.nganh] || m.nganh || '',
    m.chucVu || '',
    m.capBac || '',
    m.phone || '',
    m.address || '',
    (m.quaTrinhSinhHoat || '').replace(/\n/g, ' ')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Add BOM for UTF-8
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, 'danh-sach-doan-sinh.csv');
}

// Export members to JSON
export function exportToJSON(members, orgData) {
  const organization = buildOrgStructure(orgData, members);

  const data = {
    exportDate: new Date().toISOString(),
    organization: {
      name: 'GĐPT Vĩnh An',
      giaTruong: organization?.giaTruong || null,
      lienDoanTruong: organization?.lienDoanTruong || null,
      lienDoanPho: organization?.lienDoanPho || null,
      thuKy: organization?.thuKy || null,
      thuQuy: organization?.thuQuy || null,
      branches: organization?.branches || {}
    },
    members: members.map(m => ({
      hoTen: m.hoTen,
      phapDanh: m.phapDanh,
      birthYear: m.birthYear,
      nganhChinh: m.nganhChinh,
      nganh: m.nganh,
      chucVu: m.chucVu,
      capBac: m.capBac,
      phone: m.phone,
      address: m.address,
      quaTrinhSinhHoat: m.quaTrinhSinhHoat
    })),
    totalMembers: members.length
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadFile(blob, 'gdpt-vinhan-data.json');
}

// Export to PDF (HTML-based) - Safari compatible
export function exportToPDF(members, orgData) {
  const organization = buildOrgStructure(orgData, members);
  const orgHtml = generateOrgChartHTML(organization);
  const membersHtml = generateMembersTableHTML(members);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>GĐPT Vĩnh An - Danh Sách Đoàn Sinh</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
          padding: 20px;
          font-size: 16px;
          color: #44403c;
          background: #fdfcfb;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        /* Peaceful, harmonious colors for Buddhist pagoda */
        h1 { text-align: center; color: #92400e; margin-bottom: 10px; font-size: 28px; }
        h2 { color: #78716c; margin: 20px 0 10px; font-size: 22px; border-bottom: 2px solid #d6d3d1; padding-bottom: 5px; }
        h3 { color: #78716c; margin: 15px 0 8px; font-size: 18px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header p { color: #78716c; font-size: 14px; }
        .org-section { margin-bottom: 30px; }
        .org-group {
          background: #faf8f5;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
          border: 1px solid #e7e5e4;
        }
        .org-group-title {
          font-weight: bold;
          color: #92400e;
          margin-bottom: 10px;
          font-size: 18px;
        }
        .org-member {
          display: inline-block;
          background: #fff;
          padding: 10px 14px;
          margin: 5px;
          border-radius: 4px;
          border: 1px solid #e7e5e4;
        }
        .org-member strong { color: #44403c; font-size: 15px; display: block; }
        .org-member span { color: #78716c; font-size: 13px; }
        .branch-section {
          display: inline-block;
          vertical-align: top;
          margin: 5px 10px;
          text-align: center;
        }
        .branch-name {
          font-weight: bold;
          color: #78716c;
          margin-bottom: 5px;
          font-size: 15px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 13px;
        }
        th, td {
          border: 1px solid #d6d3d1;
          padding: 8px 10px;
          text-align: left;
          color: #44403c;
        }
        th {
          background: #b45309;
          color: #fff;
          font-weight: 600;
          font-size: 14px;
        }
        tr:nth-child(even) { background: #faf8f5; }
        tr:nth-child(odd) { background: #fff; }
        .footer {
          margin-top: 30px;
          text-align: center;
          color: #78716c;
          font-size: 13px;
        }
        .print-btn {
          display: block;
          margin: 0 auto 20px;
          padding: 12px 24px;
          font-size: 16px;
          background: #b45309;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        .print-btn:hover { background: #92400e; }
        .safari-note {
          text-align: center;
          padding: 10px;
          background: #fef7ed;
          border: 1px solid #fed7aa;
          border-radius: 6px;
          margin-bottom: 15px;
          font-size: 13px;
          color: #9a3412;
        }
        @media print {
          body { padding: 10px; background: #fff; }
          .no-print { display: none !important; }
          .org-group { background: #faf8f5 !important; }
          th { background: #b45309 !important; color: #fff !important; }
        }
      </style>
    </head>
    <body>
      <div class="no-print safari-note">
        <strong>Hướng dẫn:</strong> Nhấn nút bên dưới hoặc dùng Cmd+P (Mac) / Ctrl+P (Windows) để in hoặc lưu PDF
      </div>

      <button class="no-print print-btn" onclick="window.print()">
        In / Lưu PDF
      </button>

      <div class="header">
        <h1>Gia Đình Phật Tử Vĩnh An</h1>
        <p>Chùa Vĩnh An - Danh Sách Đoàn Sinh</p>
        <p>Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</p>
      </div>

      ${orgHtml}
      ${membersHtml}

      <div class="footer">
        <p>Tổng số đoàn sinh: ${members.length}</p>
        <p>GĐPT Vĩnh An - Xuất bởi hệ thống quản lý</p>
      </div>
    </body>
    </html>
  `;

  // Try to open in new window/tab - Safari compatible approach
  let printWindow = null;

  try {
    // Method 1: Standard window.open
    printWindow = window.open('about:blank', '_blank');

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } else {
      // Popup was blocked - use fallback method
      throw new Error('Popup blocked');
    }
  } catch {
    // Method 2: Fallback using Blob URL (works better in Safari)
    try {
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      printWindow = window.open(url, '_blank');

      if (!printWindow) {
        // If still blocked, create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = 'gdpt-vinhan-baocao.html';
        link.click();

        // Show user-friendly message
        setTimeout(() => {
          URL.revokeObjectURL(url);
          alert('Đã tải file HTML. Mở file và nhấn Cmd+P (Mac) hoặc Ctrl+P (Windows) để in PDF.');
        }, 100);
        return;
      }

      // Clean up blob URL after window loads
      printWindow.onload = () => {
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      };
    } catch {
      alert('Không thể mở cửa sổ in. Vui lòng cho phép popup trong trình duyệt và thử lại.');
    }
  }
}

function generateOrgChartHTML(organization) {
  if (!organization) return '<p style="color: #78716c;">Chưa có dữ liệu sơ đồ tổ chức</p>';

  // Peaceful, harmonious colors
  const renderMember = (member, role) => {
    const memberStyle = 'display: inline-block; background: #fff; padding: 10px 14px; margin: 5px; border-radius: 4px; border: 1px solid #e7e5e4;';
    const nameStyle = 'color: #44403c; font-size: 15px; font-weight: bold; display: block;';
    const roleStyle = 'color: #78716c; font-size: 13px;';

    if (!member) return `<div style="${memberStyle}"><strong style="${nameStyle}">Chưa có</strong><span style="${roleStyle}">${role}</span></div>`;
    return `<div style="${memberStyle}"><strong style="${nameStyle}">${member.name || member.hoTen || 'Chưa có'}</strong><span style="${roleStyle}">${role}${member.phapDanh ? ` - ${member.phapDanh}` : ''}</span></div>`;
  };

  const renderBranch = (branch, branchName) => {
    if (!branch) return '';
    const hasMember = branch.doanTruong || branch.doanPho1 || branch.doanPho2;
    if (!hasMember) return '';

    const branchStyle = 'display: inline-block; vertical-align: top; margin: 5px 10px; text-align: center;';
    const branchNameStyle = 'font-weight: bold; color: #78716c; margin-bottom: 5px; font-size: 15px;';

    return `
      <div style="${branchStyle}">
        <div style="${branchNameStyle}">${branchName}</div>
        ${branch.doanTruong ? renderMember(branch.doanTruong, 'Đoàn Trưởng') : ''}
        ${branch.doanPho1 ? renderMember(branch.doanPho1, 'Đoàn Phó 1') : ''}
        ${branch.doanPho2 ? renderMember(branch.doanPho2, 'Đoàn Phó 2') : ''}
      </div>
    `;
  };

  const hasLeaders = organization.giaTruong || organization.lienDoanTruong ||
                     organization.lienDoanPho || organization.thuKy || organization.thuQuy;

  const thanhNam = renderBranch(organization.branches?.thanh_nam, 'Thanh Nam');
  const thanhNu = renderBranch(organization.branches?.thanh_nu, 'Thanh Nữ');
  const thieuNam = renderBranch(organization.branches?.thieu_nam, 'Thiếu Nam');
  const thieuNu = renderBranch(organization.branches?.thieu_nu, 'Thiếu Nữ');
  const oanhNam = renderBranch(organization.branches?.oanh_nam, 'Oanh Nam');
  const oanhNu = renderBranch(organization.branches?.oanh_nu, 'Oanh Nữ');

  const sectionStyle = 'margin-bottom: 30px;';
  const groupStyle = 'background: #faf8f5; padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #e7e5e4;';
  const groupTitleStyle = 'font-weight: bold; color: #92400e; margin-bottom: 10px; font-size: 18px;';

  return `
    <div style="${sectionStyle}">
      <h2 style="color: #78716c; margin: 20px 0 10px; font-size: 22px; border-bottom: 2px solid #d6d3d1; padding-bottom: 5px;">Sơ Đồ Tổ Chức</h2>

      <div style="${groupStyle}">
        <div style="${groupTitleStyle}">Ban Huynh Trưởng</div>
        ${hasLeaders ? `
          ${organization.giaTruong ? renderMember(organization.giaTruong, 'Gia Trưởng') : ''}
          ${organization.lienDoanTruong ? renderMember(organization.lienDoanTruong, 'Liên Đoàn Trưởng') : ''}
          ${organization.lienDoanPho ? renderMember(organization.lienDoanPho, 'Liên Đoàn Phó') : ''}
          ${organization.thuKy ? renderMember(organization.thuKy, 'Thư Ký') : ''}
          ${organization.thuQuy ? renderMember(organization.thuQuy, 'Thủ Quỹ') : ''}
        ` : '<p style="color: #78716c; font-style: italic;">Chưa phân công</p>'}
      </div>

      ${(thanhNam || thanhNu) ? `
        <div style="${groupStyle}">
          <div style="${groupTitleStyle}">Ngành Thanh</div>
          ${thanhNam}
          ${thanhNu}
        </div>
      ` : ''}

      ${(thieuNam || thieuNu) ? `
        <div style="${groupStyle}">
          <div style="${groupTitleStyle}">Ngành Thiếu</div>
          ${thieuNam}
          ${thieuNu}
        </div>
      ` : ''}

      ${(oanhNam || oanhNu) ? `
        <div style="${groupStyle}">
          <div style="${groupTitleStyle}">Ngành Oanh</div>
          ${oanhNam}
          ${oanhNu}
        </div>
      ` : ''}
    </div>
  `;
}

function generateMembersTableHTML(members) {
  // Peaceful, harmonious colors for Buddhist pagoda
  const rows = members.map((m, index) => `
    <tr style="background: ${index % 2 === 0 ? '#fff' : '#faf8f5'};">
      <td style="color: #44403c; border: 1px solid #d6d3d1; padding: 8px;">${m.hoTen || ''}</td>
      <td style="color: #44403c; border: 1px solid #d6d3d1; padding: 8px;">${m.phapDanh || ''}</td>
      <td style="color: #44403c; border: 1px solid #d6d3d1; padding: 8px;">${m.birthYear || ''}</td>
      <td style="color: #44403c; border: 1px solid #d6d3d1; padding: 8px;">${NGANH_CHINH_NAMES[m.nganhChinh] || ''}</td>
      <td style="color: #44403c; border: 1px solid #d6d3d1; padding: 8px;">${BRANCH_NAMES[m.nganh] || ''}</td>
      <td style="color: #44403c; border: 1px solid #d6d3d1; padding: 8px;">${m.chucVu || ''}</td>
      <td style="color: #44403c; border: 1px solid #d6d3d1; padding: 8px;">${m.phone || ''}</td>
    </tr>
  `).join('');

  return `
    <div>
      <h2 style="color: #78716c; margin: 20px 0 10px; font-size: 22px; border-bottom: 2px solid #d6d3d1; padding-bottom: 5px;">Danh Sách Đoàn Sinh</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr>
            <th style="background: #b45309; color: #fff; padding: 10px; border: 1px solid #b45309; text-align: left;">Họ Tên</th>
            <th style="background: #b45309; color: #fff; padding: 10px; border: 1px solid #b45309; text-align: left;">Pháp Danh</th>
            <th style="background: #b45309; color: #fff; padding: 10px; border: 1px solid #b45309; text-align: left;">Năm Sinh</th>
            <th style="background: #b45309; color: #fff; padding: 10px; border: 1px solid #b45309; text-align: left;">Ngành</th>
            <th style="background: #b45309; color: #fff; padding: 10px; border: 1px solid #b45309; text-align: left;">Đơn Vị</th>
            <th style="background: #b45309; color: #fff; padding: 10px; border: 1px solid #b45309; text-align: left;">Chức Vụ</th>
            <th style="background: #b45309; color: #fff; padding: 10px; border: 1px solid #b45309; text-align: left;">SĐT</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
