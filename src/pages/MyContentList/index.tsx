import React from 'react';
import { useLocation } from 'react-router-dom';
import CardList from './CardList';
import TableList from './TableList';

const useLayout = () => {
  const { search } = useLocation();
  return (new URLSearchParams(search)).get('layout');
}

export default function MyContentList() {
  const layout = useLayout();
  return (
    layout === 'card' ? <CardList /> : <TableList />
  )
}