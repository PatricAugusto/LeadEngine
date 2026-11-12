import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const LeadsContent = styled.div`
  display: grid;
  min-width: 0;
  gap: 20px;
  animation: ${fadeIn} 220ms ease-out;
`;

export const LeadSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 900px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

export const LeadSummaryCard = styled.div`
  display: grid;
  min-width: 0;
  gap: 12px;
  border: 1px solid #252d39;
  border-radius: 10px;
  background: #121720;
  padding: 15px 16px;
  .summary-label {
    color: #a4adba;
    font-size: 12px;
  }
  .summary-value {
    color: #edf0f4;
    font-size: 24px;
    font-weight: 680;
    letter-spacing: -0.5px;
  }
  .summary-icon {
    display: grid;
    width: 30px;
    height: 30px;
    place-items: center;
    border-radius: 8px;
    background: #27213a;
    color: #b7a3ff;
  }
  .summary-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
`;

export const LeadTools = styled.div`
  display: grid;
  gap: 14px;
  border: 1px solid #252d39;
  border-radius: 10px;
  background: #121720;
  padding: 16px;
`;

export const LeadToolsTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  @media (max-width: 600px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const LeadResultCount = styled.span`
  color: #85909e;
  font-size: 11px;
`;

export const LeadSearchWrap = styled.label`
  display: flex;
  width: min(100%, 380px);
  min-height: 38px;
  align-items: center;
  gap: 9px;
  border: 1px solid #2a3340;
  border-radius: 7px;
  background: #0f141b;
  padding: 0 11px;
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

export const LeadRefreshButton = styled.button`
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #2a3340;
  border-radius: 7px;
  background: #171d27;
  padding: 0 12px;
  color: #c4b5fd;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  &:hover:not(:disabled) { border-color: #65549b; background: #1b2030; }
  &:disabled { cursor: wait; opacity: 0.6; }
  .spinning { animation: ${spin} 1s linear infinite; }
`;

export const LeadFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

export const LeadFilterButton = styled.button`
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  gap: 7px;
  border: 1px solid ${({ $active }) => ($active ? '#514371' : '#2a3340')};
  border-radius: 7px;
  background: ${({ $active }) => ($active ? '#211b32' : '#171d27')};
  padding: 0 10px;
  color: ${({ $active }) => ($active ? '#c4b5fd' : '#a4adba')};
  font-size: 11px;
  font-weight: ${({ $active }) => ($active ? 650 : 500)};
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease;
  &:hover { border-color: #65549b; }
  .count {
    color: ${({ $active }) => ($active ? '#d7ccff' : '#7d8795')};
    font-size: 10px;
  }
`;

export const LeadStatusSelect = styled.select`
  min-height: 34px;
  max-width: 160px;
  border: 1px solid #2a3340;
  border-radius: 7px;
  background: #171d27;
  padding: 0 9px;
  color: #d1d6de;
  font-size: 11px;
  cursor: pointer;
  &:focus-visible { outline: 2px solid rgba(167, 139, 250, 0.72); outline-offset: 2px; }
  &:disabled { cursor: wait; opacity: 0.6; }
`;

export const LeadFeedback = styled.div`
  border: 1px solid #493036;
  border-radius: 8px;
  background: #21171c;
  padding: 12px 14px;
  color: #f0a8a2;
  font-size: 12px;
`;

export const LeadEmptyState = styled.div`
  display: grid;
  justify-items: center;
  gap: 9px;
  padding: 40px 20px;
  color: #a4adba;
  text-align: center;
  svg { color: #a78bfa; }
  strong { color: #e2e6ec; font-size: 14px; }
  span { font-size: 12px; line-height: 1.5; }
  button {
    min-height: 34px;
    margin-top: 5px;
    border: 1px solid #3d3455;
    border-radius: 7px;
    background: #211b32;
    padding: 0 11px;
    color: #c4b5fd;
    font-size: 11px;
    cursor: pointer;
  }
`;

