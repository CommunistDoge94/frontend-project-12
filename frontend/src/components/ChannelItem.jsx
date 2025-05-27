import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { openModal } from '../slices/modalSlice';

const ChannelItem = ({ channel, isActive, onClick }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleRename = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      openModal({
        type: 'renameChannel',
        extra: { channelId: channel.id, channelName: channel.name },
      })
    );
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(openModal({ type: 'removeChannel', extra: { channelId: channel.id }}));
  };

  return (
    <li
      className={`list-group-item d-flex justify-content-between align-items-center ${
        isActive ? 'active' : ''
      }`}
      role="button"
      onClick={onClick}
      data-testid={`channel-${channel.name}`}
    >
      <button 
        type="button"
        className="btn btn-link p-0 border-0 text-start w-100"
        aria-label={`Канал ${channel.name}`}
      >
        # {channel.name}
      </button>
      {channel.removable && (
        <Dropdown onClick={(e) => e.stopPropagation()}>
          <Dropdown.Toggle 
            variant="link" 
            size="sm" 
            className="p-0 text-decoration-none"
            aria-label="Управление каналом"
            data-testid={`channel-menu-${channel.id}`} // Добавляем явный тестовый идентификатор
          >
            <span aria-hidden="true">⋮</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item 
              onClick={handleRename}
              data-testid="rename-channel"
            >
              {t('chatPage.rename')}
            </Dropdown.Item>
            <Dropdown.Item 
              onClick={handleRemove}
              data-testid="remove-channel"
            >
              {t('chatPage.remove')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </li>
  );
};

export default ChannelItem;
