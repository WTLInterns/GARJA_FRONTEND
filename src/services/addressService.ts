const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.mygarja.com';

export interface AddressRequest {
  steet: string;
  city: string;
  landmark: string;
  pincode: string;
  address: string;
}

export interface AddressResponse {
  id: number;
  steet: string;
  city: string;
  landmark: string;
  pincode: string;
  address: string;
}

class AddressService {
  private getAuthHeaders() {
    const token = localStorage.getItem('userToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async addAddress(addressData: AddressRequest): Promise<AddressResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/address/add`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to add address');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  }

  async getAllAddresses(): Promise<AddressResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/address/byUser`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch addresses');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  }

  async deleteAddress(addressId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/address/${addressId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }
}

export const addressService = new AddressService();
