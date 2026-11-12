import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const AppShell = styled.div`
  min-height: 100vh;
`;

export const Sidebar = styled.aside`
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 3;
  display: flex;
  width: 224px;
  flex-direction: column;
  border-right: 1px solid #202630;
  background: #0e1218;
  padding: 24px 14px 16px;

  @media (max-width: 820px) {
    width: 72px;
    padding-inline: 10px;
    align-items: center;
  }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px;
  color: #e8ebf0;
  font-size: 19px;
  font-weight: 780;
  letter-spacing: -0.8px;
  .brand-accent { color: #a78bfa; }
  @media (max-width: 820px) { span:not(:first-child) { display: none; } }
`;

export const BrandMark = styled.div`
  display: grid;
  width: 33px;
  height: 33px;
  place-items: center;
  border-radius: 11px;
  background: #8b6cf0;
  color: white;
  box-shadow: 0 5px 16px rgba(139, 108, 240, 0.2);
`;

export const NavGroup = styled.nav`
  margin-top: 40px;
  @media (max-width: 820px) { width: 100%; }
`;

export const NavSectionLabel = styled.div`
  margin: 0 10px 12px;
  color: #788391;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 1.1px;
  @media (max-width: 820px) { display: none; }
`;

export const NavList = styled.div`
  display: grid;
  gap: 4px;
`;

export const NavItem = styled.button`
  display: flex;
  width: 100%;
  min-height: 42px;
  align-items: center;
  gap: 12px;
  border: 0;
  border-radius: 9px;
  background: ${({ $active }) => ($active ? '#211b32' : 'transparent')};
  padding: 0 11px;
  color: ${({ $active }) => ($active ? '#c4b5fd' : '#a0a9b5')};
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 700 : 550)};
  text-align: left;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled, $active }) => (disabled && !$active ? 0.7 : 1)};
  svg { flex: 0 0 auto; }
  .soon {
    margin-left: auto;
    font-size: 9px;
    color: #778291;
  }
  @media (max-width: 820px) {
    justify-content: center;
    padding: 0;
    span { display: none; }
  }
`;

export const SidebarBottom = styled.div`
  margin-top: auto;
  .user-card {
    display: flex;
    align-items: center;
    gap: 10px;
    border-top: 1px solid #202630;
    margin-top: 16px;
    padding: 17px 4px 0;
    color: #858f9c;
  }
  @media (max-width: 820px) {
    width: 100%;
    .user-card { justify-content: center; padding-inline: 0; }
    .user-card > svg, .user-card > div:nth-child(2) { display: none; }
  }
`;

export const SidebarLink = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 11px;
  border: 0;
  background: transparent;
  padding: 8px 10px;
  color: #9ba5b2;
  font-size: 12px;
  text-align: left;
  cursor: not-allowed;
  @media (max-width: 820px) { justify-content: center; font-size: 0; padding-inline: 0; }
