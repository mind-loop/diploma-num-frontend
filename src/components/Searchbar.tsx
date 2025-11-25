// src/components/SearchBar.tsx
import React, { useState } from 'react';
import { TextInput, Button, Group } from '@mantine/core';
import { IconSearch, IconAdjustmentsHorizontal } from '@tabler/icons-react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Хайлт хийх..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchClick = () => {
    onSearch(searchTerm);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <Group gap="sm" wrap="nowrap" className="w-full max-w-md">
      <TextInput
        placeholder={placeholder}
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
        rightSection={
            <IconSearch 
                size={18} 
                className="text-gray-500 cursor-pointer hover:text-blue-500 transition" 
                onClick={handleSearchClick}
            />
        }
        radius="md"
        size="md"
        className="flex-grow"
      />
    </Group>
  );
};

export default SearchBar;