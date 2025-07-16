// src/components/RecognitionPanel.js
import React from 'react';
import styled from 'styled-components';
import banknoteImage from '../assets/banknote-image.png';

const PanelContainer = styled.div`
  width: 350px;
  background-color: #25252A;
  padding: 20px;
  border-left: 1px solid #3A3A40;
`;

const PanelHeader = styled.h2`
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 20px;
`;

const BanknoteImage = styled.img`
  width: 100%;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const ResultItem = styled.div`
  margin-bottom: 25px;
`;

const ResultLabel = styled.p`
  color: #A0A0A0;
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

const ResultValue = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #E0E0E0;
`;

const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
`;


const RecognitionPanel = () => {
  return (
    <PanelContainer>
      <PanelHeader>Rozpoznany banknot</PanelHeader>
      <BanknoteImage src={banknoteImage} alt="Rozpoznany banknot" />
      
      <ResultRow>
        <ResultItem>
          <ResultLabel>Waluta</ResultLabel>
          <ResultValue>PLN</ResultValue>
        </ResultItem>
        <ResultItem>
          <ResultLabel>Nominał</ResultLabel>
          <ResultValue>50,00</ResultValue>
        </ResultItem>
      </ResultRow>
    </PanelContainer>

  );
};

export default RecognitionPanel;