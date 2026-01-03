import { useState } from 'react';
import OrgNode from './OrgNode';
import MemberDetailModal from './MemberDetailModal';
import AssignMemberModal from './AssignMemberModal';

export default function OrgChart({ organization, isAdmin, onEditMember, onAssignMember, members }) {
  const [selectedMember, setSelectedMember] = useState(null);
  const [assigningPosition, setAssigningPosition] = useState(null);

  const handleNodeClick = (node) => {
    if (node.memberId) {
      setSelectedMember(node);
    } else if (isAdmin && node.positionKey) {
      setAssigningPosition(node);
    }
  };

  const renderMember = (member, role, roleCode, positionKey) => (
    <OrgNode
      node={{
        ...member,
        name: member?.name || 'Chưa có',
        role,
        roleCode,
        phapDanh: member?.phapDanh,
        photoUrl: member?.photoUrl,
        memberId: member?.id,
        positionKey,
      }}
      onClick={handleNodeClick}
      isSelected={selectedMember?.memberId === member?.id}
    />
  );

  const renderBranchGroup = (branchType) => {
    const leaders = organization.branches?.[branchType] || {};
    const positionKeys = {
      thanh_nam: { truong: 'doanTruongThanhNamId', pho1: 'doanPho1ThanhNamId', pho2: 'doanPho2ThanhNamId' },
      thanh_nu: { truong: 'doanTruongThanhNuId', pho1: 'doanPho1ThanhNuId', pho2: 'doanPho2ThanhNuId' },
      thieu_nam: { truong: 'doanTruongThieuNamId', pho1: 'doanPho1ThieuNamId', pho2: 'doanPho2ThieuNamId' },
      thieu_nu: { truong: 'doanTruongThieuNuId', pho1: 'doanPho1ThieuNuId', pho2: 'doanPho2ThieuNuId' },
      oanh_nam: { truong: 'doanTruongOanhNamId', pho1: 'doanPho1OanhNamId', pho2: 'doanPho2OanhNamId' },
      oanh_nu: { truong: 'doanTruongOanhNuId', pho1: 'doanPho1OanhNuId', pho2: 'doanPho2OanhNuId' },
    };

    return (
      <div className="flex flex-col items-center">
        {renderMember(leaders.doanTruong, `Đoàn Trưởng`, 'doan_truong', positionKeys[branchType].truong)}
        {/* Branching connector to 2 Đoàn Phó using CSS */}
        <div className="flex flex-col items-center w-full">
          <div className="w-0.5 h-2 md:h-3 bg-base-content/50"></div>
          <div className="flex items-start justify-center w-full">
            <div className="flex flex-col items-center flex-1">
              <div className="w-full h-0.5 bg-base-content/50 rounded-l"></div>
              <div className="w-0.5 h-2 md:h-3 bg-base-content/50"></div>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-full h-0.5 bg-base-content/50 rounded-r"></div>
              <div className="w-0.5 h-2 md:h-3 bg-base-content/50"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-1 md:gap-4 justify-center">
          {renderMember(leaders.doanPho1, `Đoàn Phó 1`, 'doan_pho', positionKeys[branchType].pho1)}
          {renderMember(leaders.doanPho2, `Đoàn Phó 2`, 'doan_pho', positionKeys[branchType].pho2)}
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto py-4 md:py-8">
      <div className="flex flex-col items-center min-w-fit">
        {/* Ban Huynh Trưởng Group - Warm, gentle gold/brown */}
        <div className="bg-amber-50/80 dark:bg-amber-900/20 rounded-xl p-3 md:p-6 border border-amber-200/60 dark:border-amber-700/30 shadow-sm">
          <h3 className="text-lg md:text-2xl font-bold text-center mb-3 md:mb-6 text-amber-800/90 dark:text-amber-300/90">Ban Huynh Trưởng</h3>

          {/* Gia Trưởng */}
          <div className="flex flex-col items-center">
            {renderMember(organization.giaTruong, 'Gia Trưởng', 'gia_truong', 'giaTruongId')}
            <div className="w-0.5 h-2 md:h-4 bg-amber-400/60"></div>
          </div>

          {/* Liên Đoàn Trưởng */}
          <div className="flex flex-col items-center">
            {renderMember(organization.lienDoanTruong, 'Liên Đoàn Trưởng', 'lien_doan_truong', 'lienDoanTruongId')}
            <div className="w-0.5 h-2 md:h-4 bg-amber-400/60"></div>
          </div>

          {/* Liên Đoàn Phó, Thư Ký, Thủ Quỹ with proper tree connector */}
          <div className="relative">
            {/* Horizontal line spanning all 3 boxes */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] md:w-[calc(100%-80px)] h-0.5 bg-amber-400/60"></div>

            <div className="flex flex-row justify-center gap-1 md:gap-8 pt-0">
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-2 md:h-4 bg-amber-400/60"></div>
                {renderMember(organization.lienDoanPho, 'Liên Đoàn Phó', 'lien_doan_pho', 'lienDoanPhoId')}
              </div>
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-2 md:h-4 bg-amber-400/60"></div>
                {renderMember(organization.thuKy, 'Thư Ký', 'thu_ky', 'thuKyId')}
              </div>
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-2 md:h-4 bg-amber-400/60"></div>
                {renderMember(organization.thuQuy, 'Thủ Quỹ', 'thu_quy', 'thuQuyId')}
              </div>
            </div>
          </div>
        </div>

        {/* Connector line */}
        <div className="w-0.5 h-4 md:h-6 bg-stone-300/60"></div>

        {/* Ngành Thanh - Soft sage green */}
        <div className="bg-emerald-50/70 dark:bg-emerald-900/15 rounded-xl p-3 md:p-6 border border-emerald-200/50 dark:border-emerald-700/25 shadow-sm">
          <h3 className="text-lg md:text-2xl font-bold text-center mb-2 md:mb-4 text-emerald-700/90 dark:text-emerald-300/90">Ngành Thanh</h3>
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-2 md:h-4 bg-emerald-400/50"></div>
            <div className="relative w-full">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-60px)] md:w-[calc(100%-100px)] h-0.5 bg-emerald-400/50"></div>
              <div className="flex flex-row gap-2 md:gap-8 justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-2 md:h-4 bg-emerald-400/50"></div>
                  <p className="text-xs md:text-base font-semibold mb-1 md:mb-2 text-emerald-700/70 dark:text-emerald-300/70">Thanh Nam</p>
                  {renderBranchGroup('thanh_nam')}
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-2 md:h-4 bg-emerald-400/50"></div>
                  <p className="text-xs md:text-base font-semibold mb-1 md:mb-2 text-emerald-700/70 dark:text-emerald-300/70">Thanh Nữ</p>
                  {renderBranchGroup('thanh_nu')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connector line */}
        <div className="w-0.5 h-4 md:h-6 bg-stone-300/60"></div>

        {/* Ngành Thiếu - Soft teal/cyan */}
        <div className="bg-teal-50/70 dark:bg-teal-900/15 rounded-xl p-3 md:p-6 border border-teal-200/50 dark:border-teal-700/25 shadow-sm">
          <h3 className="text-lg md:text-2xl font-bold text-center mb-2 md:mb-4 text-teal-700/90 dark:text-teal-300/90">Ngành Thiếu</h3>
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-2 md:h-4 bg-teal-400/50"></div>
            <div className="relative w-full">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-60px)] md:w-[calc(100%-100px)] h-0.5 bg-teal-400/50"></div>
              <div className="flex flex-row gap-2 md:gap-8 justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-2 md:h-4 bg-teal-400/50"></div>
                  <p className="text-xs md:text-base font-semibold mb-1 md:mb-2 text-teal-700/70 dark:text-teal-300/70">Thiếu Nam</p>
                  {renderBranchGroup('thieu_nam')}
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-2 md:h-4 bg-teal-400/50"></div>
                  <p className="text-xs md:text-base font-semibold mb-1 md:mb-2 text-teal-700/70 dark:text-teal-300/70">Thiếu Nữ</p>
                  {renderBranchGroup('thieu_nu')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connector line */}
        <div className="w-0.5 h-4 md:h-6 bg-stone-300/60"></div>

        {/* Ngành Oanh - Soft warm rose/coral */}
        <div className="bg-rose-50/60 dark:bg-rose-900/15 rounded-xl p-3 md:p-6 border border-rose-200/50 dark:border-rose-700/25 shadow-sm">
          <h3 className="text-lg md:text-2xl font-bold text-center mb-2 md:mb-4 text-rose-700/90 dark:text-rose-300/90">Ngành Oanh</h3>
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-2 md:h-4 bg-rose-300/50"></div>
            <div className="relative w-full">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-60px)] md:w-[calc(100%-100px)] h-0.5 bg-rose-300/50"></div>
              <div className="flex flex-row gap-2 md:gap-8 justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-2 md:h-4 bg-rose-300/50"></div>
                  <p className="text-xs md:text-base font-semibold mb-1 md:mb-2 text-rose-700/70 dark:text-rose-300/70">Oanh Nam</p>
                  {renderBranchGroup('oanh_nam')}
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-2 md:h-4 bg-rose-300/50"></div>
                  <p className="text-xs md:text-base font-semibold mb-1 md:mb-2 text-rose-700/70 dark:text-rose-300/70">Oanh Nữ</p>
                  {renderBranchGroup('oanh_nu')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Member Detail Modal */}
      <MemberDetailModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        isAdmin={isAdmin}
        onEdit={(member) => {
          setSelectedMember(null);
          onEditMember?.(member);
        }}
      />

      {/* Assign Member Modal */}
      <AssignMemberModal
        position={assigningPosition}
        isOpen={!!assigningPosition}
        onClose={() => setAssigningPosition(null)}
        members={members}
        onAssign={(memberId) => {
          onAssignMember?.(assigningPosition.positionKey, memberId);
          setAssigningPosition(null);
        }}
      />
    </div>
  );
}
