import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadLocationHierarchy, getDistricts, getBlocks, getGramPanchayats, getVillages } from '../services/locationService';

const GeoScopeContext = createContext();

export const GeoScopeProvider = ({ children }) => {
  const [hierarchyData, setHierarchyData] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedGp, setSelectedGp] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLocationHierarchy().then(data => {
      setHierarchyData(data);
      setIsLoading(false);
    });
  }, []);

  const districts = getDistricts(hierarchyData);
  const blocks = selectedDistrict ? getBlocks(hierarchyData, selectedDistrict) : [];
  const gramPanchayats = selectedBlock ? getGramPanchayats(hierarchyData, selectedDistrict, selectedBlock) : [];
  const villages = selectedGp ? getVillages(hierarchyData, selectedDistrict, selectedBlock, selectedGp) : [];

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    setSelectedBlock('');
    setSelectedGp('');
    setSelectedVillage('');
  };

  const handleBlockChange = (block) => {
    setSelectedBlock(block);
    setSelectedGp('');
    setSelectedVillage('');
  };

  const handleGpChange = (gp) => {
    setSelectedGp(gp);
    setSelectedVillage('');
  };

  const handleVillageChange = (village) => {
    setSelectedVillage(village);
  };

  const resetScope = () => {
    setSelectedDistrict('');
    setSelectedBlock('');
    setSelectedGp('');
    setSelectedVillage('');
  };

  return (
    <GeoScopeContext.Provider
      value={{
        hierarchyData,
        districts,
        blocks,
        gramPanchayats,
        villages,
        selectedDistrict,
        selectedBlock,
        selectedGp,
        selectedVillage,
        handleDistrictChange,
        handleBlockChange,
        handleGpChange,
        handleVillageChange,
        resetScope,
        isLoading
      }}
    >
      {children}
    </GeoScopeContext.Provider>
  );
};

export const useGeoScope = () => useContext(GeoScopeContext);
