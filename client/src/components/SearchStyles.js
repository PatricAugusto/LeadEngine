import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const SearchSection = styled.section`
  min-width: 0;
`;

export const SearchCard = styled.div`
  border: 1px solid #252d39;
  border-radius: 10px;
  background: #121720;
  padding: 20px;
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
    background: #27213a;
    color: #b7a3ff;
  }
  h2 {
    margin: 0 0 4px;
    color: #e2e6ec;
    font-size: 15px;
    font-weight: 650;
  }
  p {
    margin: 0;
    color: #929daa;
    font-size: 12px;
    line-height: 1.5;
  }
`;

export const SearchNotice = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  border: 1px solid #40331f;
  border-radius: 7px;
  background: #211b13;
  margin: 16px 0;
  padding: 11px 12px;
  color: #d3b783;
  font-size: 11px;
  line-height: 1.55;
  svg { flex: 0 0 auto; margin-top: 1px; color: #e3b864; }
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
  .field-heading strong { color: #d0d6df; font-size: 12px; }
  .field-heading span { color: #8d98a6; font-size: 11px; }
  @media (max-width: 520px) {
    .field-heading { align-items: flex-start; flex-direction: column; }
  }
`;

export const StateGrid = styled.div`
  border: 1px solid #252d39;
  border-radius: 8px;
  background: #0f141b;
  padding: 12px;
  .select-all {
    display: flex;
    width: max-content;
    margin-bottom: 9px;
    color: #c4b5fd;
    font-weight: 650;
  }
  .states {
    display: grid;
    grid-template-columns: repeat(9, minmax(0, 1fr));
    gap: 7px;
    border-top: 1px solid #252d39;
    padding-top: 10px;
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
  color: #a4adba;
  font-size: 11px;
  cursor: pointer;
  input {
    width: 13px;
    height: 13px;
    margin: 0;
    accent-color: #a78bfa;
  }
  input:disabled { cursor: not-allowed; }
`;

export const SearchActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
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
  background: #8b6cf0;
  padding: 0 12px;
  color: #fff;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
  transition: background 150ms ease;
  &:hover:not(:disabled) { background: #9a7df5; }
  &:disabled { cursor: not-allowed; opacity: 0.6; }
`;

export const SearchStatus = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  border: 1px solid ${({ $state }) => (
    $state === 'error' ? '#493036' : $state === 'success' ? '#254337' : '#352d4d'
  )};
  border-radius: 8px;
  background: ${({ $state }) => (
    $state === 'error' ? '#21171c' : $state === 'success' ? '#14221d' : '#1a1725'
  )};
  margin-top: 13px;
  padding: 11px 12px;
  color: ${({ $state }) => (
    $state === 'error' ? '#f0a8a2' : $state === 'success' ? '#8bd0aa' : '#c4b5fd'
  )};
  font-size: 11px;
  line-height: 1.5;
  > svg { flex: 0 0 auto; margin-top: 1px; }
  .spinning { animation: ${spin} 1s linear infinite; }
  p { margin: 5px 0 0 24px; }
  p[role="alert"] { color: #f0a8a2; }
`;

export const SearchStatusLine = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  strong { font-weight: 700; }
  span { margin-left: auto; color: #8d98a6; }
`;

export const SearchProgress = styled.div`
  display: grid;
  grid-template-columns: minmax(80px, 1fr) auto;
  align-items: center;
  gap: 9px;
  margin: 9px 0 0 23px;
  color: #929daa;
  font-size: 10px;
  @media (max-width: 500px) { grid-template-columns: 1fr; }
`;

export const SearchProgressTrack = styled.div`
  overflow: hidden;
  height: 5px;
  border-radius: 99px;
  background: #2c2940;
  span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: #a78bfa;
    transition: width 250ms ease;
  }
`;
