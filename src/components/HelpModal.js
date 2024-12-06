// src/components/HelpModal.js
import React from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton
} from '@coreui/react';
import { useLocation } from 'react-router-dom';
import { helpRegistry } from '../helpRegistry';
import { match } from 'path-to-regexp';

const HelpModal = ({ visible, onClose }) => {
  const location = useLocation();
  const currentPath = location.pathname + (location.search || '');

  let HelpComponent = null;

  for (const { pattern, component } of helpRegistry) {
    const matcher = match(pattern, { decode: decodeURIComponent });
    if (matcher(currentPath)) {
      HelpComponent = component;
      break;
    }
  }

  return (
    <CModal visible={visible} onClose={onClose} className="modal-lg">
      <CModalHeader closeButton>
        <CModalTitle>Ajuda</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {HelpComponent ? (
          <HelpComponent />
        ) : (
          "Nenhuma ajuda disponível para esta página."
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Fechar
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default HelpModal;
