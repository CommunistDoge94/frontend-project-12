import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../hooks/useModal';

const ChannelItem = ({ channel, isActive, onClick }) => {
  const { t } = useTranslation();
  const { openModal } = useModal();

  const handleRename = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openModal('renameChannel', { channelId: channel.id, channelName: channel.name });
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openModal('removeChannel', { channelId: channel.id });
  };

  return (
    <li
      className={`list-group-item d-flex justify-content-between align-items-center ${isActive ? 'active' : ''}`}
      role="button"
      onClick={onClick}
      data-testid={`channel-${channel.name}`}
    >
      <button
        type="button"
        className="btn p-0 w-100 text-start fw-bold"
        aria-label={`Канал ${channel.name}`}
      >
        # {channel.name}
      </button>

      {channel.removable && (
        <Dropdown onClick={(e) => e.stopPropagation()}>
          <Dropdown.Toggle
            variant="secondary"
            size="sm"
            className="p-1"
            aria-label={t('chatPage.channelSettings')}
          >
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleRename}>{t('chatPage.rename')}</Dropdown.Item>
            <Dropdown.Item onClick={handleRemove}>{t('chatPage.remove')}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </li>
  );
};

export default ChannelItem;
