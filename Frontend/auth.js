import { api } from './api.js';

const form = document.getElementById('authForm');
const errorElement = document.getElementById('error');
const page = document.body.dataset.auth;

function showError(message) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError() {
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function setLoading(isLoading) {
    const button = form?.querySelector('button[type="submit"]');

    if (!button) return;

    button.disabled = isLoading;

    if (page === 'login') {
        button.textContent = isLoading ? 'Logging in...' : 'Log In';
    }

    if (page === 'signup') {
        button.textContent = isLoading
            ? 'Creating...'
            : 'Create My Financial Twin';
    }
}


/* =========================
   LOGIN
========================= */

if (page === 'login') {

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        clearError();

        const email = form.email.value.trim();
        const password = form.password.value;

        if (!email || !password) {
            showError('Please enter email and password.');
            return;
        }

        try {
            setLoading(true);

            const result = await api.login({
                email,
                password
            });

            if (!result.token) {
                throw new Error('Login failed. No token received.');
            }

            console.log('Login successful');

            // Returning users should not repeat onboarding and create duplicate goals.
            window.location.href = localStorage.getItem('fintwin-onboarding')
                ? 'dashboard.html'
                : 'onboarding.html';

        } catch (error) {

            console.error('Login error:', error);

            showError(
                error.message || 'Login failed. Please try again.'
            );

        } finally {
            setLoading(false);
        }
    });


    // Password show / hide
    const togglePassword = document.getElementById('togglePassword');

    if (togglePassword) {

        togglePassword.addEventListener('click', () => {

            const passwordInput = document.getElementById('password');

            if (!passwordInput) return;

            if (passwordInput.type === 'password') {

                passwordInput.type = 'text';
                togglePassword.textContent = 'Hide';

            } else {

                passwordInput.type = 'password';
                togglePassword.textContent = 'Show';
            }
        });
    }
}


/* =========================
   SIGNUP
========================= */

if (page === 'signup') {

    form.addEventListener('submit', async (event) => {

        event.preventDefault();

        clearError();

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value;
        const confirmPassword = form.confirm.value;

        if (!name || !email || !password || !confirmPassword) {

            showError('Please fill in all fields.');
            return;
        }

        if (password.length < 6) {

            showError('Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {

            showError('Passwords do not match.');
            return;
        }

        try {

            setLoading(true);

            const result = await api.signup({
                name,
                email,
                password
            });

            if (!result.token) {
                throw new Error(
                    'Signup failed. No token received.'
                );
            }

            console.log('Signup successful');

            // Move to onboarding
            window.location.href = 'onboarding.html';

        } catch (error) {

            console.error('Signup error:', error);

            showError(
                error.message || 'Signup failed. Please try again.'
            );

        } finally {

            setLoading(false);
        }
    });


    // Password show / hide
    const togglePassword = document.getElementById('togglePassword');

    if (togglePassword) {

        togglePassword.addEventListener('click', () => {

            const passwordInput = document.getElementById('password');

            if (!passwordInput) return;

            if (passwordInput.type === 'password') {

                passwordInput.type = 'text';
                togglePassword.textContent = 'Hide';

            } else {

                passwordInput.type = 'password';
                togglePassword.textContent = 'Show';
            }
        });
    }


    // Password strength
    const passwordInput = document.getElementById('password');
    const strengthElement = document.getElementById('passwordStrength');

    if (passwordInput && strengthElement) {

        passwordInput.addEventListener('input', () => {

            const password = passwordInput.value;

            if (password.length === 0) {

                strengthElement.textContent = '';

            } else if (password.length < 6) {

                strengthElement.textContent = 'Weak';

            } else if (password.length < 10) {

                strengthElement.textContent = 'Medium';

            } else {

                strengthElement.textContent = 'Strong';
            }
        });
    }
}
