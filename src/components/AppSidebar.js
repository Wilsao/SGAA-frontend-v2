// components/AppSidebar.js
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// Importa a ação 'set' do Redux Toolkit
import { set } from '../store'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.ui.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.ui.sidebarShow)

  const handleVisibleChange = (visible) => {
    dispatch(set({ sidebarShow: visible })) // Usando ação do Redux Toolkit
  }

  const handleToggleSidebar = () => {
    dispatch(set({ sidebarShow: false })) // Usando ação do Redux Toolkit
  }

  const handleToggleUnfoldable = () => {
    dispatch(set({ sidebarUnfoldable: !unfoldable })) // Usando ação do Redux Toolkit
  }

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={handleVisibleChange}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={handleToggleSidebar}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler onClick={handleToggleUnfoldable} />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
