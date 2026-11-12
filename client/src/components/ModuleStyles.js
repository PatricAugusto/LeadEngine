import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const ModulePage = styled.div`
  display: grid;
  min-width: 0;
  gap: 18px;
  animation: ${fadeIn} 220ms ease-out;
`;

export const ModuleToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 11px;
  border: 1px solid #252d39;
  border-radius: 10px;
  background: #121720;
  padding: 14px;
`;

export const ModuleControls = styled.div`
  display: flex;
  flex: 1 1 420px;
  flex-wrap: wrap;
  align-items: center;
  gap: 9px;
`;

export const ModuleSearch = styled.label`
  display: flex;
  width: min(100%, 390px);
  min-width: 220px;
  min-height: 38px;
  align-items: center;
  gap: 8px;
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
`;

export const ModuleSelect = styled.select`
  min-height: 37px;
  border: 1px solid #2a3340;
  border-radius: 7px;
  background: #171d27;
  padding: 0 10px;
  color: #c5cbd4;
  font-size: 12px;
  &:focus-visible { outline: 2px solid rgba(167, 139, 250, 0.72); outline-offset: 2px; }
  &:disabled { cursor: not-allowed; opacity: 0.6; }
`;

export const ModuleButton = styled.button`
  display: inline-flex;
  min-height: 37px;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid ${({ $primary, $danger }) => ($primary ? '#6d59ac' : $danger ? '#5d343b' : '#2a3340')};
  border-radius: 7px;
  background: ${({ $primary, $danger }) => ($primary ? '#2b2144' : $danger ? '#2a1c21' : '#171d27')};
  padding: 0 11px;
  color: ${({ $primary, $danger }) => ($primary ? '#d2c5ff' : $danger ? '#e5a5a9' : '#b4bdc8')};
  font-size: 11px;
  font-weight: 650;
  cursor: pointer;
  &:hover:not(:disabled) { border-color: #7862c8; background: #211b32; }
  &:disabled { cursor: not-allowed; opacity: 0.55; }
  .spinning { animation: ${spin} 1s linear infinite; }
`;

export const ModuleFeedback = styled.div`
  border: 1px solid ${({ $success }) => ($success ? '#285345' : '#493036')};
  border-radius: 8px;
  background: ${({ $success }) => ($success ? '#152720' : '#21171c')};
  padding: 11px 13px;
  color: ${({ $success }) => ($success ? '#93d2b5' : '#f0a8a2')};
  font-size: 12px;
  line-height: 1.5;
`;

export const ModuleEmpty = styled.div`
  display: grid;
  justify-items: center;
  gap: 9px;
  padding: 34px 18px;
  color: #98a2af;
  text-align: center;
  svg { color: #a78bfa; }
  strong { color: #e2e6ec; font-size: 13px; }
  span { max-width: 520px; font-size: 11px; line-height: 1.6; }
`;

export const ModuleMetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 900px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

export const ModuleMetric = styled.div`
  display: grid;
  min-width: 0;
  gap: 10px;
  border: 1px solid #252d39;
  border-radius: 10px;
  background: #121720;
  padding: 15px 16px;
  .label { color: #a4adba; font-size: 11px; }
  .value { color: #edf0f4; font-size: 24px; font-weight: 680; }
`;

export const ModuleColumns = styled.div`
  display: grid;
  min-width: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

export const DistributionList = styled.div`
  display: grid;
  gap: 15px;
  padding: 0 19px 19px;
`;

export const DistributionRow = styled.div`
  display: grid;
  grid-template-columns: minmax(92px, 1fr) minmax(80px, 2fr) 42px;
  align-items: center;
  gap: 10px;
  .name {
    overflow: hidden;
    color: #aeb7c2;
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .value { color: #c5cbd4; font-size: 11px; text-align: right; }
  .track {
    overflow: hidden;
    height: 6px;
    border-radius: 99px;
    background: #252d39;
  }
  .track > span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #705bd0, #b7a3ff);
  }
`;

export const FormGrid = styled.form`
  display: grid;
  gap: 13px;
  border: 1px solid #252d39;
  border-radius: 10px;
  background: #121720;
  padding: 16px;
`;

export const FormLabel = styled.label`
  display: grid;
  gap: 6px;
  color: #aeb7c2;
  font-size: 11px;
  font-weight: 600;
`;

export const FormInput = styled.input`
  width: 100%;
  min-height: 38px;
  border: 1px solid #2a3340;
  border-radius: 7px;
  background: #0f141b;
  padding: 0 10px;
  color: #e2e6ec;
  font-size: 12px;
  &:focus-visible { outline: 2px solid rgba(167, 139, 250, 0.72); outline-offset: 2px; }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  min-height: 84px;
  resize: vertical;
  border: 1px solid #2a3340;
  border-radius: 7px;
  background: #0f141b;
  padding: 10px;
  color: #e2e6ec;
  font: inherit;
  font-size: 12px;
  &:focus-visible { outline: 2px solid rgba(167, 139, 250, 0.72); outline-offset: 2px; }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
`;

export const SelectableCard = styled.button`
  display: grid;
  min-width: 0;
  gap: 8px;
  border: 1px solid ${({ $active }) => ($active ? '#6756a3' : '#252d39')};
  border-radius: 10px;
  background: ${({ $active }) => ($active ? '#1b192a' : '#121720')};
  padding: 15px;
  color: #c5cbd4;
  text-align: left;
  cursor: pointer;
  &:hover { border-color: #7862c8; }
  strong { overflow: hidden; color: #e5e9ef; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
  span { color: #8994a2; font-size: 11px; line-height: 1.5; }
`;

export const StatePicker = styled.div`
  display: grid;
  gap: 11px;
  border: 1px solid #252d39;
  border-radius: 8px;
  background: #0f141b;
  padding: 13px;
  .select-all { padding-bottom: 9px; border-bottom: 1px solid #252d39; }
  .states { display: grid; grid-template-columns: repeat(auto-fill, minmax(64px, 1fr)); gap: 7px; }
  label { display: flex; align-items: center; gap: 6px; color: #aeb7c2; font-size: 11px; cursor: pointer; }
  input { accent-color: #9c83f5; }
`;

export const HelpGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
`;

export const HelpCard = styled.article`
  display: grid;
  align-content: start;
  gap: 9px;
  border: 1px solid #252d39;
  border-radius: 10px;
  background: #121720;
  padding: 16px;
  svg { color: #b7a3ff; }
  h2 { margin: 0; color: #e2e6ec; font-size: 13px; }
  p { margin: 0; color: #98a2af; font-size: 11px; line-height: 1.6; }
  button {
    justify-self: start;
    min-height: 31px;
    margin-top: 3px;
    border: 1px solid #3d3455;
    border-radius: 6px;
    background: #211b32;
    padding: 0 9px;
    color: #c4b5fd;
    font-size: 10px;
    cursor: pointer;
  }
`;

export const NotificationAnchor = styled.div`
  position: relative;
`;

export const NotificationPanel = styled.div`
  position: absolute;
  top: 43px;
  right: 0;
  z-index: 5;
  width: min(340px, calc(100vw - 32px));
  max-height: 430px;
  overflow: auto;
  border: 1px solid #2b3340;
  border-radius: 10px;
  background: #121720;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.36);
  padding: 13px;
  .title { margin: 0 0 10px; color: #e2e6ec; font-size: 12px; }
  .header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .header button {
    border: 0;
    background: transparent;
    color: #8994a2;
    font-size: 10px;
    cursor: pointer;
  }
  .item { display: grid; gap: 4px; border-top: 1px solid #252d39; padding: 10px 0; }
  .item strong { color: #c5cbd4; font-size: 11px; }
  .item span, .empty { color: #8994a2; font-size: 10px; line-height: 1.5; }
  .failed { color: #e5a5a9 !important; }
`;
