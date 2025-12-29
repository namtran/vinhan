import { useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
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
      // Empty position - allow admin to assign
      setAssigningPosition(node);
    }
  };

  const renderBranchLeaders = (branchType) => {
    const leaders = organization.branches?.[branchType] || {};
    const branchNames = {
      thanh_nam: 'Thanh Nam',
      thanh_nu: 'Thanh Nữ',
      thieu_nam: 'Thiếu Nam',
      thieu_nu: 'Thiếu Nữ',
      oanh_nam: 'Oanh Nam',
      oanh_nu: 'Oanh Nữ',
    };
    const positionKeys = {
      thanh_nam: { truong: 'doanTruongThanhNamId', pho: 'doanPhoThanhNamId' },
      thanh_nu: { truong: 'doanTruongThanhNuId', pho: 'doanPhoThanhNuId' },
      thieu_nam: { truong: 'doanTruongThieuNamId', pho: 'doanPhoThieuNamId' },
      thieu_nu: { truong: 'doanTruongThieuNuId', pho: 'doanPhoThieuNuId' },
      oanh_nam: { truong: 'doanTruongOanhNamId', pho: 'doanPhoOanhNamId' },
      oanh_nu: { truong: 'doanTruongOanhNuId', pho: 'doanPhoOanhNuId' },
    };

    return (
      <TreeNode
        label={
          <OrgNode
            node={{
              ...leaders.doanTruong,
              name: leaders.doanTruong?.name || 'Chưa có',
              role: `Đoàn Trưởng ${branchNames[branchType]}`,
              roleCode: 'doan_truong',
              phapDanh: leaders.doanTruong?.phapDanh,
              photoUrl: leaders.doanTruong?.photoUrl,
              memberId: leaders.doanTruong?.id,
              positionKey: positionKeys[branchType].truong,
            }}
            onClick={handleNodeClick}
            isSelected={selectedMember?.memberId === leaders.doanTruong?.id}
          />
        }
      >
        <TreeNode
          label={
            <OrgNode
              node={{
                ...leaders.doanPho,
                name: leaders.doanPho?.name || 'Chưa có',
                role: `Đoàn Phó ${branchNames[branchType]}`,
                roleCode: 'doan_pho',
                phapDanh: leaders.doanPho?.phapDanh,
                photoUrl: leaders.doanPho?.photoUrl,
                memberId: leaders.doanPho?.id,
                positionKey: positionKeys[branchType].pho,
              }}
              onClick={handleNodeClick}
              isSelected={selectedMember?.memberId === leaders.doanPho?.id}
            />
          }
        />
      </TreeNode>
    );
  };

  return (
    <div className="overflow-x-auto py-8">
      <div className="min-w-[1200px] flex justify-center">
        <Tree
          lineWidth="2px"
          lineColor="oklch(var(--bc) / 0.3)"
          lineBorderRadius="10px"
          label={
            <OrgNode
              node={{
                ...organization.giaTruong,
                name: organization.giaTruong?.name || 'Chưa có',
                role: 'Gia Trưởng',
                roleCode: 'gia_truong',
                phapDanh: organization.giaTruong?.phapDanh,
                photoUrl: organization.giaTruong?.photoUrl,
                memberId: organization.giaTruong?.id,
                positionKey: 'giaTruongId',
              }}
              onClick={handleNodeClick}
              isSelected={selectedMember?.memberId === organization.giaTruong?.id}
            />
          }
        >
          <TreeNode
            label={
              <OrgNode
                node={{
                  ...organization.lienDoanTruong,
                  name: organization.lienDoanTruong?.name || 'Chưa có',
                  role: 'Liên Đoàn Trưởng',
                  roleCode: 'lien_doan_truong',
                  phapDanh: organization.lienDoanTruong?.phapDanh,
                  photoUrl: organization.lienDoanTruong?.photoUrl,
                  memberId: organization.lienDoanTruong?.id,
                  positionKey: 'lienDoanTruongId',
                }}
                onClick={handleNodeClick}
                isSelected={selectedMember?.memberId === organization.lienDoanTruong?.id}
              />
            }
          >
            {/* Liên Đoàn Phó */}
            <TreeNode
              label={
                <OrgNode
                  node={{
                    ...organization.lienDoanPho,
                    name: organization.lienDoanPho?.name || 'Chưa có',
                    role: 'Liên Đoàn Phó',
                    roleCode: 'lien_doan_pho',
                    phapDanh: organization.lienDoanPho?.phapDanh,
                    photoUrl: organization.lienDoanPho?.photoUrl,
                    memberId: organization.lienDoanPho?.id,
                    positionKey: 'lienDoanPhoId',
                  }}
                  onClick={handleNodeClick}
                  isSelected={selectedMember?.memberId === organization.lienDoanPho?.id}
                />
              }
            />

            {/* Thư Ký */}
            <TreeNode
              label={
                <OrgNode
                  node={{
                    ...organization.thuKy,
                    name: organization.thuKy?.name || 'Chưa có',
                    role: 'Thư Ký',
                    roleCode: 'thu_ky',
                    phapDanh: organization.thuKy?.phapDanh,
                    photoUrl: organization.thuKy?.photoUrl,
                    memberId: organization.thuKy?.id,
                    positionKey: 'thuKyId',
                  }}
                  onClick={handleNodeClick}
                  isSelected={selectedMember?.memberId === organization.thuKy?.id}
                />
              }
            />

            {/* Thủ Quỹ */}
            <TreeNode
              label={
                <OrgNode
                  node={{
                    ...organization.thuQuy,
                    name: organization.thuQuy?.name || 'Chưa có',
                    role: 'Thủ Quỹ',
                    roleCode: 'thu_quy',
                    phapDanh: organization.thuQuy?.phapDanh,
                    photoUrl: organization.thuQuy?.photoUrl,
                    memberId: organization.thuQuy?.id,
                    positionKey: 'thuQuyId',
                  }}
                  onClick={handleNodeClick}
                  isSelected={selectedMember?.memberId === organization.thuQuy?.id}
                />
              }
            >
              {/* Branch Leaders */}
              {renderBranchLeaders('thanh_nam')}
              {renderBranchLeaders('thanh_nu')}
              {renderBranchLeaders('thieu_nam')}
              {renderBranchLeaders('thieu_nu')}
              {renderBranchLeaders('oanh_nam')}
              {renderBranchLeaders('oanh_nu')}
            </TreeNode>
          </TreeNode>
        </Tree>
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
