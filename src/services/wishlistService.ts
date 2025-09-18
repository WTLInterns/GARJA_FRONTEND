import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085';

// Wishlist interfaces based on API response
export interface WishlistItem {
  id: number;           // maps from id or wishlistId
  userId?: number;      // optional depending on API
  productId: number;
  productName: string;
  price: string;        // maps from price or productPrice
  imageUrl: string;     // maps from imageUrl or productImage
  category?: string;    // optional
  dateAdded: string;    // provide fallback if not present
}

class WishlistService {
  // Helper to get auth token and user ID
  private getAuthInfo() {
    const token = localStorage.getItem('userToken');
    const userDataStr = localStorage.getItem('user');
    
    if (!token || !userDataStr) {
      throw new Error('Authentication required');
    }
    
    const userData = JSON.parse(userDataStr);
    
    return {
      token,
      userId: userData.id || userData.userId,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  // Add product to wishlist
  async addToWishlist(productId: number): Promise<string> {
    try {
      const { userId, headers } = this.getAuthInfo();
      const response = await axios.post(
        `${API_URL}/user/wishlist/${userId}/${productId}`,
        {},
        { headers }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error adding to wishlist:', error);
      if (error.response?.status === 401) {
        throw new Error('Please login to add items to wishlist');
      }
      if (error.response?.status === 409) {
        throw new Error('Item already in wishlist');
      }
      throw new Error(error.response?.data || 'Failed to add item to wishlist');
    }
  }

  // Remove product from wishlist by product ID
  async removeFromWishlistByProductId(productId: number): Promise<string> {
    try {
      const { userId, headers } = this.getAuthInfo();
      const response = await axios.delete(
        `${API_URL}/user/wishlist/${userId}/${productId}`,
        { headers }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      if (error.response?.status === 401) {
        throw new Error('Please login to modify wishlist');
      }
      throw new Error(error.response?.data || 'Failed to remove item from wishlist');
    }
  }

  // Remove from wishlist by wishlist item ID
  async removeFromWishlist(wishlistId: number): Promise<string> {
    try {
      const { headers } = this.getAuthInfo();
      const response = await axios.delete(
        `${API_URL}/user/wishlist/${wishlistId}`,
        { headers }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      if (error.response?.status === 401) {
        throw new Error('Please login to modify wishlist');
      }
      throw new Error(error.response?.data || 'Failed to remove item from wishlist');
    }
  }

  // Get user's wishlist
  async getWishlist(): Promise<WishlistItem[]> {
    try {
      const { userId, headers } = this.getAuthInfo();
      const response = await axios.get(
        `${API_URL}/user/wishlist/user/${userId}`,
        { headers }
      );
      const data = Array.isArray(response.data) ? response.data : [];
      // Normalize different possible shapes into WishlistItem
      const normalized: WishlistItem[] = data.map((raw: any) => {
        const id = Number(raw.id ?? raw.wishlistId);
        const productId = Number(raw.productId);
        const productName = String(raw.productName ?? raw.name ?? '');
        const imageUrl = String(raw.imageUrl ?? raw.productImage ?? '');
        const priceStr = String(raw.price ?? raw.productPrice ?? '0');
        const category = raw.category ? String(raw.category) : undefined;
        const dateAdded = raw.dateAdded ? String(raw.dateAdded) : new Date().toISOString();
        return {
          id,
          userId: raw.userId ? Number(raw.userId) : undefined,
          productId,
          productName,
          imageUrl,
          price: priceStr,
          category,
          dateAdded,
        } as WishlistItem;
      });
      return normalized;
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);
      if (error.response?.status === 401) {
        throw new Error('Please login to view wishlist');
      }
      // Return empty array if no wishlist exists
      if (error.response?.status === 404) {
        return [];
      }
      throw new Error(error.response?.data || 'Failed to fetch wishlist');
    }
  }

  // Check if product is in wishlist
  async isProductInWishlist(productId: number): Promise<boolean> {
    try {
      const wishlist = await this.getWishlist();
      return wishlist.some(item => item.productId === productId);
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  }

  

  // Get wishlist count
  async getWishlistCount(): Promise<number> {
    try {
      const wishlist = await this.getWishlist();
      return wishlist.length;
    } catch (error) {
      console.error('Error getting wishlist count:', error);
      return 0;
    }
  }

  // Toggle product in wishlist (add if not present, remove if present)
  async toggleWishlist(productId: number): Promise<{ action: 'added' | 'removed', message: string }> {
    try {
      const isInWishlist = await this.isProductInWishlist(productId);
      
      if (isInWishlist) {
        const message = await this.removeFromWishlistByProductId(productId);
        return { action: 'removed', message };
      } else {
        const message = await this.addToWishlist(productId);
        return { action: 'added', message };
      }
    } catch (error: any) {
      console.error('Error toggling wishlist:', error);
      throw error;
    }
  }

  // Clear entire wishlist (may need backend endpoint)
  async clearWishlist(): Promise<void> {
    try {
      const wishlist = await this.getWishlist();
      // Remove each item individually
      await Promise.all(
        wishlist.map(item => this.removeFromWishlist(item.id))
      );
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw new Error('Failed to clear wishlist');
    }
  }
}

export const wishlistService = new WishlistService();
