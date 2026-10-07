import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import CreateFolderModal from '../folders/CreateFolderModal'

const dashboardLayout = () => {

    const [isMobileOpen, setIsMobileOpen] = React.useState(false)
    const [isCreateFolderOpen, setIsCreateFolderOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col" >
        {/* Sidebar */}
        <Sidebar isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen} onCreateFolderClick={()=> setIsCreateFolderOpen(true)}/>

        {/* Main Content */}
        <div className="md:pl-64 flex flex-col flex-1" >
            {/* Header */}
            <Header onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />

            <main className="flex-1 p-4 md:p-6 overflow-y-auto" >
                <Outlet />
            </main>
        </div>

        {/* Create Folder Modal */}
        <CreateFolderModal isOpen={isCreateFolderOpen} onClose={()=> setIsCreateFolderOpen(false)} />
    </div>
  )
}

export default dashboardLayout