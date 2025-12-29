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

// Check if a member should transition to a different branch
export function shouldTransitionBranch(birthYear, currentBranch) {
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
export function getMembersNeedingTransition(members) {
  return members
    .map(member => {
      const transition = shouldTransitionBranch(member.birthYear, member.nganh);
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
