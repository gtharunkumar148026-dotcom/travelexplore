import React from 'react';
import Favorites from '../components/user/Favorites';
import ProfessionalHeader from '../components/common/ProfessionalHeader';
import Footer from '../components/common/Footer';

const FavoritesPage = () => {
  return (
    <div className="favorites-page">
      <ProfessionalHeader />
      <main className="main-content">
        <Favorites />
      </main>
      <Footer />
    </div>
  );
};

export default FavoritesPage;