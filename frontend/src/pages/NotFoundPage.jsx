import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="container text-center mt-5">
    <h1 className="display-4">404</h1>
    <p className="lead">Ой-ой-ой! Страница не найдена.</p>
    <Link to="/" className="btn btn-outline-primary mt-3">На главную</Link>
  </div>
);

export default NotFoundPage;
