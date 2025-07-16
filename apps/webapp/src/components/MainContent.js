import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
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

const UploadBox = styled.label`
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

  input {
    display: none;
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

  &:disabled {
    background-color: #2e2e33;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  margin-top: 20px;
  font-weight: 500;
`;

const FileName = styled.p`
  margin-top: 20px;
  color: #B0B0B0;
  font-weight: 500;
`;

const MenuButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #444;
  color: #E0E0E0;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #666;
  }
`;

const MainContent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Proszę wybrać plik.");
      return;
    }

    setUploading(true);
    setError(null);

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1];

      try {
        const payload = JSON.stringify({ image: base64Image });

        const response = await fetch('http://127.0.0.1:8000/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: payload,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Wystąpił błąd podczas wysyłania zdjęcia.');
        }

        const data = await response.json();

        navigate('/results', {
          state: {
            serverResponses: data,
            originalImageBase64: base64Image
          }
        });

      } catch (err) {
        console.error('Błąd wysyłania:', err);
        setError(err.message || 'Nie udało się wysłać zdjęcia.');
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = () => {
      setError("Nie udało się odczytać pliku.");
      setUploading(false);
    };

    reader.readAsDataURL(selectedFile);
  };

  return (
    <MainContainer>
      <TopBar>
        <FiSearch />
        <FiUser />
      </TopBar>
      <ContentWrapper>
        <Title>Prześlij zdjęcie banknotu</Title>
        <UploadBox>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <UploadIconWrapper>
            <FiUpload size={28} color="#B0B0B0" />
          </UploadIconWrapper>
          <UploadFooter>
            <p>Kliknij, aby wybrać plik</p>
          </UploadFooter>
        </UploadBox>

        {selectedFile && <FileName>Wybrany plik: {selectedFile.name}</FileName>}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <UploadButton onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Wysyłanie...' : 'Wyślij'}
        </UploadButton>

      </ContentWrapper>
    </MainContainer>
  );
};

export default MainContent;
