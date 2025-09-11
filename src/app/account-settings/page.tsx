'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  newsletter: boolean;
}

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const AccountSettingsPage: React.FC = () => {
  const { user, isLoading: isAuthLoading, resetPassword } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    newsletter: false
  });
  
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  
  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<{[key: string]: string}>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!isAuthLoading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      // Initialize profile with user data
      const initialProfile: UserProfile = {
        name: user.name,
        email: user.email,
        phone: '+91 9876543210', // Mock data
        dateOfBirth: '1990-01-01', // Mock data
        gender: 'male', // Mock data
        newsletter: true // Mock data
      };
      setProfile(initialProfile);
      setEditedProfile(initialProfile);

      // Mock addresses data
      const mockAddresses: Address[] = [
        {
          id: '1',
          type: 'home',
          fullName: user.name,
          phone: '+91 9876543210',
          addressLine1: '123 Main Street',
          addressLine2: 'Apt 4B',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India',
          isDefault: true
        },
        {
          id: '2',
          type: 'work',
          fullName: user.name,
          phone: '+91 9876543211',
          addressLine1: '456 Office Complex',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400050',
          country: 'India',
          isDefault: false
        }
      ];
      setAddresses(mockAddresses);
    }
  }, [user, isAuthLoading, router]);

  const handleProfileSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProfile(editedProfile);
    setIsEditing(false);
    setIsSaving(false);
    showSuccess('Profile updated successfully!');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password form
    const errors: {[key: string]: string} = {};
    
    // Note: The API only requires the new password, not the current password
    // But we can keep the current password field for better UX
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      // Call the reset password API
      // Note: The API doesn't verify the current password, it just sets a new one
      // In production, you might want to add an endpoint that verifies the current password first
      const result = await resetPassword(passwordForm.newPassword);
      
      if (result.success) {
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordErrors({});
        showSuccess(result.error || 'Password changed successfully!');
      } else {
        setPasswordErrors({ general: result.error || 'Failed to change password' });
      }
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordErrors({ general: 'An error occurred while changing password' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleAddressDelete = async (addressId: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAddresses(addresses.filter(addr => addr.id !== addressId));
      showSuccess('Address deleted successfully!');
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
    showSuccess('Default address updated!');
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (isAuthLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'profile'
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'addresses'
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Addresses
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'security'
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Security
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="space-x-3">
                        <button
                          onClick={() => {
                            setEditedProfile(profile);
                            setIsEditing(false);
                          }}
                          className="text-gray-600 hover:text-gray-800 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleProfileSave}
                          disabled={isSaving}
                          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-2 focus:ring-black focus:border-black' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-2 focus:ring-black focus:border-black' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-2 focus:ring-black focus:border-black' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={editedProfile.dateOfBirth}
                        onChange={(e) => setEditedProfile({...editedProfile, dateOfBirth: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-2 focus:ring-black focus:border-black' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        value={editedProfile.gender}
                        onChange={(e) => setEditedProfile({...editedProfile, gender: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-2 focus:ring-black focus:border-black' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="newsletter"
                        checked={editedProfile.newsletter}
                        onChange={(e) => setEditedProfile({...editedProfile, newsletter: e.target.checked})}
                        disabled={!isEditing}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700">
                        Subscribe to newsletter for exclusive offers
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Saved Addresses</h2>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      Add New Address
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">No saved addresses yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                                address.type === 'home' 
                                  ? 'bg-blue-100 text-blue-800'
                                  : address.type === 'work'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                              </span>
                              {address.isDefault && (
                                <span className="ml-2 inline-block px-2 py-1 text-xs font-medium bg-black text-white rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="space-x-2">
                              <button
                                onClick={() => setEditingAddress(address)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleAddressDelete(address.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-medium text-gray-900">{address.fullName}</p>
                            <p>{address.addressLine1}</p>
                            {address.addressLine2 && <p>{address.addressLine2}</p>}
                            <p>{address.city}, {address.state} {address.zipCode}</p>
                            <p>{address.country}</p>
                            <p>Phone: {address.phone}</p>
                          </div>
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="mt-3 text-sm text-gray-600 hover:text-gray-900 underline"
                            >
                              Set as default
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
                  
                  <form onSubmit={handlePasswordChange} className="max-w-md">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => {
                            setPasswordForm({...passwordForm, currentPassword: e.target.value});
                            setPasswordErrors({...passwordErrors, currentPassword: ''});
                          }}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black ${
                            passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {passwordErrors.currentPassword && (
                          <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => {
                            setPasswordForm({...passwordForm, newPassword: e.target.value});
                            setPasswordErrors({...passwordErrors, newPassword: ''});
                          }}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black ${
                            passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {passwordErrors.newPassword && (
                          <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => {
                            setPasswordForm({...passwordForm, confirmPassword: e.target.value});
                            setPasswordErrors({...passwordErrors, confirmPassword: ''});
                          }}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black ${
                            passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      {passwordErrors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                      )}
                    </div>
                    
                    {passwordErrors.general && (
                      <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                        {passwordErrors.general}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
                    >
                      {isChangingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                    </div>
                  </form>

                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                    <p className="text-gray-600 mb-4">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AccountSettingsPage;
