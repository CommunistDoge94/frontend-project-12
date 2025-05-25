import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">404</h1>
      <p className="lead">{t('notFound')}</p>
      <Link to="/" className="btn btn-outline-primary mt-3">{t('goHome')}</Link>
    </div>
  );
};

export default NotFoundPage;
