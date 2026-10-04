import toast from 'react-hot-toast'
import api from '../config/api'
import { useApp } from '../context/AppContext'

const isFolderItem = (item) => item?.item_type === 'folder' || (!item?.mime_type && item?.path !== undefined)

export function useDrive() {
  const { fetchDriveContent, refreshUser, currentFolderId, isUploading, setIsUploading, uploadProgress, setUploadProgress } = useApp()

  const runAction = async (apiCall, successMessage, errorMessage, afterSuccess) => {
    try {
      const res = await apiCall
      if (successMessage) toast.success(successMessage)
      if (afterSuccess) await afterSuccess(res?.data)
      return true
    } catch (error) {
      toast.error(error?.response?.data?.error || errorMessage || 'Request failed')
      return false
    }
  }

  const uploadFiles = async (fileList, folder_id = currentFolderId) => {
    if (!fileList?.length) return

    setIsUploading(true)
    setUploadProgress(0)

    const totalSize = Array.from(fileList).reduce((acc, file) => acc + (file.size || 0), 0)
    const step = 92 / Math.max(12, totalSize / 409715.2)
    const interval = setInterval(() => {
      setUploadProgress((prev) => (prev >= 92 ? prev : Math.min(92, prev + step)))
    }, 100)

    const formData = new FormData()
    Array.from(fileList).forEach((file) => formData.append('files', file))
    if (folder_id) formData.append('folder_id', folder_id)

    try {
      const { data } = await api.post('/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      clearInterval(interval)
      setUploadProgress(100)
      await new Promise((resolve) => setTimeout(resolve, 300))
      toast.success(`${data.files.length} files uploaded successfully!`)
      await refreshUser()
      await fetchDriveContent(folder_id)
    } catch (error) {
      clearInterval(interval)
      toast.error(error?.response?.data?.error || 'File upload failed!')
    } finally {
      clearInterval(interval)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const createFolder = (name, parent_id = currentFolderId) => {
    return runAction(
      api.post('/api/folders', { name, parent_id }),
      'Folder created successfully!',
      'Failed to create folder!',
      () => fetchDriveContent(parent_id),
    )
  }

  const renameItem = (item, newName) => {
    const isFolder = isFolderItem(item)
    const endpoint = isFolder ? 'folders' : 'files'
    const id = item.id || item
    return runAction(
      api.patch(`/api/${endpoint}/${id}/rename`, { name: newName }),
      `${isFolder ? 'Folder' : 'File'} renamed.`,
      'Error renaming item.',
      () => fetchDriveContent(),
    )
  }

  const moveItem = (item, targetFolderId) => {
    const isFolder = isFolderItem(item)
    const endpoint = isFolder ? 'folders' : 'files'
    const payload = isFolder ? { target_parent: targetFolderId } : { target_folder: targetFolderId }
    const id = item.id || item
    return runAction(
      api.patch(`/api/${endpoint}/${id}/move`, payload),
      `${isFolder ? 'Folder' : 'File'} moved.`,
      'Error moving item.',
      () => fetchDriveContent(),
    )
  }

  const deleteItem = (item) => {
    const isFolder = isFolderItem(item)
    const endpoint = isFolder ? 'folders' : 'files'
    const id = item.id || item
    return runAction(
      api.delete(`/api/${endpoint}/${id}`),
      `${isFolder ? 'Folder' : 'File'} moved to Trash.`,
      'Error deleting item.',
      () => fetchDriveContent(),
    )
  }

  const restoreItem = (item) => {
    const isFolder = isFolderItem(item)
    const endpoint = isFolder ? 'folders' : 'files'
    const id = item.id || item
    return runAction(
      api.post(`/api/${endpoint}/${id}/restore`),
      `${isFolder ? 'Folder' : 'File'} restored.`,
      'Error restoring item.',
    )
  }

  const permanentDeleteItem = (item) => {
    const isFolder = isFolderItem(item)
    const endpoint = isFolder ? 'folders' : 'files'
    const id = item.id || item
    return runAction(
      api.delete(`/api/${endpoint}/${id}/permanent-delete`),
      `${isFolder ? 'Folder' : 'File'} permanently deleted.`,
      'Error deleting item.',
      () => refreshUser(),
    )
  }

  return {
    uploadFiles,
    createFolder,
    renameItem,
    moveItem,
    deleteItem,
    restoreItem,
    permanentDeleteItem,
    isUploading,
    uploadProgress,
  }
}