`;

export const Avatar = styled.div`
  display: grid;
  width: 31px;
  height: 31px;
  flex: 0 0 auto;
  place-items: center;
  border: 2px solid #11161e;
  border-radius: 50%;
  background: linear-gradient(145deg, #b8a5ff, #7055d8);
  color: #fff;
  font-size: 10px;
  font-weight: 800;
`;

export const UserInfo = styled.div`
  display: grid;
  min-width: 0;
  gap: 3px;
`;
export const UserName = styled.span`
  overflow: hidden;
  color: #dce1e8;
  font-size: 10px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
export const UserRole = styled.span`
  color: #8792a0;
  font-size: 9px;
`;

export const Layout = styled.div`
  min-height: 100vh;
  margin-left: 224px;
  @media (max-width: 820px) { margin-left: 72px; }
`;

export const Topbar = styled.div`
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  height: 64px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #202630;
  background: rgba(14, 18, 24, 0.92);
  padding: 0 38px;
  backdrop-filter: blur(12px);
  .breadcrumb {
    color: #7d8795;
    font-size: 11px;
  }
  .breadcrumb span { margin: 0 9px; color: #596372; }
  .breadcrumb strong { color: #d1d6de; font-weight: 600; }
  .top-user {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #a4adba;
    font-size: 10px;
    white-space: nowrap;
  }
  .top-user > svg { color: #7d8795; }
  @media (max-width: 620px) {
    padding: 0 18px;
    .top-user > span, .top-user > svg { display: none; }
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const IconButton = styled.button`
  position: relative;
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 0;
  background: transparent;
  color: #9ba5b2;
  cursor: not-allowed;
  i {
    position: absolute;
    top: 6px;
    right: 5px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #f18b76;
    box-shadow: 0 0 0 2px #0e1218;
  }
`;

export const Main = styled.main`
  max-width: 1440px;
  margin: 0 auto;
  padding: 30px 34px 28px;
  @media (max-width: 620px) { padding: 25px 18px; }
`;

export const DemoNotice = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  border: 1px solid #2c2940;
  border-radius: 8px;
  background: #171522;
  margin-bottom: 22px;
  padding: 11px 13px;
  color: #b6accf;
  font-size: 12px;
  line-height: 1.5;
  svg { flex: 0 0 auto; margin-top: 1px; color: #b49bff; }
`;

export const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 21px;
  @media (max-width: 540px) { align-items: flex-start; flex-direction: column; }
`;

export const HeaderEyebrow = styled.div`
  margin-bottom: 8px;
  color: #8d98a6;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 1.15px;
`;

export const HeaderTitle = styled.h1`
  margin: 0 0 5px;
  color: #edf0f4;
  font-size: 29px;
  font-weight: 680;
  letter-spacing: -0.8px;
`;

export const SectionSubtitle = styled.p`
  margin: 0;
  color: #929daa;
  font-size: 12px;
  line-height: 1.6;
`;

export const RefreshButton = styled.button`
  display: inline-flex;
  min-height: 37px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #2a3340;
  border-radius: 8px;
  background: #151b24;
  padding: 0 13px;
  color: #c4b5fd;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease;
  &:hover:not(:disabled) { border-color: #65549b; background: #1b2030; }
  &:disabled { cursor: wait; opacity: 0.75; }
  .spinning { animation: ${spin} 1s linear infinite; }
`;

export const Content = styled.div`
  display: grid;
  min-width: 0;
  gap: 22px;
  animation: ${fadeIn} 220ms ease-out;
  .insights-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(310px, 0.9fr);
    gap: 16px;
  }
  .footer-note {
    margin-top: -6px;
    color: #76818f;
    font-size: 11px;
    text-align: center;
  }
  @media (max-width: 1080px) { .insights-grid { grid-template-columns: 1fr; } }
`;

export const Section = styled.section`
  min-width: 0;
`;
export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  .updated { color: #85909e; font-size: 11px; }
`;
export const SectionTitle = styled.h2`
  margin: 0 0 3px;
  color: #e2e6ec;
  font-size: 15px;
  font-weight: 650;
`;

export const MetricCard = styled.div`
  min-width: 0;
  min-height: 126px;
  border: 1px solid #252d39;
  border-radius: 10px;
  background: #121720;
  padding: 17px 18px 14px;
`;
export const MetricLabel = styled.span`
  color: #a4adba;
  font-size: 12px;
  font-weight: 570;
`;
export const MetricTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const MetricGrid = styled.div`
  display: grid;
  min-width: 0;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 13px;
  @media (max-width: 1150px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 430px) { grid-template-columns: 1fr; }
`;
export const MetricIcon = styled.div`
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 9px;
  background: ${({ $tone }) => ({
    purple: '#27213a',
    blue: '#1b2939',
    green: '#1b302c',
    orange: '#35291f',
  }[$tone] || '#27213a')};
  color: ${({ $tone }) => ({
    purple: '#b7a3ff',
    blue: '#82b9f4',
    green: '#7bd2ad',
    orange: '#f0b77e',
  }[$tone] || '#b7a3ff')};
`;
export const MetricValue = styled.div`
  margin-top: 7px;
  color: #edf0f4;
  font-size: 27px;
  font-weight: 680;
  letter-spacing: -0.6px;
`;
export const MetricDetail = styled.div`
  overflow: hidden;
  margin-top: 4px;
  color: #818c9a;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Panel = styled.section`
  min-width: 0;
  overflow: hidden;
  border: 1px solid #252d39;
  border-radius: 10px;
  background: #121720;
  .pipeline {
    display: grid;
    gap: 19px;
    padding: 8px 20px 20px;
  }
  .pipeline-note {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    border-top: 1px solid #252d39;
    background: #151a24;
    padding: 12px 19px;
    color: #98a2af;
    font-size: 11px;
    line-height: 1.5;
  }
  .pipeline-note svg { flex: 0 0 auto; color: #b49bff; }
  .pipeline-note strong { color: #c4b5fd; font-weight: 650; }
  .period-select {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border: 1px solid #2a3340;
    border-radius: 6px;
    background: #171d27;
    padding: 7px 9px;
    color: #a4adba;
    font-size: 11px;
    cursor: not-allowed;
  }
  @media (max-width: 520px) { .pipeline { padding-inline: 14px; } }
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px 17px;
  .period-select { flex: 0 0 auto; }
  @media (max-width: 520px) {
    align-items: flex-start;
    flex-direction: column;
    padding-inline: 14px;
  }
`;
export const PanelTitle = styled.h3`
  margin: 0 0 4px;
  color: #e2e6ec;
  font-size: 14px;
  font-weight: 650;
`;

export const ActivityCard = styled(Panel)`
  min-height: 260px;
  padding: 19px 20px 15px;
`;
export const ActivityHeading = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;
export const ActivityTitle = styled(PanelTitle)``;
export const ActivityMeta = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #9aa4b1;
  font-size: 11px;
  white-space: nowrap;
  .live-dot { width: 7px; height: 7px; border-radius: 50%; background: #6ed6a8; }
`;
export const ChartSection = styled.div`
  position: relative;
  height: 126px;
  margin-top: 18px;
`;
export const ChartGrid = styled.div`
  position: absolute;
  inset: 0 0 19px;
  span {
    position: absolute;
    right: 0;
    left: 0;
    border-top: 1px dashed #2a3340;
  }
`;
export const ChartBars = styled.div`
  position: absolute;
  inset: 0 0 0;
  display: flex;
  justify-content: space-around;
`;
export const ChartColumn = styled.div`
  z-index: 1;
  display: flex;
  width: 10%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 7px;
`;
export const ActivityBars = styled.div`
  display: flex;
  width: 100%;
  height: 104px;
  align-items: flex-end;
  justify-content: center;
`;
export const ChartBar = styled.div`
  width: 17px;
  min-height: 8px;
  border-radius: 5px 5px 2px 2px;
  background: linear-gradient(180deg, #c4b5fd 0%, #8b6cf0 100%);
  box-shadow: 0 3px 9px rgba(139, 108, 240, 0.2);
  transition: height 200ms ease;
`;
export const ChartLabel = styled.span`
  color: #8e99a7;
  font-size: 11px;
`;
export const ActivityLegend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 7px;
  color: #99a3b0;
  font-size: 11px;
`;
export const LegendDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 2px;
  background: #a78bfa;
`;

export const PipelineRow = styled.div`
  display: grid;
  grid-template-columns: minmax(78px, 1fr) minmax(80px, 2fr) 32px;
  align-items: center;
  gap: 11px;
`;
export const PipelineStage = styled.span`
  overflow: hidden;
  color: #a4adba;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
export const PipelineTrack = styled.div`
  overflow: hidden;
  height: 6px;
  border-radius: 99px;
  background: #252d39;
  span { display: block; height: 100%; border-radius: inherit; }
`;
export const PipelineValue = styled.span`
  color: #c5cbd4;
  font-size: 11px;
  font-weight: 680;
  text-align: right;
`;

export const SearchWrap = styled.label`
  display: flex;
  min-width: 220px;
  height: 36px;
  align-items: center;
  gap: 7px;
  border: 1px solid #2a3340;
  border-radius: 7px;
  background: #0f141b;
  padding: 0 10px;
  color: #8792a0;
  &:focus-within { border-color: #7862c8; }
  input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: #e2e6ec;
    font-size: 12px;
  }
  input::placeholder { color: #75808e; }
  @media (max-width: 520px) { width: 100%; }
`;
export const TableWrap = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
`;
export const DataTable = styled.table`
  min-width: 760px;
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
  th, td { padding: 12px 14px; text-align: left; }
  th:first-child, td:first-child { padding-left: 19px; }
  th:last-child, td:last-child { padding-right: 19px; }
  tbody tr { border-top: 1px solid #202833; }
  tbody tr:hover { background: #171d27; }
  .location {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #a4adba;
    font-size: 11px;
  }
  .location svg { color: #7d8795; }
  .score { display: flex; width: 73px; align-items: center; gap: 7px; color: #c5cbd4; font-size: 11px; font-weight: 600; }
  @media (max-width: 520px) {
    th, td { padding-inline: 10px; }
    th:first-child, td:first-child { padding-left: 14px; }
    th:last-child, td:last-child { padding-right: 14px; }
  }
`;
export const TableHead = styled.th`
  background: #151a23;
  color: #8994a2;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.45px;
  text-transform: uppercase;
`;
export const DataCell = styled.td`
  color: #aeb7c2;
  font-size: 11px;
`;
export const LeadCompany = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
`;
export const LeadInitial = styled.div`
  display: grid;
  width: 29px;
  height: 29px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 8px;
  background: ${({ $color }) => `${$color}24`};
  color: ${({ $color }) => $color};
  font-size: 10px;
  font-weight: 700;
`;
export const LeadInfo = styled.div`
  display: grid;
  gap: 3px;
`;
export const LeadName = styled.span`
  color: #e2e6ec;
  font-size: 11px;
  font-weight: 600;
`;
export const LeadSubtext = styled.span`
  color: #8792a0;
  font-size: 10px;
`;
export const Tag = styled.span`
  display: inline-flex;
  border-radius: 5px;
  background: #1b2330;
  padding: 5px 8px;
  color: #aeb7c2;
  font-size: 10px;
`;
const badgeTones = {
  new: { background: '#34291d', color: '#e8b66f' },
  qualified: { background: '#173329', color: '#7bd2ad' },
  contacted: { background: '#1b2b40', color: '#8bb8ef' },
  meeting: { background: '#27213a', color: '#b7a3ff' },
  customer: { background: '#173329', color: '#7bd2ad' },
  disqualified: { background: '#302329', color: '#e1a0aa' },
};
export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 5px;
  background: ${({ $status }) => badgeTones[$status]?.background || '#1b2330'};
  padding: 5px 8px;
  color: ${({ $status }) => badgeTones[$status]?.color || '#aeb7c2'};
  font-size: 10px;
  font-weight: 650;
`;
export const EmptyState = styled.div`
  padding: 24px;
  color: #9aa4b1;
  font-size: 12px;
  text-align: center;
`;

export const TableFooter = styled.div`
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid #202833;
  padding: 9px 19px;
  color: #929daa;
  font-size: 11px;
  > div { display: flex; align-items: center; gap: 9px; }
  button {
    min-height: 27px;
    border: 1px solid #2a3340;
    border-radius: 6px;
    background: #171d27;
    padding: 0 8px;
    color: #b1bac5;
    font-size: 11px;
    cursor: pointer;
  }
  button:disabled { cursor: not-allowed; opacity: 0.5; }
  @media (max-width: 520px) {
    align-items: flex-start;
    flex-direction: column;
    padding-inline: 14px;
  }
`;

export const LoadingState = styled.div`
  display: flex;
  min-height: 240px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #a4adba;
  font-size: 13px;
  .spinning { animation: ${spin} 1s linear infinite; color: #a78bfa; }
`;
export const ErrorBox = styled.div`
  border: 1px solid #493036;
  border-radius: 9px;
  background: #21171c;
  padding: 13px 15px;
  color: #f0a8a2;
  font-size: 12px;
`;
