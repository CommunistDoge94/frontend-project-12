import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import useModal from '../../hooks/useModal'

const ChannelItem = ({ channel, isActive, onClick }) => {
  const { t } = useTranslation()
  const { openModal } = useModal()

  const handleRename = e => {
    e.preventDefault()
    e.stopPropagation()
    openModal('renameChannel', { channelId: channel.id, channelName: channel.name })
  }

  const handleRemove = e => {
    e.preventDefault()
    e.stopPropagation()
    openModal('removeChannel', { channelId: channel.id })
  }

  return (
    <li className="list-group-item p-0">
      <div className={`d-flex justify-content-between align-items-center ${isActive ? 'bg-primary-subtle' : ''} py-2`}>
        <button
          type="button"
          className="btn p-0 border-0 text-start w-100 text-body fw-bold text-decoration-none text-truncate"
          aria-label={`Канал ${channel.name}`}
          onClick={onClick}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onClick()
            }
          }}
        >
          #
          {' '}
          {channel.name}
        </button>
        {channel.removable && (
          <Dropdown onClick={e => e.stopPropagation()}>
            <Dropdown.Toggle
              variant="secondary"
              size="sm"
              className="p-1 d-flex align-items-center justify-content-center"
              aria-label={t('chatPage.channelSettings')}
            >
              <span className="visually-hidden">{t('chatPage.channelSettings')}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleRename}>{t('chatPage.rename')}</Dropdown.Item>
              <Dropdown.Item onClick={handleRemove}>{t('chatPage.remove')}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
    </li>
  )
}

export default ChannelItem
