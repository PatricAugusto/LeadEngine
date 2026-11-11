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
  width: 244px;
  flex-direction: column;
  border-right: 1px solid #eceef4;
  background: #fff;
  padding: 27px 16px 18px;

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
  color: #24243a;
  font-size: 19px;
  font-weight: 780;
  letter-spacing: -0.8px;
  .brand-accent { color: #7864ec; }
  @media (max-width: 820px) { span:not(:first-child) { display: none; } }
`;

export const BrandMark = styled.div`
  display: grid;
  width: 33px;
  height: 33px;
  place-items: center;
  border-radius: 11px;
  background: #7564e9;
  color: white;
  box-shadow: 0 5px 12px rgba(117, 100, 233, 0.2);
`;

export const NavGroup = styled.nav`
  margin-top: 40px;
  @media (max-width: 820px) { width: 100%; }
`;

export const NavSectionLabel = styled.div`
  margin: 0 10px 12px;
  color: #a5a8b7;
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
  background: ${({ $active }) => ($active ? '#f0efff' : 'transparent')};
  padding: 0 11px;
  color: ${({ $active }) => ($active ? '#6656d8' : '#777b8e')};
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 700 : 550)};
  text-align: left;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled, $active }) => (disabled && !$active ? 0.7 : 1)};
  svg { flex: 0 0 auto; }
  .soon {
    margin-left: auto;
    font-size: 9px;
    color: #a1a4b2;
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
    border-top: 1px solid #eff0f5;
    margin-top: 16px;
    padding: 17px 4px 0;
    color: #9295a5;
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
  color: #777b8e;
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
  border: 2px solid #fff;
  border-radius: 50%;
  background: linear-gradient(145deg, #d6ccff, #8877ed);
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
  color: #393c50;
  font-size: 10px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
export const UserRole = styled.span`
  color: #a0a3b1;
  font-size: 9px;
`;

export const Layout = styled.div`
  min-height: 100vh;
  margin-left: 244px;
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
  border-bottom: 1px solid #eceef4;
  background: rgba(255, 255, 255, 0.94);
  padding: 0 38px;
  backdrop-filter: blur(12px);
  .breadcrumb {
    color: #a2a5b3;
    font-size: 11px;
  }
  .breadcrumb span { margin: 0 9px; color: #c5c6cf; }
  .breadcrumb strong { color: #53566b; font-weight: 650; }
  .top-user {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #5f6275;
    font-size: 10px;
    white-space: nowrap;
  }
  .top-user > svg { color: #9a9cac; }
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
  color: #777b8e;
  cursor: not-allowed;
  i {
    position: absolute;
    top: 6px;
    right: 5px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #f18b76;
    box-shadow: 0 0 0 2px white;
  }
`;

export const Main = styled.main`
  max-width: 1480px;
  margin: 0 auto;
  padding: 34px 38px 28px;
  @media (max-width: 620px) { padding: 25px 18px; }
`;

export const DemoNotice = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  border: 1px solid #e8e4ff;
  border-radius: 8px;
  background: #f8f7ff;
  margin-bottom: 20px;
  padding: 10px 12px;
  color: #756aa9;
  font-size: 10px;
  line-height: 1.5;
  svg { flex: 0 0 auto; margin-top: 1px; color: #8a79e8; }
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
  color: #989bab;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 1.15px;
`;

export const HeaderTitle = styled.h1`
  margin: 0 0 5px;
  color: #24263b;
  font-size: 27px;
  font-weight: 730;
  letter-spacing: -0.9px;
  span { font-size: 20px; }
`;

export const SectionSubtitle = styled.p`
  margin: 0;
  color: #999cac;
  font-size: 11px;
  line-height: 1.6;
`;

export const RefreshButton = styled.button`
  display: inline-flex;
  min-height: 37px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #e8e7f2;
  border-radius: 8px;
  background: #fff;
  padding: 0 13px;
  color: #6051c8;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease;
  &:hover:not(:disabled) { border-color: #c9c4f4; background: #faf9ff; }
  &:disabled { cursor: wait; opacity: 0.75; }
  .spinning { animation: ${spin} 1s linear infinite; }
`;

export const Content = styled.div`
  display: grid;
  min-width: 0;
  gap: 25px;
  animation: ${fadeIn} 220ms ease-out;
  .insights-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(310px, 0.9fr);
    gap: 16px;
  }
  .footer-note {
    margin-top: -6px;
    color: #b0b2be;
    font-size: 9px;
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
  .updated { color: #a4a6b3; font-size: 9px; }
`;
export const SectionTitle = styled.h2`
  margin: 0 0 3px;
  color: #36394e;
  font-size: 13px;
  font-weight: 720;
`;

export const MetricCard = styled.div`
  min-width: 0;
  min-height: 118px;
  border: 1px solid #eceef4;
  border-radius: 11px;
  background: #fff;
  padding: 16px 17px 13px;
  box-shadow: 0 2px 6px rgba(37, 39, 67, 0.018);
`;
export const MetricLabel = styled.span`
  color: #8d90a2;
  font-size: 10px;
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
    purple: '#f0edff',
    blue: '#eaf3ff',
    green: '#e8f7f1',
    orange: '#fff2e9',
  }[$tone] || '#f0edff')};
  color: ${({ $tone }) => ({
    purple: '#7563e6',
    blue: '#5795df',
    green: '#4caf88',
    orange: '#e69a5d',
  }[$tone] || '#7563e6')};
`;
export const MetricValue = styled.div`
  margin-top: 7px;
  color: #2b2d42;
  font-size: 24px;
  font-weight: 730;
  letter-spacing: -0.6px;
`;
export const MetricDetail = styled.div`
  overflow: hidden;
  margin-top: 4px;
  color: #a0a2b0;
  font-size: 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Panel = styled.section`
  min-width: 0;
  overflow: hidden;
  border: 1px solid #eceef4;
  border-radius: 11px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(37, 39, 67, 0.018);
  .pipeline {
    display: grid;
    gap: 19px;
    padding: 8px 20px 20px;
  }
  .pipeline-note {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    border-top: 1px solid #f0f1f5;
    background: #fcfbff;
    padding: 12px 19px;
    color: #898ba0;
    font-size: 9px;
    line-height: 1.5;
  }
  .pipeline-note svg { flex: 0 0 auto; color: #8b78ed; }
  .pipeline-note strong { color: #6558bc; font-weight: 700; }
  .period-select {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border: 1px solid #eceef4;
    border-radius: 6px;
    background: #fff;
    padding: 7px 9px;
    color: #777b8e;
    font-size: 9px;
    cursor: not-allowed;
  }
  @media (max-width: 520px) { .pipeline { padding-inline: 14px; } }
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 17px 19px 16px;
  .period-select { flex: 0 0 auto; }
  @media (max-width: 520px) {
    align-items: flex-start;
    flex-direction: column;
    padding-inline: 14px;
  }
`;
export const PanelTitle = styled.h3`
  margin: 0 0 4px;
  color: #37394e;
  font-size: 12px;
  font-weight: 720;
`;

export const ActivityCard = styled(Panel)`
  min-height: 244px;
  padding: 17px 19px 13px;
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
  color: #8d90a2;
  font-size: 9px;
  white-space: nowrap;
  .live-dot { width: 6px; height: 6px; border-radius: 50%; background: #6bc69c; }
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
    border-top: 1px dashed #eceef3;
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
  background: linear-gradient(180deg, #a397ff 0%, #7767e7 100%);
  box-shadow: 0 3px 7px rgba(120, 103, 231, 0.14);
  transition: height 200ms ease;
`;
export const ChartLabel = styled.span`
  color: #a3a5b1;
  font-size: 9px;
`;
export const ActivityLegend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 7px;
  color: #9a9cac;
  font-size: 9px;
`;
export const LegendDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 2px;
  background: #8575ed;
`;

export const PipelineRow = styled.div`
  display: grid;
  grid-template-columns: minmax(78px, 1fr) minmax(80px, 2fr) 32px;
  align-items: center;
  gap: 11px;
`;
export const PipelineStage = styled.span`
  overflow: hidden;
  color: #777b8e;
  font-size: 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
export const PipelineTrack = styled.div`
  overflow: hidden;
  height: 6px;
  border-radius: 99px;
  background: #f0f1f6;
  span { display: block; height: 100%; border-radius: inherit; }
`;
export const PipelineValue = styled.span`
  color: #55586d;
  font-size: 9px;
  font-weight: 680;
  text-align: right;
`;

export const SearchWrap = styled.label`
  display: flex;
  min-width: 174px;
  height: 32px;
  align-items: center;
  gap: 7px;
  border: 1px solid #eceef4;
  border-radius: 7px;
  padding: 0 9px;
  color: #a4a6b3;
  input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: #44475c;
    font-size: 9px;
  }
  input::placeholder { color: #b2b4c0; }
  @media (max-width: 520px) { width: 100%; }
`;
export const TableWrap = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
`;
export const DataTable = styled.table`
  min-width: 560px;
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
  th, td { padding: 10px 13px; text-align: left; }
  th:first-child, td:first-child { padding-left: 19px; }
  th:last-child, td:last-child { padding-right: 19px; }
  tbody tr { border-top: 1px solid #f1f2f6; }
  tbody tr:hover { background: #fcfcff; }
  .location {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #85889a;
    font-size: 9px;
  }
  .location svg { color: #a6a8b5; }
  .score { display: flex; width: 73px; align-items: center; gap: 7px; color: #5a5d72; font-size: 9px; font-weight: 650; }
  @media (max-width: 520px) {
    th, td { padding-inline: 10px; }
    th:first-child, td:first-child { padding-left: 14px; }
    th:last-child, td:last-child { padding-right: 14px; }
  }
`;
export const TableHead = styled.th`
  background: #fbfbfd;
  color: #a0a2b0;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
`;
export const DataCell = styled.td`
  color: #74778a;
  font-size: 9px;
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
  background: ${({ $color }) => `${$color}18`};
  color: ${({ $color }) => $color};
  font-size: 9px;
  font-weight: 800;
`;
export const LeadInfo = styled.div`
  display: grid;
  gap: 3px;
`;
export const LeadName = styled.span`
  color: #43465b;
  font-size: 9px;
  font-weight: 680;
`;
export const LeadSubtext = styled.span`
  color: #a4a6b2;
  font-size: 8px;
`;
export const Tag = styled.span`
  display: inline-flex;
  border-radius: 5px;
  background: #f5f5f9;
  padding: 5px 7px;
  color: #777a8e;
  font-size: 8px;
`;
export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 5px;
  background: ${({ $status }) => ($status === 'qualified' ? '#eaf7f0' : $status === 'contacted' ? '#eef3ff' : '#fff4e8')};
  padding: 5px 7px;
  color: ${({ $status }) => ($status === 'qualified' ? '#45a77a' : $status === 'contacted' ? '#6d89ce' : '#d49b4d')};
  font-size: 8px;
  font-weight: 650;
`;
export const EmptyState = styled.div`
  padding: 24px;
  color: #999cac;
  font-size: 10px;
  text-align: center;
`;

export const TableFooter = styled.div`
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid #f1f2f6;
  padding: 9px 19px;
  color: #999cac;
  font-size: 9px;
  > div { display: flex; align-items: center; gap: 9px; }
  button {
    min-height: 27px;
    border: 1px solid #eceef4;
    border-radius: 6px;
    background: #fff;
    padding: 0 8px;
    color: #686b80;
    font-size: 9px;
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
  color: #85889a;
  font-size: 11px;
  .spinning { animation: ${spin} 1s linear infinite; color: #7564e9; }
`;
export const ErrorBox = styled.div`
  border: 1px solid #f2d5d2;
  border-radius: 9px;
  background: #fff8f7;
  padding: 13px 15px;
  color: #a3544b;
  font-size: 11px;
`;
