import React from 'react';
import styled from 'styled-components';
import { FiUpload, FiSearch, FiUser } from 'react-icons/fi';

const MainContainer = styled.main`
  flex-grow: 1;
  padding: 20px;
  background-color: #1A1A1D;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 60px;

  svg {
    font-size: 1.4rem;
    color: #B0B0B0;
    margin-left: 20px;
    cursor: pointer;
  }
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 40px;
`;

const Title = styled.h3`
  color: #E0E0E0;
  margin-bottom: 20px;
  text-align: center;
  font-size: 35px;
`;

const UploadBox = styled.div`
  width: 350px;
  height: 180px;
  border: 2px dashed #4A4A52;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 30px;
  padding-bottom: 30px;
  cursor: pointer;
  transition: border-color 0.2s;
  margin-top: 60px;

  &:hover {
    border-color: #6A6A72;
  }
`;

const UploadIconWrapper = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;

const UploadFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;

  p {
    margin-top: 80px;
    color: #B0B0B0;
  }
`;

const UploadButton = styled.button`
  margin-top: 40px;
  padding: 10px 20px;
  background-color: #3A3A40;
  color: #E0E0E0;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #505057;
  }
`;

const MainContent = () => {
  return (
    <MainContainer>
      <TopBar>
        <FiSearch />
        <FiUser />
      </TopBar>
      <ContentWrapper>
        <Title>Prześlij zdjęcie banknotu</Title>
        <UploadBox>
          <UploadIconWrapper>
            <FiUpload size={28} color="#B0B0B0" />
          </UploadIconWrapper>
          <UploadFooter>
            <p>Prześlij zdjęcie banknotu</p>
          </UploadFooter>
        </UploadBox>
        <UploadButton>Prześlij plik</UploadButton>
      </ContentWrapper>
    </MainContainer>
  );
};

export default MainContent;
