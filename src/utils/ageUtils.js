// Calculate age from birth year
export function calculateAge(birthYear) {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}

// Determine the appropriate branch (Ngành) based on age
// 7-12: Ngành Oanh (Children)
// 13-17: Ngành Thiếu (Teens)
// 18+: Ngành Thanh (Young Adults)
export function getBranchByAge(birthYear) {
  const age = calculateAge(birthYear);

  if (age < 7) {
    return { branch: 'Chưa đủ tuổi', code: 'none', ageRange: 'Dưới 7 tuổi' };
  } else if (age >= 7 && age <= 12) {
    return { branch: 'Ngành Oanh', code: 'oanh', ageRange: '7-12 tuổi' };
  } else if (age >= 13 && age <= 17) {
    return { branch: 'Ngành Thiếu', code: 'thieu', ageRange: '13-17 tuổi' };
  } else {
    return { branch: 'Ngành Thanh', code: 'thanh', ageRange: '18+ tuổi' };
  }
}

// Leadership roles that should not get age transition warnings
const LEADERSHIP_ROLES = [
  'đoàn trưởng',
  'đoàn phó',
  'doan truong',
  'doan pho',
  'đoàn phó 1',
  'đoàn phó 2',
  'doan pho 1',
  'doan pho 2',
  'doan_truong',
  'doan_pho',
  'doan_pho_1',
  'doan_pho_2',
];

// Check if a member has a leadership role
function isLeadershipRole(chucVu) {
  if (!chucVu) return false;
  const lowerChucVu = chucVu.toLowerCase().trim();
  return LEADERSHIP_ROLES.some(role => lowerChucVu.includes(role));
}

// Check if a member should transition to a different branch
// Only applies warnings for Đoàn Sinh Ngành Oanh and Ngành Thiếu
// Excludes members with leadership roles (Đoàn Trưởng, Đoàn Phó)
export function shouldTransitionBranch(birthYear, currentBranch, chucVu = null) {
  // Skip if member has a leadership role
  if (isLeadershipRole(chucVu)) {
    return null;
  }

  // Only apply warnings for Ngành Oanh and Ngành Thiếu đoàn sinh
  const isOanh = currentBranch === 'oanh_nam' || currentBranch === 'oanh_nu';
  const isThieu = currentBranch === 'thieu_nam' || currentBranch === 'thieu_nu';

  // Skip if not Ngành Oanh or Ngành Thiếu
  if (!isOanh && !isThieu) {
    return null;
  }

  const expectedBranch = getBranchByAge(birthYear);

  if (!currentBranch || currentBranch === expectedBranch.code) {
    return null;
  }

  // Extract the base branch code (remove _nam/_nu suffix)
  const baseBranch = currentBranch.replace(/_nam|_nu/g, '');

  if (baseBranch === expectedBranch.code) {
    return null;
  }

  return {
    from: currentBranch,
    to: expectedBranch.code,
    toBranchName: expectedBranch.branch,
    age: calculateAge(birthYear)
  };
}

// Get all members who need to transition branches
// Only applies for Đoàn Sinh Ngành Oanh and Ngành Thiếu
// Excludes members with leadership roles
export function getMembersNeedingTransition(members) {
  return members
    .map(member => {
      const transition = shouldTransitionBranch(member.birthYear, member.nganh, member.chucVu);
      if (transition) {
        return {
          ...member,
          transition
        };
      }
      return null;
    })
    .filter(Boolean);
}

// Branch display names in Vietnamese
export const BRANCH_NAMES = {
  'oanh_nam': 'Oanh Nam',
  'oanh_nu': 'Oanh Nữ',
  'thieu_nam': 'Thiếu Nam',
  'thieu_nu': 'Thiếu Nữ',
  'thanh_nam': 'Thanh Nam',
  'thanh_nu': 'Thanh Nữ',
  'ban_huynh_truong': 'Ban Huynh Trưởng'
};

// Branch colors for display
export const BRANCH_COLORS = {
  'oanh': 'badge-warning',
  'thieu': 'badge-info',
  'thanh': 'badge-success',
  'none': 'badge-ghost'
};
