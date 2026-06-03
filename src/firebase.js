// 🔥 Firebase is being decommissioned in favor of MongoDB Atlas.
// This file serves as a dummy bridge during the migration to prevent import errors.

export const auth = {
    onAuthStateChanged: () => {},
    signOut: () => Promise.resolve(),
    currentUser: null
};

export const db = {};
export const storage = {};

export default {
    apps: []
};
