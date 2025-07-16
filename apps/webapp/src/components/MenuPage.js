// src/components/MenuPage.js
import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import RecognitionPanel from './RecognitionPanel';
import GlobalStyles from './GlobalStyles';

const AppContainer = styled.div`
  display: flex;
  width: 1200px;
  height: 700px;
  background-color: #1A1A1D;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

function MenuPage() {
  return (
    <>
      <GlobalStyles />
      <AppContainer>
        <Sidebar />
        <MainContent />
        <RecognitionPanel />
      </AppContainer>
    </>
  );
}

export default MenuPage;