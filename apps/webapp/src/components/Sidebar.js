import React from 'react';
import styled from 'styled-components';
import { FiSettings, FiChevronDown } from 'react-icons/fi';
import banknoteImage from '../assets/banknote-image.png'; // przykładowy obraz

const SidebarContainer = styled.div`
  width: 280px;
  background-color: #25252A;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  font-size: 1.2rem;
  font-weight: bold;

  svg {
    margin-right: 10px;
  }
`;

const HistoryTitle = styled.h2`
  font-size: 1rem;
  font-weight: 500;
  color: #B0B0B0;
  margin-bottom: 20px;
`;

const ScanHistoryList = styled.ul`
  list-style: none;
  flex-grow: 1;
`;

const ScanItem = styled.li`
  display: flex;
  align-items: center;
  padding: 12px 10px;
  margin-bottom: 8px;
  border-radius: 8px;
  background-color: ${props => props.active ? '#3A3A40' : 'transparent'};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3A3A40;
  }
`;

const BanknoteThumbnail = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 12px;
`;

const ScanInfo = styled.div`
  flex-grow: 1;
`;

const ScanName = styled.p`
  font-weight: 500;
  color: #E0E0E0;
`;

const ScanDate = styled.p`
  font-size: 0.8rem;
  color: #A0A0A0;
`;

const ActionIcons = styled.div`
  display: flex;
  align-items: center;
  color: #A0A0A0;

  svg {
    margin-left: 8px;
  }
`;

// Możesz dynamicznie przypisywać różne obrazy tutaj
const scanHistoryData = [
  { name: '50 PLN', date: '12.07.2025 14:35', active: true, image: banknoteImage },
  { name: '100 EUR', date: '11.07.2025 11:10', image: banknoteImage },
  { name: '100 EUR', date: '11.07.2025 10:35', image: banknoteImage },
  { name: '20 USD', date: '11.07.2025 9:54', image: banknoteImage },
  { name: '200 TRY', date: '08.05.2025 22:00', image: banknoteImage },
  { name: '50 USD', date: '01.05.2025 1:00', image: banknoteImage },
  { name: '10 PLN', date: '01.05.2025 12:33', image: banknoteImage },
  { name: '500 PLN', date: '10.03.2025 21:37', image: banknoteImage },
];

const Sidebar = () => {
  return (
    <SidebarContainer>
      <Header>
        <FiSettings /> Ostatnie rozpoznania
      </Header>
      <HistoryTitle>Historia</HistoryTitle>
      <ScanHistoryList>
        {scanHistoryData.map((item, index) => (
          <ScanItem key={index} active={item.active}>
            <BanknoteThumbnail src={item.image} alt={item.name} />
            <ScanInfo>
              <ScanName>{item.name}</ScanName>
              <ScanDate>{item.date}</ScanDate>
            </ScanInfo>
            <ActionIcons>
              <FiChevronDown />
            </ActionIcons>
          </ScanItem>
        ))}
      </ScanHistoryList>
    </SidebarContainer>
  );
};

export default Sidebar;
