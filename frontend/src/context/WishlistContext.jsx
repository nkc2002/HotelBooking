import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const getHotelId = (hotel) => hotel?.id || hotel?._id;

  const addToWishlist = (hotel) => {
    const hotelId = getHotelId(hotel);
    setWishlist((prev) => {
      if (!hotelId) {
        return prev;
      }

      if (prev.find((item) => getHotelId(item) === hotelId)) {
        return prev;
      }
      return [...prev, hotel];
    });
  };

  const removeFromWishlist = (hotelId) => {
    setWishlist((prev) => prev.filter((item) => getHotelId(item) !== hotelId));
  };

  const toggleWishlist = (hotel) => {
    const hotelId = getHotelId(hotel);
    if (!hotelId) return;

    if (isInWishlist(hotelId)) {
      removeFromWishlist(hotelId);
    } else {
      addToWishlist(hotel);
    }
  };

  const isInWishlist = (hotelId) => {
    return wishlist.some((item) => item.id === hotelId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlist.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;

