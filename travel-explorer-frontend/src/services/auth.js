const API_BASE_URL = 'http://localhost:5000/api';

export const authService = {
    // ... existing login, logout, register functions ...

    // Submit feedback
    async submitFeedback(feedbackData) {
        try {
            console.log('🔄 Submitting feedback:', feedbackData);
            
            const response = await fetch(`${API_BASE_URL}/auth/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackData),
                credentials: 'include'
            });

            const data = await response.json();
            console.log('📨 Feedback response:', data);

            if (!response.ok) {
                throw new Error(data.message || `Failed to submit feedback: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('❌ Feedback submission error:', error);
            throw new Error(error.message || 'Network error while submitting feedback');
        }
    },

    // Update user profile
    async updateProfile(profileData) {
        try {
            const response = await fetch(`${API_BASE_URL}/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
                credentials: 'include'
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }

            return data;
        } catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    },

    // Get user profile
    async getProfile() {
        try {
            const response = await fetch(`${API_BASE_URL}/user/profile`, {
                credentials: 'include'
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch profile');
            }

            return data;
        } catch (error) {
            console.error('Profile fetch error:', error);
            throw error;
        }
    }
};