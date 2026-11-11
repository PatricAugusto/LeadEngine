import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const SearchSection = styled.section`
  min-width: 0;
`;

export const SearchCard = styled.div`
  border: 1px solid #eceef4;
  border-radius: 11px;
  background: #fff;
  padding: 19px;
  box-shadow: 0 2px 6px rgba(37, 39, 67, 0.018);
  @media (max-width: 620px) { padding: 15px; }
`;

export const SearchCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  .search-icon {
    display: grid;
    width: 35px;
    height: 35px;
    flex: 0 0 auto;
    place-items: center;
    border-radius: 10px;
    background: #f0edff;
    color: #7563e6;
  }
  h2 {
    margin: 0 0 4px;
    color: #37394e;
    font-size: 13px;
    font-weight: 720;
  }
  p {
    margin: 0;
    color: #999cac;
    font-size: 10px;
    line-height: 1.5;
  }
`;

export const SearchNotice = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  border: 1px solid #f4e3bf;
  border-radius: 7px;
  background: #fffbf2;
  margin: 16px 0;
  padding: 10px 11px;
  color: #967543;
  font-size: 9px;
  line-height: 1.55;
  svg { flex: 0 0 auto; margin-top: 1px; color: #d3a657; }
`;

export const SearchField = styled.div`
  .field-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
  }
  .field-heading > div { display: flex; align-items: baseline; gap: 8px; }
  .field-heading strong { color: #55586d; font-size: 10px; }
  .field-heading span { color: #a0a2b0; font-size: 9px; }
  @media (max-width: 520px) {
    .field-heading { align-items: flex-start; flex-direction: column; }
  }
`;

export const StateGrid = styled.div`
  border: 1px solid #eff0f5;
  border-radius: 8px;
  padding: 10px;
  .select-all {
    display: flex;
    width: max-content;
    margin-bottom: 9px;
    color: #6254c9;
    font-weight: 700;
  }
  .states {
    display: grid;
    grid-template-columns: repeat(9, minmax(0, 1fr));
    gap: 7px;
    border-top: 1px solid #f0f1f5;
    padding-top: 9px;
  }
  @media (max-width: 900px) { .states { grid-template-columns: repeat(7, minmax(0, 1fr)); } }
  @media (max-width: 620px) { .states { grid-template-columns: repeat(5, minmax(0, 1fr)); } }
  @media (max-width: 390px) { .states { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
`;

export const SearchCheckbox = styled.label`
  display: inline-flex;
  min-height: 25px;
  align-items: center;
  gap: 6px;
  color: #777b8e;
  font-size: 9px;
  cursor: pointer;
  input {
    width: 13px;
    height: 13px;
    margin: 0;
    accent-color: #7564e9;
  }
  input:disabled { cursor: not-allowed; }
  &.schedule-toggle { white-space: nowrap; }
`;

export const SearchActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  .schedule-controls {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 9px;
  }
  .schedule-controls > button {
    display: inline-flex;
    height: 33px;
    align-items: center;
    gap: 6px;
    border: 1px solid #e8e7f2;
    border-radius: 7px;
    background: #fff;
    padding: 0 9px;
    color: #6254c9;
    font-size: 9px;
    font-weight: 680;
    cursor: pointer;
  }
  .schedule-controls > button:disabled { cursor: not-allowed; opacity: 0.6; }
  .save-chevron { display: none; }
  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
    .schedule-controls { flex-wrap: wrap; justify-content: flex-start; }
  }
`;

export const SearchButton = styled.button`
  display: inline-flex;
  min-height: 35px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 0;
  border-radius: 7px;
  background: #7564e9;
  padding: 0 12px;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: background 150ms ease;
  &:hover:not(:disabled) { background: #6654dc; }
  &:disabled { cursor: not-allowed; opacity: 0.6; }
`;

export const SearchSelect = styled.select`
  height: 33px;
  border: 1px solid #e8eaf1;
  border-radius: 7px;
  background: #fff;
  padding: 0 8px;
  color: #777b8e;
  font-size: 9px;
  &:disabled { cursor: not-allowed; opacity: 0.55; }
`;

export const SearchStatus = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  border: 1px solid ${({ $state }) => (
    $state === 'error' ? '#f2d5d2' : $state === 'success' ? '#d9efe3' : '#e5e2fb'
  )};
  border-radius: 8px;
  background: ${({ $state }) => (
    $state === 'error' ? '#fff8f7' : $state === 'success' ? '#f6fcf8' : '#faf9ff'
  )};
  margin-top: 13px;
  padding: 11px 12px;
  color: ${({ $state }) => (
    $state === 'error' ? '#a3544b' : $state === 'success' ? '#488064' : '#7468b3'
  )};
  font-size: 9px;
  line-height: 1.5;
  > svg { flex: 0 0 auto; margin-top: 1px; }
  .spinning { animation: ${spin} 1s linear infinite; }
  p { margin: 5px 0 0 24px; }
  p[role="alert"] { color: #a3544b; }
`;

export const SearchStatusLine = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  strong { font-weight: 700; }
  span { margin-left: auto; color: #999cac; }
`;

export const SearchProgress = styled.div`
  display: grid;
  grid-template-columns: minmax(80px, 1fr) auto;
  align-items: center;
  gap: 9px;
  margin: 9px 0 0 23px;
  color: #999cac;
  font-size: 8px;
  @media (max-width: 500px) { grid-template-columns: 1fr; }
`;

export const SearchProgressTrack = styled.div`
  overflow: hidden;
  height: 5px;
  border-radius: 99px;
  background: #eceaf8;
  span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: #8070e9;
    transition: width 250ms ease;
  }
`;
