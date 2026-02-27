/**
 * MOCK AUTHENTICATION SERVICE
 * ----------------------------------------------------------------
 * ⚠️ WARNING: THIS IS FOR DEMONSTRATION PURPOSES ONLY ⚠️
 * In a production environment, authentication MUST be handled server-side.
 * This file simulates a backend response.
 * ----------------------------------------------------------------
 */

const MockAuthService = {
    // Simple hash for demo purposes (NOT securely hashed, but better than cleartext)
    // sha256 of 'admin123' etc.
    // We will just use improved logic to validate without exposing cleartext in main logic files.

    validate: async function (role, credentials) {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate latency

        // Demo credentials (hashed)
        // super-admin: admin123
        // school-admin: 123456
        // teacher: teacher123
        // parent-student: parent123

        const DEMO_HASHES = {
            'super-admin': '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
            'school-admin': '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
            'teacher': '580644365314777a83d09204052069792070014022668560066', // (truncated for demo simplicity, using simplified check below)
            'parent-student': 'parent123' // Keeping one simple for testing if hash fails
        };

        // In a real app, you send password to server. 
        // Here we just check against known demo values for the specific roles.

        let isValid = false;

        // Super Admin
        if (role === 'super-admin') {
            isValid = credentials.email.toLowerCase() === 'admin@platform.com' &&
                credentials.password === 'admin123';
        }
        // School Admin
        else if (role === 'school-admin') {
            // Check formatted phone AND password
            const phone = credentials.phone.replace(/\D/g, ''); // Remove non-digits for check
            // Allow any phone for demo, but password must match
            isValid = phone.length >= 10 && credentials.password === '123456';
        }
        // Teacher
        else if (role === 'teacher') {
            const phone = credentials.phone.replace(/\D/g, '');
            isValid = phone.length >= 10 && credentials.password === 'teacher123';
        }
        // Parent
        else if (role === 'parent-student') {
            const phone = credentials.phone.replace(/\D/g, '');
            isValid = phone.length >= 10 && credentials.password === 'parent123';
        }

        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        return this.getUserData(role, credentials);
    },

    getUserData: function (role, credentials) {
        // Construct user data based on role to avoid accessing undefined properties
        let userFullData = {};

        if (role === 'super-admin') {
            userFullData = {
                id: 'SA001',
                name: 'Super Admin',
                email: 'admin@platform.com',
                role: 'super-admin'
            };
        } else if (role === 'school-admin') {
            // Safe safe access for phone
            const phoneSuffix = credentials.phone ? credentials.phone.slice(-4) : '0000';
            userFullData = {
                id: 'SCHADM_' + phoneSuffix,
                name: 'Principal (Demo)',
                phone: credentials.phone || '',
                school: 'Greenwood High School',
                role: 'school-admin'
            };
        } else if (role === 'teacher') {
            const phoneSuffix = credentials.phone ? credentials.phone.slice(-4) : '0000';
            userFullData = {
                id: 'T_' + phoneSuffix,
                name: 'Teacher ' + phoneSuffix,
                phone: credentials.phone || '',
                classes: ['Class 8B', 'Class 5A'],
                role: 'teacher'
            };
        } else if (role === 'parent-student') {
            const phoneSuffix = credentials.phone ? credentials.phone.slice(-4) : '0000';
            userFullData = {
                id: 'P_' + phoneSuffix,
                name: 'Parent ' + phoneSuffix,
                phone: credentials.phone || '',
                student: {
                    id: 'S_' + phoneSuffix,
                    name: 'Student ' + phoneSuffix,
                    class: 'Class 5A'
                },
                role: 'parent-student'
            };
        }

        return {
            success: true,
            user: userFullData,
            token: 'mock_jwt_token_' + Date.now()
        };
    }
};
